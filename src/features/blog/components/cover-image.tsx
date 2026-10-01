import Image from "next/image";

import type { Post } from "@/features/blog/mock-posts";

type Props = { post: Pick<Post, "cover" | "coverLight">; alt?: string; sizes: string; priority?: boolean; className?: string };

/**
 * Couverture d'article selon le thème : quand l'article a une variante claire (rendus nuit
 * regénérés en studio clair, 2026-09-30), les deux images sont dans le DOM et le thème en
 * affiche une ; sinon la photo sert aux deux thèmes.
 */
export function CoverImage({ post, alt = "", sizes, priority, className = "" }: Props) {
  // `priority` seul préchargeait l'image sans la marquer prioritaire : le navigateur (et Google)
  // la mettait derrière les scripts. `fetchPriority` se propage à l'image et au preload.
  const fetchPriority = priority ? "high" : undefined;
  if (!post.coverLight) {
    return <Image src={post.cover} alt={alt} fill priority={priority} fetchPriority={fetchPriority} sizes={sizes} className={`object-cover ${className}`} />;
  }
  return (
    <>
      <Image src={post.coverLight} alt={alt} fill priority={priority} fetchPriority={fetchPriority} sizes={sizes} className={`object-cover dark:hidden ${className}`} />
      <Image src={post.cover} alt={alt} fill priority={priority} fetchPriority={fetchPriority} sizes={sizes} className={`hidden object-cover dark:block ${className}`} />
    </>
  );
}
