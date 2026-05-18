import type { Dictionary } from "@/i18n";

interface FAQProps {
  dictionary: Dictionary;
}

export function FAQ({ dictionary }: FAQProps) {
  return (
    <section id="faq" className="container-nest py-14 md:py-18">
      <h2 className="text-3xl font-semibold tracking-tight text-[#171717]">{dictionary.faq.title}</h2>
      <div className="mt-8 grid gap-3">
        {dictionary.faq.items.map((item) => (
          <details key={item.question} className="group rounded-2xl border border-[#E8E1D6] bg-white p-5 shadow-sm">
            <summary className="cursor-pointer list-none text-base font-semibold text-[#171717]">
              <span className="flex items-center justify-between gap-4">
                {item.question}
                <span className="text-xl text-[#2F5D50] transition group-open:rotate-45">+</span>
              </span>
            </summary>
            <p className="mt-3 text-sm leading-6 text-[#6B6B6B]">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
