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

    # T18 + E19 (durée confirmée par Cedric le 2026-09-15 : 45 minutes) — bloc final et Méthode 01
    d["final"]["body"] = "Un appel gratuit de 45 minutes suffit pour cerner votre besoin. Sans engagement." if fr else "One free 45-minute call is enough to pin down your need. No commitment."
    steps[0]["desc"] = (
        "Un appel de 45 minutes. Vous parlez métier, on prend en note ce qui compte vraiment pour vos clients."
        if fr
        else "A 45-minute call. You talk trade, we note down what really matters to your customers."
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
    a["principles"]["intro"] = "Un site doit vous amener des clients, pas seulement être beau." if fr else "A website should bring you customers, not just look good."
    a["principles"]["items"][0]["body"] = (
        "On ne fait aucun compromis sur la qualité. Chaque détail est soigné afin d’offrir un résultat professionnel, crédible et à la hauteur de votre entreprise."
        if fr
        else "We make no compromise on quality. Every detail is refined to deliver a professional, credible result worthy of your business."
    )
    a["principles"]["items"][1]["body"] = (
        "On travaille avec sérieux, rigueur et transparence à chaque étape. De la première discussion jusqu’à la livraison, vous pouvez compter sur une équipe fiable et engagée dans la réussite de votre projet."
        if fr
        else "We work with seriousness, rigor and transparency at every step. From the first conversation to delivery, you can count on a reliable team committed to your project’s success."
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
