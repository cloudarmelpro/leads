"use client";

import { useServerInsertedHTML } from "next/navigation";

// Script critique posé AVANT peinture, sur <html> : `.dark` sauf si le visiteur a choisi
// le thème clair (anti-flash). Sombre par défaut : les maquettes sont en bleu nuit. Injecté via `useServerInsertedHTML` → rendu
// UNIQUEMENT côté serveur (dans le flux initial, avant le <body>). Il ne réintègre
// donc jamais l'arbre React côté client : aux navigations client (ex. changement de
// langue), React ne réconcilie aucun <script> (pas d'avertissement « script tag »).
// Même passe : `tw-seen` masque l'écran de bienvenue déjà vu (clé de welcome-splash.tsx),
// sinon il s'afficherait jusqu'à l'hydratation.
const PRE_PAINT = `var h=document.documentElement;try{if(localStorage.getItem('theme')!=='light')h.classList.add('dark');if(localStorage.getItem('talgasy-welcome-v3'))h.classList.add('tw-seen')}catch(e){h.classList.add('dark')}`;

export function PrePaintScript() {
  useServerInsertedHTML(() => <script dangerouslySetInnerHTML={{ __html: PRE_PAINT }} />);
  return null;
}
