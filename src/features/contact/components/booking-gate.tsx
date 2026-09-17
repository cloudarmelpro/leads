"use client";

import { Calendar } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import { BookingModal } from "@/features/contact/components/booking-modal";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { dict: { contactPage: Pick<Dictionary["contactPage"], "booking"> }; calLink: string | null };

const GRID_MASK = "radial-gradient(70% 70% at 50% 50%, #000 0%, transparent 85%)";

/**
 * Carte de droite de la section Rendez-vous : avis Cal.com (Loi 25) et bouton
 * « Afficher le calendrier », qui ouvre la modale. La carte reste affichée après le
 * clic ; le focus revient sur le bouton à la fermeture.
 */
export function BookingGate({ dict, calLink }: Props) {
  const t = dict.contactPage.booking;
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    trigger.current?.focus();
  }, []);

  return (
    <>
      <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-[24px] bg-surface p-[28px] ring-1 ring-ligne ring-inset dark:ring-0">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-[0px] hidden bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] dark:block"
          style={{ maskImage: GRID_MASK, WebkitMaskImage: GRID_MASK }}
        />
        <div className="relative flex max-w-[360px] flex-col items-start gap-[14px]">
          <span className="flex h-[44px] w-[44px] items-center justify-center rounded-[14px] bg-surface-2 text-vert">
            <Calendar size={21} strokeWidth={1.8} aria-hidden />
          </span>
          <span className="text-[17px] leading-[24px] font-medium text-encre">{t.loadTitle}</span>
          <p className="m-[0px] text-[14px] leading-[23px] font-normal text-texte2 text-pretty">{t.loadBody}</p>
          <button
            ref={trigger}
            type="button"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={open}
            className="mt-[4px] flex min-h-[40px] cursor-pointer items-center rounded-[8px] bg-vert px-[20px] text-[14px] leading-[20px] font-medium text-sur-vert transition-colors duration-200 ease-[cubic-bezier(0.2,0.7,0.2,1)] hover:bg-vert-clair"
          >
            {t.loadCta}
          </button>
        </div>
      </div>

      {open && <BookingModal dict={dict} calLink={calLink} onClose={close} />}
    </>
  );
}
