"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

const LenisContext = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisContext);

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    document.documentElement.classList.add("js");
    // Late fonts and images change section heights; re-measure scroll triggers once they settle.
    const remeasure = () => ScrollTrigger.refresh();
    document.fonts.ready.then(remeasure);
    window.addEventListener("load", remeasure);
    if (prefersReducedMotion()) return () => window.removeEventListener("load", remeasure);

    const l = new Lenis({ lerp: 0.09, wheelMultiplier: 1, syncTouch: false, anchors: { offset: -20 } });
    l.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => l.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the Lenis instance only exists after mount
    setLenis(l);
    (window as unknown as { __lenis?: Lenis }).__lenis = l;

    return () => {
      window.removeEventListener("load", remeasure);
      gsap.ticker.remove(tick);
      l.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

export function scrollToId(id: string, lenis?: Lenis | null) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
  else el.scrollIntoView({ behavior: "smooth" });
}
