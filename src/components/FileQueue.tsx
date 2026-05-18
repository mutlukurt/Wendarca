"use client";

import type { Dictionary } from "@/i18n";
import type { ConversionFile } from "@/types/conversion";
import { FileItem } from "@/components/FileItem";

interface FileQueueProps {
  files: ConversionFile[];
  dictionary: Dictionary;
  onRemove: (id: string) => void;
}

export function FileQueue({ files, dictionary, onRemove }: FileQueueProps) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-[#171717]">{dictionary.converter.queueTitle}</h3>
        <span className="rounded-full border border-[#E8E1D6] bg-[#FAF8F3] px-3 py-1 text-xs font-medium text-[#6B6B6B]">
          {files.length}
        </span>
      </div>
      {files.length === 0 ? (
        <div className="rounded-2xl border border-[#E8E1D6] bg-[#FDFCF8] p-6 text-sm text-[#6B6B6B]">
          {dictionary.converter.emptyQueue}
        </div>
      ) : (
        <ul className="max-h-[480px] space-y-3 overflow-y-auto pr-1">
          {files.map((file) => (
            <FileItem key={file.id} item={file} dictionary={dictionary} onRemove={onRemove} />
          ))}
        </ul>
      )}
    </div>
  );
}
