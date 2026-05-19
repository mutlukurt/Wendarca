import { siGithub } from "simple-icons";
import type { Dictionary } from "@/i18n";
import { Logo } from "@/components/Logo";

interface FooterProps {
  dictionary: Dictionary;
}

export function Footer({ dictionary }: FooterProps) {
  return (
    <footer className="border-t border-[#D8D8D8]/80 bg-[#EDEDED]/72 py-10">
      <div className="container-nest">
        <div className="grid gap-8 rounded-3xl border border-[#D8D8D8]/90 bg-white/70 p-6 shadow-sm backdrop-blur md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <Logo />
            <p className="mt-4 max-w-md text-sm leading-6 text-[#797979]">{dictionary.footer.privacy}</p>
            <p className="mt-2 text-sm font-semibold text-[#FB4D27]">{dictionary.footer.built}</p>
          </div>
          <nav className="flex flex-wrap gap-3 text-sm font-semibold text-[#797979]" aria-label="Footer navigation">
            <a href="#converter" className="rounded-full px-3 py-2 transition hover:bg-[#FFF1EC] hover:text-[#C93418]">
              {dictionary.footer.links.converter}
            </a>
            <a href="#privacy" className="rounded-full px-3 py-2 transition hover:bg-[#FFF1EC] hover:text-[#C93418]">
              {dictionary.footer.links.privacy}
            </a>
            <a href="#faq" className="rounded-full px-3 py-2 transition hover:bg-[#FFF1EC] hover:text-[#C93418]">
              {dictionary.footer.links.faq}
            </a>
            <a
              href="https://github.com/mutlukurt"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 transition hover:bg-[#FFF1EC] hover:text-[#C93418]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                <path d={siGithub.path} />
              </svg>
              {dictionary.footer.links.github}
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
