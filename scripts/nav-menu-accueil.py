# -*- coding: utf-8 -*-
"""Menu déroulant « Accueil » de l'en-tête (décision client 2026-09-16) : les quatre
sections de l'accueil quittent la barre et passent dans un panneau au survol.
Ajoute `nav.homeMenu` (FR/EN). Idempotent.

Usage : python scripts/nav-menu-accueil.py
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "src" / "lib" / "i18n" / "dictionaries"

MENU = {
    "fr": [
        {"key": "services", "desc": "Huit services, du site web au CRM."},
        {"key": "sectors", "desc": "Paysagement, excavation, construction, commerce local…"},
        {"key": "method", "desc": "Six étapes, de l’appel à la mise en ligne."},
        {"key": "faq", "desc": "Les questions qu’on nous pose avant chaque projet."},
    ],
    "en": [
        {"key": "services", "desc": "Eight services, from website to CRM."},
        {"key": "sectors", "desc": "Landscaping, excavation, construction, local retail…"},
        {"key": "method", "desc": "Six steps, from the call to launch."},
        {"key": "faq", "desc": "The questions we get before every project."},
    ],
}

for lang, items in MENU.items():
    path = ROOT / f"{lang}.json"
    d = json.loads(path.read_text(encoding="utf-8"))
    d["nav"]["homeMenu"] = items
    d["nav"]["homeMenuAria"] = "Sections de l’accueil" if lang == "fr" else "Home page sections"
    path.write_text(json.dumps(d, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("ok", path.name)
