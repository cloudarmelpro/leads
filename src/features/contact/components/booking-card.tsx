"use client";

import { Clock, Globe, Video } from "lucide-react";

import { CalcomEmbed } from "@/features/contact/components/calcom-embed";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { dict: { contactPage: Pick<Dictionary["contactPage"], "booking"> }; brand: string; calLink: string | null };

const LINE = "flex items-center gap-[10px] text-[15px] leading-[26px] font-normal text-texte2";

/**
 * Carte Rendez-vous (maquette Contact) : à gauche le résumé de l'appel (monogramme,
 * durée, canal, fuseau, promesse) ; à droite le calendrier Cal.com, affiché d'emblée
 * (demande du client du 2026-09-25 : plus d'avis « Afficher le calendrier » — le
 * service tiers est donc chargé dès l'arrivée sur la page). Sans lien Cal.com, la
 * carte de droite montre seulement la note d'aperçu.
 */
export function BookingCard({ dict, brand, calLink }: Props) {
  const t = dict.contactPage.booking;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-[1px] overflow-hidden rounded-[8px] bg-ligne min-[1000px]:grid-cols-[minmax(220px,0.75fr)_minmax(0,2.55fr)] dark:border dark:border-[#012A3C] dark:bg-[#012A3C]">
      <div className="flex flex-col gap-[18px] bg-surface-2 p-[clamp(22px,2.4vw,32px)] dark:bg-[linear-gradient(160deg,#011E2B_0%,#011823_100%)]">
        <span className="flex size-[44px] items-center justify-center rounded-full bg-fond shadow-[inset_0_0_0_1.5px_var(--color-vert)]">
          <svg width="22" height="22" viewBox="0 0 169 140" fill="none" aria-hidden className="fill-vert">
            <path d="M168.333 45.7126H120.479V63.1308H147.898V121.028H102.853V27.4766H80.4709V140H168.333V45.7126Z" />
            <path d="M55.9557 140H34.6925V17.836H0L0 0L168.333 0V17.836L55.9557 17.836V140Z" />
          </svg>
        </span>
        <div className="flex flex-col gap-[2px]">
          <span className="text-[13px] leading-[20px] font-medium text-texte-note">{brand}</span>
          <span className="text-[15px] leading-[26px] font-semibold text-encre">{t.service}</span>
        </div>
        <div className="flex flex-col gap-[10px]">
          <span className={LINE}>
            <Clock size={18} strokeWidth={2} aria-hidden className="shrink-0 text-vert" />
            {t.duration}
          </span>
          <span className={LINE}>
            <Video size={18} strokeWidth={2} aria-hidden className="shrink-0 text-vert" />
            {t.channel}
          </span>
          <span className={LINE}>
            <Globe size={18} strokeWidth={2} aria-hidden className="shrink-0 text-vert" />
            {t.timezone}
          </span>
        </div>
        <p className="m-[0px] text-[15px] leading-[26px] font-normal text-texte-note text-pretty">{t.pitch}</p>
      </div>

      <div className="flex min-h-[468px] min-w-[0px] flex-col justify-center bg-surface p-[clamp(20px,2.4vw,32px)] dark:bg-fond">
        {calLink ? (
          <div className="overflow-hidden">
            <CalcomEmbed calLink={calLink} dict={dict} initiallyLoaded />
          </div>
        ) : (
          <p className="m-[0px] self-center text-[15px] leading-[26px] font-normal text-texte-note">{t.embedNote}</p>
        )}
      </div>
    </div>
  );
}
