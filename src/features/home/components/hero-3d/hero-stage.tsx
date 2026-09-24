"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";

import type { HeroScene } from "./scene";

type Props = {
  children: ReactNode;
  /** Image fixe affichée à la place du WebGL (mobile, mouvement réduit). */
  fallbackSrc: string;
  mapIntensity?: number;
  /** Fraction de hauteur d'écran sur laquelle le hero se dissout en sortant. */
  exitLength?: number;
};

const INSET = 10;

/**
 * Scène du hero (maquette `talgasy-hero3d`, mode `data-static`) : un panneau de
 * `100vh - 20px`, décollé de 10px des bords, rayon 24px, qui défile normalement. La
 * progression de sortie `--exit` (0 → 1 sur `exitLength` écran) pilote la dissolution
 * du logo et le fondu du texte. Sous 768px ou avec `prefers-reduced-motion`, une image
 * fixe remplace le WebGL, avec une respiration lente et une parallaxe douce.
 */
export function HeroStage({ children, fallbackSrc, mapIntensity = 2, exitLength = 0.85 }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const canvasHost = useRef<HTMLDivElement>(null);
  const still = useRef<HTMLSpanElement>(null);
  const [mode, setMode] = useState<"pending" | "webgl" | "still">("pending");

  // Choix du rendu au montage : la largeur et la préférence de mouvement n'existent pas côté serveur.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMode(window.innerWidth < 768 || reduce ? "still" : "webgl");
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
    const onScroll = () => {
      const p = progress();
      hero?.setExit(p);
      el.style.setProperty("--exit", p.toFixed(4));
    };
    import("./scene")
      .then(({ createHeroScene }) => {
        if (!alive) return;
        hero = createHeroScene(host, area, { skipIntro: false, mapIntensity, logoScale: null });
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        onScroll();
        io = new IntersectionObserver((entries) => hero?.setActive(entries[0]?.isIntersecting ?? true));
        io.observe(el);
      })
      .catch(() => {
        // WebGL indisponible : le panneau garde son fond, le texte reste lisible
      });
    return () => {
      alive = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      io?.disconnect();
      hero?.dispose();
    };
  }, [mode, mapIntensity, exitLength]);

  return (
    <div ref={root} className="relative block h-[100vh] w-full [--exit:0]">
      <div
        ref={panel}
        className="relative z-0 overflow-hidden rounded-[24px] bg-[#021b26] [touch-action:pan-y]"
        style={{ top: INSET, height: `calc(100vh - ${INSET * 2}px)`, margin: `0 ${INSET}px` }}
      >
        <div ref={canvasHost} aria-hidden className="absolute inset-[0px]">
          {mode === "still" && (
            <span ref={still} className="absolute top-[-4%] left-[-4%] block h-[108%] w-[108%] origin-[50%_45%] will-change-transform">
              <Image src={fallbackSrc} alt="" fill priority sizes="100vw" className="object-cover object-[center_40%]" />
            </span>
          )}
        </div>
        <div className="pointer-events-none relative z-[1] h-full">{children}</div>
      </div>
    </div>
  );
}
