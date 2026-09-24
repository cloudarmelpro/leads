import Link from "next/link";

import { ObfuscatedEmail } from "@/components/shared/obfuscated-email";
import { MethodTrack } from "@/features/home/components/method-track";
import { site, telHref, whatsappHref } from "@/config/site";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale; dict: Pick<Dictionary, "method" | "hero"> };

// Rendus des six étapes (public/images/home), ceux de la maquette (`methode-0N-web.png`, 800×993).
const IMAGES = ["methode-01.webp", "methode-02.webp", "methode-03.webp", "methode-04.webp", "methode-05.webp", "methode-06.webp"];

const CHIP =
  "inline-flex h-[32px] items-center rounded-[8px] bg-surface px-[12px] text-[13px] leading-[1] font-medium text-encre no-underline shadow-[inset_0_0_0_1px_var(--color-contour)] transition-colors hover:bg-surface-2";

/**
 * Méthode (maquette Accueil, 2026-09-24) : titre et intro à gauche, flèches à droite ; les
 * six étapes en cartes illustrées sur une piste horizontale ; en bas, trois raccourcis de
 * contact et le bouton de prise de rendez-vous. Un raccourci n'apparaît que si la
 * coordonnée existe dans `site.ts`.
 */
export function Method({ lang, dict }: Props) {
  const t = dict.method;
  const shortcuts = [
    { label: t.startCall, href: telHref(site.phone), external: false },
    { label: "WhatsApp", href: whatsappHref(site.whatsapp), external: true },
  ].filter((s): s is { label: string; href: string; external: boolean } => s.href !== null);
  // L'adresse ne doit jamais apparaître en clair dans le HTML (voir ObfuscatedEmail).
  const [emailUser, emailDomain] = (site.email ?? "").split("@");

  return (
    <section id="methode" className="relative flex justify-center overflow-x-clip px-[clamp(16px,4vw,56px)] pb-[clamp(96px,11vw,180px)]">
      <div className="flex w-full max-w-[1400px] flex-col gap-[clamp(28px,3vw,40px)]">
        <MethodTrack steps={t.steps} images={IMAGES} stepLabel={t.stepLabel} prevLabel={t.prev} nextLabel={t.next}>
          <div className="flex min-w-[0px] flex-col items-start gap-[14px]">
            <h2 className="m-[0px] max-w-[520px] text-[clamp(22px,2.2vw,30px)] leading-[1.2] font-semibold tracking-[-0.01em] text-encre text-pretty">{t.title}</h2>
            <p className="m-[0px] max-w-[540px] text-[16px] leading-[26px] font-normal text-texte2 text-pretty">{t.intro}</p>
          </div>
        </MethodTrack>

        <div className="mt-[8px] flex flex-col items-center gap-[22px]">
          {(shortcuts.length > 0 || emailUser) && (
            <div className="flex flex-wrap items-center justify-center gap-[8px]">
              <span className="w-full text-center text-[14px] leading-[20px] font-normal text-texte-note min-[480px]:mr-[4px] min-[480px]:w-auto">{t.startWith}</span>
              {shortcuts.map((s) => (
                <a key={s.label} href={s.href} {...(s.external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={`tap-44 ${CHIP}`}>
                  {s.label}
                </a>
              ))}
              {emailUser && emailDomain && <ObfuscatedEmail user={emailUser} domain={emailDomain} label={t.startEmail} className={`tap-44 ${CHIP}`} />}
            </div>
          )}
          <Link
            href={`/${lang}/contact`}
            className="inline-flex h-[48px] items-center gap-[10px] rounded-[8px] bg-vert px-[22px] text-[15px] leading-[1] font-medium whitespace-nowrap text-sur-vert no-underline transition-colors hover:bg-vert-clair"
          >
            {dict.hero.ctaBook}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
