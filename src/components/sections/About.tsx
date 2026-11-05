"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, isTouch, prefersReducedMotion } from "@/lib/gsap";
import { site } from "@/content/site";
import { FadeUp, ScrubWords, SplitReveal } from "../Reveal";
import { Ribbon, type RibbonPath } from "../Ribbon";

const STATEMENT_RIBBONS: RibbonPath[] = [
  {
    kind: "thick",
    width: 30,
    d: "M-80 640 C 160 560, 320 720, 540 668 S 820 560, 880 640 S 820 760, 740 700 S 860 600, 1060 640 S 1360 720, 1530 610",
  },
  {
    kind: "thin",
    delay: 0.15,
    d: "M-40 70 C 220 40, 380 130, 560 90 S 900 20, 1080 80 C 1180 120, 1120 170, 1050 140 C 990 110, 1100 50, 1240 70 S 1440 130, 1500 100",
  },
];

export function Statement() {
  return (
    <section data-theme="light" className="relative overflow-hidden bg-paper py-[clamp(80px,14vw,200px)]" aria-label="Statement">
      <Ribbon paths={STATEMENT_RIBBONS} viewBox="0 0 1440 720" className="absolute inset-0 h-full w-full text-ink/40" start="top 90%" end="bottom 20%" />
      <div className="wrap relative">
        <div className="mx-auto max-w-[1180px] text-center">
          <span className="mono mb-8 inline-flex items-center gap-2 text-muted"><span className="dot" /> What I do</span>
          <ScrubWords className="condensed text-[clamp(30px,4.6vw,72px)] font-[800] leading-[1.02]">
            I turn a business into a website people actually use. Real menus, real bookings, real dashboards, designed with care and built to load fast on every phone.
          </ScrubWords>
        </div>
      </div>
    </section>
  );
}

/** Portrait card that tilts toward the cursor, with a soft glare. */
function TiltPortrait() {
  const card = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = card.current!;
    if (isTouch() || prefersReducedMotion()) return;
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.8, ease: "power3" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.8, ease: "power3" });
    const glare = el.querySelector<HTMLElement>("[data-glare]")!;
    const move = (e: PointerEvent) => {
      const b = el.getBoundingClientRect();
      const px = (e.clientX - b.left) / b.width - 0.5;
      const py = (e.clientY - b.top) / b.height - 0.5;
      rx(-py * 12);
      ry(px * 14);
      glare.style.background = `radial-gradient(60% 50% at ${(px + 0.5) * 100}% ${(py + 0.5) * 100}%, rgb(255 255 255 / .45), transparent 70%)`;
      glare.style.opacity = "1";
    };
    const leave = () => {
      rx(0);
      ry(0);
      glare.style.opacity = "0";
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);
  return (
    <div className="[perspective:1000px]">
      <div ref={card} data-about-img className="relative aspect-[4/5] overflow-hidden rounded-[18px] [transform-style:preserve-3d]" style={{ background: "linear-gradient(160deg, #ecebe7 0%, #dcd8d1 100%)" }}>
        <div className="absolute inset-0 grid-lines opacity-60" aria-hidden />
        <div className="absolute inset-x-[6%] bottom-0 top-[6%] [transform:translateZ(40px)]">
          <Image src="/img/zain-cut.webp" alt="Portrait of Zain Ali" fill sizes="(max-width: 768px) 92vw, 33vw" className="object-contain object-bottom" />
        </div>
        <span className="mono absolute left-4 top-4 text-ink/50">Zain Ali · 2026</span>
        <span className="absolute right-4 top-4 dot" />
        <div data-glare className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300" aria-hidden />
      </div>
    </div>
  );
}

export function About() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = root.current!;
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-about-img]",
        { clipPath: "inset(18% 12% 18% 12% round 18px)" },
        { clipPath: "inset(0% 0% 0% 0% round 18px)", ease: "none", scrollTrigger: { trigger: "[data-about-img]", start: "top 90%", end: "center 55%", scrub: 0.8 } },
      );
      const sig = el.querySelector<HTMLElement>("[data-sig]");
      if (sig) gsap.fromTo(sig, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 2.2, ease: "power2.inOut", scrollTrigger: { trigger: sig, start: "top 90%", once: true } });
      gsap.to("[data-badge]", { rotate: 360, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1 } });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="about" data-theme="light" className="relative bg-paper pb-[clamp(80px,12vw,180px)]" aria-labelledby="about-title">
      <div className="wrap grid gap-10 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-5 lg:col-span-4">
          <div className="relative">
            <TiltPortrait />
            <div data-badge className="absolute -bottom-10 -right-4 grid h-[132px] w-[132px] place-items-center md:-right-10" aria-hidden>
              <svg viewBox="0 0 132 132" className="absolute inset-0">
                <defs>
                  <path id="badge-circle" d="M66,66 m-52,0 a52,52 0 1,1 104,0 a52,52 0 1,1 -104,0" />
                </defs>
                <circle cx="66" cy="66" r="64" fill="var(--paper)" />
                <text className="mono" fill="var(--ink)" fontSize="9.5" letterSpacing="2.4">
                  <textPath href="#badge-circle">BUILDING SINCE FEB 2024 · LAHORE · PAKISTAN ·</textPath>
                </text>
              </svg>
              <span className="relative grid h-11 w-11 place-items-center rounded-full bg-signal text-paper">↗</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-7 md:pl-6 lg:col-span-7 lg:col-start-6">
          <span className="mono inline-flex items-center gap-2 text-muted"><span className="dot" /> About</span>
          <SplitReveal as="h2" className="display mt-4 text-[clamp(56px,8.4vw,136px)]" type="chars">
            <span id="about-title">Hi, I&rsquo;m Zain</span>
          </SplitReveal>
          <FadeUp className="mt-8 grid gap-5 text-[17px] leading-[1.6] text-ink/80 md:text-[18px]" stagger={0.08}>
            <p>
              I&rsquo;m a final-year Software Engineering student at COMSATS Lahore, and I&rsquo;ve been building for the web since February 2024. I design and develop websites and web apps end to end: the research, the interface, the front end and the back end.
            </p>
            <p>
              Most of my recent work is for restaurants, cafés and service businesses: sites with real menus, carts, bookings and branch maps, built from the brand&rsquo;s own data. I&rsquo;ve worked with clients in New Zealand, Norway and Pakistan, and I led my final year project, SyncUP.
            </p>
            <p className="text-ink">And yes, I write Urdu poetry.</p>
          </FadeUp>

          <FadeUp className="mt-10 grid gap-4 sm:grid-cols-2" stagger={0.1}>
            <div className="card p-5">
              <span className="mono text-muted">Education</span>
              <p className="condensed mt-2 text-[22px] font-[800] leading-tight">{site.education.degree}</p>
              <p className="mt-1 text-[14px] text-ink/70">{site.education.school}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="pill">{site.education.session}</span>
                <span className="pill"><span className="dot" /> Graduating {site.education.graduating}</span>
              </div>
            </div>
            <div className="card flex flex-col justify-between p-5">
              <span className="mono text-muted">Roles</span>
              <div className="mt-2 grid gap-1">
                {site.roles.map((r) => (
                  <p key={r} className="condensed text-[22px] font-[800] leading-tight">{r}</p>
                ))}
              </div>
              <div className="mt-4 h-[84px] w-[150px]">
                <Image data-sig src="/img/signature.png" alt="Zain Ali's signature" width={272} height={270} className="h-full w-auto object-contain object-left" />
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
