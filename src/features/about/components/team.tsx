import type { CSSProperties } from "react";

import type { Dictionary } from "@/lib/i18n/dictionaries";
import { PREVIEW_IMAGES, teamPreviewBg } from "@/lib/preview-image";

type Props = { dict: Dictionary };

/**
 * Section équipe. Volontairement SANS photo réelle : on n'invente ni visage ni
 * personne. Les cases restent des placeholders explicites jusqu'à ce que les
 * vrais membres (noms, rôles, photos) soient fournis.
 */
export function Team({ dict }: Props) {
  const t = dict.about.team;

  return (
    <section className="px-[clamp(16px,4vw,32px)] py-[clamp(48px,7vw,96px)]">
      <div className="mx-auto max-w-[1160px]">
        <p data-reveal="up" className="mb-6">
          <span className="rounded-full bg-white px-3.75 py-1.75 text-[13px] font-semibold text-texte2 shadow-[0_4px_10px_-6px_rgba(15,29,23,.2)]">
            {t.kicker}
          </span>
        </p>

        {/* Titre : glisse depuis la droite, comme les titres de l'accueil. */}
        <div
          data-reveal-child="right"
          style={
            {
              "--reveal-delay": "80ms",
              "--reveal-dist": "40vw",
              "--reveal-dur": "3400ms",
            } as CSSProperties
          }
          className="w-full"
        >
          <h2 className="max-w-[24ch] font-display text-[clamp(23px,3.2vw,36px)] leading-[1.2] tracking-normal text-balance">
            {t.titleA}
            <br />
            {t.titleB}
          </h2>
        </div>

        {/* ⚠️ Placeholder : noms, rôles et photos ci-dessous sont des EXEMPLES
            (voir dictionnaires + pravatar). À remplacer par la vraie équipe. */}
        <p
          data-reveal="left"
          data-reveal-delay="160"
          className="mt-4 max-w-[52ch] text-base leading-[1.6] text-texte2 text-pretty"
        >
          {t.note}
        </p>

        <div className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.members.map((member, index) => {
            const col = index % 3;
            const dir = col === 0 ? "left" : col === 2 ? "right" : "up";
            return (
              <figure
                key={index}
                data-reveal={dir}
                data-reveal-delay={`${index * 80}`}
                data-reveal-dist={col === 1 ? "0px" : "120px"}
                className="group"
              >
                {/* Wrapper qui découpe le zoom de l'image au survol. */}
                <div className="overflow-hidden rounded-2xl">
                  <div
                    style={teamPreviewBg(index)}
                    className="flex aspect-[4/5] items-end bg-[repeating-linear-gradient(45deg,#DCE9E0_0_14px,#EDF4EF_14px_28px)] p-3.5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 motion-reduce:transition-none"
                  >
                    {!PREVIEW_IMAGES && (
                      <span className="rounded-md bg-white/85 px-2.5 py-1 font-mono text-[11px] text-texte2">
                        {member.imgLabel}
                      </span>
                    )}
                  </div>
                </div>
                <figcaption className="mt-4">
                  <p className="font-display text-lg">{member.name}</p>
                  <p className="mt-0.5 text-sm text-texte2">{member.role}</p>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
