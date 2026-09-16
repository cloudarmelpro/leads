# -*- coding: utf-8 -*-
"""Section Secteurs en cartes empilées (décision client 2026-09-17, d'après une vidéo de
référence) : un argument par secteur (`hero.demos[].pitch`) et le libellé accessible des
étapes (`hero.stepAria`). Textes marketing génériques, aucune donnée d'entreprise. Idempotent.

Usage : python scripts/secteurs-empiles.py
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "src" / "lib" / "i18n" / "dictionaries"

PITCH = {
    "fr": [
        "Vos aménagements méritent d’être vus. Un site qui met vos réalisations en avant et amène les propriétaires à demander une soumission.",
        "Fondations, drainage, terrassement : vos clients cherchent une équipe fiable, vite. Un site clair qui rassure et fait décrocher le téléphone.",
        "Un site à la hauteur de vos chantiers : vos projets, vos spécialités, votre zone desservie, et une demande de soumission en un clic.",
        "Avant, après, et la confiance entre les deux. Un site qui montre la qualité de votre travail et simplifie la prise de contact.",
        "Heures, adresse, produits, avis : tout ce qu’un client cherche avant de passer la porte, trouvé en quelques secondes sur Google.",
        "La saison se vend en quelques semaines. Un site qui présente vos forfaits clairement et prend les inscriptions avant la première neige.",
        "Élagage, abattage, urgences après tempête : un site qui montre votre expertise et répond aux clients avant vos concurrents.",
    ],
    "en": [
        "Your landscapes deserve to be seen. A site that showcases your work and gets homeowners asking for a quote.",
        "Foundations, drainage, grading: your clients want a reliable crew, fast. A clear site that reassures and makes the phone ring.",
        "A site worthy of your job sites: your projects, your specialties, your service area, and a quote request in one click.",
        "Before, after, and trust in between. A site that shows the quality of your work and makes getting in touch easy.",
        "Hours, address, products, reviews: everything a customer checks before walking in, found on Google in seconds.",
        "The season sells out in a few weeks. A site that lays out your plans clearly and takes sign-ups before the first snow.",
        "Pruning, removal, storm emergencies: a site that shows your expertise and answers clients before your competitors do.",
    ],
}

for lang, pitches in PITCH.items():
    path = ROOT / f"{lang}.json"
    d = json.loads(path.read_text(encoding="utf-8"))
    demos = d["hero"]["demos"]
    assert len(demos) == len(pitches), (lang, len(demos))
    for demo, pitch in zip(demos, pitches):
        demo["pitch"] = pitch
    d["hero"]["stepAria"] = "Secteur {n} sur {total} : {name}" if lang == "fr" else "Sector {n} of {total}: {name}"
    path.write_text(json.dumps(d, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("ok", path.name)
