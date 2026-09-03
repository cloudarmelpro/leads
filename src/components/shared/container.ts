/**
 * Le conteneur de page — récupéré du site maldia (site-web), valeurs exactes.
 *
 * La gouttière est POSÉE DANS la boîte, pas autour : `max-width` ET `padding` sur
 * le MÊME élément. Poser la gouttière sur la section puis plafonner l'intérieur
 * décalerait la colonne sur très grand écran. Un seul endroit : header, sections
 * et pied partagent cette largeur (1080px) et cette gouttière (20 → 56px).
 *
 * Les sections ne portent donc QUE le rythme vertical ; jamais de `px-*`.
 */
// Plancher à 1rem (et non 1.25rem) : à 320px, les 8px récupérés font la différence
// entre un burger atteignable et un en-tête qui déborde du viewport.
export const CONTENEUR = "mx-auto w-full max-w-[67.5rem] px-[clamp(1rem,4vw,3.5rem)]";
