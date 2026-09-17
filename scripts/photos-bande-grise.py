# -*- coding: utf-8 -*-
"""Retire la bande grise unie laissee en bas de certaines photos de secteurs par l'outil
qui les a produites (visible en bout de carte, cf. capture du 2026-09-18). On recadre juste
au-dessus de la bande, rien d'autre. Idempotent : sans bande detectee, le fichier n'est pas
touche.

Usage : python scripts/photos-bande-grise.py
"""
from pathlib import Path

from PIL import Image

DOSSIER = Path(__file__).resolve().parent.parent / "public" / "images" / "home"
# Gris neutre de l'outil : canaux quasi egaux, autour de 128.
MARGE = 8


def est_gris(pixel):
    r, v, b = pixel
    return abs(r - v) < MARGE and abs(v - b) < MARGE and 110 < r < 145


for chemin in sorted(DOSSIER.glob("sector-*.jpg")):
    image = Image.open(chemin).convert("RGB")
    largeur, hauteur = image.size
    pas = max(1, largeur // 40)
    haut_bande = hauteur
    for y in range(hauteur - 1, max(hauteur - 60, 0), -1):
        echantillon = [image.getpixel((x, y)) for x in range(0, largeur, pas)]
        # La bande ne couvre parfois qu'une partie de la largeur (cf. construction).
        if sum(1 for p in echantillon if est_gris(p)) < len(echantillon) * 0.3:
            break
        haut_bande = y
    if haut_bande >= hauteur:
        print("ok (rien a faire)", chemin.name)
        continue
    image.crop((0, 0, largeur, haut_bande)).save(chemin, quality=82, optimize=True, progressive=True)
    print("recadre", chemin.name, f"{hauteur} -> {haut_bande} px")
