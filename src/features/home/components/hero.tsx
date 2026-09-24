import Link from "next/link";
import type { ReactNode } from "react";

import { HeroStage } from "@/features/home/components/hero-3d/hero-stage";
import { features } from "@/config/site";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale; dict: Dictionary };

const PIN = (
  <>
    <path d="M20 10.5c0 6-8 11.5-8 11.5s-8-5.5-8-11.5a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10.2" r="2.8" />
  </>
);
const PHONE = (
  <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
);
const icon = (d: ReactNode, size: number, strokeWidth: number) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {d}
  </svg>
);

// Le hero est toujours posé sur la scène sombre : ses couleurs ne suivent pas le thème.
// Tout le contenu suit la largeur : valeurs de la maquette dès 1100px (là où la navigation
// d'ordinateur apparaît), réduction continue jusqu'à 375px (formes « a + b·vw » calées sur
// ces deux largeurs) — la tablette en profite aussi.
const BADGE =
  "flex h-[clamp(28px,25.93px+0.55vw,32px)] items-center rounded-[8px] bg-[#01182380] backdrop-blur-[14px] text-[clamp(11px,10.22px+0.21vw,12.5px)] leading-[20px] font-normal whitespace-nowrap text-[#E4ECEF]";
// Boutons : 40 → 48 px de haut et 13 → 15 px de texte ; `tap-44` garde une zone de toucher
// de 44 px même quand le bouton visible est plus petit.
const BTN =
  "tap-44 pointer-events-auto inline-flex min-h-[clamp(40px,35.86px+1.1vw,48px)] items-center justify-center gap-[clamp(7px,5.97px+0.28vw,9px)] rounded-[8px] text-[clamp(13px,11.97px+0.28vw,15px)] leading-[20px] whitespace-nowrap no-underline [&>svg]:size-[clamp(15px,13.45px+0.41vw,18px)]";
const WORD = "inline-block [animation:tw-hero-word_1400ms_cubic-bezier(0.16,0.68,0.16,1)_both] motion-reduce:[animation:none]";

/** Découpe « … {b1} … {b2} … » et met les deux segments en gras blanc, comme la maquette. */
function withStrong(text: string, strong: Record<string, string>) {
  return text.split(/(\{b\d\})/).map((part, i) => {
    const key = part.match(/^\{(b\d)\}$/)?.[1];
    return key && strong[key] ? (
      <strong key={i} className="font-semibold text-white">
        {strong[key]}
      </strong>
    ) : (
      part
    );
  });
}

/**
 * Hero (maquette Accueil, 2026-09-24) : scène 3D plein écran (logo TG, carte du monde,
 * fumée), puis en bas le titre en capitales et, à droite, le texte d'appui et les deux
 * boutons. Une colonne sous 860px. Le texte s'efface en sortant (`--exit`).
 */
export function Hero({ lang, dict }: Props) {
  const t = dict.hero;

  return (
    <section id="top" data-fab-avoid className="relative z-[2] block">
      <HeroStage
        fallback={{
          portrait: { src: "/images/home/hero-repli-mobile.webp", width: 830, height: 1612 },
          tablet: { src: "/images/home/hero-repli-tablette.webp", width: 1118, height: 1470 },
          landscape: { src: "/images/home/hero-repli-paysage.webp", width: 1868, height: 1110 },
        }}
      >
        <div className="relative flex h-full flex-col [opacity:calc(1-var(--exit,0)*1.6)]">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-[0px] z-0 block bg-[linear-gradient(180deg,rgba(1,19,26,0.30)_0%,rgba(1,19,26,0)_28%,rgba(1,19,26,0)_48%,rgba(1,19,26,0.72)_72%,rgba(1,19,26,0.94)_100%),radial-gradient(ellipse_60%_45%_at_18%_88%,rgba(1,19,26,0.85)_0%,rgba(1,19,26,0)_100%)]"
          />

          <div className="relative z-[1] flex flex-1 items-end px-[clamp(18px,5vw,72px)] pt-[calc(68px+clamp(28px,5vw,72px))] pb-[clamp(88px,13vh,150px)]">
            <div className="mx-auto grid w-full max-w-[1400px] grid-cols-[minmax(0,1fr)] items-start gap-[clamp(28px,4vw,72px)] min-[860px]:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)]">
              <div className="flex min-w-[0px] flex-col items-start gap-[clamp(16px,12.9px+0.83vw,22px)]">
                <div className="flex flex-wrap gap-[8px]">
                  <span className={`${BADGE} gap-[clamp(8px,5.93px+0.55vw,12px)] px-[clamp(10px,8.97px+0.28vw,12px)] shadow-[0_0_0_1px_#FFFFFF18]`}>
                    <span className="text-[#30D98C]">{icon(PIN, 16, 1.7)}</span>
                    {t.badgeZone}
                  </span>
                  <span className={`${BADGE} px-[clamp(10px,7.93px+0.55vw,14px)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.09)]`}>{t.badgePrice}</span>
                </div>
                <h1 className="m-[0px] max-w-[820px] text-[clamp(24px,2.9vw,40px)] leading-[1.08] font-medium tracking-[-0.02em] text-white uppercase text-pretty">
                  <span className={`${WORD} w-full text-left text-[clamp(24px,17.79px+1.66vw,36px)] font-semibold tracking-[-1px] [animation-delay:90ms] min-[620px]:tracking-[-2px]`}>{t.titleA}</span>{" "}
                  <span className={`${WORD} text-[clamp(21px,15.31px+1.52vw,32px)] font-semibold tracking-[-1px] text-[#30D98C] [animation-delay:560ms] min-[620px]:tracking-[-2px]`}>
                    {t.titleB}
                  </span>
                </h1>
              </div>

              <div className="flex min-w-[0px] max-w-[520px] flex-col items-start gap-[clamp(16px,12.9px+0.83vw,22px)] text-left min-[860px]:items-end min-[860px]:justify-self-end min-[860px]:text-right">
                <p className="m-[0px] text-[clamp(15px,13.45px+0.41vw,18px)] leading-[1.34] font-normal text-[#E4ECEF] text-pretty">
                  {withStrong(t.subtitle, { b1: t.subtitleStrong1, b2: t.subtitleStrong2 })}
                </p>
                <div className="flex w-full flex-col gap-[12px] min-[480px]:w-auto min-[480px]:flex-row min-[480px]:flex-wrap min-[480px]:items-center min-[480px]:gap-[clamp(12px,5.79px+1.66vw,24px)]">
                  <Link
                    href={`/${lang}/contact`}
                    className={`${BTN} bg-[#30D98C] px-[clamp(14px,8.83px+1.38vw,24px)] font-medium text-[#011823] transition-colors hover:bg-[#7FEFC0]`}
                  >
                    {icon(PHONE, 18, 2.2)}
                    <span className="whitespace-nowrap">{t.ctaBook}</span>
                  </Link>
                  {features.pricing && (
                    <Link
                      href={`/${lang}/prix`}
                      className={`${BTN} bg-[rgba(1,41,60,0.72)] px-[clamp(14px,9.86px+1.1vw,22px)] font-normal text-white shadow-[inset_0_0_0_1px_#0A3247] transition-[color,box-shadow] hover:text-[#30D98C] hover:shadow-[inset_0_0_0_1px_#30D98C]`}
                    >
                      {t.ctaPricing}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-[1] flex justify-center px-[clamp(18px,5vw,72px)] pb-[26px]">
            <a
              href="#secteurs"
              className="pointer-events-auto inline-flex h-[clamp(36px,33.93px+0.55vw,40px)] max-w-full min-w-[0px] items-center gap-[clamp(8px,6.97px+0.28vw,10px)] rounded-[8px] bg-[rgba(1,24,35,0.55)] pr-[clamp(12px,9.93px+0.55vw,16px)] pl-[6px] text-[clamp(12.5px,11.98px+0.14vw,13.5px)] leading-[1] font-normal whitespace-nowrap text-white no-underline shadow-[inset_0_0_0_1px_rgba(255,255,255,0.09)] backdrop-blur-[14px] transition-colors hover:bg-[rgba(1,24,35,0.75)]"
            >
              <span className="inline-flex h-[clamp(24px,21.93px+0.55vw,28px)] shrink-0 items-center gap-[6px] rounded-[6px] bg-[#30D98C] px-[clamp(8px,6.97px+0.28vw,10px)] text-[clamp(11px,10.48px+0.14vw,12px)] font-semibold text-[#011823]">
                {icon(PIN, 13, 2.2)}
                {t.tradesKicker}
              </span>
              <span className="min-w-[0px] overflow-hidden text-ellipsis">{t.sectorsTeaser}</span>
              <span className="shrink-0">{icon(<path d="M5 12h14M13 6l6 6-6 6" />, 15, 2)}</span>
            </a>
          </div>
        </div>
      </HeroStage>
    </section>
  );
}
