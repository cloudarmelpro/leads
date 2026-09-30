"use client";

import { useEffect, useState } from "react";

type Entry = { id: string; n: string; h: string };
type Props = { label: string; entries: Entry[] };

// Un article devient courant quand son haut passe sous 35 % de la hauteur de l'écran.
const READ_LINE = 0.35;
// Sous l'en-tête fixe (80px) : cible de défilement des liens du sommaire.
const SCROLL_OFFSET = 96;

/**
 * Sommaire de la politique (maquette du 2026-09-30) : intitulé et compteur « 03 / 10 »,
 * barre de progression de lecture, puis les liens numérotés ; l'article courant est sur
 * fond plein, son numéro en vert. Sans JavaScript, simple liste de liens ancrés.
 */
export function PrivacyToc({ label, entries }: Props) {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const targets = entries.map((entry) => document.getElementById(entry.id)).filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;
    let raf = 0;
    const spy = () => {
      raf = 0;
      const line = window.innerHeight * READ_LINE;
      let current = 0;
      targets.forEach((el, i) => {
        if (el.getBoundingClientRect().top < line) current = i;
      });
      const y = window.scrollY;
      const first = (targets[0]?.getBoundingClientRect().top ?? 0) + y;
      const end = (targets[targets.length - 1]?.getBoundingClientRect().bottom ?? 0) + y - window.innerHeight;
      const p = Math.max(0, Math.min(1, (y - first + line) / Math.max(1, end - first + line)));
      setActive(current);
      setProgress(p);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(spy);
    };
    spy();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [entries]);

  const go = (id: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById(id);
    if (!el) return;
    event.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <>
      <div className="flex items-center justify-between gap-[12px]">
        <span className="text-[15px] leading-[20px] font-semibold text-encre">{label}</span>
        <span className="text-[13px] leading-[18px] font-medium text-texte-note tabular-nums">
          {String(active + 1).padStart(2, "0")} / {entries.length}
        </span>
      </div>
      <span aria-hidden className="relative block h-[2px] rounded-[2px] bg-mot-accueil">
        <span className="absolute inset-y-[0px] left-[0px] rounded-[2px] bg-vert transition-[width] duration-200 ease-[cubic-bezier(0.2,0.7,0.2,1)]" style={{ width: `${Math.round(progress * 100)}%` }} />
      </span>
      <nav aria-label={label} className="flex flex-col gap-[2px]">
        {entries.map((entry, i) => {
          const on = i === active;
          return (
            <a
              key={entry.id}
              href={`#${entry.id}`}
              aria-current={on ? "location" : undefined}
              onClick={go(entry.id)}
              className={`-mx-[10px] grid grid-cols-[26px_minmax(0,1fr)] items-baseline gap-[8px] rounded-[10px] px-[10px] py-[8px] text-[14px] leading-[20px] font-medium no-underline transition-colors duration-200 hover:text-encre ${
                on ? "bg-surface-2 text-encre dark:bg-surface" : "text-texte2"
              }`}
            >
              <span className={`text-[12px] leading-[20px] font-semibold tabular-nums ${on ? "text-vert" : "text-texte-note"}`}>{entry.n}</span>
              <span className="text-pretty">{entry.h}</span>
            </a>
          );
        })}
      </nav>
    </>
  );
}
