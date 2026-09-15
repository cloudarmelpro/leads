import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BreadcrumbLd } from "@/components/shared/breadcrumb-ld";
import { PageHalos } from "@/components/shared/page-halos";
import { AboutHero, Principles, Story } from "@/features/about";
import { Cta } from "@/features/home";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/a-propos">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const dict = await getDictionary(lang);

  return pageMetadata({
    lang,
    path: "/a-propos",
    title: dict.about.meta.title,
    description: dict.about.meta.description,
  });
}

export default async function AboutPage({ params }: PageProps<"/[lang]/a-propos">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    // Pas de `relative` : les halos se calent sur <body> et passent sous l'en-tête.
    <div>
      <BreadcrumbLd
        lang={lang}
        items={[
          { name: dict.nav.home, path: "" },
          { name: dict.about.breadcrumb, path: "/a-propos" },
        ]}
      />
      <PageHalos />
      <AboutHero dict={dict} lang={lang} />
      <Story dict={dict} />
      <Principles dict={dict} />
      {/* Même bandeau d'appel que l'accueil (dictionnaire `final`), ancre #contact. */}
      <Cta dict={dict} />
    </div>
  );
}
