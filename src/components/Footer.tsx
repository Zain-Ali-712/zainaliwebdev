"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { nav, site } from "@/content/site";
import { useLenis } from "./SmoothScroll";
import { SocialIcons } from "./SocialIcons";

/** Sizes a single line of text so it spans its container exactly. */
function useFitText<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current!;
    const fit = () => {
      el.style.fontSize = "100px";
      const w = el.scrollWidth;
      const parent = el.parentElement!;
      const cs = getComputedStyle(parent);
      const target = parent.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      el.style.fontSize = `${(100 * target) / w}px`;
    };
    fit();
    document.fonts.ready.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(el.parentElement!);
    return () => ro.disconnect();
  }, []);
  return ref;
}

export function Footer() {
  const root = useRef<HTMLElement>(null);
  const word = useFitText<HTMLDivElement>();
  const lenis = useLenis();

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-foot-letter]", {
        yPercent: 105,
        stagger: 0.045,
        duration: 1.4,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-foot-word]", start: "top 96%", once: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const toTop = () => (lenis ? lenis.scrollTo(0, { duration: 2.2 }) : window.scrollTo({ top: 0, behavior: "smooth" }));

  return (
    <footer ref={root} data-theme="dark" className="relative isolate overflow-hidden bg-black text-paper">
      {/* quiet dot texture */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.16]"
        style={{ backgroundImage: "radial-gradient(rgb(243 242 239 / .55) 1px, transparent 1px)", backgroundSize: "22px 22px", maskImage: "linear-gradient(180deg, #000 0%, transparent 70%)" }}
      />

      <div className="wrap grid gap-10 border-b border-paper/10 pb-10 pt-20 md:grid-cols-3">
        <div>
          <p className="mono text-paper/50">Pages</p>
          <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 text-[14px]">
            {nav.map((n) => (
              <li key={n.id}>
                <Link href={`/#${n.id}`} className="text-paper/80 hover:text-signal">{n.label}</Link>
              </li>
            ))}
            <li><Link href="/work" className="text-paper/80 hover:text-signal">All work</Link></li>
          </ul>
        </div>
        <div className="flex justify-start md:justify-center">
          <button onClick={toTop} className="grid h-14 w-14 place-items-center rounded-full bg-signal text-paper transition-transform duration-500 hover:-translate-y-1" aria-label="Back to top">
            <span className="text-xl">↑</span>
          </button>
        </div>
        <div className="grid gap-3 md:justify-items-end">
          <p className="mono text-paper/50">Elsewhere</p>
          <SocialIcons tone="dark" size={40} />
          <a href={`mailto:${site.email}`} className="text-[14px] text-lime hover:underline">{site.email}</a>
        </div>
      </div>

      <div data-foot-word className="relative overflow-hidden px-[var(--gutter)] pt-[3vw]" aria-hidden data-cursor-blend>
        <div
          ref={word}
          className="w-max whitespace-nowrap font-[900] uppercase leading-[0.8] tracking-[-0.045em] text-paper"
          style={{ fontFamily: "var(--font-archivo)", fontStretch: "125%", fontVariationSettings: '"wdth" 125' }}
        >
          {"Zain Ali".split("").map((ch, i) => (
            <span key={i} data-foot-letter className="inline-block">
              {ch === " " ? " " : ch}
            </span>
          ))}
        </div>
      </div>

      <div className="wrap flex flex-wrap items-center justify-between gap-3 py-6 text-paper/45">
        <span className="mono">© 2026 Zain Ali · Designed and built in Lahore</span>
        <span className="mono normal-case tracking-normal">Concept work is unsolicited and not affiliated with the brands shown.</span>
      </div>
    </footer>
  );
}
