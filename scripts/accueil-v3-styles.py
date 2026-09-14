# -*- coding: utf-8 -*-
"""Pose les jetons et la police de la maquette « Accueil » dans globals.css et le
layout racine. Idempotent : chaque remplacement vérifie sa cible ou son résultat.

Usage : python scripts/accueil-v3-styles.py
"""
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent


def replace_once(text: str, old: str, new: str, label: str) -> str:
    if new in text:
        return text
    if old not in text:
        raise SystemExit(f"cible introuvable : {label}")
    return text.replace(old, new, 1)


css_path = ROOT / "src/app/globals.css"
css = css_path.read_text(encoding="utf-8")

css = replace_once(
    css,
    """  --color-surface: #ffffff;
  --color-surface-2: #f5f5f6;
  --color-ink: #0f1d17;
  --color-accent-strong: #177e4f;
""",
    """  --color-surface: #ffffff;
  --color-surface-2: #f5f5f6;
  --color-surface-3: #e8e8ea;
  --color-ink: #0f1d17;
  --color-accent-strong: #177e4f;

  /* Jetons de la maquette « Accueil » (valeurs sombres littérales dans `.dark`) :
     - vert / vert-clair : bouton plein et son survol ; sur-vert : texte posé dessus.
     - texte3 : liens du pied de page ; texte-note : mention sous le bouton d'appel.
     - contour : bordure des boutons contournés du menu mobile. */
  --color-vert: #177e4f;
  --color-vert-clair: #14402f;
  --color-sur-vert: #ffffff;
  --color-texte3: #646468;
  --color-texte-note: #6b7f79;
  --color-contour: #d9d9dc;
""",
    "jetons clairs",
)

css = replace_once(
    css,
    """  --color-encre: #ffffff;
  --color-texte2: #bfbfbf;
  --color-ligne: #012232;
  --color-menthe: #04283a;
  --color-accent-strong: #30d98c;
""",
    """  --color-encre: #ffffff;
  --color-texte2: #a9bcc4;
  --color-ligne: #012232;
  --color-menthe: #04283a;
  --color-accent-strong: #30d98c;
  --color-surface-3: #083d53;

  --color-vert: #30d98c;
  --color-vert-clair: #7fefc0;
  --color-sur-vert: #011823;
  --color-texte3: #bfbfbf;
  --color-texte-note: #7e9a93;
  --color-contour: #0a3247;
""",
    "jetons sombres",
)

css = replace_once(
    css,
    "  --color-surface-2: #012232;\n  --color-encre: #ffffff;",
    "  --color-surface-2: #01293c;\n  --color-encre: #ffffff;",
    "surface-2 sombre",
)

css = replace_once(
    css,
    """  /* Titres (h1/h2) : Outfit. Corps + titres secondaires : Plus Jakarta Sans. */
  --font-display: var(--font-outfit), ui-sans-serif, system-ui, sans-serif;
  --font-sans: var(--font-jakarta), ui-sans-serif, system-ui, sans-serif;""",
    """  /* Une seule police (maquette Accueil) : DM Sans, graisses 400 / 500 / 700. */
  --font-display: var(--font-dm-sans), -apple-system, "Segoe UI", sans-serif;
  --font-sans: var(--font-dm-sans), -apple-system, "Segoe UI", sans-serif;""",
    "polices",
)

css = replace_once(
    css,
    "section[id] {\n  scroll-margin-top: 40px;\n}",
    "/* Ancres de la page (sections et libellés de section) : 72px sous le haut. */\nsection[id],\n[id=\"services\"],\n[id=\"secteurs\"],\n[id=\"methode\"],\n[id=\"faq\"],\n[id=\"contact\"] {\n  scroll-margin-top: 72px;\n}",
    "ancres",
)

css = replace_once(
    css,
    "/* Écran de bienvenue :",
    """/* Carte du hero : halo des villes (1,6 → 5,1 px) et du nœud de Québec (3,2 → 7,7 px). */
@keyframes tw-ping {
  from { r: 1.6px; opacity: 0.65; }
  to { r: 5.1px; opacity: 0; }
}
@keyframes tw-hub {
  from { r: 3.2px; opacity: 0.5; }
  to { r: 7.7px; opacity: 0; }
}

/* Écran de bienvenue :""",
    "keyframes carte",
)
css_path.write_text(css, encoding="utf-8")

layout_path = ROOT / "src/app/[lang]/layout.tsx"
layout = layout_path.read_text(encoding="utf-8")
if "dmSans" not in layout:
    layout = layout.replace(
        'import { Geist_Mono, Outfit, Plus_Jakarta_Sans } from "next/font/google";',
        'import { DM_Sans, Geist_Mono } from "next/font/google";',
    )
    layout = re.sub(
        r"// Typographie de la maquette Figma.*?\n\}\);\n// Accent monospace",
        """// Police unique de la maquette « Accueil » : DM Sans (400 / 500 / 600 / 700).
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});
// Accent monospace""",
        layout,
        flags=re.S,
    )
    layout = layout.replace(
        "className={`${outfit.variable} ${plusJakarta.variable} ${geistMono.variable}`}",
        "className={`${dmSans.variable} ${geistMono.variable}`}",
    )
    if "outfit" in layout:
        raise SystemExit("layout : Outfit encore présent")
    layout_path.write_text(layout, encoding="utf-8")

hero_path = ROOT / "src/features/home/components/hero.tsx"
hero = hero_path.read_text(encoding="utf-8")
hero = hero.replace(
    'className="absolute inset-0 bg-encre opacity-[0.34]',
    'className="absolute inset-0 bg-[#3a4a52] opacity-[0.34] dark:bg-[#bfd0d6]',
)
hero_path.write_text(hero, encoding="utf-8")
print("styles ok")
