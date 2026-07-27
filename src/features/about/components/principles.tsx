import { Award, Handshake, ShieldCheck } from "lucide-react";

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
          <span className="rounded-full bg-white px-3.75 py-1.75 text-[13px] font-semibold text-texte2 shadow-[0_4px_10px_-6px_rgba(15,29,23,.2)]">
            {t.kicker}
          </span>
        </p>

        {/* Titre bicolore : la nuance grise met en relief la bascule de sens. */}
        <h2
          data-reveal="up"
          data-reveal-delay="80"
          className="max-w-[30ch] font-display text-[clamp(23px,3.2vw,36px)] leading-[1.22] tracking-normal text-balance"
        >
          {t.leadA}
          <span className="text-texte2">{t.leadB}</span>
          {t.leadC}
        </h2>

        <div className="mt-11 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.items.map((item, index) => {
            const Icon = ICONS[index % ICONS.length];
            return (
              <div
                key={item.title}
                data-reveal="up"
                data-reveal-delay={`${index * 90}`}
                className="flex flex-col rounded-2xl bg-white p-7"
              >
                {/* Badge foncé numéroté, comme les cartes Services. */}
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-encre font-display text-[15px] text-white shadow-[0_10px_20px_-8px_rgba(15,29,23,.5)]">
                  {index + 1}
                </span>

                <div className="flex flex-1 items-center justify-center py-28">
                  <Icon size={60} strokeWidth={1.3} className="text-sapin" aria-hidden />
                </div>

                <h3 className="font-display text-lg">{item.title}</h3>
                <p className="mt-2 text-sm leading-[1.6] text-texte2 text-pretty">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
