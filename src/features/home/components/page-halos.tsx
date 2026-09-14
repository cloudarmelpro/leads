/**
 * Halos du haut de page (maquette Accueil) : calque absolu de 1300px, halo vert en
 * haut au centre, halo bleu en haut à gauche. Réservés au thème sombre — sur fond
 * clair, ces voiles colorés n'ont pas d'équivalent dans la maquette.
 */
export function PageHalos() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 hidden h-[1300px] overflow-hidden dark:block">
      <div className="absolute inset-0 bg-[radial-gradient(58%_46%_at_50%_-6%,rgba(48,217,140,0.20)_0%,rgba(48,217,140,0.07)_38%,rgba(1,24,35,0)_72%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(42%_34%_at_22%_4%,rgba(120,198,255,0.09)_0%,rgba(1,24,35,0)_70%)]" />
    </div>
  );
}
