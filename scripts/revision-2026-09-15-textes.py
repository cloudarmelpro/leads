# -*- coding: utf-8 -*-
"""Textes du « Rapport de révision — Accueil, À propos, Blogue, Contact » (2026-09-14),
points fermes seulement (sans ✱) : E17, E20/T29, E22, E23, E27, E28, T16, T17, T18, T19,
T20, T21, T24, T26, T27, T28, T30, R7, R9, R11, E14, E29 (liste `blog.topics` retirée,
dérivée des articles). Idempotent.

Usage : python scripts/revision-2026-09-15-textes.py
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "src" / "lib" / "i18n" / "dictionaries"


def apply(path: Path, lang: str) -> None:
    d = json.loads(path.read_text(encoding="utf-8"))
    fr = lang == "fr"

    # E17 — « Blogue » partout en français (URL /blog inchangée)
    if fr:
        d["nav"]["blog"] = "Blogue"
        d["blog"]["meta"]["title"] = d["blog"]["meta"]["title"].replace("Blog — ", "Blogue — ")
        d["blog"]["title"] = "Idées et"  # T26

    # E29 — la liste de sujets du hero est dérivée des catégories des articles
    d["blog"].pop("topics", None)

    # T19 — second bouton du hero vers la page Prix
    d["hero"]["ctaPricing"] = "Voir les forfaits et les prix" if fr else "See plans and pricing"
    # E22 — les secteurs ne sont pas interactifs : phrase d'appui honnête
    d["hero"]["demoCaption"] = (
        "Paysagement, excavation, construction, rénovation, déneigement, commerce local : on connaît vos clients, et votre site leur parlera dans leurs mots."
        if fr
        else "Landscaping, excavation, construction, renovation, snow removal, local retail: we know your customers, and your site will speak their language."
    )
    # R7 — textes alternatifs descriptifs des photos de secteurs
    alts_fr = [
        "Chantier de paysagement résidentiel", "Chantier d’excavation avec pelle mécanique", "Chantier de construction en bois",
        "Salle de bain rénovée", "Vitrine d’un commerce local", "Déneigement d’une entrée résidentielle", "Élagage d’un arbre par un arboriculteur",
    ]
    alts_en = [
        "Residential landscaping job site", "Excavation site with a digger", "Wood-frame construction site",
        "Renovated bathroom", "Local shop storefront", "Snow removal on a residential driveway", "Arborist pruning a tree",
    ]
    for demo, alt in zip(d["hero"]["demos"], alts_fr if fr else alts_en):
        demo["imgLabel"] = alt

    # T20 — carte « Refonte de site existant »
    d["services"]["items"][1]["note"] = (
        "On analyse ce qui existe, on identifie ce qui bloque la conversion, puis on retravaille chaque élément — structure, vitesse, contenu — pour un site qui pousse le visiteur à vous contacter."
        if fr
        else "We analyze what’s there, pinpoint what’s blocking conversion, then rework every element — structure, speed, content — for a site that pushes the visitor to contact you."
    )

    # E23 / T21 — Méthode 02 et 03
    steps = d["method"]["steps"]
    steps[1]["desc"] = (
        "On regarde votre site actuel et votre marché : un constat honnête de ce qui fonctionne, de ce qui manque et de ce qui rapporterait le plus."
        if fr
        else "We look at your current site and your market: an honest read of what works, what’s missing and what would pay off the most."
    )
    steps[2]["title"] = "On planifie une stratégie, pas juste un site" if fr else "We plan a strategy, not just a site"
    steps[2]["desc"] = steps[2]["desc"].replace("des leads qualifiés", "des demandes qualifiées").replace("qualified leads", "qualified requests")

    # T16 / T17 — FAQ
    d["faq"]["intro"] = "Les questions qu’on nous pose avant chaque projet, et nos réponses." if fr else "The questions we get before every project, and our answers."
    d["faq"]["items"][7]["a"] = (
        "Chaque site est construit selon les bonnes pratiques SEO : vitesse, mobile, structure des pages et contenu local. Google décide du classement final, mais votre site part avec les bonnes bases."
        if fr
        else "Every site is built to SEO best practices: speed, mobile, page structure and local content. Google decides the final ranking, but your site starts on solid ground."
    )

    # T12, T14, T15 (validés le 2026-09-15) — réponses alignées sur l'« Offre de services » de
    # Cedric (PDF) : Cal.com dès Croissance, CMS/blogue et articles dès Professionnel.
    d["faq"]["items"][1]["a"] = (
        "Un forfait Démarrage est en ligne en 3 à 5 jours ouvrables si vos textes et vos photos sont prêts. Les forfaits Croissance et Entreprise prennent quelques semaines, selon l’ampleur du projet."
        if fr
        else "A Starter plan is online in 3 to 5 business days if your text and photos are ready. Growth and Enterprise plans take a few weeks, depending on the scope of the project."
    )
    # T13 (validé le 2026-09-15) : rédaction incluse dès Signature seulement, sur devis ailleurs.
    d["faq"]["items"][2]["a"] = (
        "C’est la situation la plus courante. On vous guide pour préparer vos textes et vos photos, quel que soit le forfait. La rédaction de vos pages est incluse à partir du forfait Signature et disponible sur devis pour les autres."
        if fr
        else "It’s the most common situation. We guide you in preparing your text and photos, whatever the plan. Copywriting for your pages is included from the Signature plan and available on quote for the others."
    )
    d["faq"]["items"][5]["a"] = (
        "Votre site offre plusieurs façons de vous joindre : formulaire, courriel, téléphone et liens vers vos réseaux sociaux. La prise de rendez-vous en ligne est incluse à partir du forfait Croissance."
        if fr
        else "Your site offers several ways to reach you: form, email, phone and links to your social networks. Online booking is included from the Growth plan."
    )
    d["faq"]["items"][6]["a"] = (
        "Oui. Le blogue est conçu pour que vous publiiez vous-même, sans connaissances techniques. Il est inclus à partir du forfait Professionnel, avec des articles rédigés pour vous pendant 12 ou 24 mois. Si vous préférez, on s’en charge."
        if fr
        else "Yes. The blog is designed so you can publish yourself, with no technical knowledge. It’s included from the Professional plan, with articles written for you for 12 or 24 months. If you prefer, we handle it."
    )

    # A5 (validé le 2026-09-15) — repère de prix sous les cartes de services de l'Accueil, tiré du
    # PDF, complété par les décisions du 2026-09-15 (refonte = forfaits de création ; courriel = avec
    # l'hébergement). Les liens vers la page Prix sont dans le composant (paramètres identiques FR/EN).
    NNB = " "
    pricing_lines = {
        0: f"À partir de 499{NNB}$" if fr else "From $499",
        1: f"Mêmes forfaits que la création, à partir de 499{NNB}$" if fr else "Same plans as a new site, from $499",
        2: f"À partir de 35{NNB}$ par mois" if fr else "From $35 per month",
        3: "Inclus avec l’hébergement" if fr else "Included with hosting",
        4: f"À partir de 200{NNB}$" if fr else "From $200",
        5: f"De 45{NNB}$ à 150{NNB}$ par mois" if fr else "From $45 to $150 per month",
        6: "Inclus à partir du forfait Professionnel" if fr else "Included from the Professional plan",
        7: "Inclus à partir du forfait Professionnel" if fr else "Included from the Professional plan",
    }
    for i, item in enumerate(d["services"]["items"]):
        if i in pricing_lines:
            item["pricing"] = pricing_lines[i]
        else:
            item.pop("pricing", None)

    # T18 + E19 (durée confirmée par Cedric le 2026-09-15 : 45 minutes) — bloc final et Méthode 01
    d["final"]["body"] = "Un appel gratuit de 45 minutes suffit pour cerner votre besoin. Sans engagement." if fr else "One free 45-minute call is enough to pin down your need. No commitment."
    steps[0]["desc"] = (
        "Un appel de 45 minutes. Vous parlez métier, on prend en note ce qui compte vraiment pour vos clients."
        if fr
        else "A 45-minute call. You talk trade, we note down what really matters to your customers."
    )

    # T22 (validé le 2026-09-15) — Méthode 06 : concret et vrai pour tous les forfaits
    # (analytics et hébergement varient selon le forfait, donc pas cités).
    steps[5]["desc"] = (
        "Mise en ligne sur votre domaine, avec la période d’hébergement de votre forfait. Vous recevez tous vos accès et le récapitulatif de ce qui a été livré."
        if fr
        else "Launch on your domain, with the hosting period included in your plan. You receive all your access credentials and a summary of what was delivered."
    )

    # E14 — libellé du bouton d'appel flottant ({phone} remplacé par le numéro de config/site.ts)
    d["floating"]["aria"] = "Appeler Talgasy Web au {phone}" if fr else "Call Talgasy Web at {phone}"

    # À propos — T24, « nous » (E27), E28, R9
    a = d["about"]
    a["story"]["items"][0]["body"] = (
        "On travaille aussi avec des entrepreneurs établis qui veulent moderniser leur présence en ligne et avoir enfin un site à la hauteur de l’entreprise qu’ils ont bâtie."
        if fr
        else "We also work with established entrepreneurs who want to modernize their online presence and finally have a website worthy of the business they’ve built."
    )
    a["story"]["items"][1]["body"] = (
        "Un site web n’est pas juste une présence sur Internet. C’est un outil qui doit servir l’entreprise : présenter clairement ce qu’elle fait, inspirer confiance et aider les clients à passer à l’action."
        if fr
        else "A website isn’t just a presence on the Internet. It’s a tool that has to serve the business: clearly present what it does, inspire trust and help clients take action."
    )
    # T23 (validé le 2026-09-15) — la section ne raconte pas une histoire : surtitre honnête.
    # Une vraie « Notre histoire » viendra si Cedric fournit fondateur, année, raison.
    a["story"]["kicker"] = "Pour qui on travaille" if fr else "Who we work for"
    a["principles"]["intro"] = "Un site doit vous amener des clients, pas seulement être beau." if fr else "A website should bring you customers, not just look good."
    # T25 (validé le 2026-09-15) — Qualité : promesse vérifiable plutôt qu'un adjectif.
    # Professionnalisme et Confiance attendent la confirmation de Cedric.
    a["principles"]["items"][0]["body"] = (
        "Chaque site est testé avant la mise en ligne : vitesse, affichage mobile, formulaires, référencement de base."
        if fr
        else "Every site is tested before launch: speed, mobile display, forms, basic SEO."
    )
    # Professionnalisme et Confiance (validés le 2026-09-15) : promesses vérifiables.
    a["principles"]["items"][1]["body"] = (
        "Des délais annoncés et tenus, un point d’avancement à chaque étape, et une seule personne responsable de votre projet du début à la fin."
        if fr
        else "Deadlines announced and kept, a progress update at every step, and a single person responsible for your project from start to finish."
    )
    a["principles"]["items"][2]["body"] = (
        "Des prix affichés, des engagements écrits, et un site dont vous gardez tous les accès."
        if fr
        else "Prices displayed, commitments in writing, and a website you keep full access to."
    )
    a["story"]["photoAlt"] = "Deux personnes travaillent ensemble sur un ordinateur portable dans un atelier" if fr else "Two people working together on a laptop in a workshop"
    a["principles"]["photoAlt"] = "Poste de travail avec deux écrans dans une pièce sombre" if fr else "Dual-screen workstation in a dim room"

    # Contact — T27, T28, T29 (E20), T30, R11
    c = d["contactPage"]
    c["booking"]["intro"] = (
        "Un appel découverte de 45 minutes, par téléphone ou en visio, sans engagement."
        if fr
        else "A 45-minute discovery call, by phone or video, no commitment."
    )
    c["booking"]["loadCta"] = "Afficher le calendrier de réservation" if fr else "Show the booking calendar"
    c["aside"]["zone"] = "Basés à Québec, on travaille partout au Québec." if fr else "Based in Québec City, we work all across Québec."
    c["aside"]["zoneBody"] = (
        "On travaille à distance avec des entreprises de toutes les régions. Réponse en moins de 24 h, du lundi au vendredi."
        if fr
        else "We work remotely with businesses from every region. Reply within 24 hours, Monday to Friday."
    )
    c["form"]["successBody"] = "Merci, on vous répond en moins de 24 h, du lundi au vendredi." if fr else "Thank you. We reply within 24 hours, Monday to Friday."

    path.write_text(json.dumps(d, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("ok", path.name)


apply(ROOT / "fr.json", "fr")
apply(ROOT / "en.json", "en")
