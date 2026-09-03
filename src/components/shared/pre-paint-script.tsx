"use client";

import { useServerInsertedHTML } from "next/navigation";

// Script critique posé AVANT peinture, sur <html> : `.dark` selon le thème mémorisé
// / la préférence système (anti-flash). Injecté via `useServerInsertedHTML` → rendu
// UNIQUEMENT côté serveur (dans le flux initial, avant le <body>). Il ne réintègre
// donc jamais l'arbre React côté client : aux navigations client (ex. changement de
// langue), React ne réconcilie aucun <script> (pas d'avertissement « script tag »).
const PRE_PAINT = `try{var e=localStorage.getItem('theme');var d=matchMedia('(prefers-color-scheme: dark)').matches;if(e==='dark'||((e===null||e==='system')&&d))document.documentElement.classList.add('dark')}catch(e){}`;

export function PrePaintScript() {
  useServerInsertedHTML(() => <script dangerouslySetInnerHTML={{ __html: PRE_PAINT }} />);
  return null;
}
