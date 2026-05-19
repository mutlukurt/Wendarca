import { Archive, FileImage, FileSpreadsheet, FileText, Presentation, Video } from "lucide-react";
import type { Dictionary } from "@/i18n";
import { FeatureCard } from "@/components/FeatureCard";
import { SectionHeader } from "@/components/SectionHeader";

interface SupportedFormatsProps {
  dictionary: Dictionary;
}

export function SupportedFormats({ dictionary }: SupportedFormatsProps) {
  const icons = [FileImage, Video, FileText, Presentation, FileImage, FileSpreadsheet, Archive];

  return (
    <section className="container-nest py-14 md:py-20">
      <SectionHeader eyebrow={dictionary.formats.eyebrow} title={dictionary.formats.title} subtitle={dictionary.formats.subtitle} />
      <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {dictionary.formats.items.map((item, index) => (
          <FeatureCard key={item.title} icon={icons[index]} title={item.title} text={item.text} meta={item.meta} />
        ))}
      </div>
    </section>
  );
}
