import { Quote } from "lucide-react";

import { SectionHeading } from "@/features/home/components/section-heading";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { dict: Dictionary };

export function Method({ dict }: Props) {
  const t = dict.method;
  const total = String(t.steps.length).padStart(2, "0");

  return (
    <section id="methode" className="px-[clamp(16px,4vw,32px)] py-[clamp(40px,6vw,80px)]">
      <div className="mx-auto max-w-[1160px]">
        <SectionHeading
          kicker={t.kicker}
          titleA={t.titleA}
          titleB={t.titleB}
          intro={t.intro}
          introMaxCh="52ch"
        />

        {/* Cartes façon « témoignage » (réf) — fond blanc, sans ombre, 3 par ligne. */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.steps.map((step, index) => {
            // Sens d'entrée selon la colonne (grille 3 colonnes), comme Services :
            // gauche depuis la gauche, droite depuis la droite, centre en fondu.
            const col = index % 3;
            const dir = col === 0 ? "left" : col === 2 ? "right" : "up";
            return (
              // Conteneur externe = révélation ; carte interne = survol (séparés
              // pour que les deux transforms ne se recouvrent pas).
              <div
                key={step.n}
                data-reveal={dir}
                data-reveal-delay={`${index * 80}`}
                data-reveal-dist={col === 1 ? "0px" : "120px"}
              >
                <div className="group flex h-full min-h-[465px] cursor-pointer flex-col rounded-3xl bg-white p-7 transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none hover:-translate-y-1.5 hover:shadow-[0_0_22px_0_rgba(15,29,23,.14)]">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-encre font-display text-[15px] text-white shadow-[0_10px_20px_-8px_rgba(15,29,23,.5)]">
                      {step.n}
                    </span>
                    <span className="font-mono text-[13px] text-texte2">
                      0{step.n} — {total}
                    </span>
                  </div>

                  {/* Bloc guillemet + phrase, centré verticalement dans la carte. */}
                  <div className="flex flex-1 flex-col justify-center py-6">
                    <Quote
                      size={34}
                      fill="currentColor"
                      className="text-lueur transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 motion-reduce:transition-none"
                      aria-hidden
                    />
                    <p className="mt-4 font-display text-[clamp(17px,1.9vw,21px)] leading-[1.34] text-encre text-balance">
                      {step.desc}
                    </p>
                  </div>

                  <div className="border-t border-ligne pt-5">
                    <p className="font-display text-base text-encre">{step.title}</p>
                    <p className="mt-0.5 text-sm text-texte2">
                      {t.stepLabel} {step.n}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
