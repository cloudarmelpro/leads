import Link from "next/link";

import { BreadcrumbLd } from "@/components/shared/breadcrumb-ld";
import { CONTENEUR } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeader } from "@/components/shared/section-header";
import { SurfaceCard } from "@/components/shared/surface-card";
import { BlogFeatured } from "@/features/blog/components/blog-featured";
import { PostCard } from "@/features/blog/components/post-card";
import { getPosts } from "@/features/blog/mock-posts";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale };

/** Liste du blog, sur la structure de l'accueil : hero, à la une, puis grille. */
export async function BlogIndex({ lang }: Props) {
  const dict = await getDictionary(lang);
  const posts = getPosts(lang);
  const [featured, ...rest] = posts;

  return (
    <>
      <BreadcrumbLd
        lang={lang}
        items={[
          { name: dict.nav.home, path: "" },
          { name: dict.nav.blog, path: "/blog" },
        ]}
      />
      <PageHero title={dict.blog.title} subtitle={dict.blog.subtitle} />

      <section className="pb-[clamp(80px,14vw,200px)]">
        <div className={CONTENEUR}>
          {/* Aucun article publié : état « à venir » dans une carte, comme les
              cartes Services. Dès qu'un article existe, à la une + liste reprennent. */}
          {posts.length === 0 && (
            <Reveal as="div">
              <SurfaceCard className="gap-6 px-10 pt-10 pb-11 md:flex-row md:items-end md:justify-between">
                <div className="relative max-w-[46ch]">
                  <p className="text-[14px] leading-[25px] font-light text-emeraude dark:text-accent-strong">
                    {dict.blog.emptyKicker}
                  </p>
                  <h2 className="mt-2 font-display text-[clamp(22px,3vw,30px)] leading-[1.143] font-normal tracking-[-0.8px] text-encre text-balance">
                    {dict.blog.emptyTitle}
                  </h2>
                  <p className="mt-3 text-[15px] leading-[24px] text-texte2 text-pretty">{dict.blog.emptyBody}</p>
                </div>
                <Link
                  href={`/${lang}/contact`}
                  className="relative w-fit shrink-0 rounded-[9px] bg-emeraude px-4 py-2.5 text-[15px] font-medium text-white no-underline hover:bg-[#7fefc0] hover:text-fond dark:bg-accent-strong dark:text-fond dark:hover:bg-[#7fefc0]"
                >
                  {dict.nav.contact}
                </Link>
              </SurfaceCard>
            </Reveal>
          )}

          {featured && (
            <Reveal as="div">
              <BlogFeatured post={featured} lang={lang} dict={dict} />
            </Reveal>
          )}

          {rest.length > 0 && (
            <div className="mt-[clamp(56px,8vw,96px)]">
              <SectionHeader title={dict.blog.moreArticles} intro={dict.blog.listSubtitle} />
              <Reveal as="div" stagger={0.1} className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {rest.map((post) => (
                  <PostCard key={post.slug} post={post} lang={lang} dict={dict} />
                ))}
              </Reveal>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
