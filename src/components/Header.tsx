"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import { siGithub } from "simple-icons";
import { useEffect, useMemo, useRef, useState } from "react";
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeHref, setActiveHref] = useState("#converter");
  const isActiveLockedRef = useRef(false);
  const activeLockTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navItems = useMemo(() => [
    { href: "#converter", label: dictionary.header.converter, hasChevron: true },
    { href: "#how-it-works", label: dictionary.header.howItWorks },
    { href: "#privacy", label: dictionary.header.privacy },
    { href: "#faq", label: dictionary.header.faq },
  ], [dictionary]);

  useEffect(() => {
    const update = () => setIsScrolled(window.scrollY > 12);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    const updateActiveSection = () => {
      if (isActiveLockedRef.current) return;

      const scrollAnchor = window.scrollY + 160;
      const sections = navItems
        .map((item) => {
          const section = document.getElementById(item.href.slice(1));
          return section ? { href: item.href, top: section.offsetTop } : null;
        })
        .filter((section): section is { href: string; top: number } => section !== null)
        .sort((a, b) => a.top - b.top);

      let current = sections[0]?.href ?? navItems[0].href;

      sections.forEach((section) => {
        if (section.top <= scrollAnchor) {
          current = section.href;
        }
      });

      setActiveHref(current);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("hashchange", updateActiveSection);
    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("hashchange", updateActiveSection);
    };
  }, [navItems]);

  useEffect(() => {
    return () => {
      if (activeLockTimeoutRef.current) {
        clearTimeout(activeLockTimeoutRef.current);
      }
    };
  }, []);

  const selectNavItem = (href: string) => {
    isActiveLockedRef.current = true;
    if (activeLockTimeoutRef.current) {
      clearTimeout(activeLockTimeoutRef.current);
    }
    activeLockTimeoutRef.current = setTimeout(() => {
      isActiveLockedRef.current = false;
    }, 1400);
    setActiveHref(href);
  };

  return (
    <header
      className="pointer-events-none fixed left-0 right-0 top-0 z-50 text-white"
    >
      <div className={`container-nest relative flex items-center justify-between gap-4 py-3 transition-all duration-300 md:py-4 ${isScrolled ? "scale-[0.985]" : "scale-100"}`}>
        <a
          href="#"
          className="pointer-events-auto shrink-0 rounded-2xl border border-white/12 bg-black/28 px-3 py-2 shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-2xl transition hover:bg-black/36"
          aria-label="Wendarca home"
          onClick={() => setIsOpen(false)}
        >
          <Logo className="h-10 w-auto brightness-0 invert md:h-11" />
        </a>

        <nav
          className="pointer-events-auto hidden rounded-[1.45rem] border border-white/12 bg-black/24 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-2xl lg:flex"
          aria-label="Primary navigation"
        >
          {navItems.map((item) => {
            const isActive = activeHref === item.href;
            return (
            <a
              key={item.href}
              href={item.href}
              onClick={() => selectNavItem(item.href)}
              className={`inline-flex h-14 items-center justify-center gap-2 rounded-2xl px-6 text-sm font-semibold transition hover:bg-white/[0.14] hover:text-white ${
                isActive ? "bg-white/[0.16] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]" : "text-white/90"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {item.label}
              {item.hasChevron ? <ChevronDown className="h-4 w-4" aria-hidden="true" /> : null}
            </a>
          );
          })}
        </nav>

        <div className="pointer-events-auto hidden items-center gap-3 lg:flex">
          <LanguageSwitcher language={language} onLanguageChange={onLanguageChange} />
          <a
            href="https://github.com/mutlukurt"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/14 bg-black/24 text-white shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-2xl transition hover:-translate-y-0.5 hover:border-[#FB4D27]/70 hover:bg-[#FB4D27]/18"
            aria-label={dictionary.header.github}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
              <path d={siGithub.path} />
            </svg>
          </a>
          <a
            href="#converter"
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-white px-6 text-sm font-bold text-[#000000] shadow-[0_18px_50px_rgba(0,0,0,0.20)] transition hover:-translate-y-0.5 hover:bg-[#F2F2F2] active:translate-y-0"
          >
            {dictionary.header.cta}
          </a>
        </div>

        <button
          type="button"
          className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/14 bg-black/28 text-white shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-2xl lg:hidden"
          aria-label={isOpen ? dictionary.header.closeMenu : dictionary.header.menu}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((value) => !value)}
        >
          {isOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>

      {isOpen ? (
        <>
          <button
            type="button"
            aria-label={dictionary.header.closeMenu}
            className="pointer-events-auto fixed inset-0 top-[68px] cursor-default bg-transparent lg:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="container-nest pointer-events-auto absolute left-1/2 top-[72px] z-10 -translate-x-1/2 lg:hidden">
            <nav className="rounded-3xl border border-white/12 bg-black/62 p-3 shadow-[0_24px_70px_rgba(0,0,0,0.34)] backdrop-blur-2xl" aria-label="Mobile navigation">
              <div className="grid gap-1">
                {navItems.map((item) => {
                  const isActive = activeHref === item.href;
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => {
                        selectNavItem(item.href);
                        setIsOpen(false);
                      }}
                      className={`rounded-2xl px-4 py-3 text-sm font-semibold transition hover:bg-white/[0.10] hover:text-white ${
                        isActive ? "bg-white/[0.14] text-white" : "text-white/82"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {item.label}
                    </a>
                  );
                })}
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3">
                <LanguageSwitcher language={language} onLanguageChange={onLanguageChange} variant="dark" />
                <a
                  href="#converter"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex h-11 items-center justify-center rounded-2xl bg-white px-4 text-sm font-bold text-black"
                >
                  {dictionary.header.cta}
                </a>
              </div>
            </nav>
          </div>
        </>
      ) : null}
    </header>
  );
}
