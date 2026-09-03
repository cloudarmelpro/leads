"use client";

import { useState } from "react";

import { Collapse, Rotate } from "@/components/shared/collapse";
import { Reveal } from "@/components/shared/reveal";
import { ArrowDown } from "@/components/ui/arrows";

type Step = { n: string; title: string; desc: string };
type Props = { steps: Step[] };

/**
 * Accordéon des étapes : une ligne = un numéro + un titre + une flèche ; au clic,
 * la description se déplie (une seule ouverte à la fois). Lignes révélées au
 * scroll ; ouverture et flèche animées par GSAP (`Collapse` / `Rotate`).
 */
export function MethodAccordion({ steps }: Props) {
  const [open, setOpen] = useState(0); // première étape ouverte par défaut

  return (
    <Reveal as="div" stagger={0.06} className="border-t border-ligne">
      {steps.map((step, index) => {
        const isOpen = open === index;
        return (
          <div key={step.n} className="border-b border-ligne">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : index)}
              aria-expanded={isOpen}
              className="group flex w-full cursor-pointer items-center gap-4 py-5 text-left"
            >
              <span className="text-[14px] leading-[25px] font-light text-accent-strong">0{step.n}</span>
              <span
                className={`flex-1 text-[16px] leading-[1.55] text-encre ${isOpen ? "font-medium" : "font-light"}`}
              >
                {step.title}
              </span>
              {/* Flèche bas pivotée de 180° = flèche haut (même tracé). */}
              <Rotate deg={isOpen ? 180 : 0} className="text-texte2 group-hover:text-encre">
                <ArrowDown className="h-[18px]" />
              </Rotate>
            </button>

            <Collapse open={isOpen}>
              <p className="max-w-[60ch] pr-8 pb-6 text-[15px] leading-[1.65] font-light text-texte2 text-pretty">
                {step.desc}
              </p>
            </Collapse>
          </div>
        );
      })}
    </Reveal>
  );
}
