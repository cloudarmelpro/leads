import Image from "next/image";
import Link from "next/link";

import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Item = Dictionary["services"]["items"][number];
type Props = { lang: Locale; items: Item[] };

// Huit cartes de la maquette : le visuel (public/images/home/services) et le service dont
// elle reprend le texte (`items`). Deux visuels (commerce en ligne, application web)
// illustrent une seconde fois le développement web et la plateforme SaaS.
// `cat` : catégorie de la page Services ouverte par le lien du prix (`?categorie=`).
const CARDS: { image: string; item: number; cat: string }[] = [
  { image: "site-web", item: 0, cat: "web" },
  { image: "app-mobile", item: 1, cat: "mobile" },
  { image: "saas", item: 2, cat: "saas" },
  { image: "integration", item: 3, cat: "integ" },
  { image: "logo", item: 4, cat: "logo" },
  { image: "hebergement", item: 5, cat: "host" },
  { image: "ecommerce", item: 0, cat: "web" },
  { image: "app-web", item: 2, cat: "saas" },
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
 * le nom, une phrase et le prix de départ vers la page Services. Pause au survol, arrêt sous
 * `prefers-reduced-motion`. La copie de bouclage est `aria-hidden` et non focusable.
 */
export function ServicesShowcase({ lang, items }: Props) {
  const card = (index: number, clone: boolean) => {
    const spec = CARDS[index];
    const item = spec ? items[spec.item] : undefined;
    if (!spec || !item) return null;

    return (
      <article key={`${index}-${clone ? "b" : "a"}`} className="relative flex min-h-[0px] flex-1 flex-col overflow-hidden rounded-[20px] bg-carte">
        {/* Visuels détourés (fond transparent, comme les illustrations du design précédent) posés
            sur le fond de la carte, entiers, avec la même marge que le texte — demande du client
            du 2026-09-30 : plus de photo pleine carte fondue vers le bas. */}
        <div className="relative min-h-[0px] min-w-[0px] flex-1 overflow-hidden px-[clamp(18px,1.8vw,26px)] pt-[clamp(18px,1.8vw,26px)]">
          <span className="relative block h-full w-full">
            <Image src={`/images/home/services/${spec.image}.webp`} alt="" fill sizes="(max-width: 1100px) 50vw, 560px" className="object-contain object-center" />
          </span>
        </div>
        <div className="relative flex min-w-[0px] shrink-0 flex-col gap-[5px] px-[clamp(18px,1.8vw,26px)] pt-[13px] pb-[clamp(16px,1.6vw,20px)]">
          <h3 className="m-[0px] max-w-full text-[clamp(15px,1.2vw,18px)] leading-[1.3] font-medium text-encre text-pretty">{item.name}</h3>
          <p className="m-[0px] line-clamp-2 max-w-full text-[clamp(12.5px,0.95vw,14px)] leading-[1.5] font-normal text-texte2 text-pretty">{item.desc}</p>
          <Link
            href={`/${lang}/services?categorie=${spec.cat}`}
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
    // Hauteur entre celle d'avant (380–560px) et celle de la maquette v3 (520–760px, jugée trop
    // grande par le client le 2026-09-30 ; « un peu plus long » que l'ancienne).
    <div className="group grid h-[clamp(440px,46vw,640px)] min-w-[0px] grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-[14px]">
      {track("left")}
      {track("right")}
    </div>
  );
}
