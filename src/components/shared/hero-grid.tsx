// Masques radiaux des maquettes : Accueil, Prix et Contact partagent le même ; le Blog,
// dont la grille part plus haut (30 %), a le sien ; l'article la fait courir sur tout le hero.
const MASKS = {
  0: "radial-gradient(60% 70% at 50% 20%, #000 0%, rgba(0,0,0,0.35) 55%, transparent 88%)",
  30: "radial-gradient(52% 64% at 50% 34%, #000 0%, rgba(0,0,0,0.42) 54%, transparent 86%)",
  40: "radial-gradient(48% 62% at 50% 38%, #000 0%, rgba(0,0,0,0.42) 54%, transparent 86%)",
  45: "radial-gradient(48% 62% at 50% 38%, #000 0%, rgba(0,0,0,0.42) 54%, transparent 86%)",
} as const;
const TOP = { 0: "top-[0px]", 30: "top-[30%]", 40: "top-[40%]", 45: "top-[45%]" } as const;

type Props = {
  /** Départ de la grille, en pourcentage de la hauteur de la section (45 par défaut ; 40 Contact, 30 Blog, 0 article). */
  top?: keyof typeof MASKS;
};

/**
 * Grille fine des heros : lignes de 1px à 2,8 % de blanc, maille de 40px, dans la
 * partie basse de la section, sous masque radial. Réservée au thème sombre (traits
 * blancs). La section hôte doit être `relative`.
 */
export function HeroGrid({ top = 45 }: Props) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 bottom-0 z-0 hidden ${TOP[top]} bg-[linear-gradient(rgba(255,255,255,0.028)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.028)_1px,transparent_1px)] bg-[size:40px_40px] bg-[position:center_top] dark:block`}
      style={{ maskImage: MASKS[top], WebkitMaskImage: MASKS[top] }}
    />
  );
}
