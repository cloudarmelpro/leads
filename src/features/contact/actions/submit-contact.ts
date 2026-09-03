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
// 1) l'IP dépend d'un unique reverse-proxy de confiance en amont (voir `clientIp`) ;
// 2) mono-instance : un déploiement multi-instance exigerait un store partagé.
// Le seau global couvre le cas d'un flot réparti sur des IP forgées, que le seau
// par IP laisserait passer.
const HITS = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000; // 1 h
const MAX_PER_IP = 5;
const MAX_GLOBAL = 60;
let globalHits: number[] = [];
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

  globalHits = globalHits.filter((t) => now - t < WINDOW_MS);
  if (globalHits.length >= MAX_GLOBAL) return true;

  const recent = (HITS.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_IP) return true;

  recent.push(now);
  HITS.set(ip, recent);
  globalHits.push(now);
  return false;
}

/**
 * DERNIER élément de `x-forwarded-for` : c'est celui écrit par le proxy le plus
 * proche de l'application. Le premier est fourni par le client et se falsifie —
 * l'utiliser rendrait le seau par IP contournable à volonté. Ce choix suppose
 * exactement UN proxy de confiance devant le serveur (Hostinger).
 */
async function clientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded.split(",");
    const last = parts[parts.length - 1]?.trim();
    if (last) return last;
  }
  return h.get("x-real-ip")?.trim() || "unknown";
}

/**
 * L'entrée arrive d'un appel réseau : `input` n'est PAS typé à l'exécution, un
 * appel forgé peut envoyer `null` ou une chaîne. Tout est lu à travers `raw`, puis
 * revalidé par Zod — la validation react-hook-form ne sert qu'à l'UX. Renvoie
 * `fieldErrors` (clés i18n) pour réafficher les erreurs champ par champ.
 */
export async function submitContact(
  input: unknown,
  locale: unknown,
): Promise<ActionResult> {
  const raw: Record<string, unknown> =
    input !== null && typeof input === "object" ? (input as Record<string, unknown>) : {};

  // 1. Honeypot : seul un bot remplit ce champ caché. Faux succès silencieux —
  //    on n'enregistre rien et on ne le renseigne pas sur le rejet.
  if (typeof raw.website === "string" && raw.website.trim() !== "") {
    return { status: "success" };
  }

  // 2. Rate limiting. Réponse volontairement identique à une erreur générique :
  //    rien ne doit distinguer « trop de requêtes » d'un échec quelconque.
  if (rateLimited(await clientIp())) return { status: "error" };

  // 3. Validation Zod → erreurs par champ (clés de dictionnaire).
  const parsed = contactSchema.safeParse(raw);
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
    locale: typeof locale === "string" && isLocale(locale) ? locale : "fr",
  });
  return result.ok ? { status: "success" } : { status: "error" };
}
