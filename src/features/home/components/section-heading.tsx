import type { CSSProperties } from "react";

type Props = {
  kicker: string;
  titleA: string;
  titleB: string;
  intro?: string;
  introMaxCh?: string;
};

/** Titre de section : pastille + titre sur deux lignes (Cal Sans). */
export function SectionHeading({ kicker, titleA, titleB, intro, introMaxCh = "56ch" }: Props) {
  return (
    <div className="mb-11 text-center">
      <p data-reveal="up" className="mb-4">
        <span className="rounded-full bg-surface px-3.75 py-1.75 text-[13px] font-semibold text-texte2">
          {kicker}
        </span>
      </p>
      {/* Conteneur observé (en place) ; le titre glisse depuis la droite — même
          effet que le titre du hero, sans blocage. Variables en inline pour un
          départ correct dès le 1er rendu (cf. hero). */}
      <div
        data-reveal-child="right"
        style={{
          "--reveal-delay": "80ms",
          "--reveal-dist": "40vw",
          "--reveal-dur": "3400ms",
        } as CSSProperties}
      >
        <h2 className="font-display text-[clamp(23px,4.8vw,46px)] leading-[1.15] tracking-normal">
          {titleA}
          <br />
          {titleB}
        </h2>
      </div>
      {intro && (
        <p
          data-reveal="left"
          data-reveal-delay="160"
          className="mx-auto mt-4 text-base leading-[1.6] text-texte2 text-pretty"
          style={{ maxWidth: introMaxCh }}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
