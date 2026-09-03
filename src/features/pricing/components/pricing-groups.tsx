import { CalendarDays, Check, CircleCheck } from "lucide-react";
import Link from "next/link";

import { CONTENEUR } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeader } from "@/components/shared/section-header";
import { SurfaceCard } from "@/components/shared/surface-card";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale; dict: Dictionary };
type Plan = Dictionary["pricing"]["groups"][number]["plans"][number];
type CardProps = { plan: Plan; cta: string; href: string };

// Colonnes selon le nombre de forfaits du groupe : 3 (site web), 2 (logo), 1 (hébergement).
const COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
};

/**
 * Groupes de forfaits : un seul eyebrow au-dessus du premier groupe ; chaque groupe
 * = en-tête de section de l'accueil, puis la grille de cartes. Trois formes de
 * carte selon le groupe : liste simple (site web), panneau imbriqué + inclusions en
 * deux colonnes (logo), carte large à fond plein (hébergement).
 */
export function PricingGroups({ lang, dict }: Props) {
  const t = dict.pricing;
  const href = `/${lang}/contact`;

  return (
    <section id="prix" className="pb-[clamp(80px,14vw,200px)]">
      <div className={`${CONTENEUR} flex flex-col gap-[clamp(56px,8vw,96px)]`}>
        {t.groups.map((group, index) => (
          <div key={group.title}>
            <SectionHeader kicker={index === 0 ? t.kicker : undefined} title={group.title} intro={group.intro} />

            <Reveal as="div" stagger={0.1} className={`mt-12 grid gap-5 ${COLS[group.plans.length] ?? COLS[3]}`}>
              {group.plans.map((plan) => {
                if (index === 1) return <NestedPriceCard key={plan.name} plan={plan} cta={t.cardCta} href={href} />;
                if (index === 2) return <WidePriceCard key={plan.name} plan={plan} cta={t.cardCta} href={href} />;
                return <PriceCard key={plan.name} plan={plan} />;
              })}
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Site web : nom, prix, sous-titre, liste simple à coches. */
function PriceCard({ plan }: { plan: Plan }) {
  return (
    <SurfaceCard as="article" className="p-6 sm:p-7">
      <h3 className="relative text-body-fluid font-medium text-emeraude dark:text-accent-strong">{plan.name}</h3>
      <p className="relative mt-2 font-display text-[clamp(1.75rem,2.6vw,2.125rem)] leading-none font-semibold tracking-[-0.5px] text-emeraude dark:text-accent-strong">
        {plan.price}
      </p>
      {plan.tagline && <p className="relative mt-3 text-[0.8125rem] leading-[1.5] text-texte2">{plan.tagline}</p>}

      <ul className="relative mt-6 flex flex-col gap-3">
        {plan.includes && (
          <li className="flex items-start gap-2.5 text-[0.8125rem] leading-[1.45] text-encre">
            <CircleCheck
              size={16}
              strokeWidth={2.2}
              aria-hidden
              className="mt-px shrink-0 fill-emeraude text-white dark:fill-accent-strong dark:text-fond"
            />
            <span>{plan.includes}</span>
          </li>
        )}
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-[0.8125rem] leading-[1.45] text-texte2">
            <Check size={14} strokeWidth={2.6} aria-hidden className="mt-[0.1875rem] shrink-0 text-emeraude dark:text-accent-strong" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </SurfaceCard>
  );
}

/** Inclusions en deux colonnes, coche cerclée (logo et hébergement). */
function FeatureGrid({ features, tone }: { features: string[]; tone: "default" | "inverse" }) {
  const text = tone === "inverse" ? "text-white/85" : "text-encre";
  const icon = tone === "inverse" ? "text-lueur" : "text-emeraude dark:text-accent-strong";
  return (
    <ul className={`grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2 ${text}`}>
      {features.map((feature) => (
        <li key={feature} className="flex items-start gap-2 text-[0.8125rem] leading-[1.45]">
          <CircleCheck size={15} strokeWidth={2.2} aria-hidden className={`mt-[0.125rem] shrink-0 ${icon}`} />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  );
}

/** Bouton d'appel des cartes : vert du site (ou blanc sur fond plein). */
function CardCta({ href, label, inverse = false }: { href: string; label: string; inverse?: boolean }) {
  const tone = inverse
    ? "bg-white text-sapin hover:bg-lueur"
    : "bg-emeraude text-white hover:bg-[#7fefc0] hover:text-fond dark:bg-accent-strong dark:text-fond dark:hover:bg-[#7fefc0]";
  return (
    <Link
      href={href}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-[9px] px-3.5 py-2 text-cta-fluid font-medium no-underline transition-colors sm:px-4 sm:py-2.5 ${tone}`}
    >
      {label}
      <CalendarDays size={16} strokeWidth={2} aria-hidden />
    </Link>
  );
}

/** Logo : panneau imbriqué (nom, sous-titre, prix, bouton) puis inclusions en deux colonnes. */
function NestedPriceCard({ plan, cta, href }: CardProps) {
  return (
    <article className="flex flex-col gap-5 rounded-[20px] border border-ligne bg-surface-2 p-1.5 dark:border-transparent dark:bg-surface dark:shadow-[inset_0_0_0_1px_#0a2a3a]">
      <div className="rounded-[15px] border border-ligne bg-surface p-5 sm:p-6 dark:border-transparent dark:bg-[linear-gradient(180deg,#01202e_0%,#011a26_100%)] dark:shadow-[inset_0_0_0_1px_#0a2a3a]">
        <h3 className="text-title-fluid font-medium text-encre">{plan.name}</h3>
        {plan.tagline && <p className="mt-1 text-[0.8125rem] leading-[1.5] text-texte2">{plan.tagline}</p>}
        <p className="mt-4 font-display text-[clamp(1.75rem,2.6vw,2.125rem)] leading-none font-semibold tracking-[-0.5px] text-emeraude dark:text-accent-strong">
          {plan.price}
        </p>
        <div className="mt-5">
          <CardCta href={href} label={cta} />
        </div>
      </div>
      <div className="px-4 pb-4 sm:px-5 sm:pb-5">
        <FeatureGrid features={plan.features} tone="default" />
      </div>
    </article>
  );
}

/** Hébergement : carte large à fond plein — nom, sous-titre, prix, bouton à gauche ; inclusions à droite. */
function WidePriceCard({ plan, cta, href }: CardProps) {
  return (
    <article className="relative overflow-hidden rounded-[20px] bg-sapin p-6 text-white sm:p-8 dark:bg-surface-2 dark:shadow-[inset_0_0_0_1px_#0a2a3a]">
      <span
        aria-hidden
        className="pointer-events-none absolute top-[-160px] right-[-140px] h-[420px] w-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(48,217,140,0.16),rgba(48,217,140,0)_72%)]"
      />
      <div className="relative grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-center md:gap-12">
        <div>
          <h3 className="text-lead-fluid font-medium">{plan.name}</h3>
          {plan.tagline && <p className="mt-1 text-[0.8125rem] leading-[1.5] text-white/75">{plan.tagline}</p>}
          <p className="mt-4 font-display text-[clamp(1.75rem,2.6vw,2.125rem)] leading-none font-semibold tracking-[-0.5px] text-lueur">
            {plan.price}
          </p>
          <div className="mt-6 max-w-[280px]">
            <CardCta href={href} label={cta} inverse />
          </div>
        </div>
        <FeatureGrid features={plan.features} tone="inverse" />
      </div>
    </article>
  );
}
