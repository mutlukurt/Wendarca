"use client";

import { Archive, Download, Info, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Dictionary } from "@/i18n";
import { convertHeicImage, convertImageToWebP, convertRasterImage } from "@/lib/imageConverter";
import { convertExcelToPdf, convertExcelToWord, convertWordToExcel, convertWordToPdf } from "@/lib/officeConverter";
import { convertImagesToPdf, convertPdfToImageZip, mergePdfsCompressed } from "@/lib/pdfConverter";
import { convertPptxFilesToMergedPdf, convertPptxToPdf } from "@/lib/pptxConverter";
import { createZipFromConvertedFiles } from "@/lib/zipUtils";
import {
  createConversionId,
  getFileExtension,
  isImageFile,
  isExcelFile,
  isHeicFile,
  isPdfFile,
  isPresentationFile,
  isVideoFile,
  isWordFile,
  replaceExtension,
} from "@/lib/fileUtils";
import type {
  ConvertedAsset,
  ConversionFile,
  ConverterTab,
  ImageOutputFormat,
  HeicOutputFormat,
  MaxVideoWidth,
  OfficeAction,
  PdfAction,
  PresentationAction,
  RasterOutputFormat,
  VideoQuality,
} from "@/types/conversion";
import { Dropzone } from "@/components/Dropzone";
import { FileQueue } from "@/components/FileQueue";
import {
  AllFilesControls,
  HeicControls,
  ImageControls,
  ImageFormatControls,
  OfficeControls,
  OfficePdfControls,
  PdfControls,
  PresentationControls,
  VideoControls,
} from "@/components/QualityControls";

interface ConverterPanelProps {
  dictionary: Dictionary;
}

export function ConverterPanel({ dictionary }: ConverterPanelProps) {
  const [files, setFiles] = useState<ConversionFile[]>([]);
  const [activeTab, setActiveTab] = useState<ConverterTab>("images");
  const [imageOutput, setImageOutput] = useState<ImageOutputFormat>("webp");
  const [imageQuality, setImageQuality] = useState(0.82);
  const [targetImageSizeKb, setTargetImageSizeKb] = useState<number | null>(null);
  const [rasterOutput, setRasterOutput] = useState<RasterOutputFormat>("png");
  const [heicOutput, setHeicOutput] = useState<HeicOutputFormat>("png");
  const [officeAction, setOfficeAction] = useState<OfficeAction>("word-to-excel");
  const [pdfAction, setPdfAction] = useState<PdfAction>("merge");
  const [pdfImageQuality, setPdfImageQuality] = useState(0.62);
  const [presentationAction, setPresentationAction] = useState<PresentationAction>("separate");
  const [presentationQuality, setPresentationQuality] = useState(0.62);
  const [videoQuality, setVideoQuality] = useState<VideoQuality>("balanced");
  const [maxWidth, setMaxWidth] = useState<MaxVideoWidth>("720");
  const [isConverting, setIsConverting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [isPreparingVideo, setIsPreparingVideo] = useState(false);
  const [batchAssets, setBatchAssets] = useState<ConvertedAsset[]>([]);
  const filesRef = useRef<ConversionFile[]>([]);
  const batchAssetsRef = useRef<ConvertedAsset[]>([]);

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  useEffect(() => {
    batchAssetsRef.current = batchAssets;
  }, [batchAssets]);

  useEffect(() => {
    return () => {
      filesRef.current.forEach((file) => {
        if (file.converted?.url) URL.revokeObjectURL(file.converted.url);
      });
      batchAssetsRef.current.forEach((asset) => URL.revokeObjectURL(asset.url));
    };
  }, []);

  const visibleFiles = useMemo(() => {
    const scopedFiles =
      activeTab === "images"
        ? files.filter((file) => file.kind === "image")
        : activeTab === "videos"
          ? files.filter((file) => file.kind === "video")
          : activeTab === "pdfs"
            ? files.filter((file) => file.kind === "pdf" || file.kind === "image")
            : activeTab === "presentations"
              ? files.filter((file) => file.kind === "presentation")
              : activeTab === "imageFormats"
                ? files.filter((file) => file.kind === "image")
                : activeTab === "heic"
                  ? files.filter((file) => file.kind === "heic")
                  : activeTab === "office"
                    ? files.filter((file) => file.kind === "word" || file.kind === "excel")
                    : activeTab === "wordPdf"
                      ? files.filter((file) => file.kind === "word")
                      : activeTab === "excelPdf"
                        ? files.filter((file) => file.kind === "excel")
                    : files;

    return scopedFiles.map((file) => ({
      ...file,
      targetFormat: targetFormatForKind(file.kind, {
        activeTab,
        imageOutput: activeTab === "images" ? "webp" : imageOutput,
        pdfAction,
        rasterOutput,
        heicOutput,
        officeAction,
      }),
    }));
  }, [activeTab, files, heicOutput, imageOutput, officeAction, pdfAction, rasterOutput]);

  const activeFiles = useMemo(() => files.filter((file) => isFileRelevantForTab(file, activeTab)), [activeTab, files]);

  const getTargetOptions = useCallback(
    () => ({
      activeTab,
      imageOutput: activeTab === "images" ? ("webp" as const) : imageOutput,
      pdfAction,
      rasterOutput,
      heicOutput,
      officeAction,
    }),
    [activeTab, heicOutput, imageOutput, officeAction, pdfAction, rasterOutput],
  );

  const addFiles = useCallback(
    (incoming: File[]) => {
      if (incoming.length === 0) return;

      setFiles((current) => {
        const known = new Set(current.map((item) => `${item.originalName}-${item.originalSize}`));
        const accepted: ConversionFile[] = [];
        const messages: string[] = [];

        incoming.forEach((file) => {
          const key = `${file.name}-${file.size}`;
          if (known.has(key)) {
            messages.push(`${dictionary.converter.duplicate} ${file.name}`);
            return;
          }

          if (isImageFile(file) && (activeTab === "images" || activeTab === "pdfs" || activeTab === "imageFormats" || activeTab === "all")) {
            accepted.push(createQueueItem(file, "image", getTargetOptions()));
            known.add(key);
            return;
          }

          if (isVideoFile(file) && (activeTab === "videos" || activeTab === "all")) {
            accepted.push(createQueueItem(file, "video", getTargetOptions()));
            known.add(key);
            return;
          }

          if (isPdfFile(file) && (activeTab === "pdfs" || activeTab === "all")) {
            accepted.push(createQueueItem(file, "pdf", getTargetOptions()));
            known.add(key);
            return;
          }

          if (isPresentationFile(file) && (activeTab === "presentations" || activeTab === "all")) {
            accepted.push(createQueueItem(file, "presentation", getTargetOptions()));
            known.add(key);
            return;
          }

          if (isHeicFile(file) && (activeTab === "heic" || activeTab === "all")) {
            accepted.push(createQueueItem(file, "heic", getTargetOptions()));
            known.add(key);
            return;
          }

          if (isWordFile(file) && ((activeTab === "office" && (officeAction === "word-to-excel" || officeAction === "word-to-pdf")) || activeTab === "wordPdf" || activeTab === "all")) {
            accepted.push(createQueueItem(file, "word", getTargetOptions()));
            known.add(key);
            return;
          }

          if (isExcelFile(file) && ((activeTab === "office" && (officeAction === "excel-to-word" || officeAction === "excel-to-pdf")) || activeTab === "excelPdf" || activeTab === "all")) {
            accepted.push(createQueueItem(file, "excel", getTargetOptions()));
            known.add(key);
            return;
          }

          messages.push(`${dictionary.converter.unsupported} ${file.name}`);
        });

        setNotice(messages.length > 0 ? messages.join(" ") : dictionary.converter.added);
        return [...current, ...accepted];
      });
    },
    [activeTab, dictionary, getTargetOptions, officeAction],
  );

  const removeFile = (id: string) => {
    setFiles((current) => {
      const target = current.find((file) => file.id === id);
      if (target?.converted?.url) URL.revokeObjectURL(target.converted.url);
      return current.filter((file) => file.id !== id);
    });
    revokeBatchAsset();
    setNotice(dictionary.converter.removed);
  };

  const clearAll = () => {
    files.forEach((file) => {
      if (file.converted?.url) URL.revokeObjectURL(file.converted.url);
    });
    setFiles([]);
    revokeBatchAsset();
    setNotice(dictionary.converter.cleared);
  };

  const updateFile = (id: string, updater: (file: ConversionFile) => ConversionFile) => {
    setFiles((current) => current.map((file) => (file.id === id ? updater(file) : file)));
  };

  const convertAll = async () => {
    const candidates = activeFiles.filter((file) => file.status !== "converting");
    if (candidates.length === 0 || isConverting) return;

    setIsConverting(true);
    try {
      revokeBatchAsset();
      const pdfFiles = candidates.filter((file) => file.kind === "pdf");
      const imageFiles = candidates.filter((file) => file.kind === "image");
      const presentationFiles = candidates.filter((file) => file.kind === "presentation");
      const batchedIds = new Set<string>();

      if ((activeTab === "pdfs" || activeTab === "all") && pdfAction === "merge" && pdfFiles.length > 0) {
        await convertPdfMerge(pdfFiles);
        pdfFiles.forEach((file) => batchedIds.add(file.id));
      }

      if ((activeTab === "pdfs" || activeTab === "all") && imageOutput === "pdf" && imageFiles.length > 0) {
        await convertImageBatchToPdf(imageFiles);
        imageFiles.forEach((file) => batchedIds.add(file.id));
      }

      if ((activeTab === "presentations" || activeTab === "all") && presentationAction === "merged" && presentationFiles.length > 0) {
        await convertPresentationMerge(presentationFiles);
        presentationFiles.forEach((file) => batchedIds.add(file.id));
      }

      for (const item of candidates.filter((file) => !batchedIds.has(file.id))) {
        const targetFormat = targetFormatForKind(item.kind, getTargetOptions());
        updateFile(item.id, (file) => ({ ...file, targetFormat, status: "converting", progress: 4, error: undefined }));

        try {
          const blob = await convertSingleFile(item);

          const convertedUrl = URL.createObjectURL(blob);
          const convertedName = item.kind === "pdf" ? replaceExtension(item.originalName, "zip") : replaceExtension(item.originalName, targetFormat);

          updateFile(item.id, (file) => {
            if (file.converted?.url) URL.revokeObjectURL(file.converted.url);
            return {
              ...file,
              status: "done",
              progress: 100,
              converted: {
                blob,
                url: convertedUrl,
                fileName: convertedName,
                size: blob.size,
              },
            };
          });
        } catch (error) {
          if (process.env.NODE_ENV !== "production") {
            console.error(error);
          }
          updateFile(item.id, (file) => ({
            ...file,
            status: "failed",
            progress: 100,
            error:
              file.kind === "image" || file.kind === "heic"
                ? dictionary.converter.imageError
                : file.kind === "pdf"
                  ? dictionary.converter.pdfError
                  : file.kind === "presentation"
                    ? dictionary.converter.presentationError
                    : file.kind === "word" || file.kind === "excel"
                      ? dictionary.converter.officeError
                      : dictionary.converter.videoError,
          }));
        }
      }
    } finally {
      setIsConverting(false);
      setIsPreparingVideo(false);
    }
  };

  const convertSingleFile = async (item: ConversionFile): Promise<Blob> => {
    if (item.kind === "image") {
      if (activeTab === "pdfs" && imageOutput === "pdf") {
        throw new Error("Image to PDF is handled as a batch task.");
      }

      if (activeTab === "imageFormats") {
        return convertRasterImage(item.file, rasterOutput, imageQuality);
      }

      if (activeTab === "all" && (imageOutput === "png" || imageOutput === "jpeg")) {
        return convertRasterImage(item.file, imageOutput, imageQuality);
      }

      return convertImageToWebP(item.file, { quality: imageQuality, targetSizeKb: targetImageSizeKb });
    }

    if (item.kind === "heic") {
      return convertHeicImage(item.file, heicOutput, imageQuality);
    }

    if (item.kind === "pdf") {
      return convertPdfToImageZip(item.file, pdfAction === "to-png" ? "to-png" : "to-jpeg", pdfImageQuality, (progress) => {
        updateFile(item.id, (file) => ({ ...file, progress }));
      });
    }

    if (item.kind === "presentation") {
      return convertPptxToPdf(item.file, presentationQuality, (progress) => {
        updateFile(item.id, (file) => ({ ...file, progress }));
      });
    }

    if (item.kind === "word") {
      if (targetFormatForKind(item.kind, getTargetOptions()) === "pdf") {
        return convertWordToPdf(item.file, pdfImageQuality, (progress) => {
          updateFile(item.id, (file) => ({ ...file, progress }));
        });
      }

      return convertWordToExcel(item.file);
    }

    if (item.kind === "excel") {
      if (targetFormatForKind(item.kind, getTargetOptions()) === "pdf") {
        return convertExcelToPdf(item.file, pdfImageQuality, (progress) => {
          updateFile(item.id, (file) => ({ ...file, progress }));
        });
      }

      return convertExcelToWord(item.file);
    }

    return convertVideo(item);
  };

  const convertPdfMerge = async (items: ConversionFile[]) => {
    items.forEach((item) => updateFile(item.id, (file) => ({ ...file, status: "converting", progress: 10, error: undefined })));
    try {
      const blob = await mergePdfsCompressed(items.map((item) => item.file), pdfImageQuality, (progress) => {
        items.forEach((item) => updateFile(item.id, (file) => ({ ...file, progress })));
      });
      const asset = createAsset(blob, "wendarca-merged.pdf");
      setBatchAssets((current) => [...current, asset]);
      items.forEach((item) => updateFile(item.id, (file) => ({ ...file, status: "done", progress: 100 })));
    } catch {
      items.forEach((item) => updateFile(item.id, (file) => ({ ...file, status: "failed", progress: 100, error: dictionary.converter.pdfError })));
      setNotice(dictionary.converter.batchError);
    }
  };

  const convertImageBatchToPdf = async (items: ConversionFile[]) => {
    items.forEach((item) => updateFile(item.id, (file) => ({ ...file, status: "converting", progress: 10, error: undefined })));
    try {
      const blob = await convertImagesToPdf(items.map((item) => item.file), pdfImageQuality);
      const asset = createAsset(blob, "wendarca-images.pdf");
      setBatchAssets((current) => [...current, asset]);
      items.forEach((item) => updateFile(item.id, (file) => ({ ...file, status: "done", progress: 100 })));
    } catch {
      items.forEach((item) => updateFile(item.id, (file) => ({ ...file, status: "failed", progress: 100, error: dictionary.converter.pdfError })));
      setNotice(dictionary.converter.batchError);
    }
  };

  const convertPresentationMerge = async (items: ConversionFile[]) => {
    items.forEach((item) => updateFile(item.id, (file) => ({ ...file, status: "converting", progress: 10, error: undefined })));
    try {
      const blob = await convertPptxFilesToMergedPdf(items.map((item) => item.file), presentationQuality, (progress) => {
        items.forEach((item) => updateFile(item.id, (file) => ({ ...file, progress })));
      });
      const asset = createAsset(blob, "wendarca-presentations.pdf");
      setBatchAssets((current) => [...current, asset]);
      items.forEach((item) => updateFile(item.id, (file) => ({ ...file, status: "done", progress: 100 })));
    } catch {
      items.forEach((item) =>
        updateFile(item.id, (file) => ({ ...file, status: "failed", progress: 100, error: dictionary.converter.presentationError })),
      );
      setNotice(dictionary.converter.batchError);
    }
  };

  const convertVideo = async (item: ConversionFile): Promise<Blob> => {
    const { convertVideoToWebM, getVideoEngine } = await import("@/lib/videoConverter");
    setIsPreparingVideo(true);
    setNotice(dictionary.converter.preparingVideo);
    await getVideoEngine();
    setIsPreparingVideo(false);
    return convertVideoToWebM(item.file, { quality: videoQuality, maxWidth }, (progress) => {
      updateFile(item.id, (file) => ({ ...file, progress }));
    });
  };

  const downloadZip = async () => {
    const convertedFiles = files.filter((file) => file.converted);
    if (convertedFiles.length === 0 && batchAssets.length === 0) {
      setNotice(dictionary.converter.noConverted);
      return;
    }

    const blob = await createZipFromConvertedFiles(convertedFiles, batchAssets);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "wendarca-files.zip";
    link.click();
    URL.revokeObjectURL(url);
    setNotice(dictionary.converter.zipReady);
  };

  const revokeBatchAsset = () => {
    setBatchAssets((current) => {
      current.forEach((asset) => URL.revokeObjectURL(asset.url));
      return [];
    });
  };

  const tabs: Array<{ id: ConverterTab; label: string }> = [
    { id: "images", label: dictionary.converter.tabs.images },
    { id: "videos", label: dictionary.converter.tabs.videos },
    { id: "pdfs", label: dictionary.converter.tabs.pdfs },
    { id: "presentations", label: dictionary.converter.tabs.presentations },
    { id: "imageFormats", label: dictionary.converter.tabs.imageFormats },
    { id: "heic", label: dictionary.converter.tabs.heic },
    { id: "office", label: dictionary.converter.tabs.office },
    { id: "wordPdf", label: dictionary.converter.tabs.wordPdf },
    { id: "excelPdf", label: dictionary.converter.tabs.excelPdf },
    { id: "all", label: dictionary.converter.tabs.all },
  ];

  return (
    <section id="converter" className="container-nest py-12 md:py-18">
      <div className="glass-card overflow-hidden rounded-[2rem] p-4 md:p-6">
        <div className="mb-4 flex items-center gap-2 px-1 text-xs font-bold uppercase tracking-[0.18em] text-[#FB4D27]">
          <span className="h-2 w-2 rounded-full bg-[#FB4D27]" aria-hidden="true" />
          {dictionary.converter.workspaceLabel}
        </div>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-[#000000] md:text-4xl">{dictionary.converter.title}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#797979] md:text-base">{dictionary.converter.subtitle}</p>
          </div>
          <div className="grid gap-2 rounded-3xl border border-[#D8D8D8] bg-[#F2F2F2]/80 p-4 text-sm text-[#797979] shadow-sm sm:grid-cols-2 lg:w-[38rem]">
            <p className="font-semibold text-[#000000] sm:col-span-2">{dictionary.converter.supported}</p>
            <p className="rounded-2xl bg-white/70 px-3 py-2">{dictionary.converter.imageFormats}</p>
            <p className="rounded-2xl bg-white/70 px-3 py-2">{dictionary.converter.videoFormats}</p>
            <p className="rounded-2xl bg-white/70 px-3 py-2">{dictionary.converter.pdfFormats}</p>
            <p className="rounded-2xl bg-white/70 px-3 py-2">{dictionary.converter.presentationFormats}</p>
            <p className="rounded-2xl bg-white/70 px-3 py-2">{dictionary.converter.rasterFormats}</p>
            <p className="rounded-2xl bg-white/70 px-3 py-2">{dictionary.converter.heicFormats}</p>
            <p className="rounded-2xl bg-white/70 px-3 py-2 sm:col-span-2">{dictionary.converter.officeFormats}</p>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap gap-2 rounded-3xl border border-[#D8D8D8] bg-[#EDEDED]/70 p-1.5 shadow-inner">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`min-h-11 flex-1 rounded-2xl px-4 text-sm font-semibold transition duration-300 sm:flex-none ${
                activeTab === tab.id ? "bg-white text-[#000000] shadow-[0_10px_24px_rgba(31,41,51,0.10)]" : "text-[#797979] hover:bg-white/50 hover:text-[#000000]"
              }`}
              aria-pressed={activeTab === tab.id}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            <Dropzone
              {...dropzoneCopyForTab(dictionary, activeTab)}
              onFiles={addFiles}
              disabled={isConverting}
            />
            {activeTab === "images" ? (
              <ImageControls
                dictionary={dictionary}
                imageQuality={imageQuality}
                onImageQualityChange={setImageQuality}
                targetImageSizeKb={targetImageSizeKb}
                onTargetImageSizeKbChange={setTargetImageSizeKb}
                disabled={isConverting}
              />
            ) : null}
            {activeTab === "videos" ? (
              <>
                <VideoControls
                  dictionary={dictionary}
                  videoQuality={videoQuality}
                  onVideoQualityChange={setVideoQuality}
                  maxWidth={maxWidth}
                  onMaxWidthChange={setMaxWidth}
                  disabled={isConverting}
                />
                <p className="flex items-start gap-2 text-sm text-[#797979]">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#B7791F]" aria-hidden="true" />
                  {dictionary.converter.largeVideoNote}
                </p>
              </>
            ) : null}
            {activeTab === "pdfs" ? (
              <PdfControls
                dictionary={dictionary}
                imageOutput={imageOutput === "pdf" ? "pdf" : "webp"}
                onImageOutputChange={setImageOutput}
                pdfAction={pdfAction}
                onPdfActionChange={setPdfAction}
                pdfImageQuality={pdfImageQuality}
                onPdfImageQualityChange={setPdfImageQuality}
                disabled={isConverting}
              />
            ) : null}
            {activeTab === "presentations" ? (
              <PresentationControls
                dictionary={dictionary}
                action={presentationAction}
                onActionChange={setPresentationAction}
                quality={presentationQuality}
                onQualityChange={setPresentationQuality}
                disabled={isConverting}
              />
            ) : null}
            {activeTab === "imageFormats" ? (
              <ImageFormatControls
                dictionary={dictionary}
                rasterOutput={rasterOutput}
                onRasterOutputChange={setRasterOutput}
                disabled={isConverting}
              />
            ) : null}
            {activeTab === "heic" ? (
              <HeicControls
                dictionary={dictionary}
                heicOutput={heicOutput}
                onHeicOutputChange={setHeicOutput}
                disabled={isConverting}
              />
            ) : null}
            {activeTab === "office" ? (
              <OfficeControls
                dictionary={dictionary}
                officeAction={officeAction}
                onOfficeActionChange={setOfficeAction}
                disabled={isConverting}
              />
            ) : null}
            {activeTab === "wordPdf" ? (
              <OfficePdfControls title={dictionary.controls.wordPdfAction} description={dictionary.controls.wordPdfHint} />
            ) : null}
            {activeTab === "excelPdf" ? (
              <OfficePdfControls title={dictionary.controls.excelPdfAction} description={dictionary.controls.excelPdfHint} />
            ) : null}
            {activeTab === "all" ? (
              <AllFilesControls
                dictionary={dictionary}
                imageOutput={imageOutput}
                onImageOutputChange={setImageOutput}
                pdfAction={pdfAction}
                onPdfActionChange={setPdfAction}
                presentationAction={presentationAction}
                onPresentationActionChange={setPresentationAction}
                rasterOutput={rasterOutput}
                onRasterOutputChange={setRasterOutput}
                heicOutput={heicOutput}
                onHeicOutputChange={setHeicOutput}
                officeAction={officeAction}
                onOfficeActionChange={setOfficeAction}
                videoQuality={videoQuality}
                onVideoQualityChange={setVideoQuality}
                maxWidth={maxWidth}
                onMaxWidthChange={setMaxWidth}
                disabled={isConverting}
              />
            ) : null}
          </div>

          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={convertAll}
                disabled={isConverting || activeFiles.length === 0}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#FB4D27] px-5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#C93418] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isConverting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Sparkles className="h-4 w-4" aria-hidden="true" />}
                {isPreparingVideo ? dictionary.converter.preparingVideo : isConverting ? dictionary.converter.converting : dictionary.converter.convertAll}
              </button>
              <button
                type="button"
                onClick={clearAll}
                disabled={isConverting || activeFiles.length === 0}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#D8D8D8] bg-white/86 px-5 text-sm font-semibold text-[#000000] shadow-sm transition hover:-translate-y-0.5 hover:border-[#FB4D27] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                {dictionary.converter.clearAll}
              </button>
              <button
                type="button"
                onClick={downloadZip}
                disabled={isConverting || (files.every((file) => !file.converted) && batchAssets.length === 0)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#D8D8D8] bg-white/86 px-5 text-sm font-semibold text-[#000000] shadow-sm transition hover:-translate-y-0.5 hover:border-[#FB4D27] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Archive className="h-4 w-4" aria-hidden="true" />
                {dictionary.converter.downloadZip}
              </button>
            </div>
            {notice ? (
              <div className="rounded-3xl border border-[#D8D8D8] bg-[#F2F2F2]/86 px-4 py-3 text-sm text-[#797979] shadow-sm" role="status">
                {notice}
              </div>
            ) : null}
            {batchAssets.length > 0 ? (
              <div className="space-y-3 rounded-3xl border border-[#FFD0C2] bg-[#FFF1EC] p-4 text-sm text-[#FB4D27] shadow-sm">
                <p className="font-semibold text-[#000000]">{dictionary.converter.batchOutput}</p>
                {batchAssets.map((asset) => (
                  <div key={asset.url} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p>{asset.fileName}</p>
                    <a
                      href={asset.url}
                      download={asset.fileName}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#FB4D27] px-4 text-sm font-semibold text-white"
                    >
                      <Download className="h-4 w-4" aria-hidden="true" />
                      {dictionary.converter.downloadBatch}
                    </a>
                  </div>
                ))}
              </div>
            ) : null}
            <FileQueue files={visibleFiles} dictionary={dictionary} onRemove={removeFile} />
          </div>
        </div>
      </div>
    </section>
  );
}

type TargetOptions = {
  activeTab: ConverterTab;
  imageOutput: ImageOutputFormat;
  pdfAction: PdfAction;
  rasterOutput: RasterOutputFormat;
  heicOutput: HeicOutputFormat;
  officeAction: OfficeAction;
};

function createQueueItem(file: File, kind: ConversionFile["kind"], options: TargetOptions): ConversionFile {
  return {
    id: createConversionId(),
    file,
    kind,
    originalName: file.name,
    originalType: getFileExtension(file.name) || file.type || "file",
    originalSize: file.size,
    targetFormat: targetFormatForKind(kind, options),
    status: "waiting",
    progress: 0,
  };
}

function targetFormatForKind(kind: ConversionFile["kind"], options: TargetOptions): ConversionFile["targetFormat"] {
  if (kind === "image") {
    if (options.activeTab === "imageFormats") return options.rasterOutput;
    if (options.activeTab === "pdfs") return options.imageOutput === "pdf" ? "pdf" : "webp";
    return options.imageOutput;
  }
  if (kind === "video") return "webm";
  if (kind === "presentation") return "pdf";
  if (kind === "heic") return options.heicOutput;
  if (kind === "word") return options.activeTab === "wordPdf" || options.officeAction === "word-to-pdf" ? "pdf" : "xlsx";
  if (kind === "excel") return options.activeTab === "excelPdf" || options.officeAction === "excel-to-pdf" ? "pdf" : "docx";
  if (options.pdfAction === "merge") return "pdf";
  return "zip";
}

function isFileRelevantForTab(file: ConversionFile, tab: ConverterTab): boolean {
  if (tab === "images") return file.kind === "image";
  if (tab === "videos") return file.kind === "video";
  if (tab === "pdfs") return file.kind === "pdf" || file.kind === "image";
  if (tab === "presentations") return file.kind === "presentation";
  if (tab === "imageFormats") return file.kind === "image";
  if (tab === "heic") return file.kind === "heic";
  if (tab === "office") return file.kind === "word" || file.kind === "excel";
  if (tab === "wordPdf") return file.kind === "word";
  if (tab === "excelPdf") return file.kind === "excel";
  return true;
}

function dropzoneCopyForTab(dictionary: Dictionary, tab: ConverterTab) {
  const accept = {
    images: ".png,.jpg,.jpeg,image/png,image/jpeg",
    videos: ".mp4,.mov,.avi,.mkv,.m4v,video/*",
    pdfs: ".png,.jpg,.jpeg,.pdf,image/png,image/jpeg,application/pdf",
    presentations: ".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation",
    imageFormats: ".png,.jpg,.jpeg,image/png,image/jpeg",
    heic: ".heic,.heif,image/heic,image/heif",
    office: ".docx,.xlsx,.xls,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel",
    wordPdf: ".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    excelPdf: ".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel",
    all: ".png,.jpg,.jpeg,.heic,.heif,.pdf,.pptx,.docx,.xlsx,.xls,.mp4,.mov,.avi,.mkv,.m4v,image/png,image/jpeg,image/heic,image/heif,application/pdf,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,video/*",
  } satisfies Record<ConverterTab, string>;

  return {
    title: dictionary.converter.dropzone[tab].title,
    activeTitle: dictionary.converter.dropzone[tab].active,
    subtitle: dictionary.converter.dropzone[tab].subtitle,
    browseLabel: dictionary.converter.browse,
    accept: accept[tab],
  };
}

function createAsset(blob: Blob, fileName: string): ConvertedAsset {
  return {
    blob,
    url: URL.createObjectURL(blob),
    fileName,
    size: blob.size,
  };
}
