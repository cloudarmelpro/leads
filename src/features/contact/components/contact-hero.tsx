import type { Dictionary } from "@/lib/i18n/dictionaries";
import { previewBg } from "@/lib/preview-image";

type Props = { dict: Dictionary };

/** Hero image arrondi avec le mot « Contact » en grand — calqué sur `AboutHero`. */
export function ContactHero({ dict }: Props) {
  const t = dict.contactPage;

  return (
    <section className="px-[clamp(16px,4vw,32px)] pt-[clamp(16px,3vw,32px)] pb-[clamp(40px,6vw,72px)]">
      <div
        style={previewBg("contact-hero", 1200, 700)}
        className="relative mx-auto flex min-h-[clamp(280px,40vw,460px)] max-w-[1160px] items-center justify-center overflow-hidden rounded-[28px] bg-ink"
      >
        {/* Voile sombre : garantit la lisibilité du titre quelle que soit l'image. */}
        <div aria-hidden className="absolute inset-0 bg-ink/65" />

        <h1
          data-reveal="up"
          className="relative px-4 text-center font-display text-[clamp(44px,9vw,104px)] leading-none tracking-normal text-white"
        >
          {t.heroTitle}
        </h1>

        <span className="absolute bottom-4 left-4 rounded-md bg-ink/60 px-2.5 py-1 font-mono text-[11px] text-white/70">
          {t.heroImgLabel}
        </span>
      </div>
    </section>
  );
}
