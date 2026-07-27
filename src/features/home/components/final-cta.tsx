import { Phone } from "lucide-react";
import Link from "next/link";

import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale; dict: Dictionary };

export function FinalCta({ lang, dict }: Props) {
  const t = dict.final;

  return (
    <section
      id="contact"
      className="px-[clamp(12px,3vw,32px)] pt-[clamp(24px,4vw,48px)] pb-[clamp(48px,6vw,72px)]"
    >
      <div
        data-reveal="up"
        className="mx-auto flex max-w-[1160px] flex-col items-center rounded-[32px] bg-encre px-[clamp(24px,4vw,56px)] py-[clamp(56px,9vw,104px)] text-center text-white"
      >
        <span className="mb-7 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-encre">
          <Phone size={24} strokeWidth={2.2} aria-hidden />
        </span>

        <h2 className="mx-auto mb-4 max-w-[18ch] font-display text-[clamp(28px,5.5vw,56px)] leading-[1.12] tracking-normal text-balance">
          {t.titleA} {t.titleB}
        </h2>

        <p className="mx-auto mb-9 max-w-[46ch] text-[17px] leading-[1.6] text-white/60 text-pretty">
          {t.subtitle}
        </p>

        <Link
          href={`/${lang}/contact`}
          className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-7 text-sm font-semibold text-encre no-underline transition-colors hover:bg-white/90"
        >
          {t.rdv}
        </Link>
      </div>
    </section>
  );
}
