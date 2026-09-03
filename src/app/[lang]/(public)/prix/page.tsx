import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BreadcrumbLd } from "@/components/shared/breadcrumb-ld";
import { PricingGroups, PricingHero } from "@/features/pricing";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/prix">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

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
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <>
      <BreadcrumbLd
        lang={lang}
        items={[
          { name: dict.nav.home, path: "" },
          { name: dict.pricing.breadcrumb, path: "/prix" },
        ]}
      />
      <PricingHero lang={lang} dict={dict} />
      <PricingGroups lang={lang} dict={dict} />
    </>
  );
}
