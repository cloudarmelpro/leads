import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BreadcrumbLd } from "@/components/shared/breadcrumb-ld";
import { ScrollProgress } from "@/components/shared/scroll-progress";
import { AboutHero, Principles, ScrollCue, StoryPin, Team } from "@/features/about";
import { Cta, WelcomeSplash } from "@/features/home";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: PageProps<"/[lang]/a-propos">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const dict = await getDictionary(lang);

  return pageMetadata({
    lang,
    path: "/a-propos",
    title: dict.about.meta.title,
    description: dict.about.meta.description,
  });
}

export default async function AboutPage({ params }: PageProps<"/[lang]/a-propos">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const t = dict.about;

  return (
    <div>
      <BreadcrumbLd
        lang={lang}
        items={[
          { name: dict.nav.home, path: "" },
          { name: t.breadcrumb, path: "/a-propos" },
        ]}
      />
      <WelcomeSplash label={dict.welcome.before} brand={dict.welcome.brand} />
      <ScrollProgress />
      <AboutHero dict={dict} />
      <ScrollCue label={t.scroll.label} aria={t.scroll.aria} />
      <StoryPin quote={t.story.quote} items={t.story.items} />
      <Principles title={t.principles.title} intro={t.principles.intro} items={t.principles.items} />
      <Team {...t.team} />
      {/* Même bandeau d'appel que l'accueil (dictionnaire `final`), ancre #contact. */}
      <Cta dict={dict} />
    </div>
  );
}
