import { Layers, LockKeyhole, UserRoundX } from "lucide-react";
import type { Dictionary } from "@/i18n";

interface PrivacySectionProps {
  dictionary: Dictionary;
}

export function PrivacySection({ dictionary }: PrivacySectionProps) {
  const cards = [
    { icon: LockKeyhole, title: dictionary.privacy.local.title, text: dictionary.privacy.local.text },
    { icon: UserRoundX, title: dictionary.privacy.account.title, text: dictionary.privacy.account.text },
    { icon: Layers, title: dictionary.privacy.batch.title, text: dictionary.privacy.batch.text },
  ];

  return (
    <section id="privacy" className="border-y border-[#E8E1D6] bg-[#F7F4EE] py-14 md:py-18">
      <div className="container-nest">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight text-[#171717]">{dictionary.privacy.title}</h2>
          <p className="mt-4 text-lg leading-8 text-[#6B6B6B]">{dictionary.privacy.subtitle}</p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {cards.map((card) => (
            <article key={card.title} className="rounded-2xl border border-[#E8E1D6] bg-white p-5 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FAF8F3] text-[#2F5D50]">
                <card.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-base font-semibold text-[#171717]">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#6B6B6B]">{card.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
