# Leads — Plan de travail complet

État au **23 juillet 2026**. Document vivant : on coche, on ajoute, on réordonne.

> **Nature du projet** — à garder en tête à chaque tâche : le site est celui d'une **agence
> qui vend ses services à des PME québécoises** (paysagement, excavation, travaux extérieurs ;
> secondairement construction, rénovation, commerces locaux). C'est du **B2B** : les visiteurs
> sont des **dirigeants de PME de 1 à 20 employés**, pas des particuliers. Toute tâche qui
> présuppose l'inverse est une erreur à corriger.

**Légende**
`[ ]` à faire · `[x]` fait · `🔒` bloqué par une décision client · `⚙️` technique · `🎨` design · `✍️` contenu · `🔍` SEO

---

## Où on en est vraiment

**Fait**
- [x] Next.js 16.2.11 initialisé (App Router, React Compiler, Tailwind v4, TS strict)
- [x] 0 vulnérabilité (overrides `postcss` / `sharp`), Node 26 LTS, npm 12
- [x] `ARCHITECTURE.md` dimensionné pour un site vitrine + `CLAUDE.md` aligné
- [x] Dépôt git propre à la racine du projet, poussé sur GitHub
- [x] Police Montserrat en place (bug `font-family: Arial` du scaffold corrigé)
- [x] Skill `design-brief` + agent `design-lead` + `ui-ux-pro-max` disponibles

**Réalité du code** : 3 fichiers dans `src/` (`layout.tsx`, `page.tsx`, `globals.css`), tous
encore au contenu du scaffold. **Aucune page réelle n'existe.** Le site est à zéro.

---

# PHASE 0 — Décisions bloquantes 🔒

Rien de sérieux ne se construit avant. Chaque jour de retard ici bloque plusieurs
tâches en aval.

## 0.1 — Identité de marque

- [ ] **T0.1** 🔒 Arrêter le **nom de l'entreprise**
  *Processus* : session de naming, 15–20 candidats classés par axe (évocateur / descriptif /
  abstrait), filtrés sur disponibilité du `.ca` et du `.com`, prononçabilité en français
  **et** en anglais, absence de collision avec un concurrent québécois.
  *Bloque* : domaine, logo, courriels, métadonnées, JSON-LD, OG, tout le contenu.
- [ ] **T0.2** 🔒 Vérifier la disponibilité du **nom de domaine** + le réserver
- [ ] **T0.3** 🔒 Vérifier la disponibilité du nom au **registre des entreprises du Québec**
- [ ] **T0.4** 🔒 Valider le **logo** (voir T2.2 pour les pistes de conception)

## 0.2 — Informations d'entreprise

- [ ] **T0.5** 🔒 Coordonnées : téléphone, courriel, adresse (ou « sur rendez-vous »)
- [ ] **T0.6** 🔒 **Zone desservie** précise (villes / rayon) — capital pour le SEO local
- [ ] **T0.7** 🔒 Heures d'ouverture
- [ ] **T0.8** 🔒 Preuves de crédibilité disponibles : certifications, partenariats,
      appartenance à une association, garanties offertes
- [ ] **T0.9** 🔒 Liste réelle des **services** offerts, avec le vocabulaire du client —
      formulée du point de vue du dirigeant de PME, pas en jargon d'agence
- [ ] **T0.10** 🔒 Comptes réseaux sociaux existants + numéro **WhatsApp** professionnel
- [ ] **T0.11** 🔒 Compte **Calendly** + types de rendez-vous à proposer

## 0.3 — Matière première

- [ ] **T0.12** 🔒 **Preuve d'exécution** — le poste le plus déterminant du projet.
  Une agence se juge sur ce qu'elle a livré : réalisations concrètes, cas clients,
  résultats obtenus. C'est ce qui remplace les « photos de chantier » d'une entreprise
  de terrain. Sans preuve, il ne reste que des promesses — et le dirigeant de PME s'en
  méfie par expérience. Si rien n'est présentable, concevoir un design qui **tient debout
  sans preuve sociale** plutôt que d'en simuler une.
- [ ] **T0.13** 🔒 **Témoignages** clients réels (avec autorisation écrite)
- [ ] **T0.14** 🔒 Chiffres vérifiables : années d'activité, clients servis, résultats mesurés
- [ ] **T0.15** 🔒 Visuels de l'équipe / des bureaux — l'humain rassure en B2B de proximité
- [ ] **T0.16** 🔒 Logos de partenaires / certifications, si autorisés

## 0.4 — Décisions techniques ouvertes

- [ ] **T0.17** ⚙️ Choix de la **base de données** (hébergement Hostinger, self-host Node)
- [ ] **T0.18** ⚙️ Implémentation de `lib/auth/` — un seul compte admin ou plusieurs rôles ?
- [ ] **T0.19** ⚙️ Fournisseur d'**envoi de courriel** pour les notifications de lead
- [ ] **T0.20** ⚙️ **Analytique** : quel outil, et conformité Loi 25 (Québec)

---

# PHASE 1 — Fondations techniques ⚙️

Peut démarrer immédiatement, sans attendre la phase 0.

- [ ] **T1.1** Nettoyer le scaffold : `metadata` (« Create Next App »), `lang="en"` en dur,
      `page.tsx` de démonstration, SVG Vercel/Next inutilisés dans `public/`
- [ ] **T1.2** `lib/i18n/` : `config.ts` (locales, défaut FR), `dictionaries/{fr,en}.json`,
      `getDictionary(lang)` typé sur `fr.json`
- [ ] **T1.3** `proxy.ts` : détection de locale + redirection `/` → `/fr` ou `/en`
      *(jamais `middleware.ts`)*
- [ ] **T1.4** Structure `app/[lang]/(public)/` + `layout.tsx` racine par langue
      (`<html lang={lang}>`, dictionnaire, Header, Footer)
- [ ] **T1.5** `generateStaticParams` pour les deux locales
- [ ] **T1.6** `src/config/site.ts` — source unique des infos d'entreprise
      *(référencé par `design-lead`, n'existe pas encore ; placeholders explicites jusqu'à T0.5)*
- [ ] **T1.7** `lib/env.ts` — variables d'environnement typées via Zod
- [ ] **T1.8** Initialiser **shadcn/ui** + `lucide-react`
- [ ] **T1.9** Tokens Tailwind v4 dans `globals.css` (palette, échelle typo, rayons, ombres)
- [ ] **T1.10** `error.tsx`, `not-found.tsx`, `loading.tsx` par segment
- [ ] **T1.11** `output: 'standalone'` dans `next.config.ts` — **à faire tôt**, ça se teste
      mal une fois le site fini
- [ ] **T1.12** `dependency-cruiser` + script `arch:check` (les 4 règles d'`ARCHITECTURE.md`)
- [ ] **T1.13** **Vitest** + premier test de service
- [ ] **T1.14** Pré-commit : lint + type-check + `arch:check`

---

# PHASE 2 — Identité visuelle 🎨

## 2.1 — Direction artistique

- [ ] **T2.1** Session `design-lead` : palette (4–6 verts nommés + neutres), appariement
      typographique (Montserrat en titrage + une police de texte pour les paragraphes —
      voir la réserve notée lors de son installation), échelle typo, concept de layout,
      et surtout l'**élément signature** mémorable
- [ ] **T2.2** 🔒 **Logo** : 3 pistes contrastées, déclinaisons (couleur / mono / favicon /
      fond sombre), formats SVG + PNG. Dépend de T0.1.
- [ ] **T2.3** Favicon complet (`icon.svg`, `apple-icon.png`, `manifest`)
- [ ] **T2.4** Système de composants : boutons, cartes, champs, badges — états hover/focus/actif
- [ ] **T2.5** Bibliothèque de mouvement : révélations au défilement, micro-interactions,
      transitions de page — **toutes** sous `prefers-reduced-motion`
- [ ] **T2.6** Traitement d'image : ratios, recadrages, superpositions, style de galerie

## 2.2 — Composants transverses

- [ ] **T2.7** `Header` : navigation, sélecteur de langue, CTA d'appel, menu mobile
- [ ] **T2.8** `Footer` : coordonnées, plan du site, réseaux, mentions légales
- [ ] **T2.9** **Module de contact flottant** : appel · WhatsApp · RDV (comportement mobile
      à soigner — c'est le premier levier de conversion sur téléphone)
- [ ] **T2.10** Sélecteur de langue qui **conserve la page courante** (`/fr/services` ↔ `/en/services`)

---

# PHASE 3 — Contenu ✍️

> Règle absolue : **aucun texte inventé sur l'entreprise.** Tant qu'une info manque,
> placeholder visible — jamais un faux témoignage ni un chiffre plausible.

- [ ] **T3.1** 🔒 Rédiger la copie **FR** des 6 pages (orientée conversion, pas descriptive)
- [ ] **T3.2** Traduire en **EN** — traduction professionnelle, pas littérale ; l'anglais
      québécois d'affaires a ses codes
- [ ] **T3.3** Parité stricte des clés `fr.json` / `en.json` (+ test automatisé)
- [ ] **T3.4** Micro-copie : boutons, messages d'erreur, confirmations, états vides
- [ ] **T3.5** 🔒 Traiter les photos : recadrage, WebP/AVIF, tailles responsives, **alt** bilingue
- [ ] **T3.6** Images Open Graph par page (1200×630), bilingues
- [ ] **T3.7** ⚖️ Pages légales : politique de confidentialité, cookies, **conformité Loi 25**
      *(le Québec impose des obligations précises sur les renseignements personnels —
      un formulaire de contact en collecte)*

---

# PHASE 4 — Pages

Chaque page suit le même cycle : `/design-brief` → `design-lead` → implémentation →
critique → a11y → responsive.

- [ ] **T4.1** **Accueil** — hero signature, preuve de valeur, services en aperçu,
      réalisations, preuve sociale, CTA multiples. La page qui porte l'effet « wow ».
- [ ] **T4.2** **Services** — page index + détail par service (structure SEO décisive)
- [ ] **T4.3** **À propos** — histoire, équipe, valeurs, certifications. Page de confiance.
- [ ] **T4.4** **Contact** — formulaire + Calendly intégré + carte + accès rapides
- [ ] **T4.5** **FAQ** — questions réelles des clients (+ JSON-LD `FAQPage`)
- [ ] **T4.6** **Blog** — index, pagination, article, catégories
- [ ] **T4.7** **404 / 500** soignées et bilingues
- [ ] **T4.8** *(plus tard)* Portfolio / réalisations
- [ ] **T4.9** *(plus tard)* Témoignages

---

# PHASE 5 — Fonctionnalités

## 5.1 — Capture de leads (le cœur du projet)

- [ ] **T5.1** `features/contact/` : schéma Zod, service, Server Action
- [ ] **T5.2** **Anti-spam** : honeypot + limitation de débit par IP + validation serveur
- [ ] **T5.3** Notification par courriel au client à chaque lead
- [ ] **T5.4** **Règle 9** : aucun lead perdu en silence — si l'écriture ou l'envoi échoue,
      trace exploitable et message honnête au visiteur, jamais un faux « message envoyé »
- [ ] **T5.5** Page/écran de remerciement + événement de conversion
- [ ] **T5.6** Intégration **Calendly** (chargement différé — ne pas plomber le LCP)
- [ ] **T5.7** Webhook Calendly → enregistrement du RDV *(optionnel)*
- [ ] **T5.8** Liens **WhatsApp** avec message pré-rempli, bilingues

## 5.2 — Blog administrable

- [ ] **T5.9** ⚙️ Schéma Prisma : `Post`, `Category`, `User`, `Lead`
- [ ] **T5.10** ⚙️ Migrations + seed
- [ ] **T5.11** ⚙️ `lib/auth/` — session admin (dépend de T0.17)
- [ ] **T5.12** `app/(auth)/` — connexion, protection contre le bourrage d'identifiants
- [ ] **T5.13** `app/admin/` — liste, création, édition, publication d'articles
- [ ] **T5.14** Éditeur de contenu + téléversement d'images
- [ ] **T5.15** Gestion des **traductions d'articles** (un article FR ↔ son équivalent EN)
- [ ] **T5.16** `app/admin/leads/` — consultation des demandes reçues
- [ ] **T5.17** Revalidation à la publication (`revalidatePath` / `revalidateTag`)

---

# PHASE 6 — SEO 🔍

Prévu « ambitieux dès le départ » : donc en parallèle des pages, pas après.

- [ ] **T6.1** `lib/seo/` : helpers de métadonnées par page et par langue
- [ ] **T6.2** **Canonical + hreflang** FR/EN + `x-default` — *le piège n°1 d'un site bilingue*
- [ ] **T6.3** `sitemap.ts` dynamique (pages + articles, les deux langues)
- [ ] **T6.4** `robots.ts` — bloquer `/admin`, `/api`, autoriser le reste
- [ ] **T6.5** JSON-LD : `LocalBusiness`, `Service`, `BreadcrumbList`, `FAQPage`, `BlogPosting`
- [ ] **T6.6** Open Graph + Twitter Card par page
- [ ] **T6.7** **SEO local** : cohérence NAP, page de zone desservie, Google Business Profile
- [ ] **T6.8** Recherche de mots-clés FR québécois **B2B** — les requêtes d'un dirigeant de
      PME qui cherche un prestataire, pas celles de ses propres clients. Le vocabulaire
      québécois prime sur le français de France, et l'intention commerciale prime sur le
      volume : peu de recherches très qualifiées valent mieux que l'inverse.
- [ ] **T6.9** Maillage interne pensé (services ↔ blog ↔ contact)
- [ ] **T6.10** Search Console + sitemap soumis + suivi d'indexation
- [ ] **T6.11** Audit final avec les agents `claude-seo` disponibles

---

# PHASE 7 — Qualité

- [ ] **T7.1** **A11y** : contraste ≥ 4.5:1, focus visibles, cibles ≥ 44px, navigation
      clavier complète, lecteur d'écran, `prefers-reduced-motion`
- [ ] **T7.2** Responsive vérifié à 375 / 768 / 1024 / 1440
- [ ] **T7.3** **Core Web Vitals** : LCP < 2,5 s · INP < 200 ms · CLS < 0,1
- [ ] **T7.4** Optimisation des images (`next/image`, tailles, `priority` sur le hero)
- [ ] **T7.5** Budget de bundle — surveiller le poids du JS client
- [ ] **T7.6** Tests des services + schémas + parité des dictionnaires
- [ ] **T7.7** Test manuel du parcours de conversion, sur vrai téléphone
- [ ] **T7.8** Compatibilité navigateurs (Safari iOS inclus — souvent le maillon faible)

---

# PHASE 8 — Déploiement

- [ ] **T8.1** ⚙️ Build `standalone` validé localement
- [ ] **T8.2** ⚙️ Serveur Hostinger : Node, process manager, redémarrage automatique
- [ ] **T8.3** ⚙️ Base de données en production + sauvegardes **testées** (une sauvegarde
      jamais restaurée n'est pas une sauvegarde)
- [ ] **T8.4** ⚙️ Variables d'environnement de production
- [ ] **T8.5** 🔒 Domaine + DNS + certificat HTTPS
- [ ] **T8.6** ⚙️ Redirections `www` ↔ apex, HTTP → HTTPS
- [ ] **T8.7** ⚙️ En-têtes de sécurité (CSP, HSTS, X-Frame-Options)
- [ ] **T8.8** ⚙️ Courriels professionnels sur le domaine
- [ ] **T8.9** ⚙️ Supervision : disponibilité + alerte en cas d'erreur
- [ ] **T8.10** ✍️ Guide d'utilisation de l'admin, remis au client

---

# PHASE 9 — Après lancement

- [ ] **T9.1** Suivi des positions et du trafic
- [ ] **T9.2** Suivi du **taux de conversion** — c'est la seule métrique qui juge ce projet
- [ ] **T9.3** Publication régulière d'articles
- [ ] **T9.4** Mises à jour de dépendances et de sécurité
- [ ] **T9.5** Itérations d'optimisation selon les données réelles

---

## Chemin critique

```
T0.1 (nom) ─→ T0.2 (domaine) ─→ T2.2 (logo) ─→ T4.1 (accueil) ─→ T8.5 (mise en ligne)
                                    ↑
T0.12 (preuve d'exécution) ─────────┘   ← le vrai goulot d'étranglement
```

**Ce qui peut avancer dès maintenant, sans aucune décision client :**
toute la **phase 1**, plus T2.1 (direction artistique sur placeholders), T1.12, T1.13.

**Ce qui déterminera la qualité perçue du résultat final**, par ordre d'impact :
la preuve d'exécution (T0.12) · l'élément signature (T2.1) · la copie orientée conversion
dans le vocabulaire du dirigeant (T3.1) · la vitesse de la page d'accueil sur mobile (T7.3).

---

## Risques identifiés

| Risque | Impact | Parade |
|---|---|---|
| Aucune preuve d'exécution à montrer | Une agence sans réalisations n'a que des promesses | Design qui tient sans preuve sociale — jamais de fausse preuve |
| Visuels de banque d'images | Détruit le positionnement premium | Visuels sur mesure, ou direction assumant peu d'images |
| Discours d'agence interchangeable | Le dirigeant décroche en 5 secondes | Copie concrète, dans SON vocabulaire, pas en jargon |
| Nom non arrêté qui traîne | Bloque logo, domaine, contenu, SEO | Session de naming en priorité absolue |
| Admin maison à maintenir | Charge récurrente pendant des années | Périmètre minimal, aucune sur-fonctionnalité |
| Blog jamais alimenté | Le SEO ne décolle pas | Cadence réaliste convenue à l'avance |
| Loi 25 négligée | Risque légal réel au Québec | Traiter T3.7 avant la mise en ligne |
| Formulaire spammé | Les vrais leads se noient | T5.2 dès la première version |
