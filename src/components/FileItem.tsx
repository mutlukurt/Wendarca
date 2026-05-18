"use client";

import { CheckCircle2, Download, FileImage, FileText, FileVideo, Trash2, XCircle } from "lucide-react";
import type { Dictionary } from "@/i18n";
import { calculateCompression, formatBytes } from "@/lib/fileUtils";
import type { ConversionFile } from "@/types/conversion";

interface FileItemProps {
  item: ConversionFile;
  dictionary: Dictionary;
  onRemove: (id: string) => void;
}

export function FileItem({ item, dictionary, onRemove }: FileItemProps) {
  const compression = calculateCompression(item.originalSize, item.converted?.size);
  const statusLabel = dictionary.converter.status[item.status];

  return (
    <li className="rounded-2xl border border-[#E8E1D6] bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FAF8F3] text-[#2F5D50]">
            {item.kind === "image" ? <FileImage className="h-5 w-5" /> : item.kind === "video" ? <FileVideo className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#171717]">{item.originalName}</p>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#6B6B6B]">
              <span>{dictionary.converter.table.original}: {item.originalType.toUpperCase()} · {formatBytes(item.originalSize)}</span>
              <span>{dictionary.converter.table.target}: {item.targetFormat.toUpperCase()}</span>
              {item.converted ? <span>{dictionary.converter.table.after}: {formatBytes(item.converted.size)}</span> : null}
              {compression !== null ? (
                <span>{dictionary.converter.table.compression}: {compression > 0 ? `${compression}%` : "0%"}</span>
              ) : null}
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <StatusPill status={item.status} label={statusLabel} />
          {item.converted ? (
            <a
              href={item.converted.url}
              download={item.converted.fileName}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E8E1D6] text-[#1F2933] transition hover:border-[#BFB4A6]"
              aria-label={`${dictionary.converter.actions.download} ${item.originalName}`}
            >
              <Download className="h-4 w-4" aria-hidden="true" />
            </a>
          ) : null}
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E8E1D6] text-[#6B6B6B] transition hover:border-[#B42318] hover:text-[#B42318]"
            aria-label={`${dictionary.converter.actions.remove} ${item.originalName}`}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#EFE9DF]" aria-label={statusLabel}>
        <div
          className={`h-full rounded-full transition-all ${
            item.status === "failed" ? "bg-[#B42318]" : item.status === "done" ? "bg-[#2F7D5A]" : "bg-[#2F5D50]"
          }`}
          style={{ width: `${item.progress}%` }}
        />
      </div>
      {item.error ? (
        <p className="mt-3 flex items-start gap-2 text-sm text-[#B42318]">
          <XCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {item.error}
        </p>
      ) : null}
    </li>
  );
}

function StatusPill({ status, label }: { status: ConversionFile["status"]; label: string }) {
  const className =
    status === "done"
      ? "border-[#CDE8DA] bg-[#F0FAF4] text-[#2F7D5A]"
      : status === "failed"
        ? "border-[#F4C7C3] bg-[#FFF4F2] text-[#B42318]"
        : status === "converting"
          ? "border-[#F0D7A8] bg-[#FFF8EA] text-[#B7791F]"
          : "border-[#E8E1D6] bg-[#FAF8F3] text-[#6B6B6B]";

  return (
    <span className={`inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold ${className}`}>
      {status === "done" ? <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> : null}
      {label}
    </span>
  );
}
