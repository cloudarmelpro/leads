import type { ReactNode } from "react";

// Illustrations des cartes Services, reprises telles quelles de la maquette Accueil (Claude
// Design, 2026-09-24) : générées par docs/design-accueil/gen_service_art.py (script local, docs/ n'est pas versionné). Les textes
// viennent du dictionnaire (`services.items[i].art`), dans l'ordre d'apparition du dessin.
// Les adresses et les clients montrés sont fictifs, voulus ainsi (décision du 2026-09-24).
// Couleurs : variables `--color-art-*` (globals.css) pour suivre le thème, sauf la palette
// de l'illustration Logo, qui affiche les vraies couleurs de la marque avec leur code.
const SVG = "pointer-events-none block h-full w-full";

export const SERVICE_ART: ((a: string[]) => ReactNode)[] = [
  // Création de site web
  (a) => (
    <svg viewBox="0 0 440 400" aria-hidden className={SVG}>
      <rect x="128.5" y="110" width="2.5" height="16" rx="1.2" fill="var(--color-art-puce)" />
      <rect x="128.5" y="136" width="2.5" height="28" rx="1.2" fill="var(--color-art-puce)" />
      <rect x="128.5" y="172" width="2.5" height="28" rx="1.2" fill="var(--color-art-puce)" />
      <rect x="309" y="146" width="2.5" height="40" rx="1.2" fill="var(--color-art-puce)" />
      <rect x="131" y="16" width="178" height="368" rx="28" fill="var(--color-art-cadre)" />
      <rect x="132" y="17" width="176" height="366" rx="27" fill="none" stroke="var(--color-art-sourd)" strokeOpacity="0.22" strokeWidth="2" />
      <rect x="137" y="22" width="166" height="356" rx="23" fill="var(--color-art-ecran)" />
      <rect x="196" y="30" width="48" height="15" rx="7.5" fill="var(--color-art-creux)" />
      <rect x="151" y="58" width="138" height="26" rx="13" fill="var(--color-art-creux)" />
      <circle cx="165" cy="71" r="3" fill="var(--color-art-vert)" />
      <text x="175" y="75" fontSize="12" fontWeight="500" fill="var(--color-art-sourd)">{a[0]}</text>
      <g transform="translate(151,98) scale(0.1184)" fill="var(--color-art-vert)"><rect x="0" y="0" width="182" height="20" /><rect x="37" y="20" width="24" height="132" /><rect x="86" y="29" width="25" height="123" /><rect x="129" y="49" width="53" height="20" /><rect x="159" y="69" width="23" height="83" /><rect x="86" y="130" width="96" height="22" /></g>
      <rect x="268" y="102" width="21" height="2" rx="1" fill="var(--color-art-texte)" />
      <rect x="268" y="108" width="21" height="2" rx="1" fill="var(--color-art-texte)" />
      <rect x="268" y="114" width="15" height="2" rx="1" fill="var(--color-art-texte)" />
      <text x="151" y="152" fontSize="17" fontWeight="700" fill="var(--color-art-texte)">{a[1]}</text>
      <text x="151" y="174" fontSize="17" fontWeight="700" fill="var(--color-art-texte)">{a[2]}</text>
      <text x="151" y="196" fontSize="17" fontWeight="700" fill="var(--color-art-texte)">{a[3]}</text>
      <text x="151" y="220" fontSize="12" fontWeight="400" fill="var(--color-art-sourd)">{a[4]}</text>
      <rect x="151" y="238" width="138" height="38" rx="8" fill="var(--color-art-vert)" />
      <text x="220" y="262" fontSize="12" fontWeight="600" fill="var(--color-art-sur-vert)" textAnchor="middle">{a[5]}</text>
      <rect x="151" y="294" width="138" height="30" rx="8" fill="var(--color-art-puce)" />
      <rect x="163" y="305" width="8" height="8" fill="var(--color-art-vert)" />
      <text x="181" y="314" fontSize="12" fontWeight="500" fill="var(--color-art-texte)">{a[6]}</text>
      <rect x="151" y="330" width="138" height="30" rx="8" fill="var(--color-art-puce)" />
      <rect x="163" y="341" width="8" height="8" fill="var(--color-art-vert)" />
      <text x="181" y="350" fontSize="12" fontWeight="500" fill="var(--color-art-texte)">{a[7]}</text>
      <rect x="200" y="368" width="40" height="4" rx="2" fill="var(--color-art-sourd)" fillOpacity="0.3" />
    </svg>
  ),
  // Refonte de site existant
  (a) => (
    <svg viewBox="0 0 440 170" aria-hidden className={SVG}>
      <text x="16" y="70" fontSize="46" fontWeight="700" fill="var(--color-art-texte)">{a[0]}<tspan fontSize="16" fontWeight="500" fill="var(--color-art-sourd)">{a[1]}</tspan></text>
      <text x="16" y="94" fontSize="12" fontWeight="400" fill="var(--color-art-sourd)">{a[2]}</text>
      <circle cx="256" cy="48" r="5" fill="var(--color-art-sourd)" />
      <text x="272" y="53" fontSize="14" fontWeight="500" fill="var(--color-art-texte)">{a[3]}</text>
      <line x1="323.2" y1="48" x2="392" y2="48" stroke="var(--color-art-sourd)" strokeOpacity="0.45" strokeWidth="1.5" strokeDasharray="0.1 6" strokeLinecap="round" />
      <text x="424" y="53" fontSize="14" fontWeight="600" fill="var(--color-art-sourd)" textAnchor="end">{a[4]}</text>
      <circle cx="256" cy="96" r="5" fill="var(--color-art-vert)" />
      <text x="272" y="101" fontSize="14" fontWeight="500" fill="var(--color-art-texte)">{a[5]}</text>
      <line x1="323.2" y1="96" x2="392" y2="96" stroke="var(--color-art-sourd)" strokeOpacity="0.45" strokeWidth="1.5" strokeDasharray="0.1 6" strokeLinecap="round" />
      <text x="424" y="101" fontSize="14" fontWeight="600" fill="var(--color-art-vert-texte)" textAnchor="end">{a[6]}</text>
    </svg>
  ),
  // Hébergement
  (a) => (
    <svg viewBox="0 0 440 170" aria-hidden className={SVG}>
      <circle cx="26" cy="30" r="15" fill="var(--color-art-vert)" fillOpacity="0.12" />
      <circle cx="26" cy="30" r="9" fill="var(--color-art-vert)" fillOpacity="0.25" />
      <circle cx="26" cy="30" r="4.5" fill="var(--color-art-vert)" />
      <text x="50" y="35" fontSize="14" fontWeight="600" fill="var(--color-art-texte)">{a[0]}</text>
      <text x="16" y="98" fontSize="36" fontWeight="700" fill="var(--color-art-texte)">{a[1]}</text>
      <text x="16" y="122" fontSize="12" fontWeight="400" fill="var(--color-art-sourd)">{a[2]}</text>
      <rect x="250" y="48" width="4" height="70" rx="2" fill="var(--color-art-vert)" /><rect x="257" y="48" width="4" height="70" rx="2" fill="var(--color-art-vert)" /><rect x="264" y="48" width="4" height="70" rx="2" fill="var(--color-art-vert)" /><rect x="271" y="48" width="4" height="70" rx="2" fill="var(--color-art-vert)" /><rect x="278" y="48" width="4" height="70" rx="2" fill="var(--color-art-vert)" /><rect x="285" y="48" width="4" height="70" rx="2" fill="var(--color-art-vert)" /><rect x="292" y="48" width="4" height="70" rx="2" fill="var(--color-art-vert)" /><rect x="299" y="48" width="4" height="70" rx="2" fill="var(--color-art-vert)" /><rect x="306" y="48" width="4" height="70" rx="2" fill="var(--color-art-vert)" /><rect x="313" y="48" width="4" height="70" rx="2" fill="var(--color-art-vert)" fillOpacity="0.45" /><rect x="320" y="48" width="4" height="70" rx="2" fill="var(--color-art-vert)" /><rect x="327" y="48" width="4" height="70" rx="2" fill="var(--color-art-vert)" /><rect x="334" y="48" width="4" height="70" rx="2" fill="var(--color-art-vert)" /><rect x="341" y="48" width="4" height="70" rx="2" fill="var(--color-art-vert)" /><rect x="348" y="48" width="4" height="70" rx="2" fill="var(--color-art-vert)" /><rect x="355" y="48" width="4" height="70" rx="2" fill="var(--color-art-vert)" /><rect x="362" y="48" width="4" height="70" rx="2" fill="var(--color-art-vert)" /><rect x="369" y="48" width="4" height="70" rx="2" fill="var(--color-art-vert)" /><rect x="376" y="48" width="4" height="70" rx="2" fill="var(--color-art-vert)" /><rect x="383" y="48" width="4" height="70" rx="2" fill="var(--color-art-vert)" /><rect x="390" y="48" width="4" height="70" rx="2" fill="var(--color-art-vert)" /><rect x="397" y="48" width="4" height="70" rx="2" fill="var(--color-art-vert)" /><rect x="404" y="48" width="4" height="70" rx="2" fill="var(--color-art-vert)" /><rect x="411" y="48" width="4" height="70" rx="2" fill="var(--color-art-vert)" /><rect x="418" y="48" width="4" height="70" rx="2" fill="var(--color-art-vert)" />
      <text x="250" y="138" fontSize="12" fontWeight="400" fill="var(--color-art-sourd)">{a[3]}</text>
    </svg>
  ),
  // Adresses courriel professionnelles
  (a) => (
    <svg viewBox="0 0 440 170" aria-hidden className={SVG}>
      <rect x="16" y="16" width="40" height="40" rx="10" fill="var(--color-art-puce)" />
      <text x="36" y="42" fontSize="18" fontWeight="700" fill="var(--color-art-vert-texte)" textAnchor="middle">{a[0]}</text>
      <text x="70" y="33" fontSize="14" fontWeight="600" fill="var(--color-art-texte)">{a[1]}</text>
      <text x="70" y="50" fontSize="12" fontWeight="400" fill="var(--color-art-sourd)">{a[2]}</text>
      <rect x="378" y="25" width="46" height="22" rx="11" fill="var(--color-art-puce)" />
      <text x="401" y="40" fontSize="12" fontWeight="600" fill="var(--color-art-vert-texte)" textAnchor="middle">{a[3]}</text>
      <rect x="16" y="65" width="40" height="40" rx="10" fill="var(--color-art-puce)" />
      <text x="36" y="91" fontSize="18" fontWeight="700" fill="var(--color-art-vert-texte)" textAnchor="middle">{a[4]}</text>
      <text x="70" y="82" fontSize="14" fontWeight="600" fill="var(--color-art-texte)">{a[5]}</text>
      <text x="70" y="99" fontSize="12" fontWeight="400" fill="var(--color-art-sourd)">{a[6]}</text>
      <rect x="378" y="74" width="46" height="22" rx="11" fill="var(--color-art-puce)" />
      <text x="401" y="89" fontSize="12" fontWeight="600" fill="var(--color-art-vert-texte)" textAnchor="middle">{a[7]}</text>
      <rect x="16" y="114" width="40" height="40" rx="10" fill="var(--color-art-puce)" />
      <text x="36" y="140" fontSize="18" fontWeight="700" fill="var(--color-art-vert-texte)" textAnchor="middle">{a[8]}</text>
      <text x="70" y="131" fontSize="14" fontWeight="600" fill="var(--color-art-texte)">{a[9]}</text>
      <text x="70" y="148" fontSize="12" fontWeight="400" fill="var(--color-art-sourd)">{a[10]}</text>
      <rect x="378" y="123" width="46" height="22" rx="11" fill="var(--color-art-puce)" />
      <text x="401" y="138" fontSize="12" fontWeight="600" fill="var(--color-art-vert-texte)" textAnchor="middle">{a[11]}</text>
    </svg>
  ),
  // Logo et identité de marque
  (a) => (
    <svg viewBox="0 0 440 170" aria-hidden className={SVG}>
      <rect x="16" y="16" width="88" height="88" rx="20" fill="#30D98C" />
      <g transform="translate(33,37.45) scale(0.2967)" fill="#00131C"><rect x="0" y="0" width="182" height="20" /><rect x="37" y="20" width="24" height="132" /><rect x="86" y="29" width="25" height="123" /><rect x="129" y="49" width="53" height="20" /><rect x="159" y="69" width="23" height="83" /><rect x="86" y="130" width="96" height="22" /></g>
      <circle cx="146" cy="32" r="5" fill="#30D98C" />
      <text x="164" y="37" fontSize="14" fontWeight="500" fill="var(--color-art-texte)">{a[0]}</text>
      <line x1="262.24" y1="32" x2="366" y2="32" stroke="var(--color-art-sourd)" strokeOpacity="0.45" strokeWidth="1.5" strokeDasharray="0.1 6" strokeLinecap="round" />
      <text x="424" y="37" fontSize="14" fontWeight="500" fill="var(--color-art-sourd)" textAnchor="end">{a[1]}</text>
      <circle cx="146" cy="64" r="5" fill="#00131C" stroke="var(--color-art-sourd)" strokeOpacity="0.45" />
      <text x="164" y="69" fontSize="14" fontWeight="500" fill="var(--color-art-texte)">{a[2]}</text>
      <line x1="207.36" y1="64" x2="366" y2="64" stroke="var(--color-art-sourd)" strokeOpacity="0.45" strokeWidth="1.5" strokeDasharray="0.1 6" strokeLinecap="round" />
      <text x="424" y="69" fontSize="14" fontWeight="500" fill="var(--color-art-sourd)" textAnchor="end">{a[3]}</text>
      <circle cx="146" cy="96" r="5" fill="#01293C" stroke="var(--color-art-sourd)" strokeOpacity="0.45" />
      <text x="164" y="101" fontSize="14" fontWeight="500" fill="var(--color-art-texte)">{a[4]}</text>
      <line x1="230.88" y1="96" x2="366" y2="96" stroke="var(--color-art-sourd)" strokeOpacity="0.45" strokeWidth="1.5" strokeDasharray="0.1 6" strokeLinecap="round" />
      <text x="424" y="101" fontSize="14" fontWeight="500" fill="var(--color-art-sourd)" textAnchor="end">{a[5]}</text>
      <circle cx="146" cy="128" r="5" fill="#FFFFFF" stroke="var(--color-art-sourd)" strokeOpacity="0.45" />
      <text x="164" y="133" fontSize="14" fontWeight="500" fill="var(--color-art-texte)">{a[6]}</text>
      <line x1="223.04" y1="128" x2="366" y2="128" stroke="var(--color-art-sourd)" strokeOpacity="0.45" strokeWidth="1.5" strokeDasharray="0.1 6" strokeLinecap="round" />
      <text x="424" y="133" fontSize="14" fontWeight="500" fill="var(--color-art-sourd)" textAnchor="end">{a[7]}</text>
    </svg>
  ),
  // Serveurs VPS
  (a) => (
    <svg viewBox="0 0 440 400" aria-hidden className={SVG}>
      <g transform="rotate(-90 60 76)" fill="none" strokeWidth="22"><circle cx="60" cy="76" r="44" stroke="var(--color-art-vert)" strokeDasharray="102.66 173.8" strokeDashoffset="0" /><circle cx="60" cy="76" r="44" stroke="var(--color-art-sourd)" strokeOpacity="0.30" strokeDasharray="87.18 189.28" strokeDashoffset="-106.16" /><circle cx="60" cy="76" r="44" stroke="var(--color-art-vert)" strokeOpacity="0.50" strokeDasharray="44.05 232.41" strokeDashoffset="-196.84" /><circle cx="60" cy="76" r="44" stroke="var(--color-art-sourd)" strokeOpacity="0.70" strokeDasharray="28.57 247.89" strokeDashoffset="-244.39" /></g>
      <text x="126" y="74" fontSize="32" fontWeight="700" fill="var(--color-art-texte)">{a[0]}</text>
      <text x="126" y="98" fontSize="14" fontWeight="400" fill="var(--color-art-sourd)">{a[1]}</text>
      <circle cx="22" cy="180" r="6" fill="var(--color-art-vert)" />
      <text x="44" y="185" fontSize="14" fontWeight="500" fill="var(--color-art-texte)">{a[2]}</text>
      <line x1="126.56" y1="180" x2="360" y2="180" stroke="var(--color-art-sourd)" strokeOpacity="0.45" strokeWidth="1.5" strokeDasharray="0.1 6" strokeLinecap="round" />
      <text x="424" y="185" fontSize="14" fontWeight="600" fill="var(--color-art-texte)" textAnchor="end">{a[3]}</text>
      <circle cx="22" cy="228" r="6" fill="var(--color-art-sourd)" fillOpacity="0.30" />
      <text x="44" y="233" fontSize="14" fontWeight="500" fill="var(--color-art-texte)">{a[4]}</text>
      <line x1="150.08" y1="228" x2="360" y2="228" stroke="var(--color-art-sourd)" strokeOpacity="0.45" strokeWidth="1.5" strokeDasharray="0.1 6" strokeLinecap="round" />
      <text x="424" y="233" fontSize="14" fontWeight="600" fill="var(--color-art-texte)" textAnchor="end">{a[5]}</text>
      <circle cx="22" cy="276" r="6" fill="var(--color-art-vert)" fillOpacity="0.50" />
      <text x="44" y="281" fontSize="14" fontWeight="500" fill="var(--color-art-texte)">{a[6]}</text>
      <line x1="181.44" y1="276" x2="360" y2="276" stroke="var(--color-art-sourd)" strokeOpacity="0.45" strokeWidth="1.5" strokeDasharray="0.1 6" strokeLinecap="round" />
      <text x="424" y="281" fontSize="14" fontWeight="600" fill="var(--color-art-texte)" textAnchor="end">{a[7]}</text>
      <circle cx="22" cy="324" r="6" fill="var(--color-art-sourd)" fillOpacity="0.70" />
      <text x="44" y="329" fontSize="14" fontWeight="500" fill="var(--color-art-texte)">{a[8]}</text>
      <line x1="142.24" y1="324" x2="360" y2="324" stroke="var(--color-art-sourd)" strokeOpacity="0.45" strokeWidth="1.5" strokeDasharray="0.1 6" strokeLinecap="round" />
      <text x="424" y="329" fontSize="14" fontWeight="600" fill="var(--color-art-texte)" textAnchor="end">{a[9]}</text>
    </svg>
  ),
  // CRM et automatisations
  (a) => (
    <svg viewBox="0 0 440 400" aria-hidden className={SVG}>
      <text x="16" y="30" fontSize="14" fontWeight="600" fill="var(--color-art-texte)">{a[0]}</text>
      <text x="20" y="56" fontSize="12" fontWeight="600" fill="var(--color-art-sourd)">{a[1]}</text>
      <text x="140" y="56" fontSize="12" fontWeight="600" fill="var(--color-art-sourd)" textAnchor="end">{a[2]}</text>
      <rect x="16" y="64" width="128" height="226" rx="10" fill="var(--color-art-ecran)" />
      <rect x="26" y="76" width="108" height="78" rx="8" fill="var(--color-art-puce)" />
      <text x="38" y="100" fontSize="12" fontWeight="600" fill="var(--color-art-texte)">{a[3]}</text>
      <text x="38" y="117" fontSize="12" fontWeight="600" fill="var(--color-art-texte)">{a[4]}</text>
      <text x="38" y="138" fontSize="12" fontWeight="400" fill="var(--color-art-sourd)">{a[5]}</text>
      <rect x="26" y="166" width="108" height="78" rx="8" fill="var(--color-art-puce)" />
      <text x="38" y="190" fontSize="12" fontWeight="600" fill="var(--color-art-texte)">{a[6]}</text>
      <text x="38" y="207" fontSize="12" fontWeight="600" fill="var(--color-art-texte)">{a[7]}</text>
      <text x="38" y="228" fontSize="12" fontWeight="400" fill="var(--color-art-sourd)">{a[8]}</text>
      <text x="160" y="56" fontSize="12" fontWeight="600" fill="var(--color-art-sourd)">{a[9]}</text>
      <text x="280" y="56" fontSize="12" fontWeight="600" fill="var(--color-art-sourd)" textAnchor="end">{a[10]}</text>
      <rect x="156" y="64" width="128" height="226" rx="10" fill="var(--color-art-ecran)" />
      <rect x="166" y="76" width="108" height="78" rx="8" fill="var(--color-art-puce)" />
      <text x="178" y="100" fontSize="12" fontWeight="600" fill="var(--color-art-texte)">{a[11]}</text>
      <text x="178" y="117" fontSize="12" fontWeight="600" fill="var(--color-art-texte)">{a[12]}</text>
      <text x="178" y="138" fontSize="12" fontWeight="400" fill="var(--color-art-sourd)">{a[13]}</text>
      <text x="300" y="56" fontSize="12" fontWeight="600" fill="var(--color-art-sourd)">{a[14]}</text>
      <text x="420" y="56" fontSize="12" fontWeight="600" fill="var(--color-art-sourd)" textAnchor="end">{a[15]}</text>
      <rect x="296" y="64" width="128" height="226" rx="10" fill="var(--color-art-ecran)" />
      <rect x="306" y="76" width="108" height="78" rx="8" fill="var(--color-art-puce)" stroke="var(--color-art-vert)" strokeOpacity="0.45" />
      <text x="318" y="100" fontSize="12" fontWeight="600" fill="var(--color-art-texte)">{a[16]}</text>
      <text x="318" y="117" fontSize="12" fontWeight="600" fill="var(--color-art-texte)">{a[17]}</text>
      <text x="318" y="138" fontSize="12" fontWeight="400" fill="var(--color-art-sourd)">{a[18]}</text>
      <rect x="306" y="166" width="108" height="78" rx="8" fill="var(--color-art-puce)" stroke="var(--color-art-vert)" strokeOpacity="0.45" />
      <text x="318" y="190" fontSize="12" fontWeight="600" fill="var(--color-art-texte)">{a[19]}</text>
      <text x="318" y="207" fontSize="12" fontWeight="600" fill="var(--color-art-texte)">{a[20]}</text>
      <text x="318" y="228" fontSize="12" fontWeight="400" fill="var(--color-art-sourd)">{a[21]}</text>
    </svg>
  ),
  // Blogue et contenu SEO
  (a) => (
    <svg viewBox="0 0 440 400" aria-hidden className={SVG}>
      <g transform="rotate(-90 60 76)" fill="none" strokeWidth="22"><circle cx="60" cy="76" r="44" stroke="var(--color-art-vert)" strokeDasharray="141.37 135.09" strokeDashoffset="0" /><circle cx="60" cy="76" r="44" stroke="var(--color-art-sourd)" strokeOpacity="0.30" strokeDasharray="56.77 219.69" strokeDashoffset="-144.87" /><circle cx="60" cy="76" r="44" stroke="var(--color-art-vert)" strokeOpacity="0.50" strokeDasharray="36.03 240.43" strokeDashoffset="-205.14" /><circle cx="60" cy="76" r="44" stroke="var(--color-art-sourd)" strokeOpacity="0.70" strokeDasharray="28.29 248.17" strokeDashoffset="-244.67" /></g>
      <text x="126" y="74" fontSize="32" fontWeight="700" fill="var(--color-art-texte)">{a[0]}</text>
      <text x="126" y="98" fontSize="14" fontWeight="400" fill="var(--color-art-sourd)">{a[1]}</text>
      <circle cx="22" cy="180" r="6" fill="var(--color-art-vert)" />
      <text x="44" y="185" fontSize="14" fontWeight="500" fill="var(--color-art-texte)">{a[2]}</text>
      <line x1="181.44" y1="180" x2="360" y2="180" stroke="var(--color-art-sourd)" strokeOpacity="0.45" strokeWidth="1.5" strokeDasharray="0.1 6" strokeLinecap="round" />
      <text x="424" y="185" fontSize="14" fontWeight="600" fill="var(--color-art-texte)" textAnchor="end">{a[3]}</text>
      <circle cx="22" cy="228" r="6" fill="var(--color-art-sourd)" fillOpacity="0.30" />
      <text x="44" y="233" fontSize="14" fontWeight="500" fill="var(--color-art-texte)">{a[4]}</text>
      <line x1="150.08" y1="228" x2="360" y2="228" stroke="var(--color-art-sourd)" strokeOpacity="0.45" strokeWidth="1.5" strokeDasharray="0.1 6" strokeLinecap="round" />
      <text x="424" y="233" fontSize="14" fontWeight="600" fill="var(--color-art-texte)" textAnchor="end">{a[5]}</text>
      <circle cx="22" cy="276" r="6" fill="var(--color-art-vert)" fillOpacity="0.50" />
      <text x="44" y="281" fontSize="14" fontWeight="500" fill="var(--color-art-texte)">{a[6]}</text>
      <line x1="173.6" y1="276" x2="360" y2="276" stroke="var(--color-art-sourd)" strokeOpacity="0.45" strokeWidth="1.5" strokeDasharray="0.1 6" strokeLinecap="round" />
      <text x="424" y="281" fontSize="14" fontWeight="600" fill="var(--color-art-texte)" textAnchor="end">{a[7]}</text>
      <circle cx="22" cy="324" r="6" fill="var(--color-art-sourd)" fillOpacity="0.70" />
      <text x="44" y="329" fontSize="14" fontWeight="500" fill="var(--color-art-texte)">{a[8]}</text>
      <line x1="173.6" y1="324" x2="360" y2="324" stroke="var(--color-art-sourd)" strokeOpacity="0.45" strokeWidth="1.5" strokeDasharray="0.1 6" strokeLinecap="round" />
      <text x="424" y="329" fontSize="14" fontWeight="600" fill="var(--color-art-texte)" textAnchor="end">{a[9]}</text>
    </svg>
  ),
];
