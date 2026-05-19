import { ArrowRight, ShieldCheck } from "lucide-react";
import { siGithub } from "simple-icons";
import type { Dictionary } from "@/i18n";

interface OpenSourceSectionProps {
  dictionary: Dictionary;
}

export function OpenSourceSection({ dictionary }: OpenSourceSectionProps) {
  return (
    <section className="container-nest py-8 md:py-12">
      <div className="relative overflow-hidden rounded-3xl border border-[#FFD0C2] bg-[#C93418] p-7 text-white shadow-soft md:p-10">
        <div className="absolute inset-0 dot-grid opacity-[0.12]" aria-hidden="true" />
        <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/10 px-3 py-1.5 text-sm font-semibold text-[#DCEBE4]">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              {dictionary.openSource.eyebrow}
            </p>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight md:text-4xl">{dictionary.openSource.title}</h2>
            <p className="mt-4 text-base leading-7 text-[#D7E2DD]">{dictionary.openSource.text}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
            <a
              href="https://github.com/mutlukurt"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[#C93418] transition hover:-translate-y-0.5"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                <path d={siGithub.path} />
              </svg>
              {dictionary.openSource.primary}
            </a>
            <a
              href="#privacy"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
            >
              {dictionary.openSource.secondary}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
