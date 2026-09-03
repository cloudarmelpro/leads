
import { CONTENEUR } from "@/components/shared/container";
import { Eyebrow } from "@/components/shared/eyebrow";
import { SplitReveal } from "@/components/shared/split-reveal";
import { MethodAccordion } from "@/features/home/components/method-accordion";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { dict: Dictionary };

/**
 * Section « Comment on travaille » (design refonte) : titre + intro à GAUCHE,
 * accordéon des étapes à DROITE (numéros verts).
 * Ouverture/fermeture et flèches animées (GSAP) dans `MethodAccordion`.
 */
export function Method({ dict }: Props) {
  const t = dict.method;

  return (
    <section id="methode" className="pb-[clamp(80px,14vw,200px)]">
      <div className={`${CONTENEUR} grid grid-cols-1 gap-x-16 gap-y-9 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:items-start`}>
        {/* Titre + intro à gauche. */}
        <div>
          <p className="mb-1">
            <Eyebrow>{t.kicker}</Eyebrow>
          </p>
          <SplitReveal as="h2" className="font-display text-[clamp(24px,4vw,38px)] leading-[1.143] font-normal tracking-[-1.2px] text-balance">
            {t.titleA} {t.titleB}
          </SplitReveal>
          <SplitReveal
            as="p"
            delay={0.1}
            className="mt-5 max-w-[42ch] text-[16px] leading-[24px] text-texte2 text-pretty"
          >
            {t.intro}
          </SplitReveal>
        </div>

        {/* Accordéon des étapes à droite. */}
        <div>
          <MethodAccordion steps={t.steps} />
        </div>
      </div>
    </section>
  );
}
