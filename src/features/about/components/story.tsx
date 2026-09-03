import { CONTENEUR } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeader } from "@/components/shared/section-header";
import { SurfaceCard } from "@/components/shared/surface-card";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { dict: Dictionary };

/**
 * Récit fondateur, sur la structure des sections de l'accueil : en-tête (eyebrow,
 * titre, premier mouvement en intro à droite) puis un mouvement par carte numérotée.
 * Le paragraphe d'ouverture (`story[0]`) est porté par le hero de la page.
 */
export function Story({ dict }: Props) {
  const t = dict.about;
  const [, intro, ...movements] = t.story;

  return (
    <section className="pb-[clamp(80px,14vw,200px)]">
      <div className={CONTENEUR}>
        <SectionHeader kicker={t.storyKicker} title={t.storyTitle} intro={intro} />

        <Reveal as="div" stagger={0.1} className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {movements.map((paragraph, index) => (
            <SurfaceCard key={index} as="article" className="gap-6 p-7 sm:p-8">
              <span className="relative font-mono text-[14px] leading-[25px] text-emeraude dark:text-accent-strong">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="relative text-body-fluid text-encre text-pretty">{paragraph}</p>
            </SurfaceCard>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
