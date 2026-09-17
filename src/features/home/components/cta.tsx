import { Phone } from "lucide-react";
import Image from "next/image";

import { ActionLink } from "@/components/shared/action-link";
import { GOUTTIERE } from "@/components/shared/container";
import { site, telHref } from "@/config/site";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { dict: Dictionary };

const IMAGE_MASK = "radial-gradient(85% 70% at 60% 118%, #000 0%, rgba(0,0,0,0.45) 45%, transparent 80%)";
const GRID_MASK = "radial-gradient(70% 90% at 50% 100%, #000 0%, rgba(0,0,0,0.4) 50%, transparent 85%)";

/**
 * Bandeau d'appel de la maquette : carte à 32px de rayon sur trois calques de fond
 * (cannelures générées, grille de 32px, halo vert montant du bas) ; titre et
 * paragraphe à gauche, gros bouton d'appel plein vert à droite.
 */
export function Cta({ dict }: Props) {
  const t = dict.final;
  const phone = site.phone ?? dict.placeholders.phone;

  return (
    <section className={`relative flex justify-center pb-[clamp(112px,16vw,240px)] ${GOUTTIERE}`}>
      <div
        id="contact"
        className="relative grid w-full max-w-[1400px] grid-cols-[minmax(0,1fr)] items-center gap-[40px] overflow-hidden rounded-[32px] bg-surface ring-1 ring-ligne ring-inset dark:ring-0 px-[clamp(28px,5vw,72px)] py-[clamp(40px,5vw,72px)] min-[620px]:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]"
      >
        <Image
          src="/images/home/cta-bg-v2.jpg"
          alt=""
          aria-hidden
          fill
          sizes="(max-width: 1100px) 100vw, 1100px"
          className="pointer-events-none z-0 object-cover object-[center_bottom] opacity-[0.22] mix-blend-screen select-none"
          style={{ maskImage: IMAGE_MASK, WebkitMaskImage: IMAGE_MASK }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-[0px] z-0 hidden bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:32px_32px] bg-[position:center_bottom] dark:block"
          style={{ maskImage: GRID_MASK, WebkitMaskImage: GRID_MASK }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-[0px] z-0 bg-[radial-gradient(60%_70%_at_50%_108%,rgba(48,217,140,0.16)_0%,rgba(48,217,140,0.05)_42%,rgba(1,27,40,0)_76%)]"
        />

        <div className="relative flex flex-col gap-[18px]">
          <h2 className="m-[0px] max-w-[520px] text-[clamp(22px,2.6vw,30px)] leading-[1.15] font-medium tracking-[-0.4px] text-encre text-balance">
            {t.title}
          </h2>
          <p className="m-[0px] max-w-[440px] text-[15px] leading-[26px] font-normal text-texte2 text-pretty">{t.body}</p>
        </div>

        <div className="relative flex w-full max-w-[360px] flex-col items-start gap-[18px] min-[620px]:justify-self-end">
          <ActionLink
            href={telHref(site.phone)}
            unavailableLabel={`${t.callLabel} — ${phone}`}
            className="flex w-full items-center gap-[14px] rounded-[14px] bg-vert py-[16px] pr-[22px] pl-[18px] text-left text-sur-vert no-underline transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.2,0.7,0.2,1)] hover:-translate-y-[2px] hover:bg-vert-clair active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55"
          >
            <span className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[10px] bg-sur-vert/12">
              <Phone size={20} strokeWidth={2.2} aria-hidden />
            </span>
            <span className="flex flex-col gap-[2px]">
              <span className="text-[12px] leading-[14px] font-medium tracking-[0.06em] text-sur-vert/70 uppercase">{t.callLabel}</span>
              <span className="text-[20px] leading-[24px] font-semibold tracking-[-0.3px] whitespace-nowrap">{phone}</span>
            </span>
          </ActionLink>
          <span className="text-[13px] leading-[18px] font-normal text-texte-note">{t.note}</span>
        </div>
      </div>
    </section>
  );
}
