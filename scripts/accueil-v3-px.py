# -*- coding: utf-8 -*-
"""Convertit les utilitaires d'espacement en rem (échelle Tailwind) en valeurs px
dans les composants de la maquette « Accueil ». La racine du site est fluide
(14 → 16px) : `p-7` ferait 24,5px sur mobile alors que la maquette exige 28px.

Usage : python scripts/accueil-v3-px.py
"""
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent / "src"
FILES = [
    "components/shared/header.tsx",
    "components/shared/footer.tsx",
    "components/shared/floating-contact.tsx",
    "components/shared/theme-toggle.tsx",
    "components/shared/language-switcher.tsx",
    "components/shared/welcome-splash.tsx",
    "features/home/components/hero.tsx",
    "features/home/components/services.tsx",
    "features/home/components/sectors.tsx",
    "features/home/components/method.tsx",
    "features/home/components/faq.tsx",
    "features/home/components/cta.tsx",
    "features/home/components/accordion-row.tsx",
    "features/home/components/section-head.tsx",
]

PROPS = r"(?:gap|gap-x|gap-y|p|px|py|pt|pb|pl|pr|m|mt|mb|ml|mr|h|w|min-h|min-w|max-w|left|right|top|bottom|inset|inset-x|inset-y|size|leading)"
# Préfixes de variante autorisés (ex. `min-[860px]:`, `hover:`, `-` pour les négatifs).
PATTERN = re.compile(rf"(?<![\w\[-])((?:[\w\[\]-]+:)*)(-?)({PROPS})-(\d+(?:\.\d+)?)(?![\w\]/.-])")


def convert(match: re.Match) -> str:
    variants, sign, prop, value = match.groups()
    px = float(value) * 4
    px_text = str(int(px)) if px.is_integer() else str(px)
    return f"{variants}{sign}{prop}-[{px_text}px]"


for rel in FILES:
    path = ROOT / rel
    text = path.read_text(encoding="utf-8")
    new = PATTERN.sub(convert, text)
    new = new.replace("rounded-sm", "rounded-[2px]")
    if new != text:
        path.write_text(new, encoding="utf-8")
        print("converti", rel, len(PATTERN.findall(text)), "utilitaires")
    else:
        print("inchangé", rel)
