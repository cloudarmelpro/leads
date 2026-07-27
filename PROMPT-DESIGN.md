# Prompt de design — à copier dans Claude (claude.ai)

> Tout ce qui suit la ligne de séparation se copie-colle tel quel.
> Les blocs `⚠️` marquent ce qui n'est pas encore arrêté : ne jamais les combler par
> une invention, ni ici, ni dans le design.

---

Tu es directeur artistique dans un studio réputé pour donner à chaque client une identité
visuelle qu'on ne peut confondre avec aucune autre. Ce client a déjà rejeté des propositions
qui « sentaient le template ». Il paie pour un point de vue affirmé.

# LE PROJET

Site vitrine **bilingue français / anglais**, marché **québécois**, dont l'objectif unique
et mesurable est la **génération de leads** : plus d'appels téléphoniques, plus de rendez-vous
pris en ligne, plus de ventes. Le site doit produire un **fort effet « wow »** qui pousse à
l'action — la beauté ici n'est pas décorative, c'est un levier de conversion.

## L'entreprise

Une **agence** qui vend ses services à des **PME québécoises**. Positionnement **premium**,
exécution soignée, image haut de gamme — **jamais** l'argument du prix bas.

⚠️ **Nom de l'entreprise : non arrêté.** Utiliser un placeholder visible et assumé
(ex. `[NOM]`), jamais un nom inventé. Le design doit rester crédible avec un logotype
neutre, et le concept ne doit pas dépendre d'un jeu de mots sur un nom qui n'existe pas.

⚠️ **Logo : inexistant.** Prévoir l'emplacement, proposer un traitement typographique de
substitution, mais ne pas dessiner de logo définitif.

⚠️ **Liste exacte des services : à confirmer.** Traiter comme un bloc de 3 à 5 offres
génériques nommées `[SERVICE 1]`… et concevoir une structure qui accueillera le vrai contenu.

⚠️ **Coordonnées, témoignages, chiffres, logos clients, années d'expérience : aucun n'est
disponible.** Ne rien fabriquer. Là où le design appelle une preuve sociale, montrer le
composant avec un placeholder explicite — surtout pas un faux témoignage ni un « +250 clients
satisfaits » inventé. Un design qui s'effondre sans preuve sociale est un design à revoir :
prévoir une version qui tient debout sans elle.

## Le visiteur — à qui on parle vraiment

Un **dirigeant de PME québécoise de 1 à 20 employés**. Concrètement :

- **Cœur de cible** : services extérieurs — paysagement, excavation, travaux extérieurs.
- **Secondaire** : construction, rénovation, commerces locaux, barbershops, petits restaurants.
- C'est quelqu'un de **terrain**, pas un acheteur corporatif. Il dirige et travaille en même temps.
- Il a **très peu de temps**, consulte souvent **depuis son téléphone**, entre deux tâches.
- Il se **méfie du jargon** et des promesses creuses. Il a possiblement déjà été déçu par un
  prestataire qui a beaucoup parlé et peu livré.
- Ce qu'il veut savoir en **5 secondes** : *qu'est-ce que vous faites, est-ce que c'est sérieux,
  et combien ça va me coûter de temps ?*
- Ce qui le convainc : la **preuve d'exécution**, la clarté, le sentiment de parler à quelqu'un
  de compétent — pas des superlatifs.

**Conséquence de design non négociable** : l'expérience **mobile prime**. Si un choix
esthétique fonctionne sur grand écran mais alourdit le mobile, il est écarté.

## L'action visée

**Une seule priorité** : provoquer la prise de contact. Trois chemins, par ordre d'importance :

1. **L'appel téléphonique** — le plus direct, et le réflexe de cette clientèle.
2. **La prise de rendez-vous en ligne** (Calendly intégré).
3. **Le formulaire de contact**.

Plus un accès rapide **WhatsApp** (et possiblement Messenger). Un **module de contact
flottant** est prévu : à concevoir avec soin, c'est le principal levier de conversion sur mobile.

⚠️ Les CTA secondaires ne doivent **jamais** concurrencer visuellement le CTA principal.
Deux appels à l'action de force égale, c'est zéro conversion.

## Les émotions à provoquer

**Confiance · sérieux · qualité · professionnalisme.**

Et ce qu'il ne doit **surtout pas** ressentir : l'impression d'une agence qui fait du volume,
d'un template acheté, d'un discours interchangeable, ou d'un prestataire cher parce que
bavard plutôt que compétent.

# DIRECTION VISUELLE

## Imposé

- **Couleur principale : le vert.** C'est la couleur de marque, non négociable. Mais il faut
  un vert **premium, moderne, corporate, technologique** — surtout pas le vert « écolo /
  nature / bio » plat et attendu. Le décliner en un système crédible : le vert doit sembler
  *choisi*, pas subi.
- **Univers** : premium · moderne · corporate · technologique · luxe.
- **Typographie** : **Montserrat** est déjà en place dans le projet. C'est une géométrique
  excellente en titrage — larges capitales, forte présence — mais large et fatigante sur des
  paragraphes longs. **Recommandation attendue de ta part** : soit tu la gardes partout en
  justifiant comment tu règles la lisibilité du corps de texte, soit tu proposes une seconde
  police de texte qui la complète. Argumente ton choix.
- **Le mouvement fait partie du produit** : animations soignées, transitions, révélations au
  défilement, micro-interactions. C'est un levier de conversion, pas de la décoration.
  **Impératif** : tout doit être neutralisé sous `prefers-reduced-motion`.

## Anti-objectifs — ce qui sera refusé

Cette section vaut autant que tout le reste. À éviter absolument :

- Le **hero centré** avec gros titre, sous-titre, deux boutons et une tache de dégradé floue.
- Les **trois cartes à icônes** alignées pour présenter les services.
- La bande « **Ils nous font confiance** » avec des logos en niveaux de gris — d'autant qu'ici
  il n'y a aucun logo client à montrer.
- Les dégradés **violet/indigo** du SaaS générique.
- Les **compteurs animés** de statistiques inventées.
- Les marqueurs numérotés **01 / 02 / 03** quand le contenu n'est pas réellement une séquence.
- Les **emoji en guise d'icônes** (le projet utilise lucide-react).
- Les trois défauts vers lesquels converge le design généré par IA :
  1. fond crème (~#F4F1EA) + serif à fort contraste + accent terracotta ;
  2. fond quasi noir + un seul accent vert acide ou vermillon ;
  3. mise en page « journal » avec filets fins, angles droits et colonnes denses.

Si une partie de ta proposition ressemble à ce que tu produirais pour n'importe quel autre
brief similaire, révise-la et explique ce que tu as changé et pourquoi.

## L'élément signature

Le site doit posséder **un élément mémorable** — un moment, une interaction, un traitement
visuel — qui incarne le positionnement et qu'on ne trouve nulle part ailleurs. C'est lui qui
porte l'effet « wow ». Sans lui, la proposition est incomplète.

# LE SITE

## Pages au lancement

| Page | Sa mission unique |
|---|---|
| **Accueil** | Convaincre en 5 secondes et pousser au contact — c'est elle qui porte le « wow » |
| **Services** | Montrer ce qu'on fait concrètement, sans jargon |
| **À propos** | Établir la confiance : qui on est, comment on travaille |
| **Contact** | Réduire au maximum la friction de la prise de contact |
| **Blog** | Autorité et acquisition SEO dans la durée |
| **FAQ** | Lever les objections avant qu'elles ne bloquent |

Plus tard : Portfolio · Témoignages.

## Priorité absolue : la page d'accueil

C'est elle qu'il faut concevoir en premier et le plus finement. Pour chaque section,
je veux savoir **quel travail elle accomplit** dans le parcours de conversion — pas seulement
à quoi elle ressemble. Une section qui ne fait pas avancer vers le contact doit disparaître.

## Composants transverses

- **En-tête** : navigation, sélecteur de langue FR/EN, CTA d'appel toujours visible, menu mobile
- **Pied de page** : coordonnées, plan du site, réseaux sociaux, mentions légales
- **Module de contact flottant** : appel · WhatsApp · rendez-vous

# CONTRAINTES TECHNIQUES

Le code que tu produis sera **porté dans un projet Next.js 16**. Il doit donc être conçu
pour se transplanter proprement.

**Stack de destination** : Next.js 16 (App Router, React Compiler) · React 19 ·
TypeScript strict · Tailwind CSS v4 · shadcn/ui · lucide-react.

**Règles pour que le portage soit indolore :**

1. **React + Tailwind uniquement.** Aucune bibliothèque externe hormis `lucide-react`.
2. **Toutes les couleurs en variables CSS** (`--color-...`) déclarées en un seul endroit —
   elles seront transposées dans le `@theme` de Tailwind v4.
3. **Aucun texte en dur dans le JSX.** Tout le contenu rédactionnel dans un **objet
   `content` unique** en haut de fichier. Le site est bilingue : cette séparation rend
   l'extraction des dictionnaires FR/EN immédiate. C'est un point important, pas un détail.
4. **Pas de `next/image` ni `next/font`** — utilise `<img>` et une police web standard,
   je ferai la conversion. Mais **prévois les ratios et les tailles** comme si les images
   étaient optimisées.
5. **Composants découpés par section**, autonomes, faciles à déplacer un par un.
6. **Animations en CSS** autant que possible plutôt qu'en JavaScript, et **toutes** sous
   `@media (prefers-reduced-motion: reduce)`.
7. Marque explicitement où le contenu réel devra être injecté.

# MOBILE D'ABORD — LA CONTRAINTE STRUCTURANTE

Ce n'est pas une case à cocher en fin de parcours, c'est le **point de départ de la
conception**. La majorité des visiteurs arriveront sur un téléphone, souvent en 4G, souvent
entre deux tâches. **Conçois la version 375 px en premier**, puis élargis — jamais l'inverse.
Un design pensé pour grand écran puis rétréci se reconnaît immédiatement, et c'est exactement
ce qu'il faut éviter ici.

## Règles concrètes

- **Aucun défilement horizontal** à 375 px, nulle part, dans les deux langues.
- **Aucune interaction dépendant du survol.** Le tactile n'a pas de `hover` : tout ce qui se
  révèle au survol doit avoir un équivalent au toucher, ou disparaître. C'est l'erreur la plus
  fréquente des designs « riches ».
- **Cibles tactiles ≥ 44 px**, avec un espacement suffisant pour éviter les touches accidentelles.
- **Zone du pouce** : sur un téléphone tenu à une main, le haut de l'écran est difficile à
  atteindre. Les actions principales — appeler, prendre rendez-vous — doivent tomber dans la
  moitié basse, ou rester accessibles via le module flottant.
- **Le CTA d'appel doit être atteignable en un seul geste**, à tout moment, sans avoir à
  remonter en haut de page.
- **Taille de texte minimale 16 px** pour le corps — en dessous, iOS zoome automatiquement
  sur les champs de formulaire, ce qui casse la mise en page.
- **Poids et performance** : la page d'accueil doit rester rapide sur un réseau mobile
  moyen. Un effet spectaculaire qui coûte deux secondes de chargement fait perdre plus de
  leads qu'il n'en gagne.
- **Menu mobile** : conçois-le vraiment, ne te contente pas d'un « hamburger → liste ».
  C'est un écran à part entière et un point de conversion.
- **Module de contact flottant** : décris précisément son comportement sur mobile — état
  au repos, état déployé, ce qu'il masque, comment on le referme. C'est le premier levier
  de conversion du site.

## Le pire cas à tester mentalement

**Écran de 375 px + texte français** (15 à 20 % plus long que l'anglais). Si tes titres et
tes boutons tiennent dans cette combinaison, ils tiendront partout. Vérifie-le explicitement
sur le titre du hero et sur les libellés de CTA.

## Ce que je veux voir livré

- **Deux wireframes ASCII** de la page d'accueil : **mobile 375 px** et **desktop**.
  Le mobile en premier.
- Pour chaque section, **ce qui change entre les deux** — pas « ça s'empile », mais quelles
  décisions de hiérarchie tu prends quand la largeur disparaît : qu'est-ce qui est promu,
  rétrogradé, fusionné ou supprimé.
- Le code doit être **responsive de bout en bout**, testé mentalement à 375 / 768 / 1024 / 1440.

# ACCESSIBILITÉ — NON NÉGOCIABLE

- Contraste **≥ 4.5:1** sur tout texte. À vérifier réellement, notamment blanc sur vert :
  c'est le piège classique d'une charte verte, la plupart des verts de marque échouent.
- **Focus clavier visibles** et esthétiques, jamais supprimés.
- **Cibles tactiles ≥ 44 px** — public majoritairement mobile.
- Navigation clavier complète, HTML sémantique, hiérarchie de titres correcte.
- Responsive vérifié à **375 / 768 / 1024 / 1440**.

# BILINGUE

Français et anglais à parité. Le **français est la langue de référence** (marché québécois).
Attention : le français est en moyenne **15 à 20 % plus long** que l'anglais — une mise en
page calée au pixel sur un titre anglais casse en français. Concevoir avec cette élasticité,
et tester mentalement les deux longueurs sur les titres et les boutons.

# CE QUE J'ATTENDS DE TOI

**Dans l'ordre, et sans sauter d'étape :**

**1. Un plan de design compact, AVANT tout code**
- **Couleur** : 4 à 6 valeurs hexadécimales nommées, ancrées sur le vert, avec les ratios
  de contraste vérifiés
- **Typographie** : les polices et leurs rôles, l'échelle typographique, les graisses
- **Layout** : le concept en une phrase + **deux wireframes ASCII** de la page d'accueil —
  mobile 375 px d'abord, desktop ensuite — et ce qui change entre les deux
- **Signature** : l'élément unique dont on se souviendra, et pourquoi il colle à ce brief

**2. Ta propre critique de ce plan**
Passe-le au crible des anti-objectifs ci-dessus. Ce qui ressemble à un défaut générique,
tu le révises et tu expliques le changement. Sois dur.

**3. Seulement ensuite, le code**
La page d'accueil complète, en suivant le plan révisé à la lettre, chaque couleur et chaque
choix typographique dérivant de lui.

**4. Pour chaque section : sa justification de conversion**
Une phrase par section : quel travail elle fait pour amener au contact.

# CRITÈRE DE RÉUSSITE

Un dirigeant de PME québécoise, sur son téléphone, entre deux tâches, doit comprendre en
**5 secondes** ce qu'on fait et pourquoi c'est sérieux — et trouver comment appeler **en un
seul geste**.

Tout le reste, y compris la beauté du site, est subordonné à ça.
