"use client";

import { useEffect, useState } from "react";

type Entry = { id: string; n: string; h: string };
type Props = { label: string; entries: Entry[] };

/**
 * Sommaire ancré de la politique : l'article le plus haut dans la zone de lecture
 * est marqué actif (texte principal, graisse moyenne). Observe les `<article id>`
 * rendus par la page ; sans JavaScript, simple liste de liens.
 */
export function PrivacyToc({ label, entries }: Props) {
  const [active, setActive] = useState(entries[0]?.id ?? "");

  useEffect(() => {
    const targets = entries
      .map((entry) => document.getElementById(entry.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    // Zone de lecture : bande entre 20 % et 45 % de la hauteur du viewport. Parmi
    // les articles qui la croisent, le plus haut gagne — stable au défilement.
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (records) => {
        for (const record of records) {
          if (record.isIntersecting) visible.add(record.target.id);
          else visible.delete(record.target.id);
        }
        const first = entries.find((entry) => visible.has(entry.id));
        if (first) setActive(first.id);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: 0 },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [entries]);

  return (
    <nav aria-label={label}>
      <p className="m-[0px] text-[15px] leading-[26px] font-medium text-encre">{label}</p>
      <ol className="m-[0px] mt-[8px] flex list-none flex-col gap-[4px] p-[0px]">
        {entries.map((entry) => {
          const isActive = entry.id === active;
          return (
            <li key={entry.id} className="flex items-start gap-[10px] text-[15px] leading-[26px]">
              <span className="shrink-0 text-[13px] leading-[26px] text-vert tabular-nums">{entry.n}</span>
              <a
                href={`#${entry.id}`}
                aria-current={isActive ? "location" : undefined}
                onClick={() => setActive(entry.id)}
                className={`no-underline transition-colors duration-200 hover:text-encre ${isActive ? "font-medium text-encre" : "font-normal text-texte2"}`}
              >
                {entry.h}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
