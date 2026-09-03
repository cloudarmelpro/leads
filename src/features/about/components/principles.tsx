import { Award, Handshake, ShieldCheck } from "lucide-react";

import { CONTENEUR } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeader } from "@/components/shared/section-header";
import { SurfaceCard } from "@/components/shared/surface-card";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { dict: Dictionary };

// Une icône par valeur : qualité, professionnalisme, confiance.
const ICONS = [Award, ShieldCheck, Handshake];

/** Principes : en-tête de section de l'accueil + trois cartes au style Services. */
export function Principles({ dict }: Props) {
  const t = dict.about.principles;

  return (
    <section className="pb-[clamp(80px,14vw,200px)]">
      <div className={CONTENEUR}>
        <SectionHeader kicker={t.kicker} title={`${t.titleA} ${t.titleB}`} intro={t.note} />

        <Reveal as="div" stagger={0.1} className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {t.items.map((item, index) => {
            const Icon = ICONS[index % ICONS.length];
            return (
              <SurfaceCard key={item.title} as="article" className="gap-9 px-10 pt-10 pb-11">
                <div className="relative flex items-center gap-3">
                  <Icon size={22} strokeWidth={1.8} aria-hidden className="shrink-0 text-emeraude dark:text-accent-strong" />
                  <h3 className="text-title-fluid font-medium text-encre">{item.title}</h3>
                </div>
                <p className="relative text-small-fluid text-texte2 text-pretty">{item.desc}</p>
              </SurfaceCard>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
