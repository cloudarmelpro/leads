import { z } from "zod";

// Validation email indépendante de la version de Zod (pas de `.email()`).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Schéma partagé du formulaire de contact. Les messages sont des CLÉS de
 * dictionnaire, traduites à l'affichage (voir `contactPage.form.errors`). La
 * Server Action revalide avec ce schéma : la validation react-hook-form côté
 * client ne protège rien. Règle : email OU téléphone requis pour pouvoir répondre.
 */
export const contactSchema = z
  .object({
    name: z.string().trim().min(2, "name").max(120, "nameMax"),
    email: z.string().trim().max(200, "emailMax"),
    phone: z.string().trim().max(40, "phoneMax"),
    message: z.string().trim().min(1, "message").max(4000, "messageMax"),
    consent: z.boolean().refine((v) => v === true, "consent"),
    // Honeypot anti-bot : champ caché qui doit rester vide (contrôlé côté serveur).
    website: z.string().optional(),
  })
  .refine((d) => d.email === "" || EMAIL_RE.test(d.email), {
    path: ["email"],
    message: "email",
  })
  .refine((d) => d.email !== "" || d.phone !== "", {
    path: ["email"],
    message: "contactRequired",
  });

export type ContactInput = z.infer<typeof contactSchema>;

/** Forme du retour de la Server Action du formulaire. */
export type ActionResult =
  | { status: "success" }
  | { status: "error"; fieldErrors?: Partial<Record<keyof ContactInput, string>> };
