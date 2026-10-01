import { z } from "zod";

// Validation email indépendante de la version de Zod (pas de `.email()`).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Volontairement permissif (formats internationaux, extensions) : on écarte les
// chaînes qui ne sont manifestement pas un numéro, pas plus.
const PHONE_RE = /^[+\d\s().-]{7,40}$/;

/**
 * Aplatit les sauts de ligne et tabulations avant tout contrôle : un champ d'en-tête
 * de courriel (sujet, `Reply-To`) construit à partir de ces valeurs ne doit pas
 * pouvoir être scindé par un `\r\n` injecté. NFC évite deux graphies pour un même nom.
 */
const normalize = (s: string) => s.replace(/[\r\n\t]+/g, " ").trim().normalize("NFC");
const line = (max: number, key: string) => z.string().transform(normalize).pipe(z.string().max(max, key));

/** Clés des réponses du parcours (les libellés vivent dans `soumission.*` des dictionnaires). */
const PROJECT_TYPES = ["web", "webapp", "shop", "mobile", "saas", "integ", "logo", "identity", "host"] as const;
const SECTORS = ["pme", "startup", "industrial", "enterprise", "institution", "nonprofit"] as const;
const STAGES = ["idea", "spec", "existing"] as const;
const TIMINGS = ["asap", "month", "quarter", "later"] as const;

/**
 * Schéma de la demande de soumission (parcours en sept étapes). Les messages sont des
 * CLÉS de dictionnaire, traduites à l'affichage (`soumission.errors`). La Server Action
 * revalide avec ce schéma : la validation côté client ne protège rien. Règle : courriel
 * OU téléphone requis pour pouvoir répondre.
 */
export const soumissionSchema = z
  .object({
    type: z.enum(PROJECT_TYPES),
    sector: z.enum(SECTORS),
    stage: z.enum(STAGES),
    when: z.enum(TIMINGS),
    site: line(200, "tooLong"),
    details: z.string().trim().max(4000, "tooLong"),
    name: z
      .string()
      .transform(normalize)
      .pipe(z.string().min(1, "name").max(120, "nameMax")),
    company: line(120, "tooLong"),
    email: z.string().trim().max(200, "emailMax"),
    phone: z
      .string()
      .transform(normalize)
      .pipe(
        z
          .string()
          .max(40, "phoneMax")
          .refine((v) => v === "" || PHONE_RE.test(v), "phone"),
      ),
    city: line(120, "tooLong"),
    // Consentement explicite (Loi 25, demande du client du 2026-10-01) : la case doit être cochée.
    consent: z.literal(true, "consent"),
    // Honeypot anti-bot : champ caché qui doit rester vide (contrôlé côté serveur).
    website: z.string().max(200).optional(),
  })
  .refine((d) => d.email === "" || EMAIL_RE.test(d.email), { path: ["email"], message: "email" })
  .refine((d) => d.email !== "" || d.phone !== "", { path: ["email"], message: "contactRequired" });

export type SoumissionInput = z.input<typeof soumissionSchema>;

/** Forme du retour de la Server Action : une seule clé d'erreur, affichée sous le formulaire. */
export type ActionResult = { status: "success" } | { status: "error"; error: string };
