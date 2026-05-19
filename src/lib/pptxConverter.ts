import { WorkerBrowserConverter, createWasmPaths } from "@matbee/libreoffice-converter/browser";
import { mergePdfs } from "@/lib/pdfConverter";

type BrowserConverter = InstanceType<typeof WorkerBrowserConverter>;

let converterPromise: Promise<BrowserConverter> | null = null;

export async function getPresentationEngine(onProgress?: (progress: number) => void): Promise<BrowserConverter> {
  if (converterPromise) return converterPromise;

  converterPromise = (async () => {
    const converter = new WorkerBrowserConverter({
      ...createWasmPaths("/wasm/"),
      browserWorkerJs: "/libreoffice/browser.worker.global.js",
      onProgress: (info) => {
        onProgress?.(Math.max(2, Math.min(35, Math.round(info.percent * 0.35))));
      },
    });

    await converter.initialize();
    return converter;
  })();

  return converterPromise;
}

export async function convertPptxToPdf(
  file: File,
  quality: number,
  onProgress: (progress: number) => void,
): Promise<Blob> {
  const converter = await getPresentationEngine(onProgress);
  onProgress(40);

  const result = await converter.convert(
    await file.arrayBuffer(),
    {
      inputFormat: "pptx",
      outputFormat: "pdf",
      pdf: { quality: Math.round(quality * 100) },
    },
    file.name,
  );

  onProgress(100);
  return new Blob([result.data.buffer as ArrayBuffer], { type: "application/pdf" });
}

export async function convertPptxFilesToMergedPdf(
  files: File[],
  quality: number,
  onProgress: (progress: number) => void,
): Promise<Blob> {
  const convertedPdfs: File[] = [];

  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    const baseProgress = Math.round((index / Math.max(files.length, 1)) * 55);
    const pdfBlob = await convertPptxToPdf(file, quality, (progress) => {
      onProgress(Math.min(60, baseProgress + Math.round(progress / Math.max(files.length, 1) * 0.55)));
    });
    convertedPdfs.push(new File([pdfBlob], file.name.replace(/\.[^.]+$/, ".pdf"), { type: "application/pdf" }));
    onProgress(Math.round(((index + 1) / Math.max(files.length, 1)) * 80));
  }

  onProgress(80);
  const merged = await mergePdfs(convertedPdfs);
  onProgress(100);
  return merged;
}
