import { ArrowRight, FileImage, FileVideo, Gauge, Lock, Sparkles } from "lucide-react";
import { siWebassembly } from "simple-icons";
import type { ReactNode } from "react";
import type { Dictionary } from "@/i18n";

interface ConversionIllustrationProps {
  dictionary: Dictionary;
}

export function ConversionIllustration({ dictionary }: ConversionIllustrationProps) {
  return (
    <div className="relative rounded-2xl border border-[#E8E1D6] bg-white p-5 shadow-premium">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-center">
        <FileStack title={dictionary.illustration.images} icon={<FileImage className="h-5 w-5" />} chips={["PNG", "JPG"]} />
        <ArrowRight className="mx-auto hidden h-5 w-5 text-[#A79C8D] lg:block" aria-hidden="true" />
        <div className="rounded-2xl border border-[#DCD3C4] bg-[#FAF8F3] p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#1F2933]">
              <Gauge className="h-4 w-4 text-[#2F5D50]" aria-hidden="true" />
              {dictionary.illustration.engine}
            </div>
            <div className="flex items-center gap-2 text-[#2F5D50]">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                <path d={siWebassembly.path} />
              </svg>
              <Lock className="h-4 w-4" aria-hidden="true" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-2 rounded-full bg-[#E8E1D6]">
              <div className="h-2 w-3/4 rounded-full bg-[#2F5D50]" />
            </div>
            <div className="h-2 rounded-full bg-[#E8E1D6]">
              <div className="h-2 w-1/2 rounded-full bg-[#1F2933]" />
            </div>
          </div>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#DCD3C4] bg-white px-3 py-1 text-xs font-medium text-[#2F5D50]">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {dictionary.illustration.compress}
          </div>
        </div>
        <ArrowRight className="mx-auto hidden h-5 w-5 text-[#A79C8D] lg:block" aria-hidden="true" />
        <OutputStack title={dictionary.illustration.output} readyLabel={dictionary.illustration.ready} />
      </div>
      <div className="mt-4">
        <FileStack title={dictionary.illustration.videos} icon={<FileVideo className="h-5 w-5" />} chips={["MP4", "MOV", "MKV"]} compact />
      </div>
    </div>
  );
}

function FileStack({ title, icon, chips, compact = false }: { title: string; icon: ReactNode; chips: string[]; compact?: boolean }) {
  return (
    <div className={`rounded-2xl border border-[#E8E1D6] bg-[#FDFCF8] p-4 ${compact ? "lg:w-2/3" : ""}`}>
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#1F2933]">
        <span className="text-[#2F5D50]">{icon}</span>
        {title}
      </div>
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <span key={chip} className="rounded-xl border border-[#E8E1D6] bg-white px-3 py-2 text-xs font-semibold text-[#6B6B6B]">
            {chip}
          </span>
        ))}
      </div>
    </div>
  );
}

function OutputStack({ title, readyLabel }: { title: string; readyLabel: string }) {
  const outputs = [
    { label: "WebP" },
    { label: "WebM" },
    { label: "PDF" },
  ];

  return (
    <div className="rounded-2xl border border-[#E8E1D6] bg-[#FDFCF8] p-4">
      <p className="mb-3 text-sm font-semibold text-[#1F2933]">{title}</p>
      <div className="space-y-2">
        {outputs.map((output) => (
          <div key={output.label} className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-[#E8E1D6] bg-white px-3 py-2">
            <div className="flex min-w-0 items-center gap-2 text-sm font-semibold text-[#171717]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#2F5D50]" aria-hidden="true" />
              {output.label}
            </div>
            <span className="shrink-0 rounded-full bg-[#F0FAF4] px-2 py-0.5 text-xs font-medium text-[#2F7D5A]">{readyLabel}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
