"use client";

import { CircleCheck, Minus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import type { Dictionary } from "@/lib/i18n/dictionaries";

type Plan = Dictionary["pricing"]["site"]["plans"][number];
type Group = Dictionary["pricing"]["site"]["groups"][number];
type Labels = Dictionary["pricing"]["labels"];

type Props = {
  plans: Plan[];
  groups: Group[];
  labels: Labels;
  /** Note sous « Comparer les forfaits » (site web seulement). */
  note?: string;
  href: string;
};

// Valeur d'une cellule : "y" = inclus (coche), "-" = non inclus (tiret), sinon texte.
const INCLUDED = "y";
const EXCLUDED = "-";

const FEATURED_BG = "bg-menthe dark:bg-[#01293c]";
const PRICE =
  "font-mono text-[1.75rem] leading-[2.125rem] font-bold tracking-[-0.02em] tabular-nums whitespace-nowrap text-emeraude dark:text-accent-strong";
const BUTTON =
  "inline-flex w-full items-center justify-center rounded-[9px] bg-emeraude text-[0.875rem] leading-5 font-medium text-white no-underline transition-colors hover:bg-[#7fefc0] hover:text-fond dark:bg-accent-strong dark:text-fond dark:hover:bg-[#7fefc0]";

/**
 * Grille comparative des forfaits (design « Pricing v2 »). Dès `lg` : une colonne
 * de libellés + une colonne par forfait, en-têtes collants, colonne recommandée
 * surlignée, groupes de lignes. Sous `lg` : pastilles pour choisir un forfait et
 * lignes empilées de ce seul forfait.
 */
export function ComparisonTable({ plans, groups, labels, note, href }: Props) {
  const defaultPick = Math.max(0, plans.findIndex((plan) => plan.featured));
  const [pick, setPick] = useState(defaultPick);
  const picked = plans[pick];

  return (
    <>
      {/* Large : grille complète. */}
      <div
        className="hidden rounded-[24px] border border-ligne bg-surface p-8 lg:grid dark:border-transparent"
        style={{ gridTemplateColumns: `minmax(180px,1.2fr) repeat(${plans.length}, minmax(0,1fr))` }}
      >
        <div className="sticky top-0 z-[2] flex flex-col justify-end gap-2 bg-surface px-4 py-6">
          <span className="text-[0.9375rem] leading-[1.375rem] font-medium text-encre">{labels.compare}</span>
          {note && <span className="max-w-[280px] text-[0.8125rem] leading-5 font-light text-texte2 text-pretty">{note}</span>}
        </div>
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`sticky top-0 z-[2] flex flex-col items-center justify-end gap-3.5 rounded-t-2xl px-4 py-6 ${
              plan.featured ? FEATURED_BG : "bg-surface"
            }`}
          >
            {plan.featured && (
              <span className="rounded-full bg-emeraude/15 px-2.5 py-1 text-[0.6875rem] leading-4 font-medium tracking-[0.08em] uppercase text-emeraude dark:bg-accent-strong/15 dark:text-accent-strong">
                {labels.recommended}
              </span>
            )}
            <span className="text-center font-display text-[1.375rem] leading-7 text-encre">{plan.name}</span>
            <span className={PRICE}>{plan.price}</span>
            {plan.blurb && (
              <span className="text-center text-[0.75rem] leading-[1.125rem] font-light text-texte2 text-balance">{plan.blurb}</span>
            )}
            <Link href={href} className={`mt-1.5 h-[42px] ${BUTTON}`}>
              {labels.book}
            </Link>
          </div>
        ))}

        {groups.map((group) => (
          <GroupRows key={group.title} group={group} plans={plans} labels={labels} />
        ))}

        {/* Arrondi bas de la colonne recommandée. */}
        {plans.map((plan) => [
          <div key={`${plan.name}-cap`} className={plan.featured ? `h-7 rounded-b-2xl ${FEATURED_BG}` : ""} />,
        ])}
      </div>

      {/* Étroit : pastilles + lignes empilées du forfait choisi. */}
      <div className="flex flex-col gap-6 rounded-[24px] border border-ligne bg-surface p-[1.125rem] lg:hidden dark:border-transparent">
        <div role="tablist" aria-label={labels.pickPlan} className={`flex gap-1.5 rounded-[13px] p-[5px] ${FEATURED_BG}`}>
          {plans.map((plan, index) => {
            const active = index === pick;
            return (
              <button
                key={plan.name}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setPick(index)}
                className={`min-h-11 flex-1 cursor-pointer rounded-[9px] px-2 py-1.5 text-[0.8125rem] leading-[1.0625rem] font-medium transition-colors ${
                  active ? "bg-emeraude text-white dark:bg-accent-strong dark:text-fond" : "text-texte2 hover:text-encre"
                }`}
              >
                {plan.short}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col items-start gap-2.5 px-1.5">
          <span className="font-display text-[1.5rem] leading-[1.875rem] text-encre">{picked.name}</span>
          <span className={PRICE}>{picked.price}</span>
          {picked.blurb && <span className="text-[0.875rem] leading-[1.375rem] font-light text-texte2 text-pretty">{picked.blurb}</span>}
          <Link href={href} className={`mt-2 h-[46px] text-[0.9375rem] ${BUTTON}`}>
            {labels.book}
          </Link>
        </div>

        {groups.map((group) => (
          <div key={group.title} className="flex flex-col px-1.5">
            <div className="flex items-center gap-2 pt-2 pb-3">
              <span aria-hidden className="block h-2 w-2 rounded-full bg-emeraude dark:bg-accent-strong" />
              <span className="text-[0.9375rem] leading-[1.375rem] font-medium text-encre">{group.title}</span>
            </div>
            {group.rows.map((row, rowIndex) => {
              const value = row.cells[pick] ?? EXCLUDED;
              const last = rowIndex === group.rows.length - 1;
              return (
                <div
                  key={row.label}
                  className={`flex min-h-11 items-center gap-3 py-[0.6875rem] ${last ? "" : "border-b border-ligne"}`}
                >
                  <CellIcon value={value} labels={labels} />
                  <span className="flex-1 text-[0.875rem] leading-[1.375rem] font-light text-encre text-pretty">{row.label}</span>
                  {value !== INCLUDED && value !== EXCLUDED && (
                    <span className="shrink-0 text-right text-[0.875rem] leading-5 text-encre">{value}</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}

/** Lignes d'un groupe dans la grille large : titre du groupe, puis une ligne par critère. */
function GroupRows({ group, plans, labels }: { group: Group; plans: Plan[]; labels: Labels }) {
  return (
    <>
      <div className="flex items-center gap-2 px-4 pt-[2.125rem] pb-3">
        <span aria-hidden className="block h-2 w-2 rounded-full bg-emeraude dark:bg-accent-strong" />
        <span className="text-[0.9375rem] leading-[1.375rem] font-medium text-encre">{group.title}</span>
      </div>
      {plans.map((plan) => (
        <div key={`${group.title}-${plan.name}-head`} className={plan.featured ? FEATURED_BG : ""} />
      ))}

      {group.rows.map((row, rowIndex) => {
        const border = rowIndex === group.rows.length - 1 ? "" : "border-b border-ligne";
        return [
          <div key={`${row.label}-label`} className={`flex min-h-12 items-center px-4 py-[0.8125rem] ${border}`}>
            <span className="text-[0.875rem] leading-[1.375rem] font-light text-encre text-pretty">{row.label}</span>
          </div>,
          ...plans.map((plan, planIndex) => {
            const value = row.cells[planIndex] ?? EXCLUDED;
            return (
              <div
                key={`${row.label}-${plan.name}`}
                className={`flex min-h-12 items-center justify-center px-4 py-[0.8125rem] ${border} ${plan.featured ? FEATURED_BG : ""}`}
              >
                {value === INCLUDED || value === EXCLUDED ? (
                  <CellIcon value={value} labels={labels} />
                ) : (
                  <span className="text-center text-[0.875rem] leading-5 text-encre">{value}</span>
                )}
              </div>
            );
          }),
        ];
      })}
    </>
  );
}

function CellIcon({ value, labels }: { value: string; labels: Labels }) {
  if (value === INCLUDED) {
    return (
      <CircleCheck
        size={16}
        strokeWidth={2.2}
        role="img"
        aria-label={labels.included}
        className="shrink-0 fill-emeraude text-white dark:fill-accent-strong dark:text-fond"
      />
    );
  }
  if (value === EXCLUDED) {
    return <Minus size={16} strokeWidth={2.4} role="img" aria-label={labels.notIncluded} className="shrink-0 text-texte2/70" />;
  }
  return null;
}
