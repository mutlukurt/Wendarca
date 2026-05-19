import {
  SUPPORTED_EXCEL_EXTENSIONS,
  SUPPORTED_HEIC_EXTENSIONS,
  SUPPORTED_IMAGE_EXTENSIONS,
  SUPPORTED_PDF_EXTENSIONS,
  SUPPORTED_PRESENTATION_EXTENSIONS,
  SUPPORTED_VIDEO_EXTENSIONS,
  SUPPORTED_WORD_EXTENSIONS,
} from "@/lib/constants";

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;
  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

export function getFileExtension(fileName: string): string {
  const extension = fileName.split(".").pop();
  return extension ? extension.toLowerCase() : "";
}

export function isImageFile(file: File): boolean {
  const extension = getFileExtension(file.name);
  return SUPPORTED_IMAGE_EXTENSIONS.includes(extension as (typeof SUPPORTED_IMAGE_EXTENSIONS)[number]);
}

export function isHeicFile(file: File): boolean {
  const extension = getFileExtension(file.name);
  return SUPPORTED_HEIC_EXTENSIONS.includes(extension as (typeof SUPPORTED_HEIC_EXTENSIONS)[number]);
}

export function isVideoFile(file: File): boolean {
  const extension = getFileExtension(file.name);
  return SUPPORTED_VIDEO_EXTENSIONS.includes(extension as (typeof SUPPORTED_VIDEO_EXTENSIONS)[number]);
}

export function isPdfFile(file: File): boolean {
  const extension = getFileExtension(file.name);
  return file.type === "application/pdf" || SUPPORTED_PDF_EXTENSIONS.includes(extension as (typeof SUPPORTED_PDF_EXTENSIONS)[number]);
}

export function isPresentationFile(file: File): boolean {
  const extension = getFileExtension(file.name);
  return (
    file.type === "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
    SUPPORTED_PRESENTATION_EXTENSIONS.includes(extension as (typeof SUPPORTED_PRESENTATION_EXTENSIONS)[number])
  );
}

export function isWordFile(file: File): boolean {
  const extension = getFileExtension(file.name);
  return (
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    SUPPORTED_WORD_EXTENSIONS.includes(extension as (typeof SUPPORTED_WORD_EXTENSIONS)[number])
  );
}

export function isExcelFile(file: File): boolean {
  const extension = getFileExtension(file.name);
  return (
    file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    file.type === "application/vnd.ms-excel" ||
    SUPPORTED_EXCEL_EXTENSIONS.includes(extension as (typeof SUPPORTED_EXCEL_EXTENSIONS)[number])
  );
}

export function replaceExtension(fileName: string, extension: string): string {
  const safeExtension = extension.startsWith(".") ? extension.slice(1) : extension;
  const lastDotIndex = fileName.lastIndexOf(".");
  const base = lastDotIndex > 0 ? fileName.slice(0, lastDotIndex) : fileName;
  return `${base}.${safeExtension}`;
}

export function calculateCompression(originalSize: number, convertedSize?: number): number | null {
  if (!convertedSize || originalSize <= 0) return null;
  return Math.round(((originalSize - convertedSize) / originalSize) * 100);
}

export function createConversionId(): string {
  return `${Date.now()}-${crypto.randomUUID()}`;
}
