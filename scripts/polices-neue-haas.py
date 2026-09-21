# -*- coding: utf-8 -*-
"""Prepare Neue Haas Grotesk Display Pro pour le web (decision client 2026-09-21).

Les fichiers fournis sont des TTF de bureau (~100 ko chacun, jeu de caracteres complet).
On ne garde que les graisses reellement utilisees par le site, on reduit au latin, et on
convertit en woff2. Aucune italique : le site n'en utilise aucune.

Usage : python scripts/polices-neue-haas.py "<dossier des TTF>"
"""
import sys
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont

RACINE = Path(__file__).resolve().parent.parent
SORTIE = RACINE / "src" / "app" / "fonts"

# fichier source -> (nom de sortie, graisse CSS)
GRAISSES = [
    ("NeueHaasDisplayLight.ttf", "neue-haas-300", 300),
    ("NeueHaasDisplayRoman.ttf", "neue-haas-400", 400),
    ("NeueHaasDisplayMediu.ttf", "neue-haas-500", 500),
    ("NeueHaasDisplayBold.ttf", "neue-haas-700", 700),
]

# latin + latin-ext, comme les sous-ensembles de Google Fonts.
PLAGES = (
    "U+0000-00FF,U+0100-024F,U+0259,U+02BB-02BC,U+02C6,U+02DA,U+02DC,"
    "U+0304,U+0308,U+0329,U+1E00-1EFF,U+2000-206F,U+2074,U+20A0-20CF,"
    "U+2113,U+2122,U+2191,U+2193,U+2212,U+2215,U+2C60-2C7F,U+A720-A7FF,U+FEFF,U+FFFD"
)


def main() -> None:
    source = Path(sys.argv[1]) if len(sys.argv) > 1 else None
    if not source or not source.is_dir():
        raise SystemExit("Donner le dossier qui contient les TTF en argument.")
    SORTIE.mkdir(parents=True, exist_ok=True)

    for fichier, nom, graisse in GRAISSES:
        chemin = source / fichier
        if not chemin.exists():
            print("absent, ignore :", fichier)
            continue

        # fsType dit ce que l'editeur autorise ; 2 = embarquement interdit.
        with TTFont(chemin) as police:
            fs_type = police["OS/2"].fsType

        options = subset.Options()
        options.flavor = "woff2"
        options.desubroutinize = True
        options.layout_features = ["kern", "liga", "clig", "calt", "tnum", "ccmp", "locl", "mark", "mkmk"]
        options.name_IDs = ["*"]
        options.notdef_outline = True
        options.recalc_bounds = True

        police = subset.load_font(str(chemin), options)
        subsetter = subset.Subsetter(options=options)
        subsetter.populate(unicodes=subset.parse_unicodes(PLAGES))
        subsetter.subset(police)
        destination = SORTIE / f"{nom}.woff2"
        subset.save_font(police, str(destination), options)
        police.close()

        avant = chemin.stat().st_size / 1024
        apres = destination.stat().st_size / 1024
        print(f"{nom}.woff2  graisse {graisse}  {avant:.0f} ko -> {apres:.0f} ko  (fsType={fs_type})")


if __name__ == "__main__":
    main()
