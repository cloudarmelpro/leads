import Link from "next/link";

import { BreadcrumbLd } from "@/components/shared/breadcrumb-ld";
import { CONTENEUR } from "@/components/shared/container";
import { ArrowLeft } from "@/components/ui/arrows";
import { ArticleBody } from "@/features/blog/components/article-body";
import { ArticleLd } from "@/features/blog/components/article-ld";
import { PostMeta } from "@/features/blog/components/post-meta";
import type { Post } from "@/features/blog/mock-posts";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

type Props = { post: Post; lang: Locale };

/** Corps d'un article de blog : fil d'Ariane, en-tête, méta auteur et contenu. */
export async function BlogArticle({ post, lang }: Props) {
  const dict = await getDictionary(lang);

  return (
    <article className="pt-[clamp(20px,3vw,40px)] pb-[clamp(48px,7vw,96px)]">
      <ArticleLd post={post} lang={lang} />
      <BreadcrumbLd
        lang={lang}
        items={[
          { name: dict.nav.home, path: "" },
          { name: dict.nav.blog, path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ]}
      />
      <div className={CONTENEUR}>
        <div className="mx-auto max-w-[760px]">
          <Link
            href={`/${lang}/blog`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-texte2 no-underline transition-colors hover:text-encre"
          >
            <ArrowLeft className="w-[15px]" />
            {dict.blog.backToBlog}
          </Link>

          <h1 className="mt-6 font-display text-[clamp(1.5rem,4vw,2.375rem)] leading-[1.143] font-normal tracking-[-1.2px] text-balance">
            {post.title}
          </h1>
          <p className="mt-4 max-w-[60ch] text-base leading-[1.6] text-texte2 text-pretty">
            {post.excerpt}
          </p>

          <div className="mt-8">
            <PostMeta post={post} lang={lang} dict={dict} />
          </div>

          <ArticleBody blocks={post.body} />
        </div>
      </div>
    </article>
  );
}
