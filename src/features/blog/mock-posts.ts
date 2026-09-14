import type { Locale } from "@/lib/i18n/config";

/**
 * Source des articles du blog. Le contenu placeholder a été retiré pour le
 * lancement : `POSTS` est vide et le blog affiche un état « à venir » tant qu'il
 * n'y a pas de vrais articles. Les pages n'appellent QUE les helpers ci-dessous —
 * pour publier, remplir `POSTS` (ou brancher la vraie source : BD + admin).
 */

export type Block = { type: "p" | "h"; text: string };

type PostContent = {
  category: string;
  title: string;
  excerpt: string;
  body: Block[];
};

type RawPost = {
  slug: string;
  date: string; // ISO
  readMinutes: number;
  author: { name: string; role: string; avatar: number };
  /** Nom de fichier de la couverture 16:9 dans `public/images/blog/` (sans extension). */
  coverSeed: string;
  fr: PostContent;
  en: PostContent;
};

export type Post = Omit<RawPost, "fr" | "en"> & PostContent;

const POSTS: RawPost[] = [];

function localize(post: RawPost, lang: Locale): Post {
  const { fr, en, ...rest } = post;
  return { ...rest, ...(lang === "en" ? en : fr) };
}

/** Tous les articles, du plus récent au plus ancien. */
export function getPosts(lang: Locale): Post[] {
  return [...POSTS]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map((post) => localize(post, lang));
}

export function getPost(lang: Locale, slug: string): Post | null {
  const post = POSTS.find((p) => p.slug === slug);
  return post ? localize(post, lang) : null;
}

/** Chemin public de la couverture d'un article (16:9, `public/images/blog/<coverSeed>.jpg`). */
export function coverSrc(post: Pick<Post, "coverSeed">): string {
  return `/images/blog/${post.coverSeed}.jpg`;
}

/** Slugs de tous les articles — pour `generateStaticParams`. */
export function getAllSlugs(): string[] {
  return POSTS.map((p) => p.slug);
}
