import { AboutSection } from "@/features/about/components/about-section";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { dict: Dictionary };

/** « Notre histoire » : cartes à gauche, photo à droite. */
export function Story({ dict }: Props) {
  const t = dict.about.story;

  return (
    <AboutSection
      id="histoire"
      kicker={t.kicker}
      title={t.title}
      intro={t.intro}
      introMax={460}
      items={t.items}
      photo="/images/about/about-histoire.jpg"
      photoAlt={t.photoAlt}
    />
  );
}
