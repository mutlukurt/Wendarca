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
        <h3 className="text-lg font-semibold text-[#000000]">{dictionary.converter.queueTitle}</h3>
        <span className="rounded-full border border-[#D8D8D8] bg-[#F2F2F2] px-3 py-1 text-xs font-semibold text-[#797979]">
          {files.length}
        </span>
      </div>
      {files.length === 0 ? (
        <div className="rounded-3xl border border-[#D8D8D8] bg-[#FFFFFF]/86 p-8 text-center text-sm leading-6 text-[#797979] shadow-sm">
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
