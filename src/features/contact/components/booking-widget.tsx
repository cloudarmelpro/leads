import { Clock, Globe, Video } from "lucide-react";

import { localeHtmlLang, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale; dict: Dictionary };

const SLOTS = ["09:00", "09:30", "10:00", "10:30", "11:00", "13:30", "14:00", "14:30", "15:00"];

/**
 * ⚠️ MAQUETTE VISUELLE (façon Cal.com) — non fonctionnelle. Le calendrier montre
 * le mois courant en lecture seule. À remplacer par l'embed réel (Cal.com / Calendly)
 * qui apporte les vraies disponibilités et la réservation.
 */
export function BookingWidget({ lang, dict }: Props) {
  const t = dict.contactPage.booking;
  const loc = localeHtmlLang[lang];

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();
  const monthLabel = new Intl.DateTimeFormat(loc, { month: "long", year: "numeric" }).format(now);
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const weekdayFmt = new Intl.DateTimeFormat(loc, { weekday: "short" });
  // 1er janvier 2023 = dimanche → en-têtes Dim..Sam.
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    weekdayFmt.format(new Date(2023, 0, 1 + i)),
  );
  const selectedLabel = new Intl.DateTimeFormat(loc, {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(now);

  return (
    <div className="overflow-hidden rounded-3xl border border-ligne bg-white">
      <div className="grid gap-px bg-ligne md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,0.85fr)]">
        {/* Colonne 1 — informations du rendez-vous. */}
        <div className="bg-white p-6">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-encre font-display text-[15px] text-white">
            L
          </span>
          <h3 className="mt-4 font-display text-lg">{t.service}</h3>

          <ul className="mt-4 flex flex-col gap-2.5 text-sm text-texte2">
            <li className="flex items-center gap-2.5">
              <Clock size={16} className="text-sapin" aria-hidden /> {t.duration}
            </li>
            <li className="flex items-center gap-2.5">
              <Video size={16} className="text-sapin" aria-hidden /> {t.channel}
            </li>
            <li className="flex items-center gap-2.5">
              <Globe size={16} className="text-sapin" aria-hidden /> {t.timezone}
            </li>
          </ul>

          <p className="mt-6 mb-2 text-xs font-bold tracking-[0.06em] text-texte2 uppercase">
            {t.expectTitle}
          </p>
          <ul className="flex flex-col gap-1.5 text-sm text-texte2">
            {t.expect.map((line) => (
              <li key={line} className="flex gap-2">
                <span aria-hidden className="text-sapin">
                  —
                </span>
                {line}
              </li>
            ))}
          </ul>
        </div>

        {/* Colonne 2 — calendrier (mois courant, lecture seule). */}
        <div className="bg-white p-6">
          <p className="mb-4 font-display text-base capitalize">{monthLabel}</p>
          <div className="grid grid-cols-7 gap-1 text-center">
            {weekdays.map((d) => (
              <span
                key={d}
                className="py-1 text-[11px] font-semibold tracking-wide text-texte2 uppercase"
              >
                {d}
              </span>
            ))}
            {Array.from({ length: firstWeekday }).map((_, i) => (
              <span key={`blank-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const isToday = day === today;
              const isPast = day < today;
              return (
                <span
                  key={day}
                  aria-current={isToday ? "date" : undefined}
                  className={`flex aspect-square items-center justify-center rounded-lg text-sm ${
                    isToday
                      ? "bg-encre font-bold text-white"
                      : isPast
                        ? "text-texte2/40"
                        : "text-encre hover:bg-menthe"
                  }`}
                >
                  {day}
                </span>
              );
            })}
          </div>
        </div>

        {/* Colonne 3 — créneaux (statiques). */}
        <div className="bg-white p-6">
          <p className="mb-1 font-display text-base capitalize">{selectedLabel}</p>
          <p className="mb-4 text-[13px] text-texte2">{t.pickSlot}</p>
          <div className="flex max-h-[300px] flex-col gap-2 overflow-y-auto pr-1">
            {SLOTS.map((slot) => (
              <span
                key={slot}
                className="rounded-xl border border-ligne py-2.5 text-center text-sm font-medium text-encre"
              >
                {slot}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Rappel : maquette à remplacer par l'embed réel. */}
      <p className="border-t border-ligne bg-fond px-6 py-3 font-mono text-[12px] text-texte2">
        {t.embedNote}
      </p>
    </div>
  );
}
