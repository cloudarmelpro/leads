import { LineReveal } from "@/components/shared/line-reveal";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { dict: Pick<Dictionary, "hero"> };

/**
 * Bande des métiers (maquette Accueil) : titre centré puis les sept secteurs en liens
 * discrets, chacun renvoie à la section Secteurs.
 */
export function TradesStrip({ dict }: Props) {
  const t = dict.hero;

  return (
    <section aria-label={t.tradesAria} className="relative z-[1] flex justify-center px-[10px]">
      <div className="flex w-full flex-col items-center gap-[clamp(32px,4vw,56px)] px-[clamp(20px,5vw,72px)] py-[clamp(96px,11vw,180px)]">
        <LineReveal as="h2" className="m-[0px] max-w-[640px] text-center text-[clamp(22px,2.2vw,30px)] leading-[1.2] font-semibold tracking-[-0.01em] text-encre text-balance">
          {t.tradesTitle}
        </LineReveal>
        <div className="flex flex-wrap items-center justify-center gap-x-[clamp(24px,3.2vw,56px)] gap-y-[clamp(20px,3vw,48px)]">
          {t.demos.map((demo) => (
            <a
              key={demo.trade}
              href="#secteurs"
              className="tap-44 inline-flex items-center text-[clamp(15px,1.25vw,19px)] leading-[1] font-normal tracking-[0.01em] whitespace-nowrap text-texte-sourd no-underline transition-colors duration-200 ease-[cubic-bezier(0.2,0.7,0.2,1)] hover:text-encre"
            >
              {demo.trade}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
