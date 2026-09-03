import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { site } from "@/config/site";
import { getPrivacy, PrivacyPage } from "@/features/legal";
import { isLocale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/confidentialite">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const doc = getPrivacy(lang);
  return pageMetadata({
    lang,
    path: "/confidentialite",
    title: `${doc.title} — ${site.name}`,
    description: doc.metaDescription,
  });
}

export default async function Page({ params }: PageProps<"/[lang]/confidentialite">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return <PrivacyPage lang={lang} />;
}
