"use client";

import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState, type CSSProperties } from "react";

import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale; dict: Dictionary };

export function Faq({ dict }: Props) {
  // La question 2 (index 1) est ouverte par défaut.
  const [openIndex, setOpenIndex] = useState(1);
  const baseId = useId();
  const reduce = useReducedMotion();
  const t = dict.faq;

  return (
    <section id="faq" className="px-[clamp(16px,4vw,32px)] py-[clamp(56px,8vw,110px)]">
      <div className="mx-auto grid max-w-290 grid-cols-1 gap-x-16 gap-y-9 md:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] md:items-start">
        {/* Colonne gauche : intitulé + titre + intro (comme la Méthode). */}
        <div>
          <p data-reveal="up" className="mb-4">
            <span className="rounded-full bg-surface px-3.5 py-1.5 text-[13px] font-semibold text-texte2">
              {t.kicker}
            </span>
          </p>
          <div
            data-reveal-child="right"
            style={
              {
                "--reveal-delay": "80ms",
                "--reveal-dist": "40vw",
                "--reveal-dur": "3400ms",
              } as CSSProperties
            }
            className="w-full"
          >
            <h2 className="font-display text-[clamp(30px,5vw,52px)] leading-[1.05] tracking-normal text-balance">
              {t.titleA} {t.titleB}
            </h2>
          </div>
          <p
            data-reveal="left"
            data-reveal-delay="160"
            className="mt-5 max-w-[42ch] text-base leading-[1.6] text-texte2 text-pretty"
          >
            {t.intro}
          </p>
        </div>

        {/* Colonne droite : les questions (accordéon). */}
        <div className="flex flex-col gap-4">
          {t.items.map((item, index) => {
            const open = openIndex === index;
            const panelId = `${baseId}-panel-${index}`;
            const buttonId = `${baseId}-button-${index}`;

            return (
              <div
                key={item.q}
                data-reveal="up"
                data-reveal-delay={`${index * 80}`}
                className="rounded-2xl bg-surface"
              >
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(open ? -1 : index)}
                    className="flex min-h-16 cursor-pointer w-full items-center gap-4 border-none bg-transparent px-6 py-5 text-left"
                  >
                    <span className="flex-1 text-[15px] font-normal text-encre leading-[1.65]">{item.q}</span>
                    {/* Chevron discret (fermé : pointe à droite ; ouvert : pointe en bas). */}
                    <ChevronDown
                      size={20}
                      strokeWidth={2.2}
                      aria-hidden
                      className={`shrink-0 text-texte2 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                        open ? "rotate-0" : "-rotate-90"
                      }`}
                    />
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      key="panel"
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={reduce ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-[14px] leading-[1.65] text-texte2 text-pretty">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
