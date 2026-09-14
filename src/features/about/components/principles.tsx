import { AboutSection } from "@/features/about/components/about-section";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Props = { dict: Dictionary };

/** « Principes » : axe inversé — photo à gauche, cartes à droite. */
export function Principles({ dict }: Props) {
  const t = dict.about.principles;

  return (
    <AboutSection
      id="principes"
      kicker={t.kicker}
      title={t.title}
      intro={t.intro}
      introMax={420}
      items={t.items}
      photo="/images/about/about-principes.jpg"
      photoAlt={t.photoAlt}
      photoFirst
    />
  );
}
