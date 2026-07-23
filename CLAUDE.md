@AGENTS.md

# Projet « Leads » — guide

Site vitrine **bilingue (FR/EN)**, **haut de gamme**, dont l'objectif premier est la
**génération de leads** : plus d'appels, plus de prises de rendez-vous en ligne, plus
de ventes. Le site présente l'entreprise, démontre un haut niveau de qualité et crée un
**fort effet « wow »** qui pousse à l'action.

> ⚠️ Le **nom de l'entreprise n'est pas encore arrêté** (donc pas de nom de domaine ni
> de logo final). Ne rien inventer : ni nom, ni slogan, ni coordonnées, ni témoignage,
> ni chiffre. Placeholder explicite tant que l'info n'est pas fournie.

## Contexte

- **Cible principale** : PME québécoises de services extérieurs (paysagement, excavation,
  travaux extérieurs). **Secondaire** : construction, rénovation, commerces locaux,
  barbershops, petits restaurants. Taille visée : **1 à 20 employés**.
- **Positionnement** : qualité, professionnalisme, exécution soignée, **image premium** —
  **jamais** axé sur les bas prix.
- **Émotions à inspirer** : confiance, sérieux, qualité, professionnalisme.

## Stack

Next.js 16.2.11 (App Router, React Compiler) · React 19 · TypeScript strict ·
Tailwind CSS v4. Kit UI visé : shadcn/ui + base-ui/react + lucide-react (à installer
au besoin). Turbopack.

## Commandes

- `npm run dev` — serveur de développement
- `npm run build` — build de production (type-check inclus)
- `npm run lint` — ESLint
- Design system : `python .claude/skills/ui-ux-pro-max/scripts/search.py "<requête>" --design-system -p "Leads"`

## Architecture — feature-based (vertical slice)

**Référence normative : [`ARCHITECTURE.md`](./ARCHITECTURE.md).** En bref : la logique
métier vit dans `features/<nom>/services/` ; `app/` ne contient que des routes minces ;
l'infra transverse est dans `lib/` (feuille, sans dépendance vers `features/`).

```
src/
├─ app/            # routes seulement, minces — [lang]/(public)/ · (auth)/ · admin/ · api/webhooks/
├─ features/<nom>/ # services/ schemas/ components/ (+ actions/ queries/ à l'usage) + index.ts + server.ts
├─ lib/            # db/ auth/ env.ts i18n/ seo/ email/ format/ — infrastructure feuille
└─ components/     # ui/ (shadcn) · shared/ (Header, Footer, contact flottant…)
```

Site public bilingue sous **`app/[lang]/(public)/`** (`/fr/...`, `/en/...`) — chaque langue a son
URL, ses canonical/hreflang. Connexion et admin vivent **hors `[lang]`**, en français seulement
(non indexés, un seul utilisateur). Pas d'API REST publique : seulement `api/webhooks/`.
Une feature démarre avec `services/ + schemas/ + components/` ; les autres dossiers naissent
au premier besoin réel — pas de dossier vide.

**Pages au lancement** : Accueil · À propos · Services · Contact · Blog · FAQ (+ Portfolio · Témoignages plus tard).

## Conventions

- **i18n** : aucune chaîne visible en dur dans le JSX — tout passe par `getDictionary(lang)`.
  Ajouter une clé dans `fr.json` ET `en.json` (parité ; `fr.json` = type de référence).
- **Server Components par défaut** ; `"use client"` uniquement si état/effets/événements.
- `params`/`searchParams` sont des **Promises** → les `await`. Helpers `PageProps`/`LayoutProps`.
- Alias `@/*` → `src/*`. Pas de duplication.
- Middleware s'appelle **`proxy.ts`** (ne pas créer `middleware.ts`).
- **Surface publique par feature** : `features/<nom>/index.ts` (client-safe) et
  `server.ts` (server-only) sont les seules portes d'entrée. Pas d'import profond
  entre features. Voir `ARCHITECTURE.md` (règles 1 et 7).
- **Commentaires** : uniquement une contrainte que le code ne montre pas (piège, invariant
  entre fichiers). 1–3 lignes. Ni historique, ni paraphrase du code.

## Design

Univers **premium · moderne · corporate · technologique · luxe**. **Couleur principale : le
vert.** Le **mouvement** (animations, transitions, micro-interactions) fait partie du produit —
c'est un levier de conversion, toujours sous `prefers-reduced-motion`. Éviter le template
agence/SaaS générique : viser une identité distinctive et un élément « signature » mémorable.
Lancer l'agent `design-lead` ; suivre le skill `frontend-design`.
A11y non négociable : contraste ≥ 4.5:1, focus visibles, cibles ≥ 44px, responsive.

## Fonctionnalités & intégrations

- **Formulaire de contact** et **prise de rendez-vous en ligne via Calendly**.
- **Blog administrable** (contenu géré dans la durée).
- **Liens réseaux sociaux** + **accès rapides WhatsApp** (et possiblement Messenger).
- **Module de contact flottant** envisagé.
- **SEO ambitieux dès le départ** : structure pensée pour Google (métadonnées, canonical +
  hreflang, sitemap, robots, JSON-LD, Open Graph).

## Déploiement

Hébergement cible **Hostinger** (self-host Node) — viser `output: 'standalone'` le moment venu.
Travail **itératif**, sans deadline fixe : priorité au très haut niveau de qualité.
Maintenance continue prévue (mises à jour, gestion du blog, optimisations, SEO continu).
La **gestion des réseaux sociaux ne fait pas partie** du mandat.

## À ne pas faire

- Ne pas coder une API Next.js sans lire la doc dans `node_modules/next/dist/docs/` (voir AGENTS.md).
- Pas d'emoji comme icônes (utiliser lucide-react). Pas de `middleware.ts`. Pas de `any`.
- Ne rien inventer sur l'entreprise (nom, coordonnées, prix, témoignages, chiffres, logos clients).
- Ne jamais déposer un document interne dans `public/` — tout y est servi publiquement et
  indexable. Les documents de travail vont dans `docs/` à la racine.
- Ne jamais afficher « message envoyé » si l'enregistrement du lead a échoué (ARCHITECTURE.md, règle 9).
