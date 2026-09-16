import { notFound } from "next/navigation";

import { Cta, Faq, Hero, Method, Sectors, Services } from "@/features/home";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <div>
      <Hero lang={lang} dict={dict} />
      <Services lang={lang} dict={dict} />
      <Sectors dict={dict} />
      <Method dict={{ method: dict.method }} />
      <Faq dict={{ faq: dict.faq }} lang={lang} />
      <Cta dict={dict} />
    </div>
  );
}
