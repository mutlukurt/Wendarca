import { Download, SlidersHorizontal, Upload } from "lucide-react";
import type { Dictionary } from "@/i18n";

interface HowItWorksProps {
  dictionary: Dictionary;
}

export function HowItWorks({ dictionary }: HowItWorksProps) {
  const icons = [Upload, SlidersHorizontal, Download];

  return (
    <section id="how-it-works" className="container-nest py-14 md:py-18">
      <h2 className="text-3xl font-semibold tracking-tight text-[#171717]">{dictionary.how.title}</h2>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {dictionary.how.steps.map((step, index) => {
          const Icon = icons[index];
          return (
            <article key={step.title} className="rounded-2xl border border-[#E8E1D6] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FAF8F3] text-[#2F5D50]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <span className="font-mono text-sm font-semibold text-[#B8AD9C]">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-[#171717]">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#6B6B6B]">{step.text}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
