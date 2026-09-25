import { BreadcrumbLd } from "@/components/shared/breadcrumb-ld";
import { GOUTTIERE } from "@/components/shared/container";
import { HeroCentre } from "@/components/shared/hero-centre";
import { LineReveal } from "@/components/shared/line-reveal";
import { PrivacyToc } from "@/features/legal/components/privacy-toc";
import { getPrivacy } from "@/features/legal/privacy";
import { formatDate } from "@/lib/format/date";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale };

/** Identifiant d'ancre stable à partir d'un intitulé (accents retirés, tirets). */
function anchorId(heading: string) {
  return heading
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Politique de confidentialité sur le modèle des autres pages : hero centré (titre +
 * intro), puis deux colonnes comme la FAQ — sommaire ancré et date sur un panneau plein
 * collant à gauche, articles numérotés à droite. Le contenu vit dans `privacy.ts`.
 */
export async function PrivacyPage({ lang }: Props) {
  const doc = getPrivacy(lang);
  const dict = await getDictionary(lang);
  const entries = doc.sections.map((section, index) => ({
    ...section,
    id: anchorId(section.h),
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
      <HeroCentre title={doc.title} lede={doc.intro} className="pb-[clamp(96px,11vw,180px)]" />

      <section className={`relative flex justify-center pb-[clamp(96px,11vw,180px)] ${GOUTTIERE}`}>
        <div className="grid w-full max-w-[1400px] grid-cols-[minmax(0,1fr)] items-start gap-[clamp(24px,3vw,64px)] min-[900px]:grid-cols-[minmax(0,0.9fr)_minmax(0,2.1fr)]">
          {/* Sommaire collant sous l'en-tête flottant (78px + marge). */}
          <aside className="flex flex-col gap-[16px] rounded-[20px] bg-surface-2 p-[clamp(20px,2.4vw,28px)] min-[900px]:sticky min-[900px]:top-[96px] dark:bg-surface">
            <span className="text-[13px] leading-[20px] font-normal tracking-[0.08em] text-vert uppercase">{doc.kicker}</span>
            <PrivacyToc label={doc.tocLabel} entries={entries.map(({ id, n, h }) => ({ id, n, h }))} />
            <p className="m-[0px] text-[13px] leading-[20px] font-normal text-texte2">
              {doc.updatedLabel} — {formatDate(doc.updated, lang)}
            </p>
          </aside>

          <div className="flex flex-col gap-[clamp(36px,4.5vw,64px)]">
            {entries.map((entry) => (
              <article key={entry.id} id={entry.id} className="flex scroll-mt-[112px] flex-col gap-[12px]">
                <div className="flex items-baseline gap-[12px]">
                  <span className="text-[13px] leading-[20px] font-normal tracking-[0.08em] text-vert tabular-nums">{entry.n}</span>
                  <LineReveal as="h2" className="m-[0px] text-[clamp(22px,2.2vw,30px)] leading-[1.2] font-semibold tracking-[-0.01em] text-encre text-pretty">
                    {entry.h}
                  </LineReveal>
                </div>
                <div className="flex flex-col gap-[10px]">
                  {entry.p.map((para, index) => (
                    <p key={index} className="m-[0px] text-[15px] leading-[26px] font-normal text-texte2 text-pretty">
                      {para}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
