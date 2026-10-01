import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Enregistrement unique des greffons : chaque composant client importe gsap d'ici (via
// `loadMotion`, lib/motion/load.ts), jamais de "gsap" directement, sinon l'enregistrement se
// répète et ScrollTrigger se dédouble.
gsap.registerPlugin(ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText };
