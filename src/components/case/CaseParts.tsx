"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Project } from "@/content/projects";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { ProjectCover } from "../ProjectCover";
import { SplitReveal } from "../Reveal";

export function CaseHero({ p }: { p: Project }) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-case-media]", { clipPath: "inset(14% 8% 0% 8% round 22px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1.6, ease: "expo.inOut", delay: 0.1 });
      gsap.to("[data-case-media] > *", { yPercent: 12, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} data-theme="dark" className="section-dark relative overflow-hidden pt-28">
      <div className="wrap pb-10">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <Link href="/#works" className="mono text-paper/60 hover:text-signal">← Work</Link>
          <span className="mono text-paper/30">/</span>
          <span className="mono rounded-sm bg-lime px-1.5 py-0.5 text-ink">{p.category}</span>
          <span className="mono text-paper/60">{p.year}</span>
        </div>
        <SplitReveal as="h1" type="chars" className="display text-[clamp(64px,13vw,230px)]" start="top 100%">
          {p.title}
        </SplitReveal>
        <p className="mt-6 max-w-[640px] text-[clamp(17px,1.5vw,21px)] leading-relaxed text-paper/75">{p.summary}</p>
      </div>
      <div data-case-media className="relative aspect-[16/10] w-full overflow-hidden bg-ink-3 md:aspect-[16/8]">
        <div className="absolute inset-0 -top-[8%] h-[116%]">
          {p.media.loop ? (
            <video src={p.media.loop} poster={p.media.poster} autoPlay muted loop playsInline className="h-full w-full object-cover" />
          ) : (
            <ProjectCover p={p} sizes="100vw" />
          )}
        </div>
      </div>
    </section>
  );
}

export function Gallery({ p }: { p: Project }) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const pinEl = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = pinEl.current!;
    const t = track.current!;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      const dist = () => Math.max(0, t.scrollWidth - window.innerWidth);
      gsap.to(t, { x: () => -dist(), ease: "none", scrollTrigger: { trigger: el, start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true } });
    });
    return () => mm.revert();
  }, []);
  return (
    <section ref={root} data-theme="dark" className="section-dark overflow-hidden">
      <div ref={pinEl} className="flex min-h-[100svh] flex-col justify-center py-20">
        <div className="wrap mb-8 flex items-end justify-between">
          <span className="mono inline-flex items-center gap-2 text-paper/50"><span className="dot" /> Screens</span>
          <span className="mono text-paper/40">{p.media.screens.length} views · desktop</span>
        </div>
        <div className="no-scrollbar overflow-x-auto min-[900px]:overflow-visible">
          <div ref={track} className="flex w-max gap-5 px-[var(--gutter)]">
            {p.media.screens.map((src, k) => (
              <figure key={src} className="w-[82vw] shrink-0 sm:w-[64vw] min-[900px]:w-[52vw]">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[14px] bg-ink-3 ring-1 ring-paper/10">
                  <Image src={src} alt={`${p.title}, screen ${k + 1}`} fill sizes="(max-width:900px) 82vw, 52vw" className="object-cover object-top" />
                </div>
                <figcaption className="mono mt-3 text-paper/40">{String(k + 1).padStart(2, "0")}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function NextProject({ p }: { p: Project }) {
  return (
    <section data-theme="light" className="bg-paper">
      <Link href={`/work/${p.slug}`} className="group block" data-cursor="open">
        <div className="wrap flex flex-wrap items-end justify-between gap-6 pb-10 pt-20">
          <div>
            <span className="mono text-muted">Next project</span>
            <p className="display mt-3 text-[clamp(56px,10vw,170px)] transition-colors duration-500 group-hover:text-signal">{p.title}</p>
          </div>
          <span className="arrow-btn mb-4 h-14 w-14 text-xl">↗</span>
        </div>
        <div className="wrap">
          <div className="relative aspect-[16/6] overflow-hidden rounded-t-[18px] bg-paper-2">
            <ProjectCover p={p} sizes="100vw" className="transition-transform duration-[1.4s] ease-[var(--ease-out)] group-hover:scale-[1.04]" />
          </div>
        </div>
      </Link>
    </section>
  );
}
