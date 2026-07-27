import "server-only";

import { neon } from "@neondatabase/serverless";

/**
 * Client SQL Neon, créé paresseusement : pas d'erreur à l'import quand
 * `DATABASE_URL` n'est pas encore défini. Retourne `null` si l'URL manque —
 * l'appelant doit alors traiter l'écriture comme impossible (règle 9).
 */
export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  return neon(url);
}
