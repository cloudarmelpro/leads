import { BreadcrumbLd } from "@/components/shared/breadcrumb-ld";
import { HeroSpot, moveSpot, SPOT_STYLE } from "@/components/shared/hero-spot";
import { LineReveal } from "@/components/shared/line-reveal";
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

      <section
        id="top"
        onPointerMove={moveSpot}
        style={SPOT_STYLE}
        className="relative flex justify-center overflow-clip px-[calc(10px+clamp(18px,5vw,72px))] pt-[168px] pb-[clamp(48px,6vw,88px)] text-center min-[620px]:pt-[190px] min-[900px]:pt-[240px]"
      >
        <HeroSpot />
        <div className="relative flex w-full flex-col items-center gap-[22px]">
          <LineReveal as="h1" rollOnHover className="m-[0px] cursor-default text-[clamp(24px,17.79px+1.66vw,36px)] leading-[1.08] font-semibold tracking-[-1px] text-encre uppercase min-[620px]:tracking-[-2px]">
            {t.title}
          </LineReveal>
          <LineReveal delay={0.3} className="m-[0px] max-w-[620px] text-[clamp(15px,13.45px+0.41vw,18px)] leading-[1.34] font-normal text-texte2 text-pretty">
            {t.lede}
          </LineReveal>
        </div>
      </section>

      <SoumissionWizard lang={lang} dict={{ soumission: t }} />
      <Faq dict={{ faq: dict.faq }} lang={lang} />
      <Cta dict={{ final: dict.final, placeholders: dict.placeholders }} />
    </>
  );
}
