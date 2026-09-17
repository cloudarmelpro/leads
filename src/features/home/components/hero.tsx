import { Axe, HardHat, Hammer, Shovel, Snowflake, Store, Trees, type LucideIcon } from "lucide-react";
import Link from "next/link";

import { GOUTTIERE } from "@/components/shared/container";
import { HeroGrid } from "@/components/shared/hero-grid";
import { features } from "@/config/site";
import { WorldPings } from "@/features/home/components/world-pings";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale; dict: Dictionary };

// Une icone par secteur, dans le MEME ordre que `hero.demos` : paysagement, excavation,
// construction, renovation, commerce local, deneigement, arboriculture.
const ICONES_SECTEURS: LucideIcon[] = [Trees, Shovel, HardHat, Hammer, Store, Snowflake, Axe];

// Fondu des bords de la carte : le flanc gauche (vers le titre) et le bas s'estompent.
const MAP_MASK =
  "linear-gradient(90deg, transparent 0%, #000 18%, #000 100%), linear-gradient(180deg, #000 0%, #000 90%, transparent 100%)";

/**
 * Hero de la maquette Accueil : carte du monde en points ancrée à droite avec ses
 * points pulsés, grille fine dans la moitié basse, H1 en majuscules (seconde phrase
 * en vert), paragraphe d'appui et deux boutons. La carte est masquée sous 620px.
 * Boutons au gabarit de l'en-tête (rayon 8px, vert plein / surface avec filet interne),
 * juste plus hauts : 44px, la cible minimale.
 */
export function Hero({ lang, dict }: Props) {
  const t = dict.hero;

  return (
    <section
      id="accueil"
      className={`relative flex justify-center overflow-x-clip pt-[128px] pb-[clamp(112px,16vw,240px)] min-[620px]:min-h-[440px] min-[620px]:pt-[192px] ${GOUTTIERE}`}
    >
      <HeroGrid />

      {/* Carte en points + points pulsés : 62 % du rail dès 620px (100 % atténué en dessous). */}
      <div aria-hidden className={`pointer-events-none absolute inset-[0px] hidden select-none min-[620px]:block ${GOUTTIERE}`}>
        <div className="mx-auto h-full w-full max-w-[1100px]">
          <div
            className="relative ml-auto mr-[-4.5%] h-full w-full opacity-50 min-[620px]:w-[62%] min-[620px]:opacity-100"
            style={{ maskImage: MAP_MASK, maskComposite: "intersect", WebkitMaskImage: MAP_MASK, WebkitMaskComposite: "source-in" }}
          >
            {/* Le SVG sert de masque : la couleur des points suit le thème. */}
            <div
              className="absolute inset-[0px] bg-[#3a4a52] opacity-[0.34] dark:bg-[#bfd0d6] [mask-image:url(/world-dots.svg)] [mask-position:right_center] [mask-repeat:no-repeat] [mask-size:contain]"
            />
            <WorldPings />
          </div>
        </div>
      </div>

      <div className="relative z-[1] flex w-full max-w-[1100px] flex-col items-start gap-[24px]">
        <h1 className="m-[0px] max-w-[720px] text-[clamp(24px,3.2vw,34px)] leading-[1.15] font-normal tracking-[-1px] text-encre uppercase text-pretty min-[620px]:max-w-[min(720px,54%)]">
          {t.titleA} <span className="text-vert">{t.titleB}</span>
        </h1>
        <p className="m-[0px] max-w-[560px] text-[15px] leading-[26px] font-normal text-texte2 text-pretty min-[620px]:max-w-[min(560px,46%)]">
          {t.subtitle}
        </p>
        <div className="flex flex-wrap items-center gap-[12px]">
          <Link
            href={`/${lang}/contact`}
            className="tap-44 inline-flex min-h-[38px] items-center rounded-[8px] bg-vert px-[16px] text-[13px] leading-[20px] font-medium whitespace-nowrap text-sur-vert no-underline transition-colors hover:bg-vert-clair"
          >
            {t.ctaBook}
          </Link>
          <Link
            href={features.pricing ? `/${lang}/prix` : `/${lang}/a-propos`}
            className="tap-44 inline-flex min-h-[38px] items-center rounded-[8px] bg-surface-2 px-[16px] text-[13px] leading-[20px] font-medium whitespace-nowrap text-encre no-underline ring-1 ring-contour transition-colors ring-inset hover:bg-surface-3"
          >
            {features.pricing ? t.ctaPricing : dict.nav.about}
          </Link>
        </div>

        {/* Rangee facon « trusted by ». Aucun logo client : rien de confirme, et le guide
            interdit d'inventer des references. On nomme les metiers vises. */}
        <div className="mt-[clamp(56px,10vw,144px)] flex w-full items-center gap-[clamp(14px,1.8vw,26px)]">
          <span className="shrink-0 text-[13px] leading-[18px] font-normal whitespace-nowrap text-texte2">{t.trustedKicker}</span>
          {/* La piste defile ; le fondu de droite dit que la liste continue. */}
          <div className="min-w-[0px] flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent_0%,#000_4%,#000_88%,transparent_100%)]">
            <ul className="m-[0px] flex w-max list-none items-center p-[0px] [animation:tw-bandeau_38s_linear_infinite] hover:[animation-play-state:paused] motion-reduce:[animation:none]">
              {[...t.demos, ...t.demos].map((demo, index) => {
                const Icone = ICONES_SECTEURS[index % t.demos.length];
                if (!Icone) return null;
                return (
                  <li
                    key={`${demo.trade}-${index}`}
                    aria-hidden={index >= t.demos.length}
                    className="flex items-center gap-[7px] pr-[clamp(22px,3vw,44px)] text-[14px] leading-[20px] font-medium whitespace-nowrap text-encre/85"
                  >
                    <Icone aria-hidden className="h-[17px] w-[17px] shrink-0" strokeWidth={1.75} />
                    {demo.trade}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
