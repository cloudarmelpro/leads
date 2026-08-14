import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BreadcrumbLd } from "@/components/shared/breadcrumb-ld";
import { CtaBanner } from "@/components/shared/cta-banner";
import { AboutHero, Principles, Story, Team } from "@/features/about";
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
      <AboutHero dict={dict} />
      <Story dict={dict} />
      <Principles dict={dict} />
      <Team dict={dict} />
      <CtaBanner
        lang={lang}
        title={dict.about.cta.title}
        body={dict.about.cta.body}
        ariaLabel={dict.about.cta.title}
      />
    </>
  );
}
