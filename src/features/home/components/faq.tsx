"use client";

import { useId, useState } from "react";

import { GOUTTIERE } from "@/components/shared/container";
import { AccordionRow } from "@/features/home/components/accordion-row";
import { SectionHead } from "@/components/shared/section-head";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { dict: Dictionary };

/**
 * FAQ : huit questions en accordéon, réparties également en deux colonnes (une
 * seule sous 760px). Aucune ouverte par défaut, une seule à la fois.
 */
export function Faq({ dict }: Props) {
  const [open, setOpen] = useState(-1);
  const baseId = useId();
  const t = dict.faq;

  const half = Math.ceil(t.items.length / 2);
  const columns = [t.items.slice(0, half), t.items.slice(half)];

  return (
    <section className={`relative flex justify-center pb-[clamp(112px,16vw,240px)] ${GOUTTIERE}`}>
      <div className="flex w-full max-w-[1100px] flex-col gap-[48px]">
        <SectionHead id="faq" label={t.kicker} title={`${t.titleA} ${t.titleB}`} intro={t.intro} introMax={420} />

        <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-[10px] min-[760px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          {columns.map((items, col) => (
            <div key={col} className="flex flex-col gap-[10px]">
              {items.map((item) => {
                const index = t.items.indexOf(item);
                return (
                  <AccordionRow
                    key={item.q}
                    id={`${baseId}-faq-${index}`}
                    open={open === index}
                    onToggle={() => setOpen(open === index ? -1 : index)}
                    title={item.q}
                    bodyIndent={24}
                  >
                    {item.a}
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
