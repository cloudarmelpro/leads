import { BreadcrumbLd } from "@/components/shared/breadcrumb-ld";
import { HeroCentre } from "@/components/shared/hero-centre";
import { ScrollProgress } from "@/components/shared/scroll-progress";
import { Cta, Faq } from "@/features/home";
import { SoumissionWizard } from "@/features/soumission/components/soumission-wizard";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { lang: Locale; dict: Dictionary };

/**
 * Page Soumission (maquette du 2026-09-30) : hero centré (halo, titre qui roule, texte
 * d'appui), le parcours en sept étapes, la FAQ de l'accueil et l'appel final.
 */
export function SoumissionPage({ lang, dict }: Props) {
  const t = dict.soumission;

  return (
    <>
      <BreadcrumbLd
        lang={lang}
        items={[
          { name: dict.nav.home, path: "" },
          { name: t.breadcrumb, path: "/soumission" },
        ]}
      />
      <ScrollProgress />

      {/* Bas du hero plus aéré que la maquette (48–88px) : demandes du client du 2026-09-30,
          puis du 2026-10-02 (« ajoute un peu l'espace » : 72–140px → 104–200px). */}
      <HeroCentre title={t.title} lede={t.lede} className="pb-[clamp(104px,12.5vw,200px)]" />

      <SoumissionWizard lang={lang} dict={{ soumission: t }} />
      <Faq dict={{ faq: dict.faq }} lang={lang} />
      <Cta dict={{ final: dict.final, placeholders: dict.placeholders }} />
    </>
  );
}
