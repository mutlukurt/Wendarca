import { CloudOff, Layers, LockKeyhole, UserRoundX } from "lucide-react";
import type { Dictionary } from "@/i18n";
import { FeatureCard } from "@/components/FeatureCard";
import { SectionHeader } from "@/components/SectionHeader";

interface PrivacySectionProps {
  dictionary: Dictionary;
}

export function PrivacySection({ dictionary }: PrivacySectionProps) {
  const cards = [
    { icon: LockKeyhole, title: dictionary.privacy.local.title, text: dictionary.privacy.local.text },
    { icon: UserRoundX, title: dictionary.privacy.account.title, text: dictionary.privacy.account.text },
    { icon: CloudOff, title: dictionary.privacy.storage.title, text: dictionary.privacy.storage.text },
    { icon: Layers, title: dictionary.privacy.batch.title, text: dictionary.privacy.batch.text },
  ];

  return (
    <section id="privacy" className="relative border-y border-[#D8D8D8]/80 bg-[#F2F2F2]/72 py-14 md:py-20">
      <div className="absolute inset-0 dot-grid opacity-[0.18]" aria-hidden="true" />
      <div className="container-nest relative">
        <SectionHeader title={dictionary.privacy.title} subtitle={dictionary.privacy.subtitle} />
        <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <FeatureCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}
