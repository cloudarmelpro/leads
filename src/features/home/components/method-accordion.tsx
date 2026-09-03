"use client";

import { useState } from "react";

import { Collapse, Rotate } from "@/components/shared/collapse";
import { Reveal } from "@/components/shared/reveal";
import { ChevronDown } from "lucide-react";

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
              className="group flex w-full cursor-pointer items-center gap-3 py-4 text-left sm:gap-4 sm:py-5"
            >
              <span className="text-[0.875rem] leading-[1.5625rem] font-light text-accent-strong">0{step.n}</span>
              <span
                className={`flex-1 text-small-fluid text-encre sm:text-body-fluid ${isOpen ? "font-medium" : "font-light"}`}
              >
                {step.title}
              </span>
              {/* Chevron bas, pivoté de 180° à l'ouverture. */}
              <Rotate deg={isOpen ? 180 : 0} className="text-texte2 group-hover:text-encre">
                <ChevronDown size={18} strokeWidth={2} aria-hidden className="shrink-0" />
              </Rotate>
            </button>

            <Collapse open={isOpen}>
              <p className="max-w-[60ch] pr-8 pb-5 text-[0.875rem] leading-[1.6] font-light text-texte2 text-pretty sm:pb-6 sm:text-small-fluid">
                {step.desc}
              </p>
            </Collapse>
          </div>
        );
      })}
    </Reveal>
  );
}
