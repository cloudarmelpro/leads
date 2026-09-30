"use client";

import { useId, useState, type ReactNode } from "react";

import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { dict: Pick<Dictionary, "positioning"> };

// Glyphes de la maquette, dans l'ordre de `positioning.orgs` : PME, startup, industrie,
// institution, grande entreprise, OBNL.
const ICONS: ReactNode[] = [
  <g key="pme">
    <path d="M3 21h18" />
    <path d="M5 21V8l7-5 7 5v13" />
    <path d="M9 21v-6h6v6" />
  </g>,
  <g key="startup">
    <path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 0 0-2.9-.1z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.9A12.9 12.9 0 0 1 22 2c0 2.7-.8 7.5-6 11a22.4 22.4 0 0 1-4 2z" />
    <path d="M9 12H4s.6-3 2-4c1.6-1.1 5 0 5 0M12 15v5s3-.6 4-2c1.1-1.6 0-5 0-5" />
  </g>,
  <g key="industrie">
    <path d="M2 20V9l6 4V9l6 4V4h6v16z" />
    <path d="M2 20h20" />
  </g>,
  <g key="institution">
    <path d="M3 21h18M5 21V10M19 21V10M9 21V10M15 21V10" />
    <path d="M2 10 12 3l10 7z" />
  </g>,
  <g key="grande-entreprise">
    <rect x="4" y="2" width="16" height="20" rx="1.5" />
    <path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01" />
  </g>,
  <path key="obnl" d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z" />,
];

/**
 * Positionnement (maquette Accueil, 2026-09-30) : titre centré, deux paragraphes repliés
 * derrière « En savoir plus », puis les six types d'organisation en liens vers la section
 * Organisations.
 */
export function Positioning({ dict }: Props) {
  const t = dict.positioning;
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <section aria-label={t.aria} className="relative z-[1] flex justify-center px-[10px]">
      <div className="flex w-full flex-col items-center gap-[clamp(32px,4vw,56px)] px-[clamp(20px,5vw,72px)] py-[clamp(128px,14vw,230px)]">
        <div className="flex max-w-[720px] flex-col items-center gap-[18px] text-center">
          <h2 className="m-[0px] text-[clamp(22px,2.2vw,30px)] leading-[1.2] font-semibold tracking-[-0.01em] text-encre text-balance">{t.title}</h2>
          {open && (
            <div id={panelId} className="flex flex-col gap-[12px]">
              {t.paragraphs.map((paragraph) => (
                <p key={paragraph} className="m-[0px] text-[15px] leading-[24px] font-normal text-texte2 text-pretty">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={panelId}
            className="tap-44 inline-flex min-h-[32px] cursor-pointer items-center gap-[6px] text-[14px] leading-[20px] font-medium text-vert transition-colors duration-200 ease-[cubic-bezier(0.2,0.7,0.2,1)] hover:text-vert-clair"
          >
            {open ? t.less : t.more}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
              className={`transition-transform duration-200 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${open ? "rotate-180" : ""}`}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-[clamp(24px,3.2vw,56px)] gap-y-[clamp(20px,3vw,48px)]">
          {t.orgs.map((label, index) => (
            <a
              key={label}
              href="#secteurs"
              className="tap-44 inline-flex items-center gap-[10px] text-[clamp(15px,1.25vw,19px)] leading-[24px] font-normal tracking-[0.01em] whitespace-nowrap text-texte-sourd no-underline transition-colors duration-200 ease-[cubic-bezier(0.2,0.7,0.2,1)] hover:text-encre"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="relative top-[-2px] block shrink-0">
                {ICONS[index]}
              </svg>
              {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
