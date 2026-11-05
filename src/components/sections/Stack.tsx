"use client";

import { useEffect, useRef } from "react";
import { alsoUsed, stack } from "@/content/site";
import { projects } from "@/content/projects";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { Marquee } from "../Marquee";
import { SplitReveal } from "../Reveal";

const usedIn = (tool: string) => {
  const key = tool.toLowerCase().replace(/\s|css|\.js/g, "");
  return projects.filter((p) => p.stack.some((s) => s.toLowerCase().replace(/\s|css|\.js|\d+/g, "").startsWith(key))).length;
};

/** Colour bands from the intro reel, stacking up as you scroll. */
export function Stack() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = root.current!;
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-band]").forEach((b, i) => {
        gsap.fromTo(
          b,
          { yPercent: 70 + i * 6, rotate: i % 2 ? 2.5 : -2.5 },
          { yPercent: 0, rotate: 0, ease: "power2.out", scrollTrigger: { trigger: b, start: "top bottom", end: "top 62%", scrub: 0.8 } },
        );
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="stack" data-theme="light" className="relative overflow-hidden bg-paper py-[clamp(90px,12vw,170px)]" aria-labelledby="stack-title">
      <div className="wrap grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <span className="mono inline-flex items-center gap-2 text-muted"><span className="dot" /> Stack</span>
            <SplitReveal as="h2" className="display mt-4 text-[clamp(60px,8vw,130px)]">
              <span id="stack-title">Tools I ship with</span>
            </SplitReveal>
            <p className="mt-6 max-w-[380px] text-[16px] leading-relaxed text-ink/65">
              A small, modern stack I know deeply, so the time goes into the product, not the setup.
            </p>
          </div>
        </div>
        <ul className="grid lg:col-span-8">
          {stack.map((s, i) => (
            <li
              key={s.name}
              data-band
              className="relative -mt-px flex min-h-[96px] items-end justify-between gap-4 px-5 pb-4 pt-3 md:min-h-[118px] md:px-7"
              style={{ background: s.color, color: s.ink, zIndex: i }}
            >
              <div className="absolute left-5 right-5 top-3 flex justify-between md:left-7 md:right-7">
                <span className="mono opacity-70">{String(i + 1).padStart(2, "0")} / {String(stack.length).padStart(2, "0")}</span>
                <span className="mono hidden text-right opacity-70 sm:block">
                  Hex {s.hex}
                  <br />
                  RGB {s.rgb}
                </span>
              </div>
              <span className="text-[clamp(34px,5vw,64px)] font-[600] leading-none tracking-[-0.03em]">{s.name}</span>
              <span className="mono mb-1 opacity-70">{usedIn(s.name) || "—"} projects</span>
            </li>
          ))}
        </ul>
      </div>
      <Marquee speed={40} className="mt-16 border-y border-ink/10 py-4">
        {alsoUsed.map((t) => (
          <span key={t} className="mono flex items-center gap-4 whitespace-nowrap px-5 text-[13px] text-ink/70">
            {t} <span className="dot" />
          </span>
        ))}
      </Marquee>
    </section>
  );
}
