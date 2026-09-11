"""Génère le logo court « TG Web » (monogramme + « TG » Outfit + « Web » Geist Mono)
en SVG vectoriel (texte converti en tracés → aucune police requise), en variante
claire et sombre, dans public/. Même construction que le logo « Talgasy Web » et
que le composant Wordmark : monogramme 32 de haut, espace 9, « TG » 22 (Outfit 600),
« Web » 16 (Geist Mono 400), textes alignés sur la ligne de base.

Prérequis : `pip install fonttools brotli` et un build (.next/static/media/*.woff2).
Relancer : `python scripts/generate-tg-web-logo.py`.
"""
import glob
import re
import xml.etree.ElementTree as ET

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

MONO_H = 32.0  # hauteur du monogramme (unités SVG)
GAP_MONO_TEXT = 9.0
GAP_WORDS = 5.0
SIZE_TG, WGHT_TG = 22.0, 600
SIZE_WEB, WGHT_WEB = 16.0, 400

THEMES = {
    "": {"mono": "#177e4f", "tg": "#1e1e1e", "web": "#646468"},  # clair (tokens emeraude / encre / texte2)
    "-dark": {"mono": "#30d98c", "tg": "#ffffff", "web": "#bfbfbf"},  # sombre (accent-strong / encre / texte2)
}


def find_font(family: str, text: str) -> TTFont:
    """Premier woff2 de la famille contenant tous les caractères demandés."""
    for path in sorted(glob.glob(".next/static/media/*.woff2")):
        font = TTFont(path)
        if family not in (font["name"].getDebugName(1) or ""):
            continue
        cmap = font.getBestCmap()
        if all(ord(c) in cmap for c in text):
            return font
    raise SystemExit(f"Police {family} introuvable : lancer `npm run build` d'abord.")


def outline(font: TTFont, text: str, size: float, wght: int, x: float, baseline: float) -> tuple[str, float]:
    """Tracés SVG du texte à la graisse voulue, placés en (x, baseline). Renvoie (d, largeur)."""
    inst = instancer.instantiateVariableFont(font, {"wght": wght}, inplace=False)
    scale = size / inst["head"].unitsPerEm
    glyphs = inst.getGlyphSet()
    cmap = inst.getBestCmap()
    d, pen_x = [], x
    for ch in text:
        name = cmap[ord(ch)]
        pen = SVGPathPen(glyphs)
        # Repère police (y vers le haut) → repère SVG (y vers le bas), à l'échelle.
        glyphs[name].draw(TransformPen(pen, (scale, 0, 0, -scale, pen_x, baseline)))
        d.append(pen.getCommands())
        pen_x += glyphs[name].width * scale
    return " ".join(p for p in d if p), pen_x - x


def cap_height(font: TTFont, size: float) -> float:
    return font["OS/2"].sCapHeight * size / font["head"].unitsPerEm


def main() -> None:
    mono_svg = open("public/talgasy-monogram.svg", encoding="utf-8").read()
    vb = [float(v) for v in re.search(r'viewBox="([^"]+)"', mono_svg).group(1).split()]
    mono_paths = re.findall(r'<path id="[^"]*" d="([^"]+)"', mono_svg)
    mono_w = vb[2] * (MONO_H / vb[3])
    mono_scale = MONO_H / vb[3]

    outfit = find_font("Outfit", "TG")
    geist = find_font("Geist Mono", "Web")

    # Ligne de base commune : les capitales « TG » centrées sur l'axe du monogramme.
    baseline = MONO_H / 2 + cap_height(outfit, SIZE_TG) / 2
    x = mono_w + GAP_MONO_TEXT
    d_tg, w_tg = outline(outfit, "TG", SIZE_TG, WGHT_TG, x, baseline)
    x += w_tg + GAP_WORDS
    d_web, w_web = outline(geist, "Web", SIZE_WEB, WGHT_WEB, x, baseline)
    total_w = x + w_web

    for suffix, c in THEMES.items():
        svg = ET.Element("svg", xmlns="http://www.w3.org/2000/svg", viewBox=f"0 0 {total_w:.2f} {MONO_H:.0f}", fill="none")
        svg.set("role", "img")
        svg.set("aria-label", "TG Web")
        g = ET.SubElement(svg, "g", fill=c["mono"], transform=f"scale({mono_scale:.6f})")
        for d in mono_paths:
            ET.SubElement(g, "path", d=d)
        ET.SubElement(svg, "path", fill=c["tg"], d=d_tg)
        ET.SubElement(svg, "path", fill=c["web"], d=d_web)
        out = f"public/tg-web-logo{suffix}.svg"
        ET.ElementTree(svg).write(out, encoding="unicode")
        print(out, f"{total_w:.1f}×{MONO_H:.0f}")


if __name__ == "__main__":
    main()
