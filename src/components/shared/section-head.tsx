type Props = {
  id?: string;
  label: string;
  title: string;
  /** Paragraphe d'appui à droite ; absent sur le bloc « À lire ensuite » de l'article. */
  intro?: string;
  /** Largeur maximale du paragraphe d'appui en px (380 par défaut ; 420 Méthode/FAQ, 460 À propos). */
  introMax?: number;
};

/**
 * En-tête de section de la maquette : label vert + H2 à gauche (écart 2px),
 * paragraphe d'appui aligné à droite dès 620px, sous le titre et aligné à gauche
 * en dessous.
 */
export function SectionHead({ id, label, title, intro, introMax = 380 }: Props) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-end gap-[24px] min-[620px]:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <div className="flex flex-col gap-[2px]">
        <span
          id={id}
          className="text-[13px] leading-[20px] font-normal tracking-[0.08em] text-vert uppercase"
        >
          {label}
        </span>
        <h2 className="m-[0px] text-[clamp(22px,2.6vw,30px)] leading-[1.15] font-normal tracking-[-0.4px] text-encre text-pretty">
          {title}
        </h2>
      </div>
      {intro && (
        <p
          className="m-[0px] ml-auto text-[15px] leading-[26px] font-normal text-texte2 text-pretty min-[620px]:text-right"
          style={{ maxWidth: introMax }}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
