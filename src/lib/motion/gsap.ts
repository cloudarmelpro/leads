import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Enregistrement unique des greffons : chaque composant client importe gsap d'ici, jamais
// de "gsap" directement, sinon l'enregistrement se répète et ScrollTrigger se dédouble.
gsap.registerPlugin(ScrollTrigger, SplitText);

/** Vrai si le visiteur a demandé moins d'animations : aucun mouvement dans ce cas. */
export const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, ScrollTrigger, SplitText };
