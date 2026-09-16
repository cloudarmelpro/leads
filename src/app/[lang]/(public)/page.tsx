import { notFound } from "next/navigation";

import { PageHalos } from "@/components/shared/page-halos";
import { Cta, Faq, Hero, Method, Sectors, Services } from "@/features/home";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    // Pas de `relative` ici : les halos se calent sur <body> et passent sous l'en-tête
    // (transparent), comme dans la maquette où le calque part du haut de la page.
    <div>
      <PageHalos />
      <Hero lang={lang} dict={dict} />
      <Services lang={lang} dict={dict} />
      <Sectors dict={dict} />
      <Method dict={{ method: dict.method }} />
      <Faq dict={{ faq: dict.faq }} lang={lang} />
      <Cta dict={dict} />
    </div>
  );
}
