"use client";

import { useEffect, useState } from "react";

type Entry = { id: string; n: string; h: string };
type Props = { label: string; entries: Entry[] };

/**
 * Sommaire ancré de la politique : l'article le plus haut dans la zone de lecture
 * est marqué actif (texte principal — blanc en sombre, noir en clair — graisse moyenne).
 * Observe les `<article id>` rendus par la page ; sans JavaScript, simple liste de liens.
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
      <p className="text-body-fluid font-medium text-encre">{label}</p>
      <ol className="mt-3 flex flex-col gap-2">
        {entries.map((entry) => {
          const isActive = entry.id === active;
          return (
            <li key={entry.id} className="flex items-start gap-3 text-[0.875rem] leading-[1.375rem]">
              <span className="shrink-0 font-mono text-emeraude dark:text-accent-strong">{entry.n}</span>
              <a
                href={`#${entry.id}`}
                aria-current={isActive ? "location" : undefined}
                onClick={() => setActive(entry.id)}
                className={`no-underline transition-colors hover:text-encre ${
                  isActive ? "font-medium text-encre" : "font-light text-texte2"
                }`}
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
