"use client";

import Link from "next/link";
import { useId, useState } from "react";

import { GOUTTIERE } from "@/components/shared/container";
import { AccordionRow } from "@/features/home/components/accordion-row";
import { SectionHead } from "@/components/shared/section-head";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = {
  dict: Pick<Dictionary, "faq">;
  lang: Locale;
  /** Sur la page Prix, « Combien ça coûte ? » renvoie aux tableaux ci-dessus au lieu de la page. */
  variant?: "home" | "pricing";
};

type Item = Dictionary["faq"]["items"][number] & { aLink?: string; aPricing?: string };

/**
 * FAQ : huit questions en accordéon, réparties également en deux colonnes (une
 * seule sous 760px). Aucune ouverte par défaut, une seule à la fois. Une réponse peut
 * contenir « {link} », remplacé par un lien vers la page Prix libellé `aLink`.
 */
export function Faq({ dict, lang, variant = "home" }: Props) {
  const [open, setOpen] = useState(-1);
  const baseId = useId();
  const t = dict.faq;

  const answer = (item: Item) => {
    if (variant === "pricing" && item.aPricing) return item.aPricing;
    const [before, after] = item.a.split("{link}");
    if (after === undefined || !item.aLink) return item.a;
    return (
      <>
        {before}
        <Link href={`/${lang}/prix`} className="text-vert underline underline-offset-[3px] hover:text-vert-clair">
          {item.aLink}
        </Link>
        {after}
      </>
    );
  };

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
                    {answer(item)}
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
