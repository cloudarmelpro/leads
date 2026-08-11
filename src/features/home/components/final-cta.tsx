import { Phone } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";

import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale; dict: Dictionary };

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
        data-reveal-duration="1400"
        className="mx-auto flex max-w-290 flex-col items-center rounded-4xl bg-surface px-[clamp(24px,4vw,56px)] py-[clamp(56px,9vw,90px)] text-center text-encre"
      >
        <span
          data-reveal="up"
          data-reveal-dist="24px"
          data-reveal-delay="120"
          className="mb-7 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-white"
        >
          <Phone size={24} strokeWidth={2.2} aria-hidden />
        </span>

        {/* Conteneur observé (en place) ; le titre glisse depuis la droite, comme
            les titres de section. `w-full` pour que le clip couvre toute la carte. */}
        <div
          data-reveal-child="right"
          style={{
            "--reveal-delay": "220ms",
            "--reveal-dist": "40vw",
            "--reveal-dur": "3400ms",
          } as CSSProperties}
          className="mb-4 w-full"
        >
          <h2 className="mx-auto max-w-[20ch] font-display text-[clamp(28px,5.5vw,46px)] leading-[1.12] tracking-normal text-balance">
            {t.titleA} {t.titleB}
          </h2>
        </div>

        <p
          data-reveal="up"
          data-reveal-dist="24px"
          data-reveal-delay="320"
          className="mx-auto mb-9 max-w-[46ch] text-[17px] leading-[1.6] text-texte2 text-pretty"
        >
          {t.subtitle}
        </p>

        <Link
          href={`/${lang}/contact`}
          data-reveal="up"
          data-reveal-dist="24px"
          data-reveal-delay="420"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-emeraude px-7 text-sm text-white no-underline transition-colors hover:bg-emeraude/90"
        >
          {t.rdv}
        </Link>
      </div>
    </section>
  );
}
