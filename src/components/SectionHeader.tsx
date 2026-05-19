interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export function SectionHeader({ eyebrow, title, subtitle, align = "left" }: SectionHeaderProps) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow ? (
        <p className="mb-3 inline-flex rounded-full border border-[#FFD0C2] bg-[#FFF1EC] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#FB4D27]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-semibold text-[#000000] md:text-4xl">{title}</h2>
      {subtitle ? <p className="mt-4 text-base leading-7 text-[#797979] md:text-lg">{subtitle}</p> : null}
    </div>
  );
}
