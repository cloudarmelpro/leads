import { Globe3D } from "@/features/home/components/globe-3d";

/**
 * Globe « signature » du hero : le globe 3D WebGL (`Globe3D`), positionné en CSS.
 * Sous `lg` (mise en page burger) : fond centré derrière le texte, atténué et
 * inerte. Dès `lg` : ancré à droite du conteneur, pleine opacité, saisissable à la
 * souris (zone circulaire : les coins du carré restent transparents pour le titre).
 * Le décalage à droite = gouttière − débordement, où le débordement croît avec
 * l'espace libre hors conteneur (0 sous 1240px, plafonné à 10rem) : jamais coupé
 * par le viewport, mais respire sur grand écran.
 */
export function HeroGlobe() {
  return (
    <div className="pointer-events-none absolute top-[54%] left-1/2 w-[135%] max-w-[560px] -translate-x-1/2 -translate-y-1/2 select-none lg:top-[57%] lg:right-[calc(clamp(1rem,4vw,3.5rem)-clamp(0px,(100vw-77.5rem)/2,10rem))] lg:left-auto lg:w-[56%] lg:max-w-[680px] lg:translate-x-0">
      <div className="opacity-30 [clip-path:circle(50%)] lg:pointer-events-auto lg:opacity-100">
        <Globe3D size={680} />
      </div>
    </div>
  );
}
