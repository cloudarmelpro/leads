import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";

import { site } from "@/config/site";
import { BookingWidget, CalcomEmbed, ContactForm, ContactHero } from "@/features/contact";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const dict = await getDictionary(lang);
  return {
    title: dict.contactPage.meta.title,
    description: dict.contactPage.meta.description,
    alternates: {
      canonical: `/${lang}/contact`,
      languages: { "fr-CA": "/fr/contact", "en-CA": "/en/contact", "x-default": "/fr/contact" },
    },
  };
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const t = dict.contactPage;

  return (
    <>
      <ContactHero dict={dict} />

      <div className="px-[clamp(16px,4vw,32px)] pb-[clamp(48px,7vw,96px)]">
        <div className="mx-auto max-w-290">
          {/* Conteneur observé (en place) ; le titre glisse depuis la droite,
              comme les titres de l'accueil. */}
          <div
            data-reveal-child="right"
            style={{
              "--reveal-delay": "80ms",
              "--reveal-dist": "40vw",
              "--reveal-dur": "3400ms",
            } as CSSProperties}
            className="w-full"
          >
            <h2 className="max-w-[20ch] font-display text-[clamp(30px,5vw,52px)] leading-[1.1] tracking-normal text-balance">
              {t.title}
            </h2>
          </div>
          <p
            data-reveal="left"
            data-reveal-delay="160"
            className="mt-4 max-w-[52ch] text-base leading-[1.6] text-texte2 text-pretty"
          >
            {t.subtitle}
          </p>

        {/* Réservation d'appel — embed Cal.com si le lien existe, sinon la maquette. */}
        <section className="mt-12">
          <h2 data-reveal="up" className="mb-5 font-display text-xl">
            {t.booking.title}
          </h2>
          {site.calLink ? (
            // Le formulaire de préqualification est géré par Cal.com lui-même.
            <div className="max-w-260">
              <CalcomEmbed calLink={site.calLink} />
            </div>
          ) : (
            <BookingWidget lang={lang} dict={dict} />
          )}
        </section>

        {/* Formulaire + coordonnées (deux colonnes, comme la référence). */}
        <section className="mt-16">
          <div className="grid grid-cols-1 gap-[clamp(28px,4vw,56px)] lg:grid-cols-[minmax(0,1fr)_300px]">
            <div>
              <h2
                data-reveal="up"
                className="mb-2 font-display text-[clamp(24px,3vw,34px)] leading-[1.15] tracking-normal"
              >
                {t.form.title}
              </h2>
              <p className="mb-6 text-sm text-texte2">{t.form.intro}</p>
              <ContactForm lang={lang} dict={dict} />
            </div>
          </div>
        </section>
        </div>
      </div>
    </>
  );
}
