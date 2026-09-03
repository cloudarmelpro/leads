import { Check, CircleCheck } from "lucide-react";

import { CONTENEUR } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeader } from "@/components/shared/section-header";
import { SurfaceCard } from "@/components/shared/surface-card";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { dict: Dictionary };
type Plan = Dictionary["pricing"]["groups"][number]["plans"][number];

// Colonnes selon le nombre de forfaits du groupe : 3 (site web), 2 (logo), 1 (hébergement).
const COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
};

/**
 * Groupes de forfaits : un seul eyebrow au-dessus du premier groupe ; chaque groupe
 * = en-tête de section de l'accueil, puis la grille de cartes.
 */
export function PricingGroups({ dict }: Props) {
  const t = dict.pricing;

  return (
    <section id="prix" className="pb-[clamp(80px,14vw,200px)]">
      <div className={`${CONTENEUR} flex flex-col gap-[clamp(56px,8vw,96px)]`}>
        {t.groups.map((group, index) => (
          <div key={group.title}>
            <SectionHeader kicker={index === 0 ? t.kicker : undefined} title={group.title} intro={group.intro} />

            <Reveal as="div" stagger={0.1} className={`mt-12 grid gap-5 ${COLS[group.plans.length] ?? COLS[3]}`}>
              {group.plans.map((plan) => (
                <PriceCard key={plan.name} plan={plan} />
              ))}
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  );
}

function PriceCard({ plan }: { plan: Plan }) {
  return (
    <SurfaceCard as="article" className="p-6 sm:p-7">
      <h3 className="relative text-[16px] leading-[1.4] font-medium text-emeraude dark:text-accent-strong">
        {plan.name}
      </h3>
      <p className="relative mt-2 font-display text-[clamp(28px,2.6vw,34px)] leading-none font-semibold tracking-[-0.5px] text-emeraude dark:text-accent-strong">
        {plan.price}
      </p>
      {plan.tagline && (
        <p className="relative mt-3 text-[13px] leading-[1.5] text-texte2">{plan.tagline}</p>
      )}

      <ul className="relative mt-6 flex flex-col gap-3">
        {plan.includes && (
          <li className="flex items-start gap-2.5 text-[13px] leading-[1.45] text-encre">
            <CircleCheck
              size={16}
              strokeWidth={2.2}
              aria-hidden
              className="mt-px shrink-0 fill-emeraude text-white dark:fill-accent-strong dark:text-fond"
            />
            <span>{plan.includes}</span>
          </li>
        )}
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-[13px] leading-[1.45] text-texte2">
            <Check
              size={14}
              strokeWidth={2.6}
              aria-hidden
              className="mt-[3px] shrink-0 text-emeraude dark:text-accent-strong"
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </SurfaceCard>
  );
}
