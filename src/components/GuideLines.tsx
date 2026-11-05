"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

type Line = { axis: "x" | "y"; pos: string };

/**
 * Thin construction lines; every so often a single orange dot with a fading tail runs along one of them.
 * Only one dot is ever moving, with a random pause between runs.
 */
export function GuideLines({
  lines,
  tone = "light",
  intro = true,
}: {
  lines: Line[];
  tone?: "light" | "dark";
  intro?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!;
    const guides = Array.from(el.querySelectorAll<HTMLElement>("[data-guide]"));
    const comet = el.querySelector<HTMLElement>("[data-comet]")!;
    if (prefersReducedMotion()) return;
    if (intro) gsap.fromTo(guides, { scale: 0 }, { scale: 1, duration: 1.6, stagger: 0.08, ease: "expo.inOut", delay: 0.4 });

    let alive = true;
    let tween: gsap.core.Tween | null = null;
    let timer = 0;
    const run = () => {
      if (!alive) return;
      const g = guides[Math.floor(Math.random() * guides.length)];
      const vertical = g.dataset.axis === "y";
      const forward = Math.random() > 0.5;
      const box = el.getBoundingClientRect();
      const gb = g.getBoundingClientRect();
      const len = vertical ? box.height : box.width;
      const fixed = vertical ? gb.left - box.left : gb.top - box.top;
      comet.dataset.axis = vertical ? "y" : "x";
      comet.dataset.dir = forward ? "1" : "-1";
      const from = forward ? -60 : len + 60;
      const to = forward ? len + 60 : -60;
      gsap.set(comet, vertical ? { x: fixed, y: from, opacity: 1 } : { x: from, y: fixed, opacity: 1 });
      tween = gsap.to(comet, {
        [vertical ? "y" : "x"]: to,
        duration: gsap.utils.random(2.2, 3.4),
        ease: "power1.inOut",
        onComplete: () => {
          gsap.set(comet, { opacity: 0 });
          timer = window.setTimeout(run, gsap.utils.random(1500, 3500));
        },
      });
    };
    timer = window.setTimeout(run, 2400);
    return () => {
      alive = false;
      tween?.kill();
      window.clearTimeout(timer);
    };
  }, [intro]);

  const lineColor = tone === "dark" ? "bg-paper/[0.08]" : "bg-ink/[0.08]";
  return (
    <div ref={root} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {lines.map((l, i) =>
        l.axis === "x" ? (
          <span key={i} data-guide data-axis="x" className={`absolute left-0 right-0 h-px origin-left ${lineColor}`} style={{ top: l.pos }} />
        ) : (
          <span key={i} data-guide data-axis="y" className={`absolute bottom-0 top-0 w-px origin-top ${lineColor}`} style={{ left: l.pos }} />
        ),
      )}
      <span data-comet className="comet absolute left-0 top-0 opacity-0" />
      <style>{`
        .comet { width: 7px; height: 7px; margin: -3px 0 0 -3px; border-radius: 99px; background: var(--signal); box-shadow: 0 0 12px 2px rgb(255 90 31 / .55); }
        .comet::after { content: ""; position: absolute; border-radius: 99px; }
        .comet[data-axis="x"]::after { top: 2.5px; height: 2px; width: 90px; }
        .comet[data-axis="x"][data-dir="1"]::after { right: 4px; background: linear-gradient(90deg, transparent, rgb(255 90 31 / .7)); }
        .comet[data-axis="x"][data-dir="-1"]::after { left: 4px; background: linear-gradient(270deg, transparent, rgb(255 90 31 / .7)); }
        .comet[data-axis="y"]::after { left: 2.5px; width: 2px; height: 90px; }
        .comet[data-axis="y"][data-dir="1"]::after { bottom: 4px; background: linear-gradient(180deg, transparent, rgb(255 90 31 / .7)); }
        .comet[data-axis="y"][data-dir="-1"]::after { top: 4px; background: linear-gradient(0deg, transparent, rgb(255 90 31 / .7)); }
      `}</style>
    </div>
  );
}
