/**
 * Contrôles de démarrage du serveur. `register()` est appelé une seule fois, avant
 * que le serveur accepte la première requête (doc `file-conventions/instrumentation`).
 *
 * Enjeu : sans `DATABASE_URL`, le site se rend parfaitement mais chaque lead est
 * perdu — l'échec n'apparaît que dans les logs, une fois le visiteur parti. On
 * refuse donc de démarrer en production plutôt que de vendre du vide (règle 9).
 */
export async function register(): Promise<void> {
  // Le fichier est aussi chargé par le runtime Edge (proxy.ts), où `process.env`
  // n'expose pas les mêmes valeurs : ces contrôles n'ont de sens que côté Node.
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (process.env.NODE_ENV !== "production") return;

  // Import dynamique : `lib/env.ts` est `server-only`, on ne le charge que dans la
  // branche Node effectivement exécutée.
  const { envStatus } = await import("@/lib/env");

  if (!envStatus.canStoreLeads) {
    throw new Error(
      "[startup] DATABASE_URL absente ou invalide (attendu : postgres:// ou postgresql://). " +
        "Sans base, chaque lead du formulaire de contact serait perdu — démarrage refusé.",
    );
  }

  if (!envStatus.canNotifyByEmail) {
    console.error(
      "[startup] Notification de lead désactivée : RESEND_API_KEY et/ou " +
        "LEAD_NOTIFICATION_EMAIL manquante ou mal formée. Les leads sont enregistrés " +
        "en base, mais personne n'est prévenu par courriel.",
    );
  }
}
