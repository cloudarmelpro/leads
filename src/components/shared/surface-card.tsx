import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

type Props<T extends ElementType> = {
  as?: T;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

/**
 * Carte des sections de l'accueil (Services) : coins 20px, fond `surface`, bordure
 * fine en clair, dégradé sarcelle + bordure interne en sombre, halo vert haut-droite.
 * Le padding est laissé à l'appelant (`p-7` par défaut si non fourni).
 */
export function SurfaceCard<T extends ElementType = "div">({
  as,
  className = "",
  children,
  ...rest
}: Props<T>) {
  const Tag = (as ?? "div") as ElementType;
  const padding = /\bp-|\bpx-|\bpy-/.test(className) ? "" : "p-7";

  return (
    <Tag
      className={`relative flex flex-col overflow-hidden rounded-[20px] border border-ligne bg-surface ${padding} dark:border-transparent dark:bg-[linear-gradient(180deg,#01202e_0%,#011a26_100%)] dark:shadow-[inset_0_0_0_1px_#0a2a3a] ${className}`}
      {...rest}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute top-[-160px] right-[-140px] h-[360px] w-[360px] rounded-full bg-[radial-gradient(closest-side,rgba(48,217,140,0.08),rgba(48,217,140,0)_72%)]"
      />
      {children}
    </Tag>
  );
}
