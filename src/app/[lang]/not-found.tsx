import Link from "next/link";

import { CONTENEUR } from "@/components/shared/container";
import { Eyebrow } from "@/components/shared/eyebrow";
import { getDictionary } from "@/lib/i18n/dictionaries";

import { getRequestLocale } from "@/lib/i18n/request-locale";

/**
 * 404 du site public, rendue DANS le layout `[lang]` (en-tête, pied de page,
 * sélecteur de langue conservés). Next n'accorde aucune prop à `not-found.tsx` :
 * la langue vient du dépôt de requête alimenté par le layout.
 */
export default async function NotFound() {
  const lang = getRequestLocale();
  const dict = await getDictionary(lang);

  return (
    <div className="pt-[clamp(48px,8vw,112px)] pb-[clamp(64px,10vw,144px)]">
      <div className={CONTENEUR}>
        <div className="mx-auto max-w-[52ch] text-center">
          <p className="flex justify-center">
            <Eyebrow>404</Eyebrow>
          </p>
          <h1 className="mt-4 font-display text-[clamp(26px,4.4vw,44px)] leading-[1.1] tracking-normal text-balance">
            {dict.notFound.title}
          </h1>
          <p className="mx-auto mt-5 max-w-[46ch] text-base leading-[1.7] text-texte2 text-pretty">
            {dict.notFound.body}
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`/${lang}`}
              className="tap-44 inline-flex items-center justify-center rounded-xl bg-emeraude px-5 py-3 text-sm font-medium text-white no-underline transition-colors hover:bg-emeraude/90"
            >
              {dict.notFound.cta}
            </Link>
            <Link
              href={`/${lang}/contact`}
              className="tap-44 inline-flex items-center justify-center rounded-xl border border-ligne px-5 py-3 text-sm font-medium text-encre no-underline transition-colors hover:bg-surface"
            >
              {dict.notFound.contact}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
