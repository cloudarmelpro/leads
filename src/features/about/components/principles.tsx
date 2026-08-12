import { Award, Handshake, ShieldCheck } from "lucide-react";
import type { CSSProperties } from "react";

import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { dict: Dictionary };

// Une icône par valeur : qualité, professionnalisme, confiance.
const ICONS = [Award, ShieldCheck, Handshake];
// Bento (comme Services) adapté à 3 items : étroite + large sur la 1re ligne,
// pleine largeur sur la 2e.
const SPAN = ["lg:col-span-1", "lg:col-span-2", "lg:col-span-3"];
const ROW_H = ["lg:h-80", "lg:h-80", "lg:h-72"];

export function Principles({ dict }: Props) {
  const t = dict.about.principles;

  return (
    <section className="px-[clamp(16px,4vw,32px)] py-[clamp(56px,8vw,110px)]">
      <div className="mx-auto max-w-290">
        {/* En-tête deux colonnes : titre à gauche, note à droite (alignée en bas),
            exactement comme la section Services de l'accueil. */}
        <div className="grid grid-cols-1 gap-x-16 gap-y-5 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:items-end">
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
          </div>
          <p
            data-reveal="left"
            data-reveal-delay="160"
            className="max-w-[46ch] text-base leading-[1.6] text-texte2 text-pretty md:pb-2"
          >
            {t.note}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {t.items.map((item, index) => {
            const Icon = ICONS[index % ICONS.length];
            const wide = index === 1 || index === 2;

            return (
              <article
                key={item.title}
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
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-[1.6] text-texte2 text-pretty sm:mt-0 sm:max-w-[50%]">
                      {item.desc}
                    </p>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-display text-xl leading-[1.2]">{item.title}</h3>
                    <p className="mt-3 text-sm leading-[1.6] text-texte2 text-pretty">{item.desc}</p>
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
