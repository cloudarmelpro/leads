import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { site } from "@/config/site";
import { BookingWidget, CalcomEmbed, ContactForm } from "@/features/contact";
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
    <div className="px-[clamp(16px,4vw,32px)] pt-[clamp(24px,4vw,48px)] pb-[clamp(48px,7vw,96px)]">
      <div className="mx-auto max-w-290">
        <p data-reveal="up" className="mb-4">
          <span className="rounded-full bg-white px-3.75 py-1.75 text-[13px] font-semibold text-texte2">
            {t.kicker}
          </span>
        </p>
        <h1
          data-reveal="up"
          data-reveal-delay="80"
          className="max-w-[20ch] font-display text-[clamp(30px,5vw,52px)] leading-[1.1] tracking-normal text-balance"
        >
          {t.title}
        </h1>
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
            // Carte Cal.com à largeur fixe (~1040px) : contrainte + alignée à
            // gauche pour que son bord gauche colle au titre/header (pas centrée).
            <div className="max-w-260">
              <CalcomEmbed calLink={site.calLink} />
            </div>
          ) : (
            <BookingWidget lang={lang} dict={dict} />
          )}
        </section>

        {/* Formulaire de contact. */}
        <section className="mt-16 max-w-160">
          <h2 data-reveal="up" className="mb-2 font-display text-xl">
            {t.form.title}
          </h2>
          <p className="mb-6 text-sm text-texte2">{t.form.intro}</p>
          <ContactForm lang={lang} dict={dict} />
        </section>
      </div>
    </div>
  );
}
