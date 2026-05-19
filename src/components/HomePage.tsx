"use client";

import { useEffect, useMemo, useState } from "react";
import { getDictionary } from "@/i18n";
import type { Language } from "@/types/conversion";
import { ConverterPanel } from "@/components/ConverterPanel";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { MouseGlowBackground } from "@/components/MouseGlowBackground";
import { OpenSourceSection } from "@/components/OpenSourceSection";
import { PrivacySection } from "@/components/PrivacySection";
import { SupportedFormats } from "@/components/SupportedFormats";

export function HomePage() {
  const [language, setLanguage] = useState<Language>("en");
  const dictionary = useMemo(() => getDictionary(language), [language]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <>
      <MouseGlowBackground />
      <Header dictionary={dictionary} language={language} onLanguageChange={setLanguage} />
      <main>
        <Hero dictionary={dictionary} />
        <ConverterPanel dictionary={dictionary} />
        <PrivacySection dictionary={dictionary} />
        <HowItWorks dictionary={dictionary} />
        <SupportedFormats dictionary={dictionary} />
        <OpenSourceSection dictionary={dictionary} />
        <FAQ dictionary={dictionary} />
      </main>
      <Footer dictionary={dictionary} />
    </>
  );
}
