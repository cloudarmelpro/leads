import { TOOL_ROWS, type Tool } from "@/features/home/components/tools-data";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { dict: Pick<Dictionary, "tools"> };

const MASK = "linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)";

function Chip({ tool }: { tool: Tool }) {
  return (
    <span className="inline-flex h-[44px] items-center gap-[10px] rounded-[8px] bg-surface px-[20px] text-[15px] leading-[1] font-medium whitespace-nowrap text-puce">
      {tool.kind === "icon" ? (
        // Les glyphes blancs de la maquette suivent la couleur du texte : lisibles en clair aussi.
        <svg
          width="18"
          height="18"
          viewBox={tool.viewBox}
          fill={tool.color.toUpperCase() === "#FFFFFF" ? "currentColor" : tool.color}
          aria-hidden
          className="block shrink-0 text-encre"
        >
          {tool.paths.map((d) => (
            <path key={d} d={d} />
          ))}
        </svg>
      ) : (
        <span
          aria-hidden
          className="inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[4px] text-[10px] leading-[1] font-bold"
          style={{ background: tool.color, color: tool.ink }}
        >
          {tool.letter}
        </span>
      )}
      {tool.name}
    </span>
  );
}

/**
 * Outils (maquette Accueil) : trois rangées de puces qui défilent en continu, la deuxième
 * en sens inverse, à des vitesses différentes (une liste en 46, 52, 58 s). À -50 % la
 * seconde moitié de la piste est à la place de la première, la boucle est invisible.
 * Bords fondus par un masque, pause au survol, arrêt sous `prefers-reduced-motion`. La
 * liste est lue une seule fois par les lecteurs d'écran (les copies sont `aria-hidden`).
 */
export function Tools({ dict }: Props) {
  const t = dict.tools;

  return (
    <section id="outils" aria-label={t.aria} className="group relative flex flex-col items-center gap-[clamp(28px,3vw,40px)] pb-[clamp(96px,11vw,180px)]">
      <div className="box-border flex w-full max-w-[1400px] flex-col items-center gap-[14px] px-[clamp(16px,4vw,56px)]">
        <span className="text-[13px] leading-[20px] font-normal tracking-[0.08em] text-vert uppercase">{t.kicker}</span>
        <h2 className="m-[0px] max-w-[640px] text-center text-[clamp(22px,2.2vw,30px)] leading-[1.2] font-semibold tracking-[-0.01em] text-encre text-balance">{t.title}</h2>
      </div>
      <div className="flex w-full flex-col gap-[12px] overflow-hidden" style={{ maskImage: MASK, WebkitMaskImage: MASK }}>
        {TOOL_ROWS.map((row) => (
          <div
            key={row.tools[0]?.name}
            className="flex w-max group-hover:[animation-play-state:paused] motion-reduce:[animation:none]"
            // Propriétés séparées, pas le raccourci `animation` : en ligne, il imposerait
            // `play-state: running` et la pause au survol (classe) n'aurait plus d'effet.
            // Quatre copies de la liste (et non deux comme la maquette) : une liste mesure
            // 1450 à 1750 px, moins qu'un grand écran ; deux copies laissaient un vide à
            // droite en fin de cycle. -50 % décale alors de deux listes : durée doublée pour
            // garder la vitesse de la maquette.
            style={{ animationName: row.animation, animationDuration: `${row.seconds * 2}s`, animationTimingFunction: "linear", animationIterationCount: "infinite" }}
          >
            {[0, 1, 2, 3].map((copy) => (
              <ul key={copy} aria-hidden={copy > 0 || undefined} className="m-[0px] flex shrink-0 list-none gap-[12px] p-[0px] pr-[12px]">
                {row.tools.map((tool) => (
                  <li key={tool.name}>
                    <Chip tool={tool} />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
