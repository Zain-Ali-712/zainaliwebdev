"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, isTouch } from "@/lib/gsap";

/**
 * Dot + lagging ring. Elements opt in with data-cursor="view|play|drag|copy|open".
 * Over [data-cursor-blend] the ring grows into a difference-blend disc.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [on, setOn] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser capability is only known after mount
    if (!isTouch()) setOn(true);
  }, []);

  useEffect(() => {
    if (!on || !dot.current || !ring.current) return;
    document.documentElement.classList.add("has-cursor");
    const d = dot.current;
    const r = ring.current;
    const xd = gsap.quickTo(d, "x", { duration: 0.12, ease: "power3" });
    const yd = gsap.quickTo(d, "y", { duration: 0.12, ease: "power3" });
    const xr = gsap.quickTo(r, "x", { duration: 0.55, ease: "power3" });
    const yr = gsap.quickTo(r, "y", { duration: 0.55, ease: "power3" });
    let state = "";
    let px = -1;
    let py = -1;
    let raf = 0;

    const resolve = (t: HTMLElement | null) => {
      const hit = t?.closest<HTMLElement>("[data-cursor]");
      const blend = t?.closest("[data-cursor-blend]");
      const link = t?.closest("a,button,[role=button],input,textarea,label");
      const next = hit ? hit.dataset.cursor || "" : blend ? "blend" : link ? "link" : "";
      if (next !== state) {
        state = next;
        r.dataset.state = next;
        setLabel(hit ? (hit.dataset.cursor ?? "") : "");
      }
    };
    const move = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      xd(px);
      yd(py);
      xr(px);
      yr(py);
      resolve(e.target as HTMLElement | null);
    };
    // Scrolling moves content under a still pointer; re-check what it is over.
    const onScroll = () => {
      if (raf || px < 0) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        resolve(document.elementFromPoint(px, py) as HTMLElement | null);
      });
    };
    const leave = () => gsap.to([d, r], { opacity: 0, duration: 0.3 });
    const enter = () => gsap.to([d, r], { opacity: 1, duration: 0.3 });
    const down = () => gsap.to(r, { scale: 0.85, duration: 0.2 });
    const up = () => gsap.to(r, { scale: 1, duration: 0.4, ease: "elastic.out(1,0.5)" });

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointerleave", leave);
    document.addEventListener("pointerenter", enter);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      document.removeEventListener("pointerleave", leave);
      document.removeEventListener("pointerenter", enter);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [on]);

  if (!on) return null;

  return (
    <>
      <div
        ref={ring}
        aria-hidden
        className="cursor-ring pointer-events-none fixed left-0 top-0 z-[9998] -ml-[20px] -mt-[20px] grid h-10 w-10 place-items-center rounded-full"
      >
        <span className="mono cursor-label text-[10px] text-paper">{label}</span>
      </div>
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] -ml-[3px] -mt-[3px] h-[6px] w-[6px] rounded-full bg-signal"
      />
      <style>{`
        .cursor-ring { box-shadow: 0 0 0 1px rgb(255 90 31 / .7); transition: width .45s var(--ease-out), height .45s var(--ease-out), margin .45s var(--ease-out), background .3s, box-shadow .3s; }
        .cursor-ring .cursor-label { opacity: 0; transition: opacity .2s; }
        .cursor-ring[data-state="link"] { width: 56px; height: 56px; margin: -28px 0 0 -28px; box-shadow: 0 0 0 1px rgb(255 90 31 / .9); }
        .cursor-ring[data-state="hide"] { visibility: hidden; }
        .cursor-ring[data-state="blend"] { width: 150px; height: 150px; margin: -75px 0 0 -75px; background: #fff; box-shadow: none; mix-blend-mode: difference; }
        .cursor-ring[data-state="view"], .cursor-ring[data-state="play"], .cursor-ring[data-state="drag"], .cursor-ring[data-state="copy"], .cursor-ring[data-state="open"] {
          width: 88px; height: 88px; margin: -44px 0 0 -44px; background: var(--signal); box-shadow: none;
        }
        .cursor-ring[data-state="view"] .cursor-label, .cursor-ring[data-state="play"] .cursor-label, .cursor-ring[data-state="drag"] .cursor-label, .cursor-ring[data-state="copy"] .cursor-label, .cursor-ring[data-state="open"] .cursor-label { opacity: 1; }
      `}</style>
    </>
  );
}
