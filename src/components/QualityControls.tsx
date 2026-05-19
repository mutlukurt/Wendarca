"use client";

import type { Dictionary } from "@/i18n";
import type { ReactNode } from "react";
import type {
  HeicOutputFormat,
  ImageOutputFormat,
  MaxVideoWidth,
  OfficeAction,
  PdfAction,
  PresentationAction,
  RasterOutputFormat,
  VideoQuality,
} from "@/types/conversion";

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

interface PresentationControlsProps {
  dictionary: Dictionary;
  action: PresentationAction;
  onActionChange: (action: PresentationAction) => void;
  quality: number;
  onQualityChange: (quality: number) => void;
  disabled: boolean;
}

interface AllFilesControlsProps {
  dictionary: Dictionary;
  imageOutput: ImageOutputFormat;
  onImageOutputChange: (format: ImageOutputFormat) => void;
  pdfAction: PdfAction;
  onPdfActionChange: (action: PdfAction) => void;
  presentationAction: PresentationAction;
  onPresentationActionChange: (action: PresentationAction) => void;
  rasterOutput: RasterOutputFormat;
  onRasterOutputChange: (format: RasterOutputFormat) => void;
  heicOutput: HeicOutputFormat;
  onHeicOutputChange: (format: HeicOutputFormat) => void;
  officeAction: OfficeAction;
  onOfficeActionChange: (action: OfficeAction) => void;
  videoQuality: VideoQuality;
  onVideoQualityChange: (quality: VideoQuality) => void;
  maxWidth: MaxVideoWidth;
  onMaxWidthChange: (width: MaxVideoWidth) => void;
  disabled: boolean;
}

interface FormatControlsProps {
  dictionary: Dictionary;
  rasterOutput: RasterOutputFormat;
  onRasterOutputChange: (format: RasterOutputFormat) => void;
  heicOutput: HeicOutputFormat;
  onHeicOutputChange: (format: HeicOutputFormat) => void;
  officeAction: OfficeAction;
  onOfficeActionChange: (action: OfficeAction) => void;
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
      <div className="rounded-2xl border border-[#D8D8D8] bg-[#FFFFFF] p-4">
        <label
          htmlFor="image-quality"
          className="flex items-center justify-between gap-3 text-sm font-semibold text-[#000000]"
        >
          {dictionary.controls.imageQuality}
          <span className="font-mono text-xs text-[#797979]">{Math.round(imageQuality * 100)}%</span>
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
          className="mt-4 w-full accent-[#FB4D27]"
          aria-label={dictionary.controls.qualityValue}
        />
      </div>

      <label className="flex flex-col gap-2 rounded-2xl border border-[#D8D8D8] bg-[#FFFFFF] p-4 text-sm font-semibold text-[#000000]">
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
            className="h-11 w-32 rounded-xl border border-[#D8D8D8] bg-white px-3 text-sm font-medium text-[#000000]"
            aria-label={dictionary.controls.targetImageSize}
          />
          <span className="text-sm font-medium text-[#797979]">KB</span>
        </div>
        <span className="text-xs font-medium leading-5 text-[#797979]">{dictionary.controls.targetImageSizeHint}</span>
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
        className="rounded-2xl border border-[#D8D8D8] bg-[#FFFFFF] p-4"
        role="group"
        aria-labelledby="video-quality-label"
      >
        <p id="video-quality-label" className="text-sm font-semibold text-[#000000]">
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
                  ? "border-[#000000] bg-[#000000] text-white"
                  : "border-[#D8D8D8] bg-white text-[#797979] hover:text-[#000000]"
              }`}
              aria-pressed={videoQuality === quality}
            >
              {dictionary.controls[quality]}
            </button>
          ))}
        </div>
      </div>

      <label className="flex flex-col gap-3 rounded-2xl border border-[#D8D8D8] bg-[#FFFFFF] p-4 text-sm font-semibold text-[#000000] sm:flex-row sm:items-center sm:justify-between">
        <span>{dictionary.controls.maxWidth}</span>
        <select
          value={maxWidth}
          disabled={disabled}
          onChange={(event) => onMaxWidthChange(event.target.value as MaxVideoWidth)}
          className="h-11 w-full rounded-xl border border-[#D8D8D8] bg-white px-3 text-sm font-medium text-[#000000] sm:w-44"
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
      <div className="rounded-2xl border border-[#D8D8D8] bg-[#FFFFFF] p-4">
        <p className="text-sm font-semibold text-[#000000]">{dictionary.controls.imageOutput}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {imageOutputs.map((format) => (
            <button
              key={format}
              type="button"
              disabled={disabled}
              onClick={() => onImageOutputChange(format)}
              className={`inline-flex min-h-10 items-center justify-center rounded-full border px-4 text-sm font-medium leading-none transition ${
                imageOutput === format
                  ? "border-[#000000] bg-[#000000] text-white"
                  : "border-[#D8D8D8] bg-white text-[#797979] hover:text-[#000000]"
              }`}
              aria-pressed={imageOutput === format}
            >
              {format === "webp" ? dictionary.controls.webpOutput : dictionary.controls.pdfOutput}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[#D8D8D8] bg-[#FFFFFF] p-4">
        <p className="text-sm font-semibold text-[#000000]">{dictionary.controls.pdfAction}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {pdfActions.map((action) => (
            <button
              key={action}
              type="button"
              disabled={disabled}
              onClick={() => onPdfActionChange(action)}
              className={`inline-flex min-h-10 items-center justify-center rounded-full border px-4 text-sm font-medium leading-none transition ${
                pdfAction === action
                  ? "border-[#000000] bg-[#000000] text-white"
                  : "border-[#D8D8D8] bg-white text-[#797979] hover:text-[#000000]"
              }`}
              aria-pressed={pdfAction === action}
            >
              {dictionary.controls.pdfActions[action]}
            </button>
          ))}
        </div>

        <label className="mt-4 flex items-center justify-between gap-3 text-sm font-semibold text-[#000000]">
          {dictionary.controls.pdfImageQuality}
          <span className="font-mono text-xs text-[#797979]">{Math.round(pdfImageQuality * 100)}%</span>
        </label>
        <input
          type="range"
          min="0.2"
          max="1"
          step="0.01"
          value={pdfImageQuality}
          disabled={disabled}
          onChange={(event) => onPdfImageQualityChange(Number(event.target.value))}
          className="mt-3 w-full accent-[#FB4D27] disabled:opacity-50"
          aria-label={dictionary.controls.pdfImageQuality}
        />
      </div>
    </div>
  );
}

export function PresentationControls({
  dictionary,
  action,
  onActionChange,
  quality,
  onQualityChange,
  disabled,
}: PresentationControlsProps) {
  const actions: PresentationAction[] = ["separate", "merged"];

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-[#D8D8D8] bg-[#FFFFFF] p-4">
        <p className="text-sm font-semibold text-[#000000]">{dictionary.controls.presentationAction}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {actions.map((item) => (
            <button
              key={item}
              type="button"
              disabled={disabled}
              onClick={() => onActionChange(item)}
              className={`inline-flex min-h-10 items-center justify-center rounded-full border px-4 text-sm font-medium leading-none transition ${
                action === item
                  ? "border-[#000000] bg-[#000000] text-white"
                  : "border-[#D8D8D8] bg-white text-[#797979] hover:text-[#000000]"
              }`}
              aria-pressed={action === item}
            >
              {dictionary.controls.presentationActions[item]}
            </button>
          ))}
        </div>

        <label className="mt-4 flex items-center justify-between gap-3 text-sm font-semibold text-[#000000]">
          {dictionary.controls.presentationQuality}
          <span className="font-mono text-xs text-[#797979]">{Math.round(quality * 100)}%</span>
        </label>
        <input
          type="range"
          min="0.2"
          max="1"
          step="0.01"
          value={quality}
          disabled={disabled}
          onChange={(event) => onQualityChange(Number(event.target.value))}
          className="mt-3 w-full accent-[#FB4D27] disabled:opacity-50"
          aria-label={dictionary.controls.presentationQuality}
        />
        <p className="mt-3 text-xs font-medium leading-5 text-[#797979]">{dictionary.controls.presentationHint}</p>
      </div>
    </div>
  );
}

export function AllFilesControls({
  dictionary,
  imageOutput,
  onImageOutputChange,
  pdfAction,
  onPdfActionChange,
  presentationAction,
  onPresentationActionChange,
  rasterOutput,
  onRasterOutputChange,
  heicOutput,
  onHeicOutputChange,
  officeAction,
  onOfficeActionChange,
  videoQuality,
  onVideoQualityChange,
  maxWidth,
  onMaxWidthChange,
  disabled,
}: AllFilesControlsProps) {
  const imageOutputs: ImageOutputFormat[] = ["webp", "png", "jpeg", "pdf"];
  const rasterOutputs: RasterOutputFormat[] = ["png", "jpeg"];
  const heicOutputs: HeicOutputFormat[] = ["png", "jpeg"];
  const pdfActions: PdfAction[] = ["merge", "to-png", "to-jpeg"];
  const presentationActions: PresentationAction[] = ["separate", "merged"];
  const officeActions: OfficeAction[] = ["word-to-excel", "excel-to-word", "word-to-pdf", "excel-to-pdf"];
  const videoQualities: VideoQuality[] = ["balanced", "smaller", "higher"];
  const widths: MaxVideoWidth[] = ["original", "1080", "720", "480"];

  return (
    <div className="space-y-3 rounded-3xl border border-[#D8D8D8] bg-[#FFFFFF]/90 p-5 shadow-sm">
      <div>
        <p className="text-sm font-semibold text-[#000000]">{dictionary.controls.allFiles.title}</p>
        <p className="mt-1 text-xs leading-5 text-[#797979]">{dictionary.controls.allFiles.description}</p>
      </div>

      <div className="grid gap-3">
        <OptionGroup label={dictionary.controls.allFiles.images}>
          {imageOutputs.map((format) => (
            <PillButton
              key={format}
              active={imageOutput === format}
              disabled={disabled}
              onClick={() => onImageOutputChange(format)}
            >
              {format === "webp"
                ? dictionary.controls.webpOutput
                : format === "png"
                  ? dictionary.controls.pngOutput
                  : format === "jpeg"
                    ? dictionary.controls.jpegOutput
                    : dictionary.controls.pdfOutput}
            </PillButton>
          ))}
        </OptionGroup>

        <OptionGroup label={dictionary.controls.allFiles.imageFormats}>
          {rasterOutputs.map((format) => (
            <PillButton
              key={format}
              active={rasterOutput === format}
              disabled={disabled}
              onClick={() => onRasterOutputChange(format)}
            >
              {format === "png" ? dictionary.controls.pngOutput : dictionary.controls.jpegOutput}
            </PillButton>
          ))}
        </OptionGroup>

        <OptionGroup label={dictionary.controls.allFiles.heic}>
          {heicOutputs.map((format) => (
            <PillButton
              key={format}
              active={heicOutput === format}
              disabled={disabled}
              onClick={() => onHeicOutputChange(format)}
            >
              {format === "png" ? dictionary.controls.pngOutput : dictionary.controls.jpegOutput}
            </PillButton>
          ))}
        </OptionGroup>

        <OptionGroup label={dictionary.controls.allFiles.videos}>
          {videoQualities.map((quality) => (
            <PillButton
              key={quality}
              active={videoQuality === quality}
              disabled={disabled}
              onClick={() => onVideoQualityChange(quality)}
            >
              {dictionary.controls[quality]}
            </PillButton>
          ))}
          <select
            value={maxWidth}
            disabled={disabled}
            onChange={(event) => onMaxWidthChange(event.target.value as MaxVideoWidth)}
            className="h-10 rounded-full border border-[#D8D8D8] bg-white px-3 text-sm font-medium text-[#000000]"
            aria-label={dictionary.controls.maxWidth}
          >
            {widths.map((width) => (
              <option key={width} value={width}>
                {width === "original" ? dictionary.controls.original : `${width}p`}
              </option>
            ))}
          </select>
        </OptionGroup>

        <OptionGroup label={dictionary.controls.allFiles.pdfs}>
          {pdfActions.map((action) => (
            <PillButton
              key={action}
              active={pdfAction === action}
              disabled={disabled}
              onClick={() => onPdfActionChange(action)}
            >
              {dictionary.controls.pdfActions[action]}
            </PillButton>
          ))}
        </OptionGroup>

        <OptionGroup label={dictionary.controls.allFiles.presentations}>
          {presentationActions.map((action) => (
            <PillButton
              key={action}
              active={presentationAction === action}
              disabled={disabled}
              onClick={() => onPresentationActionChange(action)}
            >
              {dictionary.controls.presentationActions[action]}
            </PillButton>
          ))}
        </OptionGroup>

        <OptionGroup label={dictionary.controls.allFiles.office}>
          {officeActions.map((action) => (
            <PillButton
              key={action}
              active={officeAction === action}
              disabled={disabled}
              onClick={() => onOfficeActionChange(action)}
            >
              {dictionary.controls.officeActions[action]}
            </PillButton>
          ))}
        </OptionGroup>
      </div>
    </div>
  );
}

export function ImageFormatControls({ dictionary, rasterOutput, onRasterOutputChange, disabled }: Pick<FormatControlsProps, "dictionary" | "rasterOutput" | "onRasterOutputChange" | "disabled">) {
  const outputs: RasterOutputFormat[] = ["png", "jpeg"];

  return (
    <SimpleOutputCard title={dictionary.controls.imageFormatAction} description={dictionary.controls.imageFormatHint}>
      {outputs.map((format) => (
        <PillButton key={format} active={rasterOutput === format} disabled={disabled} onClick={() => onRasterOutputChange(format)}>
          {format === "png" ? dictionary.controls.pngOutput : dictionary.controls.jpegOutput}
        </PillButton>
      ))}
    </SimpleOutputCard>
  );
}

export function HeicControls({ dictionary, heicOutput, onHeicOutputChange, disabled }: Pick<FormatControlsProps, "dictionary" | "heicOutput" | "onHeicOutputChange" | "disabled">) {
  const outputs: HeicOutputFormat[] = ["png", "jpeg"];

  return (
    <SimpleOutputCard title={dictionary.controls.heicAction} description={dictionary.controls.heicHint}>
      {outputs.map((format) => (
        <PillButton key={format} active={heicOutput === format} disabled={disabled} onClick={() => onHeicOutputChange(format)}>
          {format === "png" ? dictionary.controls.pngOutput : dictionary.controls.jpegOutput}
        </PillButton>
      ))}
    </SimpleOutputCard>
  );
}

export function OfficeControls({ dictionary, officeAction, onOfficeActionChange, disabled }: Pick<FormatControlsProps, "dictionary" | "officeAction" | "onOfficeActionChange" | "disabled">) {
  const actions: OfficeAction[] = ["word-to-excel", "excel-to-word"];

  return (
    <SimpleOutputCard title={dictionary.controls.officeAction} description={dictionary.controls.officeHint}>
      {actions.map((action) => (
        <PillButton key={action} active={officeAction === action} disabled={disabled} onClick={() => onOfficeActionChange(action)}>
          {dictionary.controls.officeActions[action]}
        </PillButton>
      ))}
    </SimpleOutputCard>
  );
}

export function OfficePdfControls({ title, description }: { title: string; description: string }) {
  return <SimpleOutputCard title={title} description={description}>{null}</SimpleOutputCard>;
}

function SimpleOutputCard({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <div className="rounded-3xl border border-[#D8D8D8] bg-[#FFFFFF]/90 p-5 shadow-sm">
      <p className="text-sm font-semibold text-[#000000]">{title}</p>
      <p className="mt-1 text-xs leading-5 text-[#797979]">{description}</p>
      <div className="mt-4 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function OptionGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#D8D8D8] bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#797979]">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function PillButton({
  active,
  disabled,
  onClick,
  children,
}: {
  active: boolean;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex min-h-10 items-center justify-center rounded-full border px-4 text-sm font-medium leading-none transition ${
        active ? "border-[#000000] bg-[#000000] text-white" : "border-[#D8D8D8] bg-white text-[#797979] hover:text-[#000000]"
      }`}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}
