"use client";

import { Fragment, useEffect, useId, useRef, useState } from "react";

import { Reveal } from "@/components/shared/reveal";
import { gsap, reducedMotion, ScrollTrigger } from "@/lib/motion/gsap";

type Item = { title: string; body: string };
type Props = { quote: string; items: Item[] };

// Pictogrammes des trois volets (maquette) : immeuble, globe, trophée.
const ICONS = [
  <Fragment key="immeuble">
    <rect width="16" height="20" x="4" y="2" rx="2" />
    <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" />
  </Fragment>,
  <Fragment key="globe">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20" />
  </Fragment>,
  <path
    key="trophee"
    d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z"
  />,
];
// Progression (0 → 1) de la section épinglée à laquelle chaque volet apparaît.
const SEUILS = [0.1, 0.4, 0.66];
const CARD_TRANSITION =
  "opacity 1000ms cubic-bezier(0.22,1,0.36,1), transform 1100ms cubic-bezier(0.22,1,0.36,1), filter 1000ms cubic-bezier(0.22,1,0.36,1), background 800ms cubic-bezier(0.65,0,0.35,1)";
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
// Espacement voulu avant et après le bloc épinglé (rythme de l'accueil).
const GAP = "clamp(48px, 6vw, 96px)";

/**
 * Notre histoire (maquette À propos) : dès 860px, la section fait 260vh et son contenu
 * reste collé un écran de haut pendant qu'on défile — la citation s'allume mot à mot,
 * puis les trois volets montent l'un après l'autre (à 10, 40 et 66 % du défilement) et
 * s'ouvrent à leur tour ; un clic ouvre un volet à tout moment. Le bloc bascule en 3D à
 * l'entrée et s'estompe en sortant. Sous 860px ou avec moins d'animations : rien n'est
 * épinglé, les mots s'allument à l'approche et les volets sont tous visibles.
 * La section porte des marges négatives (voir `GAP`) : sans elles, le centrage dans un
 * écran entier laisserait un grand vide avant et après le bloc.
 */
export function StoryPin({ quote, items }: Props) {
  const [story, setStory] = useState(0);
  const [pinned, setPinned] = useState(false);
  const section = useRef<HTMLElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const mark = useRef<SVGSVGElement>(null);
  const pinIdx = useRef(-1);
  const baseId = useId();

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 860px)");
    const update = () => setPinned(mq.matches && !reducedMotion());
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const reduce = reducedMotion();
    const words = Array.from(el.querySelectorAll<HTMLElement>("[data-word]"));
    const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-sitem]"));
    const lit = el.querySelector<HTMLElement>("[data-lit]");
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const vh = window.innerHeight || 800;
      const r = el.getBoundingClientRect();
      const p = pinned ? clamp01(-r.top / Math.max(1, r.height - vh)) : 1;

      let lp: number;
      if (pinned) lp = clamp01((p + 0.06) / 0.4);
      else if (reduce || !lit) lp = 1;
      else lp = clamp01((vh * 0.9 - lit.getBoundingClientRect().top) / (vh * 0.65));
      const glow = lp * (words.length + 2);
      words.forEach((w, i) => {
        w.style.opacity = Math.min(1, Math.max(0.2, glow - i)).toFixed(3);
      });

      cards.forEach((card, i) => {
        const on = !pinned || p >= (SEUILS[i] ?? 0);
        card.style.opacity = on ? "1" : "0";
        card.style.transform = on ? "none" : "translateY(56px) scale(0.97)";
        card.style.filter = on ? "none" : "blur(8px)";
        card.style.pointerEvents = on ? "" : "none";
      });

      if (pinned) {
        const idx = p >= 0.66 ? 2 : p >= 0.4 ? 1 : 0;
        if (idx !== pinIdx.current) {
          pinIdx.current = idx;
          setStory(idx);
        }
      }
    };
    raf = requestAnimationFrame(tick);

    // Entrée en 3D et sortie en fondu (maquette `fx`), calées sur le défilement.
    const ctx = gsap.context(() => {
      if (reduce || !inner.current) return;
      const trig = pinned ? el : inner.current;
      const enter = pinned ? ["top bottom", "top top"] : ["top bottom", "center 55%"];
      const exit = pinned ? ["bottom bottom", "bottom top"] : ["center 40%", "bottom top"];
      gsap.fromTo(
        inner.current,
        { rotationX: 10, y: 40, opacity: 0.75, transformPerspective: 1200, transformOrigin: "50% 100%" },
        { rotationX: 0, y: 0, opacity: 1, ease: "none", immediateRender: true, scrollTrigger: { trigger: trig, start: enter[0], end: enter[1], scrub: 0.5 } },
      );
      gsap.fromTo(
        inner.current,
        { rotationX: 0, y: 0, opacity: 1 },
        { y: -90, opacity: 0.35, filter: "blur(6px)", ease: "none", immediateRender: false, scrollTrigger: { trigger: trig, start: exit[0], end: exit[1], scrub: 0.5 } },
      );
      if (mark.current) {
        gsap.fromTo(mark.current, { rotate: -12 }, { rotate: 0, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top top", scrub: true } });
      }
    });
    // Épinglé, le contenu est centré dans un écran entier : le vide au-dessus et au-dessous
    // (P) apparaîtrait aussi avant et après l'épinglage. On remonte la section de P moins
    // l'espacement voulu (GAP, celui de l'accueil), et pareil en bas.
    let ro: ResizeObserver | null = null;
    if (pinned && inner.current && grid.current) {
      const box = inner.current;
      const content = grid.current;
      const place = () => {
        const p = Math.max(0, (box.clientHeight - content.offsetHeight) / 2);
        el.style.marginTop = `calc(${GAP} - ${p}px)`;
        el.style.marginBottom = `calc(${GAP} - ${p}px)`;
        ScrollTrigger.refresh();
      };
      ro = new ResizeObserver(place);
      ro.observe(box);
      ro.observe(content);
    } else {
      el.style.marginTop = "";
      el.style.marginBottom = "";
    }
    // La hauteur épinglée (260vh) déplace tout ce qui suit : les déclencheurs se recalculent.
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 600);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(refresh);
      ro?.disconnect();
      ctx.revert();
    };
  }, [pinned]);

  return (
    <section ref={section} id="histoire" className="relative" style={{ height: pinned ? "260vh" : "auto" }}>
      <div
        ref={inner}
        className={`flex items-center justify-center px-[clamp(16px,4vw,56px)] ${
          pinned ? "sticky top-[0px] h-[100vh]" : "relative py-[clamp(32px,4vw,56px)]"
        }`}
      >
        <div ref={grid} className="grid w-full max-w-[1400px] grid-cols-[minmax(0,1fr)] items-center gap-[clamp(40px,6vw,96px)] min-[860px]:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          <div data-lit className="flex flex-col gap-[clamp(18px,2vw,28px)]">
            <Reveal kind="scale" as="span" className="block">
              <svg ref={mark} viewBox="0 0 80 64" aria-hidden className="block h-auto w-[clamp(56px,6vw,84px)] [filter:drop-shadow(0_0_24px_rgba(48,217,140,0.35))]">
                <path d="M4 64V38C4 18 12 6 34 0l4 10C26 15 21 22 20 32h16v32H4Zm42 0V38c0-20 8-32 30-38l4 10c-12 5-17 12-18 22h16v32H46Z" fill="#30D98C" />
              </svg>
            </Reveal>
            <p className="m-[0px] text-[clamp(22px,2.2vw,30px)] leading-[1.32] font-normal tracking-[-0.2px] text-encre text-pretty">
              {quote.split(" ").map((word, i) => (
                <span key={i}>
                  <span data-word className="opacity-20 transition-opacity duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)]">
                    {word}
                  </span>{" "}
                </span>
              ))}
            </p>
          </div>

          <div className="flex flex-col gap-[14px]">
            {items.map((item, i) => {
              const open = story === i;
              const panelId = `${baseId}-${i}`;
              return (
                <div
                  key={item.title}
                  data-sitem={i}
                  style={{ transition: CARD_TRANSITION }}
                  className={`relative flex flex-col overflow-hidden rounded-[16px] px-[clamp(20px,2.4vw,32px)] py-[clamp(20px,2vw,28px)] ${
                    open
                      ? "bg-[linear-gradient(135deg,rgba(23,126,79,0.08),var(--color-surface)_60%)] dark:bg-[linear-gradient(135deg,rgba(48,217,140,0.07),#011B28_60%)]"
                      : "bg-surface-2 dark:bg-[#011E2B]"
                  }`}
                >
                  <h3 className="m-[0px]">
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => setStory(i)}
                      className="flex w-full cursor-pointer items-center gap-[14px] text-left"
                    >
                      <span className="flex text-vert">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0">
                          {ICONS[i]}
                        </svg>
                      </span>
                      <span className="text-[15px] leading-[26px] font-medium text-encre">{item.title}</span>
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-hidden={!open}
                    className="grid transition-[grid-template-rows] duration-[1100ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
                    style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
                  >
                    <div className="min-h-[0px] overflow-hidden">
                      <p className="m-[0px] pt-[12px] pl-[34px] text-[15px] leading-[26px] font-normal text-texte2 text-pretty">{item.body}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
