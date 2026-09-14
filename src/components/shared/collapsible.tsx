import type { ReactNode } from "react";

type Props = {
  id: string;
  open: boolean;
  /** Bouton qui contrôle le panneau (`aria-labelledby`). */
  labelledBy?: string;
  className?: string;
  children: ReactNode;
};

/**
 * Panneau qui s'ouvre et se ferme en glissant (300ms) : grille dont l'unique rangée
 * passe de 0fr à 1fr, le contenu restant monté pour animer aussi la fermeture. Aucune
 * bibliothèque ; instantané sous `prefers-reduced-motion` (règle globale). Le contenu
 * ne doit pas contenir d'élément focalisable (il n'est pas retiré du DOM une fois fermé).
 */
export function Collapsible({ id, open, labelledBy, className, children }: Props) {
  return (
    <div
      id={id}
      role="region"
      aria-labelledby={labelledBy}
      aria-hidden={!open}
      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      }`}
    >
      <div className={`min-h-[0px] overflow-hidden ${className ?? ""}`}>{children}</div>
    </div>
  );
}
