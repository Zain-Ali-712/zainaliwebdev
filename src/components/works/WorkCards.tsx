"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Project } from "@/content/projects";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/** Small screens, low-power devices and reduced motion: sticky stacking cards with autoplaying loops. */
export function WorkCards({ projects }: { projects: Project[] }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!;
    const videos = el.querySelectorAll<HTMLVideoElement>("video");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting && !prefersReducedMotion()) v.play().catch(() => {});
          else v.pause();
        }),
      { threshold: 0.4 },
    );
    videos.forEach((v) => io.observe(v));

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return;
      const cards = gsap.utils.toArray<HTMLElement>("[data-stack-card]");
      cards.forEach((c, i) => {
        if (i === cards.length - 1) return;
        gsap.to(c.firstElementChild, {
          scale: 0.9,
          opacity: 0.35,
          ease: "none",
          scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top 18%", scrub: true },
        });
      });
    }, el);
    return () => {
      io.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <div ref={root} data-theme="dark" className="section-dark pb-16 pt-24">
      <div className="wrap">
        <div className="mb-10 flex items-end justify-between">
          <h3 className="display text-[22vw] leading-[0.8] sm:text-[16vw]">Works</h3>
          <span className="mono mb-2 text-paper/50">{String(projects.length).padStart(2, "0")} projects</span>
        </div>
        <div className="grid gap-6">
          {projects.map((p, i) => (
            <div key={p.slug} data-stack-card className="sticky" style={{ top: `${76 + i * 8}px` }}>
              <Link href={`/work/${p.slug}`} className="card-dark block origin-top overflow-hidden p-3" data-cursor="view">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[10px] bg-ink-3">
                  {p.media.loopSm ? (
                    <video src={p.media.loopSm} poster={p.media.poster} muted loop playsInline preload="metadata" className="h-full w-full object-cover" />
                  ) : p.media.poster ? (
                    <Image src={p.media.poster} alt={`${p.title} screenshot`} fill sizes="92vw" className="object-cover object-top" />
                  ) : null}
                  <span className="mono absolute left-3 top-3 rounded-sm bg-lime px-1.5 py-0.5 text-ink">{p.category}</span>
                </div>
                <div className="flex items-end justify-between gap-4 px-2 pb-2 pt-4">
                  <div className="min-w-0">
                    <p className="mono text-paper/50">{String(i + 1).padStart(2, "0")} · {p.year}</p>
                    <h4 className="condensed mt-1 text-[clamp(28px,7vw,44px)] font-[800] leading-none">{p.title}</h4>
                    <p className="mt-2 line-clamp-2 text-[14px] text-paper/65">{p.summary}</p>
                  </div>
                  <span className="arrow-btn shrink-0">↗</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
