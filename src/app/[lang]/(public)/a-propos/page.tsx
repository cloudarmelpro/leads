import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BreadcrumbLd } from "@/components/shared/breadcrumb-ld";
import { PageHero } from "@/components/shared/page-hero";
import { Principles, Story, Team } from "@/features/about";
import { FinalCta } from "@/features/home";
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
    <>
      <BreadcrumbLd
        lang={lang}
        items={[
          { name: dict.nav.home, path: "" },
          { name: dict.about.heroTitle, path: "/a-propos" },
        ]}
      />
      <PageHero title={dict.about.heroTitle} subtitle={dict.about.story[0]} />
      <Story dict={dict} />
      <Principles dict={dict} />
      <Team dict={dict} />
      {/* Même bandeau d'appel à l'action que l'accueil (dictionnaire `final`). */}
      <FinalCta lang={lang} dict={dict} />
    </>
  );
}
