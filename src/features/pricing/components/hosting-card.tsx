import { CircleCheck } from "lucide-react";
import Link from "next/link";

import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { hosting: Dictionary["pricing"]["hosting"]; bookLabel: string; href: string };

/** Hébergement (design « Pricing v2 ») : carte large — nom, note, prix et bouton à gauche, inclusions à droite. */
export function HostingCard({ hosting, bookLabel, href }: Props) {
  return (
    <article className="grid grid-cols-1 gap-8 rounded-[24px] border border-ligne bg-surface px-6 pt-9 pb-10 md:grid-cols-2 md:gap-14 md:px-8 md:pt-11 md:pb-12 dark:border-transparent">
      <div className="flex flex-col items-start gap-5">
        <div className="flex flex-col gap-2">
          <span className="font-display text-[1.75rem] leading-[2.125rem] text-encre">{hosting.name}</span>
          <span className="max-w-[340px] text-[0.875rem] leading-[1.375rem] font-light text-texte2 text-pretty">{hosting.blurb}</span>
        </div>
        <span className="font-mono text-[2rem] leading-[2.375rem] font-bold tracking-[-0.02em] tabular-nums whitespace-nowrap text-emeraude dark:text-accent-strong">
          {hosting.price}
        </span>
        <Link
          href={href}
          className="mt-2 inline-flex h-[45px] items-center justify-center rounded-[9px] bg-emeraude px-6 text-[0.9375rem] leading-[1.3125rem] font-medium text-white no-underline transition-colors hover:bg-[#7fefc0] hover:text-fond dark:bg-accent-strong dark:text-fond dark:hover:bg-[#7fefc0]"
        >
          {bookLabel}
        </Link>
      </div>
      <ul className="flex flex-col gap-3.5 self-center">
        {hosting.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <CircleCheck
              size={16}
              strokeWidth={2.2}
              aria-hidden
              className="mt-1 shrink-0 fill-emeraude text-white dark:fill-accent-strong dark:text-fond"
            />
            <span className="text-[0.9375rem] leading-6 font-light text-encre text-pretty">{feature}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
