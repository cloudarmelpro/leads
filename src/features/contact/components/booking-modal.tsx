"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { CalcomEmbed } from "@/features/contact/components/calcom-embed";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = {
  dict: Dictionary;
  calLink: string | null;
  onClose: () => void;
};

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, iframe, [tabindex]:not([tabindex="-1"])';

/**
 * Modale du calendrier (maquette Contact) : voile légèrement assombri (40 %), sans flou, panneau qui remonte en 300ms
 * (720px avec la grille factice, 1100px avec Cal.com pour une disposition horizontale)
 * Contenu : l'embed Cal.com quand `calLink` existe ; sinon la grille de
 * créneaux de la maquette, purement visuelle. Fermeture par le voile, la croix ou Échap ;
 * défilement du corps verrouillé, focus piégé dans le panneau, rendu au déclencheur par
 * l'appelant au démontage.
 */
export function BookingModal({ dict, calLink, onClose }: Props) {
  const t = dict.contactPage.booking;
  const panel = useRef<HTMLDivElement>(null);
  const [pick, setPick] = useState(-1);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = panel.current?.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panel.current) return;
      const nodes = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (nodes.length === 0) return;
      const [head, tail] = [nodes[0], nodes[nodes.length - 1]];
      if (event.shiftKey && document.activeElement === head) {
        event.preventDefault();
        tail.focus();
      } else if (!event.shiftKey && document.activeElement === tail) {
        event.preventDefault();
        head.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const picked = pick >= 0 ? t.slots[pick] : null;
  const confirmLabel = picked ? t.confirm.replace("{day}", picked.day.toLowerCase()).replace("{time}", picked.time) : t.pickPrompt;

  return (
    <div
      onClick={onClose}
      className="fixed inset-[0px] z-[92] flex items-center justify-center bg-fond/40 p-[clamp(16px,4vw,40px)] motion-safe:[animation:tw-veil-in_220ms_cubic-bezier(0.2,0.7,0.2,1)_both]"
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
        onClick={(event) => event.stopPropagation()}
        className={`relative flex max-h-[86vh] w-full flex-col gap-[20px] overflow-y-auto rounded-[24px] ${calLink ? "max-w-[1100px]" : "max-w-[720px]"} border border-ligne bg-surface p-[clamp(22px,3vw,32px)] shadow-[0_30px_80px_rgba(1,10,16,0.55)] motion-safe:[animation:tw-dialog-in_300ms_cubic-bezier(0.22,1,0.36,1)_both]`}
      >
        <div className="flex items-start justify-between gap-[16px]">
          <div className="flex min-w-[0px] flex-col gap-[4px]">
            <span id="booking-modal-title" className="text-[20px] leading-[28px] font-medium tracking-[-0.3px] text-encre">
              {t.modalTitle}
            </span>
            <span className="text-[14px] leading-[22px] font-normal text-texte2">{t.modalMeta}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="flex h-[40px] w-[40px] shrink-0 cursor-pointer items-center justify-center rounded-[12px] bg-surface-2 text-encre transition-colors duration-200 hover:bg-surface-3"
          >
            <X size={15} strokeWidth={2.4} aria-hidden />
          </button>
        </div>
        <div className="h-px bg-ligne" />

        {calLink ? (
          // Le visiteur vient de lire l'avis et de cliquer : l'embed se charge d'emblée.
          // Panneau élargi à 1100px : Cal.com se déploie à l'horizontale (mois à gauche,
          // créneaux à droite). L'iframe prend la hauteur de son contenu, le conteneur ne
          // défile jamais : aucune barre interne, le panneau seul défile si l'écran est bas.
          <div className="overflow-hidden">
            <CalcomEmbed calLink={calLink} dict={dict} initiallyLoaded />
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-[14px]">
              <span className="text-[15px] leading-[22px] font-medium text-encre">{t.pickSlot}</span>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(112px,1fr))] gap-[10px]">
                {t.slots.map((slot, i) => {
                  const active = i === pick;
                  return (
                    <button
                      key={`${slot.day}-${slot.time}`}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setPick(i)}
                      className={`flex min-h-[64px] cursor-pointer flex-col justify-center gap-[3px] rounded-[12px] border px-[12px] py-[10px] text-left transition-[background-color,border-color] duration-200 ${
                        active ? "border-vert bg-vert" : "border-contour bg-fond"
                      }`}
                    >
                      <span className={`text-[12px] leading-[16px] font-normal tracking-[0.04em] uppercase ${active ? "text-sur-vert/70" : "text-texte2"}`}>
                        {slot.day}
                      </span>
                      <span className={`text-[15px] leading-[20px] font-medium ${active ? "text-sur-vert" : "text-encre"}`}>{slot.time}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <button
              type="button"
              disabled={!picked}
              className={`flex min-h-[48px] items-center justify-center gap-[10px] rounded-[12px] text-[15px] leading-[20px] font-medium transition-colors duration-200 ${
                picked ? "cursor-pointer bg-vert text-sur-vert hover:bg-vert-clair" : "cursor-default bg-surface-2 text-texte2"
              }`}
            >
              {confirmLabel}
            </button>
            <p className="m-[0px] text-[13px] leading-[20px] font-normal text-texte2">{t.embedNote}</p>
          </>
        )}
      </div>
    </div>
  );
}
