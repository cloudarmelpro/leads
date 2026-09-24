import { notFound } from "next/navigation";

import { Cta, Faq, Hero, Method, Sectors, Services, Tools, TradesStrip, WelcomeSplash } from "@/features/home";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <div>
      <WelcomeSplash label={dict.welcome.before} brand={dict.welcome.brand} />
      <Hero lang={lang} dict={dict} />
      <TradesStrip dict={{ hero: dict.hero }} />
      <Services lang={lang} dict={dict} />
      <Tools dict={{ tools: dict.tools }} />
      <Sectors lang={lang} dict={dict} />
      <Method lang={lang} dict={{ method: dict.method, hero: dict.hero }} />
      <Faq dict={{ faq: dict.faq }} lang={lang} />
      <Cta dict={{ final: dict.final, placeholders: dict.placeholders }} />
    </div>
  );
}
