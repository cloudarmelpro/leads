import { BreadcrumbLd } from "@/components/shared/breadcrumb-ld";
import { GOUTTIERE } from "@/components/shared/container";
import { HeroCentre } from "@/components/shared/hero-centre";
import { Reveal } from "@/components/shared/reveal";
import { SectionHead } from "@/components/shared/section-head";
import { FeaturedCard } from "@/features/blog/components/featured-card";
import { PostGrid } from "@/features/blog/components/post-grid";
import { getPosts } from "@/features/blog/mock-posts";
import { Cta } from "@/features/home";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale };

/**
 * Index du blogue sur le modèle des autres pages (demande du client, 2026-09-25) : hero
 * centré au nom de la page, article à la une sur un panneau plein, puis filtres et
 * grille des autres articles, bandeau d'appel partagé. Sans article, le hero tient seul.
 */
export async function BlogIndex({ lang }: Props) {
  const dict = await getDictionary(lang);
  const t = dict.blog;
  const posts = getPosts(lang);
  const [featured, ...rest] = posts;
  const categories = Array.from(new Set(posts.map((post) => post.category)));

  return (
    <>
      <BreadcrumbLd
        lang={lang}
        items={[
          { name: dict.nav.home, path: "" },
          { name: dict.nav.blog, path: "/blog" },
        ]}
      />

      {/* Sous le texte du hero, le même écart que sous les sections de l'accueil (demande du client). */}
      <HeroCentre title={dict.nav.blog} lede={t.heroIntro} className="pb-[clamp(96px,11vw,180px)]" />

      {featured && (
        <section className={`relative flex justify-center pb-[clamp(96px,11vw,180px)] ${GOUTTIERE}`}>
          <Reveal kind="scale" immediate delay={600} className="w-full max-w-[1400px]">
            <FeaturedCard post={featured} lang={lang} dict={dict} />
          </Reveal>
        </section>
      )}

      {rest.length > 0 && (
        <section className={`relative flex justify-center pb-[clamp(96px,11vw,180px)] ${GOUTTIERE}`}>
          <div className="flex w-full max-w-[1400px] flex-col gap-[clamp(32px,4vw,48px)]">
            <SectionHead id="articles" label={dict.nav.blog} title={t.moreArticles} intro={t.listSubtitle} />
            <PostGrid posts={posts} featuredSlug={featured?.slug} categories={categories} lang={lang} allLabel={t.filterAll} minRead={t.minRead} />
          </div>
        </section>
      )}

      <Cta dict={dict} />
    </>
  );
}
