# -*- coding: utf-8 -*-
"""Rangee facon « trusted by » sous les boutons du hero (demande client 2026-09-18).
Pas de logos clients : on n'en a aucun de confirme et on n'invente rien. On annonce les
metiers vises, ce que le site dit deja par ailleurs. Idempotent.

Usage : python scripts/hero-rang-secteurs.py
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "src" / "lib" / "i18n" / "dictionaries"

LIBELLE = {"fr": "Pensé pour", "en": "Built for"}

for langue, libelle in LIBELLE.items():
    chemin = ROOT / f"{langue}.json"
    d = json.loads(chemin.read_text(encoding="utf-8"))
    d["hero"]["trustedKicker"] = libelle
    chemin.write_text(json.dumps(d, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("ok", chemin.name)
