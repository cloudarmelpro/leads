# -*- coding: utf-8 -*-
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def rep(chemin, a, b):
    p = ROOT / chemin
    s = p.read_text(encoding="utf-8")
    assert a in s, (chemin, a[:70])
    p.write_text(s.replace(a, b, 1), encoding="utf-8")


DECLARATION = """// Police du site : Neue Haas Grotesk Display Pro (fournie par le client, 2026-09-21).
// Les TTF de bureau ont ete reduits au latin et convertis en woff2 par
// `scripts/polices-neue-haas.py` : 100 ko -> 17 ko par graisse. Pas d'italique, le site
// n'en utilise aucune. Arial reste en reserve, elle a des proportions voisines.
const neueHaas = localFont({
  src: [
    { path: "../fonts/neue-haas-300.woff2", weight: "300", style: "normal" },
    { path: "../fonts/neue-haas-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/neue-haas-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/neue-haas-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-neue-haas",
  display: "swap",
});

"""

# --- layout public
rep(
    "src/app/[lang]/layout.tsx",
    'import { notFound } from "next/navigation";',
    'import localFont from "next/font/local";\nimport { notFound } from "next/navigation";',
)
rep(
    "src/app/[lang]/layout.tsx",
    """// Police du site : Arial (decision du 2026-09-21). Police systeme, donc rien a
// telecharger et aucun texte invisible au chargement — la pile est dans globals.css.

""",
    DECLARATION,
)
rep(
    "src/app/[lang]/layout.tsx",
    """      lang={localeHtmlLang[lang]}
""",
    """      lang={localeHtmlLang[lang]}
      className={neueHaas.variable}
""",
)

# --- page 404 globale
rep(
    "src/app/global-not-found.tsx",
    'import type { Metadata } from "next";',
    'import type { Metadata } from "next";\nimport localFont from "next/font/local";',
)
rep(
    "src/app/global-not-found.tsx",
    "export async function generateMetadata(): Promise<Metadata> {",
    """const neueHaas = localFont({
  src: [
    { path: "./fonts/neue-haas-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/neue-haas-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/neue-haas-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-neue-haas",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {""",
)
rep("src/app/global-not-found.tsx", '<html lang="fr">', '<html lang="fr" className={neueHaas.variable}>')

# --- jetons CSS
rep(
    "src/app/globals.css",
    """  /* Une seule police : Arial, prise sur la machine du visiteur (rien a telecharger).
     Les reserves gardent les memes proportions la ou Arial est absente :
     Helvetica sur macOS, Liberation Sans sur Linux (metriques identiques a Arial). */
  --font-display: Arial, Helvetica, "Liberation Sans", sans-serif;
  --font-sans: Arial, Helvetica, "Liberation Sans", sans-serif;""",
    """  /* Une seule police : Neue Haas Grotesk Display Pro, servie depuis le projet.
     Arial en reserve — proportions voisines, donc les retours a la ligne bougent peu
     pendant le chargement. */
  --font-display: var(--font-neue-haas), Arial, Helvetica, sans-serif;
  --font-sans: var(--font-neue-haas), Arial, Helvetica, sans-serif;""",
)
rep(
    "src/app/globals.css",
    """  /* Arial derriere `font-mono` aussi : le client ne veut qu'une seule police sur le
     site. Plus aucun composant n'utilise ce jeton ; il pointe sur la meme pile pour
     qu'un usage futur ne fasse pas revenir une deuxieme police. */
  --font-mono: Arial, Helvetica, "Liberation Sans", sans-serif;""",
    """  /* Meme police derriere `font-mono` et `font-serif` : le client n'en veut qu'une sur
     le site. Plus aucun composant ne s'en sert ; ces jetons pointent sur la meme pile
     pour qu'un usage futur ne fasse pas revenir une deuxieme police. */
  --font-mono: var(--font-neue-haas), Arial, Helvetica, sans-serif;""",
)
rep(
    "src/app/globals.css",
    '  --font-serif: Arial, Helvetica, "Liberation Sans", sans-serif;',
    "  --font-serif: var(--font-neue-haas), Arial, Helvetica, sans-serif;",
)
print("ok")
