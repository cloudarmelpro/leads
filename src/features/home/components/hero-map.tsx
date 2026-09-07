import { WorldMap } from "@/features/home/components/world-map";

/**
 * Fond « signature » du hero : la carte du monde en points, centrée verticalement,
 * fondue sur ses bords par un masque en dégradé (surtout à gauche, sous le texte).
 * Dès `lg` : carte entière sur la moitié droite (le nœud Québec sort du texte, l'arc
 * vers Paris reste visible) ; sous `lg` : pleine largeur, atténuée, en fond.
 */
export function HeroMap() {
  return (
    <div
      className="pointer-events-none absolute top-1/2 left-0 w-full -translate-y-1/2 select-none opacity-60 lg:right-[-2%] lg:left-auto lg:w-[62%] lg:opacity-100"
      style={{
        maskImage:
          "linear-gradient(90deg, transparent 0%, black 22%, black 88%, transparent 100%), linear-gradient(180deg, transparent 0%, black 14%, black 86%, transparent 100%)",
        maskComposite: "intersect",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent 0%, black 22%, black 88%, transparent 100%), linear-gradient(180deg, transparent 0%, black 14%, black 86%, transparent 100%)",
        WebkitMaskComposite: "source-in",
      }}
    >
      <WorldMap className="w-full" />
    </div>
  );
}
