"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

/** Endless marquee whose speed, direction and skew follow scroll velocity. */
export function Marquee({ children, speed = 60, className = "" }: { children: React.ReactNode; speed?: number; className?: string }) {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current!;
    if (prefersReducedMotion()) return;
    const half = () => el.scrollWidth / 2;
    let x = 0;
    let dir = -1;
    let boost = 0;
    const skewTo = gsap.quickTo(el, "skewX", { duration: 0.6, ease: "power3" });
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (s) => {
        const v = s.getVelocity();
        dir = v < 0 ? 1 : -1;
        boost = Math.min(Math.abs(v) / 40, 18);
        skewTo(gsap.utils.clamp(-8, 8, -v / 300));
      },
    });
    const tick = (_t: number, dt: number) => {
      x += dir * (speed + boost * speed * 0.35) * (dt / 1000);
      boost *= 0.94;
      const w = half();
      if (x <= -w) x += w;
      if (x > 0) x -= w;
      gsap.set(el, { x });
      if (Math.abs(boost) < 0.2) skewTo(0);
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      st.kill();
    };
  }, [speed]);

  return (
    <div className={`overflow-hidden ${className}`}>
      <div ref={track} className="marquee">
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
