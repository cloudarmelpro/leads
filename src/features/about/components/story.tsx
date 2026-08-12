import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { dict: Dictionary };

/**
 * Récit fondateur en « colonne vertébrale » émeraude : une hairline verticale en
 * dégradé relie des nœuds numérotés (mouvements du récit). Élément signature de la
 * page.
 */
export function Story({ dict }: Props) {
  const t = dict.about;
  const movements = t.story;

  return (
    <section className="px-[clamp(16px,4vw,32px)] py-[clamp(48px,7vw,96px)]">
      <div className="mx-auto max-w-290">
        <ol className="relative mx-auto max-w-[760px]">
          {/* Épine émeraude : hairline verticale qui relie les mouvements et se fond
              vers le bas. Décorative — les nœuds portent l'information. */}
          <span
            aria-hidden
            className="absolute top-3 bottom-6 left-[18px] w-px bg-[linear-gradient(180deg,var(--color-emeraude),var(--color-ligne))]"
          />

          {movements.map((para, index) => (
            <li
              key={index}
              data-reveal="up"
              data-reveal-delay={`${index * 90}`}
              className="relative pb-[clamp(28px,4vw,44px)] pl-16 last:pb-0"
            >
              <span
                aria-hidden
                className="absolute top-0 left-0 flex h-9 w-9 items-center justify-center rounded-full bg-fond font-mono text-[12px] text-emeraude ring-1 ring-emeraude/40 dark:text-accent-strong dark:ring-accent-strong/40"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <p
                className={
                  index === 0
                    ? "font-display text-[clamp(19px,2.4vw,26px)] leading-[1.35] text-encre text-balance"
                    : "text-[clamp(15px,1.7vw,18px)] leading-[1.75] text-texte2 text-pretty"
                }
              >
                {para}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
