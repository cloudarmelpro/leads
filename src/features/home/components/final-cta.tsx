import Link from "next/link";

import { ArrowRight } from "@/components/ui/arrows";

import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale; dict: Dictionary };

/**
 * CTA final en bandeau horizontal (réf. « Let's Discuss With Our Team ») :
 * grand titre à gauche, intitulé + paragraphe au centre, gros bouton-flèche à
 * droite. Fond émeraude (la couleur de la marque, au lieu du lime de la réf.),
 * texte en blanc pour le contraste.
 */
export function FinalCta({ lang, dict }: Props) {
  const t = dict.final;

  return (
    <section
      id="contact"
      className="px-[clamp(12px,3vw,32px)] pt-[clamp(24px,4vw,48px)] pb-[clamp(48px,6vw,72px)]"
    >
      <div
        data-reveal="up"
        data-reveal-dist="64px"
        className="mx-auto flex max-w-290 flex-col gap-9 rounded-4xl bg-surface px-[clamp(28px,4vw,56px)] py-[clamp(36px,5vw,56px)] text-encre md:flex-row md:items-center md:justify-between md:gap-10"
      >
        <h2 className="max-w-[13ch] font-display text-[clamp(30px,4.6vw,52px)] leading-[1.04] tracking-normal text-balance">
          {t.titleA} {t.titleB}
        </h2>

        <div className="md:max-w-[32ch] md:flex-1">
          <p className="font-display text-[15px]">{t.rdv}</p>
          <p className="mt-2 text-sm leading-[1.6] text-texte2 text-pretty">{t.subtitle}</p>
        </div>

        <Link
          href={`/${lang}/contact`}
          aria-label={t.rdv}
          className="group inline-flex h-[clamp(78px,9vw,112px)] w-[clamp(78px,9vw,112px)] shrink-0 items-center justify-center rounded-[26px] border border-encre text-encre transition-colors duration-300 ease-out hover:bg-encre hover:text-surface motion-reduce:transition-none"
        >
          <ArrowRight className="w-9" />
        </Link>
      </div>
    </section>
  );
}
