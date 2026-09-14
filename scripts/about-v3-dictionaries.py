# -*- coding: utf-8 -*-
"""Aligne la section `about` des dictionnaires FR/EN sur la maquette
« Talgasy Web - A propos » : hero en trois morceaux (mot-clé vert), section
Notre histoire en trois cartes, Principes avec photo. Idempotent.

Usage : python scripts/about-v3-dictionaries.py
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "src" / "lib" / "i18n" / "dictionaries"

FR = {
    "breadcrumb": "À propos",
    "heroTitleA": "Talgasy Web est né d’une idée",
    "heroHighlight": "simple",
    "heroTitleB": " : aider les entrepreneurs à avancer.",
    "heroSubtitle": "Une agence web de Québec qui bâtit des sites clairs pour les entreprises d’ici. Pas de jargon, pas de boîte noire : un site qui fait sonner le téléphone.",
    "story": {
        "kicker": "Notre histoire",
        "title": "Pour ceux qui démarrent, et ceux qui grandissent",
        "intro": "Un bon départ fait toute la différence. On donne aux nouvelles entreprises des bases solides pour présenter leur travail et gagner leurs premiers clients.",
        "photoAlt": "Rencontre entre un entrepreneur et l’équipe Talgasy Web",
        "titles": ["Des entreprises déjà établies", "Un outil, pas une vitrine", "Contribuer à la réussite d’ici"],
    },
    "principles": {
        "photoAlt": "L’équipe Talgasy Web au travail",
    },
}

EN = {
    "breadcrumb": "About",
    "heroTitleA": "Talgasy Web was born from a",
    "heroHighlight": "simple",
    "heroTitleB": " idea: helping entrepreneurs move forward.",
    "heroSubtitle": "A Québec web agency that builds clear websites for local businesses. No jargon, no black box: a website that makes the phone ring.",
    "story": {
        "kicker": "Our story",
        "title": "For those starting out, and those growing",
        "intro": "A strong start makes all the difference. We give new businesses solid foundations to showcase their work and win their first clients.",
        "photoAlt": "Meeting between an entrepreneur and the Talgasy Web team",
        "titles": ["Well-established businesses", "A tool, not a showcase", "Contributing to local success"],
    },
    "principles": {
        "photoAlt": "The Talgasy Web team at work",
    },
}


def apply(path: Path, data: dict) -> None:
    d = json.loads(path.read_text(encoding="utf-8"))
    about = d["about"]

    # Les trois cartes reprennent les paragraphes 3 à 5 du récit existant (mot pour mot).
    paragraphs = about.get("story")
    if isinstance(paragraphs, list):
        bodies = paragraphs[2:5]
    else:
        bodies = [item["body"] for item in about["story"]["items"]]

    principles = about["principles"]
    new = {
        "meta": about["meta"],
        "breadcrumb": data["breadcrumb"],
        "heroTitleA": data["heroTitleA"],
        "heroHighlight": data["heroHighlight"],
        "heroTitleB": data["heroTitleB"],
        "heroSubtitle": data["heroSubtitle"],
        "story": {
            "kicker": data["story"]["kicker"],
            "title": data["story"]["title"],
            "intro": data["story"]["intro"],
            "photoAlt": data["story"]["photoAlt"],
            "items": [{"title": t, "body": b} for t, b in zip(data["story"]["titles"], bodies)],
        },
        "principles": {
            "kicker": principles["kicker"],
            "title": principles.get("title") or f"{principles['titleA']} {principles['titleB']}",
            "intro": principles.get("intro") or principles["note"],
            "photoAlt": data["principles"]["photoAlt"],
            "items": [{"title": i["title"], "body": i.get("body") or i["desc"]} for i in principles["items"]],
        },
    }
    d["about"] = new
    path.write_text(json.dumps(d, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("ok", path.name, len(new["story"]["items"]), "cartes histoire")


apply(ROOT / "fr.json", FR)
apply(ROOT / "en.json", EN)
