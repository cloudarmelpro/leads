/** Vrai si le visiteur a demandé moins d'animations : aucun mouvement dans ce cas. */
export const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export type Motion = typeof import("./gsap");

/**
 * GSAP (+ ScrollTrigger, SplitText) chargé à la demande, après l'hydratation : 120 Ko de
 * script sortis du chemin critique de chaque page. Les composants l'appellent dans leur
 * effet et gardent leurs blocs masqués (globals.css) jusqu'à son arrivée.
 */
export const loadMotion = (): Promise<Motion> => import("./gsap");
