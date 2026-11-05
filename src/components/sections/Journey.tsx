"use client";

import { journey, reels } from "@/content/site";
import { FadeUp, SplitReveal } from "../Reveal";

export function Journey() {
  return (
    <section id="journey" data-theme="dark" className="section-dark py-[clamp(90px,12vw,170px)]" aria-labelledby="journey-title">
      <div className="wrap">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="mono inline-flex items-center gap-2 text-paper/50"><span className="dot" /> Journey</span>
            <SplitReveal as="h2" type="chars" className="display mt-4 text-[clamp(64px,10vw,170px)]">
              <span id="journey-title">So far</span>
            </SplitReveal>
          </div>
          <p className="max-w-[360px] text-[15px] leading-relaxed text-paper/60">From a first jQuery clone to client platforms and a final year project. Every date here comes from the commit history.</p>
        </div>
        <FadeUp as="div" stagger={0.05} className="border-t border-paper/10">
          {journey.map((j, i) => (
            <div
              key={i}
              className="group relative grid grid-cols-[72px_1fr] items-center gap-x-4 gap-y-1 border-b border-paper/10 py-5 md:grid-cols-[80px_120px_minmax(0,1.5fr)_minmax(0,1fr)_110px] md:py-6"
            >
              <span className="absolute inset-0 origin-left scale-x-0 bg-lime transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-x-100" aria-hidden />
              <span className="mono tabular relative text-paper/40 transition-colors group-hover:text-ink/60">{String(i + 1).padStart(2, "0")}</span>
              <span className="mono relative text-paper/70 transition-colors group-hover:text-ink md:order-none">{j.year}</span>
              <span className="condensed relative col-span-2 text-[clamp(20px,2vw,28px)] font-[800] leading-tight transition-colors group-hover:text-ink md:col-span-1">{j.title}</span>
              <span className="relative col-span-2 text-[14px] text-paper/55 transition-colors group-hover:text-ink/70 md:col-span-1">{j.where}</span>
              <span className="relative hidden justify-self-end md:block">
                <span className="pill pill-dark transition-colors group-hover:text-ink group-hover:[box-shadow:0_0_0_1px_rgb(11_12_14/.3)]">{j.tag}</span>
              </span>
            </div>
          ))}
        </FadeUp>
      </div>
    </section>
  );
}

export function Reels() {
  return (
    <section data-theme="dark" className="section-dark pb-[clamp(90px,12vw,170px)]" aria-labelledby="reels-title">
      <div className="wrap">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-t border-paper/10 pt-12">
          <div>
            <span className="mono inline-flex items-center gap-2 text-paper/50"><span className="dot" /> Content</span>
            <h2 id="reels-title" className="condensed mt-3 text-[clamp(32px,4vw,60px)] font-[800] leading-none">From my LinkedIn</h2>
          </div>
          <a href="https://www.linkedin.com/in/zain-webdev-68ba04365" target="_blank" rel="noreferrer" className="mono text-paper/70 underline decoration-paper/30 underline-offset-4 hover:text-signal">
            Follow on LinkedIn ↗
          </a>
        </div>
        <FadeUp as="div" stagger={0.1} className="no-scrollbar -mx-[var(--gutter)] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
          {reels.map((r) => (
            <figure key={r.src} className="group w-[72vw] shrink-0 snap-center sm:w-[46vw] md:w-auto" data-cursor="play">
              <div className="relative aspect-[9/16] overflow-hidden rounded-[16px] bg-ink-3">
                <video
                  src={r.src}
                  poster={r.poster}
                  muted
                  loop
                  playsInline
                  preload="none"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  onPointerEnter={(e) => e.currentTarget.play().catch(() => {})}
                  onPointerLeave={(e) => e.currentTarget.pause()}
                  onClick={(e) => (e.currentTarget.paused ? e.currentTarget.play().catch(() => {}) : e.currentTarget.pause())}
                />
                <span className="mono pointer-events-none absolute left-3 top-3 rounded-sm bg-paper/90 px-1.5 py-0.5 text-ink">Reel</span>
              </div>
              <figcaption className="mt-3 flex items-center justify-between gap-3">
                <span className="text-[15px] font-medium">{r.title}</span>
                <span className="arrow-btn">▶</span>
              </figcaption>
            </figure>
          ))}
        </FadeUp>
      </div>
    </section>
  );
}
