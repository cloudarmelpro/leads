"use server";

import { headers } from "next/headers";

import { soumissionSchema, type ActionResult } from "@/features/soumission/schemas/soumission";
import { createLead } from "@/features/soumission/services/create-lead";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

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
 * L'entrée arrive d'un appel réseau : `input` n'est PAS typé à l'exécution, un appel
 * forgé peut envoyer `null` ou une chaîne. Tout est lu à travers `raw`, puis revalidé
 * par Zod — la validation côté client ne sert qu'à l'UX. Les réponses du parcours sont
 * écrites, dans la langue du visiteur, dans le champ `message` du lead : la table
 * `leads` reste inchangée.
 */
export async function submitSoumission(input: unknown, locale: unknown): Promise<ActionResult> {
  const raw: Record<string, unknown> = input !== null && typeof input === "object" ? (input as Record<string, unknown>) : {};

  // 1. Honeypot : seul un bot remplit ce champ caché. Faux succès silencieux —
  //    on n'enregistre rien et on ne le renseigne pas sur le rejet.
  if (typeof raw.website === "string" && raw.website.trim() !== "") {
    return { status: "success" };
  }

  // 2. Rate limiting. Réponse volontairement identique à une erreur générique :
  //    rien ne doit distinguer « trop de requêtes » d'un échec quelconque.
  if (rateLimited(await clientIp())) return { status: "error", error: "generic" };

  // 3. Validation Zod → une clé d'erreur (la première).
  const parsed = soumissionSchema.safeParse(raw);
  if (!parsed.success) {
    return { status: "error", error: parsed.error.issues[0]?.message ?? "generic" };
  }

  // 4. Résumé lisible des réponses, puis écriture (+ notification). Règle 9 dans le service.
  const d = parsed.data;
  const lang: Locale = typeof locale === "string" && isLocale(locale) ? locale : "fr";
  const t = (await getDictionary(lang)).soumission;
  const label = <T extends { key: string; t: string }>(opts: readonly T[], key: string) => opts.find((o) => o.key === key)?.t ?? key;
  const type = t.type.opts.find((o) => o.key === d.type);
  const lines = [
    `${t.summary.type} : ${type?.t ?? d.type}`,
    `${t.summary.sector} : ${label(t.sector.opts, d.sector)}`,
    `${t.summary.stage} : ${label(t.stage.opts, d.stage)}`,
    `${t.summary.when} : ${label(t.when.opts, d.when)}`,
    `${t.summary.fit} : ${type?.price ?? ""} — ${t.fit.yes.t}`,
    d.company && `${t.summary.company} : ${d.company}`,
    d.city && `${t.summary.city} : ${d.city}`,
    d.site && `${t.summary.site} : ${d.site}`,
    d.details && `\n${t.summary.details} :\n${d.details}`,
  ].filter((v): v is string => typeof v === "string" && v !== "");

  const result = await createLead({ name: d.name, email: d.email, phone: d.phone, message: lines.join("\n"), locale: lang });
  return result.ok ? { status: "success" } : { status: "error", error: "generic" };
}
