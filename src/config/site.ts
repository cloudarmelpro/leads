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
  // Aucun bureau officiel pour l'instant → adresse retirée du site (footer + contact).
  address: null as string | null,
  whatsapp: null as string | null,
  // Nom d'utilisateur Messenger (m.me/<nom>). null tant que le compte n'existe pas.
  messenger: null as string | null,
  // Lien Cal.com au format "compte/evenement" (ex. "cloudarmelpro-jj7yjv/leads").
  // Tant qu'il est null, la page contact affiche la maquette ; dès qu'il est
  // rempli, l'embed Cal.com réel s'affiche automatiquement.
  calLink: "cedric.agence/talgasy-web" as string | null,
  // Clés = `footer.social.*` des dictionnaires (libellés a11y). Pas d'URL tant
  // que les comptes n'existent pas : le footer les rend en placeholder.
  social: [{ key: "facebook" }, { key: "linkedin" }, { key: "instagram" }],
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

export function calcomHref(calLink: string | null): string | null {
  return calLink ? `https://cal.com/${calLink}` : null;
}
