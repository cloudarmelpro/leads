import { GOUTTIERE } from "@/components/shared/container";
import { HeroGrid } from "@/components/shared/hero-grid";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { dict: Dictionary };

/**
 * Hero de la page À propos (maquette) : titre en casse normale avec coupure de ligne
 * forcée et mot-clé en vert, paragraphe, bouton de 38px vers le bandeau d'appel de la
 * page. Fond = référence Accueil (halos de page + grille du hero). Padding haut
 * 120 / 64 / 96px selon la largeur, bas 140 / 96 / 72px.
 */
export function AboutHero({ dict }: Props) {
  const t = dict.about;

  return (
    <section className={`relative flex justify-center overflow-x-clip pt-[120px] pb-[140px] ${GOUTTIERE}`}>
      <HeroGrid />
      <div className="relative z-[1] flex w-full max-w-[1100px] flex-col items-start gap-[22px]">
        <h1 className="m-[0px] max-w-[680px] text-[clamp(26px,3.2vw,36px)] leading-[1.12] font-normal tracking-[-0.7px] text-encre text-pretty">
          {t.heroTitleA}
          <br />
          <span className="text-vert">{t.heroHighlight}</span>
          {t.heroTitleB}
        </h1>
        <p className="m-[0px] max-w-[520px] text-[14px] leading-[24px] font-normal text-texte2 text-pretty">{t.heroSubtitle}</p>
        <a
          href="#contact"
          className="mt-[10px] flex h-[38px] items-center gap-[10px] rounded-[9px] bg-vert px-[22px] text-[14px] leading-[20px] font-medium text-sur-vert no-underline transition-colors hover:bg-vert-clair"
        >
          {dict.hero.ctaBook}
        </a>
      </div>
    </section>
  );
}
