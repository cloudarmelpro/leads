"use client";

import { useEffect } from "react";

const STYLE_ID = "tw-cursor-style";
const EASE = "cubic-bezier(0.2,0.7,0.2,1)";

/**
 * Curseur de la maquette Accueil (2026-09-30), souris seulement : un point vert et un anneau
 * qui le suit avec un peu de retard ; l'anneau grandit et se teinte sur les éléments
 * cliquables, se contracte au clic. Le curseur natif est masqué tant que la page est
 * montée. Sous `prefers-reduced-motion`, l'anneau suit sans retard. Ne rend rien.
 */
export function HomeCursor() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = "html,body,a,button,[role=button],input,textarea,select,label{cursor:none!important}";
    document.head.appendChild(style);

    const dot = document.createElement("div");
    const ring = document.createElement("div");
    dot.setAttribute("aria-hidden", "true");
    ring.setAttribute("aria-hidden", "true");
    dot.style.cssText =
      "position:fixed;left:0;top:0;z-index:9999;width:6px;height:6px;margin:-3px 0 0 -3px;border-radius:999px;background:#30D98C;pointer-events:none;opacity:0;transition:opacity 200ms,width 200ms,height 200ms,margin 200ms";
    ring.style.cssText = `position:fixed;left:0;top:0;z-index:9998;width:36px;height:36px;margin:-18px 0 0 -18px;border-radius:999px;box-shadow:inset 0 0 0 1.5px rgba(48,217,140,0.55);pointer-events:none;opacity:0;transition:opacity 200ms,width 280ms ${EASE},height 280ms ${EASE},margin 280ms ${EASE},background 280ms,box-shadow 280ms`;
    document.body.appendChild(ring);
    document.body.appendChild(dot);

    let mx = -100;
    let my = -100;
    let rx = -100;
    let ry = -100;
    let hover = false;
    let pressed = false;
    let raf = 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const setHover = (value: boolean) => {
      if (value === hover) return;
      hover = value;
      ring.style.width = ring.style.height = value ? "56px" : "36px";
      ring.style.margin = value ? "-28px 0 0 -28px" : "-18px 0 0 -18px";
      ring.style.background = value ? "rgba(48,217,140,0.12)" : "transparent";
      ring.style.boxShadow = value ? "inset 0 0 0 1.5px rgba(48,217,140,0.9)" : "inset 0 0 0 1.5px rgba(48,217,140,0.55)";
      dot.style.opacity = value ? "0" : "1";
    };
    const onMove = (event: PointerEvent) => {
      mx = event.clientX;
      my = event.clientY;
      dot.style.opacity = hover ? "0" : "1";
      ring.style.opacity = "1";
      dot.style.transform = `translate3d(${mx}px,${my}px,0)`;
      const target = event.target instanceof Element ? event.target : null;
      setHover(!!target?.closest("a,button,[role=button],input,textarea,select,label,summary"));
    };
    const onLeave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };
    const onDown = () => {
      pressed = true;
    };
    const onUp = () => {
      pressed = false;
    };
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const k = reduce ? 1 : 0.18;
      rx += (mx - rx) * k;
      ry += (my - ry) * k;
      ring.style.transform = `translate3d(${rx.toFixed(1)}px,${ry.toFixed(1)}px,0)${pressed ? " scale(0.85)" : ""}`;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      style.remove();
      dot.remove();
      ring.remove();
    };
  }, []);

  return null;
}
