import Link from "next/link";

import { GOUTTIERE } from "@/components/shared/container";
import { features } from "@/config/site";
import { ServicesShowcase } from "@/features/home/components/services-showcase";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale; dict: Dictionary };

/**
 * Services (direction du 2026-09-17, d'après une vidéo de référence) : à gauche la
 * mosaïque défilante des huit services, à droite le label, le titre, l'intro et les deux
 * appels à l'action du hero. Une colonne sous 900px, texte d'abord. Rail de 1400px comme
 * l'en-tête.
 */
export function Services({ lang, dict }: Props) {
  const t = dict.services;

  return (
    <section className={`relative flex justify-center pb-[clamp(112px,16vw,240px)] ${GOUTTIERE}`}>
      {/* Trois quarts pour la piste de vignettes, un quart pour le texte (décision du 2026-09-17). */}
      <div className="grid w-full max-w-[1400px] grid-cols-[minmax(0,1fr)] items-center gap-[clamp(32px,4vw,64px)] min-[900px]:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]">
        <div className="flex flex-col items-start gap-[18px] min-[900px]:order-2">
          <span id="services" className="text-[13px] leading-[20px] font-medium tracking-[0.08em] text-vert uppercase">
            {t.kicker}
          </span>
          <h2 className="m-[0px] text-[clamp(26px,2.5vw,34px)] leading-[1.12] font-medium tracking-[-0.5px] text-encre text-balance">
            {t.titleA} {t.titleB}
          </h2>
          <p className="m-[0px] max-w-[440px] text-[15px] leading-[26px] font-normal text-texte2 text-pretty">{t.intro}</p>
          <div className="mt-[10px] flex flex-wrap items-center gap-[10px]">
            {features.pricing && (
              <Link
                href={`/${lang}/prix`}
                className="inline-flex min-h-[40px] items-center rounded-[8px] bg-vert px-[16px] text-[14px] leading-[20px] font-medium whitespace-nowrap text-sur-vert no-underline transition-colors hover:bg-vert-clair"
              >
                {dict.hero.ctaPricing}
              </Link>
            )}
            <Link
              href={`/${lang}/contact`}
              className="inline-flex min-h-[40px] items-center rounded-[8px] bg-surface-2 px-[16px] text-[14px] leading-[20px] font-medium whitespace-nowrap text-encre no-underline ring-1 ring-contour ring-inset transition-colors hover:bg-surface-3"
            >
              {dict.hero.ctaBook}
            </Link>
          </div>
        </div>

        <div className="min-w-[0px] min-[900px]:order-1">
          <ServicesShowcase lang={lang} items={t.items} controls={t.controls} />
        </div>
      </div>
    </section>
  );
}
