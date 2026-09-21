import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { BreadcrumbLd } from "@/components/shared/breadcrumb-ld";
import { GOUTTIERE } from "@/components/shared/container";
import { HeroGrid } from "@/components/shared/hero-grid";
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

const BACK = "flex items-center gap-[8px] text-[14px] leading-[20px] font-normal text-texte2 no-underline transition-colors duration-200 ease-[cubic-bezier(0.2,0.7,0.2,1)] hover:text-encre";

/**
 * Page d'article (maquette « Blog article ») : hero étroit de 760px — retour, H1,
 * chapeau, ligne auteur/méta — puis couverture 16:9, corps, pied de l'article,
 * bloc « À lire ensuite » et bandeau d'appel partagé.
 */
export async function BlogArticle({ post, lang }: Props) {
  const dict = await getDictionary(lang);
  const t = dict.blog;
  const related = getRelatedPosts(lang, post.slug);

  const back = (
    <Link href={`/${lang}/blog#articles`} className={BACK}>
      <ArrowLeft size={15} strokeWidth={2} aria-hidden />
      <span>{t.backToBlog}</span>
    </Link>
  );

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

      <section className={`relative flex justify-center overflow-x-clip pt-[72px] ${GOUTTIERE}`}>
        <HeroGrid />
        <div className="relative z-[1] flex w-full max-w-[760px] flex-col items-start gap-[18px]">
          {back}
          <h1 className="m-[0px] text-[clamp(26px,3.2vw,36px)] leading-[1.12] font-normal tracking-[-0.7px] text-encre text-balance">{post.title}</h1>
          <p className="m-[0px] max-w-[60ch] text-[16px] leading-[27px] font-normal text-texte2 text-pretty">{post.excerpt}</p>
          <PostMeta post={post} lang={lang} dict={dict} />
        </div>
      </section>

      <section className={`relative flex justify-center pt-[32px] pb-[clamp(64px,9vw,120px)] ${GOUTTIERE}`}>
        <div className="flex w-full max-w-[760px] flex-col gap-[32px]">
          <span className="relative block aspect-video w-full overflow-hidden rounded-[24px] bg-surface">
            <Image
              src={post.cover}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 760px) 100vw, 760px"
              className="object-cover opacity-90"
            />
          </span>

          <ArticleBody blocks={post.body} />

          <div aria-hidden className="h-[1px] bg-ligne" />

          <div className="flex flex-wrap items-center justify-between gap-[12px]">
            {back}
            <Link
              href={`/${lang}/contact#formulaire`}
              className="flex h-[40px] items-center rounded-[8px] bg-vert px-[20px] text-[14px] leading-[20px] font-normal text-sur-vert no-underline transition-colors hover:bg-vert-clair"
            >
              {t.articleCta}
            </Link>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className={`relative flex justify-center pb-[clamp(112px,16vw,240px)] ${GOUTTIERE}`}>
          <div className="flex w-full max-w-[1400px] flex-col gap-[40px]">
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
