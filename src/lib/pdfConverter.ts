import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
import type { PdfAction } from "@/types/conversion";

type PdfImageOutput = Extract<PdfAction, "to-png" | "to-jpeg">;

interface RenderablePage {
  getViewport: (options: { scale: number }) => { width: number; height: number };
  render: (options: {
    canvas: HTMLCanvasElement;
    canvasContext: CanvasRenderingContext2D;
    viewport: { width: number; height: number };
  }) => { promise: Promise<void> };
}

interface RenderablePdf {
  numPages: number;
  getPage: (pageNumber: number) => Promise<RenderablePage>;
  destroy: () => Promise<void>;
}

export async function convertImagesToPdf(files: File[], quality: number): Promise<Blob> {
  const pdf = await PDFDocument.create();

  for (const file of files) {
    const embeddedBytes = await imageFileToPdfBytes(file, quality);
    const embedded = await pdf.embedJpg(embeddedBytes);

    const page = pdf.addPage([embedded.width, embedded.height]);
    page.drawImage(embedded, {
      x: 0,
      y: 0,
      width: embedded.width,
      height: embedded.height,
    });
  }

  const pdfBytes = await pdf.save();
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
}

export async function mergePdfs(files: File[]): Promise<Blob> {
  const merged = await PDFDocument.create();

  for (const file of files) {
    const source = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
    const pages = await merged.copyPages(source, source.getPageIndices());
    pages.forEach((page) => merged.addPage(page));
  }

  const bytes = await merged.save();
  return new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
}

export async function convertPdfToImageZip(
  file: File,
  output: PdfImageOutput,
  quality: number,
  onProgress: (progress: number) => void,
): Promise<Blob> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/legacy/build/pdf.worker.mjs",
    import.meta.url,
  ).toString();

  const documentTask = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
  const pdf = (await documentTask.promise) as unknown as RenderablePdf;
  const zip = new JSZip();
  const mimeType = output === "to-png" ? "image/png" : "image/jpeg";
  const extension = output === "to-png" ? "png" : "jpg";

  try {
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: renderScaleForQuality(quality) });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Canvas is not available in this browser.");
      }

      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);

      await page.render({ canvas, canvasContext: context, viewport }).promise;
      const blob = await canvasToBlob(canvas, mimeType, output === "to-jpeg" ? quality : undefined);
      zip.file(`${baseName(file.name)}-page-${String(pageNumber).padStart(3, "0")}.${extension}`, blob);
      onProgress(Math.round((pageNumber / pdf.numPages) * 100));
    }
  } finally {
    await pdf.destroy();
  }

  return zip.generateAsync({ type: "blob" });
}

async function imageFileToPdfBytes(file: File, quality: number): Promise<Uint8Array> {
  const bitmap = await loadBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;

  const context = canvas.getContext("2d");
  if (!context) {
    closeBitmap(bitmap);
    throw new Error("Canvas is not available in this browser.");
  }

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0);
  closeBitmap(bitmap);

  const blob = await canvasToBlob(canvas, "image/jpeg", quality);
  return new Uint8Array(await blob.arrayBuffer());
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

function renderScaleForQuality(quality: number): number {
  return 1 + quality * 2;
}

function baseName(fileName: string): string {
  const lastDotIndex = fileName.lastIndexOf(".");
  return lastDotIndex > 0 ? fileName.slice(0, lastDotIndex) : fileName;
}

function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
          return;
        }

        reject(new Error("The PDF page could not be rendered as an image."));
      },
      mimeType,
      quality,
    );
  });
}
