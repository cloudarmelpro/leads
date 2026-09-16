/**
 * Halo du haut de page : calque absolu de 1300px calé sur <body> (l'en-tête transparent
 * passe dessus), un seul voile bleu très discret en haut à gauche. Le halo vert central
 * de la maquette a été retiré le 2026-09-16 à la demande du client (fond trop vert).
 * Réservé au thème sombre.
 */
export function PageHalos() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 hidden h-[1300px] overflow-hidden dark:block">
      <div className="absolute inset-0 bg-[radial-gradient(42%_34%_at_22%_4%,rgba(120,198,255,0.09)_0%,rgba(1,24,35,0)_70%)]" />
    </div>
  );
}
