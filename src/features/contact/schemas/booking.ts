import { z } from "zod";

// Même validation email indépendante de la version de Zod que le contact.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Préqualification avant l'accès au calendrier. But : capter le besoin (service,
 * budget, description) AVANT de laisser réserver, pour filtrer les demandes hors
 * cadre. Comme le contact : messages = CLÉS i18n, email OU téléphone requis, et la
 * Server Action revalide (la validation client ne protège rien). `service`/`budget`
 * stockent le libellé choisi (les options viennent du dictionnaire).
 */
export const bookingSchema = z
  .object({
    name: z.string().trim().min(2, "name").max(120, "nameMax"),
    company: z.string().trim().max(160, "companyMax"),
    service: z.string().trim().min(1, "service"),
    budget: z.string().trim().min(1, "budget"),
    description: z.string().trim().min(1, "description").max(2000, "descriptionMax"),
    email: z.string().trim().max(200, "emailMax"),
    phone: z.string().trim().max(40, "phoneMax"),
    consent: z.boolean().refine((v) => v === true, "consent"),
    // Honeypot anti-bot : doit rester vide (contrôlé côté serveur).
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

export type BookingInput = z.infer<typeof bookingSchema>;

export type BookingActionResult =
  | { status: "success" }
  | { status: "error"; fieldErrors?: Partial<Record<keyof BookingInput, string>> };
