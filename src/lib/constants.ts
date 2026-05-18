export const SUPPORTED_IMAGE_EXTENSIONS = ["png", "jpg", "jpeg"] as const;
export const SUPPORTED_VIDEO_EXTENSIONS = ["mp4", "mov", "avi", "mkv", "m4v"] as const;
export const SUPPORTED_PDF_EXTENSIONS = ["pdf"] as const;

export const IMAGE_MIME_TYPES = ["image/png", "image/jpeg"] as const;

export const VIDEO_QUALITY_LABELS = {
  balanced: "Balanced",
  smaller: "Smaller file",
  higher: "Higher quality",
} as const;
