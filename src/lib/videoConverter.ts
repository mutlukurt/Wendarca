import type { FFmpeg } from "@ffmpeg/ffmpeg";
import type { MaxVideoWidth, VideoConversionOptions, VideoQuality } from "@/types/conversion";
import { getFileExtension, replaceExtension } from "@/lib/fileUtils";

let ffmpegInstance: FFmpeg | null = null;
let loadingPromise: Promise<FFmpeg> | null = null;

export async function getVideoEngine(): Promise<FFmpeg> {
  if (ffmpegInstance) return ffmpegInstance;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    const { FFmpeg } = await import("@ffmpeg/ffmpeg");

    const ffmpeg = new FFmpeg();
    const baseURL = "/ffmpeg-core";

    // The ffmpeg core is served from public/ffmpeg-core to avoid CDN CORS
    // failures in privacy-first local conversion flows.
    await ffmpeg.load({
      coreURL: `${baseURL}/ffmpeg-core.js`,
      wasmURL: `${baseURL}/ffmpeg-core.wasm`,
    });

    ffmpegInstance = ffmpeg;
    return ffmpeg;
  })();

  return loadingPromise;
}

export async function convertVideoToWebM(
  file: File,
  options: VideoConversionOptions,
  onProgress: (progress: number) => void,
): Promise<Blob> {
  const [{ fetchFile }, ffmpeg] = await Promise.all([import("@ffmpeg/util"), getVideoEngine()]);
  const inputExtension = getFileExtension(file.name) || "input";
  const inputName = `input-${crypto.randomUUID()}.${inputExtension}`;
  const outputName = replaceExtension(inputName, "webm");

  const progressHandler = ({ progress }: { progress: number }) => {
    if (Number.isFinite(progress)) {
      onProgress(Math.max(5, Math.min(98, Math.round(progress * 100))));
    }
  };
  const logHandler = ({ message }: { message: string }) => {
    if (process.env.NODE_ENV !== "production") {
      console.debug(`[ffmpeg] ${message}`);
    }
  };

  ffmpeg.on("progress", progressHandler);
  ffmpeg.on("log", logHandler);

  try {
    await ffmpeg.writeFile(inputName, await fetchFile(file));
    onProgress(8);
    await ffmpeg.exec(buildVideoArgs(inputName, outputName, options));
    let data = await ffmpeg.readFile(outputName);
    let bytes = typeof data === "string" ? new TextEncoder().encode(data) : new Uint8Array(data);

    if (options.quality !== "higher" && bytes.byteLength > file.size * 0.85) {
      await ffmpeg.deleteFile(outputName).catch(() => undefined);
      onProgress(12);
      await ffmpeg.exec(buildVideoArgs(inputName, outputName, { quality: "smaller", maxWidth: "720" }, true));
      data = await ffmpeg.readFile(outputName);
      bytes = typeof data === "string" ? new TextEncoder().encode(data) : new Uint8Array(data);
    }

    onProgress(100);
    return new Blob([bytes.buffer as ArrayBuffer], { type: "video/webm" });
  } finally {
    ffmpeg.off("progress", progressHandler);
    ffmpeg.off("log", logHandler);
    await Promise.allSettled([ffmpeg.deleteFile(inputName), ffmpeg.deleteFile(outputName)]);
  }
}

function buildVideoArgs(inputName: string, outputName: string, options: VideoConversionOptions, forceSmall = false): string[] {
  const args = [
    "-i",
    inputName,
    "-map",
    "0:v:0",
    "-map",
    "0:a?",
    "-sn",
    "-c:v",
    "libvpx",
    "-b:v",
    videoBitrateForQuality(options.quality, forceSmall),
    "-crf",
    crfForQuality(options.quality, forceSmall),
    "-deadline",
    "realtime",
    "-cpu-used",
    "8",
    "-threads",
    "4",
    "-c:a",
    "libopus",
    "-b:a",
    audioBitrateForQuality(options.quality, forceSmall),
  ];

  const scale = scaleFilter(options.maxWidth);
  if (scale) {
    args.push("-vf", scale);
  }

  args.push(outputName);
  return args;
}

function crfForQuality(quality: VideoQuality, forceSmall: boolean): string {
  if (forceSmall) return "44";
  if (quality === "smaller") return "42";
  if (quality === "higher") return "24";
  return "34";
}

function videoBitrateForQuality(quality: VideoQuality, forceSmall: boolean): string {
  if (forceSmall) return "550k";
  if (quality === "smaller") return "700k";
  if (quality === "higher") return "2400k";
  return "1200k";
}

function audioBitrateForQuality(quality: VideoQuality, forceSmall: boolean): string {
  if (forceSmall || quality === "smaller") return "96k";
  if (quality === "higher") return "160k";
  return "128k";
}

function scaleFilter(maxWidth: MaxVideoWidth): string | null {
  if (maxWidth === "original") return null;
  return `scale='min(${maxWidth},iw)':-2`;
}
