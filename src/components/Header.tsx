"use client";

import { Github } from "lucide-react";
import type { Dictionary } from "@/i18n";
import type { Language } from "@/types/conversion";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@/components/Logo";

interface HeaderProps {
  dictionary: Dictionary;
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export function Header({ dictionary, language, onLanguageChange }: HeaderProps) {
  const navItems = [
    { href: "#converter", label: dictionary.header.converter },
    { href: "#how-it-works", label: dictionary.header.howItWorks },
    { href: "#privacy", label: dictionary.header.privacy },
    { href: "#faq", label: dictionary.header.faq },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[#E8E1D6]/80 bg-[#FAF8F3]/95 backdrop-blur-sm">
      <div className="container-nest flex min-h-20 items-center justify-between gap-4">
        <a href="#" className="shrink-0" aria-label="Wendarca home">
          <Logo />
        </a>
        <nav className="hidden items-center gap-6 text-sm font-medium text-[#6B6B6B] md:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="transition hover:text-[#171717]">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher language={language} onLanguageChange={onLanguageChange} />
          <a
            href="https://github.com/mutlukurt"
            target="_blank"
            rel="noreferrer"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-[#E8E1D6] bg-white text-[#1F2933] shadow-sm transition hover:border-[#CFC4B4] sm:flex"
            aria-label={dictionary.header.github}
          >
            <Github className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </header>
  );
}
