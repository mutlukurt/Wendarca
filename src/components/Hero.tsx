import { CheckCircle2 } from "lucide-react";
import type { Dictionary } from "@/i18n";
import { HeroVisual } from "@/components/HeroVisual";

interface HeroProps {
  dictionary: Dictionary;
}

export function Hero({ dictionary }: HeroProps) {
  return (
    <section className="container-nest grid gap-12 pb-12 pt-28 md:pb-16 md:pt-32 lg:grid-cols-[0.96fr_1.04fr] lg:items-center">
      <div className="animate-reveal-up">
        <p className="inline-flex items-center gap-2 rounded-full border border-[#FFD0C2] bg-white/78 px-4 py-2 text-sm font-semibold text-[#FB4D27] shadow-sm backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-[#FB4D27]" aria-hidden="true" />
          {dictionary.hero.eyebrow}
        </p>
        <h1 className="mt-6 max-w-3xl text-5xl font-semibold text-[#000000] sm:text-6xl lg:text-7xl">
          {dictionary.hero.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#797979] md:text-xl">{dictionary.hero.subtitle}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href="#converter"
            className="inline-flex h-13 items-center justify-center rounded-full bg-[#000000] px-7 text-sm font-semibold text-white shadow-[0_16px_38px_rgba(31,41,51,0.18)] transition hover:-translate-y-0.5 hover:bg-[#C93418] active:translate-y-0"
          >
            {dictionary.hero.primary}
          </a>
          <a
            href="#privacy"
            className="inline-flex h-13 items-center justify-center rounded-full border border-[#D8D8D8] bg-white/82 px-7 text-sm font-semibold text-[#000000] shadow-sm transition hover:-translate-y-0.5 hover:border-[#FB4D27] hover:bg-[#FFF1EC] active:translate-y-0"
          >
            {dictionary.hero.secondary}
          </a>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {dictionary.hero.trust.map((item) => (
            <div key={item} className="flex items-center gap-2 rounded-2xl border border-[#D8D8D8]/80 bg-white/58 px-4 py-3 text-sm font-semibold text-[#797979] shadow-sm backdrop-blur">
              <CheckCircle2 className="h-4 w-4 text-[#FB4D27]" aria-hidden="true" />
              {item}
            </div>
          ))}
        </div>
      </div>
      <HeroVisual dictionary={dictionary} />
    </section>
  );
}
