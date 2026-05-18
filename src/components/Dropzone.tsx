"use client";

import { UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import type { Dictionary } from "@/i18n";

interface DropzoneProps {
  title: string;
  activeTitle: string;
  subtitle: string;
  browseLabel: string;
  accept: string;
  onFiles: (files: File[]) => void;
  disabled: boolean;
}

export function Dropzone({ title, activeTitle, subtitle, browseLabel, accept, onFiles, disabled }: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div
      onDragEnter={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        onFiles(Array.from(event.dataTransfer.files));
      }}
      className={`rounded-2xl border border-dashed p-7 text-center transition ${
        isDragging ? "border-[#2F5D50] bg-[#F4F1EA]" : "border-[#DCD3C4] bg-[#FDFCF8]"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        className="sr-only"
        accept={accept}
        disabled={disabled}
        onChange={(event) => {
          onFiles(Array.from(event.target.files ?? []));
          event.target.value = "";
        }}
      />
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#E8E1D6] bg-white text-[#2F5D50] shadow-sm">
        <UploadCloud className="h-6 w-6" aria-hidden="true" />
      </div>
      <p className="mt-4 text-base font-semibold text-[#171717]">
        {isDragging ? activeTitle : title}
      </p>
      <p className="mt-1 text-sm text-[#6B6B6B]">{subtitle}</p>
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className="mt-5 inline-flex h-11 items-center justify-center rounded-2xl bg-[#1F2933] px-5 text-sm font-semibold text-white transition hover:bg-[#111827] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {browseLabel}
      </button>
    </div>
  );
}
