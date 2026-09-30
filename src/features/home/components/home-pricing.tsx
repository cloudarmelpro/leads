import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { dict: Pick<Dictionary, "homePricing"> };

/**
 * Prix de départ (maquette Accueil, 2026-09-30) : en-tête à gauche et bouton à droite, puis
 * six cartes (une par famille de services) listant les prix minimums. Les cartes et le
 * bouton mènent à la section Services tant que la page Services n'existe pas.
 */
export function HomePricing({ dict }: Props) {
  const t = dict.homePricing;

  return (
    <section id="prix" className="relative flex justify-center px-[clamp(16px,4vw,56px)] pb-[clamp(128px,14vw,230px)]">
      <div className="flex w-full max-w-[1400px] flex-col gap-[clamp(28px,3vw,40px)]">
        <div className="flex flex-wrap items-end justify-between gap-[24px]">
          <div className="flex min-w-[0px] flex-col gap-[14px]">
            <span className="text-[13px] leading-[20px] font-normal tracking-[0.08em] text-vert uppercase">{t.kicker}</span>
            <h2 className="m-[0px] text-[clamp(22px,2.2vw,30px)] leading-[1.2] font-semibold tracking-[-0.01em] text-encre">{t.title}</h2>
            <p className="m-[0px] max-w-[540px] text-[15px] leading-[24px] font-normal text-texte2 text-pretty">{t.intro}</p>
          </div>
          <a
            href="#services"
            className="tap-44 inline-flex h-[40px] items-center rounded-[8px] bg-surface-2 px-[18px] text-[13.5px] leading-[1] font-medium whitespace-nowrap text-encre no-underline shadow-[inset_0_0_0_1px_var(--color-contour)] transition-[color,box-shadow] duration-200 ease-[cubic-bezier(0.2,0.7,0.2,1)] hover:text-vert hover:shadow-[inset_0_0_0_1px_var(--color-vert)] dark:bg-[rgba(1,41,60,0.72)]"
          >
            {t.cta}
          </a>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,max(300px,calc((100%-32px)/3))),1fr))] gap-[16px]">
          {t.cards.map((card, index) => (
            <a
              key={card.name}
              href="#services"
              className="flex min-w-[0px] flex-col gap-[18px] rounded-[20px] bg-carte p-[clamp(20px,2vw,28px)] no-underline transition-shadow duration-200 ease-[cubic-bezier(0.2,0.7,0.2,1)] hover:shadow-[inset_0_0_0_1px_var(--color-vert)]"
            >
              <div className="flex items-center justify-between gap-[12px]">
                <span className="text-[18px] leading-[24px] font-medium text-encre">{card.name}</span>
                <span className="text-[12px] leading-[16px] font-medium tracking-[0.08em] text-vert">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="flex flex-col">
                {card.rows.map((row, r) => (
                  <div key={row.label} className={`flex items-baseline justify-between gap-[16px] py-[12px] ${r > 0 ? "border-t border-ligne dark:border-[rgba(255,255,255,0.06)]" : ""}`}>
                    <span className="text-[14.5px] leading-[22px] font-normal text-texte2">{row.label}</span>
                    <span className="flex items-baseline gap-[6px] whitespace-nowrap">
                      <span className="text-[12px] leading-[16px] font-normal text-texte-note">{t.from}</span>
                      <span className="text-[20px] leading-[24px] font-semibold tracking-[-0.02em] text-encre">{row.price}</span>
                      {"monthly" in row && row.monthly && <span className="text-[13px] font-normal text-texte2">{t.perMonth}</span>}
                    </span>
                  </div>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
