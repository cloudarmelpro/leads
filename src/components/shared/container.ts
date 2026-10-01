/**
 * Le rail de page de la maquette « Accueil » : 1100px centrés, gouttière
 * `clamp(16px, 4vw, 56px)` posée sur le MÊME élément que le `max-width`
 * (la poser sur la section puis plafonner l'intérieur décalerait la colonne sur
 * très grand écran). Header, sections et pied partagent cette largeur.
 *
 * Les sections ne portent donc QUE le rythme vertical ; jamais de `px-*`.
 */
export const CONTENEUR = "mx-auto w-full max-w-[1100px] px-[clamp(16px,4vw,56px)]";
