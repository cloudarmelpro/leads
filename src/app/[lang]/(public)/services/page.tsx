import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BreadcrumbLd } from "@/components/shared/breadcrumb-ld";
import { Cta, Faq } from "@/features/home";
import { ServicesExplorer } from "@/features/services";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: PageProps<"/[lang]/services">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const dict = await getDictionary(lang);

  return pageMetadata({
    lang,
    path: "/services",
    title: dict.servicesPage.meta.title,
    description: dict.servicesPage.meta.description,
  });
}

export default async function ServicesPage({ params }: PageProps<"/[lang]/services">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <div>
      <BreadcrumbLd
        lang={lang}
        items={[
          { name: dict.nav.home, path: "" },
          { name: dict.servicesPage.breadcrumb, path: "/services" },
        ]}
      />
      <ServicesExplorer lang={lang} dict={{ servicesPage: dict.servicesPage }} />
      <Faq dict={{ faq: dict.servicesPage.faq }} lang={lang} />
      <Cta dict={{ final: dict.final, placeholders: dict.placeholders }} />
    </div>
  );
}
