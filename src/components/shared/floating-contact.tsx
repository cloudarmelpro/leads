"use client";

import { Calendar, ChevronRight, MessageCircle, Phone, X } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { ActionLink } from "@/components/shared/action-link";
import { calcomHref, site, telHref, whatsappHref } from "@/config/site";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { dict: Dictionary };

/**
 * Bulle de contact flottante — direction « tiroir sobre » (Claude Design 3a) :
 * matière blanche, aucune bordure, la hiérarchie vient du texte. Les actions
 * secondaires (WhatsApp, rendez-vous) sont des lignes fantômes ; seule l'action
 * d'appel porte le vert plein. Les coordonnées absentes atténuent leur ligne
 * (via `disabled:` — ActionLink rend alors un <button disabled>).
 */
export function FloatingContact({ dict }: Props) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const reduce = useReducedMotion();

  const t = dict.floating;
  const phoneLabel = site.phone ?? dict.placeholders.phone;
  const whatsappLabel = site.whatsapp ?? dict.placeholders.whatsapp;

  // Fermeture animée : on joue l'animation de sortie, puis on démonte. Sous
  // reduced-motion, on ferme immédiatement. La durée (260ms) reste alignée sur
  // les keyframes `sheetdown`/`fadeout` (globals.css).
  const handleClose = () => {
    if (reduce) {
      setOpen(false);
      return;
    }
    setClosing(true);
    window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 260);
  };

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Ligne fantôme : pas de cadre, fond au survol, atténuée si indisponible.
  const ghostRow =
    "flex items-center gap-[15px] rounded-[14px] px-3.5 py-3 text-left text-encre no-underline transition-colors duration-200 motion-reduce:transition-none hover:bg-menthe disabled:cursor-not-allowed disabled:opacity-55";

  return (
    <>
      {/* Toujours visible : sert de point d'ancrage ; le tiroir s'ouvre au-dessus.
          z au-dessus du voile pour rester cliquable (bascule ouvrir/fermer). */}
      <button
        type="button"
        onClick={() => (open ? handleClose() : setOpen(true))}
        aria-label={t.aria}
        aria-expanded={open}
        className="group animate-sheetup fixed right-4 bottom-[calc(16px+env(safe-area-inset-bottom))] z-95 inline-flex cursor-pointer items-center gap-2.5 rounded-2xl border-none bg-surface px-4 py-3 font-display text-[15px] text-encre transition-[translate] duration-300 ease-out motion-reduce:transition-none hover:-translate-y-0.5"
      >
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emeraude text-white">
          <Phone
            size={15}
            strokeWidth={2.2}
            aria-hidden
            className="transition-transform duration-300 ease-out group-hover:scale-110 motion-reduce:transition-none"
          />
        </span>
        {t.label}
      </button>

      {open && (
        <>
          {/* Voile discret : clic à l'extérieur pour fermer. */}
          <button
            type="button"
            tabIndex={-1}
            aria-hidden
            onClick={handleClose}
            className={`fixed inset-0 z-90 cursor-default bg-ink/40 ${
              closing ? "animate-fadeout" : "animate-fadein"
            }`}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t.sheetTitle}
            className={`fixed right-4 bottom-[calc(80px+env(safe-area-inset-bottom))] z-95 box-border w-[min(384px,calc(100vw-2rem))] origin-bottom rounded-[20px] bg-surface px-6 pt-[26px] pb-6 shadow-[0_32px_64px_-24px_rgba(15,29,23,.45)] ${
              closing ? "animate-sheetdown" : "animate-sheetup"
            }`}
          >
            {/* En-tête : eyebrow + titre + sous-titre, croix de fermeture. */}
            <div className="flex items-start justify-between gap-3.5">
              <div className="flex flex-col gap-[2px]">
                <span className="text-[10.5px] tracking-[0.12em] text-emeraude dark:text-accent-strong uppercase">
                  {t.eyebrow}
                </span>
                <span className="font-display text-[24px] leading-none text-encre">
                  {t.sheetTitle}
                </span>
                <span className="mt-0.5 text-[13px] leading-snug text-texte2">{t.sheetSub}</span>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label={dict.common.close}
                className="flex h-8 w-8 flex-none cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-texte2 transition-colors duration-200 hover:text-encre motion-reduce:transition-none"
              >
                <X size={14} strokeWidth={2.4} aria-hidden />
              </button>
            </div>

            {/* Actions secondaires — lignes fantômes. */}
            <div className="mt-[22px] mb-5 flex flex-col gap-0.5">
              <ActionLink
                href={whatsappHref(site.whatsapp)}
                unavailableLabel={`WhatsApp — ${whatsappLabel}`}
                className={ghostRow}
              >
                <span className="flex-none text-emeraude dark:text-accent-strong">
                  <MessageCircle size={22} strokeWidth={2.2} aria-hidden />
                </span>
                <span className="flex flex-col gap-px">
                  <span className="text-[14.5px]">WhatsApp</span>
                  <span className="text-[12px] leading-[1.2] text-texte2">{t.rowWaSub}</span>
                </span>
                <ChevronRight size={18} strokeWidth={2.2} aria-hidden className="ml-auto text-texte2" />
              </ActionLink>

              <ActionLink
                href={calcomHref(site.calLink)}
                unavailableLabel={`${t.rowRdv} — ${dict.common.tbd}`}
                newTab
                className={ghostRow}
              >
                <span className="flex-none text-emeraude dark:text-accent-strong">
                  <Calendar size={22} strokeWidth={2.2} aria-hidden />
                </span>
                <span className="flex flex-col gap-px">
                  <span className="text-[14.5px]">{t.rowRdv}</span>
                  <span className="text-[12px] leading-[1.2] text-texte2">{t.rowRdvSub}</span>
                </span>
                <ChevronRight size={18} strokeWidth={2.2} aria-hidden className="ml-auto text-texte2" />
              </ActionLink>
            </div>

            {/* Action principale — le seul bouton plein. */}
            <ActionLink
              href={telHref(site.phone)}
              unavailableLabel={`${t.rowCall} — ${phoneLabel}`}
              className="flex items-center justify-center gap-2.5 rounded-[18px] bg-emeraude p-[13px] text-[14px] font-medium text-white no-underline transition-colors duration-200 hover:bg-[#136843] active:bg-[#0d4a30] motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-55"
            >
              <Phone size={19} strokeWidth={2.2} aria-hidden />
              {t.rowCall}
            </ActionLink>
          </div>
        </>
      )}
    </>
  );
}
