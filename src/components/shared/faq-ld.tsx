type Item = { q: string; a: string; aLink?: string };
type Props = { items: Item[] };

/**
 * JSON-LD `FAQPage` : les questions et réponses déjà affichées sur la page (accueil,
 * Services), pour les résultats enrichis de Google. Le texte doit être le même que celui
 * rendu : la balise `{link}` d'une réponse est remplacée par le libellé du lien.
 */
export function FaqLd({ items }: Props) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a.replace("{link}", item.aLink ?? "") },
    })),
  };

  return (
    <script
      type="application/ld+json"
      // Contenu 100% contrôlé (dictionnaires, aucune entrée utilisateur).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
