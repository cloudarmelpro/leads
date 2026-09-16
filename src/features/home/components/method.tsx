"use client";

import { useId, useState } from "react";

import { GOUTTIERE } from "@/components/shared/container";
import { AccordionRow } from "@/features/home/components/accordion-row";
import { SectionHead } from "@/components/shared/section-head";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { dict: Pick<Dictionary, "method"> };

/**
 * Méthode : six étapes numérotées en accordéon, quatre dans la colonne de gauche et
 * deux à droite (une seule colonne sous 760px). Une seule étape ouverte à la fois,
 * la première par défaut ; chaque colonne garde sa hauteur propre.
 */
export function Method({ dict }: Props) {
  const [open, setOpen] = useState(0);
  const baseId = useId();
  const t = dict.method;

  const columns = [t.steps.slice(0, 4), t.steps.slice(4)];

  return (
    <section className={`relative flex justify-center pb-[clamp(112px,16vw,240px)] ${GOUTTIERE}`}>
      <div className="flex w-full max-w-[1100px] flex-col gap-[48px]">
        <SectionHead id="methode" label={t.kicker} title={`${t.titleA} ${t.titleB}`} intro={t.intro} introMax={420} />

        <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-[10px] min-[760px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          {columns.map((steps, col) => (
            <div key={col} className="flex flex-col gap-[10px]">
              {steps.map((step) => {
                const index = t.steps.indexOf(step);
                return (
                  <AccordionRow
                    key={step.n}
                    id={`${baseId}-step-${index}`}
                    open={open === index}
                    onToggle={() => setOpen(open === index ? -1 : index)}
                    number={step.n.padStart(2, "0")}
                    title={step.title}
                    bodyIndent={60}
                  >
                    {step.desc}
                  </AccordionRow>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
