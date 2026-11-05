"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { Z_PATH } from "./Monogram";

const LINE = "Designing and building websites that work.";

export const LOADER_DONE = "loader:done";
export function onLoaderDone(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  if ((window as unknown as { __loaderDone?: boolean }).__loaderDone) {
    cb();
    return () => {};
  }
  window.addEventListener(LOADER_DONE, cb, { once: true });
  return () => window.removeEventListener(LOADER_DONE, cb);
}
function finish() {
  (window as unknown as { __loaderDone?: boolean }).__loaderDone = true;
  window.dispatchEvent(new Event(LOADER_DONE));
}

/** Alche-style construction drawing that assembles the Z monogram, then lifts away like a curtain. */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(true);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("za-loaded") === "1";
    } catch {}
    if (seen || prefersReducedMotion()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- browser capability is only known after mount
      setShow(false);
      finish();
      return;
    }
    const el = root.current!;
    const lenis = (window as unknown as { __lenis?: { stop(): void; start(): void } }).__lenis;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";

    const guides = el.querySelectorAll<SVGGeometryElement>("[data-guide]");
    const z = el.querySelector<SVGPathElement>("[data-z]")!;
    const count = el.querySelector<HTMLElement>("[data-count]")!;
    const type = el.querySelector<HTMLElement>("[data-type]")!;
    [...guides, z].forEach((g) => {
      const len = g.getTotalLength();
      g.style.strokeDasharray = `${len}`;
      g.style.strokeDashoffset = `${len}`;
    });

    const counter = { v: 0 };
    const typed = { n: 0 };
    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        try {
          sessionStorage.setItem("za-loaded", "1");
        } catch {}
        document.documentElement.style.overflow = "";
        (window as unknown as { __lenis?: { start(): void } }).__lenis?.start();
        setShow(false);
      },
    });
    tl.to(guides, { strokeDashoffset: 0, duration: 1.3, stagger: 0.05 }, 0)
      .to(typed, { n: LINE.length, duration: 1.4, ease: "none", onUpdate: () => (type.textContent = LINE.slice(0, Math.round(typed.n))) }, 0.3)
      .to(counter, { v: 100, duration: 2.3, ease: "power2.inOut", onUpdate: () => (count.textContent = String(Math.round(counter.v)).padStart(3, "0")) }, 0)
      .to(z, { strokeDashoffset: 0, duration: 1.1, ease: "expo.inOut" }, 0.9)
      .to("[data-dot]", { scale: 1, duration: 0.6, ease: "back.out(3)" }, 1.8)
      .to(guides, { opacity: 0, duration: 0.6 }, 2.2)
      .to("[data-type]", { opacity: 0, y: -10, duration: 0.4 }, 2.3)
      .to("[data-mark]", { scale: 0.5, duration: 0.8, ease: "expo.inOut" }, 2.35)
      .add(finish, 2.75)
      .to(el, { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, 2.75)
      .to("[data-mark]", { y: 120, opacity: 0, duration: 0.8, ease: "expo.inOut" }, 2.75);

    return () => {
      tl.kill();
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (!show) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[10000] grid place-items-center bg-ink text-paper" aria-hidden>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
        <g fill="none" stroke="rgb(243 242 239 / .38)" strokeWidth="1" vectorEffect="non-scaling-stroke">
          <line data-guide x1="0" y1="330" x2="1600" y2="330" />
          <line data-guide x1="1600" y1="670" x2="0" y2="670" />
          <line data-guide x1="0" y1="500" x2="1600" y2="500" opacity=".5" />
          <line data-guide x1="610" y1="0" x2="610" y2="1000" />
          <line data-guide x1="990" y1="1000" x2="990" y2="0" />
          <line data-guide x1="430" y1="1000" x2="1170" y2="0" />
          <line data-guide x1="452" y1="1000" x2="1192" y2="0" opacity=".5" />
          <circle data-guide cx="800" cy="500" r="250" />
          <circle data-guide cx="800" cy="500" r="170" opacity=".5" />
          <line data-guide x1="0" y1="342" x2="1600" y2="342" opacity=".35" />
          <line data-guide x1="1600" y1="658" x2="0" y2="658" opacity=".35" />
        </g>
      </svg>
      <div data-mark className="relative">
        <svg width="220" height="220" viewBox="0 0 100 100">
          <path data-z d={Z_PATH} fill="none" stroke="currentColor" strokeWidth="9" strokeLinecap="square" />
          <circle data-dot cx="86" cy="18" r="6.5" fill="var(--signal)" style={{ transform: "scale(0)", transformOrigin: "86px 18px" }} />
        </svg>
      </div>
      <p data-type className="mono absolute left-1/2 top-[calc(50%+150px)] w-max -translate-x-1/2 text-[11px] text-paper/80" />
      <div className="mono absolute bottom-6 left-[var(--gutter)] text-paper/50">Zain Ali · Portfolio 2026</div>
      <div data-count className="display tabular absolute bottom-4 right-[var(--gutter)] text-[clamp(56px,9vw,140px)] text-paper">
        000
      </div>
    </div>
  );
}
