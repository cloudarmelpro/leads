import Link from "next/link";

import { LangMenu } from "@/components/shared/lang-menu";
import { LineReveal } from "@/components/shared/line-reveal";
import { Logo } from "@/components/shared/logo";
import { ManageCookiesButton } from "@/components/shared/manage-cookies-button";
import { ObfuscatedEmail } from "@/components/shared/obfuscated-email";
import { features, site, telHref } from "@/config/site";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale; dict: Dictionary };

const TITLE = "text-[14px] leading-[20px] font-medium text-encre";
const LINK = "text-[14px] leading-[22px] font-normal text-texte3 no-underline [overflow-wrap:anywhere] transition-colors hover:text-encre";
const LEGAL = "text-[14px] leading-[22px] font-normal text-texte-note no-underline transition-colors hover:text-encre";

/**
 * Pied de page (maquette Accueil, 2026-09-24) : logo, accroche et langue à gauche ; quatre
 * colonnes de liens à droite (Explorer, Ressources, Coordonnées, Réseaux) ; barre basse
 * avec copyright et liens légaux. Une colonne de tête sous 1000px ; liens sur quatre
 * colonnes, puis deux sous 620px. Le formulaire d'infolettre de la maquette n'est pas
 * affiché : l'infolettre n'existe pas encore (décision du 2026-09-24).
 */
export function Footer({ lang, dict }: Props) {
  const t = dict.footer;
  const explore = [
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
    <footer id="footer" className="relative flex justify-center px-[clamp(16px,4vw,56px)] pt-[clamp(88px,10vw,160px)] pb-[40px]">
      <div className="relative flex w-full max-w-[1400px] flex-col">
        <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-x-[32px] gap-y-[36px] min-[760px]:gap-x-[clamp(40px,6vw,96px)] min-[1000px]:grid-cols-[minmax(0,1fr)_max-content]">
          <div className="flex flex-col items-start gap-[22px]">
            <Logo height={28} />
            <LineReveal className="m-[0px] max-w-[300px] text-[15px] leading-[24px] font-normal text-texte2 text-pretty">{t.description}</LineReveal>
            <LangMenu current={lang} label={dict.header.langAria} variant="outline" placement="above" />
          </div>

          <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-x-[clamp(28px,4vw,64px)] gap-y-[32px] min-[620px]:grid-cols-[repeat(4,minmax(0,1fr))] min-[1000px]:grid-cols-[repeat(4,max-content)]">
            <div className="flex flex-col gap-[12px]">
              <span className={TITLE}>{t.navTitle}</span>
              {explore.map((item) => (
                <Link key={item.href} href={item.href} className={LINK}>
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-[12px]">
              <span className={TITLE}>{t.resourcesTitle}</span>
              {resources.map((item) => (
                <Link key={item.href} href={item.href} className={LINK}>
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Coordonnées : liens cliquables quand la donnée existe, sinon texte placeholder. */}
            <div className="flex flex-col items-start gap-[12px]">
              <span className={TITLE}>{t.coordTitle}</span>
              {tel ? (
                <a href={tel} className={LINK}>
                  {site.phone}
                </a>
              ) : (
                <span className={LINK}>{dict.placeholders.phone}</span>
              )}
              {emailUser && emailDomain ? (
                <ObfuscatedEmail user={emailUser} domain={emailDomain} className={LINK} />
              ) : (
                <span className={LINK}>{dict.placeholders.email}</span>
              )}
              <Link href={`/${lang}/contact`} className={LINK}>
                {t.bookCall}
              </Link>
            </div>

            <div className="flex flex-col gap-[12px]">
              <span className={TITLE}>{t.socialTitle}</span>
              {site.social.map((network) => (
                <a key={network.key} href={network.url} target="_blank" rel="noopener noreferrer" className={LINK}>
                  {t.social[network.key]}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* `data-fab-avoid` : la bulle d'appel flottante se masque quand cette barre est
            visible, sinon elle recouvre « Gérer mes témoins » (voir floating-contact). */}
        <div
          data-fab-avoid
          className="relative mt-[clamp(40px,6vw,72px)] flex flex-wrap items-center justify-between gap-x-[32px] gap-y-[12px] border-t border-ligne pt-[24px]"
        >
          <span className="text-[14px] leading-[22px] font-normal text-texte-note">
            © {new Date().getFullYear()} {site.name}. {t.rights}.
          </span>
          <div className="flex flex-wrap items-center gap-x-[24px] gap-y-[6px]">
            <Link href={`/${lang}/confidentialite`} className={LEGAL}>
              {t.legal2}
            </Link>
            <ManageCookiesButton label={dict.cookies.manage} className={`cursor-pointer ${LEGAL}`} />
          </div>
        </div>
      </div>
    </footer>
  );
}
