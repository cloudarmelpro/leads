import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CtaBanner } from "@/components/shared/cta-banner";
import { AboutHero, Principles, Story, Team } from "@/features/about";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/a-propos">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const dict = await getDictionary(lang);

  return {
    title: dict.about.meta.title,
    description: dict.about.meta.description,
    alternates: {
      canonical: `/${lang}/a-propos`,
      languages: {
        "fr-CA": "/fr/a-propos",
        "en-CA": "/en/a-propos",
        "x-default": "/fr/a-propos",
      },
    },
  };
}

export default async function AboutPage({ params }: PageProps<"/[lang]/a-propos">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <>
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
