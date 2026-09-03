import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Point d'entrée GSAP unique : plugins enregistrés et ease « osmo » (site
// the-racquet-house) créée UNE fois. Importer d'ici, jamais depuis "gsap" direct,
// sinon l'ease peut manquer selon l'ordre de chargement des modules.
gsap.registerPlugin(useGSAP, ScrollTrigger, CustomEase, SplitText, Draggable, InertiaPlugin);

if (typeof window !== "undefined" && !gsap.parseEase("osmo")) {
  CustomEase.create("osmo", "M0,0 C0.625,0.05 0,1 1,1");
}

export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, useGSAP, ScrollTrigger, SplitText, Draggable };
