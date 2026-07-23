# Leads — Architecture

**Ce qu'on construit** : un **site vitrine bilingue FR/EN de 6 pages** (Accueil, À propos,
Services, Contact, Blog, FAQ), avec un **formulaire de contact**, une **prise de rendez-vous
Calendly**, et un **blog administrable** par le client depuis un espace d'administration maison.

**Ce qu'on ne construit pas** : pas de SaaS, pas d'API publique pour des tiers, pas
d'application mobile, pas de multi-tenant. Le seul consommateur du code est ce site.
L'architecture ci-dessous est dimensionnée pour ça — et pas au-delà.

**Pattern** : modulaire par **feature (vertical slice)**. La logique métier vit dans
`features/<nom>/services/` — pas dans les routes, pas dans les Server Actions. Le dossier
`app/` ne contient **que des routes** : orchestration fine, aucun SQL, aucune règle métier.
L'infrastructure transverse vit dans `lib/`.

---

## Structure des dossiers

App **unique** (pas de monorepo). Tout est sous `src/`.

```
leads/
├── src/
│   ├── app/                          # App Router — routes seulement, minces
│   │   ├── [lang]/                   # ⭐ Site public bilingue : /fr/... et /en/...
│   │   │   ├── (public)/             # Accueil, à propos, services, blog, FAQ, contact
│   │   │   ├── layout.tsx            # <html lang={lang}>, dictionnaire, Header/Footer
│   │   │   └── not-found.tsx
│   │   ├── (auth)/                   # Connexion admin — hors [lang], FR seulement
│   │   ├── admin/                    # Administration du blog — hors [lang], role-gated
│   │   └── api/
│   │       └── webhooks/             # Webhooks entrants (Calendly…) — serveur-à-serveur
│   │
│   ├── features/                     # Modules métier (tranches verticales)
│   │   └── <nom>/                    # contact, blog, auth
│   │       ├── services/             # ⭐ Logique métier PURE — source de vérité
│   │       ├── schemas/              # Schémas Zod (partagés partout)
│   │       ├── components/           # Composants React de la feature
│   │       ├── actions/              # 'use server' — wrappers minces de formulaire
│   │       ├── queries/              # Lecture (data fetchers) pour les Server Components
│   │       ├── index.ts              # Surface publique CLIENT-SAFE (seule porte d'entrée)
│   │       └── server.ts             # Surface publique SERVER-ONLY (services, queries…)
│   │
│   ├── lib/                          # Infrastructure transverse (feuille)
│   │   ├── db/                       # Client Prisma (singleton)
│   │   ├── auth/                     # Session admin (implémentation à trancher)
│   │   ├── env.ts                    # Variables d'environnement typées via Zod
│   │   ├── i18n/                     # config.ts (locales) + dictionaries/{fr,en}.json
│   │   ├── seo/                      # Métadonnées, hreflang, JSON-LD, sitemap
│   │   ├── email/                    # Envoi d'email (notification de lead)
│   │   └── format/                   # Helpers nommés (date.ts…) — jamais un utils.ts
│   │
│   ├── components/
│   │   ├── ui/                       # Primitives shadcn (button, input, dialog…)
│   │   └── shared/                   # Header, Footer, contact flottant, sélecteur de langue
│   │
│   └── app/globals.css               # Tailwind v4
│
├── prisma/                           # Schéma, migrations, seed
├── public/                           # Assets servis PUBLIQUEMENT (images, favicon, og)
├── docs/                             # Documents internes (cahier de charges) — JAMAIS public/
├── ARCHITECTURE.md / CLAUDE.md / AGENTS.md
└── next.config.ts / tsconfig.json / …
```

> ⚠️ **`public/` est servi tel quel sur Internet.** Tout fichier qui s'y trouve est
> téléchargeable par n'importe qui et indexable par Google. Les documents internes
> (cahier de charges, contrats, notes client) vont dans `docs/` à la racine, jamais
> dans `public/`.

### Créer les dossiers à l'usage, pas d'avance

Une feature démarre avec **`services/` + `schemas/` + `components/`**. `actions/` apparaît
à la première soumission de formulaire, `queries/` à la première lecture en base. Un dossier
vide est un mensonge sur la complexité réelle du projet — on ne les crée pas « au cas où ».

### Pourquoi `[lang]` pour le public, mais pas pour l'admin

Le site public est indexé : chaque langue doit avoir **sa propre URL** (`/fr/services`,
`/en/services`) avec ses `canonical` et `hreflang`. C'est le meilleur choix SEO, et c'est
non négociable ici. `proxy.ts` (le middleware — **ne jamais créer `middleware.ts`**) détecte
la locale et redirige `/` vers `/fr` ou `/en`.

L'administration et la connexion ne sont **pas indexées** et n'ont **qu'un seul utilisateur** :
le client. Les localiser doublerait le travail de traduction pour zéro bénéfice. Elles vivent
donc hors de `[lang]`, en français uniquement.

---

## Les 9 règles

1. **`features/X` importe `features/Y` uniquement via `features/Y/index.ts`** (ou
   `features/Y/server.ts` pour le server-only). Les fichiers internes d'une autre feature
   sont privés — le couplage passe par la surface publique, les refactos restent locales.

2. **`app/` reste mince.** Un fichier de route orchestre (params → appelle une query ou
   rend un composant). Aucun SQL, aucune règle métier, aucun schéma Zod dans une route.

3. **La logique métier vit UNIQUEMENT dans `services/`.** Les Server Actions (`actions/`)
   sont des wrappers minces : valider l'entrée avec Zod → appeler un service → formater
   la réponse.

4. **`lib/` n'a aucune dépendance vers `features/`.** C'est une infrastructure feuille :
   tout le monde peut l'importer ; elle n'importe personne de `features/`.

5. **`features/` peut dépendre de `lib/`, jamais l'inverse.**

6. **Pas de `utils.ts` fourre-tout.** Chaque helper vit là où il sert. Si vraiment
   transverse, il va dans un module nommé sous `lib/` (ex. `lib/format/date.ts`).

7. **Chaque feature a un `index.ts` public explicite.** N'y ré-exporter que ce que les
   autres features ou les routes doivent consommer. Le server-only passe par un `server.ts`
   frère (`import 'server-only'` en tête).

8. **Aucune chaîne visible en dur dans le JSX.** Tout passe par le dictionnaire. Ajouter
   une clé dans `fr.json` **ET** `en.json` (parité stricte ; `fr.json` = type de référence).

9. **Un lead ne se perd jamais en silence.** C'est toute la valeur métier du site. Si
   l'écriture en base OU l'envoi d'email échoue, l'échec doit être tracé et le visiteur
   informé — jamais un faux « message envoyé ». Le chemin de secours (au minimum : log
   serveur exploitable) fait partie de la définition de « terminé » pour la feature contact.

---

## Flux d'une requête

**Soumission du formulaire de contact**
```
ContactForm (Client Component, features/contact/components/)
  → submitContactAction (features/contact/actions/)
      → valide avec Zod (features/contact/schemas/) + anti-spam
      → appelle createContactLead (features/contact/services/)
          → écriture Prisma (lib/db/) + notification (lib/email/)
      → retourne un ActionResult { ok } | { error, fields }
  → message de succès, ou erreur affichée (règle 9)
```

**Affichage d'un article de blog (Server Component)**
```
app/[lang]/(public)/blog/[slug]/page.tsx
  → await params → { lang, slug }
  → getPublishedPost(slug, lang) (features/blog/queries/, via features/blog/server.ts)
  → rend l'article + JSON-LD (lib/seo/)
```

**Publication depuis l'admin**
```
app/admin/blog/[id]/page.tsx  → formulaire (features/blog/components/)
  → publishPostAction (features/blog/actions/) → vérifie la session (lib/auth/)
      → publishPost (features/blog/services/) → Prisma
      → revalidatePath('/[lang]/blog', 'page')
```

---

## Où va le nouveau code — table de décision

| Tu ajoutes…                                    | Ça va dans…                                    |
|------------------------------------------------|------------------------------------------------|
| Une page publique bilingue                     | `src/app/[lang]/(public)/...`                  |
| Une page d'administration                      | `src/app/admin/...`                            |
| Un webhook entrant (Calendly…)                 | `src/app/api/webhooks/<fournisseur>/route.ts`  |
| De la logique métier (créer, publier…)         | `features/<nom>/services/`                     |
| Une Server Action (wrapper de formulaire)      | `features/<nom>/actions/`                      |
| Une requête de lecture                         | `features/<nom>/queries/`                      |
| Un schéma Zod de validation                    | `features/<nom>/schemas/`                      |
| Le composant `<ContactForm>`                   | `features/contact/components/`                 |
| Un `<Button>` shadcn générique                 | `components/ui/`                               |
| Le `<Header>`, le sélecteur de langue          | `components/shared/`                           |
| Le singleton Prisma                            | `lib/db/`                                      |
| Une clé de traduction                          | `lib/i18n/dictionaries/fr.json` **et** `en.json` |
| `formatDate(...)`                              | `lib/format/date.ts`                           |
| Un helper de métadonnées / hreflang / JSON-LD  | `lib/seo/`                                     |

---

## Conventions de nommage

- **Fichiers** : `kebab-case.ts` pour les modules, `PascalCase.tsx` pour les composants.
- **Services** : fonctions nommées d'après l'opération — `create-contact-lead.ts` exporte
  `createContactLead(input): Promise<Result>`.
- **Server Actions** : fichier sous `actions/`, `'use server'` en tête.
- **Modules server-only** : `import 'server-only'` en tête de tout fichier qui ne doit jamais
  partir au client (DB, secrets, services, session).
- **Surface publique** : `features/<nom>/index.ts` (client-safe) est la seule porte d'entrée
  depuis l'extérieur ; `server.ts` frère pour le server-only.
- **Params** : `params` et `searchParams` sont des **Promises** → les `await`.

---

## Sécurité du formulaire de contact

Un formulaire public sur un site de génération de leads **sera** ciblé par des bots. Sans
protection, la boîte du client se remplit de spam et les vrais leads se noient — l'échec est
silencieux et coûteux.

Trois protections, à mettre en place dès la feature `contact` (pas après) :

- **Honeypot** : un champ leurre invisible ; s'il est rempli, on rejette sans rien écrire.
- **Rate limiting par IP** sur la Server Action (quelques soumissions par heure suffisent).
- **Validation Zod stricte** côté serveur — la validation client n'est qu'un confort d'UX,
  jamais une barrière.

Aucun secret ne transite par un Client Component ni par une variable `NEXT_PUBLIC_*`.

---

## Tests

La règle 3 (« la logique vit dans `services/` ») n'a de valeur que si cette logique est
réellement testée — sinon c'est un rangement, pas une architecture.

- **Vitest**, tests colocalisés : `services/create-contact-lead.test.ts`.
- **Ce qu'on teste en priorité** : les services (règles métier), les schémas Zod (cas
  limites, entrées hostiles), les helpers `lib/`.
- **Ce qu'on ne teste pas** : le rendu cosmétique des composants.
- Script : `"test": "vitest"`.

---

## Enforcement des règles

Les règles ci-dessus doivent être **vérifiées mécaniquement**, sinon elles dérivent.
À brancher dès la première feature :

```bash
npm install -D dependency-cruiser
```

`.dependency-cruiser.cjs` :

```js
/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "no-deep-cross-feature",
      comment: "Règle 1 : une feature n'importe une autre que via index.ts / server.ts.",
      severity: "error",
      from: { path: "^src/features/([^/]+)/" },
      to: {
        path: "^src/features/([^/]+)/",
        pathNot: ["^src/features/$1/", "^src/features/[^/]+/(index|server)\\.(ts|tsx)$"],
      },
    },
    {
      name: "lib-is-leaf",
      comment: "Règle 4 : lib/ n'importe rien de features/.",
      severity: "error",
      from: { path: "^src/lib/" },
      to: { path: "^src/features/" },
    },
    {
      name: "app-no-service-import",
      comment: "Règles 2/3 : une route passe par action/ ou query/, jamais par services/.",
      severity: "error",
      from: { path: "^src/app/" },
      to: { path: "^src/features/[^/]+/services/" },
    },
    {
      name: "no-circular",
      comment: "Pas de dépendances circulaires.",
      severity: "error",
      from: {},
      to: { circular: true },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    tsConfig: { fileName: "tsconfig.json" },
    tsPreCompilationDeps: true,
  },
};
```

`package.json` : `"scripts": { "arch:check": "depcruise src --config .dependency-cruiser.cjs" }`

---

## Anti-patterns (à refuser en review)

- De la logique métier dans une Server Action — elle appartient à `services/`.
- Des appels Prisma dans `app/.../page.tsx` ou `route.ts`.
- Importer `features/x/services/…` en profondeur depuis une autre feature — passer par
  `index.ts` / `server.ts`.
- Un `src/lib/utils.ts` qui devient un tiroir fourre-tout.
- Une chaîne de texte en dur dans le JSX, ou une clé présente dans `fr.json` mais pas
  dans `en.json`.
- Un document interne déposé dans `public/`.
- Des secrets lus dans un Client Component ou exposés via `NEXT_PUBLIC_*`.
- Un formulaire qui affiche « message envoyé » alors que l'écriture a échoué (règle 9).
- Créer `middleware.ts` — le fichier s'appelle `proxy.ts`.

---

## Décisions encore ouvertes

À trancher avant d'écrire le code concerné — ne rien présumer d'ici là :

- **Base de données** : moteur et hébergement (le déploiement cible est Hostinger, self-host Node).
- **Authentification admin** : implémentation de `lib/auth/`. Un seul compte administrateur
  change beaucoup la réponse par rapport à plusieurs rôles.
- **Nom de l'entreprise, domaine, logo, coordonnées** : non arrêtés. Placeholder explicite
  partout — ne rien inventer.
- **`output: 'standalone'`** dans `next.config.ts` pour Hostinger : à activer tôt, ça se
  teste mal une fois le site terminé.
