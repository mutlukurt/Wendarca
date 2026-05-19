export type Language = "en" | "tr";

export type FileKind = "image" | "video" | "pdf" | "presentation" | "heic" | "word" | "excel";

export type ConversionStatus = "waiting" | "converting" | "done" | "failed";

export type ConverterTab =
  | "images"
  | "videos"
  | "pdfs"
  | "presentations"
  | "imageFormats"
  | "heic"
  | "office"
  | "wordPdf"
  | "excelPdf"
  | "all";

export type ImageOutputFormat = "webp" | "pdf" | "png" | "jpeg";
export type RasterOutputFormat = "png" | "jpeg";
export type HeicOutputFormat = "png" | "jpeg";
export type OfficeAction = "word-to-excel" | "excel-to-word" | "word-to-pdf" | "excel-to-pdf";

export type PdfAction = "to-png" | "to-jpeg" | "merge";

export type PresentationAction = "separate" | "merged";

export type VideoQuality = "balanced" | "smaller" | "higher";

export type MaxVideoWidth = "original" | "1080" | "720" | "480";

export interface ConvertedAsset {
  blob: Blob;
  url: string;
  fileName: string;
  size: number;
}

export interface ConversionFile {
  id: string;
  file: File;
  kind: FileKind;
  originalName: string;
  originalType: string;
  originalSize: number;
  targetFormat: "webp" | "webm" | "pdf" | "png" | "jpeg" | "zip" | "xlsx" | "docx";
  status: ConversionStatus;
  progress: number;
  converted?: ConvertedAsset;
  error?: string;
}

export interface ImageConversionOptions {
  quality: number;
  targetSizeKb: number | null;
}

export interface PdfConversionOptions {
  imageOutput: ImageOutputFormat;
  action: PdfAction;
  imageQuality: number;
}

export interface VideoConversionOptions {
  quality: VideoQuality;
  maxWidth: MaxVideoWidth;
}

export interface PresentationConversionOptions {
  action: PresentationAction;
  quality: number;
}
