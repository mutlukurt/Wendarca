"use client";

import { UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
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
      className={`group rounded-3xl border border-dashed p-7 text-center shadow-sm transition duration-300 ${
        isDragging ? "border-[#FB4D27] bg-[#FFF1EC] shadow-[0_20px_50px_rgba(251, 77, 39,0.12)]" : "border-[#D8D8D8] bg-[#FFFFFF]/86 hover:border-[#FB4D27] hover:bg-white"
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
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-[#D8D8D8] bg-white text-[#FB4D27] shadow-[0_14px_35px_rgba(31,41,51,0.08)] transition group-hover:-translate-y-1">
        <UploadCloud className="h-6 w-6" aria-hidden="true" />
      </div>
      <p className="mx-auto mt-5 max-w-md text-xl font-semibold leading-tight text-[#000000]">
        {isDragging ? activeTitle : title}
      </p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#797979]">{subtitle}</p>
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-[#000000] px-6 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#C93418] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {browseLabel}
      </button>
    </div>
  );
}
