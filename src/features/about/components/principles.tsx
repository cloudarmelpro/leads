import { Award, Handshake, ShieldCheck } from "lucide-react";
import type { CSSProperties } from "react";

import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { dict: Dictionary };

// Une icône par valeur : qualité, professionnalisme, confiance.
const ICONS = [Award, ShieldCheck, Handshake];

export function Principles({ dict }: Props) {
  const t = dict.about.principles;

  return (
    <section className="px-[clamp(16px,4vw,32px)] py-[clamp(48px,7vw,96px)]">
      <div className="mx-auto max-w-290">
        <p data-reveal="up" className="mb-6">
          <span className="rounded-full bg-white px-3.75 py-1.75 text-[13px] font-semibold text-texte2">
            {t.kicker}
          </span>
        </p>

        {/* Titre bicolore ; glisse depuis la droite, comme les titres de l'accueil. */}
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
          <h2 className="max-w-[30ch] text-[clamp(23px,3.2vw,30px)] leading-[1.22] tracking-normal text-balance">
            {t.leadA}
            <span className="text-texte2">{t.leadB}</span>
            {t.leadC}
          </h2>
        </div>

        <div className="mt-11 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.items.map((item, index) => {
            const Icon = ICONS[index % ICONS.length];
            // Sens d'entrée selon la colonne (grille 3 colonnes), comme Services.
            const col = index % 3;
            const dir = col === 0 ? "left" : col === 2 ? "right" : "up";
            return (
              // Conteneur externe = révélation ; carte interne = survol.
              <div
                key={item.title}
                data-reveal={dir}
                data-reveal-delay={`${index * 80}`}
                data-reveal-dist={col === 1 ? "0px" : "120px"}
              >
                <div className="group flex h-full cursor-pointer flex-col rounded-2xl bg-white p-7 transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none hover:-translate-y-1.5 hover:shadow-[0_0_22px_0_rgba(15,29,23,.14)]">
                  {/* Badge foncé numéroté, comme les cartes Services. */}
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-encre font-display text-[15px] text-white shadow-[0_10px_20px_-8px_rgba(15,29,23,.5)]">
                    {index + 1}
                  </span>

                  <div className="flex flex-1 items-center justify-center py-28">
                    <Icon
                      size={60}
                      strokeWidth={1.3}
                      className="text-sapin transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 motion-reduce:transition-none"
                      aria-hidden
                    />
                  </div>

                  <h3 className="font-display text-lg">{item.title}</h3>
                  <p className="mt-2 text-sm leading-[1.6] text-texte2 text-pretty">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
