import type { Dictionary } from "@/i18n";
import { Logo } from "@/components/Logo";

interface FooterProps {
  dictionary: Dictionary;
}

export function Footer({ dictionary }: FooterProps) {
  return (
    <footer className="border-t border-[#E8E1D6] bg-white py-8">
      <div className="container-nest flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <Logo />
          <p className="mt-3 max-w-md text-sm text-[#6B6B6B]">{dictionary.footer.privacy}</p>
        </div>
        <nav className="flex flex-wrap gap-4 text-sm font-medium text-[#6B6B6B]" aria-label="Footer navigation">
          <a href="#converter" className="hover:text-[#171717]">{dictionary.footer.links.converter}</a>
          <a href="#privacy" className="hover:text-[#171717]">{dictionary.footer.links.privacy}</a>
          <a href="#faq" className="hover:text-[#171717]">{dictionary.footer.links.faq}</a>
        </nav>
      </div>
    </footer>
  );
}
