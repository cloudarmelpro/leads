import { AtSign, Monitor, RefreshCw, Server } from "lucide-react";
import type { CSSProperties } from "react";

import { Eyebrow } from "@/components/shared/eyebrow";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { dict: Dictionary };

// Une icône par service, dans l'ordre : création, refonte, hébergement, courriels.
const ICONS = [Monitor, RefreshCw, Server, AtSign];
// Bento (réf.) : étroite + large / large + étroite.
const SPAN = ["lg:col-span-1", "lg:col-span-2", "lg:col-span-2", "lg:col-span-1"];
// Première ligne un peu plus haute que la seconde.
const ROW_H = ["lg:h-88", "lg:h-88", "lg:h-72", "lg:h-72"];

export function Services({ dict }: Props) {
  const t = dict.services;

  return (
    <section id="services" className="px-[clamp(16px,4vw,32px)] py-[clamp(56px,8vw,110px)]">
      <div className="mx-auto max-w-290">
        {/* En-tête deux colonnes : titre à gauche, intro à droite (alignée en bas). */}
        <div className="grid grid-cols-1 gap-x-16 gap-y-5 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:items-end">
          <div>
            <p data-reveal="up" className="mb-4">
              <Eyebrow>{t.kicker}</Eyebrow>
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
          </div>
          <p
            data-reveal="left"
            data-reveal-delay="160"
            className="max-w-[46ch] text-base leading-[1.6] text-texte2 text-pretty md:pb-2"
          >
            {t.intro}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {t.items.map((item, index) => {
            const Icon = ICONS[index % ICONS.length];
            const wide = index === 1 || index === 2;

            return (
              <article
                key={item.name}
                data-reveal="up"
                data-reveal-delay={`${index * 90}`}
                data-reveal-dist="70px"
                className={`flex min-h-56 ${ROW_H[index]} flex-col justify-between rounded-3xl bg-surface p-7 sm:p-8 ${SPAN[index]}`}
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-sapin dark:bg-white/12 dark:text-accent-strong">
                  <Icon size={22} strokeWidth={1.6} aria-hidden />
                </span>

                {wide ? (
                  <div className="sm:flex sm:items-end sm:justify-between sm:gap-10">
                    <h3 className="font-display text-[clamp(20px,2.2vw,28px)] leading-[1.15] sm:max-w-[46%]">
                      {item.name}
                    </h3>
                    <p className="mt-3 text-sm leading-[1.6] text-texte2 text-pretty sm:mt-0 sm:max-w-[50%]">
                      {item.note}
                    </p>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-display text-xl leading-[1.2]">{item.name}</h3>
                    <p className="mt-3 text-sm leading-[1.6] text-texte2 text-pretty">{item.note}</p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
