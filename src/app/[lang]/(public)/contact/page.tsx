import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BreadcrumbLd } from "@/components/shared/breadcrumb-ld";
import { ContactPageContent } from "@/features/contact";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const dict = await getDictionary(lang);
  return pageMetadata({
    lang,
    path: "/contact",
    title: dict.contactPage.meta.title,
    description: dict.contactPage.meta.description,
  });
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <>
      <BreadcrumbLd
        lang={lang}
        items={[
          { name: dict.nav.home, path: "" },
          { name: dict.contactPage.heroTitle, path: "/contact" },
        ]}
      />
      <ContactPageContent lang={lang} dict={dict} />
    </>
  );
}
