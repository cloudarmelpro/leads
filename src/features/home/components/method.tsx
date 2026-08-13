import type { CSSProperties } from "react";

import { Eyebrow } from "@/components/shared/eyebrow";
import { MethodAccordion } from "@/features/home/components/method-accordion";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { dict: Dictionary };

/**
 * Section « Comment on travaille » : accordéon des étapes à GAUCHE, titre + intro à
 * DROITE. Sur mobile (une colonne), le titre passe en premier via `order`.
 * Ouverture/fermeture animées (Framer Motion) dans `MethodAccordion`.
 */
export function Method({ dict }: Props) {
  const t = dict.method;

  return (
    <section id="methode" className="px-[clamp(16px,4vw,32px)] py-[clamp(56px,8vw,110px)]">
      <div className="mx-auto grid max-w-290 grid-cols-1 gap-x-16 gap-y-9 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] md:items-start">
        {/* Titre + intro : premier sur mobile, colonne de DROITE sur desktop,
            aligné à droite. */}
        <div className="order-1 md:order-2 md:text-right">
          <p data-reveal="up" className="mb-4">
            <Eyebrow>{t.kicker}</Eyebrow>
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
            className="mt-5 max-w-[42ch] text-base leading-[1.6] text-texte2 text-pretty md:ml-auto"
          >
            {t.intro}
          </p>
        </div>

        {/* Accordéon : second sur mobile, colonne de GAUCHE sur desktop. */}
        <div
          data-reveal="up"
          data-reveal-delay="120"
          data-reveal-dist="50px"
          className="order-2 md:order-1"
        >
          <MethodAccordion steps={t.steps} />
        </div>
      </div>
    </section>
  );
}
