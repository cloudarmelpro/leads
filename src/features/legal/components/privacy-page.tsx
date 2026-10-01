import { BreadcrumbLd } from "@/components/shared/breadcrumb-ld";
import { HeroSpot, moveSpot, SPOT_STYLE } from "@/components/shared/hero-spot";
import { LineReveal } from "@/components/shared/line-reveal";
import { ScrollProgress } from "@/components/shared/scroll-progress";
import { PrivacyToc } from "@/features/legal/components/privacy-toc";
import { getPrivacy } from "@/features/legal/privacy";
import { Cta } from "@/features/home";
import { formatDate } from "@/lib/format/date";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale };

const GUTTER = "px-[clamp(16px,4vw,56px)]";

/**
 * Politique de confidentialité (maquette du 2026-09-30) : hero centré (halo, titre qui
 * roule, intro, quatre repères en cartes), puis deux colonnes dès 900px — sommaire collant
 * avec compteur et progression de lecture, articles numérotés — et l'appel final. Sans
 * les filets de la maquette (demande du client). Le contenu vit dans `privacy.ts`.
 */
export async function PrivacyPage({ lang }: Props) {
  const doc = getPrivacy(lang);
  const dict = await getDictionary(lang);
  const entries = doc.sections.map((section, index) => ({
    ...section,
    id: `s${index + 1}`,
    n: String(index + 1).padStart(2, "0"),
  }));

  return (
    <>
      <BreadcrumbLd
        lang={lang}
        items={[
          { name: dict.nav.home, path: "" },
          { name: doc.title, path: "/confidentialite" },
        ]}
      />
      <ScrollProgress />

      <section
        id="top"
        onPointerMove={moveSpot}
        style={SPOT_STYLE}
        className={`relative flex justify-center overflow-clip pt-[calc(80px+clamp(48px,7vw,96px))] pb-[clamp(56px,7vw,96px)] text-center ${GUTTER}`}
      >
        <HeroSpot />
        <div className="relative flex w-full max-w-[1100px] flex-col items-center gap-[22px]">
          <LineReveal as="h1" immediate rollOnHover className="m-[0px] cursor-default text-[clamp(24px,17.79px+1.66vw,36px)] leading-[1.08] font-semibold tracking-[-1px] text-encre uppercase text-balance min-[620px]:tracking-[-2px]">
            {doc.title}
          </LineReveal>
          <LineReveal immediate delay={0.3} className="m-[0px] max-w-[620px] text-[18px] leading-[24px] font-normal text-texte-bascule text-pretty">
            {doc.intro}
          </LineReveal>
          {/* Marge plus aérée que la maquette (16–32px), demande du client du 2026-09-30 : avec les
              22px de la colonne, le même écart sous le texte que sur les autres heros (72–140px). */}
          <div className="mt-[clamp(50px,8vw,118px)] grid w-full grid-cols-[minmax(0,1fr)] gap-[12px] text-left min-[620px]:grid-cols-[repeat(2,minmax(0,1fr))] min-[1000px]:grid-cols-[repeat(4,minmax(0,1fr))]">
            {doc.brief.map((item) => (
              <div key={item.title} className="flex flex-col gap-[6px] rounded-[16px] bg-surface-2 px-[20px] py-[18px] dark:bg-surface">
                <span aria-hidden className="block h-[2px] w-[14px] rounded-[2px] bg-vert" />
                <span className="text-[15px] leading-[21px] font-semibold text-encre">{item.title}</span>
                <span className="text-[14px] leading-[21px] font-normal text-texte2 text-pretty">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`relative flex justify-center pb-[clamp(80px,10vw,140px)] ${GUTTER}`}>
        <div className="grid w-full max-w-[1400px] grid-cols-[minmax(0,1fr)] items-start gap-[clamp(32px,5vw,72px)] min-[900px]:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
          {/* Sommaire collant sous l'en-tête fixe (80px + 24px d'air). */}
          <aside className="flex flex-col gap-[18px] pt-[clamp(32px,4vw,44px)] min-[900px]:sticky min-[900px]:top-[104px]">
            <PrivacyToc label={doc.tocLabel} entries={entries.map(({ id, n, h }) => ({ id, n, h }))} />
            <p className="m-[0px] text-[13px] leading-[18px] font-normal text-texte-note">
              {doc.updatedLabel} — {formatDate(doc.updated, lang)}
            </p>
          </aside>

          <article className="flex max-w-[820px] min-w-[0px] flex-col">
            {entries.map((entry) => (
              <section key={entry.id} id={entry.id} className="flex scroll-mt-[104px] flex-col gap-[18px] py-[clamp(32px,4vw,44px)]">
                <div className="flex items-baseline gap-[14px]">
                  <span className="text-[14px] leading-[20px] font-semibold text-vert tabular-nums">{entry.n}</span>
                  <h2 className="m-[0px] text-[clamp(20px,2vw,24px)] leading-[1.2] font-semibold tracking-[-0.3px] text-encre text-balance">{entry.h}</h2>
                </div>
                <div className="flex flex-col gap-[14px] min-[620px]:pl-[34px]">
                  {entry.p.map((para, index) => (
                    <p key={index} className="m-[0px] text-[16px] leading-[27px] font-normal text-prose text-pretty">
                      {para}
                    </p>
                  ))}
                  {entry.list && (
                    <ul className="m-[0px] flex list-disc flex-col gap-[8px] pl-[22px] text-[16px] leading-[27px] font-normal text-prose marker:text-vert">
                      {entry.list.map((item) => (
                        <li key={item} className="pl-[4px] text-pretty">
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  {entry.after?.map((para, index) => (
                    <p key={index} className="m-[0px] text-[16px] leading-[27px] font-normal text-prose text-pretty">
                      {para}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </article>
        </div>
      </section>

      <Cta dict={{ final: dict.final, placeholders: dict.placeholders }} />
    </>
  );
}
