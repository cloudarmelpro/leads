import Link from "next/link";

import { GOUTTIERE } from "@/components/shared/container";
import { HeroGrid } from "@/components/shared/hero-grid";
import { features } from "@/config/site";
import { WorldPings } from "@/features/home/components/world-pings";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale; dict: Dictionary };

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
            className="inline-flex min-h-[44px] items-center rounded-[8px] bg-vert px-[18px] text-[14px] leading-[20px] font-medium whitespace-nowrap text-sur-vert no-underline transition-colors hover:bg-vert-clair"
          >
            {t.ctaBook}
          </Link>
          <Link
            href={features.pricing ? `/${lang}/prix` : `/${lang}/a-propos`}
            className="inline-flex min-h-[44px] items-center rounded-[8px] bg-surface-2 px-[18px] text-[14px] leading-[20px] font-medium whitespace-nowrap text-encre no-underline ring-1 ring-contour transition-colors ring-inset hover:bg-surface-3"
          >
            {features.pricing ? t.ctaPricing : dict.nav.about}
          </Link>
        </div>

        {/* Rangee facon « trusted by ». Aucun logo client : rien de confirme, et le guide
            interdit d'inventer des references. On nomme les metiers vises. */}
        <div className="mt-[6px] flex flex-col items-start gap-[10px] min-[620px]:max-w-[min(700px,64%)]">
          <span className="text-[12px] leading-[18px] font-medium tracking-[0.12em] text-texte2/75 uppercase">{t.trustedKicker}</span>
          <ul className="m-[0px] flex list-none flex-wrap items-center gap-x-[10px] gap-y-[6px] p-[0px]">
            {t.demos.map((demo, index) => (
              <li key={demo.trade} className="flex items-center gap-[10px] text-[13px] leading-[18px] font-normal text-texte2">
                {index > 0 && <span aria-hidden className="block h-[3px] w-[3px] rounded-full bg-texte2/45" />}
                {demo.trade}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
