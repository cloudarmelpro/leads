"use client";

import { ChevronDown, CircleCheck, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Rotate } from "@/components/shared/collapse";
import { CONTENEUR } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeader } from "@/components/shared/section-header";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Pricing = Dictionary["pricing"];
type Family = Pricing["families"][number];
type Plan = Family["plans"][number];
type Labels = Pricing["labels"];

// Valeur d'une cellule : "y" = inclus, "-" = non inclus, sinon texte affiché tel quel.
const INCLUDED = "y";
const EXCLUDED = "-";

// Carte de gamme active (design « Pricing v3 ») : halo vert grainé, même vert de
// marque dans les deux thèmes — le texte passe en blanc par-dessus.
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.10 0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E\")";
const GRAIN = `${NOISE}, radial-gradient(130% 125% at 88% 96%, #7fefc0 0%, #30d98c 20%, #0e7a55 46%, #063e33 70%, #02202e 100%)`;

const CARD = "relative flex flex-col overflow-hidden rounded-[20px] border border-ligne bg-surface dark:border-transparent dark:bg-[#011b28]";
const PRIMARY =
  "inline-flex items-center justify-center rounded-[9px] bg-emeraude text-[0.875rem] leading-5 font-medium text-white no-underline transition-colors hover:bg-sapin dark:bg-accent-strong dark:text-fond dark:hover:bg-[#7fefc0]";
const SECONDARY =
  "inline-flex items-center justify-center rounded-[9px] bg-menthe text-[0.875rem] leading-5 font-medium text-encre no-underline transition-colors hover:bg-sapin hover:text-white dark:bg-[#01293c] dark:hover:bg-[#7fefc0] dark:hover:text-fond";
const PRICE_ACCENT = "font-display text-[1.75rem] leading-none font-medium tracking-[-0.02em] tabular-nums text-emeraude dark:text-accent-strong";

/** « 1 999 $ » → « 1 999 » + « $ » ; « 35 $ / mois » → « 35 » + « $ / mois » ; « $499 » reste entier. */
function splitPrice(price: string) {
  const fr = price.indexOf(" $");
  if (fr > 0) return { amount: price.slice(0, fr), suffix: price.slice(fr + 1) };
  const en = price.indexOf(" /");
  if (en > 0) return { amount: price.slice(0, en), suffix: price.slice(en + 1) };
  return { amount: price, suffix: "" };
}

function count(labels: Labels, n: number, one: string, many: string) {
  return n === 1 ? one : many.replace("{n}", String(n));
}

type Props = { lang: Locale; dict: Dictionary };

/**
 * Page Prix (design « Pricing v3 ») : barre collante des familles (Site web, Logo,
 * Hébergement, VPS), gammes ou cartes de forfaits, puis comparaison détaillée avec
 * groupes repliables et filtre « différences seulement ». Dès `lg` : grille une
 * colonne par forfait ; sous `lg` : pastilles + lignes du seul forfait choisi.
 * Les lignes vides pour tous les forfaits affichés sont masquées.
 */
export function PricingExplorer({ lang, dict }: Props) {
  const t = dict.pricing;
  const labels = t.labels;
  const href = `/${lang}/contact`;

  const [famKey, setFamKey] = useState(t.families[0].key);
  const [range, setRange] = useState(0);
  const [diff, setDiff] = useState(false);
  const [pick, setPick] = useState(0);
  const [closed, setClosed] = useState<Record<string, boolean>>({});

  const family = t.families.find((f) => f.key === famKey) ?? t.families[0];
  const hasRanges = family.ranges.length > 0;
  const idx: number[] = hasRanges ? family.ranges[range].plans : family.plans.map((_, i) => i);
  const columns = idx.map((i) => family.plans[i]);

  const groups = family.groups
    .map((group) => ({
      title: group.title,
      rows: group.rows.filter((row) => {
        const shown = idx.map((i) => row.cells[i] ?? EXCLUDED);
        if (shown.every((v) => v === EXCLUDED)) return false;
        if (diff && idx.length > 1 && new Set(shown).size === 1) return false;
        return true;
      }),
    }))
    .filter((group) => group.rows.length > 0);

  const picked = Math.min(pick, idx.length - 1);
  const pickedPlan = family.plans[idx[picked]];
  const lead = hasRanges ? family.ranges[range].title : labels.compare;

  const selectFamily = (key: string) => {
    setFamKey(key);
    setPick(0);
  };
  const toggleGroup = (title: string) => setClosed((s) => ({ ...s, [`${family.key}|${title}`]: !s[`${family.key}|${title}`] }));

  return (
    <div className="pb-[clamp(80px,14vw,200px)]">
      {/* Barre des familles : collante sous le haut de page, fond translucide. */}
      <div id="prix" className="sticky top-0 z-30 border-y border-ligne bg-fond/85 backdrop-blur-md">
        <div className={`${CONTENEUR} flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-3`}>
          <div role="tablist" aria-label={labels.families} className="inline-flex flex-wrap gap-1 rounded-[14px] border border-ligne bg-surface p-1 dark:border-transparent dark:bg-[#011b28]">
            {t.families.map((f) => {
              const active = f.key === family.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => selectFamily(f.key)}
                  className={`min-h-10 cursor-pointer rounded-[10px] px-4 text-[0.9375rem] leading-5 font-medium transition-colors ${
                    active ? "bg-emeraude text-white dark:bg-accent-strong dark:text-fond" : "text-texte2 hover:text-encre"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
          <span className="text-small-fluid text-texte2">{count(labels, family.plans.length, labels.plansCountOne, labels.plansCount)}</span>
        </div>
      </div>

      <section className={`${CONTENEUR} pt-[clamp(48px,7vw,80px)]`}>
        {/* `key` : le titre change avec la famille → on remonte l'en-tête (SplitText). */}
        <SectionHeader key={family.key} kicker={t.kicker} title={family.title} intro={family.desc} />

        {/* Gammes (site web) ou cartes de forfaits (autres familles). */}
        <Reveal key={`${family.key}-cards`} as="div" className={`mt-12 grid gap-4 ${hasRanges ? "md:grid-cols-3" : cardColumns(family.plans.length)}`}>
          {hasRanges
            ? family.ranges.map((r, i) => {
                const active = i === range;
                return (
                  <div key={r.title} className="flex flex-col gap-2.5">
                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={() => {
                        setRange(i);
                        setPick(0);
                      }}
                      className={`${CARD} group min-h-[210px] cursor-pointer p-6 text-left transition-colors hover:border-emeraude/40 dark:hover:border-transparent`}
                      style={active ? { backgroundImage: GRAIN, borderColor: "transparent" } : undefined}
                    >
                      <span className={`font-display text-[1.5rem] leading-[1.15] ${active ? "text-white" : "text-encre"}`}>{r.title}</span>
                      <span className={`mt-2 text-small-fluid ${active ? "text-white/80" : "text-texte2"}`}>{r.line}</span>
                      <span className={`mt-auto pt-8 text-[0.8125rem] leading-5 ${active ? "text-white/80" : "text-texte2"}`}>
                        {count(labels, r.plans.length, labels.plansCountOne, labels.plansCount)}
                      </span>
                      <span className={`font-display text-[1.375rem] leading-tight font-medium tabular-nums ${active ? "text-white" : "text-encre"}`}>{r.range}</span>
                    </button>
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-hidden
                      onClick={() => {
                        setRange(i);
                        setPick(0);
                      }}
                      className={`h-11 w-full cursor-pointer ${active ? PRIMARY : SECONDARY}`}
                    >
                      {active ? labels.shownInTable : labels.compareRange}
                    </button>
                  </div>
                );
              })
            : family.plans.map((plan) => {
                const { amount, suffix } = splitPrice(plan.price);
                return (
                  <div key={plan.name} className="flex flex-col gap-2.5">
                    <div className={`${CARD} min-h-[210px] p-6`}>
                      <span className="font-display text-[1.5rem] leading-[1.15] text-encre text-balance">{plan.name}</span>
                      <span className="mt-2 text-small-fluid text-texte2">{plan.meta}</span>
                      <span className="mt-auto flex items-baseline gap-1.5 pt-8">
                        <span className="font-display text-[1.75rem] leading-none font-medium tabular-nums text-encre">{amount}</span>
                        {suffix && <span className="text-[0.875rem] leading-5 text-texte2">{suffix}</span>}
                      </span>
                    </div>
                    <Link href={href} className={`h-11 w-full ${SECONDARY}`}>
                      {labels.book}
                    </Link>
                  </div>
                );
              })}
        </Reveal>

        {/* Comparaison détaillée : titre + interrupteur « différences seulement ». */}
        <div className="mt-[clamp(48px,6vw,72px)] flex flex-wrap items-center justify-between gap-4">
          <h3 className="m-0 font-display text-[1.375rem] leading-tight font-normal text-encre">{labels.detailed}</h3>
          <button
            type="button"
            role="switch"
            aria-checked={diff}
            onClick={() => setDiff((d) => !d)}
            className="group inline-flex min-h-11 cursor-pointer items-center gap-3 text-[0.875rem] leading-5 text-encre"
          >
            <span
              aria-hidden
              className={`relative inline-block h-5 w-9 rounded-full transition-colors ${diff ? "bg-emeraude dark:bg-accent-strong" : "bg-texte2/40"}`}
            >
              <span
                className={`absolute top-[3px] left-[3px] block h-3.5 w-3.5 rounded-full bg-white transition-transform dark:bg-fond ${diff ? "translate-x-4" : ""}`}
              />
            </span>
            {labels.diffOnly}
          </button>
        </div>

        {/* Large : une colonne par forfait. */}
        <div
          className="mt-6 hidden rounded-[24px] border border-ligne bg-surface p-6 lg:grid dark:border-transparent dark:bg-[#011b28]"
          style={{ gridTemplateColumns: `minmax(230px,1.5fr) repeat(${columns.length}, minmax(0,1fr))` }}
        >
          <div className="flex flex-col justify-end gap-1 px-4 pb-6">
            <span className="text-[0.9375rem] leading-[1.375rem] font-medium text-encre">{lead}</span>
            <span className="text-[0.8125rem] leading-5 text-texte2 text-pretty">{diff ? labels.diffRows : labels.allRows}</span>
          </div>
          {columns.map((plan) => (
            <PlanHead key={plan.name} plan={plan} labels={labels} href={href} />
          ))}

          {groups.map((group) => {
            const open = !closed[`${family.key}|${group.title}`];
            return [
              <button
                key={`${group.title}-bar`}
                type="button"
                aria-expanded={open}
                onClick={() => toggleGroup(group.title)}
                style={{ gridColumn: "1 / -1" }}
                className="mt-3 flex min-h-12 cursor-pointer items-center gap-3 rounded-[12px] bg-menthe/70 px-4 text-left dark:bg-[#01293c]"
              >
                <Rotate deg={open ? 0 : -90} className="text-emeraude dark:text-accent-strong">
                  <ChevronDown size={16} strokeWidth={2.2} aria-hidden />
                </Rotate>
                <span className="flex-1 text-[0.9375rem] leading-5 font-medium text-encre">{group.title}</span>
                <span className="text-[0.75rem] leading-4 text-texte2">{count(labels, group.rows.length, labels.lineOne, labels.lines)}</span>
              </button>,
              ...(open
                ? group.rows.flatMap((row, rowIndex) => {
                    const border = rowIndex === group.rows.length - 1 ? "" : "border-b border-ligne";
                    return [
                      <div key={`${group.title}-${row.label}-l`} className={`flex min-h-12 items-center py-3 pr-4 ${row.sub ? "pl-10" : "pl-4"} ${border}`}>
                        <span className={`text-[0.875rem] leading-[1.375rem] text-pretty ${row.sub ? "font-light text-texte2" : "font-light text-encre"}`}>{row.label}</span>
                      </div>,
                      ...idx.map((i) => (
                        <div key={`${group.title}-${row.label}-${i}`} className={`flex min-h-12 items-center justify-center px-3 py-3 text-center ${border}`}>
                          <Cell value={row.cells[i] ?? EXCLUDED} labels={labels} />
                        </div>
                      )),
                    ];
                  })
                : []),
            ];
          })}
        </div>

        {/* Étroit : pastilles + le seul forfait choisi, lignes empilées. */}
        <div className="mt-6 flex flex-col gap-6 rounded-[24px] border border-ligne bg-surface p-[1.125rem] lg:hidden dark:border-transparent dark:bg-[#011b28]">
          <div role="tablist" aria-label={labels.pickPlan} className="flex flex-wrap gap-1.5 rounded-[13px] bg-menthe p-[5px] dark:bg-[#01293c]">
            {columns.map((plan, k) => {
              const active = k === picked;
              return (
                <button
                  key={plan.name}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setPick(k)}
                  className={`min-h-11 flex-1 cursor-pointer rounded-[9px] px-2 py-1.5 text-[0.8125rem] leading-[1.0625rem] font-medium transition-colors ${
                    active ? "bg-emeraude text-white dark:bg-accent-strong dark:text-fond" : "text-texte2 hover:text-encre"
                  }`}
                >
                  {plan.name}
                </button>
              );
            })}
          </div>

          <PlanSummary plan={pickedPlan} labels={labels} href={href} />

          {groups.map((group) => (
            <div key={group.title} className="flex flex-col px-1.5">
              <div className="flex items-center gap-2 pt-2 pb-3">
                <span aria-hidden className="block h-2 w-2 rounded-full bg-emeraude dark:bg-accent-strong" />
                <span className="text-[0.9375rem] leading-[1.375rem] font-medium text-encre">{group.title}</span>
              </div>
              {group.rows.map((row, rowIndex) => {
                const value = row.cells[idx[picked]] ?? EXCLUDED;
                const last = rowIndex === group.rows.length - 1;
                return (
                  <div key={row.label} className={`flex min-h-11 items-center gap-3 py-[0.6875rem] ${row.sub ? "pl-5" : ""} ${last ? "" : "border-b border-ligne"}`}>
                    <Cell value={value} labels={labels} iconOnly />
                    <span className={`flex-1 text-[0.875rem] leading-[1.375rem] font-light text-pretty ${row.sub ? "text-texte2" : "text-encre"}`}>{row.label}</span>
                    {value !== INCLUDED && value !== EXCLUDED && (
                      <span className="max-w-[45%] shrink-0 text-right text-[0.875rem] leading-5 text-encre">{value}</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function cardColumns(n: number) {
  if (n <= 2) return "md:grid-cols-2";
  if (n === 3) return "md:grid-cols-3";
  return "sm:grid-cols-2 lg:grid-cols-4";
}

/** En-tête de colonne (grille large) : nom, prix vert, précision, bouton. */
function PlanHead({ plan, labels, href }: { plan: Plan; labels: Labels; href: string }) {
  const { amount, suffix } = splitPrice(plan.price);
  return (
    <div className="flex flex-col items-center justify-end gap-2 px-3 pb-6 text-center">
      <span className="font-display text-[1.25rem] leading-tight text-encre text-balance">{plan.name}</span>
      <span className="flex items-baseline gap-1">
        <span className={PRICE_ACCENT}>{amount}</span>
        {suffix && <span className="text-[0.8125rem] leading-4 font-medium text-emeraude dark:text-accent-strong">{suffix}</span>}
      </span>
      <span className="text-[0.75rem] leading-4 text-texte2">{plan.meta}</span>
      <Link href={href} className={`mt-2 h-10 w-full ${PRIMARY}`}>
        {labels.bookShort}
      </Link>
    </div>
  );
}

/** Forfait choisi (mobile) : nom, prix, précision, bouton. */
function PlanSummary({ plan, labels, href }: { plan: Plan; labels: Labels; href: string }) {
  const { amount, suffix } = splitPrice(plan.price);
  return (
    <div className="flex flex-col items-start gap-2 px-1.5">
      <span className="font-display text-[1.5rem] leading-[1.875rem] text-encre">{plan.name}</span>
      <span className="flex items-baseline gap-1.5">
        <span className={PRICE_ACCENT}>{amount}</span>
        {suffix && <span className="text-[0.875rem] leading-5 font-medium text-emeraude dark:text-accent-strong">{suffix}</span>}
      </span>
      <span className="text-[0.875rem] leading-[1.375rem] font-light text-texte2">{plan.meta}</span>
      <Link href={href} className={`mt-2 h-[46px] w-full text-[0.9375rem] ${PRIMARY}`}>
        {labels.book}
      </Link>
    </div>
  );
}

/** Cellule : coche verte, croix discrète ou texte. `iconOnly` : le texte est rendu par l'appelant. */
function Cell({ value, labels, iconOnly = false }: { value: string; labels: Labels; iconOnly?: boolean }) {
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
    return <X size={14} strokeWidth={2.4} role="img" aria-label={labels.notIncluded} className="shrink-0 text-texte2/60" />;
  }
  if (iconOnly) return <span aria-hidden className="block h-1.5 w-1.5 shrink-0 rounded-full bg-emeraude/60 dark:bg-accent-strong/60" />;
  return <span className="text-[0.8125rem] leading-[1.25rem] text-encre text-balance">{value}</span>;
}
