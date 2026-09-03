import type { Metadata } from "next";
import { Geist_Mono, Outfit, Plus_Jakarta_Sans } from "next/font/google";
import { notFound } from "next/navigation";

import "../globals.css";

import { CookieConsent } from "@/components/shared/cookie-consent";
import { Footer } from "@/components/shared/footer";
import { FloatingContact } from "@/components/shared/floating-contact";
import { Header } from "@/components/shared/header";
import { JsonLd } from "@/components/shared/json-ld";
import { PrePaintScript } from "@/components/shared/pre-paint-script";
import { SmoothScroll } from "@/components/shared/smooth-scroll";
import { site } from "@/config/site";
import { isLocale, localeHtmlLang, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo/metadata";

import { setRequestLocale } from "@/lib/i18n/request-locale";

// Typographie de la maquette Figma : Outfit pour les grands titres (h1/h2),
// Plus Jakarta Sans pour le corps et les titres secondaires. Deux polices
// variables Google Fonts.
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin", "latin-ext"],
});
const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin", "latin-ext"],
});
// Accent monospace (boutons, coordonnées) — conservé.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

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
      className={`${outfit.variable} ${plusJakarta.variable} ${geistMono.variable}`}
      // Le script inline pose `.dark` sur <html> avant l'hydratation (script de
      // thème) → on ignore la différence de className.
      suppressHydrationWarning
    >
      <head>
        {/* Les titres animés partent en `opacity-0` et sont révélés par GSAP.
            Sans JavaScript, ils resteraient invisibles : on les rétablit. */}
        <noscript>
          <style>{`.opacity-0{opacity:1}`}</style>
        </noscript>
      </head>
      <body className="min-h-dvh bg-fond text-encre">
        <PrePaintScript />
        <SmoothScroll />
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
