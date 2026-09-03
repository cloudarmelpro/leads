import { cn } from "@/lib/utils";

type Props = { className?: string };

/**
 * Flèches horizontales du site — tracés du design inlinés (les SVG d'origine ont
 * été supprimés de `public/`) pour hériter de la couleur du texte via
 * `currentColor` (un `<img>` resterait noir). Nommées par direction VISUELLE.
 * `h-auto` + largeur en className : la hauteur suit le ratio du viewBox.
 */

export function ArrowRight({ className }: Props) {
  return (
    <svg
      viewBox="0 0 15.698 8.706"
      fill="currentColor"
      aria-hidden
      className={cn("h-auto w-4 shrink-0", className)}
    >
      <polygon points="11.354,0 10.646,0.706 13.786,3.853 0,3.853 0,4.853 13.786,4.853 10.646,8 11.354,8.706 15.698,4.353 " />
    </svg>
  );
}

export function ArrowLeft({ className }: Props) {
  return (
    <svg
      viewBox="0 0 15.699 8.707"
      fill="currentColor"
      aria-hidden
      className={cn("h-auto w-4 shrink-0", className)}
    >
      <polygon points="15.699,3.854 1.914,3.854 5.061,0.707 4.354,0 0,4.354 4.354,8.707 5.061,8 1.914,4.854 15.699,4.854 " />
    </svg>
  );
}
