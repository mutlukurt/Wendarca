import type { Dictionary } from "@/i18n";
import { ConversionIllustration } from "@/components/ConversionIllustration";

interface HeroProps {
  dictionary: Dictionary;
}

export function Hero({ dictionary }: HeroProps) {
  return (
    <section className="container-nest grid gap-10 py-14 md:py-20 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
      <div>
        <p className="mb-5 inline-flex rounded-full border border-[#E8E1D6] bg-white px-4 py-2 text-sm font-medium text-[#2F5D50] shadow-sm">
          {dictionary.hero.eyebrow}
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-[#171717] sm:text-5xl lg:text-6xl">
          {dictionary.hero.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#6B6B6B]">{dictionary.hero.subtitle}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href="#converter" className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#1F2933] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#111827]">
            {dictionary.hero.primary}
          </a>
          <a href="#privacy" className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#DCD3C4] bg-white px-6 text-sm font-semibold text-[#1F2933] shadow-sm transition hover:border-[#BFB4A6]">
            {dictionary.hero.secondary}
          </a>
        </div>
      </div>
      <ConversionIllustration dictionary={dictionary} />
    </section>
  );
}
