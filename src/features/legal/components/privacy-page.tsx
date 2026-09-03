import { BreadcrumbLd } from "@/components/shared/breadcrumb-ld";
import { CONTENEUR } from "@/components/shared/container";
import { getPrivacy } from "@/features/legal/privacy";
import { formatDate } from "@/lib/format/date";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale };

/** Corps de la page « Politique de confidentialité » (contenu dans `privacy.ts`). */
export async function PrivacyPage({ lang }: Props) {
  const doc = getPrivacy(lang);
  const dict = await getDictionary(lang);

  return (
    <div className="pt-[clamp(24px,4vw,48px)] pb-[clamp(48px,7vw,96px)]">
      <BreadcrumbLd
        lang={lang}
        items={[
          { name: dict.nav.home, path: "" },
          { name: doc.title, path: "/confidentialite" },
        ]}
      />
      <div className={CONTENEUR}>
        <div className="mx-auto max-w-190">
          <h1 className="font-display text-[clamp(22px,3.75vw,36px)] leading-[1.1] tracking-normal text-balance">
            {doc.title}
          </h1>
          <p className="mt-3 text-sm text-texte2">
            {doc.updatedLabel} — {formatDate(doc.updated, lang)}
          </p>
          <p className="mt-6 text-base leading-[1.7] text-texte2 text-pretty">{doc.intro}</p>

          <div className="mt-10 flex flex-col gap-8">
            {doc.sections.map((section) => (
              <section key={section.h}>
                <h2 className="font-display text-xl leading-[1.25]">{section.h}</h2>
                <div className="mt-3 flex flex-col gap-3">
                  {section.p.map((para, index) => (
                    <p key={index} className="text-[15px] leading-[1.7] text-texte2 text-pretty">
                      {para}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
