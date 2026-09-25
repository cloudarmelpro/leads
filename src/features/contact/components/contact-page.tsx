import { LineReveal } from "@/components/shared/line-reveal";
import { Reveal } from "@/components/shared/reveal";
import { site } from "@/config/site";
import { BookingCard } from "@/features/contact/components/booking-card";
import { ContactFormSection } from "@/features/contact/components/contact-form-section";
import { ContactHero } from "@/features/contact/components/contact-hero";
import { Cta } from "@/features/home";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale; dict: Dictionary };

/**
 * Corps de la page Contact (maquette Claude Design, 2026-09-25) : hero centré avec la
 * carte en points, carte Rendez-vous (résumé de l'appel + calendrier Cal.com derrière
 * l'avis Loi 25), séparateur « Ou », la section Formulaire, puis le bandeau d'appel
 * commun.
 */
export function ContactPageContent({ lang, dict }: Props) {
  const t = dict.contactPage;

  return (
    <>
      <ContactHero title={t.hero.title} lede={t.hero.lede} ctaBook={t.hero.ctaBook} ctaWrite={t.hero.ctaWrite} mapAria={t.hero.mapAria} />

      {/* Dès 620px, remonte sur le bas fondu de la carte, comme la maquette ; sur téléphone
          la carte est trop basse pour ça, le titre passait dessus. */}
      <section id="rendez-vous" className="relative z-[1] mt-[24px] flex justify-center px-[clamp(16px,4vw,56px)] min-[620px]:mt-[clamp(-96px,-7vw,-40px)]">
        <div className="flex w-full max-w-[1200px] flex-col gap-[clamp(32px,4vw,48px)]">
          <div className="flex flex-col items-center gap-[14px] text-center">
            <LineReveal as="h2" className="m-[0px] text-center text-[clamp(22px,2.2vw,30px)] leading-[1.2] font-semibold tracking-[-0.01em] text-encre text-balance">
              {t.booking.title}
            </LineReveal>
            <LineReveal delay={0.12} className="m-[0px] max-w-[560px] text-[15px] leading-[26px] font-normal text-texte2 text-pretty">
              {t.booking.intro}
            </LineReveal>
          </div>
          <Reveal kind="scale" delay={200}>
            <BookingCard dict={{ contactPage: { booking: t.booking } }} brand={site.name} calLink={site.calLink} />
          </Reveal>
          <span className="self-center text-[13px] leading-[20px] font-medium text-texte-note">{t.booking.poweredBy}</span>
        </div>
      </section>

      <Reveal ariaHidden className="relative flex justify-center px-[clamp(16px,4vw,56px)] pt-[clamp(28px,3.5vw,48px)]">
        <div className="flex w-full max-w-[1160px] items-center gap-[20px]">
          <span className="h-px flex-1 bg-[linear-gradient(90deg,transparent,var(--color-contour))]" />
          <span className="flex size-[52px] items-center justify-center rounded-full bg-surface-2 text-[15px] font-semibold tracking-[0.08em] text-vert uppercase shadow-[inset_0_0_0_1px_var(--color-contour)] dark:bg-surface">
            {t.or}
          </span>
          <span className="h-px flex-1 bg-[linear-gradient(90deg,var(--color-contour),transparent)]" />
        </div>
      </Reveal>

      <ContactFormSection lang={lang} watermark={t.hero.title} dict={{ contactPage: { form: t.form } }} />
      {/* Même bandeau d'appel que l'accueil (demande du client : la maquette n'en avait pas). */}
      <Cta dict={dict} />
    </>
  );
}
