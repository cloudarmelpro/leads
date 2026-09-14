# -*- coding: utf-8 -*-
"""Aligne `blog` (FR/EN) sur la maquette « Talgasy Web - Blog » : titre du hero en
deux morceaux, paragraphe long, sujets, filtre « Tous ». Idempotent.

Usage : python scripts/blog-v3-dictionaries.py
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "src" / "lib" / "i18n" / "dictionaries"

FR = {
    "title": "Idées &",
    "titleHighlight": "conseils",
    "heroIntro": "Des articles concrets pour attirer plus de clients avec votre site web. Conversion, référencement local, contenu : ce qu’on applique chez nos clients, expliqué sans jargon.",
    "topics": ["Conversion", "Référencement local", "Contenu", "Refonte"],
    "filterAll": "Tous",
}
EN = {
    "title": "Ideas &",
    "titleHighlight": "advice",
    "heroIntro": "Practical articles to win more customers with your website. Conversion, local SEO, content: what we apply for our clients, explained without jargon.",
    "topics": ["Conversion", "Local SEO", "Content", "Redesign"],
    "filterAll": "All",
}


def apply(path: Path, data: dict) -> None:
    d = json.loads(path.read_text(encoding="utf-8"))
    b = d["blog"]
    b.update(data)
    order = ["meta", "title", "titleHighlight", "subtitle", "heroIntro", "topics", "filterAll", "featured", "emptyKicker",
             "readArticle", "minRead", "writtenBy", "backToBlog", "moreArticles", "listSubtitle", "emptyTitle", "emptyBody"]
    d["blog"] = {k: b[k] for k in order if k in b} | {k: v for k, v in b.items() if k not in order}
    path.write_text(json.dumps(d, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("ok", path.name)


apply(ROOT / "fr.json", FR)
apply(ROOT / "en.json", EN)
