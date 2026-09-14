"use client";

import Image from "next/image";
import { useId, useState } from "react";

import { GOUTTIERE } from "@/components/shared/container";
import { SectionHead } from "@/components/shared/section-head";

type Item = { title: string; body: string };
type Props = {
  id: string;
  kicker: string;
  title: string;
  intro: string;
  introMax: number;
  items: Item[];
  photo: string;
  photoAlt: string;
  /** Photo à gauche dès 620px (Principes) ; sinon cartes à gauche (Notre histoire). */
  photoFirst?: boolean;
};

const PHOTO_SHADE = "linear-gradient(180deg, rgba(1,24,35,0.12) 0%, rgba(1,24,35,0) 50%, rgba(1,24,35,0.45) 100%)";

/**
 * Section « cartes + photo » de la page À propos : en-tête partagé, puis deux colonnes
 * égales (24px d'écart) — trois cartes en accordéon d'un côté, photo couvrante de
 * l'autre. Une seule carte ouverte à la fois, la première par défaut ; la carte entière
 * est cliquable, le titre est un bouton pour le clavier. Sous 620px : une colonne, la
 * photo passe après les cartes dans les deux sens.
 */
export function AboutSection({ id, kicker, title, intro, introMax, items, photo, photoAlt, photoFirst = false }: Props) {
  const [open, setOpen] = useState(0);
  const baseId = useId();

  return (
    <section className={`relative flex justify-center pb-[clamp(112px,16vw,240px)] ${GOUTTIERE}`}>
      <div className="flex w-full max-w-[1100px] flex-col gap-[48px]">
        <SectionHead id={id} label={kicker} title={title} intro={intro} introMax={introMax} />

        <div className="grid grid-cols-[minmax(0,1fr)] items-stretch gap-[24px] min-[620px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-[12px]">
            {items.map((item, index) => {
              const isOpen = open === index;
              const panelId = `${baseId}-${index}`;
              return (
                <div
                  key={item.title}
                  onClick={() => setOpen(index)}
                  className={`flex cursor-pointer flex-col gap-[10px] rounded-[16px] bg-surface pt-[22px] pr-[24px] pb-[22px] pl-[20px] transition-colors duration-[220ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] ring-1 ring-ligne ring-inset dark:ring-0`}
                >
                  <h3 className="m-[0px]">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpen(index)}
                      className="flex w-full cursor-pointer items-center gap-[12px] text-left"
                    >
                      <span
                        aria-hidden
                        className={`block h-[18px] w-[2px] shrink-0 rounded-[1px] transition-colors duration-[220ms] ${
                          isOpen ? "bg-vert" : "bg-ligne dark:bg-[#012a3c]"
                        }`}
                      />
                      <span className="text-[17px] leading-[24px] font-medium text-encre">{item.title}</span>
                    </button>
                  </h3>
                  {isOpen && (
                    <p id={panelId} className="m-[0px] pl-[14px] text-[15px] leading-[26px] font-normal text-texte2 text-pretty">
                      {item.body}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div
            className={`relative min-h-[320px] overflow-hidden rounded-[24px] bg-surface ${photoFirst ? "order-last min-[620px]:order-first" : ""}`}
          >
            <Image src={photo} alt={photoAlt} fill sizes="(max-width: 620px) 100vw, 540px" className="object-cover" />
            <span aria-hidden className="absolute inset-[0px] block" style={{ background: PHOTO_SHADE }} />
          </div>
        </div>
      </div>
    </section>
  );
}
