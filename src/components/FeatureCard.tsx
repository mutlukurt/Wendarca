import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  text: string;
  meta?: string;
}

export function FeatureCard({ icon: Icon, title, text, meta }: FeatureCardProps) {
  return (
    <article className="group rounded-3xl border border-[#D8D8D8]/90 bg-white/74 p-6 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-[#FB4D27] hover:shadow-soft">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#FFD0C2] bg-[#FFF1EC] text-[#FB4D27] transition group-hover:scale-105">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <h3 className="mt-5 text-lg font-semibold tracking-tight text-[#000000]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#797979]">{text}</p>
      {meta ? <p className="mt-4 rounded-full bg-[#F5F2EC] px-3 py-1.5 text-xs font-semibold text-[#6B675F]">{meta}</p> : null}
    </article>
  );
}
