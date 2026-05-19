"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { Dictionary } from "@/i18n";
import { SectionHeader } from "@/components/SectionHeader";

interface FAQProps {
  dictionary: Dictionary;
}

export function FAQ({ dictionary }: FAQProps) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="container-nest py-14 md:py-20">
      <SectionHeader title={dictionary.faq.title} />
      <div className="mt-9 grid gap-3">
        {dictionary.faq.items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={item.question} className="rounded-3xl border border-[#D8D8D8]/90 bg-white/76 shadow-sm backdrop-blur">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left text-base font-semibold text-[#000000] transition hover:text-[#FB4D27] md:px-6"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
              >
                {item.question}
                <ChevronDown className={`h-5 w-5 shrink-0 text-[#FB4D27] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>
              <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm leading-6 text-[#797979] md:px-6">{item.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
