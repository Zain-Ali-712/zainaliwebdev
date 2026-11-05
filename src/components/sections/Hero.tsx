"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { InkWord } from "@/gl/inkWord";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { site } from "@/content/site";
import { onLoaderDone } from "../Preloader";
import { GuideLines } from "../GuideLines";
import { scrollToId, useLenis } from "../SmoothScroll";

const WORDS = ["DEVELOPER", "DESIGNER"] as const;
/** Empty margin around the word inside the canvas, so the hover lens is never clipped. */
const LENS_PAD = 90;

const GUIDES = [
  { axis: "y" as const, pos: "calc(var(--gutter) + 18%)" },
  { axis: "y" as const, pos: "calc(100% - var(--gutter) - 18%)" },
  { axis: "x" as const, pos: "16%" },
  { axis: "x" as const, pos: "52%" },
  { axis: "x" as const, pos: "86%" },
];

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const wordBox = useRef<HTMLDivElement>(null);
  const [gl, setGl] = useState<"pending" | "on" | "off">("pending");
  const lenis = useLenis();

  // WebGL word (solid ink, dissolve swap).
  useEffect(() => {
    const c = canvas.current!;
    if (!InkWord.supported()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- browser capability is only known after mount
      setGl("off");
      return;
    }
    let w: InkWord;
    try {
      w = new InkWord(c);
    } catch {
      setGl("off");
      return;
    }
    const family = getComputedStyle(document.body).getPropertyValue("--font-anton").trim() || "Impact";
    const layout = () => {
      w.resize();
      w.setWords(WORDS[0], WORDS[1], family, LENS_PAD);
    };
    let alive = true;
    document.fonts.load(`400 100px ${family}`).then(() => {
      if (!alive) return;
      layout();
      w.run();
      setGl("on");
    });
    const ro = new ResizeObserver(() => layout());
    ro.observe(c);

    // Hover lens follows the pointer while it is over the word.
    const box = c.parentElement!;
    const sec = root.current!;
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const b = box.getBoundingClientRect();
      const inside = e.clientX >= b.left && e.clientX <= b.right && e.clientY >= b.top && e.clientY <= b.bottom;
      w.pointer(e.clientX, e.clientY, inside);
    };
    const leave = () => (w.lens.active = 0);
    sec.addEventListener("pointermove", move);
    sec.addEventListener("pointerleave", leave);

    let loop: gsap.core.Timeline | null = null;
    const off = onLoaderDone(() => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(w, { reveal: 1.4 }, { reveal: -0.4, duration: 2.2, ease: "power3.out", delay: 0.15 });
      loop = gsap.timeline({ repeat: -1, delay: 3.4 });
      loop.to(w, { mix: 1, duration: 1.4, ease: "power2.inOut" }).to(w, { mix: 0, duration: 1.4, ease: "power2.inOut" }, "+=2.8").to({}, { duration: 2.8 });
    });

    return () => {
      alive = false;
      off();
      loop?.kill();
      ro.disconnect();
      sec.removeEventListener("pointermove", move);
      sec.removeEventListener("pointerleave", leave);
      w.destroy();
    };
  }, []);

  // DOM intro + scroll choreography.
  useEffect(() => {
    const sec = root.current!;
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return;
      gsap.set("[data-hero-in]", { y: 40, opacity: 0 });
      gsap.set("[data-hero-build]", { y: -26, opacity: 0 });
      gsap.set("[data-hero-photo]", { yPercent: 18, opacity: 0 });
      onLoaderDone(() => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.to("[data-hero-photo]", { yPercent: 0, opacity: 1, duration: 1.8 }, 0.25)
          .to("[data-hero-in]", { y: 0, opacity: 1, duration: 1.3, stagger: 0.08 }, 0.8)
          .to("[data-hero-build]", { y: 0, opacity: 1, duration: 0.9, stagger: 0.07, ease: "back.out(2)" }, 1.15);
        sec.querySelectorAll<HTMLElement>("[data-count-to]").forEach((el) => {
          const to = Number(el.dataset.countTo);
          const o = { v: to > 1000 ? to - 24 : 0 };
          tl.to(o, { v: to, duration: 2, ease: "power3.out", onUpdate: () => (el.textContent = String(Math.round(o.v))) }, 1.1);
        });
      });

      const st = { trigger: sec, start: "top top", end: "bottom top", scrub: true };
      gsap.to(wordBox.current, { yPercent: 24, scale: 1.05, ease: "none", scrollTrigger: st });
      gsap.to("[data-hero-photo-wrap]", { yPercent: -6, ease: "none", scrollTrigger: st });
      gsap.to("[data-hero-drift='l']", { y: -60, ease: "none", scrollTrigger: st });
      gsap.to("[data-hero-drift='r']", { y: -110, ease: "none", scrollTrigger: st });
    }, sec);

    // Gentle mouse parallax on the portrait.
    const photo = sec.querySelector<HTMLElement>("[data-hero-photo]");
    const xTo = photo ? gsap.quickTo(photo, "x", { duration: 1.2, ease: "power3" }) : null;
    const move = (e: PointerEvent) => xTo?.((e.clientX / window.innerWidth - 0.5) * -14);
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      ctx.revert();
      window.removeEventListener("pointermove", move);
    };
  }, []);

  return (
    <section ref={root} id="top" data-theme="light" className="relative overflow-hidden bg-paper pb-10 pt-[88px] md:pb-16" aria-labelledby="hero-title">
      <GuideLines lines={GUIDES} />

      <h1 id="hero-title" className="sr-only">
        Zain Ali, full stack developer and UI/UX designer in Lahore
      </h1>

      <div className="wrap relative">
        {/* Giant word */}
        <div ref={wordBox} className="relative z-[1] mt-2 origin-top md:mt-4" aria-hidden data-cursor="hide">
          <div className="relative w-full" style={{ aspectRatio: "5.3 / 1" }}>
            <canvas
              ref={canvas}
              className={`absolute max-w-none transition-opacity duration-700 ${gl === "on" ? "opacity-100" : "opacity-0"}`}
              style={{ inset: -LENS_PAD, width: `calc(100% + ${LENS_PAD * 2}px)`, height: `calc(100% + ${LENS_PAD * 2}px)` }}
            />
            {gl === "off" && <div className="display absolute inset-0 grid place-items-center text-[19.2vw] leading-none text-ink">{WORDS[0]}</div>}
          </div>
        </div>

        {/* Portrait: free-standing cut-out in front of the word, fading out at the bottom */}
        <div data-hero-photo-wrap className="pointer-events-none relative z-[2] mx-auto -mt-[2vw] w-[min(70vw,340px)] md:-mt-[13.5vw] md:w-[min(30vw,460px)]">
          <div data-hero-photo className="relative aspect-[1200/1791]">
            <Image
              src="/img/zain-cut.webp"
              alt="Zain Ali"
              fill
              priority
              sizes="(max-width: 768px) 70vw, 30vw"
              className="object-contain object-bottom drop-shadow-[0_30px_40px_rgb(11_12_14/0.18)]"
            />
          </div>
        </div>

        {/* Cards row */}
        <div className="relative z-[3] -mt-[24vw] grid gap-4 md:-mt-[19vw] md:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)_minmax(0,1fr)] md:items-end">
          <div data-hero-drift="l" className="order-2 md:order-1">
            <div data-hero-in className="card max-w-[360px] p-5 md:p-6">
              <p className="condensed text-[20px] font-[800] leading-[1.08] md:text-[22px]">
                Hello, I&rsquo;m Zain Ali. A full stack developer and UI/UX designer from Lahore.
              </p>
              <p className="mono mt-5 text-muted">I build</p>
              <ul className="mt-2 grid">
                {site.builds.map((b, i) => (
                  <li key={b} data-hero-build>
                    <span className="group flex items-center justify-between gap-3 border-b border-ink/[0.07] py-[7px] transition-colors duration-300 hover:text-signal">
                      <span className="flex items-baseline gap-3">
                        <span className="mono tabular text-[10px] text-muted transition-colors group-hover:text-signal">{String(i + 1).padStart(2, "0")}</span>
                        <span className="text-[17px] font-semibold tracking-[-0.01em] md:text-[18px]">{b}</span>
                      </span>
                      <span className="translate-x-[-6px] text-[13px] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">↗</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <div data-hero-in className="card relative px-5 pb-6 pt-8 text-center md:px-8 md:pb-8">
              <span className="absolute left-1/2 top-0 grid h-6 w-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-paper shadow-[0_0_0_1px_var(--line)]">
                <span className="dot animate-pulse" />
              </span>
              <p className="condensed mx-auto text-[clamp(26px,2.6vw,40px)] font-[800] leading-[1.02]">
                Websites and web apps,
                <br />
                designed and built
                <br />
                end to end.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button className="btn btn-ink" onClick={() => scrollToId("works", lenis)} data-cursor="view">
                  <span className="btn-label">View work</span>
                </button>
                <button className="btn btn-ghost" onClick={() => scrollToId("contact", lenis)}>
                  <span className="btn-label">Let&rsquo;s talk ↗</span>
                </button>
              </div>
            </div>
          </div>

          <div data-hero-drift="r" className="order-3 grid justify-items-start gap-3 md:justify-items-end">
            {site.stats.map((s, i) => (
              <div
                key={s.label}
                data-hero-in
                className={`group w-[230px] rounded-[14px] p-4 transition-colors duration-300 ${
                  i === 1 ? "bg-ink text-paper shadow-[0_18px_40px_-20px_rgb(0_0_0/0.6)] md:mr-8" : "card hover:![background:var(--signal)] hover:text-paper"
                }`}
              >
                <div className="flex items-baseline gap-0.5">
                  <span className="display tabular text-[40px] leading-none" data-count-to={s.value}>
                    {s.value}
                  </span>
                  <span className={`display text-[26px] leading-none ${i === 1 ? "text-signal" : "text-signal transition-colors group-hover:text-paper"}`}>{s.suffix}</span>
                </div>
                <p className="mt-1.5 text-[13px] font-medium">{s.label}</p>
                <p className={`mono mt-0.5 text-[9.5px] transition-colors ${i === 1 ? "text-paper/55" : "text-muted group-hover:text-paper/80"}`}>{s.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="wrap relative mt-10 flex items-center justify-between md:mt-14">
        <span className="mono text-muted">Scroll to explore</span>
        <span className="mono hidden text-muted md:inline">Portfolio · 2024 — 2026</span>
        <span className="mono text-muted">↓</span>
      </div>
    </section>
  );
}
