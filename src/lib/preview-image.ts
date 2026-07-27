/**
 * ⚠️ APERÇU UNIQUEMENT — images de remplacement pour juger la mise en page.
 *
 * Ces URL pointent vers un service externe (Lorem Picsum) : elles NE DOIVENT PAS
 * partir en production. Avant la mise en ligne : passer `PREVIEW_IMAGES` à `false`
 * (ou retirer ce module) et brancher les vraies photos client via `next/image`.
 *
 * Les photos sont NEUTRES, pas spécifiques au métier : elles servent à donner du
 * poids visuel réel, pas à illustrer un secteur. Ne jamais les laisser passer pour
 * une réalisation réelle de l'agence.
 */

export const PREVIEW_IMAGES = true;

/** URL stable (seed) → même image à chaque rendu, tant que le seed ne change pas. */
export function previewImage(seed: string, width: number, height: number): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;
}

/** Style de fond « cover » prêt à poser sur un conteneur, ou `undefined` si désactivé. */
export function previewBg(
  seed: string,
  width: number,
  height: number,
): React.CSSProperties | undefined {
  if (!PREVIEW_IMAGES) return undefined;
  return {
    backgroundImage: `url(${previewImage(seed, width, height)})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
}

/**
 * Aperçu par métier (mots-clés) : chaque secteur montre une image RELEVANTE.
 * L'ordre suit celui de `hero.demos` : paysagement, excavation, construction,
 * rénovation, commerce local. Si le chargement échoue, la trame de fond reste visible.
 */
/**
 * Portraits placeholder pour la section équipe (service pravatar).
 * ⚠️ Visages génériques d'aperçu — les noms restent « [NOM] », donc personne
 * n'est présenté comme un vrai membre. À remplacer par les vraies photos.
 */
const TEAM_AVATARS = [12, 33, 45, 5, 60];

export function teamPreviewBg(index: number): React.CSSProperties | undefined {
  if (!PREVIEW_IMAGES) return undefined;
  const id = TEAM_AVATARS[index % TEAM_AVATARS.length];
  return avatarPreviewBg(id);
}

/** Avatar placeholder (pravatar) par identifiant — auteurs d'articles, etc. */
export function avatarPreviewBg(id: number): React.CSSProperties | undefined {
  if (!PREVIEW_IMAGES) return undefined;
  return {
    backgroundImage: `url(https://i.pravatar.cc/160?img=${id})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
}

const TRADE_KEYWORDS = ["landscaping", "excavator", "construction", "renovation", "storefront"];

export function tradePreviewBg(
  index: number,
  width: number,
  height: number,
): React.CSSProperties | undefined {
  if (!PREVIEW_IMAGES) return undefined;
  const keyword = TRADE_KEYWORDS[index % TRADE_KEYWORDS.length];
  return {
    backgroundImage: `url(https://loremflickr.com/${width}/${height}/${keyword}?lock=${index + 1})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
}
