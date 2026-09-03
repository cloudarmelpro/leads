import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

/**
 * Attrape toute URL inconnue SOUS une langue (`/fr/nimporte-quoi`) pour la router
 * vers `[lang]/not-found.tsx`. Sans cette route, Next traite ces URL comme non
 * appariées et sert le 404 global, sans en-tête ni pied de page localisés.
 */
export async function generateMetadata({
  params,
}: PageProps<"/[lang]/[...rest]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return { robots: { index: false, follow: false } };

  const dict = await getDictionary(lang);
  return { title: dict.notFound.title, robots: { index: false, follow: false } };
}

export default async function CatchAllNotFound({ params }: PageProps<"/[lang]/[...rest]">) {
  await params;
  notFound();
}
