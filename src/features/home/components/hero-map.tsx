import { CONTENEUR } from "@/components/shared/container";
import { WorldMap } from "@/features/home/components/world-map";

// Fondu des bords de la carte : le flanc gauche (vers le titre) et le bas s'estompent
// doucement, le haut (Grand Nord, Groenland, Sibérie) et la droite restent nets — la carte « sort » du côté du texte.
const MASK =
  "linear-gradient(90deg, transparent 0%, black 14%, black 96%, transparent 100%), linear-gradient(180deg, black 0%, black 90%, transparent 100%)";

/**
 * Dès `lg`, la carte occupe la partie droite du hero et déborde du conteneur vers la
 * droite (la section clippe l'axe X) ; le texte garde la gauche.
 * Sous `lg`, elle passe en fond centré et atténué derrière le texte.
 */
export function HeroMap() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-[56%] -translate-y-1/2 select-none">
      <div className={CONTENEUR}>
        <div
          className="w-full opacity-55 lg:mr-[-10%] lg:ml-auto lg:w-[70%] lg:opacity-100"
          style={{ maskImage: MASK, maskComposite: "intersect", WebkitMaskImage: MASK, WebkitMaskComposite: "source-in" }}
        >
          <WorldMap className="w-full" />
        </div>
      </div>
    </div>
  );
}
