import "server-only";

import type { Locale } from "./config";

const dictionaries = {
  fr: () => import("./dictionaries/fr.json").then((m) => m.default),
  en: () => import("./dictionaries/en.json").then((m) => m.default),
};

/** `fr.json` est le type de référence : `en.json` doit en avoir la parité stricte. */
export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["fr"]>>;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]() as Promise<Dictionary>;
}
