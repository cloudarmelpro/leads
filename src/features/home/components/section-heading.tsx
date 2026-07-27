type Props = {
  kicker: string;
  titleA: string;
  titleB: string;
  intro?: string;
  introMaxCh?: string;
};

/** Titre de section : pastille + titre sur deux lignes (Cal Sans). */
export function SectionHeading({ kicker, titleA, titleB, intro, introMaxCh = "56ch" }: Props) {
  return (
    <div className="mb-11 text-center">
      <p data-reveal="up" className="mb-4">
        <span className="rounded-full bg-white px-3.75 py-1.75 text-[13px] font-semibold text-texte2">
          {kicker}
        </span>
      </p>
      <h2
        data-reveal="up"
        data-reveal-delay="80"
        className="font-display text-[clamp(23px,4.8vw,46px)] leading-[1.15] tracking-normal"
      >
        {titleA}
        <br />
        {titleB}
      </h2>
      {intro && (
        <p
          data-reveal="left"
          data-reveal-delay="160"
          className="mx-auto mt-4 text-base leading-[1.6] text-texte2 text-pretty"
          style={{ maxWidth: introMaxCh }}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
