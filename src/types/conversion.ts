export type Language = "en" | "tr";

export type FileKind = "image" | "video" | "pdf";

export type ConversionStatus = "waiting" | "converting" | "done" | "failed";

export type ConverterTab = "images" | "videos" | "pdfs" | "all";

export type ImageOutputFormat = "webp" | "pdf";

export type PdfAction = "to-png" | "to-jpeg" | "merge";

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
  targetFormat: "webp" | "webm" | "pdf" | "png" | "jpeg" | "zip";
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
