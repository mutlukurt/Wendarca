"use client";

import type { Language } from "@/types/conversion";

interface LanguageSwitcherProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
  variant?: "light" | "dark";
}

export function LanguageSwitcher({ language, onLanguageChange, variant = "light" }: LanguageSwitcherProps) {
  const isDark = variant === "dark";

  return (
    <div
      className={`flex rounded-2xl border p-1 shadow-sm ${
        isDark ? "border-white/14 bg-white/[0.08]" : "border-[#D8D8D8] bg-white"
      }`}
      aria-label="Language switcher"
    >
      {(["en", "tr"] as const).map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onLanguageChange(item)}
          className={`h-9 rounded-xl px-3 text-sm font-semibold transition ${
            language === item
              ? isDark
                ? "bg-white text-black"
                : "bg-[#000000] text-white"
              : isDark
                ? "text-white/68 hover:text-white"
                : "text-[#797979] hover:text-[#000000]"
          }`}
          aria-pressed={language === item}
        >
          {item.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
