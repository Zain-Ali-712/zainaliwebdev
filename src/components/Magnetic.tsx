"use client";

import { useEffect, useRef } from "react";
import { gsap, isTouch } from "@/lib/gsap";

/** Switched off for now (v2 review). Set to true to bring the cursor pull back everywhere. */
const MAGNETIC_ENABLED = false;

/** Pulls its child toward the pointer; the inner label travels further than the shell. */
export function Magnetic({
  children,
  strength = 0.35,
  radius = 80,
  className = "",
}: {
  children: React.ReactNode;
  strength?: number;
  radius?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!MAGNETIC_ENABLED || !el || isTouch()) return;
    const shell = el.firstElementChild as HTMLElement | null;
    if (!shell) return;
    const inner = shell.querySelector<HTMLElement>("[data-magnetic-inner]") ?? shell.firstElementChild as HTMLElement | null;
    const xs = gsap.quickTo(shell, "x", { duration: 0.6, ease: "power3" });
    const ys = gsap.quickTo(shell, "y", { duration: 0.6, ease: "power3" });
    const xi = inner ? gsap.quickTo(inner, "x", { duration: 0.6, ease: "power3" }) : null;
    const yi = inner ? gsap.quickTo(inner, "y", { duration: 0.6, ease: "power3" }) : null;
    let active = false;

    const move = (e: PointerEvent) => {
      const b = shell.getBoundingClientRect();
      const cx = b.left + b.width / 2;
      const cy = b.top + b.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const reach = Math.max(b.width, b.height) / 2 + radius;
      if (Math.hypot(dx, dy) < reach) {
        active = true;
        xs(dx * strength);
        ys(dy * strength);
        xi?.(dx * strength * 0.45);
        yi?.(dy * strength * 0.45);
      } else if (active) {
        active = false;
        gsap.to(shell, { x: 0, y: 0, duration: 1, ease: "elastic.out(1,0.35)" });
        if (inner) gsap.to(inner, { x: 0, y: 0, duration: 1, ease: "elastic.out(1,0.35)" });
      }
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [strength, radius]);

  return (
    <span ref={ref} className={`inline-flex ${className}`}>
      {children}
    </span>
  );
}
