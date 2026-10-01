import { notFound, permanentRedirect } from "next/navigation";

import { isLocale } from "@/lib/i18n/config";

/** L'ancienne page Contact est remplacée par Soumission (maquette du 2026-09-30) : redirection définitive. */
export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  permanentRedirect(`/${lang}/soumission`);
}
