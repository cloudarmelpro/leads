import type { CSSProperties } from "react";

import { MethodAccordion } from "@/features/home/components/method-accordion";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { dict: Dictionary };

/**
 * Section « Comment on travaille » : titre + intro à gauche, accordéon des étapes
 * à droite. `items-end` : le bloc titre est aligné en bas, au niveau du bas de la
 * liste. Ouverture/fermeture animées (Framer Motion) dans `MethodAccordion`.
 */
export function Method({ dict }: Props) {
  const t = dict.method;

  return (
    <section id="methode" className="px-[clamp(16px,4vw,32px)] py-[clamp(56px,8vw,110px)]">
      <div className="mx-auto grid max-w-290 grid-cols-1 gap-x-16 gap-y-9 md:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] md:items-start">
        {/* Colonne gauche : intitulé + titre + intro, alignés en bas. */}
        <div>
          <p data-reveal="up" className="mb-4">
            <span className="rounded-full bg-surface px-3.5 py-1.5 text-[13px] font-semibold text-texte2">
              {t.kicker}
            </span>
          </p>
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
            <h2 className="font-display text-[clamp(30px,5vw,52px)] leading-[1.05] tracking-normal text-balance">
              {t.titleA} {t.titleB}
            </h2>
          </div>
          <p
            data-reveal="left"
            data-reveal-delay="160"
            className="mt-5 max-w-[42ch] text-base leading-[1.6] text-texte2 text-pretty"
          >
            {t.intro}
          </p>
        </div>

        {/* Colonne droite : accordéon des étapes. */}
        <div data-reveal="up" data-reveal-delay="120" data-reveal-dist="50px">
          <MethodAccordion steps={t.steps} />
        </div>
      </div>
    </section>
  );
}
