import "server-only";

/**
 * Point d'accès UNIQUE aux variables d'environnement serveur. Toutes sont
 * OPTIONNELLES : le site fonctionne sans (la base et la notification e-mail se
 * désactivent proprement — règle 9). On valide seulement le FORMAT quand une
 * valeur est présente ; une valeur manifestement invalide est traitée comme
 * absente et signalée dans les logs (aucune donnée sensible n'est loguée).
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: string | undefined): string | undefined {
  const v = value?.trim();
  return v ? v : undefined;
}

function validated(
  name: string,
  value: string | undefined,
  ok: (v: string) => boolean,
): string | undefined {
  const v = clean(value);
  if (v && !ok(v)) {
    console.warn(`[env] ${name} mal formé — ignoré.`);
    return undefined;
  }
  return v;
}

export const env = {
  DATABASE_URL: validated("DATABASE_URL", process.env.DATABASE_URL, (v) =>
    /^postgres(ql)?:\/\//.test(v),
  ),
  RESEND_API_KEY: clean(process.env.RESEND_API_KEY),
  LEAD_NOTIFICATION_EMAIL: validated(
    "LEAD_NOTIFICATION_EMAIL",
    process.env.LEAD_NOTIFICATION_EMAIL,
    (v) => EMAIL_RE.test(v),
  ),
  // Expéditeur des notifications : défaut Resend tant qu'un domaine vérifié n'est
  // pas branché. Une valeur mal formée retombe sur ce défaut.
  LEAD_FROM_EMAIL:
    validated("LEAD_FROM_EMAIL", process.env.LEAD_FROM_EMAIL, (v) => EMAIL_RE.test(v)) ??
    "onboarding@resend.dev",
} as const;

/**
 * Ce que la configuration courante permet réellement. Consommé au démarrage par
 * `src/instrumentation.ts` pour échouer vite en production : sans base, chaque lead
 * est perdu (règle 9) et l'échec ne se voit que dans les logs.
 */
export const envStatus = {
  canStoreLeads: env.DATABASE_URL !== undefined,
  canNotifyByEmail:
    env.RESEND_API_KEY !== undefined && env.LEAD_NOTIFICATION_EMAIL !== undefined,
} as const;
