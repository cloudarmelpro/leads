import { AtSign, Code2, RefreshCw, Server } from "lucide-react";

import { CONTENEUR } from "@/components/shared/container";
import { Eyebrow } from "@/components/shared/eyebrow";
import { Reveal } from "@/components/shared/reveal";
import { SplitReveal } from "@/components/shared/split-reveal";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { dict: Dictionary };

// Icônes vertes inline (design) : création, refonte, hébergement, courriels.
const ICONS = [Code2, RefreshCw, Server, AtSign];
// Bento du design : large + étroite / étroite + large.
const SPAN = ["lg:col-span-2", "lg:col-span-1", "lg:col-span-1", "lg:col-span-2"];
// Illustrations décoratives (traits gris subtils) sur les 2 cartes larges.
const DECOR: (string | null)[] = ["/services-globe.svg", null, null, "/services-mail.svg"];

export function Services({ dict }: Props) {
  const t = dict.services;

  return (
    <section id="services" className="pt-[clamp(16px,2.5vw,32px)] pb-[clamp(80px,14vw,200px)]">
      <div className={CONTENEUR}>
        {/* En-tête : eyebrow + titre à gauche, intro à droite (alignée en bas). */}
        <div className="grid grid-cols-1 gap-x-16 gap-y-5 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:items-end">
          <div>
            <p className="mb-1">
              <Eyebrow>{t.kicker}</Eyebrow>
            </p>
            <SplitReveal as="h2" className="font-display text-[clamp(24px,4vw,38px)] leading-[1.143] font-normal tracking-[-1.2px] text-balance">
              {t.titleA} {t.titleB}
            </SplitReveal>
          </div>
          <SplitReveal
            as="p"
            delay={0.1}
            className="text-[16px] leading-[24px] text-texte2 text-pretty md:w-[480px] md:justify-self-end md:pb-2 md:text-right"
          >
            {t.intro}
          </SplitReveal>
        </div>

        <Reveal as="div" stagger={0.1} className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {t.items.map((item, index) => {
            const Icon = ICONS[index % ICONS.length];
            const decor = DECOR[index];

            return (
              <article
                key={item.name}
                className={`relative flex flex-col justify-center gap-9 overflow-hidden rounded-[20px] border border-ligne bg-surface px-10 pt-10 pb-11 dark:border-transparent dark:bg-[linear-gradient(180deg,#01202e_0%,#011a26_100%)] dark:shadow-[inset_0_0_0_1px_#0a2a3a] ${SPAN[index]}`}
              >
                {/* Halo vert d'ambiance en haut-droite (design). */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute top-[-160px] right-[-140px] h-[420px] w-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(48,217,140,0.1),rgba(48,217,140,0)_72%)]"
                />

                {decor ? (
                  // `loading="lazy"` : sans lui, React 19 émet un <link rel=preload>
                  // pour chaque <img> rendue côté serveur — décor sous la ligne de
                  // flottaison, inutile à précharger (avertissement console).
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={decor}
                    alt=""
                    aria-hidden
                    loading="lazy"
                    decoding="async"
                    className={`pointer-events-none absolute w-[56%] max-w-[360px] opacity-20 select-none ${
                      index === 3
                        ? "top-1/2 right-[-10%] -translate-y-1/2" // enveloppe : centrée verticalement, poussée à droite
                        : "-top-6 right-[-6%]" // sphère : haut-droite
                    }`}
                  />
                ) : null}

                <div className="relative flex items-center gap-3">
                  <Icon
                    size={22}
                    strokeWidth={1.7}
                    aria-hidden
                    className="shrink-0 text-emeraude dark:text-accent-strong"
                  />
                  <h3 className="text-[20px] leading-[1.25] font-normal text-encre">{item.name}</h3>
                </div>
                <p className="relative max-w-[44ch] text-[14px] leading-[24px] font-light text-texte2 text-pretty">
                  {item.note}
                </p>
              </article>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
