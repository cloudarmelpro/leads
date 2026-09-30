import Image from "next/image";
import Link from "next/link";

import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Item = Dictionary["services"]["items"][number];
type Props = { lang: Locale; items: Item[] };

// Huit cartes de la maquette : le visuel (public/images/home/services) et le service dont
// elle reprend le texte (`items`). Deux visuels (commerce en ligne, application web)
// illustrent une seconde fois le développement web et la plateforme SaaS.
const CARDS: { image: string; item: number }[] = [
  { image: "site-web", item: 0 },
  { image: "app-mobile", item: 1 },
  { image: "saas", item: 2 },
  { image: "integration", item: 3 },
  { image: "logo", item: 4 },
  { image: "hebergement", item: 5 },
  { image: "ecommerce", item: 0 },
  { image: "app-web", item: 2 },
];
// Tableaux de chaque colonne : une carte haute ou deux empilées. `tw-vitrine` (globals.css)
// est écrite pour exactement trois tableaux.
const LEFT: number[][] = [[0], [1, 2], [3]];
const RIGHT: number[][] = [[4, 5], [6], [7]];

const TRACK_ANIM = {
  left: "flex [animation:tw-vitrine_11.4s_cubic-bezier(0.33,0,0.2,1)_0.32s_infinite]",
  right: "flex flex-col [animation:tw-vitrine-y_11.4s_cubic-bezier(0.33,0,0.2,1)_0s_infinite]",
};

/**
 * Vitrine des services (maquette Accueil, 2026-09-30) : deux colonnes, chacune une piste de
 * trois tableaux plus une copie du premier pour boucler sans saut. À gauche les cartes
 * arrivent de la droite, à droite elles montent. Chaque carte : un visuel fondu vers le bas,
 * le nom, une phrase et le prix de départ vers la section Prix. Pause au survol, arrêt sous
 * `prefers-reduced-motion`. La copie de bouclage est `aria-hidden` et non focusable.
 */
export function ServicesShowcase({ lang, items }: Props) {
  const card = (index: number, clone: boolean) => {
    const spec = CARDS[index];
    const item = spec ? items[spec.item] : undefined;
    if (!spec || !item) return null;

    return (
      <article key={`${index}-${clone ? "b" : "a"}`} className="relative flex min-h-[0px] flex-1 flex-col overflow-hidden rounded-[20px] bg-carte">
        <div className="relative min-h-[0px] min-w-[0px] flex-1 overflow-hidden [mask-image:linear-gradient(180deg,#000_70%,transparent_100%)]">
          <Image src={`/images/home/services/${spec.image}.jpg`} alt="" fill sizes="(max-width: 1100px) 50vw, 560px" className="object-cover dark:mix-blend-lighten" />
        </div>
        <div className="relative flex min-w-[0px] shrink-0 flex-col gap-[5px] px-[clamp(18px,1.8vw,26px)] pt-[13px] pb-[clamp(16px,1.6vw,20px)]">
          <h3 className="m-[0px] max-w-full text-[clamp(15px,1.2vw,18px)] leading-[1.3] font-medium text-encre text-pretty">{item.name}</h3>
          <p className="m-[0px] line-clamp-2 max-w-full text-[clamp(12.5px,0.95vw,14px)] leading-[1.5] font-normal text-texte2 text-pretty">{item.desc}</p>
          <Link
            href={`/${lang}#prix`}
            aria-label={`${item.price} — ${item.name}`}
            tabIndex={clone ? -1 : undefined}
            className="tap-44 inline-flex min-h-[26px] w-fit items-center text-[clamp(12.5px,0.95vw,14px)] leading-[20px] font-normal text-vert no-underline transition-colors hover:text-vert-clair"
          >
            {item.price}
          </Link>
        </div>
      </article>
    );
  };

  const track = (side: "left" | "right") => {
    const scenes = side === "left" ? LEFT : RIGHT;
    const slides = [...scenes, scenes[0]];
    return (
      <div className="relative h-full overflow-hidden [clip-path:inset(0_round_20px)]">
        <div className={`h-full w-full gap-[14px] group-hover:[animation-play-state:paused] motion-reduce:[animation:none] ${TRACK_ANIM[side]}`}>
          {slides.map((column, s) => {
            const clone = s === scenes.length;
            return (
              <div key={`${side}-${s}`} aria-hidden={clone || undefined} className="flex h-full w-full shrink-0 flex-col gap-[14px]">
                {column.map((index) => card(index, clone))}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="group grid h-[clamp(520px,54vw,760px)] min-w-[0px] grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-[14px]">
      {track("left")}
      {track("right")}
    </div>
  );
}
