// Classes des boutons pleins partagés. Couleurs par les jetons `bouton` (identiques dans
// les deux thèmes, demande du client du 2026-09-30) ; texte seul, sans icône.

const TRANSITION = "transition-colors duration-200 ease-[cubic-bezier(0.2,0.7,0.2,1)]";

/** Bouton plein de 40px de la maquette Accueil (en-tête, hero, organisations, méthode). */
export const BTN_PLEIN = `tap-44 inline-flex h-[40px] items-center rounded-[8px] bg-bouton px-[18px] text-[13.5px] leading-[1] font-medium whitespace-nowrap text-sur-bouton no-underline ${TRANSITION} hover:bg-bouton-clair`;

// Boutons des heros centrés (À propos) à la taille de ceux du hero de l'accueil
// (40 → 48px, 13 → 15px), sans mouvement au survol : seule la couleur change.
const HERO_BTN = `tap-44 inline-flex min-h-[clamp(40px,35.86px+1.1vw,48px)] items-center justify-center rounded-[8px] px-[clamp(16px,12.9px+0.83vw,22px)] text-[clamp(13px,11.97px+0.28vw,15px)] leading-[20px] font-medium whitespace-nowrap no-underline ${TRANSITION}`;

export const HERO_BTN_PRIMARY = `${HERO_BTN} bg-bouton text-sur-bouton hover:bg-bouton-clair`;

// Même verre que les boutons de l'en-tête : le survol fonce le fond, sans filet vert.
export const HERO_BTN_GLASS = `${HERO_BTN} bg-verre text-encre shadow-[inset_0_0_0_1px_var(--color-filet-verre)] backdrop-blur-[14px] hover:bg-verre-fort`;
