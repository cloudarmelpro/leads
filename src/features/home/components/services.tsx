import { LineChart, Monitor, PenTool, Rocket } from "lucide-react";

import { SectionHeading } from "@/features/home/components/section-heading";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { dict: Dictionary };

// Icônes décoratives par carte (placeholder — remplacées quand les vrais services
// seront confirmés). lucide-react uniquement, jamais d'emoji (CLAUDE.md).
const ICONS = [Monitor, PenTool, Rocket, LineChart];

export function Services({ dict }: Props) {
  const t = dict.services;

  return (
    <section id="services" className="px-[clamp(16px,4vw,32px)] py-[clamp(56px,8vw,110px)]">
      <div className="mx-auto max-w-290">
        <SectionHeading kicker={t.kicker} titleA={t.titleA} titleB={t.titleB} intro={t.intro} />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.items.map((item, index) => {
            const Icon = ICONS[index % ICONS.length];
            // Sens d'entrée selon la colonne (grille 3 colonnes) : gauche depuis la
            // gauche, droite depuis la droite, centre en simple fondu (dist 0).
            const col = index % 3;
            const dir = col === 0 ? "left" : col === 2 ? "right" : "up";
            return (
              // Conteneur externe = révélation (glissement). Carte interne = survol :
              // séparés pour que les deux transforms ne se recouvrent pas.
              <div
                key={item.name}
                data-reveal={dir}
                data-reveal-delay={`${index * 80}`}
                data-reveal-dist={col === 1 ? "0px" : "120px"}
              >
                <div className="group flex h-full cursor-pointer flex-col rounded-2xl bg-white p-7 transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none hover:-translate-y-1.5 hover:shadow-[0_0_22px_0_rgba(15,29,23,.14)]">
                  {/* Badge foncé numéroté, en haut à gauche (comme la référence). */}
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-encre font-display text-[15px] text-white shadow-[0_10px_20px_-8px_rgba(15,29,23,.5)]">
                    {index + 1}
                  </span>

                  {/* Icône centrale — grande zone verticale pour des cartes hautes. */}
                  <div className="flex flex-1 items-center justify-center py-28">
                    <Icon
                      size={60}
                      strokeWidth={1.3}
                      className="text-sapin transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 motion-reduce:transition-none"
                      aria-hidden
                    />
                  </div>

                  {/* Titre + repère « à confirmer » (contenu encore placeholder). */}
                  <p className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-lg">{item.name}</span>
                    <span className="rounded-full border border-dashed border-[#B7CDBF] bg-fond px-2 py-[3px] font-mono text-[11px] text-texte2">
                      {dict.common.tbd}
                    </span>
                  </p>
                  <p className="mt-2 text-sm leading-[1.6] text-texte2 text-pretty">{item.note}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
