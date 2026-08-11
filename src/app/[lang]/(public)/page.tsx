import { notFound } from "next/navigation";

import { Faq, FinalCta, Hero, Method, ProofSlot, Services, TradesShowcase } from "@/features/home";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

/**
 * La preuve sociale reste éteinte tant qu'aucun témoignage réel n'est disponible
 * (avec autorisation écrite). Voir ARCHITECTURE.md — on n'invente jamais de preuve.
 */
const SHOW_SOCIAL_PROOF = false;

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <>
      <Hero lang={lang} dict={dict} />
      <TradesShowcase lang={lang} dict={dict} />
      <Services dict={dict} />
      <Method dict={dict} />
      {SHOW_SOCIAL_PROOF && <ProofSlot dict={dict} />}
      <Faq lang={lang} dict={dict} />
      <FinalCta lang={lang} dict={dict} />
    </>
  );
}
