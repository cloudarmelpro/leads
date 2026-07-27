import type { Locale } from "@/lib/i18n/config";

/**
 * ⚠️ DONNÉES MOCK — placeholder pour construire le design du blog.
 * À remplacer par la vraie source (BD + interface admin). Les pages n'appellent
 * QUE les helpers `getPosts` / `getPost` : le jour venu, on ne change que ce fichier.
 * Le contenu est un exemple générique (web/SEO/PME), à écrire réellement plus tard.
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
  coverSeed: string;
  fr: PostContent;
  en: PostContent;
};

export type Post = Omit<RawPost, "fr" | "en"> & PostContent;

const POSTS: RawPost[] = [
  {
    slug: "site-ne-convertit-pas",
    date: "2026-07-18",
    readMinutes: 5,
    author: { name: "Marc Tremblay", role: "Fondateur & stratégie", avatar: 12 },
    coverSeed: "blog-convert",
    fr: {
      category: "Conversion",
      title: "5 raisons pour lesquelles votre site ne vous amène pas de clients",
      excerpt:
        "Un beau site ne suffit pas. Voici les erreurs les plus fréquentes qui empêchent un site de PME de transformer ses visiteurs en appels.",
      body: [
        {
          type: "p",
          text: "La plupart des sites de PME sont jolis mais silencieux : les visiteurs regardent, puis repartent. Le problème n’est presque jamais le design — c’est l’absence d’un chemin clair vers l’action.",
        },
        { type: "h", text: "1. Aucun appel à l’action visible" },
        {
          type: "p",
          text: "Si votre numéro de téléphone n’est pas atteignable en un geste, vous perdez des clients. Le bouton d’appel doit être présent en haut, en bas, et flotter sur mobile.",
        },
        { type: "h", text: "2. On ne comprend pas ce que vous faites" },
        {
          type: "p",
          text: "En cinq secondes, un visiteur doit savoir ce que vous offrez et pour qui. Un titre clair, dans les mots de vos clients, vaut mieux qu’un slogan abstrait.",
        },
        { type: "h", text: "3. Le site est lent sur téléphone" },
        {
          type: "p",
          text: "La majorité de vos visiteurs arrivent sur mobile. Un site qui met trois secondes à charger a déjà perdu la moitié d’entre eux.",
        },
      ],
    },
    en: {
      category: "Conversion",
      title: "5 reasons your website isn’t bringing you customers",
      excerpt:
        "A good-looking site isn’t enough. Here are the most common mistakes that stop a small-business website from turning visitors into calls.",
      body: [
        {
          type: "p",
          text: "Most small-business sites are pretty but silent: visitors look, then leave. The problem is rarely the design — it’s the lack of a clear path to action.",
        },
        { type: "h", text: "1. No visible call to action" },
        {
          type: "p",
          text: "If your phone number isn’t one tap away, you lose customers. The call button should sit at the top, at the bottom, and float on mobile.",
        },
        { type: "h", text: "2. Nobody understands what you do" },
        {
          type: "p",
          text: "In five seconds, a visitor must know what you offer and for whom. A clear headline, in your customers’ words, beats an abstract slogan.",
        },
        { type: "h", text: "3. The site is slow on phones" },
        {
          type: "p",
          text: "Most of your visitors arrive on mobile. A site that takes three seconds to load has already lost half of them.",
        },
      ],
    },
  },
  {
    slug: "seo-local-quebec",
    date: "2026-07-10",
    readMinutes: 6,
    author: { name: "Alex Roy", role: "Développement web", avatar: 45 },
    coverSeed: "blog-seo",
    fr: {
      category: "SEO",
      title: "SEO local : être trouvé par vos clients au Québec",
      excerpt:
        "Vos clients cherchent « près de chez moi ». Voici comment un site bien structuré vous place devant eux sur Google.",
      body: [
        {
          type: "p",
          text: "Le référencement local, c’est apparaître quand quelqu’un cherche un service dans votre secteur. Pour une PME, c’est souvent le canal d’acquisition le plus rentable.",
        },
        { type: "h", text: "Une fiche Google à jour" },
        {
          type: "p",
          text: "Nom, adresse, téléphone cohérents partout, horaires exacts, photos réelles : Google récompense la constance et la crédibilité.",
        },
        { type: "h", text: "Des pages pensées pour vos villes" },
        {
          type: "p",
          text: "Une page claire par service et par zone desservie aide Google à comprendre où et pour qui vous travaillez — et à vous montrer aux bonnes personnes.",
        },
      ],
    },
    en: {
      category: "SEO",
      title: "Local SEO: getting found by your customers in Québec",
      excerpt:
        "Your customers search “near me”. Here’s how a well-structured site puts you in front of them on Google.",
      body: [
        {
          type: "p",
          text: "Local SEO means showing up when someone searches for a service in your area. For a small business, it’s often the most profitable acquisition channel.",
        },
        { type: "h", text: "An up-to-date Google profile" },
        {
          type: "p",
          text: "Consistent name, address and phone everywhere, accurate hours, real photos: Google rewards consistency and credibility.",
        },
        { type: "h", text: "Pages built around your cities" },
        {
          type: "p",
          text: "A clear page per service and service area helps Google understand where and for whom you work — and show you to the right people.",
        },
      ],
    },
  },
  {
    slug: "combien-coute-un-site",
    date: "2026-06-28",
    readMinutes: 4,
    author: { name: "Marc Tremblay", role: "Fondateur & stratégie", avatar: 12 },
    coverSeed: "blog-price",
    fr: {
      category: "Conseils",
      title: "Combien coûte un bon site web pour une PME ?",
      excerpt:
        "La vraie question n’est pas « combien ça coûte » mais « combien ça rapporte ». On démystifie le prix d’un site professionnel.",
      body: [
        {
          type: "p",
          text: "Un site n’est pas une dépense, c’est un employé qui travaille jour et nuit. Le bon repère, ce n’est pas le prix le plus bas — c’est le retour sur investissement.",
        },
        { type: "h", text: "Ce qui fait varier le prix" },
        {
          type: "p",
          text: "Le nombre de pages, la rédaction, les fonctionnalités (prise de rendez-vous, blog, formulaires) et le niveau de finition. Un prix ferme, établi à l’avance, évite les surprises.",
        },
      ],
    },
    en: {
      category: "Advice",
      title: "How much does a good website cost for a small business?",
      excerpt:
        "The real question isn’t “how much does it cost” but “how much does it bring in”. Let’s demystify the price of a professional site.",
      body: [
        {
          type: "p",
          text: "A website isn’t an expense, it’s an employee working day and night. The right benchmark isn’t the lowest price — it’s the return on investment.",
        },
        { type: "h", text: "What makes the price vary" },
        {
          type: "p",
          text: "Number of pages, copywriting, features (booking, blog, forms) and the level of finish. A firm price, set in advance, avoids surprises.",
        },
      ],
    },
  },
  {
    slug: "site-bilingue-quebec",
    date: "2026-06-15",
    readMinutes: 5,
    author: { name: "Sophie Gagnon", role: "Direction artistique", avatar: 33 },
    coverSeed: "blog-bilingue",
    fr: {
      category: "Stratégie",
      title: "Site bilingue : pourquoi c’est essentiel au Québec",
      excerpt:
        "Parler à vos clients dans leur langue double votre portée. Voici pourquoi un site FR/EN n’est pas un luxe, mais une base.",
      body: [
        {
          type: "p",
          text: "Au Québec, une partie de vos clients pense en français, l’autre en anglais. Un site qui ne parle qu’une langue laisse la moitié de son audience de côté.",
        },
        { type: "h", text: "Deux langues, une seule expérience" },
        {
          type: "p",
          text: "Chaque page dans les deux langues, avec sa propre adresse : c’est meilleur pour vos clients et pour Google, qui indexe chaque version séparément.",
        },
      ],
    },
    en: {
      category: "Strategy",
      title: "A bilingual site: why it’s essential in Québec",
      excerpt:
        "Speaking to your customers in their language doubles your reach. Here’s why a FR/EN site isn’t a luxury, but a baseline.",
      body: [
        {
          type: "p",
          text: "In Québec, some of your customers think in French, others in English. A site that speaks only one language leaves half its audience behind.",
        },
        { type: "h", text: "Two languages, one experience" },
        {
          type: "p",
          text: "Every page in both languages, each with its own URL: better for your customers and for Google, which indexes each version separately.",
        },
      ],
    },
  },
];

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

/** Slugs de tous les articles — pour `generateStaticParams`. */
export function getAllSlugs(): string[] {
  return POSTS.map((p) => p.slug);
}
