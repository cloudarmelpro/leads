# -*- coding: utf-8 -*-
"""Aligne `blog` (FR/EN) sur la maquette « Talgasy Web - Blog article » : bloc
« À lire ensuite », bouton de fin d'article ; retire les clés de l'ancien état vide
et celles devenues inutilisées. Idempotent.

Usage : python scripts/blog-article-v3-dictionaries.py
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "src" / "lib" / "i18n" / "dictionaries"

FR = {
    "relatedKicker": "À lire ensuite",
    "relatedTitle": "Dans la même idée",
    "articleCta": "Faire regarder mon site",
}
EN = {
    "relatedKicker": "Read next",
    "relatedTitle": "Along the same lines",
    "articleCta": "Have my site reviewed",
}
REMOVE = ["subtitle", "readArticle", "emptyKicker", "emptyTitle", "emptyBody"]
ORDER = ["meta", "title", "titleHighlight", "heroIntro", "topics", "filterAll", "featured", "minRead",
         "writtenBy", "backToBlog", "moreArticles", "listSubtitle", "relatedKicker", "relatedTitle", "articleCta"]


def apply(path: Path, data: dict) -> None:
    d = json.loads(path.read_text(encoding="utf-8"))
    b = d["blog"]
    b.update(data)
    for k in REMOVE:
        b.pop(k, None)
    d["blog"] = {k: b[k] for k in ORDER if k in b} | {k: v for k, v in b.items() if k not in ORDER}
    path.write_text(json.dumps(d, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("ok", path.name, sorted(d["blog"]))


apply(ROOT / "fr.json", FR)
apply(ROOT / "en.json", EN)
