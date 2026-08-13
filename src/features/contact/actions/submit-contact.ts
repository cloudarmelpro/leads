"use server";

import { headers } from "next/headers";

import {
  contactSchema,
  type ActionResult,
  type ContactInput,
} from "@/features/contact/schemas/contact";
import { createContactLead } from "@/features/contact/services/create-lead";
import { isLocale } from "@/lib/i18n/config";

// Limiteur de débit best-effort (mémoire par instance). Deux limites connues :
// 1) l'IP vient de `x-forwarded-for`, falsifiable si le reverse-proxy d'hébergement
//    ne le réécrit pas — ne s'y fier qu'en présence d'un proxy de confiance ;
// 2) mono-instance : pour un vrai contrôle multi-instance, brancher un store
//    (Upstash/Redis) — voir tache.md T5.2. La purge ci-dessous borne la mémoire.
const HITS = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000; // 1 h
const MAX_PER_WINDOW = 5;
let lastSweep = Date.now();

// Purge périodique des IP dont tous les hits ont expiré (évite la croissance non
// bornée de la Map sous un flot d'IP forgées).
function sweep(now: number): void {
  if (now - lastSweep < WINDOW_MS) return;
  lastSweep = now;
  for (const [ip, times] of HITS) {
    if (times.every((t) => now - t >= WINDOW_MS)) HITS.delete(ip);
  }
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  sweep(now);
  const recent = (HITS.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) return true;
  recent.push(now);
  HITS.set(ip, recent);
  return false;
}

/**
 * La validation côté serveur est la seule garantie : celle de react-hook-form
 * est contournable et ne sert qu'à l'UX. Renvoie `fieldErrors` (clés i18n) pour
 * réafficher les erreurs champ par champ.
 */
export async function submitContact(
  input: ContactInput,
  locale: string,
): Promise<ActionResult> {
  // 1. Honeypot : seul un bot remplit ce champ caché. Faux succès silencieux —
  //    on n'enregistre rien et on ne le renseigne pas sur le rejet.
  if (typeof input.website === "string" && input.website.trim() !== "") {
    return { status: "success" };
  }

  // 2. Rate limiting par IP.
  const ip =
    (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return { status: "error" };

  // 3. Validation Zod → erreurs par champ (clés de dictionnaire).
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof ContactInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !(key in fieldErrors)) {
        fieldErrors[key as keyof ContactInput] = issue.message;
      }
    }
    return { status: "error", fieldErrors };
  }

  // 4. Écriture (+ notification). Règle 9 gérée dans le service.
  const d = parsed.data;
  const result = await createContactLead({
    name: d.name,
    email: d.email,
    phone: d.phone,
    message: d.message,
    locale: isLocale(locale) ? locale : "fr",
  });
  return result.ok ? { status: "success" } : { status: "error" };
}
