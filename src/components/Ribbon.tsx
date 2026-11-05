"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

export type RibbonPath = { d: string; kind: "thick" | "thin"; width?: number; delay?: number };

/**
 * Orange "rope" strokes and thin hand-drawn lines that draw themselves as the trigger scrolls through.
 * Thick paths get a lighter core stroke so they read as a tube, not a flat line.
 */
export function Ribbon({
  paths,
  viewBox,
  className = "",
  trigger,
  start = "top 85%",
  end = "bottom 35%",
  scrub = 1,
  aspect = "xMidYMid slice",
}: {
  paths: RibbonPath[];
  viewBox: string;
  className?: string;
  trigger?: string;
  start?: string;
  end?: string;
  scrub?: number | boolean;
  aspect?: string;
}) {
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = svg.current!;
    const strokes = Array.from(el.querySelectorAll<SVGPathElement>("[data-draw]"));
    if (prefersReducedMotion()) return;
    strokes.forEach((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = `${len} ${len}`;
      p.style.strokeDashoffset = `${len}`;
    });
    const trig = (trigger && el.closest("section")?.querySelector(trigger)) || el.parentElement || el;
    const tl = gsap.timeline({ scrollTrigger: { trigger: trig, start, end, scrub } });
    strokes.forEach((p) => {
      const delay = Number(p.dataset.delay || 0);
      tl.to(p, { strokeDashoffset: 0, ease: "none", duration: 1 }, delay);
    });
    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [trigger, start, end, scrub]);

  return (
    <svg ref={svg} viewBox={viewBox} preserveAspectRatio={aspect} className={`pointer-events-none ${className}`} aria-hidden>
      {paths.map((p, i) =>
        p.kind === "thick" ? (
          <g key={i}>
            <path data-draw data-delay={p.delay ?? 0} d={p.d} className="ribbon-thick" strokeWidth={p.width ?? 34} />
            <path
              data-draw
              data-delay={p.delay ?? 0}
              d={p.d}
              className="ribbon-thick"
              strokeWidth={(p.width ?? 34) * 0.32}
              style={{ stroke: "#ff8a5c", opacity: 0.55, transform: `translate(${-(p.width ?? 34) * 0.12}px, ${-(p.width ?? 34) * 0.14}px)` }}
            />
          </g>
        ) : (
          <path key={i} data-draw data-delay={p.delay ?? 0} d={p.d} className="ribbon-thin" />
        ),
      )}
    </svg>
  );
}
