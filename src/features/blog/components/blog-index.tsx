import { BreadcrumbLd } from "@/components/shared/breadcrumb-ld";
import { GOUTTIERE } from "@/components/shared/container";
import { HeroGrid } from "@/components/shared/hero-grid";
import { SectionHead } from "@/components/shared/section-head";
import { FeaturedCard } from "@/features/blog/components/featured-card";
import { PostGrid } from "@/features/blog/components/post-grid";
import { getPosts } from "@/features/blog/mock-posts";
import { Cta } from "@/features/home";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale };

const PILL = "flex min-h-[34px] items-center rounded-[9px] bg-surface px-[14px] py-[7px] text-[13px] leading-[18px] font-medium text-texte-bascule ring-1 ring-ligne ring-inset dark:ring-0";

/**
 * Index du blog (maquette Blog) : hero à deux colonnes — masthead à gauche, article à
 * la une à droite — puis filtres et grille des autres articles, bandeau d'appel partagé.
 * Sans article, le hero tient seul (colonne de droite masquée) ; pas de carte « à venir ».
 */
export async function BlogIndex({ lang }: Props) {
  const dict = await getDictionary(lang);
  const t = dict.blog;
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

      <section className={`relative flex justify-center overflow-x-clip pt-[96px] pb-[80px] min-[620px]:pt-[64px] min-[620px]:pb-[104px] min-[900px]:pt-[120px] min-[900px]:pb-[clamp(112px,16vw,160px)] ${GOUTTIERE}`}>
        <HeroGrid top={30} />
        <div className={`relative z-[1] grid w-full max-w-[1100px] grid-cols-[minmax(0,1fr)] items-end gap-[36px] min-[900px]:gap-[48px] ${featured ? "min-[900px]:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]" : ""}`}>
          <div className="flex flex-col items-start gap-[20px]">
            <span className="text-[13px] leading-[20px] font-medium tracking-[0.08em] text-vert uppercase">{dict.nav.blog}</span>
            <h1 className="m-[0px] max-w-[520px] text-[clamp(26px,3.2vw,36px)] leading-[1.12] font-normal tracking-[-0.7px] text-encre text-balance">
              {t.title} <span className="text-vert">{t.titleHighlight}</span>
            </h1>
            <p className="m-[0px] max-w-[460px] text-[15px] leading-[26px] font-normal text-texte2 text-pretty">{t.heroIntro}</p>
            <div className="mt-[4px] flex flex-wrap gap-[8px]">
              {t.topics.map((topic) => (
                <span key={topic} className={PILL}>
                  {topic}
                </span>
              ))}
            </div>
          </div>
          {featured && <FeaturedCard post={featured} lang={lang} dict={dict} />}
        </div>
      </section>

      {rest.length > 0 && (
        <section className={`relative flex justify-center pb-[clamp(112px,16vw,240px)] ${GOUTTIERE}`}>
          <div className="flex w-full max-w-[1100px] flex-col gap-[48px]">
            <SectionHead id="articles" label={dict.nav.blog} title={t.moreArticles} intro={t.listSubtitle} introMax={420} />
            <PostGrid posts={rest} lang={lang} allLabel={t.filterAll} minRead={t.minRead} />
          </div>
        </section>
      )}

      <Cta dict={dict} />
    </>
  );
}
