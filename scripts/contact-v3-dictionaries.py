# -*- coding: utf-8 -*-
"""Aligne `contactPage` (FR/EN) sur la maquette « Talgasy Web - Contact » : titre du
hero en deux morceaux, pastille « Gratuit », modale du calendrier, état de succès,
colonne de coordonnées. Idempotent.

Usage : python scripts/contact-v3-dictionaries.py
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "src" / "lib" / "i18n" / "dictionaries"

FR = {
    "title": "Parlons de votre",
    "titleHighlight": "projet",
    "booking": {
        "free": "Gratuit",
        "loadBody": "Le calendrier de réservation est un service tiers. En l’affichant, vous acceptez que votre adresse IP lui soit transmise. Vous pouvez aussi nous écrire avec le formulaire ci-dessous.",
        "modalTitle": "Réserver un appel découverte",
        "modalMeta": "45 min · téléphone ou visio · heure de l’Est (Québec)",
        "pickPrompt": "Choisissez un créneau",
        "confirm": "Confirmer {day} à {time}",
        "close": "Fermer",
        "embedNote": "Aperçu du design — le vrai calendrier Cal.com s’affichera dans cette fenêtre dès que l’URL sera branchée.",
        "slots": [
            {"day": "Lun 22 sept", "time": "9:00"},
            {"day": "Lun 22 sept", "time": "13:30"},
            {"day": "Mar 23 sept", "time": "10:00"},
            {"day": "Mar 23 sept", "time": "15:00"},
            {"day": "Mer 24 sept", "time": "8:30"},
            {"day": "Jeu 25 sept", "time": "11:00"},
        ],
    },
    "form": {
        "namePlaceholder": "Jean Tremblay",
        "emailPlaceholder": "jean@exemple.ca",
        "phonePlaceholder": "438-808-6594",
        "another": "Écrire un autre message",
    },
    "aside": {
        "zone": "Québec, partout au Québec",
        "zoneBody": "On travaille à distance avec des entreprises de toutes les régions. Réponse en moins de 24 h les jours ouvrables.",
    },
}

EN = {
    "title": "Let’s talk about your",
    "titleHighlight": "project",
    "booking": {
        "free": "Free",
        "loadBody": "The booking calendar is a third-party service. By displaying it, you agree that your IP address is sent to it. You can also write to us with the form below.",
        "modalTitle": "Book a discovery call",
        "modalMeta": "45 min · phone or video · Eastern Time (Québec)",
        "pickPrompt": "Pick a time slot",
        "confirm": "Confirm {day} at {time}",
        "close": "Close",
        "embedNote": "Design preview — the real Cal.com calendar will appear in this window once the URL is connected.",
        "slots": [
            {"day": "Mon Sep 22", "time": "9:00"},
            {"day": "Mon Sep 22", "time": "13:30"},
            {"day": "Tue Sep 23", "time": "10:00"},
            {"day": "Tue Sep 23", "time": "15:00"},
            {"day": "Wed Sep 24", "time": "8:30"},
            {"day": "Thu Sep 25", "time": "11:00"},
        ],
    },
    "form": {
        "namePlaceholder": "Jean Tremblay",
        "emailPlaceholder": "jean@example.ca",
        "phonePlaceholder": "438-808-6594",
        "another": "Write another message",
    },
    "aside": {
        "zone": "Québec City, all across Québec",
        "zoneBody": "We work remotely with businesses from every region. Reply within 24 hours on business days.",
    },
}


def apply(path: Path, data: dict) -> None:
    d = json.loads(path.read_text(encoding="utf-8"))
    c = d["contactPage"]
    c["title"] = data["title"]
    c["titleHighlight"] = data["titleHighlight"]
    c["booking"].update(data["booking"])
    c["form"].update(data["form"])
    c["form"].pop("messageHint", None)  # devient le placeholder de la zone de texte
    c["form"]["messagePlaceholder"] = (
        "Type d’entreprise, ce que vous cherchez, échéance approximative."
        if path.name == "fr.json"
        else "Type of business, what you’re looking for, rough timeline."
    )
    c["aside"] = data["aside"]
    # Ordre lisible : meta, title, titleHighlight, heroTitle, subtitle, booking, form, aside.
    order = ["meta", "title", "titleHighlight", "heroTitle", "subtitle", "booking", "form", "aside"]
    d["contactPage"] = {k: c[k] for k in order if k in c}
    path.write_text(json.dumps(d, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("ok", path.name)


apply(ROOT / "fr.json", FR)
apply(ROOT / "en.json", EN)
