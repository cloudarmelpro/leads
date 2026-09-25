"use client";

import { useEffect, useRef } from "react";

import { gsap, reducedMotion } from "@/lib/motion/gsap";

type Props = { items: string[]; label: string };

const SPARK = (
  <svg viewBox="0 0 24 24" aria-hidden className="size-[26px] shrink-0 text-vert-clair [filter:drop-shadow(0_0_10px_rgba(127,239,192,0.9))]">
    <path d="M12 0C12.9 8 16 11.1 24 12C16 12.9 12.9 16 12 24C11.1 16 8 12.9 0 12C8 11.1 11.1 8 12 0Z" fill="currentColor" />
    <circle cx="12" cy="12" r="2.2" fill="var(--color-fond)" />
  </svg>
);
const BEAM =
  "pointer-events-none absolute top-[-40%] bottom-[-40%] left-[0px] z-[1] w-[14%] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(235,252,244,0.75)_0%,rgba(190,236,214,0.35)_32%,rgba(160,220,195,0.1)_60%,rgba(160,220,195,0)_76%)] opacity-0 mix-blend-screen blur-[5px] will-change-[transform,opacity]";

/**
 * Bandeau sous le hero À propos, remonté sur le bas fondu de la carte : les quatre
 * phrases défilent en continu (liste répétée trois fois, décalée d'un tiers pour boucler
 * sans saut), et deux faisceaux de lumière balaient le bandeau toutes les 7 s. Immobile
 * sous `prefers-reduced-motion`.
 */
export function HeroBand({ items, label }: Props) {
  const band = useRef<HTMLDivElement>(null);
  const beamA = useRef<HTMLDivElement>(null);
  const beamB = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = band.current;
    if (!el || reducedMotion()) return;
    let x = 0;
    const tick = (_time: number, dt: number) => {
      const unit = el.scrollWidth / 3;
      const vw = el.parentElement?.clientWidth || window.innerWidth;
      if (!unit) return;
      x -= Math.min(vw / 28, 60) * (dt / 1000);
      if (-x >= unit) x += unit;
      gsap.set(el, { x });
    };
    gsap.ticker.add(tick);

    const beams: [HTMLDivElement | null, number][] = [
      [beamA.current, 0],
      [beamB.current, 5],
    ];
    let raf = 0;
    const sweep = (now: number) => {
      raf = requestAnimationFrame(sweep);
      for (const [beam, offset] of beams) {
        if (!beam) continue;
        const bw = beam.offsetWidth || 1;
        const pw = beam.parentElement?.clientWidth || window.innerWidth;
        const T = 7000;
        const SWEEP = 3200;
        const t = now % T;
        if (t < SWEEP) {
          const k = t / SWEEP;
          const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
          const px = -bw * 3.8 + offset * bw + e * (pw + bw * 4.8);
          beam.style.transform = `translateX(${px.toFixed(1)}px) skewX(-22deg)`;
          beam.style.opacity = Math.min(1, k * 8, (1 - k) * 8).toFixed(3);
        } else if (beam.style.opacity !== "0") {
          beam.style.opacity = "0";
        }
      }
    };
    raf = requestAnimationFrame(sweep);
    return () => {
      gsap.ticker.remove(tick);
      cancelAnimationFrame(raf);
    };
  }, []);

  const list = [...items, ...items, ...items];
  return (
    <div aria-label={label} className="relative z-[3] mt-[clamp(-72px,-5vw,-28px)] flex items-center overflow-hidden py-[18px]">
      <div ref={beamA} aria-hidden className={BEAM} />
      <div ref={beamB} aria-hidden className={BEAM} />
      <div ref={band} className="flex w-max will-change-transform">
        {list.map((text, i) => (
          <span key={i} aria-hidden={i >= items.length || undefined} className="flex shrink-0 items-center gap-[clamp(24px,2.8vw,40px)] pr-[clamp(24px,2.8vw,40px)]">
            <span className="text-[clamp(22px,15.79px+1.66vw,36px)] leading-[1.08] font-semibold tracking-[-1px] whitespace-nowrap text-vert uppercase min-[620px]:tracking-[-2px]">{text}</span>
            {SPARK}
          </span>
        ))}
      </div>
    </div>
  );
}
