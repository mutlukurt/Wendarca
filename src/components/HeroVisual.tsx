import { Archive, FileImage, FileText, FileVideo, MonitorUp, ShieldCheck } from "lucide-react";
import type { Dictionary } from "@/i18n";

interface HeroVisualProps {
  dictionary: Dictionary;
}

export function HeroVisual({ dictionary }: HeroVisualProps) {
  const inputs = [
    { label: "PNG", icon: FileImage },
    { label: "PDF", icon: FileText },
    { label: "PPTX", icon: MonitorUp },
    { label: "MP4", icon: FileVideo },
  ];
  const outputs = ["WebP", "WebM", "PDF", "ZIP"];

  return (
    <div className="relative mx-auto w-full max-w-[560px] animate-reveal-up [animation-delay:180ms]">
      <div className="absolute -inset-6 rounded-[2rem] bg-[radial-gradient(circle_at_50%_40%,rgba(251, 77, 39,0.18),transparent_62%)]" />
      <div className="relative overflow-hidden rounded-[2rem] border border-[#D8D8D8] bg-white/78 p-5 shadow-soft backdrop-blur-xl">
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="relative grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#797979]">{dictionary.illustration.input}</p>
            {inputs.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="animate-float-soft rounded-2xl border border-[#D8D8D8] bg-[#FFFFFF] p-3 shadow-sm"
                  style={{ animationDelay: `${index * 220}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#FB4D27] shadow-sm">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="font-mono text-sm font-semibold text-[#000000]">{item.label}</span>
                    <span className="ml-auto rounded-full bg-[#FFF1EC] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#FB4D27]">
                      {dictionary.illustration.local}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="relative hidden h-64 w-24 items-center justify-center md:flex">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 96 256" fill="none" aria-hidden="true">
              <path className="animate-flow" d="M8 52 C54 52 42 128 88 128 C42 128 54 204 8 204" stroke="#FB4D27" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-[#FFD0C2] bg-[#FFF1EC] text-[#FB4D27] shadow-premium">
              <ShieldCheck className="h-8 w-8" aria-hidden="true" />
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#797979]">{dictionary.illustration.output}</p>
            <div className="rounded-3xl border border-[#D8D8D8] bg-[#000000] p-4 text-white shadow-premium">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-semibold">{dictionary.illustration.engine}</span>
                <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#FFD0C2]">
                  {dictionary.illustration.ready}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {outputs.map((output) => (
                  <div key={output} className="rounded-2xl border border-white/10 bg-white/[0.07] p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-sm font-semibold">{output}</span>
                      {output === "ZIP" ? <Archive className="h-4 w-4 text-[#FFD0C2]" aria-hidden="true" /> : null}
                    </div>
                    <div className="mt-3 h-1.5 rounded-full bg-white/10">
                      <div className="h-full w-3/4 rounded-full bg-[#FFD0C2]" />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs leading-5 text-white/62">{dictionary.illustration.compress} · {dictionary.illustration.local}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
