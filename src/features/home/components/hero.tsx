import { TradeMarquee } from "@/features/home/components/trade-marquee";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale; dict: Dictionary };

export function Hero({ dict }: Props) {
  const t = dict.hero;

  return (
    <section
      id="accueil"
      className="px-[clamp(16px,4vw,32px)] pt-[clamp(28px,5vw,82px)] pb-[clamp(40px,6vw,80px)]"
    >
      {/* Bloc texte — même grille que le header et les sections (bord à 1160/2). */}
      <div className="mx-auto max-w-290">
        <p
          data-reveal="up"
          className="mb-6 flex items-center gap-2 text-sm font-semibold text-texte2"
        >
          <span className="h-2 w-2 rounded-full bg-emeraude" />
          {t.badge}
        </p>

        <h1
          data-reveal="left"
          data-reveal-delay="90"
          className="max-w-[20ch] font-display text-[40px] leading-none tracking-normal text-balance antialiased md:text-[56px] xl:text-[64px]"
        >
          {t.titleA}{" "}
          <span>{t.titleB}</span>
        </h1>

        <p
          data-reveal="left"
          data-reveal-delay="190"
          className="mt-6 max-w-[52ch] text-base leading-[1.6] text-texte2 text-pretty"
        >
          {t.subtitle}
        </p>

        <hr className="mt-9 border-0 border-t border-ligne" />
      </div>

      {/* Rangée d'images métier — même grille (1160), défile/déborde à droite. */}
      <div
        data-reveal="up"
        data-reveal-delay="280"
        className="mx-auto mt-8 max-w-290"
      >
        <TradeMarquee demos={t.demos} label={t.tradesLabel} />
      </div>
    </section>
  );
}
