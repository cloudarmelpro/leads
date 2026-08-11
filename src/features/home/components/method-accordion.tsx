"use client";

import { ArrowDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

type Step = { n: string; title: string; desc: string };
type Props = { steps: Step[] };

/**
 * Accordéon des étapes (réf. éditoriale « Services ») : une ligne = un titre + une
 * flèche ; au clic, la description se déploie (une seule ouverte à la fois).
 * Ouverture/fermeture animées avec Framer Motion, désactivées sous reduced-motion.
 */
export function MethodAccordion({ steps }: Props) {
  const [open, setOpen] = useState(0); // première étape ouverte par défaut
  const reduce = useReducedMotion();

  return (
    <div className="border-t border-ligne">
      {steps.map((step, index) => {
        const isOpen = open === index;
        return (
          <div key={step.n} className="border-b border-ligne">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : index)}
              aria-expanded={isOpen}
              className="flex w-full cursor-pointer items-center gap-4 py-5 text-left"
            >
              <span className="font-mono text-[13px] text-texte2">0{step.n}</span>
              <span className="flex-1 font-display text-[clamp(18px,2.1vw,26px)] leading-[1.2] text-encre">
                {step.title}
              </span>
              <ArrowDown
                size={20}
                aria-hidden
                className={`shrink-0 text-texte2 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.34, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-[60ch] pr-8 pb-6 text-[15px] leading-[1.65] text-texte2 text-pretty">
                    {step.desc}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
