import type { ImageConversionOptions } from "@/types/conversion";
import type { HeicOutputFormat, RasterOutputFormat } from "@/types/conversion";

export async function convertImageToWebP(
  file: File,
  options: ImageConversionOptions,
): Promise<Blob> {
  const bitmap = await loadBitmap(file);
  const sourceWidth = bitmap.width;
  const sourceHeight = bitmap.height;
  const canvas = document.createElement("canvas");

  const context = canvas.getContext("2d");
  if (!context) {
    closeBitmap(bitmap);
    throw new Error("Canvas is not available in this browser.");
  }

  try {
    if (!options.targetSizeKb) {
      return await renderWebP(canvas, context, bitmap, sourceWidth, sourceHeight, options.quality);
    }

    return await renderToTargetSize({
      canvas,
      context,
      bitmap,
      sourceWidth,
      sourceHeight,
      startingQuality: options.quality,
      targetBytes: options.targetSizeKb * 1024,
    });
  } finally {
    closeBitmap(bitmap);
  }
}

export async function convertRasterImage(
  file: File,
  output: RasterOutputFormat,
  quality: number,
): Promise<Blob> {
  const bitmap = await loadBitmap(file);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    closeBitmap(bitmap);
    throw new Error("Canvas is not available in this browser.");
  }

  try {
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(bitmap, 0, 0);

    const mimeType = output === "png" ? "image/png" : "image/jpeg";
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, mimeType, output === "png" ? undefined : quality);
    });

    if (!blob) {
      throw new Error(`The browser could not export this image as ${output.toUpperCase()}.`);
    }

    return blob;
  } finally {
    closeBitmap(bitmap);
  }
}

export async function convertHeicImage(file: File, output: HeicOutputFormat, quality: number): Promise<Blob> {
  const heic2any = (await import("heic2any")).default;
  const result = await heic2any({
    blob: file,
    toType: output === "png" ? "image/png" : "image/jpeg",
    quality,
  });
  const blob = Array.isArray(result) ? result[0] : result;

  if (!blob) {
    throw new Error("The HEIC image could not be converted.");
  }

  return blob;
}

async function renderToTargetSize({
  canvas,
  context,
  bitmap,
  sourceWidth,
  sourceHeight,
  startingQuality,
  targetBytes,
}: {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  bitmap: ImageBitmap | HTMLImageElement;
  sourceWidth: number;
  sourceHeight: number;
  startingQuality: number;
  targetBytes: number;
}): Promise<Blob> {
  const minQuality = 0.42;
  let width = sourceWidth;
  let height = sourceHeight;
  let smallest = await renderWebP(canvas, context, bitmap, width, height, minQuality);

  for (let attempt = 0; attempt < 9; attempt += 1) {
    const bestAtSize = await findBestQualityForTarget({
      canvas,
      context,
      bitmap,
      width,
      height,
      minQuality,
      maxQuality: startingQuality,
      targetBytes,
    });

    if (bestAtSize.size <= targetBytes) {
      return bestAtSize;
    }

    if (bestAtSize.size < smallest.size) {
      smallest = bestAtSize;
    }

    const nextWidth = Math.round(width * 0.86);
    const nextHeight = Math.round(height * 0.86);
    if (nextWidth < 640 || nextHeight < 360) {
      break;
    }

    width = nextWidth;
    height = nextHeight;
  }

  return smallest;
}

async function findBestQualityForTarget({
  canvas,
  context,
  bitmap,
  width,
  height,
  minQuality,
  maxQuality,
  targetBytes,
}: {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  bitmap: ImageBitmap | HTMLImageElement;
  width: number;
  height: number;
  minQuality: number;
  maxQuality: number;
  targetBytes: number;
}): Promise<Blob> {
  let low = minQuality;
  let high = Math.max(minQuality, maxQuality);
  let bestUnderTarget: Blob | null = null;
  let smallest = await renderWebP(canvas, context, bitmap, width, height, minQuality);

  for (let index = 0; index < 7; index += 1) {
    const quality = (low + high) / 2;
    const blob = await renderWebP(canvas, context, bitmap, width, height, quality);

    if (blob.size < smallest.size) {
      smallest = blob;
    }

    if (blob.size <= targetBytes) {
      bestUnderTarget = blob;
      low = quality;
    } else {
      high = quality;
    }
  }

  return bestUnderTarget ?? smallest;
}

async function renderWebP(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  bitmap: ImageBitmap | HTMLImageElement,
  width: number,
  height: number,
  quality: number,
): Promise<Blob> {
  canvas.width = width;
  canvas.height = height;
  context.clearRect(0, 0, width, height);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(bitmap, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/webp", quality);
  });

  if (!blob) {
    throw new Error("The browser could not export this image as WebP.");
  }

  return blob;
}

async function loadBitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if ("createImageBitmap" in window) {
    return createImageBitmap(file);
  }

  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("The image could not be decoded."));
    };
    image.src = url;
  });
}

function closeBitmap(bitmap: ImageBitmap | HTMLImageElement): void {
  if ("close" in bitmap) {
    bitmap.close();
  }
}
