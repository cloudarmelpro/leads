import Link from "next/link";
import type { ComponentType } from "react";

import { GOUTTIERE } from "@/components/shared/container";
import { Logo } from "@/components/shared/logo";
import { ManageCookiesButton } from "@/components/shared/manage-cookies-button";
import { ObfuscatedEmail } from "@/components/shared/obfuscated-email";
import { features, site, telHref } from "@/config/site";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale; dict: Dictionary };

// Glyphes de marque de la maquette (lucide-react n'expose plus les icônes de marque).
const FacebookIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.51 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0 0 22 12" />
  </svg>
);
const InstagramIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden>
    <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);
const LinkedinIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M20.45 2H3.55A1.55 1.55 0 0 0 2 3.55v16.9A1.55 1.55 0 0 0 3.55 22h16.9A1.55 1.55 0 0 0 22 20.45V3.55A1.55 1.55 0 0 0 20.45 2M8.34 18.34H5.67V9.75h2.67zM7 8.58a1.55 1.55 0 1 1 0-3.09 1.55 1.55 0 0 1 0 3.09m11.34 9.76h-2.67v-4.18c0-1-.02-2.28-1.39-2.28s-1.6 1.09-1.6 2.21v4.25h-2.66V9.75h2.55v1.17h.04a2.8 2.8 0 0 1 2.52-1.38c2.7 0 3.2 1.77 3.2 4.08z" />
  </svg>
);
type SocialKey = keyof Dictionary["footer"]["social"];
const SOCIAL_ICONS: Record<SocialKey, ComponentType> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
};
// Au survol, chaque bouton prend la couleur officielle de son réseau (décision du 2026-09-17).
const SOCIAL_HOVER: Record<SocialKey, string> = {
  facebook: "hover:bg-[#1877f2] hover:text-white",
  instagram: "hover:bg-[linear-gradient(45deg,#f9ce34_0%,#ee2a7b_50%,#6228d7_100%)] hover:text-white",
  linkedin: "hover:bg-[#0a66c2] hover:text-white",
};

const TITLE = "mb-[12px] text-[13px] leading-[20px] font-normal tracking-[0.08em] text-encre uppercase";
const LINK = "text-[14px] leading-[26px] font-normal text-texte3 no-underline transition-colors hover:text-encre";
const COORD = "text-[14px] leading-[26px] font-normal text-texte3 no-underline transition-colors hover:text-vert";

/**
 * Pied de page (direction du 2026-09-17) : quatre colonnes réparties sur le rail de
 * l'en-tête — logo + description à gauche, Plan du site, Ressources et Coordonnées
 * serrées à droite — puis une barre
 * basse avec copyright et liens légaux à gauche, réseaux sociaux à droite, et un grand
 * mot-symbole « Talgasy Web » très atténué, coupé par le bas de la page. Deux colonnes
 * sous 760px, une seule sous 620px.
 */
export function Footer({ lang, dict }: Props) {
  const plan = [
    { label: dict.nav.home, href: `/${lang}` },
    { label: dict.nav.services, href: `/${lang}#services` },
    { label: dict.nav.sectors, href: `/${lang}#secteurs` },
    { label: dict.nav.method, href: `/${lang}#methode` },
  ];
  const resources = [
    ...(features.pricing ? [{ label: dict.nav.pricing, href: `/${lang}/prix` }] : []),
    { label: dict.nav.faq, href: `/${lang}#faq` },
    { label: dict.nav.about, href: `/${lang}/a-propos` },
    { label: dict.nav.blog, href: `/${lang}/blog` },
  ];

  const tel = telHref(site.phone);
  const [emailUser, emailDomain] = (site.email ?? "").split("@");

  return (
    <footer id="footer" className={`relative flex justify-center overflow-hidden border-t border-ligne pt-[clamp(40px,6vw,80px)] ${GOUTTIERE}`}>
      {/* Même rail de 1400px que l'en-tête, plus large que les sections. */}
      <div className="relative flex w-full max-w-[1400px] flex-col">
        <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-x-[32px] gap-y-[28px] min-[620px]:grid-cols-[repeat(2,minmax(0,1fr))] min-[760px]:grid-cols-[minmax(0,1fr)_repeat(3,max-content)] min-[760px]:gap-x-[clamp(40px,6vw,96px)]">
          <div className="flex flex-col gap-[22px]">
            <Logo height={30} />
            <p className="m-[0px] max-w-[300px] text-[14px] leading-[24px] font-normal text-texte2 text-pretty">{dict.footer.description}</p>
          </div>

          <div className="flex flex-col">
            <span className={TITLE}>{dict.footer.navTitle}</span>
            {plan.map((item) => (
              <Link key={item.href} href={item.href} className={LINK}>
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col">
            <span className={TITLE}>{dict.footer.resourcesTitle}</span>
            {resources.map((item) => (
              <Link key={item.href} href={item.href} className={LINK}>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Coordonnées : liens cliquables quand la donnée existe, sinon texte placeholder. */}
          <div className="flex flex-col items-start">
            <span className={TITLE}>{dict.footer.coordTitle}</span>
            {tel ? (
              <a href={tel} className={COORD}>
                {site.phone}
              </a>
            ) : (
              <span className={COORD}>{dict.placeholders.phone}</span>
            )}
            {emailUser && emailDomain ? (
              <ObfuscatedEmail user={emailUser} domain={emailDomain} className={COORD} />
            ) : (
              <span className={COORD}>{dict.placeholders.email}</span>
            )}
          </div>
        </div>

        {/* `data-fab-avoid` : la bulle d'appel flottante se masque quand cette barre est
            visible, sinon elle recouvre « Gérer mes témoins » (voir floating-contact). */}
        <div data-fab-avoid className="relative mt-[48px] flex flex-wrap items-center justify-between gap-x-[32px] gap-y-[18px] border-t border-ligne pt-[24px]">
          <div className="flex flex-wrap items-center gap-x-[24px] gap-y-[6px]">
            <span className="text-[14px] leading-[25px] font-normal text-texte3">
              © {new Date().getFullYear()} {site.name} — {dict.footer.rights}
            </span>
            <Link href={`/${lang}/confidentialite`} className="text-[14px] leading-[22px] font-normal text-texte3 no-underline transition-colors hover:text-encre">
              {dict.footer.legal2}
            </Link>
            <ManageCookiesButton label={dict.cookies.manage} className="cursor-pointer text-[14px] leading-[22px] font-normal text-texte3 transition-colors hover:text-encre" />
          </div>
          <div className="flex items-center gap-[10px]">
            {site.social.map((network) => {
              const Icon = SOCIAL_ICONS[network.key];
              return (
                <a
                  key={network.key}
                  href={network.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={dict.footer.social[network.key]}
                  className={`tap-44 flex h-[36px] w-[36px] items-center justify-center rounded-[8px] bg-surface-2 text-encre ring-1 ring-contour ring-inset transition-colors hover:ring-0 ${SOCIAL_HOVER[network.key]}`}
                >
                  <Icon />
                </a>
              );
            })}
          </div>
        </div>

        {/* Grand mot-symbole décoratif en SVG : `textLength` l'étire exactement sur la
            largeur du rail à toute taille d'écran. Le mot reste lisible ; son bas se fond
            par un simple dégradé, sans flou : vers le noir en sombre, vers la couleur de page
            en clair. Le dégradé déborde du rail (-50vw de chaque côté) et va d'un bord de
            l'écran à l'autre, le footer le rogne (décision du 2026-09-17). */}
        <div className="relative mt-[clamp(16px,3vw,40px)] -mb-[1.5%]">
          <svg aria-hidden viewBox="0 0 1000 150" className="pointer-events-none block h-auto w-full text-encre/[0.26] select-none">
            <text x="0" y="142" textLength="1000" lengthAdjust="spacingAndGlyphs" fontSize="176" fontWeight="500" letterSpacing="-6" fill="currentColor">
              {site.name}
            </text>
          </svg>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-[-50vw] bottom-[0px] h-[66%] bg-[linear-gradient(180deg,transparent_0%,var(--color-fond)_92%)] dark:bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.82)_100%)]"
          />
        </div>
      </div>
    </footer>
  );
}
