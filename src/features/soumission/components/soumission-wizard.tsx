"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";

import { submitSoumission } from "@/features/soumission/actions/submit-soumission";
import type { SoumissionInput } from "@/features/soumission/schemas/soumission";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type T = Dictionary["soumission"];
type Props = { lang: Locale; dict: Pick<Dictionary, "soumission"> };

type ChoiceKey = "type" | "sector" | "stage" | "when";
type Answers = Partial<Record<ChoiceKey, string>> & { fit?: "yes" | "no" };
type Fields = { site: string; details: string; name: string; company: string; email: string; phone: string; city: string };
type Step = { kind: "choice"; key: ChoiceKey } | { kind: "details" } | { kind: "fit" } | { kind: "contact" };

const STEPS: Step[] = [
  { kind: "choice", key: "type" },
  { kind: "choice", key: "sector" },
  { kind: "choice", key: "stage" },
  { kind: "choice", key: "when" },
  { kind: "details" },
  { kind: "fit" },
  { kind: "contact" },
];
const EMPTY: Fields = { site: "", details: "", name: "", company: "", email: "", phone: "", city: "" };
// Sous l'en-tête fixe : cible de défilement à chaque étape (maquette).
const SCROLL_OFFSET = 120;
const ADVANCE_MS = 260;

const EASE = "ease-[cubic-bezier(0.2,0.7,0.2,1)]";
const PANEL = "bg-surface-2 dark:bg-surface";
// Mode clair sans filet (le client n'en veut pas) : les cartes et champs se détachent par leur
// fond gris ; le liseré discret de la maquette ne subsiste qu'en sombre.
const RING = "dark:shadow-[inset_0_0_0_1px_rgba(169,188,196,0.10)]";
const INPUT = `box-border min-h-[52px] w-full rounded-[11px] border-0 ${PANEL} px-[16px] py-[14px] text-[16px] leading-[22px] text-encre outline-none transition-shadow duration-200 ${EASE} ${RING} placeholder:text-texte2/70 focus:shadow-[inset_0_0_0_1px_var(--color-vert)] dark:focus:shadow-[inset_0_0_0_1px_var(--color-vert)]`;
const LABEL = "text-[13px] leading-[18px] font-medium tracking-[0.04em] text-texte2";
const PRIMARY = `box-border inline-flex min-h-[52px] cursor-pointer items-center justify-center rounded-[8px] bg-bouton px-[26px] text-[16px] leading-[20px] font-semibold whitespace-nowrap text-sur-bouton no-underline transition-colors duration-200 ${EASE} hover:bg-bouton-clair disabled:cursor-progress disabled:opacity-80`;
const OUTLINED = `box-border inline-flex min-h-[52px] cursor-pointer items-center justify-center rounded-[8px] bg-transparent px-[22px] text-[16px] leading-[20px] font-medium whitespace-nowrap text-encre shadow-[inset_0_0_0_1px_var(--color-contour)] transition-shadow duration-200 hover:shadow-[inset_0_0_0_1px_var(--color-vert)]`;
const NAV_BTN = `flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-[10px] ${PANEL} ${RING} text-encre transition-[box-shadow,color] duration-200 hover:text-vert hover:shadow-[inset_0_0_0_1px_var(--color-vert)] disabled:cursor-default disabled:opacity-35 disabled:hover:text-encre disabled:hover:shadow-none dark:disabled:hover:shadow-[inset_0_0_0_1px_rgba(169,188,196,0.10)]`;
const KBD = `inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-[6px] ${PANEL} ${RING} px-[6px] text-[12px] leading-[1] text-encre`;

const fill = (tpl: string, vars: Record<string, string>) => tpl.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? "");

function Check({ size = 12, width = 3 }: { size?: number; width?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

/**
 * Parcours de soumission (maquette du 2026-09-30) : sept étapes — projet, organisation,
 * avancement, délai, détails, prix de départ, coordonnées — avec la liste des étapes
 * collante à gauche dès 900px (barre de progression en dessous), un choix avance seul après
 * 260ms, flèches et touches ← → pour naviguer, refus du prix de départ → écran d'arrêt,
 * envoi → écran de confirmation. La demande est enregistrée par la Server Action
 * (validation, honeypot, limite de débit) ; l'échec est affiché, jamais un faux succès.
 */
export function SoumissionWizard({ lang, dict }: Props) {
  const t: T = dict.soumission;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [stop, setStop] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const root = useRef<HTMLDivElement>(null);
  const advance = useRef<number>(0);

  const current = STEPS[Math.min(step, STEPS.length - 1)] ?? STEPS[0]!;
  const typeOpt = t.type.opts.find((o) => o.key === answers.type) ?? t.type.opts[0]!;
  const price = typeOpt.price;
  const canNext = !done && !stop && (current.kind === "details" || (current.kind === "choice" && !!answers[current.key]) || (current.kind === "fit" && answers.fit === "yes"));

  const go = (delta: number) => {
    setStep((s) => Math.max(0, Math.min(STEPS.length - 1, s + delta)));
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET, behavior: reduce ? "auto" : "smooth" });
  };
  const back = () => {
    if (step > 0 && !done) go(-1);
  };
  const forward = () => {
    if (canNext) go(1);
  };

  // Flèches du clavier, hors des champs de saisie.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        back();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        forward();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
  useEffect(() => () => window.clearTimeout(advance.current), []);

  const pickChoice = (key: ChoiceKey, value: string) => {
    setAnswers((a) => ({ ...a, [key]: value, ...(key === "type" && a.type !== value ? { fit: undefined } : {}) }));
    window.clearTimeout(advance.current);
    advance.current = window.setTimeout(() => go(1), ADVANCE_MS);
  };
  const pickFit = (value: "yes" | "no") => {
    setAnswers((a) => ({ ...a, fit: value }));
    window.clearTimeout(advance.current);
    advance.current = window.setTimeout(() => (value === "no" ? setStop(true) : go(1)), ADVANCE_MS);
  };
  const setField = (key: keyof Fields) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    setFields((f) => ({ ...f, [key]: value }));
    setError(null);
  };
  const restart = () => {
    setStep(0);
    setAnswers({});
    setFields(EMPTY);
    setStop(false);
    setDone(false);
    setError(null);
  };

  const submit = () => {
    if (!fields.name.trim()) return setError("name");
    if (!fields.email.trim() && !fields.phone.trim()) return setError("contactRequired");
    if (fields.email.trim() && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(fields.email.trim())) return setError("email");
    const input: SoumissionInput = {
      type: answers.type as SoumissionInput["type"],
      sector: answers.sector as SoumissionInput["sector"],
      stage: answers.stage as SoumissionInput["stage"],
      when: answers.when as SoumissionInput["when"],
      site: fields.site,
      details: fields.details,
      name: fields.name,
      company: fields.company,
      email: fields.email,
      phone: fields.phone,
      city: fields.city,
      website: "",
    };
    startTransition(async () => {
      const result = await submitSoumission(input, lang);
      if (result.status === "success") {
        setDone(true);
        go(0);
      } else {
        setError(result.error);
      }
    });
  };

  const stepTitle = current.kind === "choice" ? t[current.key].title : current.kind === "fit" ? fill(t.fit.title, { lead: typeOpt.lead, price }) : t[current.kind].title;
  const stepSub = current.kind === "choice" ? t[current.key].sub : current.kind === "fit" ? t.fit.sub : t[current.kind].sub;
  const firstName = fields.name.trim().split(/\s+/)[0] ?? "";

  // Options du choix courant (ou du prix de départ), avec le nombre de colonnes de la maquette.
  const options: { key: string; t: string; s: string; on: boolean }[] =
    current.kind === "choice"
      ? t[current.key].opts.map((o) => ({ key: o.key, t: o.t, s: o.s, on: answers[current.key] === o.key }))
      : current.kind === "fit"
        ? [
            { key: "yes", t: t.fit.yes.t, s: t.fit.yes.s, on: answers.fit === "yes" },
            { key: "no", t: t.fit.no.t, s: t.fit.no.s, on: answers.fit === "no" },
          ]
        : [];
  const pick = (key: string) => {
    if (current.kind === "choice") pickChoice(current.key, key);
    else if (current.kind === "fit") pickFit(key === "no" ? "no" : "yes");
  };
  const n = options.length;
  const wideCols = n === 3 || n === 6 || n === 9 ? "min-[1200px]:grid-cols-3" : n === 8 ? "min-[1200px]:grid-cols-4" : "min-[1200px]:grid-cols-2";

  const fieldsSpec: { key: keyof Fields; label: string; type: string; ac: string; ph: string }[] = [
    { key: "name", label: t.contact.name, type: "text", ac: "name", ph: t.contact.namePlaceholder },
    { key: "company", label: t.contact.company, type: "text", ac: "organization", ph: t.contact.companyPlaceholder },
    { key: "email", label: t.contact.email, type: "email", ac: "email", ph: t.contact.emailPlaceholder },
    { key: "phone", label: t.contact.phone, type: "tel", ac: "tel", ph: t.contact.phonePlaceholder },
    { key: "city", label: t.contact.city, type: "text", ac: "address-level2", ph: t.contact.cityPlaceholder },
  ];

  return (
    <section
      id="soumission"
      ref={root}
      className="relative flex items-start justify-center px-[calc(10px+clamp(18px,5vw,72px))] pb-[clamp(180px,19vw,300px)]"
    >
      <div className="grid w-full max-w-[1400px] grid-cols-[minmax(0,1fr)] items-start gap-[clamp(32px,6vw,96px)] min-[900px]:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="hidden flex-col gap-[14px] min-[900px]:sticky min-[900px]:top-[120px] min-[900px]:flex">
          <span className="flex min-h-[clamp(28.6px,3.52vw,44px)] items-start pt-[4px] text-[13px] leading-[20px] font-medium tracking-[0.08em] text-texte2 uppercase">{t.asideLabel}</span>
          <ol className="m-[0px] flex list-none flex-col gap-[6px] p-[0px]">
            {t.steps.map((label, k) => {
              const isDone = k < step || done;
              const active = k === step && !done;
              return (
                <li key={label} className="flex flex-col">
                  <button
                    type="button"
                    disabled={!isDone}
                    onClick={() => {
                      if (isDone && !done) {
                        setStop(false);
                        setStep(k);
                      }
                    }}
                    className={`flex min-h-[40px] items-center gap-[14px] text-left ${isDone && !done ? "cursor-pointer" : "cursor-default"}`}
                  >
                    <span
                      className={`grid h-[24px] w-[24px] shrink-0 place-items-center rounded-full text-[12px] leading-[1] font-semibold transition-[background-color,box-shadow] duration-[250ms] tabular-nums ${
                        isDone
                          ? "bg-bouton text-sur-bouton"
                          : active
                            ? "text-vert shadow-[inset_0_0_0_1.5px_var(--color-vert)]"
                            : "text-texte-note shadow-[inset_0_0_0_1px_var(--color-contour)]"
                      }`}
                    >
                      {isDone ? <Check width={3.2} /> : k + 1}
                    </span>
                    <span className={`text-[16px] leading-[22px] transition-colors duration-[250ms] ${active ? "font-medium text-vert" : isDone ? "font-normal text-texte-bascule" : "font-normal text-texte-note"}`}>{label}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </aside>

        <div className="flex min-w-[0px] flex-col gap-[clamp(24px,3vw,36px)]">
          {!done && !stop && (
            <>
              <div className="h-[4px] overflow-hidden rounded-full bg-ligne min-[900px]:hidden">
                <div className="h-full rounded-full bg-vert transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
              </div>
              <div className="flex flex-wrap items-start justify-between gap-x-[24px] gap-y-[12px]">
                <div className="flex min-w-[0px] flex-[1_1_280px] flex-col gap-[8px]">
                  <h2 className="m-[0px] text-[clamp(26px,3.2vw,40px)] leading-[1.1] font-medium tracking-[-0.02em] text-encre text-balance">{stepTitle}</h2>
                  <p className="m-[0px] max-w-[620px] text-[16px] leading-[24px] font-normal text-texte2 text-pretty">{stepSub}</p>
                </div>
                <span className="shrink-0 pt-[clamp(4px,0.8vw,12px)] text-[13px] leading-[20px] font-medium tracking-[0.08em] whitespace-nowrap text-vert uppercase">
                  {fill(t.stepOf, { n: String(step + 1), total: String(STEPS.length) })}
                </span>
              </div>

              {current.kind === "fit" && (
                <div className={`flex flex-col gap-[6px] rounded-[16px] px-[24px] py-[22px] ${PANEL} ${RING}`}>
                  <span className="text-[13px] leading-[20px] font-medium tracking-[0.08em] text-texte-note uppercase">
                    {typeOpt.t} · {t.from}
                  </span>
                  <span className="text-[clamp(36px,4.4vw,56px)] leading-[1.05] font-medium tracking-[-0.02em] text-vert tabular-nums">{price}</span>
                </div>
              )}

              {options.length > 0 && (
                <div className={`grid grid-cols-1 gap-[14px] min-[560px]:grid-cols-2 ${wideCols}`}>
                  {options.map((o) => (
                    <button
                      key={o.key}
                      type="button"
                      aria-pressed={o.on}
                      onClick={() => pick(o.key)}
                      className={`box-border flex min-h-[112px] cursor-pointer flex-col justify-center gap-[14px] rounded-[16px] px-[14px] py-[18px] text-left transition-[background-color,box-shadow,transform] duration-200 ${EASE} active:scale-[0.98] ${
                        o.on ? "bg-surface-3 shadow-[inset_0_0_0_2px_var(--color-vert)] dark:bg-surface-2" : `${PANEL} ${RING} hover:bg-surface-3 dark:hover:bg-surface-2`
                      }`}
                    >
                      <span className="flex flex-col gap-[4px] px-[6px]">
                        <span className="flex items-center justify-between gap-[10px] text-[17px] leading-[22px] font-medium text-encre">
                          <span className="block min-w-[0px] flex-1">{o.t}</span>
                          <span
                            aria-hidden
                            className={`flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${
                              o.on ? "bg-bouton text-sur-bouton" : "shadow-[inset_0_0_0_1.5px_var(--color-contour)]"
                            }`}
                          >
                            {o.on && <Check />}
                          </span>
                        </span>
                        {o.s && <span className="text-[14px] leading-[20px] font-normal text-texte2 text-pretty">{o.s}</span>}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {current.kind === "details" && (
                <div className="flex max-w-[720px] flex-col gap-[18px]">
                  <label className="flex flex-col gap-[8px]">
                    <span className={LABEL}>{t.details.siteLabel}</span>
                    <input type="url" value={fields.site} onChange={setField("site")} placeholder={t.details.sitePlaceholder} autoComplete="url" className={INPUT} />
                  </label>
                  <label className="flex flex-col gap-[8px]">
                    <span className={LABEL}>{t.details.msgLabel}</span>
                    <textarea value={fields.details} onChange={setField("details")} rows={5} placeholder={t.details.msgPlaceholder} className={`${INPUT} min-h-[140px] resize-y`} />
                  </label>
                  <div className="flex flex-wrap gap-[12px]">
                    <button type="button" onClick={() => go(1)} className={PRIMARY}>
                      {t.details.continue}
                    </button>
                  </div>
                </div>
              )}

              {current.kind === "contact" && (
                <form
                  noValidate
                  onSubmit={(event) => {
                    event.preventDefault();
                    submit();
                  }}
                  className="flex max-w-[720px] flex-col gap-[18px]"
                >
                  {/* Honeypot anti-bot : hors flux, masqué aux humains et aux lecteurs d'écran. */}
                  <div aria-hidden className="pointer-events-none absolute left-[-9999px] h-[0px] w-[0px] overflow-hidden">
                    <label htmlFor="soumission-website">{t.contact.honeypot}</label>
                    <input id="soumission-website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
                  </div>
                  <div className="grid grid-cols-1 gap-[18px] min-[640px]:grid-cols-2">
                    {fieldsSpec.map((f) => (
                      <label key={f.key} className="flex flex-col gap-[8px]">
                        <span className={LABEL}>{f.label}</span>
                        <input type={f.type} value={fields[f.key]} onChange={setField(f.key)} placeholder={f.ph} autoComplete={f.ac} className={INPUT} />
                      </label>
                    ))}
                  </div>
                  {error && (
                    <p role="alert" className="m-[0px] text-[14px] leading-[20px] text-erreur">
                      {t.errors[error as keyof T["errors"]] ?? t.errors.generic}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-[16px]">
                    <button type="submit" disabled={isPending} className={PRIMARY}>
                      {isPending ? t.contact.sending : t.contact.submit}
                    </button>
                    <span className="text-[13px] leading-[20px] text-texte-note">{t.contact.note}</span>
                  </div>
                </form>
              )}

              <div className="flex flex-wrap items-center justify-end gap-[14px]">
                <span className="hidden items-center gap-[8px] text-[13px] leading-[20px] text-texte-note min-[900px]:inline-flex">
                  {t.nav.kbdBefore} <kbd className={KBD}>←</kbd>
                  <kbd className={KBD}>→</kbd> {t.nav.kbdAfter}
                </span>
                <div className="flex gap-[8px]">
                  <button type="button" aria-label={t.nav.prev} onClick={back} disabled={step === 0} className={NAV_BTN}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <button type="button" aria-label={t.nav.next} onClick={forward} disabled={!canNext} className={NAV_BTN}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}

          {stop && !done && (
            <div className={`flex flex-col items-start gap-[18px] rounded-[24px] px-[clamp(24px,4vw,48px)] py-[clamp(32px,5vw,56px)] ${PANEL}`}>
              <span className="text-[13px] leading-[20px] font-medium tracking-[0.08em] text-vert uppercase">{t.stop.kicker}</span>
              <h2 className="m-[0px] text-[clamp(26px,3.2vw,40px)] leading-[1.1] font-medium tracking-[-0.02em] text-encre text-balance">{fill(t.stop.title, { lead: typeOpt.lead, price })}</h2>
              <p className="m-[0px] max-w-[560px] text-[16px] leading-[24px] text-texte2 text-pretty">{t.stop.body}</p>
              <div className="flex flex-wrap gap-[12px]">
                <button
                  type="button"
                  onClick={() => {
                    setAnswers((a) => ({ ...a, fit: undefined }));
                    setStop(false);
                    setStep(0);
                  }}
                  className={PRIMARY}
                >
                  {t.stop.reChoose}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAnswers((a) => ({ ...a, fit: undefined }));
                    setStop(false);
                  }}
                  className={OUTLINED}
                >
                  {t.stop.back}
                </button>
              </div>
            </div>
          )}

          {done && (
            <div role="status" className={`flex flex-col items-center gap-[18px] rounded-[24px] px-[20px] py-[clamp(40px,6vw,80px)] text-center ${PANEL}`}>
              <span className="flex h-[56px] w-[56px] items-center justify-center rounded-[16px] bg-bouton text-sur-bouton">
                <Check size={26} width={2.6} />
              </span>
              <h2 className="m-[0px] text-[clamp(26px,3.2vw,40px)] leading-[1.1] font-medium text-encre">{fill(t.done.title, { name: firstName })}</h2>
              <p className="m-[0px] max-w-[520px] text-[16px] leading-[24px] text-texte2 text-pretty">{t.done.body}</p>
              <div className="mt-[6px] flex flex-wrap justify-center gap-[12px]">
                <Link href={`/${lang}`} className={PRIMARY}>
                  {t.done.home}
                </Link>
                <button type="button" onClick={restart} className={OUTLINED}>
                  {t.done.restart}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
