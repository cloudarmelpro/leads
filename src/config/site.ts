/**
 * Source unique des informations d'entreprise.
 * `null` = donnée non encore confirmée par le client.
 * Le TEXTE affiché à la place vit dans les dictionnaires (`placeholders.*`) :
 * il est visible par l'utilisateur, donc il doit être traduit comme le reste.
 */

export const site = {
  name: "Talgasy Web", // Nom de l'entreprise, affiché dans le header et le footer.
  domain: "talgasyweb.ca",
  phone: "438-808-6594" as string | null,
  email: "cedric@talgasyweb.ca" as string | null,
  // Aucun bureau officiel pour l'instant → adresse retirée du site (pied de page).
  address: null as string | null,
  // Numéro WhatsApp confirmé par le client (2026-09-07) — distinct du téléphone. Indicatif +1 exigé par wa.me.
  whatsapp: "+1 (514) 808-6549" as string | null,
  // Nom d'utilisateur Messenger (m.me/<nom>). null tant que le compte n'existe pas.
  messenger: null as string | null,
  // Clés = `footer.social.*` des dictionnaires (libellés a11y). Ordre d'affichage
  // voulu par le client : Facebook, Instagram, LinkedIn.
  social: [
    // La page n'a pas de nom d'utilisateur : son URL canonique est celle vers laquelle
    // redirige l'ancien lien de partage (vérifié le 2026-09-15).
    { key: "facebook", url: "https://www.facebook.com/profile.php?id=61593633508724" },
    { key: "instagram", url: "https://www.instagram.com/talgasyweb/" },
    { key: "linkedin", url: "https://www.linkedin.com/company/talgasy-web/" },
  ],
} as const;

export function telHref(phone: string | null): string | null {
  return phone ? `tel:${phone.replace(/[^\d+]/g, "")}` : null;
}

export function mailtoHref(email: string | null): string | null {
  return email ? `mailto:${email}` : null;
}

export function whatsappHref(number: string | null): string | null {
  return number ? `https://wa.me/${number.replace(/\D/g, "")}` : null;
}

export function messengerHref(username: string | null): string | null {
  return username ? `https://m.me/${username}` : null;
}
