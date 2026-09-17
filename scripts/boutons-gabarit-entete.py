# -*- coding: utf-8 -*-
"""Aligne tous les boutons du site sur le gabarit de l'en-tete (decision client 2026-09-18) :
rayon 8px, vert plein + texte sur-vert pour l'action principale, surface-2 + filet interne
pour l'action secondaire. Les plaques d'icone, les etiquettes et les champs de formulaire ne
sont pas des boutons : on n'y touche pas. Idempotent.

Usage : python scripts/boutons-gabarit-entete.py
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "src"

# (fichier, ancien, nouveau)
CHANGES = [
    # --- En-tete : ses deux boutons d'icone et le menu mobile suivent son propre gabarit.
    (
        "components/shared/header.tsx",
        'rounded-[9px] bg-surface-2 text-encre transition-colors hover:bg-surface-3 min-[900px]:hidden',
        'rounded-[8px] bg-surface-2 text-encre ring-1 ring-contour transition-colors ring-inset hover:bg-surface-3 min-[900px]:hidden',
    ),
    (
        "components/shared/header.tsx",
        'rounded-[12px] bg-surface-2 text-encre transition-colors hover:bg-surface-3"',
        'rounded-[8px] bg-surface-2 text-encre ring-1 ring-contour transition-colors ring-inset hover:bg-surface-3"',
    ),
    (
        "components/shared/header.tsx",
        'rounded-[12px] border border-contour text-[15px]',
        'rounded-[8px] border border-contour text-[15px]',
    ),
    (
        "components/shared/header.tsx",
        'rounded-[12px] bg-vert text-[15px]',
        'rounded-[8px] bg-vert text-[15px]',
    ),
    # --- Bandeau temoins : rayon, et les anciens jetons de couleur passent au vert du site.
    (
        "components/shared/cookie-consent.tsx",
        'rounded-[9px] px-3.5 py-2 text-cta-fluid font-medium text-encre shadow-[inset_0_0_0_1px_var(--color-encre)] transition-colors hover:bg-encre/[0.08] sm:px-4 sm:py-2.5',
        'rounded-[8px] bg-surface-2 px-3.5 py-2 text-cta-fluid font-medium text-encre ring-1 ring-contour transition-colors ring-inset hover:bg-surface-3 sm:px-4 sm:py-2.5',
    ),
    (
        "components/shared/cookie-consent.tsx",
        'rounded-[9px] bg-emeraude px-3.5 py-2 text-cta-fluid font-medium text-white transition-colors hover:bg-sapin sm:px-4 sm:py-2.5 dark:bg-accent-strong dark:text-fond dark:hover:bg-[#7fefc0]',
        'rounded-[8px] bg-vert px-3.5 py-2 text-cta-fluid font-medium text-sur-vert transition-colors hover:bg-vert-clair sm:px-4 sm:py-2.5',
    ),
    # --- Bandeau de page et bouton de chargement Cal.com : memes anciens jetons.
    (
        "components/shared/page-hero.tsx",
        'rounded-[9px] bg-emeraude px-3.5 py-2 sm:px-4 sm:py-2.5 text-cta-fluid font-medium text-white no-underline hover:bg-sapin dark:bg-accent-strong dark:text-fond dark:hover:bg-[#7fefc0]',
        'rounded-[8px] bg-vert px-3.5 py-2 sm:px-4 sm:py-2.5 text-cta-fluid font-medium text-sur-vert no-underline transition-colors hover:bg-vert-clair',
    ),
    (
        "features/contact/components/calcom-embed.tsx",
        'rounded-[9px] bg-emeraude px-3.5 py-2 sm:px-4 sm:py-2.5 text-cta-fluid font-medium text-white transition-colors hover:bg-emeraude/90 dark:bg-accent-strong dark:text-fond',
        'rounded-[8px] bg-vert px-3.5 py-2 sm:px-4 sm:py-2.5 text-cta-fluid font-medium text-sur-vert transition-colors hover:bg-vert-clair',
    ),
    # --- Pied de page : les pastilles de reseaux sociaux.
    ("components/shared/footer.tsx", 'rounded-[9px] bg-surface-2 text-encre ring-1', 'rounded-[8px] bg-surface-2 text-encre ring-1'),
    # --- Appels a l'action des pages.
    ("features/about/components/about-hero.tsx", 'rounded-[9px] bg-vert', 'rounded-[8px] bg-vert'),
    ("features/pricing/components/pricing-hero.tsx", 'rounded-[9px] bg-vert', 'rounded-[8px] bg-vert'),
    ("features/blog/components/blog-article.tsx", 'rounded-[9px] bg-vert', 'rounded-[8px] bg-vert'),
    ("features/contact/components/booking-gate.tsx", 'rounded-[9px] bg-vert', 'rounded-[8px] bg-vert'),
    ("features/home/components/sectors.tsx", 'rounded-[10px] bg-vert', 'rounded-[8px] bg-vert'),
    (
        "features/contact/components/contact-page.tsx",
        'gap-[10px] rounded-[9px] bg-vert',
        'gap-[10px] rounded-[8px] bg-vert',
    ),
    (
        "features/contact/components/contact-page.tsx",
        'gap-[9px] rounded-[9px] bg-surface-2 px-[20px] text-[14px] leading-[20px] font-medium text-encre no-underline transition-colors hover:bg-surface-3',
        'gap-[9px] rounded-[8px] bg-surface-2 px-[20px] text-[14px] leading-[20px] font-medium text-encre no-underline ring-1 ring-contour transition-colors ring-inset hover:bg-surface-3',
    ),
    # --- Formulaire de contact : bouton de renvoi et bouton d'envoi.
    (
        "features/contact/components/contact-form.tsx",
        'rounded-[9px] bg-surface-2 px-[20px] text-[14px] leading-[20px] font-medium text-encre transition-colors duration-200 hover:bg-surface-3',
        'rounded-[8px] bg-surface-2 px-[20px] text-[14px] leading-[20px] font-medium text-encre ring-1 ring-contour transition-colors duration-200 ring-inset hover:bg-surface-3',
    ),
    ("features/contact/components/contact-form.tsx", 'rounded-[12px] bg-vert text-[15px]', 'rounded-[8px] bg-vert text-[15px]'),
    # --- Fenetre de prise de rendez-vous : fermeture et confirmation.
    (
        "features/contact/components/booking-modal.tsx",
        'rounded-[12px] bg-surface-2 text-encre transition-colors duration-200 hover:bg-surface-3',
        'rounded-[8px] bg-surface-2 text-encre ring-1 ring-contour transition-colors duration-200 ring-inset hover:bg-surface-3',
    ),
    (
        "features/contact/components/booking-modal.tsx",
        'gap-[10px] rounded-[12px] text-[15px]',
        'gap-[10px] rounded-[8px] text-[15px]',
    ),
    # --- Blogue : filtres par sujet.
    ("features/blog/components/post-grid.tsx", 'items-center rounded-[9px] px-[16px]', 'items-center rounded-[8px] px-[16px]'),
    # --- Prix : bouton des cartes, bascule de periode, onglets de famille.
    ("features/pricing/components/pricing-explorer.tsx", 'justify-center rounded-[9px] text-[14px]', 'justify-center rounded-[8px] text-[14px]'),
    ("features/pricing/components/pricing-explorer.tsx", 'flex-1 cursor-pointer rounded-[9px] px-[10px]', 'flex-1 cursor-pointer rounded-[8px] px-[10px]'),
    ("features/pricing/components/pricing-explorer.tsx", 'cursor-pointer rounded-[9px] px-[16px] py-[8px]', 'cursor-pointer rounded-[8px] px-[16px] py-[8px]'),
]

for fichier, ancien, nouveau in CHANGES:
    chemin = ROOT / fichier
    s = chemin.read_text(encoding="utf-8")
    if nouveau in s and ancien not in s:
        print("deja fait", fichier)
        continue
    assert ancien in s, (fichier, ancien[:70])
    chemin.write_text(s.replace(ancien, nouveau, 1), encoding="utf-8")
    print("ok", fichier)
