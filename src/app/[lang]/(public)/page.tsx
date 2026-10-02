import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FaqLd } from "@/components/shared/faq-ld";
import { ScrollProgress } from "@/components/shared/scroll-progress";
import { Cta, Faq, Hero, HomePricing, Method, Positioning, Sectors, Services, Tools, WelcomeSplash } from "@/features/home";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const dict = await getDictionary(lang);
  return pageMetadata({ lang, title: dict.meta.title, description: dict.meta.description });
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <div>
      <FaqLd items={dict.faq.items} />
      <WelcomeSplash word={dict.welcome.word} />
      <ScrollProgress />
      <Hero lang={lang} dict={{ hero: dict.hero }} />
      <Positioning dict={{ positioning: dict.positioning }} />
      <Services lang={lang} dict={{ services: dict.services }} />
      <Tools dict={{ tools: dict.tools }} />
      <Sectors lang={lang} dict={{ organisations: dict.organisations }} />
      <Method lang={lang} dict={{ method: dict.method }} />
      <HomePricing lang={lang} dict={{ homePricing: dict.homePricing }} />
      <Faq dict={{ faq: dict.faq }} lang={lang} />
      <Cta dict={{ final: dict.final, placeholders: dict.placeholders }} />
    </div>
  );
}
