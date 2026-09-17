import { Check, Clock, MapPin, Phone } from "lucide-react";

import { GOUTTIERE } from "@/components/shared/container";
import { HeroGrid } from "@/components/shared/hero-grid";
import { SectionHead } from "@/components/shared/section-head";
import { site, telHref } from "@/config/site";
import { BookingGate } from "@/features/contact/components/booking-gate";
import { ContactForm } from "@/features/contact/components/contact-form";
import { EmailCard } from "@/features/contact/components/email-card";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale; dict: Dictionary };

const PILL = "rounded-full bg-surface-2 px-[13px] py-[6px] text-[13px] leading-[18px] font-medium text-texte-bascule";
const ASIDE_CARD = "flex items-center gap-[14px] rounded-[16px] bg-surface p-[20px] no-underline transition-colors duration-[220ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] hover:bg-surface-2 ring-1 ring-ligne ring-inset dark:ring-0";
const PLATE = "flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[12px] bg-surface-2 text-vert";
const OVER = "text-[12px] leading-[16px] font-normal tracking-[0.06em] text-texte2 uppercase";

/**
 * Corps de la page Contact (maquette) : hero avec grille, section Rendez-vous (carte
 * d'informations + porte du calendrier), section Formulaire (carte de formulaire +
 * coordonnées). Pas de bandeau CTA : la page entière est l'appel à l'action.
 */
export function ContactPageContent({ lang, dict }: Props) {
  const t = dict.contactPage;
  const tel = telHref(site.phone);
  const [emailUser, emailDomain] = (site.email ?? "").split("@");

  return (
    <>
      <section className={`relative flex justify-center overflow-x-clip pt-[120px] pb-[140px] ${GOUTTIERE}`}>
        <HeroGrid />
        <div className="relative z-[1] flex w-full max-w-[1400px] flex-col items-start gap-[22px]">
          <h1 className="m-[0px] max-w-[680px] text-[clamp(26px,3.2vw,36px)] leading-[1.12] font-normal tracking-[-0.7px] text-encre text-pretty">
            {t.title} <span className="text-vert">{t.titleHighlight}</span>
          </h1>
          <p className="m-[0px] max-w-[520px] text-[14px] leading-[24px] font-normal text-texte2 text-pretty">{t.subtitle}</p>
          <div className="mt-[6px] flex flex-wrap gap-[10px]">
            <a
              href="#rendez-vous"
              className="flex h-[38px] items-center gap-[10px] rounded-[8px] bg-vert px-[22px] text-[14px] leading-[20px] font-medium text-sur-vert no-underline transition-colors hover:bg-vert-clair"
            >
              {dict.hero.ctaBook}
            </a>
            {tel && (
              <a
                href={tel}
                className="flex h-[38px] items-center gap-[9px] rounded-[8px] bg-surface-2 px-[20px] text-[14px] leading-[20px] font-medium text-encre no-underline ring-1 ring-contour transition-colors ring-inset hover:bg-surface-3"
              >
                <Phone size={15} strokeWidth={2.2} aria-hidden />
                {site.phone}
              </a>
            )}
          </div>
        </div>
      </section>

      <section className={`relative flex justify-center pb-[clamp(112px,16vw,240px)] ${GOUTTIERE}`}>
        <div className="flex w-full max-w-[1400px] flex-col gap-[48px]">
          <SectionHead id="rendez-vous" label={t.booking.kicker} title={t.booking.title} intro={t.booking.intro} introMax={460} />

          <div className="grid grid-cols-[minmax(0,1fr)] items-stretch gap-[24px] min-[620px]:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            <div className="flex flex-col gap-[24px] rounded-[24px] bg-surface p-[28px] ring-1 ring-ligne ring-inset dark:ring-0">
              <div className="flex flex-col gap-[10px]">
                <span className="text-[26px] leading-[32px] font-normal tracking-[-0.4px] text-encre">{t.booking.service}</span>
                <div className="flex flex-wrap gap-[8px]">
                  <span className={PILL}>{t.booking.duration}</span>
                  <span className={PILL}>{t.booking.channel}</span>
                  <span className={PILL}>{t.booking.free}</span>
                </div>
              </div>
              <div className="h-px bg-ligne" />
              <div className="flex flex-col gap-[14px]">
                <span className="text-[15px] leading-[22px] font-medium text-encre">{t.booking.expectTitle}</span>
                <ul className="m-[0px] flex list-none flex-col gap-[11px] p-[0px]">
                  {t.booking.expect.map((line) => (
                    <li key={line} className="flex items-start gap-[11px]">
                      <Check size={17} strokeWidth={2.2} aria-hidden className="mt-[3px] shrink-0 text-vert" />
                      <span className="text-[15px] leading-[24px] font-normal text-texte2">{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto flex items-center gap-[9px] text-texte2">
                <Clock size={16} strokeWidth={2} aria-hidden className="shrink-0" />
                <span className="text-[13px] leading-[20px] font-normal">{t.booking.timezone}</span>
              </div>
            </div>

            <BookingGate dict={{ contactPage: { booking: dict.contactPage.booking } }} calLink={site.calLink} />
          </div>
        </div>
      </section>

      <section className={`relative flex justify-center pb-[clamp(112px,16vw,240px)] ${GOUTTIERE}`}>
        <div className="flex w-full max-w-[1400px] flex-col gap-[48px]">
          <SectionHead id="formulaire" label={t.form.kicker} title={t.form.title} intro={t.form.intro} introMax={420} />

          <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-[24px] min-[620px]:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
            <div className="relative rounded-[24px] bg-surface p-[clamp(22px,3vw,32px)] ring-1 ring-ligne ring-inset dark:ring-0">
              <ContactForm lang={lang} dict={{ contactPage: { form: dict.contactPage.form } }} />
            </div>

            {/* Coordonnées depuis site.ts : une carte absente plutôt qu'un substitut. */}
            <div className="flex flex-col gap-[12px]">
              {tel && (
                <a href={tel} className={ASIDE_CARD}>
                  <span className={PLATE}>
                    <Phone size={19} strokeWidth={2.2} aria-hidden />
                  </span>
                  <span className="flex min-w-[0px] flex-col gap-[2px]">
                    <span className={OVER}>{t.form.phone}</span>
                    <span className="text-[16px] leading-[22px] font-medium text-encre">{site.phone}</span>
                  </span>
                </a>
              )}
              {emailUser && emailDomain && (
                <EmailCard
                  user={emailUser}
                  domain={emailDomain}
                  label={t.form.email}
                  className={ASIDE_CARD}
                  plateClassName={PLATE}
                  overClassName={OVER}
                />
              )}
              <div className="flex flex-col gap-[12px] rounded-[16px] bg-surface p-[20px] ring-1 ring-ligne ring-inset dark:ring-0">
                <div className="flex items-center gap-[10px]">
                  <MapPin size={17} strokeWidth={2} aria-hidden className="shrink-0 text-vert" />
                  <span className="text-[15px] leading-[22px] font-medium text-encre">{t.aside.zone}</span>
                </div>
                <p className="m-[0px] text-[14px] leading-[23px] font-normal text-texte2 text-pretty">{t.aside.zoneBody}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
