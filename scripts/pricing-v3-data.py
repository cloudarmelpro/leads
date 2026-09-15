# -*- coding: utf-8 -*-
"""Injecte les données « Pricing v3 » (Claude Design) dans fr.json et en.json.

Source de vérité : le fichier de design « Talgasy Web - Pricing v3.dc.html ».
Conventions des cellules : "y" = inclus, "-" = non inclus, autre = texte affiché.
`sub: true` = sous-ligne (détail indenté). Relancer : `python scripts/pricing-v3-data.py`.
"""
import io
import json
from collections import OrderedDict

NB = " "   # espace insécable (milliers)
NNB = " "  # espace fine insécable (avant $)
N = "-"


def fr_price(amount: int, per_month: bool = False) -> str:
    s = f"{amount:,}".replace(",", NB)
    return f"{s}{NNB}$" + (" / mois" if per_month else "")


def en_price(amount: int, per_month: bool = False) -> str:
    return f"${amount:,}" + (" / month" if per_month else "")


def rows(spec):
    out = []
    for r in spec:
        label, cells = r[0], r[1]
        row = OrderedDict(label=label, cells=list(cells))
        if len(r) > 2 and r[2]:
            row["sub"] = True
        out.append(row)
    return out


# --------------------------------------------------------------------------- FR
SITE_PLANS_FR = [
    # 4e valeur (A4) : « pour qui », tirée des lignes qui distinguent le forfait du précédent
    # dans l'« Offre de services » de Cedric (PDF du 2026-09-10) — rien qui n'y figure pas.
    ("Express", 499, "3 pages", "Pour être en ligne vite, avec vos contenus prêts."),
    ("Lancement", 999, "3 pages", "Trois pages sur un de nos modèles, sécurisé et optimisé pour Google."),
    ("Essentiel", 1999, "5 pages", "Jusqu’à cinq pages à votre image, avec le suivi Google inclus."),
    ("Sur-mesure", 3999, "7 pages", "Un site conçu de zéro pour votre entreprise, pensé pour convertir."),
    ("Croissance", 5500, "10 pages", "Site, logo et prise de rendez-vous, avec le suivi de vos conversions."),
    ("Professionnel", 7500, "15 pages", "Site, CRM et blogue alimenté pendant un an, sur votre propre serveur."),
    ("Performance", 10000, "20 pages", "Identité visuelle complète et vos outils connectés, du site au CRM."),
    ("Signature", 15000, "30 pages", "Contenu rédigé pour vous, support prioritaire, garantie d’un an."),
    ("Prestige", 20000, "30 pages", "Rebranding complet et accompagnement avant et après le lancement, pour toute l’équipe."),
]
SITE_PLANS_EN = [
    ("Express", 499, "3 pages", "To get online fast, with your content ready."),
    ("Launch", 999, "3 pages", "Three pages on one of our templates, secured and optimized for Google."),
    ("Essential", 1999, "5 pages", "Up to five pages in your image, with Google tracking included."),
    ("Custom", 3999, "7 pages", "A site designed from scratch for your business, built to convert."),
    ("Growth", 5500, "10 pages", "Site, logo and online booking, with conversion tracking."),
    ("Professional", 7500, "15 pages", "Site, CRM and a blog fed for a year, on your own server."),
    ("Performance", 10000, "20 pages", "Full visual identity and your tools connected, from site to CRM."),
    ("Signature", 15000, "30 pages", "Content written for you, priority support, one-year warranty."),
    ("Prestige", 20000, "30 pages", "Full rebranding and support before and after launch, for the whole team."),
]

RANGES_FR = [
    ("Démarrage", "Un site professionnel, en ligne en quelques jours.", f"499 – 1{NB}999{NNB}$", [0, 1, 2]),
    ("Croissance", "Sur mesure, CRM et contenu.", f"3{NB}999 – 7{NB}500{NNB}$", [3, 4, 5]),
    # T6 : phrase du rapport de révision, exacte pour Performance, Signature et Prestige (PDF).
    ("Entreprise", "Identité de marque complète, logo inclus, automatisations et infrastructure.", f"10{NB}000 – 20{NB}000{NNB}$", [6, 7, 8]),
]
RANGES_EN = [
    ("Starter", "A professional site, online within days.", "$499 – $1,999", [0, 1, 2]),
    ("Growth", "Custom build, CRM and content.", "$3,999 – $7,500", [3, 4, 5]),
    ("Enterprise", "Full brand identity, logo included, automations and infrastructure.", "$10,000 – $20,000", [6, 7, 8]),
]

Y9 = ["y"] * 9
# A1 (rapport de révision 2026-09-14) : statut du logo écrit noir sur blanc dans chaque colonne.
OPT_LOGO = f"Non inclus — option à partir de 200{NNB}$"

SITE_GROUPS_FR = [
    ("Design et conception", [
        ("Pages incluses", ["3", "3", "5", "7", "10", "15", "20", "30", "30"]),
        ("Design à partir de nos modèles professionnels", [N, "y", "y", "y", "y", "y", "y", "y", "y"]),
        ("Design adapté à votre image de marque", [N, N, "y", "y", "y", "y", "y", "y", "y"]),
        ("Conception UX/UI originale", [N, N, N, "y", "y", "y", "y", "y", "Premium"]),
        ("Design entièrement personnalisé", [N, N, N, "y", "y", "y", "y", "y", "y"]),
        ("Développement sur mesure", [N, N, N, "y", "y", "y", "y", "y", "y"]),
        ("Adapté à tous les écrans (mobile, tablette, ordinateur)", Y9),
        ("Architecture orientée conversion", [N, N, N, "y", "y", "y", "y", "y", "y"]),
    ]),
    ("Marque et identité", [
        ("Logo et identité visuelle", [OPT_LOGO, OPT_LOGO, OPT_LOGO, OPT_LOGO, "Inclus", "Inclus", "Inclus", "Inclus", "Inclus"]),
        ("3 pistes créatives", [N, N, N, N, "y", "y", "y", "y", "y"], 1),
        ("Variantes horizontale, verticale et icône", [N, N, N, N, "y", "y", "y", "y", "y"], 1),
        ("Couleurs et typographies", [N, N, N, N, "y", "y", "y", "y", "y"], 1),
        ("Fichiers sources du logo", [N, N, N, N, "y", "y", "y", "y", "y"], 1),
        ("Rondes de corrections du logo", [N, N, N, N, "2", "2", "2", "2", "2"], 1),
        ("Identité visuelle complète incluse", [N, N, N, N, N, N, "y", "y", "y"]),
        ("Planche d’inspiration", [N, N, N, N, N, N, "y", "y", "y"], 1),
        ("Palette de couleurs", [N, N, N, N, N, N, "y", "y", "y"], 1),
        ("Typographies", [N, N, N, N, N, N, "y", "y", "y"], 1),
        ("Éléments graphiques", [N, N, N, N, N, N, "y", "y", "y"], 1),
        ("Iconographie", [N, N, N, N, N, N, "y", "y", "y"], 1),
        ("Mini-guide de marque", [N, N, N, N, N, N, "y", "y", "y"], 1),
        ("Modèles de supports", [N, N, N, N, N, N, "5", "5", "Corporatifs"], 1),
        ("Rebranding complet inclus", [N, N, N, N, N, N, N, N, "y"]),
        ("Analyse de la marque existante", [N, N, N, N, N, N, N, N, "y"], 1),
        ("Atelier stratégique", [N, N, N, N, N, N, N, N, "y"], 1),
        ("Positionnement de marque", [N, N, N, N, N, N, N, N, "y"], 1),
        ("Messages de marque", [N, N, N, N, N, N, N, N, "y"], 1),
        ("Refonte complète du logo", [N, N, N, N, N, N, N, N, "y"], 1),
        ("Nouvel univers visuel", [N, N, N, N, N, N, N, N, "y"], 1),
        ("Guide de marque complet", [N, N, N, N, N, N, N, N, "y"], 1),
        ("Préparation du lancement", [N, N, N, N, N, N, N, N, "y"], 1),
    ]),
    ("Fonctionnalités", [
        ("Site bilingue FR / EN", Y9),
        ("Formulaire de contact", Y9),
        ("Formulaire avancé anti-pourriel", [N, N, N, "y", "y", "y", "y", "y", "y"]),
        ("Réservation Cal.com intégrée", [N, N, N, N, "y", "y", "y", "y", "y"]),
        ("Intégrations avec des logiciels externes", [N, N, N, N, N, "3", "5", "7", "10"]),
        ("Espace client ou espace membre", [N, N, N, N, N, N, N, "y", "y"]),
        ("Workflows personnalisés", [N, N, N, N, N, N, N, "y", "y"]),
        ("Automatisations entre le site, le CRM et les logiciels externes", [N, N, N, N, N, N, "y", "y", "y"]),
        ("Automatisations avancées", [N, N, N, N, N, N, N, "y", "y"]),
        ("Fonctionnalités métier personnalisées", [N, N, N, N, N, N, N, "y", "y"]),
    ]),
    ("CRM", [
        ("CRM personnalisé", [N, N, N, N, N, "y", "y", "y", "y"]),
        ("Utilisateurs CRM", [N, N, N, N, N, "1", "Jusqu’à 3", "Jusqu’à 5", "Jusqu’à 10"]),
        ("Gestion des prospects et clients", [N, N, N, N, N, "y", "y", "y", "y"]),
        ("Pipeline de vente personnalisé", [N, N, N, N, N, "y", "y", "y", "y"]),
        ("Tableau de bord CRM", [N, N, N, N, N, "y", "y", "y", "y"]),
        ("Formulaires connectés au CRM", [N, N, N, N, N, "y", "y", "y", "y"]),
        ("Tableaux de bord personnalisés", [N, N, N, N, N, N, N, "y", "y"]),
        ("Sauvegardes CRM", [N, N, N, N, N, "y", "y", "y", "y"]),
    ]),
    ("Contenu", [
        ("Intégration de vos textes, photos et logo", Y9),
        ("CMS / blogue", [N, N, N, N, N, "y", "y", "y", "y"]),
        ("Articles de blogue", [N, N, N, N, N, "24", "48", "48", "48"]),
        ("Publication", [N, N, N, N, N, "2 / mois · 12 mois", "2 / mois · 24 mois", "2 / mois · 24 mois", "2 / mois · 24 mois"]),
        ("Préparation et révision avec le client", [N, N, N, N, N, "y", "y", "y", "y"]),
        ("Rédaction et optimisation des pages principales", [N, N, N, N, N, N, N, "Approfondie", "y"]),
    ]),
    ("Référencement", [
        ("Référencement de base (titres, descriptions, structure des pages)", Y9),
        ("Optimisation technique (vitesse, mobile, indexation)", [N, "y", "y", "y", "y", "y", "y", "y", "y"]),
        ("Optimisation du contenu de chaque page (SEO on-page)", [N, N, "y", "Complet", "Complet", "Complet", "Complet", "Complet", "Complet"]),
        ("SEO local avancé", [N, N, N, N, "y", "y", "y", "y", "y"]),
        ("Architecture SEO approfondie", [N, N, N, N, "y", "y", "y", "y", "y"]),
        ("Données structurées avancées", [N, N, N, N, N, "y", "y", "y", "y"]),
    ]),
    ("Suivi et mesure", [
        ("Google Analytics", [N, N, "y", "y", "y", "y", "y", "y", "y"]),
        ("Google Search Console", [N, N, "y", "y", "y", "y", "y", "y", "y"]),
        ("Google Tag Manager", [N, N, N, N, "y", "y", "y", "y", "y"]),
        ("Suivi des conversions", [N, N, N, N, "Système", "y", "y", "y", "Système complet"]),
        ("Suivi des formulaires", [N, N, N, N, "y", "y", "y", "y", "y"], 1),
        ("Suivi des demandes de soumission", [N, N, N, N, "y", "y", "y", "y", "y"], 1),
        ("Suivi des réservations", [N, N, N, N, "y", "y", "y", "y", "y"], 1),
        ("Suivi des interactions téléphoniques", [N, N, N, N, "y", "y", "y", "y", "y"], 1),
        ("Tableau de bord de performance", [N, N, N, N, "y", "y", "y", "y", "y"]),
    ]),
    ("Infrastructure", [
        ("Certificat SSL (site sécurisé HTTPS)", [N, "y", "y", "y", "y", "y", "y", "y", "y"]),
        ("Plan du site (sitemap) pour Google", [N, "y", "y", "y", "y", "y", "y", "y", "y"]),
        ("Mise en ligne", Y9),
        ("Hébergement du site", ["12 mois", "12 mois", "12 mois", "12 mois", "12 mois", "24 mois", "24 mois", "24 mois", "24 mois"]),
        ("VPS KVM inclus", [N, N, N, N, N, "KVM 1 · 24 mois", "KVM 2 · 24 mois", "KVM 4 · 24 mois", "KVM 8 · 24 mois"]),
        ("vCPU", [N, N, N, N, N, "1", "2", "4", "8"], 1),
        ("RAM", [N, N, N, N, N, "4 Go", "8 Go", "16 Go", "32 Go"], 1),
        ("Stockage NVMe", [N, N, N, N, N, "50 Go", "100 Go", "200 Go", "400 Go"], 1),
    ]),
    ("Livraison et accompagnement", [
        ("Rondes de corrections", ["1", "2", "3", "3", "3", "4", "4", "4", "4"]),
        ("Formation", [N, N, N, N, "45 minutes", "1 heure", "2 heures", "4 heures", "Complète, pour l’équipe"]),
        ("Support prioritaire", [N, N, N, N, N, N, N, "y", "y"]),
        ("Accompagnement après lancement", [N, N, N, N, N, N, N, N, "y"]),
        ("Garantie", [N, N, N, "60 jours", "90 jours", "120 jours", "180 jours", "365 jours", "365 jours"]),
    ]),
]

# Traductions EN alignées ligne à ligne sur SITE_GROUPS_FR (mêmes cellules, textes traduits).
T = {
    "Complet": "Full", "Complète, pour l’équipe": "Full, for the team", "Premium": "Premium", "Corporatifs": "Corporate",
    "Mobile et tablette": "Mobile and tablet", "Mobile, tablette et ordinateur": "Mobile, tablet and desktop",
    "Textes, photos et logo fournis par le client": "Text, photos and logo supplied by the client",
    "Textes, photos et logo": "Text, photos and logo", "Jusqu’à 3": "Up to 3", "Jusqu’à 5": "Up to 5", "Jusqu’à 10": "Up to 10",
    "2 / mois · 12 mois": "2 / month · 12 months", "2 / mois · 24 mois": "2 / month · 24 months", "Approfondie": "In-depth",
    "Système": "System", "Système complet": "Full system", "Inclus": "Included", "Inclus": "Included", "12 mois": "12 months", "24 mois": "24 months",
    "KVM 1 · 24 mois": "KVM 1 · 24 months", "KVM 2 · 24 mois": "KVM 2 · 24 months", "KVM 4 · 24 mois": "KVM 4 · 24 months", "KVM 8 · 24 mois": "KVM 8 · 24 months",
    "4 Go": "4 GB", "8 Go": "8 GB", "16 Go": "16 GB", "32 Go": "32 GB", "50 Go": "50 GB", "100 Go": "100 GB", "200 Go": "200 GB", "400 Go": "400 GB",
    "45 minutes": "45 minutes", "1 heure": "1 hour", "2 heures": "2 hours", "4 heures": "4 hours",
    "60 jours": "60 days", "90 jours": "90 days", "120 jours": "120 days", "180 jours": "180 days", "365 jours": "365 days",
    "1 proposition": "1 proposal", "Refonte complète": "Full redesign", "Complète": "Full", "Principales et secondaires": "Primary and secondary",
    "5 au choix": "5 of your choice", OPT_LOGO: "Not included — option from $200", OPT_LOGO: "Not included — option from $200", "Complets": "Complete", "Dédié": "Dedicated", "Haute performance": "High performance", "Haute capacité": "High capacity",
}
GROUP_TITLES_EN = {
    "Design et conception": "Design and build", "Marque et identité": "Brand and identity", "Fonctionnalités": "Features", "CRM": "CRM",
    "Contenu": "Content", "Référencement": "SEO", "Suivi et mesure": "Tracking and measurement", "Infrastructure": "Infrastructure",
    "Livraison et accompagnement": "Delivery and support", "Création": "Creation", "Logo et déclinaisons": "Logo and variants",
    "Système de marque": "Brand system", "Livrables et révisions": "Deliverables and revisions", "Ce qui est inclus": "What’s included",
    "Ressources": "Resources", "Services": "Services",
}
LABELS_EN = {
    "Pages incluses": "Pages included", "Design à partir de nos modèles professionnels": "Design built from our professional templates",
    "Design adapté à votre image de marque": "Design adapted to your brand image", "Conception UX/UI originale": "Original UX/UI design",
    "Design entièrement personnalisé": "Fully custom design", "Développement sur mesure": "Custom development", "Adapté à tous les écrans (mobile, tablette, ordinateur)": "Works on every screen (mobile, tablet, desktop)",
    "Architecture orientée conversion": "Conversion-oriented architecture", "Logo et identité visuelle": "Logo and visual identity",
    "3 pistes créatives": "3 creative directions", "Variantes horizontale, verticale et icône": "Horizontal, vertical and icon variants",
    "Couleurs et typographies": "Colours and typefaces", "Fichiers sources du logo": "Logo source files", "Rondes de corrections du logo": "Logo revision rounds",
    "Identité visuelle complète incluse": "Full visual identity included", "Planche d’inspiration": "Mood board", "Palette de couleurs": "Colour palette",
    "Typographies": "Typefaces", "Éléments graphiques": "Graphic elements", "Iconographie": "Iconography", "Mini-guide de marque": "Mini brand guide",
    "Modèles de supports": "Collateral templates", "Rebranding complet inclus": "Full rebranding included", "Analyse de la marque existante": "Analysis of the existing brand",
    "Atelier stratégique": "Strategy workshop", "Positionnement de marque": "Brand positioning", "Messages de marque": "Brand messaging",
    "Refonte complète du logo": "Complete logo redesign", "Nouvel univers visuel": "New visual universe", "Guide de marque complet": "Full brand guide",
    "Préparation du lancement": "Launch preparation", "Site bilingue FR / EN": "Bilingual site FR / EN", "Site bilingue FR / EN": "Bilingual site FR / EN", "Formulaire de contact": "Contact form", "Formulaire avancé anti-pourriel": "Advanced anti-spam form",
    "Réservation Cal.com intégrée": "Built-in Cal.com booking", "Intégrations avec des logiciels externes": "Integrations with external software",
    "Espace client ou espace membre": "Client or member area", "Workflows personnalisés": "Custom workflows",
    "Automatisations entre le site, le CRM et les logiciels externes": "Automations between the site, the CRM and external software",
    "Automatisations avancées": "Advanced automations", "Fonctionnalités métier personnalisées": "Custom business features",
    "CRM personnalisé": "Custom CRM", "Utilisateurs CRM": "CRM users", "Gestion des prospects et clients": "Lead and client management",
    "Pipeline de vente personnalisé": "Custom sales pipeline", "Tableau de bord CRM": "CRM dashboard", "Formulaires connectés au CRM": "Forms connected to the CRM",
    "Tableaux de bord personnalisés": "Custom dashboards", "Sauvegardes CRM": "CRM backups", "Intégration de vos textes, photos et logo": "Integration of your text, photos and logo",
    "CMS / blogue": "CMS / blog", "Articles de blogue": "Blog articles", "Publication": "Publishing", "Préparation et révision avec le client": "Preparation and review with the client",
    "Rédaction et optimisation des pages principales": "Copywriting and optimization of the main pages", "Référencement de base (titres, descriptions, structure des pages)": "Basic SEO (titles, descriptions, page structure)",
    "Optimisation technique (vitesse, mobile, indexation)": "Technical optimization (speed, mobile, indexing)",
    "Optimisation du contenu de chaque page (SEO on-page)": "Content optimization of every page (on-page SEO)", "SEO local avancé": "Advanced local SEO",
    "Architecture SEO approfondie": "In-depth SEO architecture", "Données structurées avancées": "Advanced structured data",
    "Google Analytics": "Google Analytics", "Google Search Console": "Google Search Console", "Google Tag Manager": "Google Tag Manager",
    "Suivi des conversions": "Conversion tracking", "Suivi des formulaires": "Form tracking", "Suivi des demandes de soumission": "Quote request tracking",
    "Suivi des réservations": "Booking tracking", "Suivi des interactions téléphoniques": "Phone interaction tracking", "Tableau de bord de performance": "Performance dashboard",
    "Certificat SSL (site sécurisé HTTPS)": "SSL certificate (secure HTTPS site)", "Plan du site (sitemap) pour Google": "Sitemap for Google", "Mise en ligne": "Go-live", "Hébergement du site": "Site hosting", "VPS KVM inclus": "KVM VPS included",
    "vCPU": "vCPU", "RAM": "RAM", "Stockage NVMe": "NVMe storage", "Rondes de corrections": "Revision rounds", "Formation": "Training",
    "Support prioritaire": "Priority support", "Accompagnement après lancement": "Post-launch support", "Garantie": "Warranty",
    # Logo
    "Pistes créatives": "Creative directions", "Création à partir d’une idée ou direction claire": "Created from a clear idea or direction",
    "Développement de la piste choisie": "Development of the chosen direction", "Direction artistique": "Art direction",
    "Analyse de la marque actuelle": "Analysis of the current brand", "Audit de l’identité existante": "Audit of the existing identity",
    "Atelier stratégique avec le client": "Strategy workshop with the client", "Travail sur le positionnement": "Positioning work",
    "Travail sur les messages de marque": "Brand messaging work", "Logo principal": "Primary logo", "Versions couleur et noir et blanc": "Colour and black-and-white versions",
    "Mini-guide d’utilisation de la marque": "Mini brand usage guide", "Adaptation des principaux supports existants": "Adaptation of the main existing collateral",
    "Fichiers PNG, JPG et SVG": "PNG, JPG and SVG files", "Fichiers sources": "Source files",
    "Préparation du déploiement de la nouvelle marque": "Preparation of the new brand rollout", "Accompagnement au lancement": "Launch support",
    # Hébergement / VPS
    "Hébergement du site web": "Website hosting", "Infrastructure standard": "Standard infrastructure", "Sauvegardes": "Backups",
    "Surveillance technique": "Technical monitoring", "Maintenance du site": "Site maintenance", "Correctifs techniques": "Technical fixes",
    "Assistance en cas de problème": "Assistance when something breaks", "Serveur VPS dédié": "Dedicated VPS server",
    "Hébergement d’application / CRM": "Application / CRM hosting", "Gestion de l’infrastructure": "Infrastructure management",
}


def translate_groups(groups_fr):
    out = []
    for title, spec in groups_fr:
        rows_en = []
        for r in spec:
            label, cells = r[0], r[1]
            cells_en = [T.get(c, c) if c not in ("y", N) else c for c in cells]
            rows_en.append((LABELS_EN[label], cells_en) + ((1,) if len(r) > 2 and r[2] else ()))
        out.append((GROUP_TITLES_EN[title], rows_en))
    return out


LOGO_PLANS_FR = [("Logo Express", 200, "1 proposition"), ("Logo professionnel", 650, "3 pistes créatives"),
                 ("Identité visuelle", 1800, "Système de marque"), ("Rebranding complet", 5500, "Marque repensée")]
LOGO_PLANS_EN = [("Express logo", 200, "1 proposal"), ("Professional logo", 650, "3 creative directions"),
                 ("Visual identity", 1800, "Brand system"), ("Full rebranding", 5500, "Brand rethought")]
LOGO_GROUPS_FR = [
    ("Création", [
        ("Pistes créatives", ["1 proposition", "3", "3", "Refonte complète"]),
        ("Création à partir d’une idée ou direction claire", ["y", "y", "y", "y"]),
        ("Développement de la piste choisie", [N, "y", "y", "y"]),
        ("Planche d’inspiration", [N, N, "y", "y"]),
        ("Direction artistique", [N, N, "y", "Complète"]),
        ("Analyse de la marque actuelle", [N, N, N, "y"]),
        ("Audit de l’identité existante", [N, N, N, "y"]),
        ("Atelier stratégique avec le client", [N, N, N, "y"]),
        ("Travail sur le positionnement", [N, N, N, "y"]),
        ("Travail sur les messages de marque", [N, N, N, "y"]),
    ]),
    ("Logo et déclinaisons", [
        ("Logo principal", [N, "y", "y", "y"]),
        ("Variantes horizontale, verticale et icône", [N, "y", "y", "y"]),
        ("Versions couleur et noir et blanc", ["y", "y", "y", "y"]),
        ("Nouvel univers visuel", [N, N, N, "y"]),
    ]),
    ("Système de marque", [
        ("Palette de couleurs", [N, "y", "Complète", "Complète"]),
        ("Typographies", [N, "y", "Principales et secondaires", "y"]),
        ("Éléments graphiques", [N, N, "y", "y"]),
        ("Iconographie", [N, N, "y", "y"]),
        ("Mini-guide d’utilisation de la marque", [N, N, "y", "y"]),
        ("Guide de marque complet", [N, N, N, "y"]),
        ("Modèles de supports", [N, N, "5 au choix", "Corporatifs"]),
        ("Adaptation des principaux supports existants", [N, N, N, "y"]),
    ]),
    ("Livrables et révisions", [
        ("Fichiers PNG, JPG et SVG", ["y", "y", "y", "y"]),
        ("Fichiers sources", [N, "y", "y", "Complets"]),
        ("Préparation du déploiement de la nouvelle marque", [N, N, N, "y"]),
        ("Accompagnement au lancement", [N, N, N, "y"]),
        ("Rondes de corrections", ["1", "2", "3", "4"]),
    ]),
]

HOST_PLANS_FR = [("Hébergement simple", 35, "Sans maintenance"), ("Hébergement + maintenance", 79, "Suivi et correctifs")]
HOST_PLANS_EN = [("Simple hosting", 35, "No maintenance"), ("Hosting + maintenance", 79, "Monitoring and fixes")]
HOST_GROUPS_FR = [
    ("Ce qui est inclus", [
        ("Hébergement du site web", ["y", "y"]), ("Certificat SSL (site sécurisé HTTPS)", ["y", "y"]), ("Mise en ligne", ["y", "y"]), ("Infrastructure standard", ["y", "y"]),
        ("Sauvegardes", [N, "y"]), ("Surveillance technique", [N, "y"]), ("Maintenance du site", [N, "y"]),
        ("Correctifs techniques", [N, "y"]), ("Assistance en cas de problème", [N, "y"]),
    ]),
]

VPS_PLANS_FR = [("VPS KVM 1", 45, "1 vCPU · 4 Go"), ("VPS KVM 2", 65, "2 vCPU · 8 Go"), ("VPS KVM 4", 100, "4 vCPU · 16 Go"), ("VPS KVM 8", 150, "8 vCPU · 32 Go")]
VPS_PLANS_EN = [("VPS KVM 1", 45, "1 vCPU · 4 GB"), ("VPS KVM 2", 65, "2 vCPU · 8 GB"), ("VPS KVM 4", 100, "4 vCPU · 16 GB"), ("VPS KVM 8", 150, "8 vCPU · 32 GB")]
VPS_GROUPS_FR = [
    ("Ressources", [
        ("Serveur VPS dédié", ["Dédié", "Dédié", "Haute performance", "Haute capacité"]),
        ("vCPU", ["1", "2", "4", "8"]), ("RAM", ["4 Go", "8 Go", "16 Go", "32 Go"]), ("Stockage NVMe", ["50 Go", "100 Go", "200 Go", "400 Go"]),
    ]),
    ("Services", [
        ("Hébergement d’application / CRM", ["y", "y", "y", "y"]), ("Certificat SSL (site sécurisé HTTPS)", ["y", "y", "y", "y"]),
        ("Sauvegardes", ["y", "y", "y", "y"]), ("Gestion de l’infrastructure", ["y", "y", "y", "y"]),
    ]),
]


def plans(spec, price_fn, monthly=False):
    out = []
    for n, a, m, *who in spec:
        p = OrderedDict(name=n, price=price_fn(a, monthly), meta=m)
        if who:
            p["who"] = who[0]
        out.append(p)
    return out


def groups(spec):
    return [OrderedDict(title=t, rows=rows(r)) for t, r in spec]


RANGE_KEYS = ["demarrage", "croissance", "entreprise"]  # parametre d URL `gamme=`, identique FR/EN


def ranges(spec):
    return [OrderedDict(key=RANGE_KEYS[i], title=t, line=l, range=r, plans=p) for i, (t, l, r, p) in enumerate(spec)]


FR = OrderedDict([
    ("meta", OrderedDict(title="Prix — Forfaits de site web, logo, hébergement et serveurs | Talgasy Web",
                         description="Des forfaits clairs, du premier site au sur-mesure : sites web, logo et identité de marque, hébergement et serveurs VPS. Comparez ligne par ligne et réservez un appel gratuit.")),
    ("breadcrumb", "Prix"),
    ("heroTitleA", "Des forfaits "), ("heroHighlight", "clairs"), ("heroTitleB", ", du premier site au sur-mesure."),
    ("heroSubtitle", "Sites web, logo et identité de marque, hébergement et serveurs. Choisissez une catégorie, puis comparez les forfaits ligne par ligne."),
    ("cta", "Réserver un appel gratuit"), ("viewPlans", "Voir les forfaits"), ("kicker", "Forfaits"),
    ("labels", OrderedDict([
        ("families", "Catégories de forfaits"), ("plansCount", "{n} forfaits"), ("plansCountOne", "1 forfait"),
        ("rangesLabel", "Gammes"), ("shownInTable", "Gamme affichée"), ("compareRange", "Comparer cette gamme"),
        ("detailed", "Comparaison détaillée"), ("diffOnly", "Afficher seulement les différences"),
        ("compare", "Comparer les forfaits"), ("allRows", "Toutes les lignes sont affichées."), ("diffRows", "Seules les lignes qui diffèrent sont affichées."),
        ("lines", "{n} lignes"), ("lineOne", "1 ligne"), ("book", "Réserver un appel"), ("bookShort", "Réserver un appel"),
        ("included", "Inclus"), ("notIncluded", "Non inclus"), ("pickPlan", "Choisir un forfait"), ("collapse", "Replier"), ("expand", "Déplier"),
    ])),
    ("families", [
        OrderedDict(key="site", label="Site web", title="Site web",
                    desc="Trois gammes, neuf forfaits, des prix affichés. Vous hésitez entre deux ? Un appel gratuit suffit pour vous orienter.",
                    plans=plans(SITE_PLANS_FR, fr_price), ranges=ranges(RANGES_FR), groups=groups(SITE_GROUPS_FR)),
        OrderedDict(key="logo", label="Logo et identité de marque", title="Logo et identité de marque",
                    desc="Du logo simple à la refonte complète de la marque, avec les fichiers sources dans tous les cas.",
                    plans=plans(LOGO_PLANS_FR, fr_price), ranges=[], groups=groups(LOGO_GROUPS_FR)),
        OrderedDict(key="host", label="Hébergement", title="Hébergement",
                    desc="Une solution simple et fiable pour assurer la mise en ligne et le maintien de votre site web.",
                    plans=plans(HOST_PLANS_FR, fr_price, True), ranges=[], groups=groups(HOST_GROUPS_FR)),
        OrderedDict(key="vps", label="Serveurs VPS", title="Serveurs VPS",
                    desc="Serveurs dédiés pour héberger une application ou un CRM, gérés de bout en bout.",
                    plans=plans(VPS_PLANS_FR, fr_price, True), ranges=[], groups=groups(VPS_GROUPS_FR)),
    ]),
])

EN = OrderedDict([
    ("meta", OrderedDict(title="Pricing — Website, logo, hosting and server plans | Talgasy Web",
                         description="Clear plans, from a first site to fully custom builds: websites, logo and brand identity, hosting and VPS servers. Compare line by line and book a free call.")),
    ("breadcrumb", "Pricing"),
    ("heroTitleA", "Clear "), ("heroHighlight", "plans"), ("heroTitleB", ", from your first site to fully custom."),
    ("heroSubtitle", "Websites, logo and brand identity, hosting and servers. Pick a category, then compare the plans line by line."),
    ("cta", "Book a free call"), ("viewPlans", "See the plans"), ("kicker", "Plans"),
    ("labels", OrderedDict([
        ("families", "Plan categories"), ("plansCount", "{n} plans"), ("plansCountOne", "1 plan"),
        ("rangesLabel", "Ranges"), ("shownInTable", "Range shown"), ("compareRange", "Compare this range"),
        ("detailed", "Detailed comparison"), ("diffOnly", "Show differences only"),
        ("compare", "Compare the plans"), ("allRows", "All rows are shown."), ("diffRows", "Only rows that differ are shown."),
        ("lines", "{n} rows"), ("lineOne", "1 row"), ("book", "Book a call"), ("bookShort", "Book a call"),
        ("included", "Included"), ("notIncluded", "Not included"), ("pickPlan", "Pick a plan"), ("collapse", "Collapse"), ("expand", "Expand"),
    ])),
    ("families", [
        OrderedDict(key="site", label="Website", title="Website",
                    desc="Three ranges, nine plans, prices shown. Torn between two? One free call is enough to point you in the right direction.",
                    plans=plans(SITE_PLANS_EN, en_price), ranges=ranges(RANGES_EN), groups=groups(translate_groups(SITE_GROUPS_FR))),
        OrderedDict(key="logo", label="Logo and brand identity", title="Logo and brand identity",
                    desc="From a simple logo to a complete brand overhaul, with source files in every case.",
                    plans=plans(LOGO_PLANS_EN, en_price), ranges=[], groups=groups(translate_groups(LOGO_GROUPS_FR))),
        OrderedDict(key="host", label="Hosting", title="Hosting",
                    desc="A simple, reliable way to get your website online and keep it running.",
                    plans=plans(HOST_PLANS_EN, en_price, True), ranges=[], groups=groups(translate_groups(HOST_GROUPS_FR))),
        OrderedDict(key="vps", label="VPS servers", title="VPS servers",
                    desc="Dedicated servers to host an application or a CRM, managed end to end.",
                    plans=plans(VPS_PLANS_EN, en_price, True), ranges=[], groups=groups(translate_groups(VPS_GROUPS_FR))),
    ]),
])

# FAQ « Combien ça coûte ? » : alignée sur les nouveaux prix (499 $, 200 $, 35 $ / mois).
# Accueil : « {link} » devient un lien vers la page Prix (libellé `aLink`) ; page Prix : variante `aPricing`.
FAQ_PRICE_FR = OrderedDict(
    a=f"Un site web commence à 499{NNB}$, un logo à 200{NNB}$ et l’hébergement à 35{NNB}$ par mois. Chaque forfait et ses inclusions sont détaillés sur la {{link}}. Si votre projet sort du cadre, on vous donne un prix ferme après un appel gratuit.",
    aLink="page Prix",
    aPricing=f"Un site web commence à 499{NNB}$, un logo à 200{NNB}$ et l’hébergement à 35{NNB}$ par mois. Les inclusions exactes de chaque forfait sont dans les tableaux ci-dessus. Si votre projet sort du cadre, on vous donne un prix ferme après un appel de consultation gratuit.",
)
FAQ_PRICE_EN = OrderedDict(
    a="A website starts at $499, a logo at $200 and hosting at $35 per month. Every plan and what it includes is detailed on the {link}. If your project falls outside these plans, we give you a firm price after a free call.",
    aLink="Pricing page",
    aPricing="A website starts at $499, a logo at $200 and hosting at $35 per month. The exact inclusions of every plan are in the tables above. If your project falls outside these plans, we give you a firm price after a free consultation call.",
)


def inject(path, pricing, faq_answer):
    d = json.load(io.open(path, encoding="utf-8"), object_pairs_hook=OrderedDict)
    d["pricing"] = pricing
    # Réponse « Combien ça coûte ? » = premier item de la FAQ.
    d["faq"]["items"][0].update(faq_answer)
    io.open(path, "w", encoding="utf-8", newline="\n").write(json.dumps(d, ensure_ascii=False, indent=2) + "\n")
    print(path, "ok —", len(pricing["families"]), "familles,", sum(len(f["plans"]) for f in pricing["families"]), "forfaits")


inject("src/lib/i18n/dictionaries/fr.json", FR, FAQ_PRICE_FR)
inject("src/lib/i18n/dictionaries/en.json", EN, FAQ_PRICE_EN)
