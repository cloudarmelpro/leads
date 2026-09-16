import { GOUTTIERE } from "@/components/shared/container";
import { ServicesShowcase } from "@/features/home/components/services-showcase";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale; dict: Dictionary };

/**
 * Services (direction du 2026-09-17, d'après une vidéo de référence) : à gauche la
 * piste défilante des huit services, à droite le label, le titre et l'intro. Une colonne
 * sous 900px, texte d'abord. Rail de 1400px comme l'en-tête.
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
          {/* Deux lignes voulues : « Ce qu'on fait, » puis « concrètement ». */}
          <h2 className="m-[0px] text-[clamp(22px,2vw,28px)] leading-[1.15] font-medium tracking-[-0.4px] text-encre">
            {t.titleA}
            <br />
            {t.titleB}
          </h2>
          <p className="m-[0px] max-w-[440px] text-[15px] leading-[26px] font-normal text-texte2 text-pretty">{t.intro}</p>
        </div>

        <div className="min-w-[0px] min-[900px]:order-1">
          <ServicesShowcase lang={lang} items={t.items} />
        </div>
      </div>
    </section>
  );
}
