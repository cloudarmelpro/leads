"use client";

import Link from "next/link";
import { useId, useState, type ReactNode } from "react";

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

const EASE_IN = "cubic-bezier(0.22,1,0.36,1)";

/**
 * Ligne de la FAQ de l'accueil (maquette, 2026-09-24) : question en 500 sur une ligne
 * coupée quand fermée, plus/moins en vert ; la réponse s'ouvre en 500ms, puis apparaît en
 * glissant de 6px, 80ms plus tard.
 */
function FaqRow({ id, open, onToggle, question, children }: { id: string; open: boolean; onToggle: () => void; question: string; children: ReactNode }) {
  const panelId = `${id}-panel`;
  const buttonId = `${id}-button`;

  return (
    <div className="overflow-hidden rounded-[16px] bg-surface ring-1 ring-ligne ring-inset dark:ring-0">
      <h3 className="m-[0px]">
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex min-h-[64px] w-full cursor-pointer items-center gap-[20px] px-[24px] py-[20px] text-left"
        >
          <span className={`min-w-[0px] flex-1 overflow-hidden text-[16px] leading-[24px] font-medium text-encre text-ellipsis ${open ? "whitespace-normal" : "whitespace-nowrap"}`}>
            {question}
          </span>
          <span aria-hidden className="relative block h-[11px] w-[11px] shrink-0">
            <span className="absolute top-[4.5px] left-[0px] block h-[2px] w-[11px] rounded-[2px] bg-vert" />
            <span
              className={`absolute top-[4.5px] left-[0px] block h-[2px] w-[11px] rounded-[2px] bg-vert transition-transform duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${open ? "rotate-0" : "rotate-90"}`}
            />
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        aria-hidden={!open}
        // Fermée, la réponse reste montée (pour animer la fermeture) : `inert` retire son
        // lien éventuel de l'ordre de tabulation.
        inert={!open}
        className="grid"
        style={{ gridTemplateRows: open ? "1fr" : "0fr", transition: `grid-template-rows 500ms ${EASE_IN}` }}
      >
        <div className="min-h-[0px] overflow-hidden">
          <p
            className="m-[0px] max-w-[760px] px-[24px] pb-[22px] text-[15px] leading-[26px] font-normal text-texte2 text-pretty"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0)" : "translateY(-6px)",
              transition: `opacity 320ms ${EASE_IN} ${open ? "80ms" : "0ms"}, transform 420ms ${EASE_IN} ${open ? "80ms" : "0ms"}`,
            }}
          >
            {children}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * FAQ : huit questions en accordéon, aucune ouverte par défaut, une seule à la fois. Une
 * réponse peut contenir « {link} », remplacé par un lien vers la page Prix libellé `aLink`.
 * Accueil (maquette, 2026-09-24) : en-tête à gauche, les huit questions dans une seule
 * colonne à droite (0,9 / 2,1), une colonne sous 900px. Page Prix : mise en page d'origine,
 * en-tête au-dessus et questions sur deux colonnes.
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
  const toggle = (index: number) => setOpen(open === index ? -1 : index);

  if (variant === "home") {
    return (
      <section id="faq" className="relative flex justify-center px-[clamp(16px,4vw,56px)] pb-[clamp(96px,11vw,180px)]">
        <div className="grid w-full max-w-[1400px] grid-cols-[minmax(0,1fr)] items-start gap-[clamp(24px,3vw,64px)] min-[900px]:grid-cols-[minmax(0,0.9fr)_minmax(0,2.1fr)]">
          <div className="flex flex-col items-start gap-[14px]">
            <div className="flex flex-col gap-[2px]">
              <span className="text-[13px] leading-[20px] font-normal tracking-[0.08em] text-vert uppercase">{t.kicker}</span>
              <h2 className="m-[0px] text-[clamp(22px,2.2vw,30px)] leading-[1.2] font-semibold tracking-[-0.01em] text-encre text-pretty">{`${t.titleA} ${t.titleB}`}</h2>
            </div>
            <p className="m-[0px] max-w-[420px] text-[15px] leading-[26px] font-normal text-texte2 text-pretty">{t.intro}</p>
          </div>
          <div className="flex flex-col gap-[10px]">
            {t.items.map((item, index) => (
              <FaqRow key={item.q} id={`${baseId}-faq-${index}`} open={open === index} onToggle={() => toggle(index)} question={item.q}>
                {answer(item)}
              </FaqRow>
            ))}
          </div>
        </div>
      </section>
    );
  }

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
                  <AccordionRow key={item.q} id={`${baseId}-faq-${index}`} open={open === index} onToggle={() => toggle(index)} title={item.q} bodyIndent={24}>
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
