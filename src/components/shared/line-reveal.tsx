"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

import { loadMotion, reducedMotion, type Motion } from "@/lib/motion/load";

type Props = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  /** Décalage (s) après l'entrée à l'écran, pour enchaîner titre puis texte. */
  delay?: number;
  /** Au survol, chaque lettre roule vers le haut, remplacée par son double qui monte du bas. */
  rollOnHover?: boolean;
  /**
   * Texte au-dessus du pli (hero) : l'entrée se joue tout de suite, en CSS, sans attendre le
   * script ni découper les lignes — le texte compte dès la première peinture (LCP), au lieu
   * d'attendre l'hydratation (2 à 4 s sur téléphone). Le bloc entier monte d'un masque, au
   * lieu de chaque ligne décalée de 90 ms : identique sur une ligne, à peine différent au-delà.
   */
  immediate?: boolean;
};

type Split = InstanceType<Motion["SplitText"]>;
type Tween = ReturnType<Motion["gsap"]["from"]>;

// Roulement au survol (maquette À propos, `rollIn`) : 70 ms entre les lettres (resserré
// au-delà de 12 lettres), 260 ms par lettre, la lettre sort 0,3em plus haut que sa hauteur.
const ROLL_OFF = "0.3em";
const ROLL_DUR = 0.26;

function rollLetters({ gsap, SplitText }: Motion, rows: HTMLElement[], done: () => void) {
  // Les lettres sont découpées LIGNE PAR LIGNE, à l'intérieur des lignes déjà découpées
  // (un second découpage sur l'élément lui-même déferait le premier, et le texte se
  // reformerait sous le pointeur). Chaque ligne garde donc sa place ; `words` empêche
  // les coupures en plein mot. Chaque lettre a son masque, élargi de 0,14em comme celui
  // des lignes (accent du À), et un double posé sous elle ; la première ligne roule en
  // entier, puis la suivante (demande du client), et les découpages sont défaits.
  const splits = rows.map((row) => SplitText.create(row, { type: "words,chars", mask: "chars", aria: "none" }));
  for (const split of splits) {
    for (const c of split.chars) {
      const mask = c.parentElement;
      if (mask) mask.style.cssText += ";padding-block:0.14em;margin-block:-0.14em";
      const twin = document.createElement("span");
      twin.setAttribute("aria-hidden", "true");
      twin.textContent = c.textContent;
      twin.style.cssText = `position:absolute;left:0;right:0;top:calc(100% + ${ROLL_OFF});display:block`;
      c.appendChild(twin);
    }
  }
  let start = 0;
  const tl = gsap.timeline({
    onComplete: () => {
      for (const split of splits) split.revert();
      done();
    },
  });
  for (const split of splits) {
    const n = split.chars.length;
    if (n === 0) continue;
    const step = n > 12 ? Math.max(0.018, 0.7 / n) : 0.07;
    tl.to(split.chars, { yPercent: -100, y: `-${ROLL_OFF}`, duration: ROLL_DUR, ease: "power3.inOut", stagger: step }, start);
    start += (n - 1) * step + ROLL_DUR;
  }
}

/**
 * Révélation ligne par ligne (« masked line reveal ») : SplitText découpe le texte en
 * lignes, chacune dans un masque `overflow: clip`, et chaque ligne monte depuis sous son
 * masque quand l'élément entre à l'écran. Le découpage se refait tout seul si la largeur
 * change ou quand la police arrive (`autoSplit`). Sous `prefers-reduced-motion`, rien ne
 * bouge. Le texte reste masqué jusqu'au découpage (globals.css, `[data-line-reveal]`).
 * Avec `immediate`, l'entrée est en CSS (globals.css, `[data-line-rise]`) et GSAP n'est
 * chargé qu'au premier survol, pour le roulement.
 */
export function LineReveal({ as: Tag = "p", className, children, delay = 0, rollOnHover = false, immediate = false }: Props) {
  const ref = useRef<HTMLElement>(null);
  const line = useRef<HTMLSpanElement>(null);
  const rolling = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = reducedMotion();
    let cancelled = false;

    if (immediate) {
      const row = line.current;
      if (!row || !rollOnHover) return;
      // Le roulement attend la fin de l'entrée CSS, sinon les deux animations se disputent le bloc.
      let played = reduce;
      const onEnd = () => {
        played = true;
      };
      row.addEventListener("animationend", onEnd);
      const onEnter = () => {
        if (rolling.current || !played) return;
        rolling.current = true;
        loadMotion().then((motion) => {
          if (cancelled) return;
          rollLetters(motion, [row], () => {
            rolling.current = false;
          });
        });
      };
      el.addEventListener("pointerenter", onEnter);
      return () => {
        cancelled = true;
        row.removeEventListener("animationend", onEnd);
        el.removeEventListener("pointerenter", onEnter);
      };
    }

    if (reduce) {
      el.dataset.revealed = "";
      return;
    }

    let motion: Motion | null = null;
    let split: Split | null = null;
    let tween: Tween | null = null;
    let io: IntersectionObserver | null = null;
    let played = false;
    let raf = 0;
    loadMotion().then((m) => {
      if (cancelled) return;
      motion = m;
      // `aria: "none"` : le texte reste lu tel quel ; un aria-label sur un <span> ou un <p>
      // ne serait pas annoncé, et les lignes seraient cachées aux lecteurs d'écran.
      split = m.SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "tw-line",
        aria: "none",
        autoSplit: true,
        onSplit(self) {
          tween = m.gsap.from(self.lines, { yPercent: 110, duration: 1.1, ease: "expo.out", stagger: 0.09, delay, paused: !played });
          return tween;
        },
      });
      el.dataset.revealed = "";

      const play = () => {
        // Écran de bienvenue encore affiché : on attend qu'il parte, sinon l'animation se joue dessous.
        if (document.querySelector("[data-splash]")) {
          raf = requestAnimationFrame(play);
          return;
        }
        played = true;
        tween?.play();
      };
      io = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          io?.disconnect();
          play();
        },
        { rootMargin: "0px 0px -10% 0px" },
      );
      io.observe(el);
    });

    // Le roulement attend la fin de la révélation, sinon les deux animations se disputent
    // les mêmes lignes.
    const onEnter = () => {
      if (!rollOnHover || !motion || !split || rolling.current || !played || tween?.isActive()) return;
      rolling.current = true;
      const rows = split.isSplit && split.lines.length > 0 ? (split.lines as HTMLElement[]) : [el];
      rollLetters(motion, rows, () => {
        rolling.current = false;
      });
    };
    el.addEventListener("pointerenter", onEnter);

    return () => {
      cancelled = true;
      io?.disconnect();
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerenter", onEnter);
      split?.revert();
    };
  }, [delay, rollOnHover, immediate]);

  if (immediate) {
    return (
      <Tag ref={ref} data-line-rise className={className} style={{ "--rise-delay": `${delay}s` } as CSSProperties}>
        <span className="tw-rise-mask">
          <span ref={line} className="tw-rise-line">
            {children}
          </span>
        </span>
      </Tag>
    );
  }

  return (
    <Tag ref={ref} data-line-reveal className={className}>
      {children}
    </Tag>
  );
}
