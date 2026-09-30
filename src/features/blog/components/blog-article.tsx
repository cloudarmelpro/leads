import Link from "next/link";

import { BreadcrumbLd } from "@/components/shared/breadcrumb-ld";
import { ScrollProgress } from "@/components/shared/scroll-progress";
import { ArticleBody } from "@/features/blog/components/article-body";
import { ArticleLd } from "@/features/blog/components/article-ld";
import { CoverImage } from "@/features/blog/components/cover-image";
import { PostMeta } from "@/features/blog/components/post-meta";
import { RELATED_GRID, RelatedCard } from "@/features/blog/components/related-card";
import { getRelatedPosts, type Post } from "@/features/blog/mock-posts";
import { Cta } from "@/features/home";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

type Props = { post: Post; lang: Locale };

const GUTTER = "px-[clamp(16px,4vw,56px)]";
const BACK = "flex items-center gap-[8px] text-[14px] leading-[20px] font-medium no-underline transition-colors duration-200 ease-[cubic-bezier(0.2,0.7,0.2,1)]";

function BackLink({ href, label, className }: { href: string; label: string; className: string }) {
  return (
    <Link href={href} className={`${BACK} ${className}`}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M19 12H5M11 18l-6-6 6-6" />
      </svg>
      <span>{label}</span>
    </Link>
  );
}

/**
 * Page d'article (maquette Blog article, 2026-09-30) : hero photo (retour au blog, titre en
 * capitales, chapeau, ligne auteur/méta), couverture 16:9 et corps sur 760px, pied de
 * l'article (retour, appel), « À lire ensuite » et l'appel final.
 */
export async function BlogArticle({ post, lang }: Props) {
  const dict = await getDictionary(lang);
  const t = dict.blog;
  const related = getRelatedPosts(lang, post.slug);
  const back = `/${lang}/blog#articles`;

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
      <ScrollProgress />

      <section
        id="top"
        // Bas du hero plus aéré que la maquette (48–80px), demande du client du 2026-09-30 :
        // le même air sous le texte que sur les autres heros (72–140px). Mode clair : voile
        // gris perle et textes encre (valeurs nuit sous `dark:`), en-tête plus forcé en sombre.
        className={`relative flex min-h-[clamp(520px,72vh,760px)] items-end justify-center overflow-hidden bg-[#eef1f3] pt-[calc(80px+clamp(56px,8vw,120px))] pb-[clamp(72px,9.5vw,140px)] dark:bg-[#011823] ${GUTTER}`}
      >
        <CoverImage post={post} priority sizes="100vw" />
        <span aria-hidden className={`absolute inset-[0px] block bg-[linear-gradient(90deg,rgba(238,241,243,0.92)_0%,rgba(238,241,243,0.7)_38%,rgba(238,241,243,0.25)_70%,rgba(238,241,243,0.35)_100%)] dark:bg-[linear-gradient(90deg,rgba(1,24,35,0.92)_0%,rgba(1,24,35,0.7)_38%,rgba(1,24,35,0.25)_70%,rgba(1,24,35,0.35)_100%)]`} />
        <span aria-hidden className={`absolute inset-[0px] block bg-[linear-gradient(180deg,rgba(238,241,243,0.75)_0%,rgba(238,241,243,0)_22%,rgba(238,241,243,0)_55%,#eef1f3_92%,#eef1f3_100%)] dark:bg-[linear-gradient(180deg,rgba(1,24,35,0.75)_0%,rgba(1,24,35,0)_22%,rgba(1,24,35,0)_55%,#011823_92%,#011823_100%)]`} />
        <div className="relative z-[1] flex w-full max-w-[1400px] flex-col items-start gap-[18px]">
          <BackLink href={back} label={t.backToBlog} className="text-texte2 hover:text-encre dark:text-[#A9BCC4] dark:hover:text-white" />
          <h1 className="m-[0px] max-w-[760px] text-[clamp(28px,3vw,40px)] leading-[1.05] font-semibold tracking-[-0.02em] text-encre uppercase text-balance dark:text-white">{post.title}</h1>
          <p className="m-[0px] max-w-[60ch] text-[16px] leading-[27px] font-normal text-texte-bascule text-pretty dark:text-[#A9BCC4]">{post.excerpt}</p>
          <PostMeta post={post} lang={lang} dict={{ blog: t }} />
        </div>
      </section>

      <section id="article" className={`relative flex justify-center pt-[32px] pb-[clamp(64px,9vw,120px)] ${GUTTER}`}>
        <div className="flex w-full max-w-[760px] flex-col gap-[32px]">
          <span className="relative block aspect-video w-full overflow-hidden rounded-[24px] bg-surface-2 dark:bg-[#01212F]">
            <CoverImage post={post} alt={post.title} sizes="(max-width: 760px) 100vw, 760px" className="opacity-90" />
          </span>

          <ArticleBody blocks={post.body} />

          <div aria-hidden className="h-px bg-ligne" />
          <div className="flex flex-wrap items-center justify-between gap-[12px]">
            <BackLink href={back} label={t.backToBlog} className="text-texte2 hover:text-encre" />
            <Link
              href={`/${lang}/soumission`}
              className="flex h-[40px] items-center rounded-[9px] bg-bouton px-[20px] text-[14px] leading-[20px] font-medium text-sur-bouton no-underline transition-colors duration-200 hover:bg-bouton-clair"
            >
              {t.articleCta}
            </Link>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section id="suite" className={`relative flex justify-center pb-[clamp(112px,16vw,240px)] ${GUTTER}`}>
          <div className="flex w-full max-w-[1400px] flex-col gap-[40px]">
            <div className="flex flex-col gap-[14px]">
              <span className="text-[15px] leading-[20px] font-medium text-texte-bascule">{t.relatedKicker}</span>
              <h2 className="m-[0px] text-[clamp(22px,2.2vw,30px)] leading-[1.2] font-semibold tracking-[-0.01em] text-encre text-balance">{t.relatedTitle}</h2>
            </div>
            <div className={RELATED_GRID}>
              {related.map((item) => (
                <RelatedCard key={item.slug} post={item} lang={lang} minRead={t.minRead} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Cta dict={{ final: dict.final, placeholders: dict.placeholders }} />
    </article>
  );
}
