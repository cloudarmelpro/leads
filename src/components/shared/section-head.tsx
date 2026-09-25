import { LineReveal } from "@/components/shared/line-reveal";

type Props = {
  id?: string;
  label: string;
  title: string;
  /** Paragraphe d'appui à droite ; absent sur le bloc « À lire ensuite » de l'article. */
  intro?: string;
  /** Largeur maximale du paragraphe d'appui en px. */
  introMax?: number;
};

/**
 * En-tête de section : label vert + H2 à gauche (écart 2px), paragraphe d'appui aligné
 * à droite dès 620px. Mêmes tailles et même révélation ligne par ligne que l'accueil.
 */
export function SectionHead({ id, label, title, intro, introMax = 420 }: Props) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-end gap-[24px] min-[620px]:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <div className="flex flex-col gap-[2px]">
        <span id={id} className="text-[13px] leading-[20px] font-normal tracking-[0.08em] text-vert uppercase">
          {label}
        </span>
        <LineReveal as="h2" className="m-[0px] text-[clamp(22px,2.2vw,30px)] leading-[1.2] font-semibold tracking-[-0.01em] text-encre text-pretty">
          {title}
        </LineReveal>
      </div>
      {intro && (
        <div className="ml-auto" style={{ maxWidth: introMax }}>
          <LineReveal delay={0.12} className="m-[0px] text-[15px] leading-[26px] font-normal text-texte2 text-pretty min-[620px]:text-right">
            {intro}
          </LineReveal>
        </div>
      )}
    </div>
  );
}
