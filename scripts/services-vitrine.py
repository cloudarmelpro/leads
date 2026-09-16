# -*- coding: utf-8 -*-
"""Section Services en vitrine défilante (décision client 2026-09-17, d'après une vidéo
de référence) : libellés du bouton pause / reprise. Idempotent.

Usage : python scripts/services-vitrine.py
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "src" / "lib" / "i18n" / "dictionaries"

LABELS = {
    "fr": {"pause": "Mettre le défilement en pause", "play": "Reprendre le défilement"},
    "en": {"pause": "Pause the scrolling", "play": "Resume the scrolling"},
}

for lang, labels in LABELS.items():
    path = ROOT / f"{lang}.json"
    d = json.loads(path.read_text(encoding="utf-8"))
    d["services"]["controls"] = labels
    path.write_text(json.dumps(d, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("ok", path.name)
