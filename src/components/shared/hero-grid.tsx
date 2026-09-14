const GRID_MASK = "radial-gradient(48% 62% at 50% 38%, #000 0%, rgba(0,0,0,0.42) 54%, transparent 86%)";

/**
 * Grille fine des heros (maquettes Accueil et Prix) : lignes de 1px à 2,8 % de blanc,
 * maille de 40px, dans la moitié basse de la section, sous masque radial. Réservée au
 * thème sombre (traits blancs). La section hôte doit être `relative`.
 */
export function HeroGrid() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-[45%] bottom-0 z-0 hidden bg-[linear-gradient(rgba(255,255,255,0.028)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.028)_1px,transparent_1px)] bg-[size:40px_40px] bg-[position:center_top] dark:block"
      style={{ maskImage: GRID_MASK, WebkitMaskImage: GRID_MASK }}
    />
  );
}
