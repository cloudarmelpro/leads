"use client";

import { useId, useState } from "react";

import { Collapse, Rotate } from "@/components/shared/collapse";
import { CONTENEUR } from "@/components/shared/container";
import { ArrowRight } from "@/components/ui/arrows";
import { Eyebrow } from "@/components/shared/eyebrow";
import { Reveal } from "@/components/shared/reveal";
import { SplitReveal } from "@/components/shared/split-reveal";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { dict: Dictionary };

export function Faq({ dict }: Props) {
  // La question 2 (index 1) est ouverte par défaut.
  const [openIndex, setOpenIndex] = useState(1);
  const baseId = useId();
  const t = dict.faq;

  return (
    <section id="faq" className="pb-[clamp(80px,14vw,200px)]">
      <div className={`${CONTENEUR} grid grid-cols-1 gap-x-16 gap-y-9 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:items-start`}>
        {/* Colonne gauche : intitulé + titre + intro. */}
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
            className="mt-5 max-w-[42ch] text-body-fluid text-texte2 text-pretty"
          >
            {t.intro}
          </SplitReveal>
        </div>

        {/* Colonne droite : les questions (accordéon). Lignes soulignées ; seule la
            question ouverte révèle sa réponse dans une carte arrondie (design).
            Lignes révélées au scroll ; dépliage et flèche animés par GSAP. */}
        <Reveal as="div" stagger={0.06} className="flex flex-col">
          {t.items.map((item, index) => {
            const open = openIndex === index;
            const panelId = `${baseId}-panel-${index}`;
            const buttonId = `${baseId}-button-${index}`;

            return (
              <div key={item.q} className="flex flex-col border-b border-ligne">
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(open ? -1 : index)}
                    className="group flex w-full cursor-pointer items-center gap-4 border-none bg-transparent px-6 py-5 text-left"
                  >
                    <span
                      className={`flex-1 text-body-fluid text-encre text-pretty ${open ? "font-medium" : "font-light"}`}
                    >
                      {item.q}
                    </span>
                    {/* Flèche vers la droite quand fermé ; masquée quand ouvert. */}
                    {!open && (
                      <Rotate deg={0} className="text-texte2 group-hover:text-encre">
                        <ArrowRight className="w-[18px]" />
                      </Rotate>
                    )}
                  </button>
                </h3>

                <Collapse open={open} id={panelId} role="region" aria-labelledby={buttonId}>
                  <div className="mb-5 rounded-2xl border border-ligne bg-surface px-6 py-5 dark:border-transparent">
                    <p className="text-small-fluid font-light text-texte2 text-pretty">{item.a}</p>
                  </div>
                </Collapse>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
