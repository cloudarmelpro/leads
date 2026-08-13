import { Eyebrow } from "@/components/shared/eyebrow";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { dict: Dictionary };

/**
 * Section équipe SANS visage ni nom : on n'invente personne. Panneau éditorial
 * clair (statement + note) cohérent avec le reste de la page ; l'accent émeraude
 * fait écho à l'épine du récit. Aucun visage ni nom tant que la vraie équipe
 * n'est pas fournie par le client.
 */
export function Team({ dict }: Props) {
  const t = dict.about.team;

  return (
    <section className="px-[clamp(16px,4vw,32px)] py-[clamp(48px,7vw,96px)]">
      <div
        data-reveal="up"
        data-reveal-dist="64px"
        className="relative mx-auto max-w-290 overflow-hidden rounded-4xl bg-surface px-[clamp(24px,4vw,64px)] py-[clamp(44px,6vw,88px)]"
      >
        {/* Halo émeraude décoratif dans le coin haut-droit (couleur signature). */}
        <span
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(23,126,79,.16),transparent_70%)] blur-2xl"
        />

        <div className="relative max-w-[46ch]">
          <p className="mb-6">
            <Eyebrow>{t.kicker}</Eyebrow>
          </p>

          <h2 className="font-display text-[clamp(26px,4vw,46px)] leading-[1.1] tracking-normal text-encre text-balance">
            {t.titleA} {t.titleB}
          </h2>

          <p className="mt-5 text-[clamp(15px,1.8vw,18px)] leading-[1.7] text-texte2 text-pretty">
            {t.note}
          </p>
        </div>
      </div>
    </section>
  );
}
