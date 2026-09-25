import Image from "next/image";

import { LineReveal } from "@/components/shared/line-reveal";
import { HeroBand } from "@/features/about/components/hero-band";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { dict: Pick<Dictionary, "about"> };

/**
 * Hero À propos (maquette Claude Design, 2026-09-25) : panneau arrondi décollé de 10px,
 * photo en lent zoom (Ken Burns, 22 s) sous une trame claire en surimpression, voiles
 * sombres et bande floutée en bas ; titre et texte d'appui centrés (révélation ligne par
 * ligne, comme l'accueil),
 * puis le bandeau défilant. Toujours sombre, comme le hero de l'accueil (écrin) : les
 * couleurs sont littérales et l'en-tête passe en sombre au-dessus (`data-header-sombre`).
 */
export function AboutHero({ dict }: Props) {
  const t = dict.about.hero;

  return (
    <section id="top" data-header-sombre className="relative z-[2] block px-[10px] pt-[10px]">
      <div className="relative flex min-h-[min(72svh,720px)] flex-col justify-center overflow-hidden rounded-[24px] bg-[#011B28]">
        <span aria-hidden className="absolute inset-[0px] block [animation:tw-kb_22s_ease-in-out_infinite_alternate] [filter:saturate(0.85)_contrast(1.05)] motion-reduce:[animation:none]">
          <Image src="/images/about/hero.jpg" alt="" fill sizes="100vw" loading="eager" fetchPriority="high" className="object-cover" />
        </span>
        <Image src="/images/about/hero-trame.jpg" alt="" aria-hidden fill sizes="100vw" className="pointer-events-none object-cover object-right-top opacity-50 mix-blend-screen select-none" />
        <span aria-hidden className="pointer-events-none absolute inset-[0px] bg-[linear-gradient(180deg,rgba(1,24,35,0.70)_0%,rgba(1,24,35,0.45)_45%,rgba(1,24,35,0.88)_100%)]" />
        <span aria-hidden className="pointer-events-none absolute inset-x-[0px] bottom-[0px] h-[260px] backdrop-blur-[28px] [mask-image:linear-gradient(180deg,transparent_0%,#000_60%)]" />
        <span aria-hidden className="pointer-events-none absolute inset-x-[0px] bottom-[0px] h-[260px] bg-[linear-gradient(180deg,rgba(1,24,35,0)_0%,rgba(1,24,35,0.6)_50%,#011823_100%)]" />

        <div className="relative flex justify-center px-[clamp(18px,5vw,72px)] pt-[calc(68px+clamp(28px,5vw,72px))] pb-[calc(80px+clamp(56px,8vh,96px))]">
          <div className="flex w-full max-w-[1400px] flex-col items-center gap-[22px] text-center">
            <LineReveal as="h1" className="m-[0px] text-center text-[clamp(24px,17.79px+1.66vw,36px)] leading-[1.08] font-semibold tracking-[-1px] text-white uppercase min-[620px]:tracking-[-2px]">
              {t.title}
            </LineReveal>
            <LineReveal delay={0.3} className="m-[0px] max-w-[620px] text-[clamp(15px,13.45px+0.41vw,18px)] leading-[1.34] font-normal text-[#E4ECEF] text-pretty">
              {t.lede}
            </LineReveal>
          </div>
        </div>

        <HeroBand items={t.band} label={t.bandAria} />
      </div>
    </section>
  );
}
