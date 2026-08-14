import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BreadcrumbLd } from "@/components/shared/breadcrumb-ld";
import { site } from "@/config/site";
import { getPrivacy } from "@/features/legal";
import { isLocale, localeHtmlLang } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
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
    description: doc.intro,
  });
}

export default async function PrivacyPage({ params }: PageProps<"/[lang]/confidentialite">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const doc = getPrivacy(lang);
  const dict = await getDictionary(lang);
  const updated = new Intl.DateTimeFormat(localeHtmlLang[lang], { dateStyle: "long" }).format(
    new Date(doc.updated),
  );

  return (
    <div className="px-[clamp(16px,4vw,32px)] pt-[clamp(24px,4vw,48px)] pb-[clamp(48px,7vw,96px)]">
      <BreadcrumbLd
        lang={lang}
        items={[
          { name: dict.nav.home, path: "" },
          { name: doc.title, path: "/confidentialite" },
        ]}
      />
      <div className="mx-auto max-w-190">
        <h1
          data-reveal="up"
          className="font-display text-[clamp(30px,5vw,48px)] leading-[1.1] tracking-normal text-balance"
        >
          {doc.title}
        </h1>
        <p data-reveal="up" data-reveal-delay="80" className="mt-3 text-sm text-texte2">
          {doc.updatedLabel} — {updated}
        </p>
        <p
          data-reveal="up"
          data-reveal-delay="140"
          className="mt-6 text-base leading-[1.7] text-texte2 text-pretty"
        >
          {doc.intro}
        </p>

        <div className="mt-10 flex flex-col gap-8">
          {doc.sections.map((section) => (
            <section key={section.h} data-reveal="up" data-reveal-dist="40px">
              <h2 className="font-display text-xl leading-[1.25]">{section.h}</h2>
              <div className="mt-3 flex flex-col gap-3">
                {section.p.map((para, index) => (
                  <p key={index} className="text-[15px] leading-[1.7] text-texte2 text-pretty">
                    {para}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
