import { notFound } from "next/navigation";

import { ScrollProgress } from "@/components/shared/scroll-progress";
import { Cta, Faq, Hero, HomePricing, Method, Positioning, Sectors, Services, Tools, WelcomeSplash } from "@/features/home";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <div>
      <WelcomeSplash label={dict.welcome.before} brand={dict.welcome.brand} />
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
