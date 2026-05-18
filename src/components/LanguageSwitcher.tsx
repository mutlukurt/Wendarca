"use client";

import type { Language } from "@/types/conversion";

interface LanguageSwitcherProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export function LanguageSwitcher({ language, onLanguageChange }: LanguageSwitcherProps) {
  return (
    <div className="flex rounded-full border border-[#E8E1D6] bg-white p-1 shadow-sm" aria-label="Language switcher">
      {(["en", "tr"] as const).map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onLanguageChange(item)}
          className={`h-9 rounded-full px-3 text-sm font-medium transition ${
            language === item ? "bg-[#1F2933] text-white" : "text-[#6B6B6B] hover:text-[#171717]"
          }`}
          aria-pressed={language === item}
        >
          {item.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
