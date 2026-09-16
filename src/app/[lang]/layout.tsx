import type { Metadata } from "next";
import { DM_Sans, Geist_Mono } from "next/font/google";
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

// Police unique de la maquette « Accueil » : DM Sans (400 / 500 / 600 / 700).
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});
// Accent monospace (boutons, coordonnées) — conservé.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
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
      className={`${dmSans.variable} ${geistMono.variable}`}
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
        <Header lang={lang} dict={dict} />
        <main id="contenu">{children}</main>
        <Footer lang={lang} dict={dict} />
        <FloatingContact dict={dict} />
        <CookieConsent lang={lang} dict={dict} />
      </body>
    </html>
  );
}
