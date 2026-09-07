import { CONTENEUR } from "@/components/shared/container";
import { WorldMap } from "@/features/home/components/world-map";

// Fondu des bords : le haut (sous le titre) et les flancs s'estompent, le bas reste net.
const MASK =
  "linear-gradient(90deg, transparent 0%, black 6%, black 90%, transparent 100%), linear-gradient(180deg, transparent 0%, black 28%, black 90%, transparent 100%)";

/**
 * La carte est plus large que le conteneur et décalée vers la gauche : l'océan
 * Pacifique (vide) passe dans la gouttière, de sorte que la côte ouest des
 * Amériques s'aligne sur le bord gauche du texte et que le monde couvre tout le hero.
 */
export function HeroMap() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-[60%] -translate-y-1/2 select-none opacity-55 lg:opacity-100"
      style={{ maskImage: MASK, maskComposite: "intersect", WebkitMaskImage: MASK, WebkitMaskComposite: "source-in" }}
    >
      <div className={CONTENEUR}>
        <WorldMap className="w-[114%] -ml-[16%]" />
      </div>
    </div>
  );
}
