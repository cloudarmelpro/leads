import "server-only";

import { Resend } from "resend";

// Type local : `lib/` est feuille, il ne dépend pas de `features/`.
type Payload = {
  name: string;
  email: string;
  phone: string;
  message: string;
  locale: string;
};

/**
 * Notifie l'agence d'un nouveau lead par courriel (Resend).
 * Best-effort : si les variables d'env manquent, on n'envoie rien (le lead est
 * de toute façon déjà sauvegardé en base). Peut lever — l'appelant l'attrape.
 */
export async function sendLeadNotification(lead: Payload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFICATION_EMAIL;

  if (!apiKey || !to) {
    console.warn("[email] RESEND_API_KEY ou LEAD_NOTIFICATION_EMAIL manquant — notification ignorée.");
    return;
  }

  const resend = new Resend(apiKey);
  const from = process.env.LEAD_FROM_EMAIL || "onboarding@resend.dev";

  await resend.emails.send({
    from,
    to,
    replyTo: lead.email || undefined,
    subject: `Nouveau lead — ${lead.name}`,
    text: [
      `Nom : ${lead.name}`,
      `Courriel : ${lead.email || "—"}`,
      `Téléphone : ${lead.phone || "—"}`,
      `Langue : ${lead.locale}`,
      "",
      lead.message,
    ].join("\n"),
  });
}
