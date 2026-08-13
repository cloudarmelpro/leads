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

// La table n'est garantie qu'une fois par instance (idempotent, bon marché).
let tableEnsured = false;

/**
 * Enregistre un lead. RÈGLE 9 : si l'écriture en base échoue (ou si la base
 * n'est pas configurée), on renvoie `{ ok: false }` — jamais un faux succès.
 * La notification courriel est best-effort : elle ne bloque pas la réponse.
 */
export async function createContactLead(lead: LeadInput): Promise<CreateLeadResult> {
  const sql = getSql();
  if (!sql) {
    // Ne jamais loguer les données personnelles du lead (Loi 25).
    console.error("[contact] DATABASE_URL manquant — lead NON sauvegardé.");
    return { ok: false };
  }

  try {
    if (!tableEnsured) {
      await sql`
        CREATE TABLE IF NOT EXISTS leads (
          id         TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
          name       TEXT NOT NULL,
          email      TEXT,
          phone      TEXT,
          message    TEXT NOT NULL,
          locale     TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )`;
      tableEnsured = true;
    }

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
