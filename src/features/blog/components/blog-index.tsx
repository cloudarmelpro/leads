import { BreadcrumbLd } from "@/components/shared/breadcrumb-ld";
import { ScrollProgress } from "@/components/shared/scroll-progress";
import { BlogHero } from "@/features/blog/components/blog-hero";
import { BlogLd } from "@/features/blog/components/blog-ld";
import { PostGrid } from "@/features/blog/components/post-grid";
import { getPosts } from "@/features/blog/mock-posts";
import { Cta } from "@/features/home";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale };

/**
 * Index du blogue (maquette du 2026-09-30) : hero photo avec l'article courant et les trois
 * suivants en cartes, puis la liste filtrable de tous les articles, puis l'appel final.
 * Sans article, seul l'appel final reste.
 */
export async function BlogIndex({ lang }: Props) {
  const dict = await getDictionary(lang);
  const posts = getPosts(lang);

  return (
    <>
      <BreadcrumbLd
        lang={lang}
        items={[
          { name: dict.nav.home, path: "" },
          { name: dict.nav.blog, path: "/blog" },
        ]}
      />
      <ScrollProgress />

      {posts.length > 0 && (
        <>
          <BlogLd posts={posts} lang={lang} name={dict.blog.meta.title} description={dict.blog.meta.description} />
          <BlogHero posts={posts} lang={lang} dict={{ blog: dict.blog }} />
          <section id="articles" className="relative flex justify-center px-[clamp(16px,4vw,56px)] pt-[clamp(72px,9vw,120px)] pb-[clamp(96px,12vw,160px)]">
            <div className="flex w-full max-w-[1400px] flex-col gap-[clamp(32px,4vw,48px)]">
              <PostGrid posts={posts} lang={lang} dict={{ blog: dict.blog }} />
            </div>
          </section>
        </>
      )}

      <Cta dict={{ final: dict.final, placeholders: dict.placeholders }} />
    </>
  );
}
