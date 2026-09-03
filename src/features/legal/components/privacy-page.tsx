import { BreadcrumbLd } from "@/components/shared/breadcrumb-ld";
import { CONTENEUR } from "@/components/shared/container";
import { Eyebrow } from "@/components/shared/eyebrow";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
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
 * Politique de confidentialité sur l'ossature du site : hero (titre + intro), puis
 * deux colonnes comme la FAQ — sommaire ancré et date à gauche, articles numérotés
 * à droite, en texte nu (ni carte ni filet). Le contenu vit dans `privacy.ts`.
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
      <PageHero title={doc.title} subtitle={doc.intro} />

      <section className="pb-[clamp(80px,14vw,200px)]">
        <div
          className={`${CONTENEUR} grid grid-cols-1 gap-x-16 gap-y-9 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:items-start`}
        >
          {/* Colonne gauche, collante : eyebrow, sommaire ancré, date de mise à jour. */}
          <aside className="md:sticky md:top-8">
            <p className="mb-4">
              <Eyebrow>{doc.kicker}</Eyebrow>
            </p>
            <PrivacyToc label={doc.tocLabel} entries={entries.map(({ id, n, h }) => ({ id, n, h }))} />
            <p className="mt-6 text-[13px] leading-[20px] text-texte2">
              {doc.updatedLabel} — {formatDate(doc.updated, lang)}
            </p>
          </aside>

          {/* Colonne droite : articles numérotés comme les étapes de la Méthode. */}
          <Reveal as="div" stagger={0.06} className="flex flex-col gap-[clamp(36px,4vw,56px)]">
            {entries.map((entry) => (
              <article key={entry.id} id={entry.id} className="flex scroll-mt-8 flex-col gap-4">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[14px] leading-[25px] text-emeraude dark:text-accent-strong">
                    {entry.n}
                  </span>
                  <h2 className="text-title-fluid font-medium text-encre">{entry.h}</h2>
                </div>
                <div className="flex flex-col gap-3">
                  {entry.p.map((para, index) => (
                    <p key={index} className="text-small-fluid text-texte2 text-pretty">
                      {para}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}
