import Link from "next/link";
import type { ReactNode } from "react";

import { BTN_PLEIN } from "@/components/shared/buttons";
import { HeroStage } from "@/features/home/components/hero-3d/hero-stage";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale; dict: Pick<Dictionary, "hero"> };

const icon = (d: ReactNode, size: number, strokeWidth: number) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {d}
  </svg>
);
const PIN = (
  <>
    <path d="M20 10.5c0 6-8 11.5-8 11.5s-8-5.5-8-11.5a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10.2" r="2.8" />
  </>
);
const ARROW = <path d="M5 12h14M13 6l6 6-6 6" />;

// Boutons en texte seul (décision du client, 2026-09-30, malgré le pictogramme de la maquette).
// Le hero suit le thème depuis le 2026-09-30 (scène 3D claire, textes encre) : valeurs de la
// maquette sombre sous `dark:`, équivalents clairs par défaut.
const BTN_VERRE = "tap-44 pointer-events-auto inline-flex h-[40px] items-center rounded-[8px] px-[18px] text-[13.5px] leading-[1] font-medium whitespace-nowrap no-underline";
const HALO =
  "relative isolate before:absolute before:-inset-x-[28px] before:-inset-y-[22px] before:z-[-1] before:rounded-[32px] before:bg-[rgba(238,241,243,0.62)] before:blur-[24px] before:content-[''] dark:before:hidden";
const WORD = "inline-block [animation:tw-hero-word_1400ms_cubic-bezier(0.16,0.68,0.16,1)_both] motion-reduce:[animation:none]";

/**
 * Hero (maquette Accueil, 2026-09-30) : scène 3D plein écran (logo TG, carte du monde,
 * fumée) sous un voile qui assombrit les bords ; en bas, surtitre, titre en capitales
 * dont les deux moitiés montent l'une après l'autre, texte d'appui et deux boutons ;
 * à droite, le paragraphe des services. Une colonne sous 860px. Le texte s'efface en
 * sortant (`--exit`). La pastille du bas mène aux organisations.
 */
export function Hero({ lang, dict }: Props) {
  const t = dict.hero;

  return (
    <section id="top" data-fab-avoid className="relative z-[2] block">
      <HeroStage
        fallback={{
          dark: {
            portrait: { src: "/images/home/hero-repli-mobile.webp", width: 830, height: 1612 },
            tablet: { src: "/images/home/hero-repli-tablette.webp", width: 1118, height: 1470 },
            landscape: { src: "/images/home/hero-repli-paysage.webp", width: 1868, height: 1110 },
          },
          // Captures de la scène en thème clair (2026-10-01), mêmes formats.
          light: {
            portrait: { src: "/images/home/hero-repli-mobile-clair.webp", width: 815, height: 1612 },
            tablet: { src: "/images/home/hero-repli-tablette-clair.webp", width: 1103, height: 1470 },
            landscape: { src: "/images/home/hero-repli-paysage-clair.webp", width: 1853, height: 1110 },
          },
        }}
      >
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-[0px] z-0 block bg-[radial-gradient(ellipse_42%_50%_at_44%_38%,rgba(238,241,243,0)_0%,rgba(238,241,243,0)_45%,rgba(238,241,243,0.85)_85%,#eef1f3_100%),linear-gradient(180deg,rgba(238,241,243,0.7)_0%,rgba(238,241,243,0)_22%,rgba(238,241,243,0)_46%,rgba(238,241,243,0.86)_72%,#eef1f3_100%)] dark:bg-[radial-gradient(ellipse_42%_50%_at_44%_38%,rgba(1,24,35,0)_0%,rgba(1,24,35,0)_45%,rgba(1,24,35,0.85)_85%,#011823_100%),linear-gradient(180deg,rgba(1,24,35,0.7)_0%,rgba(1,24,35,0)_22%,rgba(1,24,35,0)_50%,rgba(1,24,35,0.8)_75%,#011823_100%)]`}
        />

        <div className="relative flex flex-1 flex-col [opacity:calc(1-var(--exit,0)*1.6)]">
          {/* Téléphone en portrait : une bande réservée en haut accueille le logo 3D, que la
              scène cale entre l'en-tête et le texte (sinon il n'aurait que quelques pixels). */}
          <div className="relative z-[1] flex flex-1 items-end px-[clamp(18px,4vw,40px)] pt-[calc(80px+clamp(28px,5vw,72px))] pb-[clamp(96px,13vh,150px)] [@media(max-width:859px)_and_(orientation:portrait)]:pt-[calc(80px+clamp(28px,5vw,72px)+clamp(140px,22vh,220px))]">
            {/* Mode clair : un halo gris perle flou derrière chaque bloc de texte (pas derrière le
                logo), sinon les points de la carte passent à travers les lettres (client, 2026-09-30). */}
            <div data-hero-text className="mx-auto grid w-full max-w-[1400px] grid-cols-[minmax(0,1fr)] items-end gap-[clamp(28px,4vw,72px)] min-[860px]:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)]">
              <div className={`flex max-w-[600px] min-w-[0px] flex-col items-start gap-[18px] ${HALO}`}>
                <span className="text-[15px] leading-[20px] font-medium text-encre dark:text-white">{t.kicker}</span>
                <h1 className="m-[0px] max-w-[600px] text-[clamp(28px,3vw,40px)] leading-[1.05] font-semibold tracking-[-0.02em] text-encre uppercase text-balance dark:text-white">
                  <span className={`${WORD} [animation-delay:90ms]`}>{t.titleA}</span>{" "}
                  <span className={`${WORD} text-vert [animation-delay:560ms] dark:text-[#30D98C]`}>{t.titleB}</span>
                </h1>
                <p className="m-[0px] max-w-[440px] text-[15px] leading-[24px] font-normal text-texte-bascule text-pretty dark:text-[#E4ECEF]">{t.lede}</p>
                <div className="mt-[8px] flex flex-wrap items-center gap-[12px]">
                  <Link href={`/${lang}/soumission`} className={`${BTN_PLEIN} pointer-events-auto`}>
                    <span className="whitespace-nowrap">{t.ctaBook}</span>
                  </Link>
                  <Link
                    href={`/${lang}/services`}
                    className={`${BTN_VERRE} bg-verre text-encre shadow-[inset_0_0_0_1px_var(--color-filet-verre)] backdrop-blur-[14px] transition-[color,box-shadow] hover:text-vert hover:shadow-[inset_0_0_0_1px_var(--color-vert)] dark:bg-[rgba(1,41,60,0.72)] dark:text-white dark:shadow-[inset_0_0_0_1px_#0A3247] dark:backdrop-blur-none dark:hover:text-[#30D98C] dark:hover:shadow-[inset_0_0_0_1px_#30D98C]`}
                  >
                    <span className="whitespace-nowrap">{t.ctaServices}</span>
                  </Link>
                </div>
              </div>
              <p className={`m-[0px] max-w-[440px] text-[15px] leading-[24px] font-normal text-texte2 text-pretty min-[860px]:justify-self-end min-[860px]:text-right dark:text-[#A9BCC4] ${HALO}`}>{t.aside}</p>
            </div>
          </div>

          <div className="relative z-[1] flex justify-center px-[clamp(18px,4vw,40px)] pb-[26px]">
            <a
              href="#secteurs"
              className="pointer-events-auto inline-flex h-[40px] max-w-full min-w-[0px] items-center gap-[10px] rounded-[8px] bg-verre pr-[16px] pl-[6px] text-[13.5px] leading-[1] font-normal whitespace-nowrap text-encre no-underline shadow-[inset_0_0_0_1px_var(--color-filet-verre)] backdrop-blur-[14px] transition-colors hover:bg-verre-fort dark:bg-[rgba(1,24,35,0.55)] dark:text-white dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.09)] dark:hover:bg-[rgba(1,24,35,0.75)]"
            >
              <span className="inline-flex h-[28px] shrink-0 items-center gap-[6px] rounded-[6px] bg-bouton px-[10px] text-[12px] font-semibold text-sur-bouton">
                {icon(PIN, 13, 2.2)}
                {t.teaserKicker}
              </span>
              <span className="min-w-[0px] overflow-hidden text-ellipsis">{t.teaser}</span>
              <span className="shrink-0">{icon(ARROW, 15, 2)}</span>
            </a>
          </div>
        </div>
      </HeroStage>
    </section>
  );
}
