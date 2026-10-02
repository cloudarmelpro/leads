"use client";

import { getImageProps } from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { useTheme } from "@/lib/use-theme";

import { whenWelcomeDone } from "../welcome-splash";

import type { HeroScene } from "./scene";

type Still = { src: string; width: number; height: number };
type StillSet = { portrait: Still; tablet: Still; landscape: Still };
type Props = {
  children: ReactNode;
  /**
   * Images fixes de secours, si l'appareil n'affiche pas le WebGL (ou seulement en logiciel).
   * Un jeu par thème ; dans chaque jeu, une image par format d'écran : une image très haute
   * rognée sur un écran moins allongé coupait le logo.
   */
  fallback: { dark: StillSet; light: StillSet };
  mapIntensity?: number;
  /** Fraction de hauteur d'écran sur laquelle le hero se dissout en sortant. */
  exitLength?: number;
};

// Bas de l'en-tête fixe (80px), mesuré depuis le haut du panneau.
const HEADER_BOTTOM = 80;

/**
 * Vrai si le navigateur rend le WebGL avec le processeur graphique. Avec
 * `failIfMajorPerformanceCaveat`, il refuse le contexte quand il devrait rendre en logiciel
 * (accélération désactivée, machine virtuelle, robots d'audit) : la scène y tournerait à
 * quelques images par seconde en bloquant la page. L'image fixe est alors le meilleur rendu.
 */
function hasHardwareWebGl(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const options: WebGLContextAttributes = { failIfMajorPerformanceCaveat: true };
    const gl: WebGLRenderingContext | null = canvas.getContext("webgl2", options) ?? canvas.getContext("webgl", options);
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/**
 * Appelle `fn` une fois la page chargée et le fil principal libre (au plus 1,5 s après le
 * chargement). three.js et la construction de la scène (textures, shaders) ne retardent ainsi
 * ni l'hydratation ni l'affichage du texte du hero. Renvoie l'annulation.
 */
function afterLoadIdle(fn: () => void): () => void {
  let idle = 0;
  let timer = 0;
  const schedule = () => {
    if (typeof window.requestIdleCallback === "function") idle = window.requestIdleCallback(fn, { timeout: 1500 });
    else timer = window.setTimeout(fn, 200);
  };
  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });
  return () => {
    window.removeEventListener("load", schedule);
    if (idle) window.cancelIdleCallback(idle);
    window.clearTimeout(timer);
  };
}

/**
 * Scène du hero (maquette `talgasy-hero3d`, mode `data-static`, sans marge ni rayon) :
 * un panneau d'un écran de haut, bord à bord, qui défile normalement. La
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
  // Scène en cours et thème courant : la scène suit le thème (mode clair du hero, 2026-09-30).
  const sceneRef = useRef<HeroScene | null>(null);
  const { isDark } = useTheme();
  const darkRef = useRef(isDark);
  useEffect(() => {
    darkRef.current = isDark;
    sceneRef.current?.setTheme(isDark);
  }, [isDark]);

  // Une seule image téléchargée : celle du thème et du format courants (<picture> + getImageProps).
  const stills = isDark ? fallback.dark : fallback.light;
  const common = { alt: "", sizes: "100vw", loading: "eager", fetchPriority: "high" } as const;
  const landscape = getImageProps({ ...common, ...stills.landscape }).props.srcSet;
  const tablet = getImageProps({ ...common, ...stills.tablet }).props.srcSet;
  const { srcSet: portraitSet, ...portrait } = getImageProps({ ...common, ...stills.portrait }).props;

  // Le WebGL ne démarre que côté client, et seulement s'il est accéléré ; sinon l'image fixe.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMode(hasHardwareWebGl() ? "webgl" : "still");
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
    const start = () => import("./scene")
      .then(({ createHeroScene }) => (alive ? createHeroScene(host, area, { skipIntro: false, mapIntensity, logoScale: null, alive: () => alive }) : null))
      .then((scene) => {
        if (!scene) return;
        if (!alive) return scene.dispose();
        hero = scene;
        sceneRef.current = scene;
        scene.setTheme(darkRef.current);
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
    // Après l'écran de bienvenue s'il joue (sa construction saccaderait les particules).
    let cancelIdle = () => {};
    const cancelWelcome = whenWelcomeDone(() => {
      cancelIdle = afterLoadIdle(() => {
        if (alive) start();
      });
    });
    const cancelStart = () => {
      cancelWelcome();
      cancelIdle();
    };
    return () => {
      alive = false;
      cancelStart();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      io?.disconnect();
      anchorRo?.disconnect();
      hero?.dispose();
      sceneRef.current = null;
    };
  }, [mode, mapIntensity, exitLength]);

  return (
    // Au moins un écran de haut, davantage si le contenu l'exige (téléphone à l'horizontale :
    // 360px ne suffisent pas, le texte débordait du panneau).
    <div ref={root} className="relative block min-h-[100vh] w-full [--exit:0]">
      <div ref={panel} className="relative z-0 flex min-h-[100vh] flex-col overflow-hidden bg-[#eef1f3] [touch-action:pan-y] dark:bg-[#011823]">
        <div ref={canvasHost} aria-hidden className="absolute inset-[0px]">
          {mode === "still" && (
            <span ref={still} className="absolute top-[-4%] left-[-4%] block h-[108%] w-[108%] origin-[50%_45%] will-change-transform">
              <picture>
                <source media={LANDSCAPE} srcSet={landscape} sizes="100vw" />
                <source media={TABLET} srcSet={tablet} sizes="100vw" />
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
