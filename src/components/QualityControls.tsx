"use client";

import type { Dictionary } from "@/i18n";
import type { ImageOutputFormat, MaxVideoWidth, PdfAction, VideoQuality } from "@/types/conversion";

interface ImageControlsProps {
  dictionary: Dictionary;
  imageQuality: number;
  onImageQualityChange: (quality: number) => void;
  targetImageSizeKb: number | null;
  onTargetImageSizeKbChange: (size: number | null) => void;
  disabled: boolean;
}

interface VideoControlsProps {
  dictionary: Dictionary;
  videoQuality: VideoQuality;
  onVideoQualityChange: (quality: VideoQuality) => void;
  maxWidth: MaxVideoWidth;
  onMaxWidthChange: (width: MaxVideoWidth) => void;
  disabled: boolean;
}

interface PdfControlsProps {
  dictionary: Dictionary;
  imageOutput: ImageOutputFormat;
  onImageOutputChange: (format: ImageOutputFormat) => void;
  pdfAction: PdfAction;
  onPdfActionChange: (action: PdfAction) => void;
  pdfImageQuality: number;
  onPdfImageQualityChange: (quality: number) => void;
  disabled: boolean;
}

export function ImageControls({
  dictionary,
  imageQuality,
  onImageQualityChange,
  targetImageSizeKb,
  onTargetImageSizeKbChange,
  disabled,
}: ImageControlsProps) {
  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-[#E8E1D6] bg-[#FDFCF8] p-4">
        <label
          htmlFor="image-quality"
          className="flex items-center justify-between gap-3 text-sm font-semibold text-[#171717]"
        >
          {dictionary.controls.imageQuality}
          <span className="font-mono text-xs text-[#6B6B6B]">{Math.round(imageQuality * 100)}%</span>
        </label>
        <input
          id="image-quality"
          type="range"
          min="0.1"
          max="1"
          step="0.01"
          value={imageQuality}
          disabled={disabled}
          onChange={(event) => onImageQualityChange(Number(event.target.value))}
          className="mt-4 w-full accent-[#2F5D50]"
          aria-label={dictionary.controls.qualityValue}
        />
      </div>

      <label className="flex flex-col gap-2 rounded-2xl border border-[#E8E1D6] bg-[#FDFCF8] p-4 text-sm font-semibold text-[#171717]">
        <span>{dictionary.controls.targetImageSize}</span>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min="20"
            max="20000"
            step="10"
            inputMode="numeric"
            value={targetImageSizeKb ?? ""}
            disabled={disabled}
            onChange={(event) => {
              const value = event.target.value.trim();
              onTargetImageSizeKbChange(value ? Math.max(20, Number(value)) : null);
            }}
            placeholder="100"
            className="h-11 w-32 rounded-xl border border-[#E8E1D6] bg-white px-3 text-sm font-medium text-[#171717]"
            aria-label={dictionary.controls.targetImageSize}
          />
          <span className="text-sm font-medium text-[#6B6B6B]">KB</span>
        </div>
        <span className="text-xs font-medium leading-5 text-[#6B6B6B]">{dictionary.controls.targetImageSizeHint}</span>
      </label>
    </div>
  );
}

export function VideoControls({
  dictionary,
  videoQuality,
  onVideoQualityChange,
  maxWidth,
  onMaxWidthChange,
  disabled,
}: VideoControlsProps) {
  const qualities: VideoQuality[] = ["balanced", "smaller", "higher"];
  const widths: MaxVideoWidth[] = ["original", "1080", "720", "480"];

  return (
    <div className="space-y-3">
      <div
        className="rounded-2xl border border-[#E8E1D6] bg-[#FDFCF8] p-4"
        role="group"
        aria-labelledby="video-quality-label"
      >
        <p id="video-quality-label" className="text-sm font-semibold text-[#171717]">
          {dictionary.controls.videoQuality}
        </p>
        <div className="flex flex-wrap gap-2">
          {qualities.map((quality) => (
            <button
              key={quality}
              type="button"
              disabled={disabled}
              onClick={() => onVideoQualityChange(quality)}
              className={`mt-3 inline-flex min-h-10 items-center justify-center rounded-full border px-4 text-sm font-medium leading-none transition ${
                videoQuality === quality
                  ? "border-[#1F2933] bg-[#1F2933] text-white"
                  : "border-[#E8E1D6] bg-white text-[#6B6B6B] hover:text-[#171717]"
              }`}
              aria-pressed={videoQuality === quality}
            >
              {dictionary.controls[quality]}
            </button>
          ))}
        </div>
      </div>

      <label className="flex flex-col gap-3 rounded-2xl border border-[#E8E1D6] bg-[#FDFCF8] p-4 text-sm font-semibold text-[#171717] sm:flex-row sm:items-center sm:justify-between">
        <span>{dictionary.controls.maxWidth}</span>
        <select
          value={maxWidth}
          disabled={disabled}
          onChange={(event) => onMaxWidthChange(event.target.value as MaxVideoWidth)}
          className="h-11 w-full rounded-xl border border-[#E8E1D6] bg-white px-3 text-sm font-medium text-[#171717] sm:w-44"
        >
          {widths.map((width) => (
            <option key={width} value={width}>
              {width === "original" ? dictionary.controls.original : `${width}p`}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export function PdfControls({
  dictionary,
  imageOutput,
  onImageOutputChange,
  pdfAction,
  onPdfActionChange,
  pdfImageQuality,
  onPdfImageQualityChange,
  disabled,
}: PdfControlsProps) {
  const imageOutputs: ImageOutputFormat[] = ["pdf", "webp"];
  const pdfActions: PdfAction[] = ["merge", "to-png", "to-jpeg"];

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-[#E8E1D6] bg-[#FDFCF8] p-4">
        <p className="text-sm font-semibold text-[#171717]">{dictionary.controls.imageOutput}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {imageOutputs.map((format) => (
            <button
              key={format}
              type="button"
              disabled={disabled}
              onClick={() => onImageOutputChange(format)}
              className={`inline-flex min-h-10 items-center justify-center rounded-full border px-4 text-sm font-medium leading-none transition ${
                imageOutput === format
                  ? "border-[#1F2933] bg-[#1F2933] text-white"
                  : "border-[#E8E1D6] bg-white text-[#6B6B6B] hover:text-[#171717]"
              }`}
              aria-pressed={imageOutput === format}
            >
              {format === "webp" ? dictionary.controls.webpOutput : dictionary.controls.pdfOutput}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[#E8E1D6] bg-[#FDFCF8] p-4">
        <p className="text-sm font-semibold text-[#171717]">{dictionary.controls.pdfAction}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {pdfActions.map((action) => (
            <button
              key={action}
              type="button"
              disabled={disabled}
              onClick={() => onPdfActionChange(action)}
              className={`inline-flex min-h-10 items-center justify-center rounded-full border px-4 text-sm font-medium leading-none transition ${
                pdfAction === action
                  ? "border-[#1F2933] bg-[#1F2933] text-white"
                  : "border-[#E8E1D6] bg-white text-[#6B6B6B] hover:text-[#171717]"
              }`}
              aria-pressed={pdfAction === action}
            >
              {dictionary.controls.pdfActions[action]}
            </button>
          ))}
        </div>

        <label className="mt-4 flex items-center justify-between gap-3 text-sm font-semibold text-[#171717]">
          {dictionary.controls.pdfImageQuality}
          <span className="font-mono text-xs text-[#6B6B6B]">{Math.round(pdfImageQuality * 100)}%</span>
        </label>
        <input
          type="range"
          min="0.4"
          max="1"
          step="0.01"
          value={pdfImageQuality}
          disabled={disabled || pdfAction === "merge"}
          onChange={(event) => onPdfImageQualityChange(Number(event.target.value))}
          className="mt-3 w-full accent-[#2F5D50] disabled:opacity-50"
          aria-label={dictionary.controls.pdfImageQuality}
        />
      </div>
    </div>
  );
}
