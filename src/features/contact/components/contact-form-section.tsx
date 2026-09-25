"use client";

import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

import { LineReveal } from "@/components/shared/line-reveal";
import { ObfuscatedEmail } from "@/components/shared/obfuscated-email";
import { Reveal } from "@/components/shared/reveal";
import { site, telHref } from "@/config/site";
import { ContactForm } from "@/features/contact/components/contact-form";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { gsap, reducedMotion } from "@/lib/motion/gsap";

type Props = { lang: Locale; watermark: string; dict: { contactPage: Pick<Dictionary["contactPage"], "form"> } };

const CARD =
  "group relative flex items-center gap-[16px] overflow-hidden rounded-[8px] bg-surface-2 px-[clamp(16px,1.8vw,22px)] py-[clamp(16px,1.8vw,20px)] no-underline transition-[border-color,transform] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-x-[6px] dark:border dark:border-[#012A3C] dark:bg-[linear-gradient(160deg,rgba(1,30,43,0.9)_0%,rgba(1,24,35,0.9)_100%)] dark:hover:border-[rgba(48,217,140,0.45)]";
const PLATE = "flex size-[48px] shrink-0 items-center justify-center rounded-[8px] bg-fond text-vert shadow-[inset_0_0_0_1px_var(--color-contour)]";

function CardBody({ label, value, arrow = true }: { label: string; value: ReactNode; arrow?: boolean }) {
  return (
    <>
      <span className="flex min-w-[0px] flex-col">
        <span className="text-[15px] leading-[26px] font-semibold text-encre">{label}</span>
        <span className="text-[15px] leading-[26px] font-normal text-texte2 [overflow-wrap:anywhere]">{value}</span>
      </span>
      {arrow && (
        <span aria-hidden className="ml-auto flex size-[38px] shrink-0 items-center justify-center rounded-full bg-surface-3 text-vert dark:bg-[#022C40]">
          <ArrowUpRight size={16} strokeWidth={2.4} />
        </span>
      )}
    </>
  );
}

/**
 * Section Formulaire (maquette Contact) : un grand « Contact » en filigrane, deux
 * traits décoratifs, puis à gauche le titre, le texte d'appui et trois cartes
 * (courriel, téléphone, lieu — depuis `site.ts`, une carte absente plutôt qu'un
 * substitut) ; à droite la carte du formulaire, cernée d'un trait de lumière qui tourne.
 * Au défilement, la colonne de gauche arrive de la gauche et la carte pivote en 3D.
 */
export function ContactFormSection({ lang, watermark, dict }: Props) {
  const t = dict.contactPage.form;
  const info = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const tel = telHref(site.phone);
  const [emailUser, emailDomain] = (site.email ?? "").split("@");

  useEffect(() => {
    if (!info.current || !card.current || reducedMotion()) return;
    const ctx = gsap.context(() => {
      const enter = { start: "top bottom", end: "top 55%", scrub: 0.5 };
      const exit = { start: "bottom 35%", end: "bottom top", scrub: 0.5 };
      gsap.fromTo(info.current, { x: -140, opacity: 0.2 }, { x: 0, opacity: 1, ease: "none", immediateRender: true, scrollTrigger: { trigger: info.current, ...enter } });
      gsap.fromTo(info.current, { x: 0, y: 0, opacity: 1 }, { x: -60, y: -40, opacity: 0.4, ease: "none", immediateRender: false, scrollTrigger: { trigger: info.current, ...exit } });
      gsap.fromTo(
        card.current,
        { rotationY: -18, x: 120, transformPerspective: 1200, transformOrigin: "100% 50%" },
        { rotationY: 0, x: 0, ease: "none", immediateRender: true, scrollTrigger: { trigger: card.current, ...enter } },
      );
      gsap.fromTo(card.current, { y: 0, opacity: 1 }, { y: -60, opacity: 0.45, ease: "none", immediateRender: false, scrollTrigger: { trigger: card.current, ...exit } });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="formulaire" className="relative flex justify-center overflow-hidden px-[clamp(16px,4vw,56px)] pt-[clamp(28px,3.5vw,48px)] pb-[clamp(96px,11vw,180px)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[0px] top-[clamp(24px,4vw,56px)] bg-[linear-gradient(180deg,rgba(30,30,30,0.07)_0%,rgba(30,30,30,0)_85%)] bg-clip-text text-center text-[clamp(96px,20vw,300px)] leading-[0.85] font-extrabold tracking-[0.02em] whitespace-nowrap text-transparent uppercase select-none dark:bg-[linear-gradient(180deg,rgba(201,218,209,0.13)_0%,rgba(201,218,209,0)_85%)]"
      >
        {watermark}
      </div>
      <svg aria-hidden width="320" height="120" viewBox="0 0 320 120" fill="none" className="pointer-events-none absolute top-[24px] left-[0px] opacity-90">
        <path d="M0 18 L70 88 H250" stroke="rgba(48,217,140,0.28)" strokeWidth="1" />
        <circle cx="254" cy="88" r="4" stroke="rgba(48,217,140,0.4)" />
        <path d="M40 0 L96 56" stroke="rgba(126,154,147,0.2)" />
        <circle cx="98" cy="58" r="3.5" stroke="rgba(126,154,147,0.35)" />
      </svg>
      <svg aria-hidden width="340" height="160" viewBox="0 0 340 160" fill="none" className="pointer-events-none absolute top-[40px] right-[0px] opacity-90">
        <path d="M26 30 H200 L330 160" stroke="rgba(48,217,140,0.28)" strokeWidth="1" />
        <circle cx="22" cy="30" r="4" stroke="rgba(48,217,140,0.4)" />
        <path d="M88 70 H240 L340 120" stroke="rgba(126,154,147,0.2)" />
        <circle cx="84" cy="70" r="3.5" stroke="rgba(126,154,147,0.35)" />
      </svg>

      <div className="relative grid w-full max-w-[1400px] grid-cols-[minmax(0,1fr)] items-stretch gap-[clamp(20px,2.4vw,28px)] pt-[clamp(40px,6vw,90px)] min-[900px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div ref={info} className="flex min-w-[0px] flex-col justify-between gap-[32px]">
          <div className="flex flex-col items-start gap-[18px]">
            <LineReveal as="h2" className="m-[0px] text-[clamp(22px,2.2vw,30px)] leading-[1.2] font-semibold tracking-[-0.01em] text-encre text-pretty">
              {t.title}
            </LineReveal>
            <LineReveal delay={0.12} className="m-[0px] max-w-[400px] text-[15px] leading-[26px] font-normal text-texte2 text-pretty">
              {t.intro}
            </LineReveal>
          </div>
          <div className="flex flex-col gap-[10px]">
            {emailUser && emailDomain && (
              <Reveal kind="left">
                <ObfuscatedEmail user={emailUser} domain={emailDomain} className={CARD}>
                  {(address) => (
                    <>
                      <span className={PLATE}>
                        <Mail size={20} strokeWidth={1.8} aria-hidden />
                      </span>
                      <CardBody label={t.emailLabel} value={address} />
                    </>
                  )}
                </ObfuscatedEmail>
              </Reveal>
            )}
            {tel && (
              <Reveal kind="left" delay={110}>
                <a href={tel} className={CARD}>
                  <span className={PLATE}>
                    <Phone size={20} strokeWidth={1.8} aria-hidden />
                  </span>
                  <CardBody label={t.phoneLabel} value={site.phone} />
                </a>
              </Reveal>
            )}
            <Reveal kind="left" delay={330}>
              <div className={CARD}>
                <span className={PLATE}>
                  <MapPin size={20} strokeWidth={1.8} aria-hidden />
                </span>
                <CardBody label={t.basedLabel} value={t.basedValue} arrow={false} />
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal kind="scale" className="flex">
          <div ref={card} className="relative flex w-full overflow-hidden rounded-[8px] bg-ligne p-[1px] dark:bg-[#012A3C]">
            <span
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[180%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_290deg,rgba(48,217,140,0.75)_340deg,transparent_360deg)] [animation:tw-spin_8s_linear_infinite] motion-reduce:[animation:none]"
            />
            <div className="relative flex flex-1 flex-col rounded-[7px] bg-surface p-[clamp(10px,1.2vw,14px)] dark:bg-[radial-gradient(80%_60%_at_100%_0%,rgba(48,217,140,0.07),transparent_60%),#011B28]">
              <ContactForm lang={lang} dict={dict} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
