import { CONTENEUR } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { dict: Dictionary };

/**
 * Équipe SANS visage ni nom : on n'invente personne. Tant que la vraie équipe n'est
 * pas fournie par le client, la section se limite à l'en-tête (titre + note).
 */
export function Team({ dict }: Props) {
  const t = dict.about.team;

  return (
    <section className="pb-[clamp(80px,14vw,200px)]">
      <div className={CONTENEUR}>
        <SectionHeader kicker={t.kicker} title={`${t.titleA} ${t.titleB}`} intro={t.note} />
      </div>
    </section>
  );
}
