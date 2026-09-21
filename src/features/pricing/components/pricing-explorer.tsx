"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

import { GOUTTIERE } from "@/components/shared/container";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Pricing = Dictionary["pricing"];
type Labels = Pricing["labels"];
// Forme commune aux quatre catégories. Le JSON n'a `who` que sur les forfaits Site web et
// `sub` que sur certaines lignes : typé depuis le JSON, chaque catégorie serait une union
// distincte et ces deux champs deviendraient inaccessibles.
type Plan = { name: string; price: string; meta: string; who?: string };
type Row = { label: string; cells: string[]; sub?: boolean };
type Range = { key: string; title: string; line: string; range: string; plans: number[] };
type Family = { key: string; label: string; title: string; desc: string; plans: Plan[]; ranges: Range[]; groups: { title: string; rows: Row[] }[] };

// Valeur d'une cellule : "y" = inclus, "-" = non inclus, sinon texte affiché tel quel.
const INCLUDED = "y";
const EXCLUDED = "-";

// Paramètres d'URL (identiques FR/EN) : `?categorie=logo&gamme=croissance` ouvre le bon tableau.
const PARAM_FAMILY = "categorie";
const PARAM_RANGE = "gamme";

// Carte de gamme active ou survolée (maquette) : grain + halo vert, même vert dans les
// deux thèmes — le texte passe en blanc par-dessus.
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.34'/%3E%3C/svg%3E\")";
const GRAIN = `${NOISE}, radial-gradient(130% 125% at 88% 96%, #7FEFC0 0%, #30D98C 20%, #0E7A55 46%, #063E33 70%, #02202E 100%)`;

const EASE = "ease-[cubic-bezier(0.2,0.7,0.2,1)]";
const PRICE = "font-bold tracking-[-0.02em] tabular-nums whitespace-nowrap";
const BOOK_FULL = `flex w-full items-center justify-center rounded-[8px] text-[14px] leading-[20px] font-normal no-underline transition-colors duration-[220ms] ${EASE}`;

/**
 * « 1 999 $ » → « 1 999 » + « $ » ; « 35 $ / mois » → « 35 » + « $ / mois » ; « $499 » reste entier,
 * « $35 / month » → « $35 » + « / month ». L'espace qui précède le suffixe (fine insécable en FR)
 * est conservée dans `sep` et rendue telle quelle : « 499$ » collé serait fautif.
 */
function splitPrice(price: string) {
  const fr = /^([\d\s  ]+?)([\s  ]*)([^\d\s  ].*)$/.exec(price);
  if (fr) return { amount: fr[1], sep: fr[2] || " ", suffix: fr[3] };
  const en = price.indexOf(" /");
  if (en > 0) return { amount: price.slice(0, en), sep: " ", suffix: price.slice(en + 1) };
  return { amount: price, sep: "", suffix: "" };
}

function count(n: number, one: string, many: string) {
  return n === 1 ? one : many.replace("{n}", String(n));
}

function CheckIcon({ label }: { label: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" role="img" aria-label={label} className="shrink-0 fill-vert">
      <circle cx="12" cy="12" r="11" />
      <path d="M7.4 12.4l3 3 6-6.4" fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="stroke-sur-vert" />
    </svg>
  );
}
function CrossIcon({ label }: { label: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2.4" strokeLinecap="round" role="img" aria-label={label} className="shrink-0 stroke-croix">
      <path d="M7 7l10 10M17 7L7 17" />
    </svg>
  );
}

type Props = { lang: Locale; dict: Pick<Dictionary, "pricing"> };

const subscribeNothing = () => () => {};
const readSearch = () => window.location.search;

/**
 * Page Prix (maquette « Pricing v3 ») : barre collante des catégories, cartes de gamme
 * (Site web) ou de forfait (Logo, Hébergement, VPS), puis comparaison détaillée en
 * tableau dès 900px et en cartes à onglets en dessous. Un seul état : catégorie, gamme,
 * bascule « différences seulement », forfait choisi (vue étroite), groupes repliés.
 *
 * Rendu côté serveur de TOUTES les catégories et de TOUS les tableaux (les inactifs
 * portent `hidden`) : Google indexe chaque forfait et son prix sans JavaScript. La
 * catégorie et la gamme actives sont lues dans l'URL au montage et y sont réécrites à
 * chaque changement — un lien direct vers un tableau précis est possible.
 */
export function PricingExplorer({ lang, dict }: Props) {
  const t = dict.pricing;
  const labels = t.labels;
  const href = `/${lang}/contact`;
  const families: Family[] = t.families;

  // Sélection lue dans l'URL (pas de `useSearchParams` : il retirerait le composant du
  // HTML statique, ce qui est justement ce qu'on veut éviter). Côté serveur : défaut.
  const search = useSyncExternalStore(subscribeNothing, readSearch, () => "");
  const urlSel = useMemo(() => {
    const params = new URLSearchParams(search);
    const fam = families.find((f) => f.key === params.get(PARAM_FAMILY)) ?? families[0];
    const ri = fam.ranges.findIndex((r) => r.key === params.get(PARAM_RANGE));
    return { famKey: fam.key, range: Math.max(0, ri) };
  }, [search, families]);
  // Choix de l'utilisateur ; tant qu'il n'a rien cliqué, l'URL fait foi.
  const [sel, setSel] = useState<{ famKey: string; range: number } | null>(null);
  const famKey = sel?.famKey ?? urlSel.famKey;
  const range = sel?.range ?? urlSel.range;
  const setFamKey = (key: string) => setSel({ famKey: key, range: 0 });
  const setRange = (i: number) => setSel({ famKey, range: i });

  const [diff, setDiff] = useState(false);
  const [pick, setPick] = useState(0);
  const [hover, setHover] = useState<string | null>(null);
  const [closed, setClosed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!sel) return;
    const fam = families.find((f) => f.key === famKey) ?? families[0];
    const url = new URL(window.location.href);
    if (fam.key === families[0].key && range === 0) {
      url.searchParams.delete(PARAM_FAMILY);
      url.searchParams.delete(PARAM_RANGE);
    } else {
      url.searchParams.set(PARAM_FAMILY, fam.key);
      if (fam.ranges.length > 0) url.searchParams.set(PARAM_RANGE, fam.ranges[range].key);
      else url.searchParams.delete(PARAM_RANGE);
    }
    window.history.replaceState(window.history.state, "", url);
  }, [sel, famKey, range, families]);

  const family = families.find((f) => f.key === famKey) ?? families[0];

  /** Comparaison d'une catégorie pour un jeu de forfaits (une gamme, ou tous les forfaits). */
  const comparison = (fam: Family, idx: number[], lead: string, active: boolean) => {
    const columns = idx.map((i) => fam.plans[i]);
    // Lignes vides pour tous les forfaits affichés masquées ; identiques masquées si bascule active.
    const groups = fam.groups
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
    const groupKey = (title: string) => `${fam.key}|${title}`;

    return (
      <div hidden={!active} className="flex flex-col gap-[48px]">
        {/* Dès 900px : tableau, une colonne par forfait. */}
        <div
          className="hidden items-stretch rounded-[24px] bg-surface p-[28px] ring-1 ring-ligne ring-inset min-[900px]:grid dark:ring-0"
          style={{ gridTemplateColumns: `minmax(230px,1.5fr) repeat(${columns.length}, minmax(0,1fr))` }}
        >
          <div className="flex flex-col justify-end gap-[6px] px-[16px] py-[20px]">
            <span className="text-[15px] leading-[22px] font-normal text-encre">{lead}</span>
            <span className="max-w-[280px] text-[13px] leading-[20px] font-normal text-texte2 text-pretty">{diff ? labels.diffRows : labels.allRows}</span>
          </div>
          {columns.map((plan) => (
            <PlanHead key={plan.name} plan={plan} labels={labels} href={href} />
          ))}

          {groups.map((group) => {
            const open = !closed[groupKey(group.title)];
            return [
              <button
                key={`${group.title}-bar`}
                type="button"
                aria-expanded={open}
                onClick={() => setClosed((s) => ({ ...s, [groupKey(group.title)]: open }))}
                style={{ gridColumn: "1 / -1" }}
                className="mt-[22px] flex cursor-pointer items-center gap-[12px] rounded-[12px] bg-surface-2 px-[16px] py-[14px] text-left"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                  className={`shrink-0 stroke-vert transition-transform duration-200 ${open ? "rotate-0" : "-rotate-90"}`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
                <span className="flex-1 text-[15px] leading-[22px] font-normal text-encre">{group.title}</span>
                <span className="text-[12px] leading-[18px] font-normal text-texte2">{count(group.rows.length, labels.lineOne, labels.lines)}</span>
              </button>,
              ...(open
                ? group.rows.flatMap((row, rowIndex) => {
                    const border = rowIndex === group.rows.length - 1 ? "" : "border-b border-ligne";
                    return [
                      <div key={`${group.title}-${row.label}-l`} className={`flex min-h-[46px] items-center px-[16px] py-[12px] ${border}`}>
                        <span className={`text-[14px] leading-[21px] font-normal text-texte-bascule text-pretty ${row.sub ? "pl-[18px]" : ""}`}>{row.label}</span>
                      </div>,
                      ...idx.map((i) => (
                        <div key={`${group.title}-${row.label}-${i}`} className={`flex min-h-[46px] items-center justify-center px-[14px] py-[12px] ${border}`}>
                          <Cell value={row.cells[i] ?? EXCLUDED} labels={labels} />
                        </div>
                      )),
                    ];
                  })
                : []),
            ];
          })}
        </div>

        {/* Sous 900px : onglets de forfaits à défilement horizontal, puis les lignes du forfait choisi. */}
        <div className="flex flex-col gap-[24px] rounded-[24px] bg-surface p-[18px] ring-1 ring-ligne ring-inset min-[900px]:hidden dark:ring-0">
          <div role="tablist" aria-label={labels.pickPlan} className="flex gap-[6px] overflow-x-auto rounded-[13px] bg-surface-2 p-[5px]">
            {columns.map((plan, k) => {
              const on = k === picked;
              return (
                <button
                  key={plan.name}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setPick(k)}
                  className={`min-h-[44px] min-w-[96px] flex-1 cursor-pointer rounded-[8px] px-[10px] py-[6px] text-[13px] leading-[17px] font-normal whitespace-nowrap transition-colors ${
                    on ? "bg-vert text-sur-vert" : "text-texte2 hover:text-encre"
                  }`}
                >
                  {plan.name}
                </button>
              );
            })}
          </div>

          {/* Vue étroite : seul le forfait choisi est rendu — le tableau ci-dessus (masqué par
              CSS sous 900px) porte déjà tous les forfaits pour l'indexation. */}
          <PlanSummary plan={fam.plans[idx[picked]]} labels={labels} href={href} />
          {groups.map((group) => (
            <div key={group.title} className="flex flex-col px-[6px]">
              <div className="flex items-center gap-[8px] pt-[8px] pb-[12px]">
                <span aria-hidden className="block h-[8px] w-[8px] rounded-full bg-vert" />
                <span className="text-[15px] leading-[22px] font-normal text-encre">{group.title}</span>
              </div>
              {group.rows.map((row, rowIndex) => {
                const value = row.cells[idx[picked]] ?? EXCLUDED;
                const last = rowIndex === group.rows.length - 1;
                return (
                  <div key={row.label} className={`flex min-h-[44px] items-center gap-[12px] py-[11px] ${last ? "" : "border-b border-ligne"}`}>
                    {value === INCLUDED && <CheckIcon label={labels.included} />}
                    {value === EXCLUDED && <CrossIcon label={labels.notIncluded} />}
                    <span className="flex-1 text-[14px] leading-[21px] font-normal text-texte-bascule text-pretty">{row.label}</span>
                    {value !== INCLUDED && value !== EXCLUDED && (
                      <span className="max-w-[45%] shrink-0 text-right text-[13px] leading-[19px] font-normal text-encre">{value}</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Barre des catégories : collante, fond translucide flouté, sans filet. */}
      <div id="prix" className={`sticky top-0 z-30 flex justify-center bg-fond/94 py-[12px] backdrop-blur-[14px] ${GOUTTIERE}`}>
        <div className="flex w-full max-w-[1400px] flex-wrap items-center justify-between gap-[20px]">
          <div role="tablist" aria-label={labels.families} className="flex flex-wrap gap-[4px] rounded-[12px] bg-surface-2 p-[4px]">
            {families.map((f) => {
              const active = f.key === family.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setFamKey(f.key);
                    setPick(0);
                  }}
                  className={`min-h-[40px] cursor-pointer rounded-[8px] px-[16px] py-[8px] text-[14px] leading-[20px] font-normal whitespace-nowrap transition-colors ${
                    active ? "bg-vert text-sur-vert" : "text-texte2 hover:text-encre"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
          <span className="text-[13px] leading-[20px] font-normal whitespace-nowrap text-texte2">
            {count(family.plans.length, labels.plansCountOne, labels.plansCount)}
          </span>
        </div>
      </div>

      <section className={`flex justify-center pt-[64px] pb-[clamp(112px,16vw,240px)] ${GOUTTIERE}`}>
        <div className="w-full max-w-[1400px]">
          {families.map((fam) => {
            const activeFam = fam.key === family.key;
            const hasRanges = fam.ranges.length > 0;
            return (
              <div key={fam.key} hidden={!activeFam} className="flex flex-col gap-[48px]">
                {/* En-tête : label + titre de la catégorie, description alignée à droite. */}
                <div className="flex flex-wrap items-end justify-between gap-[40px]">
                  <div className="flex flex-col gap-[2px]">
                    <span className="text-[13px] leading-[20px] font-normal tracking-[0.08em] text-vert uppercase">{t.kicker}</span>
                    <h2 className="m-[0px] text-[clamp(22px,2.6vw,30px)] leading-[1.15] font-normal tracking-[-0.4px] text-encre">{fam.title}</h2>
                  </div>
                  <p className="m-[0px] ml-auto max-w-[420px] text-right text-[14px] leading-[24px] font-normal text-texte2 text-pretty">{fam.desc}</p>
                </div>

                {hasRanges ? (
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[16px]">
                    {fam.ranges.map((r, i) => {
                      const active = activeFam && i === range;
                      const lit = active || hover === `${fam.key}g${i}`;
                      const select = () => {
                        setRange(i);
                        setPick(0);
                      };
                      return (
                        <div key={r.key} className="flex flex-col gap-[10px]">
                          <button
                            type="button"
                            aria-pressed={active}
                            onClick={select}
                            onMouseEnter={() => setHover(`${fam.key}g${i}`)}
                            onMouseLeave={() => setHover((h) => (h === `${fam.key}g${i}` ? null : h))}
                            className={`flex min-h-[210px] cursor-pointer flex-col items-start gap-[8px] rounded-[16px] bg-surface p-[24px] text-left transition-[background] duration-[320ms] ${EASE} ring-1 ring-ligne ring-inset dark:ring-0`}
                            style={lit ? { backgroundImage: GRAIN } : undefined}
                          >
                            <span className={`text-[26px] leading-[32px] font-normal tracking-[-0.02em] ${lit ? "text-white" : "text-encre"}`}>{r.title}</span>
                            <span className={`text-[14px] leading-[21px] font-normal text-pretty ${lit ? "text-white/78" : "text-texte2"}`}>{r.line}</span>
                            <span className="mt-auto flex max-w-full flex-col items-start gap-[2px]">
                              <span className={`text-[13px] leading-[20px] font-normal ${lit ? "text-white/78" : "text-texte2"}`}>
                                {count(r.plans.length, labels.plansCountOne, labels.plansCount)}
                              </span>
                              <span className={`text-[22px] leading-[29px] ${PRICE} ${lit ? "text-white" : "text-encre"}`}>{r.range}</span>
                            </span>
                          </button>
                          <button
                            type="button"
                            tabIndex={-1}
                            aria-hidden
                            onClick={select}
                            className={`min-h-[38px] cursor-pointer ${BOOK_FULL} ${
                              active ? "bg-vert text-sur-vert" : "bg-surface-2 text-encre hover:bg-vert hover:text-sur-vert"
                            }`}
                          >
                            {active ? labels.shownInTable : labels.compareRange}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-[16px]">
                    {fam.plans.map((plan, i) => {
                      const { amount, sep, suffix } = splitPrice(plan.price);
                      const lit = hover === `${fam.key}p${i}`;
                      return (
                        <div key={plan.name} className="flex flex-col gap-[10px]">
                          <div
                            onMouseEnter={() => setHover(`${fam.key}p${i}`)}
                            onMouseLeave={() => setHover((h) => (h === `${fam.key}p${i}` ? null : h))}
                            className={`flex min-h-[210px] flex-col items-start gap-[8px] rounded-[16px] bg-surface p-[24px] transition-[background] duration-[320ms] ${EASE} ring-1 ring-ligne ring-inset dark:ring-0`}
                            style={lit ? { backgroundImage: GRAIN } : undefined}
                          >
                            <span className={`text-[26px] leading-[32px] font-normal tracking-[-0.02em] ${lit ? "text-white" : "text-encre"}`}>{plan.name}</span>
                            <span className={`text-[14px] leading-[21px] font-normal ${lit ? "text-white/78" : "text-texte2"}`}>{plan.meta}</span>
                            {plan.who && <span className={`text-[13px] leading-[19px] font-normal text-pretty ${lit ? "text-white/78" : "text-texte2"}`}>{plan.who}</span>}
                            <span className="mt-auto flex items-baseline gap-[7px]">
                              <span className={`text-[28px] leading-[34px] ${PRICE} ${lit ? "text-white" : "text-encre"}`}>
                                {amount}
                                {sep}
                              </span>
                              {suffix && <span className={`text-[14px] leading-[21px] font-normal whitespace-nowrap ${lit ? "text-white/78" : "text-texte2"}`}>{suffix}</span>}
                            </span>
                          </div>
                          <Link href={href} aria-label={`${labels.book} — ${plan.name}`} className={`min-h-[38px] bg-surface-2 text-encre hover:bg-vert hover:text-sur-vert ${BOOK_FULL}`}>
                            {labels.book}
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Comparaison détaillée : titre + bascule « différences seulement ». */}
                <div className="flex flex-wrap items-center justify-between gap-[20px] pt-[8px]">
                  <span className="text-[22px] leading-[28px] font-normal text-encre">{labels.detailed}</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={diff}
                    onClick={() => setDiff((d) => !d)}
                    className="flex min-h-[40px] cursor-pointer items-center gap-[10px] py-[8px]"
                  >
                    <span aria-hidden className={`relative block h-[20px] w-[34px] shrink-0 rounded-full transition-colors ${diff ? "bg-vert" : "bg-piste"}`}>
                      <span className={`absolute top-[3px] block h-[14px] w-[14px] rounded-full bg-white transition-[left] duration-200 ${diff ? "left-[17px]" : "left-[3px]"}`} />
                    </span>
                    <span className="text-[13px] leading-[20px] font-normal whitespace-nowrap text-texte-bascule">{labels.diffOnly}</span>
                  </button>
                </div>

                {hasRanges
                  ? fam.ranges.map((r, i) => (
                      <div key={r.key}>{comparison(fam, r.plans, r.title, activeFam && i === range)}</div>
                    ))
                  : comparison(
                      fam,
                      fam.plans.map((_, i) => i),
                      labels.compare,
                      activeFam,
                    )}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

/** En-tête de colonne (tableau) : nom, prix vert, précision, bouton « Réserver un appel ». */
function PlanHead({ plan, labels, href }: { plan: Plan; labels: Labels; href: string }) {
  const { amount, sep, suffix } = splitPrice(plan.price);
  return (
    <div className="flex flex-col items-center justify-end gap-[10px] px-[14px] py-[20px] text-center">
      <span className="text-[20px] leading-[26px] font-normal text-encre">{plan.name}</span>
      <span className={`text-[26px] leading-[32px] text-vert ${PRICE}`}>
        {amount}
        {sep}
        {suffix && <span className="text-[15px]">{suffix}</span>}
      </span>
      <span className="text-[12px] leading-[18px] font-normal text-texte2">{plan.meta}</span>
      {plan.who && <span className="text-[12px] leading-[18px] font-normal text-texte2 text-pretty">{plan.who}</span>}
      <Link href={href} aria-label={`${labels.book} — ${plan.name}`} className={`mt-[4px] h-[38px] bg-vert text-sur-vert hover:bg-vert-clair ${BOOK_FULL}`}>
        {labels.bookShort}
      </Link>
    </div>
  );
}

/** Forfait choisi (vue étroite) : nom, prix vert, précision, bouton « Réserver un appel ». */
function PlanSummary({ plan, labels, href }: { plan: Plan; labels: Labels; href: string }) {
  const { amount, sep, suffix } = splitPrice(plan.price);
  return (
    <div className="flex flex-col items-start gap-[8px] px-[6px]">
      <span className="text-[24px] leading-[30px] font-normal text-encre">{plan.name}</span>
      <span className={`text-[28px] leading-[34px] text-vert ${PRICE}`}>
        {amount}
        {sep}
        {suffix && <span className="text-[16px]">{suffix}</span>}
      </span>
      <span className="text-[14px] leading-[22px] font-normal text-texte2">{plan.meta}</span>
      {plan.who && <span className="text-[14px] leading-[22px] font-normal text-texte2 text-pretty">{plan.who}</span>}
      <Link href={href} aria-label={`${labels.book} — ${plan.name}`} className={`mt-[8px] h-[38px] bg-vert text-sur-vert hover:bg-vert-clair ${BOOK_FULL}`}>
        {labels.book}
      </Link>
    </div>
  );
}

/** Cellule du tableau : coche verte, croix discrète ou texte centré. */
function Cell({ value, labels }: { value: string; labels: Labels }) {
  if (value === INCLUDED) return <CheckIcon label={labels.included} />;
  if (value === EXCLUDED) return <CrossIcon label={labels.notIncluded} />;
  return <span className="text-center text-[13px] leading-[19px] font-normal text-encre text-balance">{value}</span>;
}
