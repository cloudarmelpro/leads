import { notFound, permanentRedirect } from "next/navigation";

import { isLocale } from "@/lib/i18n/config";

/** L'ancienne page Prix vit désormais dans Services (maquette du 2026-09-30) : redirection définitive. */
export default async function PricingPage({ params }: PageProps<"/[lang]/prix">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  permanentRedirect(`/${lang}/services`);
}
