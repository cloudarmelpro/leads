import Image from "next/image";
import Link from "next/link";

import { BreadcrumbLd } from "@/components/shared/breadcrumb-ld";
import { GOUTTIERE } from "@/components/shared/container";
import { HERO_BTN_GLASS, HERO_BTN_PRIMARY } from "@/components/shared/hero-buttons";
import { HeroCentre } from "@/components/shared/hero-centre";
import { Reveal } from "@/components/shared/reveal";
import { SectionHead } from "@/components/shared/section-head";
import { ArticleBody } from "@/features/blog/components/article-body";
import { ArticleLd } from "@/features/blog/components/article-ld";
import { POST_GRID, PostCard } from "@/features/blog/components/post-card";
import { PostMeta } from "@/features/blog/components/post-meta";
import { getRelatedPosts, type Post } from "@/features/blog/mock-posts";
import { Cta } from "@/features/home";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

type Props = { post: Post; lang: Locale };

/**
 * Page d'article sur le modèle des autres pages : hero centré (titre, chapeau, ligne
 * auteur/méta), couverture 16:9 et corps sur 760px, pied de l'article (retour, appel),
 * bloc « À lire ensuite » et bandeau d'appel partagé.
 */
export async function BlogArticle({ post, lang }: Props) {
  const dict = await getDictionary(lang);
  const t = dict.blog;
  const related = getRelatedPosts(lang, post.slug);

  return (
    <article>
      <ArticleLd post={post} lang={lang} />
      <BreadcrumbLd
        lang={lang}
        items={[
          { name: dict.nav.home, path: "" },
          { name: dict.nav.blog, path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ]}
      />

      <HeroCentre title={post.title} lede={post.excerpt} className="pb-[clamp(32px,4vw,56px)]">
        <Reveal delay={640} immediate className="mt-[clamp(6px,1vw,14px)] w-full max-w-[760px]">
          <PostMeta post={post} lang={lang} dict={dict} />
        </Reveal>
      </HeroCentre>

      <section className={`relative flex justify-center pb-[clamp(96px,11vw,180px)] ${GOUTTIERE}`}>
        <div className="flex w-full max-w-[760px] flex-col gap-[clamp(28px,3vw,40px)]">
          <Reveal kind="scale" immediate delay={760} className="relative block aspect-video w-full overflow-hidden rounded-[24px] bg-surface-2 dark:bg-surface">
            <Image src={post.cover} alt={post.title} fill priority sizes="(max-width: 760px) 100vw, 760px" className="object-cover" />
          </Reveal>

          <ArticleBody blocks={post.body} />

          <div className="flex flex-wrap items-center justify-between gap-[12px] pt-[8px]">
            <Link href={`/${lang}/blog#articles`} className={HERO_BTN_GLASS}>
              {t.backToBlog}
            </Link>
            <Link href={`/${lang}/contact#formulaire`} className={HERO_BTN_PRIMARY}>
              {t.articleCta}
            </Link>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className={`relative flex justify-center pb-[clamp(96px,11vw,180px)] ${GOUTTIERE}`}>
          <div className="flex w-full max-w-[1400px] flex-col gap-[clamp(32px,4vw,48px)]">
            <SectionHead id="suite" label={t.relatedKicker} title={t.relatedTitle} />
            <div className={POST_GRID}>
              {related.map((item) => (
                <PostCard key={item.slug} post={item} lang={lang} minRead={t.minRead} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Cta dict={dict} />
    </article>
  );
}
