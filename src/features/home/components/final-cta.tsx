import { CtaBanner } from "@/components/shared/cta-banner";

import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale; dict: Dictionary };

/** CTA final de l'accueil — bandeau partagé alimenté par le dictionnaire `final`. */
export function FinalCta({ lang, dict }: Props) {
  const t = dict.final;

  return (
    <CtaBanner
      lang={lang}
      id="contact"
      title={`${t.titleA} ${t.titleB}`}
      eyebrow={t.rdv}
      body={t.subtitle}
      ariaLabel={t.rdv}
    />
  );
}
