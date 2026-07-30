"use client";

import { useServerInsertedHTML } from "next/navigation";

// Script critique posé AVANT peinture, sur <html> :
//  - `.dark` selon le thème mémorisé / la préférence système (anti-flash) ;
//  - `reveal-ready` (hors reduced-motion) pour activer les révélations au scroll.
// Injecté via `useServerInsertedHTML` → rendu UNIQUEMENT côté serveur (dans le flux
// initial, avant le <body>). Il ne réintègre donc jamais l'arbre React côté client :
// aux navigations client (ex. changement de langue), React ne réconcilie aucun
// <script>, ce qui supprime l'avertissement « Encountered a script tag ».
const PRE_PAINT = `try{var e=localStorage.getItem('theme');var d=matchMedia('(prefers-color-scheme: dark)').matches;if(e==='dark'||((e===null||e==='system')&&d))document.documentElement.classList.add('dark')}catch(e){}try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('reveal-ready')}catch(e){}`;

export function PrePaintScript() {
  useServerInsertedHTML(() => <script dangerouslySetInnerHTML={{ __html: PRE_PAINT }} />);
  return null;
}
