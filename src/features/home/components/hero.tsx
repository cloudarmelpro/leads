import type { CSSProperties } from "react";

import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { previewBg } from "@/lib/preview-image";

type Props = { lang: Locale; dict: Dictionary };

export function Hero({ dict }: Props) {
  const t = dict.hero;
  const pills = [t.strip1, t.strip2, t.strip3];

  return (
    <section
      id="accueil"
      className="px-[clamp(16px,4vw,32px)] pt-[clamp(28px,5vw,100px)] pb-[clamp(40px,6vw,80px)]"
    >
      {/* En-tête sur deux colonnes (réf. ieaEnergy) : grand titre à gauche,
          paragraphe d'appui en haut à droite. Empilé en une colonne sur mobile.
          Même grille que le header et les sections (bord à 1160/2). */}
      <div className="mx-auto grid max-w-290 grid-cols-1 gap-x-10 gap-y-7 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:items-end">
        <div
          data-reveal-child="right"
          style={{
            "--reveal-delay": "90ms",
            "--reveal-dist": "40vw",
            "--reveal-dur": "3400ms",
          } as CSSProperties}
        >
          <h1 className="font-display text-[clamp(32px,4.4vw,54px)] leading-[1.05] tracking-normal antialiased">
            {t.titleA}{" "}
            <span className="text-emeraude dark:text-accent-strong">{t.titleB}</span>
          </h1>
        </div>

        <p
          data-reveal="left"
          data-reveal-delay="190"
          className="max-w-[46ch] text-base leading-[1.6] text-texte2 text-pretty md:justify-self-end md:pb-2 md:text-right"
        >
          {t.subtitle}
        </p>
      </div>

      {/* Grande image d'appui pleine largeur (réf. ieaEnergy) : label discret en
          haut à gauche, marqueurs de confiance en bas à gauche. */}
      <figure
        data-reveal="up"
        data-reveal-delay="280"
        style={previewBg("talgasy-web-hero", 1680, 900)}
        className="relative mx-auto mt-10 flex h-[clamp(300px,44vw,560px)] max-w-290 flex-col justify-between overflow-hidden rounded-[28px] bg-menthe p-[clamp(16px,2.4vw,26px)]"
      >
        <span className="w-fit rounded-full bg-ink/55 px-3.5 py-1.5 text-[13px] font-medium text-white backdrop-blur-sm">
          {t.demoTag}
        </span>
        <figcaption className="flex flex-wrap gap-2">
          {pills.map((pill) => (
            <span
              key={pill}
              className="rounded-full bg-white/92 px-3.5 py-1.5 text-[13px] font-semibold text-ink backdrop-blur-sm"
            >
              {pill}
            </span>
          ))}
        </figcaption>
      </figure>
    </section>
  );
}
