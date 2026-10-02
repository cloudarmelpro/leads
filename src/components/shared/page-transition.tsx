"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

// Réglages de la maquette « Site » (transition entre pages, 2026-10-02).
const C = {
  particles: 3200, // maximum (téléphone : moitié)
  detach: 360, // ms : chaque particule quitte la page et rejoint le vortex
  detachSpread: 160, // ms : décalage maximal selon la distance au clic
  release: 480, // ms : début de la dispersion
  disperse: 400, // ms : durée de la dispersion
  disperseSpread: 90,
  enter: 650, // ms : entrée de la nouvelle page (fondu + montée)
  enterOffset: 20, // px
  vortexSize: 0.11, // rayon du vortex / plus petit côté de l'écran
  turns: 1,
  tint: { r: 214, g: 226, b: 230 }, // #D6E2E6 : les couleurs de la page s'en rapprochent un peu
  tintAmount: 0.18,
  maxWait: 8000, // ms : attente maximale de la nouvelle page (le vortex tourne)
};
const EASE_IN_OUT = "cubic-bezier(0.4, 0, 0.2, 1)";
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
// Pages du site (sous /fr ou /en, sans extension de fichier) : le reste se charge normalement.
const PAGE = /^\/(fr|en)(\/[^.]*)?$/;
// Éléments jamais estompés ni photographiés : cette couche, le curseur maison.
const KEEP = "[data-tp-keep]";

type RGB = { r: number; g: number; b: number; a: number };
type Snap = { data: Uint8ClampedArray; cw: number; ch: number; S: number; bg: RGB };
type Particle = {
  ox: number; oy: number; z: number; d: number; a0: number; rad: number; turn: number;
  curl: number; dd: number; dist: number; size: number; alpha: number;
};

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const seg = (t: number, a: number, d: number) => clamp((t - a) / d, 0, 1);
const io = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const oc = (p: number) => 1 - Math.pow(1 - p, 3);
const ic = (p: number) => p * p * p;
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const frame = () => new Promise<void>((r) => requestAnimationFrame(() => setTimeout(r, 0)));
const norm = (path: string) => {
  try {
    return decodeURIComponent(path).replace(/\/+$/, "") || "/";
  } catch {
    return path;
  }
};

function parseRGB(s: string | null | undefined): RGB | null {
  const m = s?.match(/rgba?\(([^)]+)\)/);
  if (!m?.[1]) return null;
  const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
  return { r: p[0] ?? 0, g: p[1] ?? 0, b: p[2] ?? 0, a: p.length > 3 ? (p[3] ?? 1) : 1 };
}

/** Morceaux de page qui s'estompent puis entrent : les enfants directs du <body>. */
function pageParts(): HTMLElement[] {
  return [...document.body.children].filter(
    (el): el is HTMLElement => el instanceof HTMLElement && !el.matches(`script, style, next-route-announcer, ${KEEP}`),
  );
}

/**
 * Reconstitue la partie visible de la page (fonds, images, lignes de texte, bordures) dans un
 * canvas réduit de moitié : les particules en reprennent les couleurs et la trame.
 */
async function snapshot(w: number, h: number): Promise<Snap> {
  const S = 0.5;
  const cw = Math.max(1, Math.round(w * S));
  const ch = Math.max(1, Math.round(h * S));
  const c = document.createElement("canvas");
  c.width = cw;
  c.height = ch;
  const g = c.getContext("2d", { willReadFrequently: true });
  if (!g) throw new Error("canvas");
  const bodyBg = parseRGB(getComputedStyle(document.body).backgroundColor);
  const bg = bodyBg && bodyBg.a > 0.5 ? bodyBg : { r: 1, g: 24, b: 35, a: 1 };
  g.fillStyle = `rgb(${bg.r},${bg.g},${bg.b})`;
  g.fillRect(0, 0, cw, ch);
  g.scale(S, S);
  const vis = (r: DOMRect) => r.width > 0 && r.height > 0 && r.bottom > 0 && r.right > 0 && r.top < h && r.left < w;

  type Item = { r: DOMRect; cs: CSSStyleDeclaration; src?: string; canvas?: HTMLCanvasElement };
  const items: Item[] = [];
  for (const el of document.body.querySelectorAll("*")) {
    if (el.closest(`${KEEP}, [data-splash]`)) continue;
    const r = el.getBoundingClientRect();
    if (!vis(r)) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || +cs.opacity < 0.05) continue;
    const item: Item = { r, cs };
    if (el instanceof HTMLImageElement) item.src = el.currentSrc || el.src;
    else if (el instanceof HTMLCanvasElement) item.canvas = el;
    else {
      const m = cs.backgroundImage.match(/url\(["']?([^"')]+)["']?\)/);
      if (m?.[1]) item.src = m[1];
    }
    items.push(item);
  }
  const images = await Promise.all(
    items.map((it) =>
      it.src
        ? new Promise<HTMLImageElement | null>((res) => {
            const im = new Image();
            let done = false;
            const fin = (ok: boolean) => {
              if (done) return;
              done = true;
              res(ok ? im : null);
            };
            im.onload = () => fin(true);
            im.onerror = () => fin(false);
            im.src = it.src ?? "";
            if (im.complete && im.naturalWidth) fin(true);
            setTimeout(() => fin(im.complete && im.naturalWidth > 0), 160);
          })
        : Promise.resolve(null),
    ),
  );
  items.forEach(({ r, cs, canvas }, i) => {
    const col = parseRGB(cs.backgroundColor);
    if (col && col.a > 0.04) {
      g.globalAlpha = col.a;
      g.fillStyle = `rgb(${col.r},${col.g},${col.b})`;
      g.fillRect(r.left, r.top, r.width, r.height);
    }
    const source = images[i] ?? canvas;
    const sw0 = source instanceof HTMLImageElement ? source.naturalWidth : (source?.width ?? 0);
    const sh0 = source instanceof HTMLImageElement ? source.naturalHeight : (source?.height ?? 0);
    if (source && sw0 && sh0) {
      g.globalAlpha = 1;
      try {
        const s = Math.max(r.width / sw0, r.height / sh0);
        const sw = r.width / s;
        const sh = r.height / s;
        g.save();
        g.beginPath();
        g.rect(r.left, r.top, r.width, r.height);
        g.clip();
        g.drawImage(source, (sw0 - sw) / 2, (sh0 - sh) / 2, sw, sh, r.left, r.top, r.width, r.height);
        g.restore();
      } catch {
        // image illisible : son emplacement reste au fond
      }
    }
    const bw = parseFloat(cs.borderTopWidth) || 0;
    const bc = parseRGB(cs.borderTopColor);
    if (bw > 0 && bc && bc.a > 0.05) {
      g.globalAlpha = bc.a;
      g.strokeStyle = `rgb(${bc.r},${bc.g},${bc.b})`;
      g.lineWidth = bw;
      g.strokeRect(r.left, r.top, r.width, r.height);
    }
  });
  // Texte : une bande par ligne, à hauteur d'œil (les particules restituent la trame des lignes).
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.nodeValue?.trim()) continue;
    const pe = n.parentElement;
    if (!pe || pe.closest(`${KEEP}, [data-splash], script, style`)) continue;
    const cs = getComputedStyle(pe);
    if (cs.visibility === "hidden") continue;
    const col = parseRGB(cs.color);
    if (!col || col.a < 0.1) continue;
    range.selectNodeContents(n);
    const fs = parseFloat(cs.fontSize) || 14;
    g.globalAlpha = col.a;
    g.fillStyle = `rgb(${col.r},${col.g},${col.b})`;
    for (const rr of range.getClientRects()) {
      if (!vis(rr)) continue;
      const bh = fs * 0.58;
      g.fillRect(rr.left, rr.top + (rr.height - bh) / 2, rr.width, bh);
    }
  }
  g.globalAlpha = 1;
  return { data: g.getImageData(0, 0, cw, ch).data, cw, ch, S, bg };
}

/** Particules tirées de l'instantané, rangées par couleur (un `fillStyle` par paquet). */
function build(snap: Snap, w: number, h: number, cx: number, cy: number, ox: number, oy: number): [string, Particle[]][] {
  const { data, cw, ch, S, bg } = snap;
  const max = w < 620 ? C.particles * 0.5 : C.particles;
  const cand: number[][] = [];
  for (let y = 0; y < ch; y += 2)
    for (let x = 0; x < cw; x += 2) {
      const i = (y * cw + x) * 4;
      const r = data[i] ?? 0;
      const gg = data[i + 1] ?? 0;
      const b = data[i + 2] ?? 0;
      const diff = Math.abs(r - bg.r) + Math.abs(gg - bg.g) + Math.abs(b - bg.b);
      if (diff > 28) cand.push([x, y, r, gg, b, diff]);
    }
  // Tirage pondéré : les zones contrastées (texte, images) portent plus de particules.
  const keep = Math.min(1, (max / Math.max(1, cand.length)) * 1.6);
  const pick = cand.filter((c) => Math.random() < keep * clamp((c[5] ?? 0) / 180, 0.35, 1));
  while (pick.length > max) pick.splice((Math.random() * pick.length) | 0, 1);
  const ambient = Math.round(max * 0.06);
  for (let i = 0; i < ambient; i++) pick.push([Math.random() * cw, Math.random() * ch, 214, 226, 230, 0]);
  const Rmax = Math.min(w, h) * C.vortexSize;
  const diag = Math.hypot(w, h);
  const buckets = new Map<string, Particle[]>();
  const t = C.tintAmount;
  const q = (v: number, tv: number) => clamp(Math.round((v * (1 - t) + tv * t) / 40) * 40, 0, 255);
  for (const [x = 0, y = 0, r = 0, gg = 0, b = 0] of pick) {
    const key = `rgb(${q(r, C.tint.r)},${q(gg, C.tint.g)},${q(b, C.tint.b)})`;
    const px = x / S;
    const py = y / S;
    const z = Math.pow(Math.random(), 1.4);
    const rad = Rmax * (0.1 + 0.9 * Math.sqrt(Math.random()));
    const p: Particle = {
      ox: px + (Math.random() - 0.5) / S,
      oy: py + (Math.random() - 0.5) / S,
      z,
      d: (Math.hypot(px - ox, py - oy) / diag) * C.detachSpread + Math.random() * 40,
      a0: Math.atan2(py - cy, px - cx) + (Math.random() - 0.5) * 0.6,
      rad,
      turn: 0.88 + 0.12 * (1 - rad / Rmax),
      curl: (Math.random() - 0.5) * 0.9,
      dd: Math.random() * C.disperseSpread + (1 - rad / Rmax) * 40,
      dist: diag * (0.32 + Math.random() * 0.45 + z * 0.25),
      size: 0.5 + z * 0.8,
      alpha: 0.45 + z * 0.55,
    };
    const list = buckets.get(key);
    if (list) list.push(p);
    else buckets.set(key, [p]);
  }
  return [...buckets.entries()];
}

/**
 * Transition entre pages (maquette « Site ») : au clic sur un lien interne, la page visible se
 * défait en particules qui s'enroulent en vortex au centre, la nouvelle page se charge pendant
 * ce temps (le vortex tourne tant qu'elle n'est pas prête), puis les particules se dispersent et
 * la nouvelle page entre en fondu, en montant légèrement. Sous `prefers-reduced-motion` : simple
 * fondu. Les ancres de la même page, les nouveaux onglets, les fichiers et les liens externes
 * gardent le comportement normal ; l'historique (retour, avance) aussi.
 */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const layer = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const arrival = useRef<{ from: string; resolve: () => void } | null>(null);

  // La nouvelle page est montée quand le chemin change (pas forcément celui du lien : redirections).
  useEffect(() => {
    const pending = arrival.current;
    if (pending && pending.from !== norm(pathname)) {
      arrival.current = null;
      pending.resolve();
    }
  }, [pathname]);

  useEffect(() => {
    const host = layer.current;
    const cv = canvas.current;
    if (!host || !cv) return;
    let busy = false;
    let raf = 0;
    let alive = true;

    const finish = () => {
      host.style.display = "none";
      busy = false;
    };

    const enter = (reduced: boolean, fades: Animation[]) => {
      const frames: Keyframe[] = reduced
        ? [{ opacity: 0 }, { opacity: 1 }]
        : [{ opacity: 0, transform: `translateY(${C.enterOffset}px)` }, { opacity: 1, transform: "none" }];
      const anims = pageParts().map((el) => el.animate(frames, { duration: reduced ? 260 : C.enter, easing: EASE_OUT, fill: "forwards" }));
      // Fondus et entrées annulés ensemble, dans la même tâche : aucune image intermédiaire.
      void Promise.allSettled(anims.map((a) => a.finished)).then(() => {
        fades.forEach((a) => a.cancel());
        anims.forEach((a) => a.cancel());
      });
    };

    const go = async (href: string, from: string, x: number, y: number) => {
      busy = true;
      host.style.display = "block";
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const arrived = new Promise<void>((resolve) => {
        arrival.current = { from, resolve };
      })
        .then(() => Promise.race([document.fonts.ready.then(() => undefined), wait(600)]))
        .then(() => wait(120));
      const readyP = Promise.race([arrived, wait(C.maxWait)]);
      let ready = false;
      void readyP.then(() => {
        ready = true;
      });
      router.prefetch(href);

      if (reduced) {
        router.push(href);
        await readyP;
        enter(true, []);
        return finish();
      }

      // L'instantané attend une image : le clic s'affiche d'abord (réactivité, INP).
      await frame();
      const w = host.clientWidth;
      const h = host.clientHeight;
      const cx = w / 2;
      const cy = h / 2;
      let snap: Snap | null = null;
      try {
        snap = await snapshot(w, h);
      } catch {
        // pas d'instantané : la page s'estompe sans particules
      }
      if (!alive) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      const ctx = cv.getContext("2d");
      if (!ctx) {
        router.push(href);
        await readyP;
        enter(false, []);
        return finish();
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const buckets = snap ? build(snap, w, h, cx, cy, x, y) : [];

      // L'ancienne page s'efface pendant que ses particules se détachent ; la navigation part
      // une fois le fondu fini, sinon la nouvelle page apparaîtrait à demi effacée.
      const fades = pageParts().map((el) => el.animate([{ opacity: 1 }, { opacity: 0 }], { delay: 60, duration: 260, easing: EASE_IN_OUT, fill: "forwards" }));
      void Promise.allSettled(fades.map((a) => a.finished)).then(() => router.push(href));

      let tv = 0;
      let last = performance.now();
      let swapped = false;
      let waitRot = 0;
      let waitV = 0;
      const end = C.release + C.disperseSpread + 40 + C.disperse;
      const omega = ((Math.PI * 2 * C.turns) / end) * 1.1;
      await new Promise<void>((resolve) => {
        const step = (now: number) => {
          if (!alive) return resolve();
          const dt = Math.min(100, now - last);
          last = now;
          let nt = tv + dt;
          // Page pas encore prête : le vortex continue de tourner (vitesse qui monte et redescend).
          const waiting = nt >= C.release && !ready;
          if (waiting) nt = C.release - 0.01;
          waitV += ((waiting ? omega : 0) - waitV) * Math.min(1, dt / 140);
          waitRot += waitV * dt;
          tv = nt;
          if (!swapped && tv >= C.release) {
            swapped = true;
            enter(false, fades);
          }
          ctx.clearRect(0, 0, w, h);
          for (const [col, ps] of buckets) {
            ctx.fillStyle = col;
            for (const p of ps) {
              const gp = io(seg(tv, p.d, C.detach));
              // Un seul tour, réparti sur toute la transition.
              const th = p.a0 + (Math.PI * 2 * C.turns * io(seg(tv, p.d, end - p.d)) + waitRot) * p.turn * gp;
              const pull = 1 - 0.18 * gp * seg(tv, C.detach * 0.6, 300);
              const vx = cx + Math.cos(th) * p.rad * pull;
              const vy = cy + Math.sin(th) * p.rad * pull;
              // Trajectoire courbe vers le vortex.
              const mx = -(vy - p.oy);
              const my = vx - p.ox;
              const bend = Math.sin(gp * Math.PI) * p.curl;
              let px = p.ox + (vx - p.ox) * gp + mx * bend * 0.35;
              let py = p.oy + (vy - p.oy) * gp + my * bend * 0.35;
              // Profondeur : légère parallaxe autour du centre.
              const par = 1 + (p.z - 0.5) * 0.1 * gp;
              px = cx + (px - cx) * par;
              py = cy + (py - cy) * par;
              let a = p.alpha * (0.7 + 0.3 * (1 - gp)) + (1 - p.alpha) * (1 - gp);
              const dp = seg(tv, C.release + p.dd, C.disperse);
              if (dp > 0) {
                const dir = th + 0.5 + p.curl * 0.4;
                const e = ic(dp) * 0.55 + io(dp) * 0.45;
                px += Math.cos(dir) * p.dist * e;
                py += Math.sin(dir) * p.dist * e;
                a *= 1 - oc(dp);
              }
              if (a < 0.02) continue;
              ctx.globalAlpha = a;
              const s = p.size * (1 + dp * p.z * 0.8);
              ctx.fillRect(px - s / 2, py - s / 2, s, s);
            }
          }
          ctx.globalAlpha = 1;
          if (tv >= end) {
            ctx.clearRect(0, 0, w, h);
            return resolve();
          }
          raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      });
      finish();
    };

    const onClick = (e: MouseEvent) => {
      if (busy || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target instanceof Element ? e.target.closest("a[href]") : null;
      if (!(a instanceof HTMLAnchorElement) || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || !PAGE.test(url.pathname)) return;
      const from = norm(location.pathname);
      // Même page (ancre, paramètres) : défilement ou mise à jour normale.
      if (norm(url.pathname) === from) return;
      e.preventDefault();
      // Lien activé au clavier : pas de position de pointeur, le vortex part du centre.
      const pointer = e.detail > 0;
      void go(url.pathname + url.search + url.hash, from, pointer ? e.clientX : innerWidth / 2, pointer ? e.clientY : innerHeight / 2);
    };
    document.addEventListener("click", onClick, true);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick, true);
    };
  }, [router]);

  return (
    // Couche au-dessus de la page pendant la transition : elle porte les particules et absorbe
    // les clics (pas de double navigation).
    <div ref={layer} data-tp-keep aria-hidden className="fixed inset-[0px] z-[99] hidden">
      <canvas ref={canvas} className="absolute inset-[0px] block h-full w-full" />
    </div>
  );
}
