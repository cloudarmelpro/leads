import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BreadcrumbLd } from "@/components/shared/breadcrumb-ld";
import { PageHalos } from "@/components/shared/page-halos";
import { features } from "@/config/site";
import { Cta, Faq } from "@/features/home";
import { PricingExplorer, PricingHero } from "@/features/pricing";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/prix">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang) || !features.pricing) return {};

  const dict = await getDictionary(lang);

  return pageMetadata({
    lang,
    path: "/prix",
    title: dict.pricing.meta.title,
    description: dict.pricing.meta.description,
  });
}

export default async function PricingPage({ params }: PageProps<"/[lang]/prix">) {
  const { lang } = await params;
  // Page masquée tant que l offre n est pas arrêtée (voir `features` dans config/site).
  if (!isLocale(lang) || !features.pricing) notFound();

  const dict = await getDictionary(lang);

  return (
    // Pas de `relative` : les halos se calent sur <body> et passent sous l'en-tête.
    <div>
      <PageHalos />
      <BreadcrumbLd
        lang={lang}
        items={[
          { name: dict.nav.home, path: "" },
          { name: dict.pricing.breadcrumb, path: "/prix" },
        ]}
      />
      <PricingHero lang={lang} dict={dict} />
      <PricingExplorer lang={lang} dict={dict} />
      <Faq dict={dict} />
      <Cta dict={dict} />
    </div>
  );
}
