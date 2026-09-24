import { ServicesShowcase } from "@/features/home/components/services-showcase";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale; dict: Dictionary };

/**
 * Services (maquette Accueil, 2026-09-24) : dès 1100px, la vitrine défilante occupe trois
 * quarts du rail et le texte (label, titre, intro) le quart de droite ; en dessous, une
 * colonne, texte d'abord. Rail de 1400px comme l'en-tête.
 */
export function Services({ lang, dict }: Props) {
  const t = dict.services;

  return (
    <section id="services" className="relative z-[1] flex justify-center bg-fond px-[clamp(16px,4vw,56px)] pb-[clamp(96px,11vw,180px)]">
      <div className="grid w-full max-w-[1400px] grid-cols-[minmax(0,1fr)] items-center gap-[clamp(32px,4vw,64px)] min-[1100px]:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]">
        <div className="flex flex-col items-start gap-[18px] min-[1100px]:order-2">
          <span className="text-[13px] leading-[20px] font-normal tracking-[0.08em] text-vert uppercase">{t.kicker}</span>
          {/* Deux lignes voulues : « Ce qu'on fait, » puis « concrètement ». */}
          <h2 className="m-[0px] text-[clamp(22px,2.2vw,30px)] leading-[1.2] font-semibold tracking-[-0.01em] text-encre">
            {t.titleA}
            <br />
            {t.titleB}
          </h2>
          <p className="m-[0px] max-w-[440px] text-[15px] leading-[26px] font-normal text-texte2 text-pretty">{t.intro}</p>
        </div>

        <div className="min-w-[0px] min-[1100px]:order-1">
          <ServicesShowcase lang={lang} items={t.items} />
        </div>
      </div>
    </section>
  );
}
