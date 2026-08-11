/**
 * Source unique des informations d'entreprise.
 * `null` = donnée non encore confirmée par le client (voir tache.md, phase 0).
 * Le TEXTE affiché à la place vit dans les dictionnaires (`placeholders.*`) :
 * il est visible par l'utilisateur, donc il doit être traduit comme le reste.
 */

export const site = {
  name: "Talgasy Web", // Nom de l'entreprise, affiché dans le header et le footer.
  domain: "talgasyweb.ca",
  phone: "514-808-6549" as string | null,
  email: "code.maldia@outlook.com" as string | null,
  // Aucun bureau officiel pour l'instant → adresse retirée du site (footer + contact).
  address: null as string | null,
  whatsapp: null as string | null,
  // Lien Cal.com au format "compte/evenement" (ex. "cloudarmelpro-jj7yjv/leads").
  // Tant qu'il est null, la page contact affiche la maquette ; dès qu'il est
  // rempli, l'embed Cal.com réel s'affiche automatiquement.
  calLink: "cedric.agence/talgasy-web" as string | null,
  social: [
    { key: "facebook", label: "f" },
    { key: "linkedin", label: "in" },
    { key: "instagram", label: "ig" },
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

export function calcomHref(calLink: string | null): string | null {
  return calLink ? `https://cal.com/${calLink}` : null;
}
