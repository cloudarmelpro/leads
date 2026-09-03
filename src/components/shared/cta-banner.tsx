import Link from "next/link";

import { CONTENEUR } from "@/components/shared/container";
import { ArrowRight } from "@/components/ui/arrows";
import { Eyebrow } from "@/components/shared/eyebrow";
import { SplitReveal } from "@/components/shared/split-reveal";
import type { Locale } from "@/lib/i18n/config";

type Props = {
  lang: Locale;
  /** Grand titre à gauche. */
  title: string;
  /** Paragraphe du bloc central. */
  body: string;
  /** Eyebrow (pastille + label) au-dessus du titre, ex. « Contact ». */
  kicker?: string;
  /** Intitulé du bloc central, ex. « Book your consultation ». */
  eyebrow?: string;
  /** Téléphone affiché en vert sous le bloc central (rien si absent/null). */
  phone?: string | null;
  /** Libellé accessible du bouton-flèche. */
  ariaLabel: string;
  /** Cible du bouton — par défaut la page contact. */
  href?: string;
  id?: string;
};

/**
 * CTA en bandeau horizontal (design « Talgasy Web - Dark ») : eyebrow + titre à
 * gauche ; bloc « réserver » + texte + téléphone au centre, séparé par une barre
 * verticale ; gros bouton-flèche vert à droite ; halo vert décoratif en haut-droite.
 * Partagé accueil + À propos — `kicker`/`eyebrow`/`phone` sont optionnels.
 */
export function CtaBanner({ lang, title, body, kicker, eyebrow, phone, ariaLabel, href, id }: Props) {
  const tel = phone ? `tel:${phone.replace(/[^\d+]/g, "")}` : null;

  return (
    <section id={id} className="pb-[clamp(80px,14vw,200px)]">
      <div className={CONTENEUR}>
        <div className="relative flex w-full flex-col gap-8 overflow-hidden rounded-[20px] border border-ligne bg-surface p-[clamp(32px,4vw,56px)] shadow-soft md:min-h-[240px] md:flex-row md:items-center md:gap-0 dark:border-transparent dark:shadow-[inset_0_0_0_1px_#0a2a3a]">
          {/* Halo vert décoratif (haut-droite), comme la maquette. */}
          <span
            aria-hidden
            className="pointer-events-none absolute top-[-220px] right-[-180px] h-[620px] w-[620px] rounded-full bg-[radial-gradient(closest-side,rgba(48,217,140,0.16),rgba(48,217,140,0)_72%)]"
          />

          {/* Gauche : eyebrow + titre (largeur fixée → la ligne de séparation
              tombe à ~42 % de la carte, pas trop à droite). */}
          <div className="relative flex flex-col gap-3.5 md:w-[36%] md:shrink-0">
            {kicker && <Eyebrow>{kicker}</Eyebrow>}
            <SplitReveal as="h2" className="font-display text-[clamp(24px,4vw,38px)] leading-[1.143] font-normal tracking-[-1.2px] text-balance text-encre">
              {title}
            </SplitReveal>
          </div>

          {/* Droite : séparée par la ligne verticale — bloc « réserver » + flèche. */}
          <div className="relative flex flex-col gap-8 md:flex-1 md:flex-row md:items-center md:gap-10 md:border-l md:border-ligne md:pl-10 dark:md:border-[#0a2a3a]">
            <div className="flex flex-col gap-1.5 md:flex-1">
              {eyebrow && (
                <span className="text-[16px] leading-[25px] font-medium text-encre">{eyebrow}</span>
              )}
              <p className="text-[14px] leading-[24px] font-light text-texte2 text-pretty">{body}</p>
              {tel && (
                <a
                  href={tel}
                  className="mt-1.5 text-[15px] leading-[24px] font-medium text-emeraude no-underline transition-colors hover:text-[#7fefc0] motion-reduce:transition-none dark:text-accent-strong dark:hover:text-[#7fefc0]"
                >
                  {phone}
                </a>
              )}
            </div>

            {/* Bouton-flèche (112×84 dans la maquette). */}
            <Link
              href={href ?? `/${lang}/contact`}
              aria-label={ariaLabel}
              className="relative inline-flex h-[clamp(68px,8vw,84px)] w-[clamp(92px,11vw,112px)] shrink-0 items-center justify-center rounded-[16px] bg-emeraude text-white transition-colors duration-300 ease-out hover:bg-[#7fefc0] hover:text-fond motion-reduce:transition-none dark:bg-accent-strong dark:text-fond dark:hover:bg-[#7fefc0]"
            >
              <ArrowRight className="w-10" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
