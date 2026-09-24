"use client";

import { getImageProps } from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";

import type { HeroScene } from "./scene";

type Still = { src: string; width: number; height: number };
type Props = {
  children: ReactNode;
  /**
   * Images fixes de secours, si l'appareil n'affiche pas le WebGL. Une par format d'écran :
   * une image très haute rognée sur un écran moins allongé coupait le logo.
   */
  fallback: { portrait: Still; tablet: Still; landscape: Still };
  mapIntensity?: number;
  /** Fraction de hauteur d'écran sur laquelle le hero se dissout en sortant. */
  exitLength?: number;
};

const INSET = 10;
// Bas de l'en-tête fixe (78px) mesuré depuis le haut du panneau, décollé de 10px.
const HEADER_BOTTOM = 78 - INSET;

/**
 * Scène du hero (maquette `talgasy-hero3d`, mode `data-static`) : un panneau de
 * `100vh - 20px`, décollé de 10px des bords, rayon 24px, qui défile normalement. La
 * progression de sortie `--exit` (0 → 1 sur `exitLength` écran) pilote la dissolution
 * du logo et le fondu du texte. La scène 3D tourne à toutes les largeurs, téléphone compris
 * (demande du client : même rendu qu'à l'ordinateur) ; sous `prefers-reduced-motion`, elle
 * s'affiche figée. Si le WebGL échoue, une image fixe prend le relais.
 */
// Seuils de format (largeur / hauteur de l'écran) : téléphone en portrait sous 0,62,
// tablette jusqu'à 1,2, paysage au-delà.
const TABLET = "(min-aspect-ratio: 31/50)";
const LANDSCAPE = "(min-aspect-ratio: 6/5)";

export function HeroStage({ children, fallback, mapIntensity = 2, exitLength = 0.85 }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const canvasHost = useRef<HTMLDivElement>(null);
  const still = useRef<HTMLSpanElement>(null);
  const [mode, setMode] = useState<"pending" | "webgl" | "still">("pending");

  // Une seule image téléchargée : celle du format courant (<picture> + getImageProps).
  const common = { alt: "", sizes: "100vw", loading: "eager", fetchPriority: "high" } as const;
  const landscape = getImageProps({ ...common, ...fallback.landscape }).props.srcSet;
  const tablet = getImageProps({ ...common, ...fallback.tablet }).props.srcSet;
  const { srcSet: portraitSet, ...portrait } = getImageProps({ ...common, ...fallback.portrait }).props;

  // Le WebGL ne démarre que côté client ; l'image fixe n'est qu'un secours (voir `.catch`).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMode("webgl");
  }, []);

  useEffect(() => {
    const el = root.current;
    const area = panel.current;
    if (!el || !area || mode === "pending") return;

    const progress = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      return Math.min(1, Math.max(0, -r.top / (vh * exitLength)));
    };

    if (mode === "still") {
      const img = still.current;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let px = 0;
      let py = 0;
      let tx = 0;
      let ty = 0;
      let ex = 0;
      let raf = 0;
      const t0 = performance.now();
      const tick = () => {
        raf = requestAnimationFrame(tick);
        if (reduce || !img) return;
        px += (tx - px) * 0.06;
        py += (ty - py) * 0.06;
        const t = (performance.now() - t0) / 1000;
        const k = Math.min(1, t / 1.6);
        const ease = 1 - Math.pow(1 - k, 3);
        // entrée : grand -> taille de croisière
        const s = 1.012 + 0.008 * Math.sin(t * 0.3) + 0.05 * (1 - ease);
        img.style.transform = `translate(${px * 7}px,${py * 5 + ex * 22}px) scale(${s.toFixed(4)})`;
      };
      const onMove = (e: PointerEvent) => {
        const r = area.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      };
      const onLeave = () => {
        tx = 0;
        ty = 0;
      };
      const onScroll = () => {
        ex = progress();
        el.style.setProperty("--exit", ex.toFixed(4));
      };
      area.addEventListener("pointermove", onMove);
      area.addEventListener("pointerleave", onLeave);
      window.addEventListener("scroll", onScroll, { passive: true });
      raf = requestAnimationFrame(tick);
      onScroll();
      return () => {
        cancelAnimationFrame(raf);
        area.removeEventListener("pointermove", onMove);
        area.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("scroll", onScroll);
      };
    }

    const host = canvasHost.current;
    if (!host) return;
    let alive = true;
    let hero: HeroScene | null = null;
    let io: IntersectionObserver | null = null;
    let anchorRo: ResizeObserver | null = null;
    const onScroll = () => {
      const p = progress();
      hero?.setExit(p);
      el.style.setProperty("--exit", p.toFixed(4));
    };
    import("./scene")
      .then(({ createHeroScene }) => {
        if (!alive) return;
        const scene = createHeroScene(host, area, { skipIntro: false, mapIntensity, logoScale: null });
        hero = scene;
        // Sur une colonne (< 860px), logo centré entre l'en-tête et le haut du texte
        // (`data-hero-text`), quelle que soit la taille de l'écran.
        const anchor = () => {
          const text = area.querySelector("[data-hero-text]");
          const box = area.getBoundingClientRect();
          if (!text || box.width >= 860 || box.height === 0) return scene.setLogoAnchor(null);
          const top = text.getBoundingClientRect().top - box.top;
          scene.setLogoAnchor((HEADER_BOTTOM + top) / 2 / box.height);
        };
        anchor();
        anchorRo = new ResizeObserver(anchor);
        anchorRo.observe(area);
        // Le haut du texte bouge aussi quand sa hauteur change (police chargée, retours à la ligne).
        const text = area.querySelector("[data-hero-text]");
        if (text) anchorRo.observe(text);
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        onScroll();
        io = new IntersectionObserver((entries) => hero?.setActive(entries[0]?.isIntersecting ?? true));
        io.observe(el);
      })
      .catch(() => {
        // WebGL indisponible : image fixe à la place de la scène
        if (alive) setMode("still");
      });
    return () => {
      alive = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      io?.disconnect();
      anchorRo?.disconnect();
      hero?.dispose();
    };
  }, [mode, mapIntensity, exitLength]);

  return (
    // Au moins un écran de haut, davantage si le contenu l'exige (téléphone à l'horizontale :
    // 360px ne suffisent pas, le texte débordait du panneau).
    <div ref={root} className="relative block min-h-[100vh] w-full [--exit:0]" style={{ padding: `${INSET}px ${INSET}px` }}>
      <div
        ref={panel}
        className="relative z-0 flex flex-col overflow-hidden rounded-[24px] bg-[#021b26] [touch-action:pan-y]"
        style={{ minHeight: `calc(100vh - ${INSET * 2}px)` }}
      >
        <div ref={canvasHost} aria-hidden className="absolute inset-[0px]">
          {mode === "still" && (
            <span ref={still} className="absolute top-[-4%] left-[-4%] block h-[108%] w-[108%] origin-[50%_45%] will-change-transform">
              <picture>
                <source media={LANDSCAPE} srcSet={landscape} />
                <source media={TABLET} srcSet={tablet} />
                <img {...portrait} srcSet={portraitSet} alt="" className="absolute inset-[0px] h-full w-full object-cover object-[center_25%]" />
              </picture>
            </span>
          )}
        </div>
        <div className="pointer-events-none relative z-[1] flex flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}
