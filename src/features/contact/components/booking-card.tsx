"use client";

import { CalcomEmbed } from "@/features/contact/components/calcom-embed";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { dict: { contactPage: Pick<Dictionary["contactPage"], "booking"> }; calLink: string | null };

/**
 * Carte Rendez-vous : le calendrier Cal.com, affiché d'emblée (demandes du client du
 * 2026-09-25 : plus d'avis « Afficher le calendrier », plus de volet de résumé à gauche —
 * le service tiers est donc chargé dès l'arrivée sur la page). Sans lien Cal.com, la
 * note d'aperçu.
 */
export function BookingCard({ dict, calLink }: Props) {
  const t = dict.contactPage.booking;

  return (
    <div className="flex min-h-[468px] min-w-[0px] flex-col justify-center overflow-hidden rounded-[8px] bg-surface p-[clamp(12px,2vw,24px)] dark:bg-fond">
      {calLink ? (
        <CalcomEmbed calLink={calLink} dict={dict} initiallyLoaded />
      ) : (
        <p className="m-[0px] self-center text-[15px] leading-[26px] font-normal text-texte-note">{t.embedNote}</p>
      )}
    </div>
  );
}
