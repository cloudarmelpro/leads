import { CONTENEUR } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeader } from "@/components/shared/section-header";
import { site } from "@/config/site";
import { BookingWidget } from "@/features/contact/components/booking-widget";
import { CalcomEmbed } from "@/features/contact/components/calcom-embed";
import { ContactForm } from "@/features/contact/components/contact-form";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale; dict: Dictionary };

/**
 * Corps de la page contact, sur la structure de l'accueil : hero, section
 * « Rendez-vous » (en-tête + calendrier), section « Formulaire » (en-tête + formulaire).
 */
export function ContactPageContent({ lang, dict }: Props) {
  const t = dict.contactPage;

  return (
    <>
      <PageHero title={t.title} subtitle={t.subtitle} />

      <section id="rendez-vous" className="pb-[clamp(80px,14vw,200px)]">
        <div className={CONTENEUR}>
          <SectionHeader kicker={t.booking.kicker} title={t.booking.title} intro={t.booking.intro} />
          <div className="mt-12">
            {site.calLink ? (
              // Le formulaire de préqualification est géré par Cal.com lui-même.
              <CalcomEmbed calLink={site.calLink} dict={dict} />
            ) : (
              <BookingWidget lang={lang} dict={dict} />
            )}
          </div>
        </div>
      </section>

      <section id="formulaire" className="pb-[clamp(80px,14vw,200px)]">
        <div className={CONTENEUR}>
          <SectionHeader kicker={t.form.kicker} title={t.form.title} intro={t.form.intro} />
          <div className="mt-12 max-w-[720px]">
            <ContactForm lang={lang} dict={dict} />
          </div>
        </div>
      </section>
    </>
  );
}
