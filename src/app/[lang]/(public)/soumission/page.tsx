import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SoumissionPage } from "@/features/soumission";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: PageProps<"/[lang]/soumission">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const dict = await getDictionary(lang);
  return pageMetadata({
    lang,
    path: "/soumission",
    title: dict.soumission.meta.title,
    description: dict.soumission.meta.description,
  });
}

export default async function Page({ params }: PageProps<"/[lang]/soumission">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <div>
      <SoumissionPage lang={lang} dict={dict} />
    </div>
  );
}
