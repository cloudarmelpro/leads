"use client";

import { useServerInsertedHTML } from "next/navigation";

// Script critique posé AVANT peinture, sur <html> : `.dark` sauf si le visiteur a choisi
// le thème clair (anti-flash). Sombre par défaut : les maquettes sont en bleu nuit. Injecté via `useServerInsertedHTML` → rendu
// UNIQUEMENT côté serveur (dans le flux initial, avant le <body>). Il ne réintègre
// donc jamais l'arbre React côté client : aux navigations client (ex. changement de
// langue), React ne réconcilie aucun <script> (pas d'avertissement « script tag »).
// Même passe : `tw-welcome` affiche l'écran de bienvenue (welcome-splash.tsx) au premier chargement
// de la session sur l'accueil ou À propos, et le mémorise aussitôt (sessionStorage) ;
// `tw-consented` masque le bandeau témoins (rendu ouvert dans le HTML, clé de
// cookie-consent.tsx), et sans choix mémorisé `cookie-open` cache la bulle de contact sous le
// bandeau dès la première peinture. (`\\/` : barre oblique échappée dans le gabarit.)
const PRE_PAINT = `var h=document.documentElement;try{if(localStorage.getItem('theme')!=='light')h.classList.add('dark');if(localStorage.getItem('cookie-consent'))h.classList.add('tw-consented');else h.classList.add('cookie-open')}catch(e){h.classList.add('dark')}try{if(/^\\/(fr|en)(\\/a-propos)?\\/?$/.test(location.pathname)&&!sessionStorage.getItem('talgasy-welcome-v4')){sessionStorage.setItem('talgasy-welcome-v4','1');h.classList.add('tw-welcome')}}catch(e){}`;

export function PrePaintScript() {
  useServerInsertedHTML(() => <script dangerouslySetInnerHTML={{ __html: PRE_PAINT }} />);
  return null;
}
