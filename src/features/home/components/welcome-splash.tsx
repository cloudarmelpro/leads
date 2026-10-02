"use client";

import { useLayoutEffect, useRef, useState } from "react";

type Props = { word: string };

// La classe `tw-welcome` est posée sur <html> par le script avant peinture (pre-paint-script.tsx)
// au premier chargement de la session sur l'accueil ou À propos. Sans elle, l'écran reste masqué
// (globals.css) : déjà vu, navigation interne, ou JavaScript absent.
const ACTIVE = "tw-welcome";
const DONE_EVENT = "tw:welcome-done";

// Réglages de la maquette Accueil (préchargeur « BIENVENUE » en particules, 2026-10-02).
const PT = { accentShare: 0.08, fontWeight: 600, tracking: -0.02, maxParticles: 4500, ambientShare: 0.14, mobileSpeed: 1.1 };
// Temps en secondes. Lié au chargement réel (demande du client, 2026-10-02) : le mot est formé
// vers 1,4 s ; `disperse` n'est qu'un minimum, l'envol attend que la page soit chargée.
// La maquette, à durée fixe, dispersait à 2,95 s et finissait à 4 s.
const T = { appear: 0.1, appearSpread: 0.4, appearDur: 0.5, gather: 0.3, gatherSpread: 0.25, gatherDur: 0.8, disperse: 1.4, end: 2.45 };
// Au-delà, on n'attend plus la page (ressource bloquée) : le visiteur n'est jamais retenu.
const MAX_WAIT = 6000;
// Réseau lent : si le JavaScript prend la main après ce délai (ms depuis l'ouverture), le
// visiteur a déjà attendu devant le fond vide ; l'écran s'efface sans jouer les particules.
const LATE = 3000;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

type Particle = {
  sx: number; sy: number; tx: number | null; ty: number | null; z: number; ph: number; fr: number; appear: number;
  gd: number; curve: number; ox: number; oy: number; dist: number; dd: number; size: number; a: number; accent: boolean;
};

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a), 0, 1);
const ioc = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const oc = (p: number) => 1 - Math.pow(1 - p, 3);
const ic = (p: number) => p * p * p;

/**
 * Appelle `fn` quand l'écran de bienvenue dévoile la page (tout de suite s'il ne joue pas).
 * La scène 3D du hero attend ce moment : sa construction saccaderait les particules, et son
 * intro se joue ainsi sous les yeux du visiteur. Renvoie l'annulation.
 */
export function whenWelcomeDone(fn: () => void): () => void {
  if (!document.documentElement.classList.contains(ACTIVE)) {
    fn();
    return () => {};
  }
  window.addEventListener(DONE_EVENT, fn, { once: true });
  return () => window.removeEventListener(DONE_EVENT, fn);
}

function particle(w: number, h: number, tx: number | null, ty: number | null, diag: number): Particle {
  const cx = w / 2;
  const cy = h / 2;
  const z = Math.pow(Math.random(), 1.6);
  const sx = Math.random() * w;
  const sy = Math.random() * h;
  const rx = tx ?? sx;
  const ry = ty ?? sy;
  const out = Math.atan2(ry - cy, rx - cx) + (Math.random() - 0.5) * 0.9;
  return {
    sx, sy, tx, ty, z, ph: Math.random() * 6.283, fr: 0.3 + Math.random() * 0.6, appear: Math.random() * T.appearSpread,
    gd: Math.random() * T.gatherSpread + (tx === null || ty === null ? 0 : (Math.hypot(tx - cx, ty - cy) / diag) * 0.25),
    curve: (Math.random() - 0.5) * 0.35,
    ox: Math.cos(out), oy: Math.sin(out), dist: diag * (0.35 + Math.random() * 0.55 + z * 0.3),
    dd: Math.random() * 0.22 + (tx === null ? 0 : (Math.abs(tx - cx) / diag) * 0.15),
    size: 0.6 + z * 1.35, a: 0.32 + z * 0.68, accent: Math.random() < PT.accentShare,
  };
}

/** Points cibles : le mot dessiné hors écran, échantillonné (sur deux lignes en portrait). */
function build(word: string, font: string, w: number, h: number): Particle[] {
  const letters = Array.from(word);
  const portrait = h > w * 1.1 && letters.length >= 6;
  const split = portrait ? Math.floor(letters.length / 2) : letters.length;
  const lines = portrait ? [letters.slice(0, split), letters.slice(split)] : [letters];
  const c = document.createElement("canvas");
  const g = c.getContext("2d", { willReadFrequently: true });
  if (!g) return [];
  g.font = `${PT.fontWeight} 100px ${font}`;
  const tr = PT.tracking * 100;
  const widths = lines.map((l) => l.reduce((s, ch) => s + g.measureText(ch).width, 0) + tr * (l.length - 1));
  // Même taille que le H1 du hero : clamp(28px, 3vw, 40px).
  const fs = Math.min(Math.max(28, w * 0.03), 40);
  const k = fs / 100;
  const cap = 0.72 * fs;
  const lead = 0.16 * fs;
  const blockH = lines.length * cap + (lines.length - 1) * lead;
  c.width = w;
  c.height = h;
  g.font = `${PT.fontWeight} ${fs}px ${font}`;
  g.fillStyle = "#000";
  lines.forEach((l, li) => {
    let x = (w - (widths[li] ?? 0) * k) / 2;
    const y = (h - blockH) / 2 + cap + li * (cap + lead);
    for (const ch of l) {
      g.fillText(ch, x, y);
      x += g.measureText(ch).width + tr * k;
    }
  });
  const data = g.getImageData(0, 0, w, h).data;
  const max = w < 620 ? PT.maxParticles * 0.5 : PT.maxParticles;
  let step = 2;
  let pts: [number, number][] = [];
  do {
    pts = [];
    for (let y = 0; y < h; y += step)
      for (let x = 0; x < w; x += step)
        if ((data[(y * w + x) * 4 + 3] ?? 0) > 140) pts.push([x + (Math.random() - 0.5) * step * 0.6, y + (Math.random() - 0.5) * step * 0.6]);
    step++;
  } while (pts.length > max * (1 - PT.ambientShare) && step < 14);
  const diag = Math.hypot(w, h);
  const P = pts.map(([tx, ty]) => particle(w, h, tx, ty, diag));
  const ambient = Math.round((P.length * PT.ambientShare) / (1 - PT.ambientShare));
  for (let i = 0; i < ambient; i++) P.push(particle(w, h, null, null, diag));
  return P;
}

/**
 * Écran de bienvenue (maquette Accueil, 2026-10-02) : des particules dérivent, se rassemblent
 * pour écrire « BIENVENUE », puis s'envolent dès que la page est chargée (1,4 s au plus tôt),
 * pendant que le fond s'efface et que la page entre
 * (en-tête, titre, textes). Une fois par session, au premier chargement de l'accueil ou d'À
 * propos. Un clic, Échap, Entrée ou Espace passe directement à la dispersion. Sous
 * `prefers-reduced-motion`, le mot s'affiche fixe puis l'écran s'efface. Décoratif (aria-hidden).
 */
export function WelcomeSplash({ word }: Props) {
  const [open, setOpen] = useState(true);
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const skip = useRef<() => void>(() => {});

  useLayoutEffect(() => {
    const html = document.documentElement;
    const el = root.current;
    const cv = canvas.current;
    const back = bg.current;
    // JavaScript arrivé trop tard (réseau lent) : le CSS a déjà effacé l'écran (globals.css,
    // fondu à LATE), on ne le rallume pas.
    const late = performance.now() > LATE;
    if (!html.classList.contains(ACTIVE) || !el || !cv || !back || late) {
      if (late && html.classList.contains(ACTIVE)) {
        html.classList.remove(ACTIVE);
        window.dispatchEvent(new Event(DONE_EVENT));
      }
      setOpen(false);
      return;
    }
    // Sinon le fondu de secours CSS est annulé : c'est l'animation qui décide de la fin.
    el.style.animation = "none";

    let alive = true;
    let raf = 0;
    let t = 0;
    let forced = false;
    let ready = false;
    let revealed = false;
    const anims: Animation[] = [];

    const announce = () => window.dispatchEvent(new Event(DONE_EVENT));
    const close = () => {
      if (!alive) return;
      alive = false;
      cancelAnimationFrame(raf);
      html.classList.remove(ACTIVE);
      announce();
      setOpen(false);
    };
    skip.current = () => {
      if (alive && t < T.disperse) {
        forced = true;
        t = T.disperse;
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") skip.current();
    };
    window.addEventListener("keydown", onKey);

    // L'envol attend la page chargée (événement `load` : images, styles, scripts) et la police,
    // au plus MAX_WAIT après l'ouverture de la page (`performance.now()` part de la navigation).
    const loaded = new Promise<void>((r) => {
      if (document.readyState === "complete") r();
      else window.addEventListener("load", () => r(), { once: true });
    });
    const cap = new Promise((r) => setTimeout(r, Math.max(0, MAX_WAIT - performance.now())));
    const pageReady = Promise.race([Promise.all([loaded, document.fonts.ready]), cap]);
    void pageReady.then(() => {
      ready = true;
    });

    const reveal = (k: number) => {
      const ms = (v: number) => v * k;
      anims.push(back.animate([{ opacity: 1 }, { opacity: 0 }], { delay: ms(120), duration: ms(900), easing: "cubic-bezier(0.65, 0, 0.35, 1)", fill: "both" }));
      const rise = (target: Element | null | undefined, frames: Keyframe[], delay: number, duration: number) => {
        if (target) anims.push(target.animate(frames, { fill: "backwards", delay, duration, easing: EASE }));
      };
      const top = document.getElementById("top");
      rise(top, [{ opacity: 0 }, { opacity: 1 }], ms(150), ms(900));
      rise(top?.querySelector("h1"), [{ opacity: 0, transform: "translateY(22px)" }, { opacity: 1, transform: "none" }], ms(420), ms(1000));
      rise(document.querySelector("body > header"), [{ opacity: 0, transform: "translateY(-14px)" }, { opacity: 1, transform: "none" }], ms(640), ms(900));
      top?.querySelectorAll("p, [data-hero-cta]").forEach((node, i) =>
        rise(node, [{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }], ms(800 + i * 80), ms(900)),
      );
      announce();
    };

    const play = async () => {
      const css = getComputedStyle(html);
      const font = getComputedStyle(document.body).fontFamily || "sans-serif";
      const accent = css.getPropertyValue("--color-vert").trim() || "#30D98C";
      const ink = html.classList.contains("dark") ? "#E4ECEF" : css.getPropertyValue("--color-encre").trim() || "#1e1e1e";
      try {
        const spec = `${PT.fontWeight} 100px ${font}`;
        if (!document.fonts.check(spec)) await Promise.race([document.fonts.load(spec), new Promise((r) => setTimeout(r, 600))]);
      } catch {
        // police indisponible : on dessine avec celle de repli
      }
      if (!alive) return;
      if (performance.now() > LATE) {
        announce();
        const fade = el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: "both" });
        anims.push(fade);
        fade.finished.then(close, () => {});
        return;
      }
      const w = cv.clientWidth;
      const h = cv.clientHeight;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      const ctx = cv.getContext("2d");
      if (!ctx || !w || !h) return close();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        ctx.font = `${PT.fontWeight} ${clamp(w * 0.05, 24, 72)}px ${font}`;
        ctx.fillStyle = ink;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(word, w / 2, h / 2);
        await Promise.all([pageReady, new Promise((r) => setTimeout(r, 900))]);
        if (!alive) return;
        announce();
        const fade = el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: "both" });
        anims.push(fade);
        fade.finished.then(close, () => {});
        return;
      }

      const P = build(word, font, w, h);
      const k = w < 620 ? PT.mobileSpeed : 1;
      let last = performance.now();
      const loop = (now: number) => {
        if (!alive) return;
        const dt = Math.min(0.05, (now - last) / 1000) / k;
        last = now;
        let nt = t + dt;
        if (nt >= T.disperse - 0.01 && !(ready || forced)) nt = T.disperse - 0.01;
        t = nt;
        const s = now / 1000;
        if (!revealed && t >= T.disperse) {
          revealed = true;
          reveal(k);
        }
        ctx.clearRect(0, 0, w, h);
        const drift = 1 - ioc(seg(t, T.gather, T.gather + T.gatherDur + T.gatherSpread));
        const breathe = 1 - drift;
        for (let pass = 0; pass < 2; pass++) {
          ctx.fillStyle = pass ? accent : ink;
          for (const p of P) {
            if (p.accent !== (pass === 1)) continue;
            const ap = oc(seg(t, T.appear + p.appear, T.appear + p.appear + T.appearDur));
            if (ap <= 0) continue;
            const amp = 6 + p.z * 22;
            const fx = Math.sin(s * p.fr + p.ph + p.sy * 0.004) * amp + Math.cos(s * 0.37 + p.sx * 0.003) * amp * 0.5;
            const fy = Math.cos(s * p.fr * 0.8 + p.ph + p.sx * 0.004) * amp + Math.sin(s * 0.29 + p.sy * 0.003) * amp * 0.5;
            let x: number;
            let y: number;
            let a = p.a * ap;
            if (p.tx !== null && p.ty !== null) {
              const gp = ioc(seg(t, T.gather + p.gd, T.gather + p.gd + T.gatherDur));
              const bend = Math.sin(gp * Math.PI) * p.curve * Math.hypot(p.tx - p.sx, p.ty - p.sy);
              const nx = -(p.ty - p.sy);
              const ny = p.tx - p.sx;
              const nl = Math.hypot(nx, ny) || 1;
              x = p.sx + (p.tx - p.sx) * gp + (nx / nl) * bend + fx * (1 - gp);
              y = p.sy + (p.ty - p.sy) * gp + (ny / nl) * bend + fy * (1 - gp);
              x += Math.sin(s * 2.1 + p.ph) * 0.35 * breathe;
              y += Math.cos(s * 1.8 + p.ph) * 0.35 * breathe;
              a *= 0.55 + 0.45 * (1 - (1 - gp) * 0.4);
            } else {
              x = p.sx + fx * 1.4;
              y = p.sy + fy * 1.4;
              a *= 0.55 * (1 - 0.6 * (1 - drift));
            }
            const dp = seg(t, T.disperse + p.dd, T.disperse + p.dd + 0.85);
            if (dp > 0) {
              const e = ic(dp) * 0.65 + ioc(dp) * 0.35;
              x += p.ox * p.dist * e + fx * dp * 2;
              y += p.oy * p.dist * e + fy * dp * 2;
              a *= 1 - oc(dp);
            }
            if (a <= 0.01) continue;
            ctx.globalAlpha = a;
            const sz = p.size * (1 + (dp > 0 ? dp * p.z * 1.2 : 0));
            ctx.fillRect(x - sz / 2, y - sz / 2, sz, sz);
          }
        }
        ctx.globalAlpha = 1;
        if (t >= T.end + 0.25) return close();
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    };
    void play();

    return () => {
      window.removeEventListener("keydown", onKey);
      // Démontage (navigation) : les animations d'entrée ne doivent pas rester figées sur la page.
      anims.forEach((a) => a.cancel());
      if (alive) {
        alive = false;
        cancelAnimationFrame(raf);
        // Vrai démontage seulement : en mode strict (développement), l'effet est rejoué aussitôt
        // sur le même élément, qui doit alors repartir de zéro.
        setTimeout(() => {
          if (el.isConnected) return;
          html.classList.remove(ACTIVE);
          announce();
        }, 0);
      }
    };
  }, [word]);

  if (!open) return null;

  return (
    <div ref={root} data-splash aria-hidden onClick={() => skip.current()} className="fixed inset-[0px] z-[95] cursor-pointer">
      <div ref={bg} className="absolute inset-[0px] bg-fond" />
      <canvas ref={canvas} className="absolute inset-[0px] block h-full w-full" />
    </div>
  );
}
