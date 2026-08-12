import type { Metadata } from "next";
import { Cal_Sans, Inter } from "next/font/google";
import { notFound } from "next/navigation";

import "../globals.css";

import { CookieConsent } from "@/components/shared/cookie-consent";
import { Footer } from "@/components/shared/footer";
import { FloatingContact } from "@/components/shared/floating-contact";
import { Header } from "@/components/shared/header";
import { PrePaintScript } from "@/components/shared/pre-paint-script";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { isLocale, localeHtmlLang, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

// `next/font` n'accepte que des littéraux statiques : ni variable, ni spread.
// `latin-ext` couvre les caractères français absents de `latin` (œ, Œ).
// Cal Sans n'existe qu'en un seul poids (400) — c'est son poids d'affichage natif.
const calSans = Cal_Sans({
  variable: "--font-cal-sans",
  weight: "400",
  subsets: ["latin", "latin-ext"],
});
const inter = Inter({
  variable: "--font-inter",
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
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: `/${lang}`,
      languages: {
        "fr-CA": "/fr",
        "en-CA": "/en",
        "x-default": "/fr",
      },
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      locale: localeHtmlLang[lang],
      type: "website",
    },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <html
      lang={localeHtmlLang[lang]}
      className={`${calSans.variable} ${inter.variable}`}
      // Le script inline pose `reveal-ready` sur <html> avant l'hydratation
      // (comme un script de thème) → on ignore la différence de className.
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-fond text-encre">
        <PrePaintScript />
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
        <ScrollReveal />
      </body>
    </html>
  );
}
