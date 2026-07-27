"use client";

import { Calendar, MessageCircle, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";

import { ActionLink } from "@/components/shared/action-link";
import { calcomHref, site, telHref, whatsappHref } from "@/config/site";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { dict: Dictionary };

export function FloatingContact({ dict }: Props) {
  const [open, setOpen] = useState(false);

  const phoneLabel = site.phone ?? dict.placeholders.phone;
  const whatsappLabel = site.whatsapp ?? dict.placeholders.whatsapp;

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const rowBase =
    "flex items-center gap-3.5 rounded-2xl p-2.5 px-3.5 no-underline";
  const iconBox =
    "inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[11px]";

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={dict.floating.aria}
          className="fixed right-4 bottom-[calc(16px+env(safe-area-inset-bottom))] z-80 inline-flex h-10 items-center gap-2 rounded-xl border-none bg-emeraude px-3.5 text-sm text-white shadow-[0_18px_36px_-14px_rgba(20,64,47,.65)]"
        >
          <Phone size={15} strokeWidth={2.2} aria-hidden />
          <span>{dict.floating.label}</span>
        </button>
      )}

      {open && (
        <>
          <button
            type="button"
            tabIndex={-1}
            aria-hidden
            onClick={() => setOpen(false)}
            className="animate-fadein fixed inset-0 z-90 cursor-default bg-encre/50"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={dict.floating.sheetTitle}
            className="animate-sheetup fixed right-[min(16px,3vw)] left-[max(16px,calc(100vw-452px))] bottom-[calc(12px+env(safe-area-inset-bottom))] z-95 rounded-[22px] bg-white p-[18px] pb-[calc(18px+env(safe-area-inset-bottom))] shadow-[0_32px_64px_-24px_rgba(15,29,23,.5)]"
          >
            <div className="mb-3.5 flex items-center justify-between">
              <span className="font-display text-lg">{dict.floating.sheetTitle}</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={dict.common.close}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border-none bg-fond text-encre"
              >
                <X size={18} aria-hidden />
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              <ActionLink
                href={telHref(site.phone)}
                unavailableLabel={`${dict.floating.rowCall} — ${phoneLabel}`}
                className={`${rowBase} min-h-16 w-full bg-emeraude text-left text-white`}
              >
                <span className={`${iconBox} bg-white/15 text-lueur`}>
                  <Phone size={18} strokeWidth={2.2} aria-hidden />
                </span>
                <span>
                  <span className="block text-base font-bold">{dict.floating.rowCall}</span>
                  <span className="mt-0.5 block font-mono text-xs text-lueur">{phoneLabel}</span>
                </span>
              </ActionLink>

              <ActionLink
                href={whatsappHref(site.whatsapp)}
                unavailableLabel={`WhatsApp — ${whatsappLabel}`}
                className={`${rowBase} min-h-15 w-full border border-ligne text-left text-encre hover:bg-fond`}
              >
                <span className={`${iconBox} bg-menthe text-emeraude`}>
                  <MessageCircle size={18} strokeWidth={2.2} aria-hidden />
                </span>
                <span>
                  <span className="block text-base font-bold">WhatsApp</span>
                  <span className="mt-0.5 block font-mono text-xs text-texte2">
                    {dict.floating.rowWaSub} — {whatsappLabel}
                  </span>
                </span>
              </ActionLink>

              <ActionLink
                href={calcomHref(site.calLink)}
                unavailableLabel={`${dict.floating.rowRdv} — ${dict.common.tbd}`}
                className={`${rowBase} min-h-15 w-full border border-ligne text-left text-encre hover:bg-fond`}
              >
                <span className={`${iconBox} bg-menthe text-emeraude`}>
                  <Calendar size={18} strokeWidth={2.2} aria-hidden />
                </span>
                <span>
                  <span className="block text-base font-bold">{dict.floating.rowRdv}</span>
                  <span className="mt-0.5 block font-mono text-xs text-texte2">
                    {dict.floating.rowRdvSub}
                  </span>
                </span>
              </ActionLink>
            </div>
          </div>
        </>
      )}
    </>
  );
}
