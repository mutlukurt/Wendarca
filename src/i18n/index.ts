import { en } from "@/i18n/en";
import { tr } from "@/i18n/tr";
import type { Language } from "@/types/conversion";

export const dictionaries = {
  en,
  tr,
} as const;

export type Dictionary = typeof en;

export function getDictionary(language: Language): Dictionary {
  return dictionaries[language];
}
