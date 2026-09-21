import type { Metadata } from "next";
import localFont from "next/font/local";
import { notFound } from "next/navigation";

import "../globals.css";

import { CookieConsent } from "@/components/shared/cookie-consent";
import { Footer } from "@/components/shared/footer";
import { FloatingContact } from "@/components/shared/floating-contact";
import { Header } from "@/components/shared/header";
import { JsonLd } from "@/components/shared/json-ld";
import { PrePaintScript } from "@/components/shared/pre-paint-script";
import { site } from "@/config/site";
import { isLocale, localeHtmlLang, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo/metadata";

import { setRequestLocale } from "@/lib/i18n/request-locale";

// Police du site : Neue Haas Grotesk Display Pro (fournie par le client, 2026-09-21).
// Les TTF de bureau ont ete reduits au latin et convertis en woff2 par
// `scripts/polices-neue-haas.py` : 100 ko -> 17 ko par graisse. Pas d'italique, le site
// n'en utilise aucune. Arial reste en reserve, ses proportions sont voisines.
const neueHaas = localFont({
  src: [
    { path: "../fonts/neue-haas-300.woff2", weight: "300", style: "normal" },
    { path: "../fonts/neue-haas-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/neue-haas-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/neue-haas-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-neue-haas",
  display: "swap",
});

// ISR courte sur TOUT le site public. Sans `revalidate`, Next annonce
// `s-maxage=31536000` : le CDN Hostinger (hcdn) gardait alors le HTML un an, sans
// purge fiable à chaque déploiement → HTML périmé pointant vers des chunks JS
// disparus (« This page couldn’t load »). Avec 60 s (+ `expireTime` dans
// next.config.ts), le CDN se rafraîchit seul après chaque mise en production.
export const revalidate = 60;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const dict = await getDictionary(lang);

  return {
    metadataBase: new URL(`https://${site.domain}`),
    ...pageMetadata({ lang, title: dict.meta.title, description: dict.meta.description }),
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  setRequestLocale(lang);

  const dict = await getDictionary(lang);

  return (
    <html
      lang={localeHtmlLang[lang]}
      className={neueHaas.variable}
      // Le script inline pose `.dark` sur <html> avant l'hydratation (script de
      // thème) → on ignore la différence de className.
      suppressHydrationWarning
    >
      <body className="relative min-h-dvh bg-fond text-encre">
        <PrePaintScript />
        <JsonLd lang={lang} dict={dict} />
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-100 focus:rounded-xl focus:bg-sapin focus:px-4 focus:py-3 focus:font-bold focus:text-white"
        >
          {dict.common.skipToContent}
        </a>
        {/* Les composants clients ne reçoivent que leur tranche du dictionnaire : tout ce
            qu'on leur passe est copié dans le HTML de chaque page (≈ 69 Ko en entier). */}
        <Header lang={lang} dict={{ nav: dict.nav, header: dict.header, common: dict.common, placeholders: dict.placeholders }} />
        <main id="contenu">{children}</main>
        <Footer lang={lang} dict={dict} />
        <FloatingContact dict={{ floating: dict.floating }} />
        <CookieConsent lang={lang} dict={{ cookies: dict.cookies }} />
      </body>
    </html>
  );
}
