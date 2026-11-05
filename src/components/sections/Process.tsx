"use client";

import { useEffect, useRef } from "react";
import { process as steps } from "@/content/site";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { SplitReveal } from "../Reveal";
import { ProcessVignette, vignetteStyles } from "../ProcessVignettes";

export function Process() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const pinEl = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      const t = track.current!;
      const p = path.current!;
      const len = p.getTotalLength();
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      const distance = () => t.scrollWidth - window.innerWidth;
      const tl = gsap.timeline({
        scrollTrigger: { trigger: pinEl.current, start: "top top", end: () => `+=${distance() * 1.1}`, pin: pinEl.current, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1 },
      });
      tl.to(t, { x: () => -distance(), ease: "none" }, 0).to(p, { strokeDashoffset: 0, ease: "none" }, 0);
      t.querySelectorAll<HTMLElement>("[data-step]").forEach((s) => {
        gsap.from(s.querySelectorAll("[data-step-in]"), {
          y: 40,
          opacity: 0,
          stagger: 0.06,
          ease: "expo.out",
          duration: 1,
          scrollTrigger: { trigger: s, containerAnimation: tl, start: "left 85%", toggleActions: "play none none reverse" },
        });
      });
    });
    mm.add("(max-width: 899px), (prefers-reduced-motion: reduce)", () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>("[data-step]").forEach((s) =>
        gsap.from(s, { y: 40, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: s, start: "top 88%", once: true } }),
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} id="process" data-theme="dark" className="section-dark relative overflow-hidden" aria-labelledby="process-title">
      <div ref={pinEl} className="flex min-h-[100svh] flex-col justify-center py-24 min-[900px]:py-0">
        <div ref={track} className="relative flex w-full flex-col gap-5 px-[var(--gutter)] min-[900px]:w-max min-[900px]:flex-row min-[900px]:items-center min-[900px]:gap-6">
          {/* hand-drawn connector */}
          <svg className="pointer-events-none absolute left-0 top-1/2 hidden h-[160px] w-full -translate-y-1/2 min-[900px]:block" viewBox="0 0 3000 160" preserveAspectRatio="none" aria-hidden>
            <path
              ref={path}
              d="M0 80 C 150 10, 250 150, 420 80 S 650 10, 820 80 S 1050 150, 1220 80 S 1450 10, 1620 80 S 1850 150, 2020 80 S 2250 10, 2420 80 S 2650 150, 2820 80 L 3000 80"
              fill="none"
              stroke="var(--signal)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <div className="relative shrink-0 min-[900px]:w-[38vw] min-[900px]:pr-8">
            <span className="mono inline-flex items-center gap-2 text-paper/50"><span className="dot" /> How I work</span>
            <SplitReveal as="h2" type="chars" className="display mt-4 text-[clamp(64px,10vw,170px)]">
              <span id="process-title">Brief to launch</span>
            </SplitReveal>
            <p className="mt-6 max-w-[420px] text-[16px] leading-relaxed text-paper/65">
              Seven steps, the same every time. You always know what happens next and what I need from you.
            </p>
          </div>

          {steps.map((s, i) => (
            <article
              key={s.no}
              data-step
              className={`card-dark relative flex shrink-0 flex-col justify-between p-6 min-[900px]:h-[480px] min-[900px]:w-[330px] ${i % 2 ? "min-[900px]:translate-y-14" : "min-[900px]:-translate-y-14"}`}
            >
              <div data-step-in className="flex items-center justify-between">
                <span className="mono text-paper/45">Step {s.no}</span>
                <span className={`grid h-9 w-9 place-items-center rounded-full ${i === 4 ? "bg-signal text-paper" : "shadow-[0_0_0_1px_var(--line-dark)]"}`}>
                  <span className="mono">{i + 1}</span>
                </span>
              </div>
              <div data-step-in className="mt-6">
                <ProcessVignette index={i} />
              </div>
              <div className="mt-6 min-[900px]:mt-0">
                <h3 data-step-in className="display text-[clamp(48px,4.6vw,76px)]">{s.title}</h3>
                <p data-step-in className="mt-4 text-[15px] leading-relaxed text-paper/70">{s.text}</p>
              </div>
            </article>
          ))}
          <div className="hidden w-[10vw] shrink-0 min-[900px]:block" />
        </div>
      </div>
      <style>{vignetteStyles}</style>
    </section>
  );
}
