"use client";

import { useLayoutEffect, useRef } from "react";

import { attachCtaGlobe } from "@/features/home/components/cta-globe";
import { site, telHref } from "@/config/site";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { dict: Pick<Dictionary, "final" | "placeholders"> };

const BUTTON =
  "inline-flex items-center gap-[10px] rounded-[6px] bg-[#2fd286] px-[17px] py-[11px] text-[14.5px] leading-[1.2] font-medium whitespace-nowrap text-[#052a1b] no-underline transition-[transform,box-shadow,filter] duration-200 ease-out hover:-translate-y-[1px] hover:brightness-[1.07] hover:shadow-[0_10px_28px_-10px_rgba(47,210,134,0.7)] active:translate-y-[0px] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#f3f7f9] [&>svg]:transition-transform [&>svg]:duration-200 hover:[&>svg]:translate-x-[2px]";

/**
 * Appel final (maquette Accueil, 2026-09-30) : panneau sombre à dégradé fixe (identique
 * dans les deux thèmes), globe animé en fond (`cta-globe.ts`), point vert au-dessus du
 * titre, texte, bouton d'appel et mention de délai révélés en cascade. Sans numéro
 * confirmé, le bouton est inerte et le libellé montre l'espace réservé.
 */
export function Cta({ dict }: Props) {
  const t = dict.final;
  const phone = site.phone ?? dict.placeholders.phone;
  const tel = telHref(site.phone);
  const card = useRef<HTMLDivElement>(null);

  // Avant peinture : le texte hors écran doit être caché dès la première image.
  useLayoutEffect(() => {
    const el = card.current;
    if (!el) return;
    return attachCtaGlobe(el, "south");
  }, []);

  return (
    <section id="contact" className="relative flex justify-center px-[clamp(12px,1.6vw,24px)]">
      <div
        ref={card}
        className="relative isolate box-border flex min-h-[clamp(520px,80vh,640px)] w-full items-center justify-center overflow-hidden rounded-[20px] bg-[radial-gradient(120%_95%_at_50%_0%,#12293a_0%,#0d2130_55%,#091924_100%)] px-[24px] py-[clamp(88px,14vh,150px)]"
      >
        <div data-cg-content className="relative z-[1] flex w-full max-w-[680px] flex-col items-center text-center">
          <div data-cg-title className="relative text-[clamp(1.85rem,1.15rem+1.9vw,2.6rem)]">
            <span data-cg-anchor aria-hidden className="absolute top-[-0.82em] left-1/2 h-[0px] w-[0px]" />
            <h2 data-cg-reveal="0" className="m-[0px] text-[1em] leading-[1.12] font-semibold tracking-[-0.01em] text-[#f3f7f9]">
              {t.titleA}
              <br />
              {t.titleB}
            </h2>
          </div>
          <p data-cg-reveal="1" className="m-[0px] mt-[26px] max-w-[440px] text-[15px] leading-[1.6] font-normal text-[#b4c2ca]">
            {t.bodyA}
            <br />
            {t.bodyB}
          </p>
          <div data-cg-reveal="2" className="mt-[22px]">
            {tel ? (
              <a data-cg-btn href={tel} className={BUTTON}>
                {t.callLabel} · {phone}
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M3 8h9.5M8.5 3.5 13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            ) : (
              <button type="button" disabled aria-label={`${t.callLabel} — ${phone}`} className={`${BUTTON} cursor-not-allowed opacity-55`}>
                {t.callLabel} · {phone}
              </button>
            )}
          </div>
          <p data-cg-reveal="3" className="m-[0px] mt-[24px] text-[12.5px] leading-[1.5] font-normal text-[#7e919d]">
            {t.note}
          </p>
        </div>
      </div>
    </section>
  );
}
