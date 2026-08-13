import "server-only";

import { getSql } from "@/lib/db";
import { sendLeadNotification } from "@/lib/email/send-lead-notification";

/** Champs réellement persistés d'un lead (le consentement/honeypot n'y sont pas). */
export type LeadInput = {
  name: string;
  email: string;
  phone: string;
  message: string;
  locale: string;
};

export type CreateLeadResult = { ok: boolean };

/**
 * Enregistre un lead. RÈGLE 9 : si l'écriture en base échoue (ou si la base
 * n'est pas configurée), on renvoie `{ ok: false }` — jamais un faux succès.
 * La notification courriel est best-effort : elle ne bloque pas la réponse.
 *
 * ⚠️ La table `leads` doit exister AVANT le premier lead — créée hors runtime par
 * `scripts/init-db.sql` (rôle admin). Le rôle applicatif n'a que INSERT/SELECT.
 */
export async function createContactLead(lead: LeadInput): Promise<CreateLeadResult> {
  const sql = getSql();
  if (!sql) {
    // Ne jamais loguer les données personnelles du lead (Loi 25).
    console.error("[contact] DATABASE_URL manquant — lead NON sauvegardé.");
    return { ok: false };
  }

  try {
    await sql`
      INSERT INTO leads (name, email, phone, message, locale)
      VALUES (
        ${lead.name},
        ${lead.email || null},
        ${lead.phone || null},
        ${lead.message},
        ${lead.locale}
      )`;
  } catch (error) {
    // On logue le message, pas l'objet complet (peut contenir des valeurs PII).
    console.error("[contact] échec de l'écriture du lead:", (error as Error)?.message);
    return { ok: false };
  }

  // Le lead est sauvé : la notification ne doit jamais faire échouer la réponse.
  try {
    await sendLeadNotification(lead);
  } catch (error) {
    console.error(
      "[contact] lead sauvegardé, mais notification courriel échouée:",
      (error as Error)?.message,
    );
  }

  return { ok: true };
}
