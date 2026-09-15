# -*- coding: utf-8 -*-
"""Applique au générateur `pricing-v3-data.py` les corrections du « Rapport de révision —
page Prix » (2026-09-14) qui ne dépendent pas d'une décision client : E1, E2, E3/T9, E5,
E6, T1, T3, T4, T7, T8, T10 (SSL, sitemap), A1, A2, Règle 4, amendement E18, FAQ T11/E21.
Idempotent (chaque remplacement est ignoré s'il a déjà été fait). Relance ensuite le générateur.

Usage : python scripts/revision-2026-09-15-prix.py
"""
import subprocess
import sys
from pathlib import Path

P = Path(__file__).resolve().parent / "pricing-v3-data.py"
s = P.read_text(encoding="utf-8")
done = 0


def rep(a, b):
    global s, done
    if b in s:
        return
    assert a in s, a[:90]
    s = s.replace(a, b, 1)
    done += 1


# E5 — précision des forfaits : « 5 pages », pas « Jusqu’à 5 pages »
for n in ("5", "7", "10", "15", "20", "30"):
    s = s.replace(f'"Jusqu’à {n} pages"', f'"{n} pages"').replace(f'"Up to {n} pages"', f'"{n} pages"')

# T4 — tagline Démarrage
rep('("Démarrage", "Un site propre, en ligne rapidement."', '("Démarrage", "Un site professionnel, en ligne en quelques jours."')
rep('("Starter", "A clean site, online fast."', '("Starter", "A professional site, online within days."')

# A1 — constante du statut du logo
rep('Y9 = ["y"] * 9\n', 'Y9 = ["y"] * 9\n# A1 (rapport de révision 2026-09-14) : statut du logo écrit noir sur blanc dans chaque colonne.\nOPT_LOGO = f"Non inclus — option à partir de 200{NNB}$"\n')

# T8 / E2 — Design et conception
rep('("Design à partir de composants professionnels éprouvés", [N, "y"', '("Design à partir de nos modèles professionnels", [N, "y"')
rep('("Personnalisation avancée du design", [N, N, "y"', '("Design adapté à votre image de marque", [N, N, "y"')
rep('("Responsive", [N, "Mobile et tablette", "Mobile, tablette et ordinateur", "Complet", "Complet", "Complet", "Complet", "Complet", "Complet"]),',
    '("Adapté à tous les écrans (mobile, tablette, ordinateur)", Y9),')

# A1 — ligne « Logo et identité visuelle » (remplace « Logo professionnel inclus »)
rep('("Logo professionnel inclus", [N, N, N, N, "y", "y", "y", "y", "y"]),',
    '("Logo et identité visuelle", [OPT_LOGO, OPT_LOGO, OPT_LOGO, OPT_LOGO, "Inclus", "Inclus", "Inclus", "Inclus", "Inclus"]),')

# A2 — Site bilingue
rep('    ("Fonctionnalités", [\n        ("Formulaire de contact", Y9),', '    ("Fonctionnalités", [\n        ("Site bilingue FR / EN", Y9),\n        ("Formulaire de contact", Y9),')

# E1 — Intégration des contenus
rep('("Intégration des contenus", ["Textes, photos et logo fournis par le client", "Textes, photos et logo", "y", "y", "y", "y", "y", "y", "y"]),',
    '("Intégration de vos textes, photos et logo", Y9),')

# E3 / T9 — Référencement : trois lignes explicites
rep('''        ("SEO de base", Y9),
        ("SEO technique essentiel", [N, "y", "y", "y", "y", "y", "y", "y", "y"]),
        ("SEO technique", [N, N, "y", "y", "y", "y", "y", "y", "y"]),
        ("SEO on-page", [N, N, "y", "Complet", "Complet", "Complet", "Complet", "Complet", "Complet"]),''',
    '''        ("Référencement de base (titres, descriptions, structure des pages)", Y9),
        ("Optimisation technique (vitesse, mobile, indexation)", [N, "y", "y", "y", "y", "y", "y", "y", "y"]),
        ("Optimisation du contenu de chaque page (SEO on-page)", [N, "y", "y", "Complet", "Complet", "Complet", "Complet", "Complet", "Complet"]),''')

# T10 — SSL / Sitemap (site, hébergement, VPS)
if '("SSL", ' in s:
    s = s.replace('("SSL", ', '("Certificat SSL (site sécurisé HTTPS)", ')
    done += 1
# Le 2026-09-15 la ligne est passée à Y9 (Express compris) : déjà appliqué si le nouveau libellé existe.
if '("Plan du site (sitemap) pour Google", ' not in s:
    rep('("Sitemap", [N, "y"', '("Plan du site (sitemap) pour Google", [N, "y"')

# Traductions EN des nouveaux libellés et cellules
rep('"Système": "System", "Système complet": "Full system",', '"Système": "System", "Système complet": "Full system", "Inclus": "Included",')
rep('"5 au choix": "5 of your choice",', '"5 au choix": "5 of your choice", OPT_LOGO: "Not included — option from $200",')
rep('"Design à partir de composants professionnels éprouvés": "Design built from proven professional components",',
    '"Design à partir de nos modèles professionnels": "Design built from our professional templates",')
rep('"Personnalisation avancée du design": "Advanced design customization",', '"Design adapté à votre image de marque": "Design adapted to your brand image",')
rep('"Responsive": "Responsive",', '"Adapté à tous les écrans (mobile, tablette, ordinateur)": "Works on every screen (mobile, tablet, desktop)",')
rep('"Logo professionnel inclus": "Professional logo included",', '"Logo et identité visuelle": "Logo and visual identity",')
rep('"Formulaire de contact": "Contact form",', '"Site bilingue FR / EN": "Bilingual site FR / EN", "Formulaire de contact": "Contact form",')
rep('"Intégration des contenus": "Content integration",', '"Intégration de vos textes, photos et logo": "Integration of your text, photos and logo",')
rep('''"SEO de base": "Basic SEO",
    "SEO technique essentiel": "Essential technical SEO", "SEO technique": "Technical SEO", "SEO on-page": "On-page SEO",''',
    '''"Référencement de base (titres, descriptions, structure des pages)": "Basic SEO (titles, descriptions, page structure)",
    "Optimisation technique (vitesse, mobile, indexation)": "Technical optimization (speed, mobile, indexing)",
    "Optimisation du contenu de chaque page (SEO on-page)": "Content optimization of every page (on-page SEO)",''')
rep('"SSL": "SSL", "Sitemap": "Sitemap",', '"Certificat SSL (site sécurisé HTTPS)": "SSL certificate (secure HTTPS site)", "Plan du site (sitemap) pour Google": "Sitemap for Google",')

# T1 / E18 / Règle 4 / T7 / E6 / T3 — textes de page et libellés
rep('sites web, logo et marque, hébergement et serveurs VPS.', 'sites web, logo et identité de marque, hébergement et serveurs VPS.')
rep('("heroSubtitle", "Sites web, logo et marque, hébergement et serveurs. Choisissez une famille, puis comparez ligne par ligne."),',
    '("heroSubtitle", "Sites web, logo et identité de marque, hébergement et serveurs. Choisissez une catégorie, puis comparez les forfaits ligne par ligne."),')
rep('("families", "Familles de forfaits"),', '("families", "Catégories de forfaits"),')
rep('("shownInTable", "Affiché dans le tableau"),', '("shownInTable", "Gamme affichée"),')
rep('("book", "Réserver un appel"), ("bookShort", "Réserver"),', '("book", "Réserver un appel"), ("bookShort", "Réserver un appel"),')
rep('desc="Chaque projet est différent. On commence par une consultation, puis on vous propose un prix clair.",',
    'desc="Trois gammes, neuf forfaits, des prix affichés. Vous hésitez entre deux ? Un appel gratuit suffit pour vous orienter.",')
rep('OrderedDict(key="logo", label="Logo et marque", title="Logo et marque",', 'OrderedDict(key="logo", label="Logo et identité de marque", title="Logo et identité de marque",')
rep('websites, logo and brand, hosting and VPS servers.', 'websites, logo and brand identity, hosting and VPS servers.')
rep('("heroSubtitle", "Websites, logo and brand, hosting and servers. Pick a family, then compare line by line."),',
    '("heroSubtitle", "Websites, logo and brand identity, hosting and servers. Pick a category, then compare the plans line by line."),')
rep('("families", "Plan families"),', '("families", "Plan categories"),')
rep('("shownInTable", "Shown in the table"),', '("shownInTable", "Range shown"),')
rep('("book", "Book a call"), ("bookShort", "Book"),', '("book", "Book a call"), ("bookShort", "Book a call"),')
rep('desc="Every project is different. We start with a consultation, then give you a clear price.",',
    'desc="Three ranges, nine plans, prices shown. Torn between two? One free call is enough to point you in the right direction.",')
rep('OrderedDict(key="logo", label="Logo and brand", title="Logo and brand",', 'OrderedDict(key="logo", label="Logo and brand identity", title="Logo and brand identity",')

# FAQ « Combien ça coûte ? » : variante Accueil (avec lien) + variante Prix (E21 / T11)
rep('''FAQ_PRICE_FR = ("Chaque projet est différent. On commence par une consultation pour bien cerner vos besoins, puis on vous propose un prix clair. "
                f"Un site web commence à 499{NNB}$, un logo à 200{NNB}$, et l’hébergement est à 35{NNB}$ par mois. Tous les forfaits sont détaillés sur notre page Prix.")
FAQ_PRICE_EN = ("Every project is different. We start with a consultation to understand your needs, then give you a clear price. "
                "A website starts at $499, a logo at $200, and hosting is $35 per month. Every plan is detailed on our Pricing page.")''',
    '''# Accueil : « {link} » devient un lien vers la page Prix (libellé `aLink`) ; page Prix : variante `aPricing`.
FAQ_PRICE_FR = OrderedDict(
    a=f"Un site web commence à 499{NNB}$, un logo à 200{NNB}$ et l’hébergement à 35{NNB}$ par mois. Chaque forfait et ses inclusions sont détaillés sur la {{link}}. Si votre projet sort du cadre, on vous donne un prix ferme après un appel gratuit.",
    aLink="page Prix",
    aPricing=f"Un site web commence à 499{NNB}$, un logo à 200{NNB}$ et l’hébergement à 35{NNB}$ par mois. Les inclusions exactes de chaque forfait sont dans les tableaux ci-dessus. Si votre projet sort du cadre, on vous donne un prix ferme après un appel de consultation gratuit.",
)
FAQ_PRICE_EN = OrderedDict(
    a="A website starts at $499, a logo at $200 and hosting at $35 per month. Every plan and what it includes is detailed on the {link}. If your project falls outside these plans, we give you a firm price after a free call.",
    aLink="Pricing page",
    aPricing="A website starts at $499, a logo at $200 and hosting at $35 per month. The exact inclusions of every plan are in the tables above. If your project falls outside these plans, we give you a firm price after a free consultation call.",
)''')
rep('    d["faq"]["items"][0]["a"] = faq_answer', '    d["faq"]["items"][0].update(faq_answer)')

P.write_text(s, encoding="utf-8", newline="\n")
print("remplacements appliqués :", done)
sys.exit(subprocess.call([sys.executable, str(P)]))
