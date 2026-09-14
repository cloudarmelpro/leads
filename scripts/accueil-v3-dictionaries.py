# -*- coding: utf-8 -*-
"""Aligne les dictionnaires FR/EN sur la maquette « Talgasy Web - Accueil » (v3) :
huit services, intro FAQ courte, bandeau d'appel, pied de page à trois colonnes,
bulle d'appel directe. Idempotent — relançable après une modification manuelle.

Usage : python scripts/accueil-v3-dictionaries.py
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "src" / "lib" / "i18n" / "dictionaries"

FR = {
    "services": {
        "intro": "Huit services clairs, pensés pour les entreprises et commerces du Québec.",
        "extra": [
            {
                "name": "Logo et identité de marque",
                "note": "Du logo seul à l’identité complète : pistes créatives, variantes, palette, typographies et fichiers sources. Une refonte de marque au complet est possible, avec guide et préparation du lancement.",
            },
            {
                "name": "Serveurs VPS",
                "note": "Pour une application ou un CRM qui demande plus qu’un site vitrine : de 1 à 8 vCPU, 4 à 32 Go de RAM et du stockage NVMe, gérés et surveillés de notre côté.",
            },
            {
                "name": "CRM et automatisations",
                "note": "Un CRM à votre image : prospects, pipeline de vente, tableau de bord et formulaires connectés. Les automatisations relient le site, le CRM et vos logiciels externes.",
            },
            {
                "name": "Blogue et contenu SEO",
                "note": "CMS intégré, articles rédigés et publiés à cadence régulière, révisés avec vous. Le contenu est structuré pour le référencement local dès la mise en ligne.",
            },
        ],
    },
    "faqIntro": "Vous avez des questions avant de démarrer votre projet ?",
    "final": {
        "title": "Votre prochain contrat commence par un appel.",
        "body": "Une consultation suffit pour cerner votre besoin. Sans engagement.",
        "callLabel": "Appelez-nous",
        "note": "Réponse en moins de 24 h, du lundi au vendredi.",
    },
    "footer": {
        "description": "Talgasy Web conçoit des sites web professionnels et bilingues au Québec — construits pour transformer vos visiteurs en appels.",
        "navTitle": "Plan du site",
        "resourcesTitle": "Ressources",
    },
    "floating": {"aria": "Appeler Talgasy Web"},
}

EN = {
    "services": {
        "intro": "Eight clear services, built for Québec businesses and shops.",
        "extra": [
            {
                "name": "Logo and brand identity",
                "note": "From a standalone logo to a full identity: creative directions, variants, palette, typefaces and source files. A complete rebrand is possible, with a brand guide and launch preparation.",
            },
            {
                "name": "VPS servers",
                "note": "For an application or a CRM that needs more than a showcase site: 1 to 8 vCPUs, 4 to 32 GB of RAM and NVMe storage, managed and monitored on our side.",
            },
            {
                "name": "CRM and automations",
                "note": "A CRM in your image: leads, sales pipeline, dashboard and connected forms. Automations link the site, the CRM and your external software.",
            },
            {
                "name": "Blog and SEO content",
                "note": "Built-in CMS, articles written and published on a regular cadence, reviewed with you. Content is structured for local search from day one.",
            },
        ],
    },
    "faqIntro": "Have questions before starting your project?",
    "final": {
        "title": "Your next contract starts with a phone call.",
        "body": "One consultation is enough to pin down your need. No commitment.",
        "callLabel": "Call us",
        "note": "Reply within 24 hours, Monday to Friday.",
    },
    "footer": {
        "description": "Talgasy Web builds professional, bilingual websites in Québec — built to turn your visitors into calls.",
        "navTitle": "Site map",
        "resourcesTitle": "Resources",
    },
    "floating": {"aria": "Call Talgasy Web"},
}


def apply(path: Path, data: dict) -> None:
    d = json.loads(path.read_text(encoding="utf-8"))

    d["services"]["intro"] = data["services"]["intro"]
    base = d["services"]["items"][:4]
    d["services"]["items"] = base + data["services"]["extra"]

    d["faq"]["intro"] = data["faqIntro"]

    d["final"] = data["final"]

    d["footer"]["description"] = data["footer"]["description"]
    d["footer"]["navTitle"] = data["footer"]["navTitle"]
    d["footer"]["resourcesTitle"] = data["footer"]["resourcesTitle"]

    d["floating"] = data["floating"]

    # La carte « secteur non listé » n'existe plus dans la maquette.
    d["hero"].pop("tradesCta", None)
    d["hero"].pop("tradesCardTitle", None)

    path.write_text(json.dumps(d, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("ok", path.name, len(d["services"]["items"]), "services")


apply(ROOT / "fr.json", FR)
apply(ROOT / "en.json", EN)
