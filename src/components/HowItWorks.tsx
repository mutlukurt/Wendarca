import { Download, SlidersHorizontal, Upload } from "lucide-react";
import type { Dictionary } from "@/i18n";
import { SectionHeader } from "@/components/SectionHeader";

interface HowItWorksProps {
  dictionary: Dictionary;
}

export function HowItWorks({ dictionary }: HowItWorksProps) {
  const icons = [Upload, SlidersHorizontal, Download];

  return (
    <section id="how-it-works" className="container-nest py-14 md:py-20">
      <SectionHeader title={dictionary.how.title} />
      <div className="relative mt-9 grid gap-4 md:grid-cols-3">
        <div className="absolute left-[16%] right-[16%] top-10 hidden h-px bg-[#D8D8D8] md:block" aria-hidden="true" />
        {dictionary.how.steps.map((step, index) => {
          const Icon = icons[index];
          return (
            <article
              key={step.title}
              className="group relative rounded-3xl border border-[#D8D8D8]/90 bg-white/74 p-6 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-soft"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#FFD0C2] bg-[#FFF1EC] text-[#FB4D27] transition group-hover:scale-105">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <span className="rounded-full border border-[#D8D8D8] bg-[#F2F2F2] px-3 py-1 font-mono text-sm font-semibold text-[#797979]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-[#000000]">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#797979]">{step.text}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
