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

/**
 * Schéma partagé du formulaire de contact. Les messages sont des CLÉS de
 * dictionnaire, traduites à l'affichage (voir `contactPage.form.errors`). La
 * Server Action revalide avec ce schéma : la validation react-hook-form côté
 * client ne protège rien. Règle : email OU téléphone requis pour pouvoir répondre.
 *
 * `normalize` passe par `.pipe()` pour s'appliquer AVANT les contrôles de longueur
 * et de format, tout en gardant `string` en entrée (compatible `zodResolver`).
 */
export const contactSchema = z
  .object({
    name: z
      .string()
      .transform(normalize)
      .pipe(z.string().min(2, "name").max(120, "nameMax")),
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
    message: z.string().trim().min(1, "message").max(4000, "messageMax"),
    consent: z.boolean().refine((v) => v === true, "consent"),
    // Honeypot anti-bot : champ caché qui doit rester vide (contrôlé côté serveur).
    // Borné pour ne pas parser une charge arbitraire venue d'un appel forgé.
    website: z.string().max(200).optional(),
  })
  .refine((d) => d.email === "" || EMAIL_RE.test(d.email), {
    path: ["email"],
    message: "email",
  })
  .refine((d) => d.email !== "" || d.phone !== "", {
    path: ["email"],
    message: "contactRequired",
  });

export type ContactInput = z.input<typeof contactSchema>;

/** Forme du retour de la Server Action du formulaire. */
export type ActionResult =
  | { status: "success" }
  | { status: "error"; fieldErrors?: Partial<Record<keyof ContactInput, string>> };
