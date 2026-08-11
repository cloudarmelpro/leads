"use server";

import { headers } from "next/headers";

import {
  bookingSchema,
  type BookingActionResult,
  type BookingInput,
} from "@/features/contact/schemas/booking";
import { createContactLead } from "@/features/contact/services/create-lead";
import { isLocale } from "@/lib/i18n/config";

// Limiteur best-effort (mémoire par instance) — même principe que le contact.
const HITS = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000; // 1 h
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (HITS.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) return true;
  recent.push(now);
  HITS.set(ip, recent);
  return false;
}

/**
 * Préqualification : on enregistre la demande (comme un lead) AVANT de débloquer
 * le calendrier. Les réponses (entreprise, service, budget, besoin) sont assemblées
 * dans le `message` du lead — pas de nouveau schéma de base à gérer. RÈGLE 9 : si
 * l'enregistrement échoue, on renvoie une erreur (le calendrier ne se débloque pas).
 */
export async function submitBooking(
  input: BookingInput,
  locale: string,
): Promise<BookingActionResult> {
  // 1. Honeypot : faux succès silencieux (on ne débloque rien de sensible ici).
  if (typeof input.website === "string" && input.website.trim() !== "") {
    return { status: "success" };
  }

  // 2. Rate limiting par IP.
  const ip =
    (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return { status: "error" };

  // 3. Validation Zod → erreurs par champ (clés i18n).
  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof BookingInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !(key in fieldErrors)) {
        fieldErrors[key as keyof BookingInput] = issue.message;
      }
    }
    return { status: "error", fieldErrors };
  }

  // 4. Assemble un message lisible pour la notification, puis enregistre le lead.
  const d = parsed.data;
  const message = [
    "[Réservation d'appel — préqualification]",
    `Entreprise : ${d.company.trim() || "—"}`,
    `Service recherché : ${d.service}`,
    `Budget approximatif : ${d.budget}`,
    "",
    d.description.trim(),
  ].join("\n");

  const result = await createContactLead({
    name: d.name,
    email: d.email,
    phone: d.phone,
    message,
    locale: isLocale(locale) ? locale : "fr",
  });

  return result.ok ? { status: "success" } : { status: "error" };
}
