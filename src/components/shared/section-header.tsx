import { Eyebrow } from "@/components/shared/eyebrow";
import { SplitReveal } from "@/components/shared/split-reveal";

type Props = {
  kicker?: string;
  title: string;
  /** Texte de droite, aligné en bas et à droite dès `md` (comme Services / Secteurs). */
  intro?: string;
};

/**
 * En-tête de section de l'accueil, partagé par toutes les pages : eyebrow + titre h2
 * à gauche (1,5 part), intro à droite (1 part). Le conteneur et la marge basse sont
 * laissés à la section appelante.
 */
export function SectionHeader({ kicker, title, intro }: Props) {
  return (
    <div className="grid grid-cols-1 gap-x-16 gap-y-5 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:items-end">
      <div>
        {kicker && (
          <p className="mb-1">
            <Eyebrow>{kicker}</Eyebrow>
          </p>
        )}
        <SplitReveal
          as="h2"
          className="font-display text-[clamp(24px,4vw,38px)] leading-[1.143] font-normal tracking-[-1.2px] text-balance"
        >
          {title}
        </SplitReveal>
      </div>
      {intro && (
        <SplitReveal
          as="p"
          delay={0.1}
          className="text-body-fluid text-texte2 text-pretty md:w-[480px] md:justify-self-end md:pb-2 md:text-right"
        >
          {intro}
        </SplitReveal>
      )}
    </div>
  );
}
