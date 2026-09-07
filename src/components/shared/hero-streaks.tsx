/**
 * Fond signature des heros : deux fines ellipses vertes floutées, pivotées de 50°,
 * qui traversent l'en-tête et descendent en diagonale dans la page (valeurs du SVG
 * Figma : 99×2009px, #30D98C, blur 50, opacity .05 ; couleur via token pour rester
 * juste en clair et en sombre). Le débordement vers le bas est voulu (pas de coupe
 * nette au bas du hero).
 *
 * Contrat : la section hôte doit être `relative overflow-x-clip` et remontée sous
 * l'en-tête (`-mt-[4.8125rem]` + padding haut équivalent), sinon les traits ne
 * croisent pas le header comme sur l'accueil.
 */
export function HeroStreaks() {
  return (
    <>
      {/* Ellipse 2 — croise le header entre le logo et « Services ». */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-340px] left-[-9%] h-[2009px] w-[99px] rotate-[50deg] rounded-[50%] bg-accent-strong opacity-[0.04] blur-[50px]"
      />
      {/* Ellipse 1 — croise le header au niveau du bouton « Contact ». */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-340px] left-[30%] h-[2009px] w-[99px] rotate-[50deg] rounded-[50%] bg-accent-strong opacity-[0.04] blur-[50px]"
      />
    </>
  );
}
