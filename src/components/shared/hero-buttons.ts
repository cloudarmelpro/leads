// Boutons des heros centrés (Contact, À propos) à la taille de ceux du hero de l'accueil
// (40 → 48px, 13 → 15px), texte seul, sans mouvement au survol : seule la couleur change.
export const HERO_BTN =
  "tap-44 inline-flex min-h-[clamp(40px,35.86px+1.1vw,48px)] items-center justify-center rounded-[8px] px-[clamp(16px,12.9px+0.83vw,22px)] text-[clamp(13px,11.97px+0.28vw,15px)] leading-[20px] font-medium whitespace-nowrap no-underline transition-colors duration-200 ease-[cubic-bezier(0.2,0.7,0.2,1)]";

export const HERO_BTN_PRIMARY = `${HERO_BTN} bg-vert text-sur-vert hover:bg-vert-clair`;

// Même verre que les boutons de l'en-tête : le survol fonce le fond, sans filet vert.
export const HERO_BTN_GLASS = `${HERO_BTN} bg-verre text-encre shadow-[inset_0_0_0_1px_var(--color-filet-verre)] backdrop-blur-[14px] hover:bg-verre-fort`;
