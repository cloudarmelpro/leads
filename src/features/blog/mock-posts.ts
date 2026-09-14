import { site } from "@/config/site";
import type { Locale } from "@/lib/i18n/config";

/**
 * Source des articles du blog : les six sujets de la maquette « Talgasy Web - Blog »,
 * publiés à la demande du client (2026-09-15). Les corps des cinq articles secondaires
 * sont des rédactions à valider — la maquette n'en fournissait que le titre et l'extrait.
 * Les pages n'appellent QUE les helpers ci-dessous ; pour brancher la vraie source
 * (BD + admin), remplacer `POSTS`.
 */

export type Block =
  | { type: "p" | "h" | "quote"; text: string }
  | { type: "ul"; items: string[] };

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
  author: { name: string };
  /** Chemin public de la couverture 16:9. */
  cover: string;
  fr: PostContent;
  en: PostContent;
};

export type Post = Omit<RawPost, "fr" | "en"> & PostContent;

// Aucun auteur nommé n'est confirmé par le client : l'entreprise signe.
const AUTEUR = { name: site.name };

const POSTS: RawPost[] = [
  {
    slug: "pourquoi-votre-site-ne-fait-pas-sonner-le-telephone",
    date: "2026-09-12",
    readMinutes: 6,
    author: AUTEUR,
    cover: "/images/home/sector-commerce.jpg",
    fr: {
      category: "Conversion",
      title: "Pourquoi votre site ne fait pas sonner le téléphone",
      excerpt:
        "Un beau site qui ne génère aucun appel a un problème de structure, pas de design. Les quatre éléments qui transforment une visite en soumission.",
      body: [
        { type: "p", text: "La plupart des entrepreneurs qui nous appellent ont déjà un site. Il est souvent récent, parfois joli, et il ne rapporte rien. Le réflexe est de blâmer le design. Dans la quasi-totalité des cas, le problème est ailleurs : le site ne dit pas assez vite ce qu’il faut, et il ne demande jamais rien." },
        { type: "p", text: "Un visiteur arrive sur votre page d’accueil avec une question précise en tête. Est-ce que cette entreprise fait ce que je cherche, est-ce qu’elle travaille dans ma région, est-ce qu’elle a l’air sérieuse, et comment je la joins. Il vous donne cinq secondes pour répondre aux quatre." },
        { type: "h", text: "1. Le métier, pas le slogan" },
        { type: "p", text: "« Votre partenaire de confiance depuis 2011 » ne dit rien à personne. « Terrassement, drainage et fondations, à Québec et sur la Rive-Sud » répond à deux des quatre questions en une ligne. Nommez le service et le territoire dans le premier écran, avant toute autre chose." },
        { type: "h", text: "2. Une seule action, visible sans défiler" },
        { type: "p", text: "Trois boutons de même poids visuel, c’est zéro conversion : le visiteur choisit de ne rien faire. Décidez de l’action qui compte — presque toujours l’appel — et donnez-lui un bouton unique, en haut, et répété au bas de chaque page." },
        {
          type: "ul",
          items: [
            "Le numéro cliquable, pas écrit en texte plat.",
            "Un formulaire court : nom, moyen de vous joindre, besoin. Rien d’autre.",
            "Le même appel à l’action partout, formulé de la même façon.",
          ],
        },
        { type: "h", text: "3. Des preuves, pas des adjectifs" },
        { type: "p", text: "« Qualité », « professionnalisme » et « satisfaction garantie » sont sur tous les sites du secteur, donc ils ne distinguent rien. Ce qui convainc, ce sont vos vraies photos de chantier, le nombre d’années, les villes desservies, et un délai de réponse que vous tenez." },
        { type: "quote", text: "Une photo de votre équipe sur un chantier vaut mieux que dix lignes sur votre engagement." },
        { type: "h", text: "4. Le mobile d’abord, vraiment" },
        { type: "p", text: "Plus de sept visiteurs sur dix arrivent d’un téléphone, souvent entre deux tâches. Si le numéro n’est pas atteignable au pouce, si le texte force à zoomer, si la page met quatre secondes à s’afficher sur un réseau moyen, l’appel n’a pas lieu. Ce n’est pas un détail technique, c’est la moitié de votre trafic." },
        { type: "h", text: "Ce que ça donne" },
        { type: "p", text: "Aucun de ces quatre points ne demande de refaire le site au complet. Dans la moitié des refontes qu’on mène, ce sont les seules choses qu’on change, et le téléphone recommence à sonner dans les semaines qui suivent. Si vous voulez savoir lequel des quatre manque sur votre site, on peut le regarder ensemble en un appel." },
      ],
    },
    en: {
      category: "Conversion",
      title: "Why your website doesn’t make the phone ring",
      excerpt:
        "A good-looking site that generates no calls has a structure problem, not a design problem. The four elements that turn a visit into a quote request.",
      body: [
        { type: "p", text: "Most business owners who call us already have a website. It is often recent, sometimes attractive, and it brings in nothing. The reflex is to blame the design. In almost every case, the problem lies elsewhere: the site doesn’t say what matters fast enough, and it never asks for anything." },
        { type: "p", text: "A visitor lands on your home page with a precise question in mind. Does this company do what I need, does it work in my area, does it look serious, and how do I reach it. They give you five seconds to answer all four." },
        { type: "h", text: "1. The trade, not the slogan" },
        { type: "p", text: "“Your trusted partner since 2011” tells nobody anything. “Excavation, drainage and foundations in Québec City and the South Shore” answers two of the four questions in one line. Name the service and the territory in the first screen, before anything else." },
        { type: "h", text: "2. One action, visible without scrolling" },
        { type: "p", text: "Three buttons of equal visual weight means zero conversion: the visitor chooses to do nothing. Decide which action matters — almost always the call — and give it a single button, at the top, repeated at the bottom of every page." },
        {
          type: "ul",
          items: [
            "A tappable phone number, not plain text.",
            "A short form: name, how to reach you, what you need. Nothing else.",
            "The same call to action everywhere, worded the same way.",
          ],
        },
        { type: "h", text: "3. Proof, not adjectives" },
        { type: "p", text: "“Quality”, “professionalism” and “satisfaction guaranteed” are on every site in the industry, so they set nothing apart. What convinces is your real job-site photos, your years in business, the cities you serve, and a response time you actually keep." },
        { type: "quote", text: "One photo of your crew on a job site is worth more than ten lines about your commitment." },
        { type: "h", text: "4. Mobile first, for real" },
        { type: "p", text: "More than seven visitors out of ten arrive from a phone, often between two tasks. If the number can’t be reached with a thumb, if the text forces a zoom, if the page takes four seconds to show up on an average network, the call never happens. That’s not a technical detail, it’s half your traffic." },
        { type: "h", text: "What it adds up to" },
        { type: "p", text: "None of these four points requires rebuilding the whole site. In half the redesigns we run, these are the only things we change, and the phone starts ringing again in the following weeks. If you want to know which of the four is missing on your site, we can look at it together in one call." },
      ],
    },
  },
  {
    slug: "etre-trouve-dans-votre-region-avant-vos-concurrents",
    date: "2026-09-08",
    readMinutes: 7,
    author: AUTEUR,
    cover: "/images/home/svc-network.jpg",
    fr: {
      category: "Référencement local",
      title: "Être trouvé dans votre région avant vos concurrents",
      excerpt:
        "Fiche Google, pages de villes, avis clients : ce qui fait vraiment remonter une entreprise de service dans les résultats locaux.",
      body: [
        { type: "p", text: "Quand quelqu’un cherche « excavation Lévis » ou « paysagiste Terrebonne », Google n’affiche pas les meilleurs sites du Québec. Il affiche les entreprises qu’il croit proches, actives et fiables. Le référencement local, c’est le travail de lui prouver ces trois choses." },
        { type: "p", text: "La bonne nouvelle : la plupart de vos concurrents ne font rien de tout ça. Quelques heures bien placées suffisent souvent pour passer devant eux." },
        { type: "h", text: "La fiche Google d’abord" },
        { type: "p", text: "La fiche d’établissement Google est ce qui apparaît dans la carte et dans le bloc à trois résultats, au-dessus des sites. Elle compte plus que votre page d’accueil pour les recherches locales. Elle doit être revendiquée, complète et vivante : catégorie principale exacte, zone desservie, heures, photos récentes, et une publication de temps en temps." },
        {
          type: "ul",
          items: [
            "Le même nom, la même adresse et le même numéro partout : fiche, site, annuaires, réseaux.",
            "La catégorie la plus précise possible : « Entrepreneur en excavation », pas « Entreprise de construction ».",
            "Des photos de chantier réelles, ajoutées régulièrement, plutôt qu’un logo seul.",
          ],
        },
        { type: "h", text: "Une page par ville, pas une liste de villes" },
        { type: "p", text: "Écrire « nous desservons Québec, Lévis, Beauport, Sainte-Foy » dans le pied de page ne fait rien. Une page dédiée à chaque ville importante — avec le service, des projets réalisés là-bas et des repères locaux — donne à Google une raison d’afficher votre entreprise pour cette recherche précise. Trois ou quatre pages bien faites valent mieux que vingt pages copiées-collées." },
        { type: "h", text: "Les avis, votre meilleur argument" },
        { type: "p", text: "Le nombre d’avis et leur fraîcheur pèsent dans le classement, mais ils pèsent surtout dans la décision du client. Une entreprise à 4,8 avec quarante avis récents gagne l’appel contre une entreprise à 5,0 avec trois avis vieux de deux ans." },
        { type: "quote", text: "Demandez l’avis le jour où le chantier se termine, quand le client est content et que le résultat est devant lui." },
        { type: "p", text: "Envoyez le lien direct par texto, et répondez à chaque avis, y compris les moins bons. La réponse est lue par les prochains clients, pas par celui qui a écrit." },
        { type: "h", text: "Le site doit suivre" },
        { type: "p", text: "Une fiche solide qui renvoie vers un site lent, sans numéro cliquable ni page de service claire, perd la moitié de sa valeur. Le référencement local amène le visiteur ; la structure du site doit ensuite le convertir. Les deux se travaillent ensemble." },
      ],
    },
    en: {
      category: "Local SEO",
      title: "Getting found in your area before your competitors",
      excerpt:
        "Google Business Profile, city pages, customer reviews: what actually moves a service business up in local search results.",
      body: [
        { type: "p", text: "When someone searches “excavation Lévis” or “landscaper Terrebonne”, Google doesn’t show the best websites in Québec. It shows the businesses it believes are nearby, active and trustworthy. Local SEO is the work of proving those three things." },
        { type: "p", text: "The good news: most of your competitors do none of it. A few well-placed hours are often enough to move ahead of them." },
        { type: "h", text: "The Google Business Profile first" },
        { type: "p", text: "Your Business Profile is what appears in the map and in the three-result block above the websites. For local searches it matters more than your home page. It must be claimed, complete and alive: exact primary category, service area, hours, recent photos, and a post from time to time." },
        {
          type: "ul",
          items: [
            "The same name, address and phone number everywhere: profile, site, directories, social media.",
            "The most precise category available: “Excavating contractor”, not “Construction company”.",
            "Real job-site photos, added regularly, rather than a logo alone.",
          ],
        },
        { type: "h", text: "One page per city, not a list of cities" },
        { type: "p", text: "Writing “we serve Québec City, Lévis, Beauport, Sainte-Foy” in the footer does nothing. A dedicated page for each important city — with the service, projects completed there and local landmarks — gives Google a reason to show your business for that exact search. Three or four well-made pages beat twenty copy-pasted ones." },
        { type: "h", text: "Reviews, your strongest argument" },
        { type: "p", text: "The number and freshness of reviews weigh in the ranking, but they weigh even more in the customer’s decision. A business at 4.8 with forty recent reviews wins the call against one at 5.0 with three reviews from two years ago." },
        { type: "quote", text: "Ask for the review the day the job wraps up, when the customer is happy and the result is right in front of them." },
        { type: "p", text: "Text them the direct link, and reply to every review, including the weaker ones. The reply is read by your next customers, not by the person who wrote it." },
        { type: "h", text: "The site has to keep up" },
        { type: "p", text: "A strong profile pointing to a slow site with no tappable number and no clear service page loses half its value. Local SEO brings the visitor; the structure of the site then has to convert them. The two are worked on together." },
      ],
    },
  },
  {
    slug: "combien-coute-un-site-web-au-quebec",
    date: "2026-09-02",
    readMinutes: 5,
    author: AUTEUR,
    cover: "/images/home/svc-stack.jpg",
    fr: {
      category: "Prix",
      title: "Combien coûte un site web au Québec",
      excerpt:
        "Ce qui fait varier la facture d’un projet, et comment savoir si une soumission est raisonnable pour votre type d’entreprise.",
      body: [
        { type: "p", text: "Demandez trois soumissions pour le même site et vous recevrez trois montants qui n’ont rien à voir. Ce n’est pas que deux fournisseurs sur trois vous trompent : c’est qu’ils ne chiffrent pas la même chose. Avant de comparer les prix, il faut comparer ce qu’ils contiennent." },
        { type: "h", text: "Ce qui fait bouger la facture" },
        { type: "p", text: "Le nombre de pages compte moins qu’on le pense. Ce qui coûte, c’est le travail qui ne se voit pas sur la maquette." },
        {
          type: "ul",
          items: [
            "La rédaction : qui écrit les textes, et en combien de langues.",
            "Les photos : vos images ou une séance sur vos chantiers.",
            "Les fonctions : formulaire, prise de rendez-vous, blogue, espace d’administration.",
            "Le référencement : structure technique, pages de villes, fiche Google.",
            "L’après : hébergement, mises à jour, sécurité, et qui vous répond quand quelque chose casse.",
          ],
        },
        { type: "h", text: "Gabarit ou sur mesure" },
        { type: "p", text: "Un site monté sur un gabarit est rapide et peu coûteux, et c’est parfois le bon choix pour démarrer. Il montre ses limites quand il faut se distinguer d’un concurrent qui utilise le même modèle, ou quand la vitesse et le référencement deviennent une priorité. Le sur mesure coûte plus au départ et se rentabilise sur les appels qu’il génère pendant des années." },
        { type: "h", text: "Comment lire une soumission" },
        { type: "p", text: "Une soumission sérieuse dit qui fait quoi, ce qui est inclus, ce qui ne l’est pas, et ce que vous payez chaque mois après la mise en ligne. Méfiez-vous d’un prix très bas sans détail : le reste arrive sous forme d’extras. Méfiez-vous aussi d’un prix très élevé justifié par des mots vagues comme « stratégie » ou « expérience utilisateur » sans livrable concret." },
        { type: "quote", text: "La bonne question n’est pas « combien ça coûte », mais « combien d’appels ça doit générer pour être rentable »." },
        { type: "p", text: "Un contrat de paysagement ou d’excavation se chiffre en milliers de dollars. Si le site en amène quelques-uns de plus par année, il s’est payé. C’est avec ce calcul qu’il faut juger une soumission, pas avec le montant seul." },
        { type: "h", text: "Nos forfaits" },
        { type: "p", text: "Nous affichons nos forfaits et ce qu’ils contiennent sur la page Prix, pour que la comparaison soit possible avant même de nous appeler. Si votre projet n’entre dans aucune case, un appel suffit pour cerner le besoin et vous dire ce que ça représente." },
      ],
    },
    en: {
      category: "Pricing",
      title: "How much does a website cost in Québec",
      excerpt:
        "What drives the price of a project up or down, and how to tell whether a quote is reasonable for your type of business.",
      body: [
        { type: "p", text: "Ask three quotes for the same website and you’ll get three amounts that have nothing in common. It isn’t that two providers out of three are cheating you: they simply aren’t pricing the same thing. Before comparing prices, compare what they include." },
        { type: "h", text: "What moves the price" },
        { type: "p", text: "The number of pages matters less than people think. What costs is the work that doesn’t show on the mockup." },
        {
          type: "ul",
          items: [
            "Copywriting: who writes the text, and in how many languages.",
            "Photos: your own images or a shoot on your job sites.",
            "Features: contact form, online booking, blog, admin area.",
            "SEO: technical structure, city pages, Google Business Profile.",
            "Afterwards: hosting, updates, security, and who answers when something breaks.",
          ],
        },
        { type: "h", text: "Template or custom" },
        { type: "p", text: "A template-based site is fast and inexpensive, and sometimes the right way to start. It shows its limits when you need to stand out from a competitor using the same template, or when speed and SEO become a priority. Custom work costs more up front and pays for itself through the calls it generates for years." },
        { type: "h", text: "How to read a quote" },
        { type: "p", text: "A serious quote says who does what, what is included, what isn’t, and what you pay each month after launch. Be wary of a very low price with no detail: the rest arrives as extras. Be equally wary of a very high price justified by vague words like “strategy” or “user experience” with no concrete deliverable." },
        { type: "quote", text: "The right question isn’t “how much does it cost”, but “how many calls does it need to generate to pay for itself”." },
        { type: "p", text: "A landscaping or excavation contract is worth thousands of dollars. If the site brings in a few more per year, it has paid for itself. That is the calculation to judge a quote with, not the amount alone." },
        { type: "h", text: "Our packages" },
        { type: "p", text: "We publish our packages and what they include on the Pricing page, so you can compare before you even call. If your project doesn’t fit any box, one call is enough to pin down the need and tell you what it represents." },
      ],
    },
  },
  {
    slug: "bilingue-par-defaut-pourquoi-ca-compte-ici",
    date: "2026-08-26",
    readMinutes: 4,
    author: AUTEUR,
    cover: "/images/home/svc-globe.jpg",
    fr: {
      category: "Bonnes pratiques",
      title: "Bilingue par défaut : pourquoi ça compte ici",
      excerpt:
        "Un site en français seulement laisse des contrats sur la table. Comment structurer les deux langues sans doubler le travail.",
      body: [
        { type: "p", text: "Au Québec, le français passe en premier, et la loi l’exige. Mais dans bien des régions — Montréal, l’Outaouais, les Cantons-de-l’Est, les secteurs touristiques — une partie des propriétaires qui cherchent un entrepreneur tapent leur recherche en anglais. Si votre site n’existe pas dans cette langue, vous n’existez pas pour eux." },
        { type: "h", text: "Ce que ça change concrètement" },
        { type: "p", text: "Un site bilingue n’est pas une traduction collée au bas de la page. Chaque langue a ses propres adresses, ses propres titres et descriptions dans Google, et le moteur sait laquelle proposer à qui. Le résultat : deux fois plus de portes d’entrée pour la même entreprise." },
        {
          type: "ul",
          items: [
            "Une adresse par langue, comme /fr/services et /en/services.",
            "Un lien clair pour basculer, au même endroit sur toutes les pages.",
            "Des textes adaptés, pas traduits mot à mot — les clients anglophones ne cherchent pas toujours avec les mêmes mots.",
          ],
        },
        { type: "h", text: "Sans doubler le travail" },
        { type: "p", text: "La crainte habituelle est de devoir tout faire deux fois. En pratique, le site est construit une fois ; seuls les textes existent en deux versions. Un formulaire, une prise de rendez-vous ou une galerie de photos se partagent. Quand vous ajoutez un projet ou un article, vous écrivez le texte dans les deux langues et le reste suit." },
        { type: "quote", text: "Le français d’abord, l’anglais sans effort : c’est la structure qui fait le travail, pas vous." },
        { type: "h", text: "Par où commencer" },
        { type: "p", text: "Si votre site actuel est unilingue, il n’est pas nécessaire de tout refaire d’un coup. Les pages qui rapportent — accueil, services, contact — sont les premières à traduire. Le reste peut suivre, page par page, au rythme de vos saisons." },
      ],
    },
    en: {
      category: "Best practices",
      title: "Bilingual by default: why it matters here",
      excerpt:
        "A French-only website leaves contracts on the table. How to structure both languages without doubling the work.",
      body: [
        { type: "p", text: "In Québec, French comes first, and the law requires it. But in many areas — Montréal, the Outaouais, the Eastern Townships, tourist regions — a share of the homeowners looking for a contractor type their search in English. If your site doesn’t exist in that language, you don’t exist for them." },
        { type: "h", text: "What it changes in practice" },
        { type: "p", text: "A bilingual site is not a translation pasted at the bottom of the page. Each language has its own addresses, its own titles and descriptions in Google, and the search engine knows which one to show to whom. The result: twice as many doors into the same business." },
        {
          type: "ul",
          items: [
            "One address per language, such as /fr/services and /en/services.",
            "A clear switch link, in the same spot on every page.",
            "Adapted copy, not word-for-word translation — English-speaking customers don’t always search with the same words.",
          ],
        },
        { type: "h", text: "Without doubling the work" },
        { type: "p", text: "The usual fear is having to do everything twice. In practice, the site is built once; only the text exists in two versions. A form, a booking tool or a photo gallery are shared. When you add a project or an article, you write the text in both languages and the rest follows." },
        { type: "quote", text: "French first, English effortlessly: the structure does the work, not you." },
        { type: "h", text: "Where to start" },
        { type: "p", text: "If your current site is single-language, there’s no need to redo everything at once. The pages that bring in business — home, services, contact — are the first to translate. The rest can follow, page by page, at the pace of your seasons." },
      ],
    },
  },
  {
    slug: "les-photos-de-chantier-qui-convainquent",
    date: "2026-08-19",
    readMinutes: 6,
    author: AUTEUR,
    cover: "/images/home/sector-construction.jpg",
    fr: {
      category: "Contenu",
      title: "Les photos de chantier qui convainquent",
      excerpt:
        "Vos vraies photos valent mieux que n’importe quelle banque d’images. Ce qu’il faut cadrer, et ce qu’il faut éviter.",
      body: [
        { type: "p", text: "Un propriétaire qui compare deux paysagistes ne lit pas vos textes en premier. Il regarde vos photos, et il se demande si ce qu’il voit ressemble à ce qu’il veut chez lui. Une image de banque, avec une pelouse parfaite et une famille souriante, répond « non » à cette question avant même qu’il l’ait posée." },
        { type: "h", text: "Pourquoi vos photos gagnent toujours" },
        { type: "p", text: "Vos photos montrent votre vrai travail, dans de vraies cours, avec le climat d’ici. Elles sont imparfaites, et c’est exactement ce qui les rend crédibles. Elles disent : voilà ce que vous obtiendrez. Aucune image achetée ne peut dire ça." },
        { type: "h", text: "Ce qu’il faut cadrer" },
        {
          type: "ul",
          items: [
            "L’avant et l’après, pris du même angle. C’est la photo la plus convaincante qui existe.",
            "Le résultat fini, propre, en lumière du jour, sans camion ni outils dans le cadre.",
            "Votre équipe au travail : ça humanise l’entreprise et ça montre le sérieux.",
            "Les détails qui font la qualité : une bordure droite, un joint net, un drain bien posé.",
          ],
        },
        { type: "h", text: "Ce qu’il faut éviter" },
        { type: "p", text: "Les photos prises à contre-jour, celles où le chantier est à moitié terminé et celles où l’on devine la maison du voisin en désordre. Une seule mauvaise photo entame la confiance que dix bonnes ont construite. Mieux vaut six images solides que trente moyennes." },
        { type: "quote", text: "Prenez la photo du résultat le jour où vous quittez le chantier. Vous n’y reviendrez pas." },
        { type: "h", text: "Un téléphone suffit" },
        { type: "p", text: "Pas besoin d’un photographe pour la plupart des chantiers. Un téléphone récent, tenu à l’horizontale, en fin d’après-midi quand la lumière est douce, donne des images largement suffisantes pour un site. Nettoyez l’objectif, reculez de quelques pas, et prenez trois angles plutôt qu’un. Le tri se fait après." },
        { type: "p", text: "Ce qui compte ensuite, c’est de les mettre en ligne. Une photo qui dort dans un téléphone ne convainc personne. Prenez l’habitude de nous envoyer les meilleures à la fin de chaque saison, et le site reste vivant." },
      ],
    },
    en: {
      category: "Content",
      title: "Job-site photos that win the job",
      excerpt:
        "Your real photos beat any stock image. What to frame, and what to avoid.",
      body: [
        { type: "p", text: "A homeowner comparing two landscapers doesn’t read your copy first. They look at your photos, and ask themselves whether what they see looks like what they want at home. A stock image, with a perfect lawn and a smiling family, answers “no” to that question before they even ask it." },
        { type: "h", text: "Why your photos always win" },
        { type: "p", text: "Your photos show your actual work, in real yards, in our climate. They are imperfect, and that is exactly what makes them credible. They say: this is what you’ll get. No purchased image can say that." },
        { type: "h", text: "What to frame" },
        {
          type: "ul",
          items: [
            "Before and after, shot from the same angle. The single most convincing photo there is.",
            "The finished result, clean, in daylight, with no truck or tools in the frame.",
            "Your crew at work: it humanizes the business and shows seriousness.",
            "The details that make quality: a straight edge, a clean joint, a properly laid drain.",
          ],
        },
        { type: "h", text: "What to avoid" },
        { type: "p", text: "Backlit shots, half-finished job sites, and frames where the neighbour’s cluttered yard shows. One bad photo chips away at the trust ten good ones built. Six solid images beat thirty average ones." },
        { type: "quote", text: "Take the photo of the result the day you leave the site. You won’t be back." },
        { type: "h", text: "A phone is enough" },
        { type: "p", text: "No photographer is needed for most jobs. A recent phone, held horizontally, in late afternoon when the light is soft, gives images that are more than good enough for a website. Wipe the lens, step back a few paces, and shoot three angles rather than one. Sorting comes later." },
        { type: "p", text: "What matters next is getting them online. A photo sleeping in a phone convinces nobody. Make a habit of sending us the best ones at the end of each season, and the site stays alive." },
      ],
    },
  },
  {
    slug: "refonte-ou-nouveau-site-comment-decider",
    date: "2026-08-12",
    readMinutes: 5,
    author: AUTEUR,
    cover: "/images/home/svc-identity.jpg",
    fr: {
      category: "Refonte",
      title: "Refonte ou nouveau site : comment décider",
      excerpt:
        "Trois questions à se poser avant de tout jeter. Parfois, une refonte partielle suffit à débloquer les demandes.",
      body: [
        { type: "p", text: "« Mon site est vieux, il faut tout refaire. » C’est la phrase par laquelle commencent la plupart des appels qu’on reçoit. Parfois c’est vrai. Souvent, ce qui bloque les demandes tient à trois ou quatre choses précises, et on peut les corriger sans repartir de zéro. Trois questions permettent de trancher." },
        { type: "h", text: "1. Est-ce que la base tient ?" },
        { type: "p", text: "Le site s’affiche-t-il correctement sur un téléphone, se charge-t-il en moins de trois secondes, et pouvez-vous le modifier vous-même sans appeler quelqu’un ? Si la réponse est oui aux trois, la base est saine. Si elle est non à deux d’entre elles, une refonte partielle coûtera plus cher qu’un nouveau site, parce qu’on passera son temps à contourner les limites." },
        { type: "h", text: "2. Est-ce le contenant ou le contenu ?" },
        { type: "p", text: "Un site peut être techniquement correct et ne rien générer parce que ses textes sont vagues, ses photos datées et son numéro caché dans la page Contact. Dans ce cas, refaire le design ne changera rien : c’est le contenu qu’il faut retravailler. À l’inverse, de bons textes sur un site lent et illisible au mobile méritent un nouveau contenant." },
        {
          type: "ul",
          items: [
            "Contenu à revoir : textes, photos, appel à l’action, pages de services.",
            "Contenant à revoir : vitesse, affichage mobile, outil de gestion, sécurité.",
            "Les deux : c’est là qu’un nouveau site s’impose.",
          ],
        },
        { type: "h", text: "3. Qu’est-ce que Google en pense ?" },
        { type: "p", text: "Si votre site actuel ressort déjà pour des recherches locales, il a une valeur qu’il ne faut pas perdre. Un nouveau site mal préparé peut faire disparaître ces positions en quelques semaines. Une refonte, ou un nouveau site avec un plan de redirection rigoureux, préserve ce que vous avez gagné." },
        { type: "quote", text: "Un site qui vous amène déjà des appels ne se jette pas. Il se corrige." },
        { type: "h", text: "Notre façon de trancher" },
        { type: "p", text: "Avant de proposer quoi que ce soit, on regarde le site existant avec vous : ce qui fonctionne, ce qui bloque, ce que Google en fait. Il arrive qu’on recommande de ne toucher qu’à trois pages. Il arrive aussi qu’on recommande de tout reprendre. Dans les deux cas, vous savez pourquoi." },
      ],
    },
    en: {
      category: "Redesign",
      title: "Redesign or new website: how to decide",
      excerpt:
        "Three questions to ask before throwing everything out. Sometimes a partial redesign is enough to get the requests flowing.",
      body: [
        { type: "p", text: "“My site is old, it all needs redoing.” That’s how most of the calls we get begin. Sometimes it’s true. Often, what’s blocking the requests comes down to three or four specific things, and they can be fixed without starting from scratch. Three questions settle it." },
        { type: "h", text: "1. Does the foundation hold?" },
        { type: "p", text: "Does the site display properly on a phone, load in under three seconds, and can you edit it yourself without calling someone? If the answer is yes to all three, the foundation is sound. If it’s no to two of them, a partial redesign will cost more than a new site, because you’ll spend your time working around the limits." },
        { type: "h", text: "2. Is it the container or the content?" },
        { type: "p", text: "A site can be technically fine and generate nothing because its copy is vague, its photos are dated and its phone number is buried in the Contact page. In that case, redoing the design changes nothing: it’s the content that needs reworking. Conversely, good copy on a slow site that’s unreadable on mobile deserves a new container." },
        {
          type: "ul",
          items: [
            "Content to rework: copy, photos, call to action, service pages.",
            "Container to rework: speed, mobile display, editing tool, security.",
            "Both: that’s when a new site is the answer.",
          ],
        },
        { type: "h", text: "3. What does Google think?" },
        { type: "p", text: "If your current site already shows up for local searches, it has value you shouldn’t lose. A poorly prepared new site can wipe out those positions within weeks. A redesign, or a new site with a rigorous redirect plan, preserves what you’ve earned." },
        { type: "quote", text: "A site that already brings you calls doesn’t get thrown out. It gets fixed." },
        { type: "h", text: "How we decide" },
        { type: "p", text: "Before proposing anything, we look at the existing site with you: what works, what blocks, what Google does with it. Sometimes we recommend touching only three pages. Sometimes we recommend starting over. Either way, you know why." },
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

/** Les `count` articles les plus récents autres que `slug` (bloc « À lire ensuite »). */
export function getRelatedPosts(lang: Locale, slug: string, count = 3): Post[] {
  return getPosts(lang)
    .filter((post) => post.slug !== slug)
    .slice(0, count);
}

/** Slugs de tous les articles — pour `generateStaticParams`. */
export function getAllSlugs(): string[] {
  return POSTS.map((p) => p.slug);
}
