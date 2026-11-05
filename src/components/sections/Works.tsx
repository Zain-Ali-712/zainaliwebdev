"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { featured, type Project } from "@/content/projects";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { createStore } from "../works/store";
import { WorkCards } from "../works/WorkCards";
import { Magnetic } from "../Magnetic";
import { useLenis } from "../SmoothScroll";

const Theatre = dynamic(() => import("../works/Theatre"), { ssr: false });

type Tier = "pending" | "full" | "light" | "cards";

function detectTier(): Tier {
  if (prefersReducedMotion()) return "cards";
  if (window.innerWidth < 900) return "cards";
  try {
    const c = document.createElement("canvas");
    if (!c.getContext("webgl2")) return "cards";
  } catch {
    return "cards";
  }
  const cores = navigator.hardwareConcurrency || 4;
  const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 8;
  return cores >= 6 && mem >= 4 ? "full" : "light";
}

const INTRO = 0.13;

// Posters scattered around the WORKS word; dx/dy point away from the centre.
const FLY = [
  { left: "5%", top: "7%", w: "13vw", dx: -1, dy: -0.8, depth: 1.2, rot: -4 },
  { left: "31%", top: "4%", w: "10vw", dx: -0.3, dy: -1, depth: 0.8, rot: 2 },
  { left: "63%", top: "5%", w: "11vw", dx: 0.4, dy: -1, depth: 1, rot: -2 },
  { left: "82%", top: "10%", w: "14vw", dx: 1, dy: -0.7, depth: 1.4, rot: 4 },
  { left: "3%", top: "72%", w: "14vw", dx: -1, dy: 0.8, depth: 1.3, rot: 3 },
  { left: "27%", top: "80%", w: "10vw", dx: -0.4, dy: 1, depth: 0.9, rot: -3 },
  { left: "60%", top: "79%", w: "11vw", dx: 0.4, dy: 1, depth: 1, rot: 2 },
  { left: "83%", top: "70%", w: "13vw", dx: 1, dy: 0.8, depth: 1.2, rot: -4 },
];

export function Works() {
  const [tier, setTier] = useState<Tier>("pending");
  useEffect(() => {
    const set = () => setTier(detectTier());
    set();
    let w = window.innerWidth;
    const onResize = () => {
      if ((w < 900) !== (window.innerWidth < 900)) set();
      w = window.innerWidth;
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <section id="works" aria-labelledby="works-title" className="relative">
      <h2 id="works-title" className="sr-only">Selected work</h2>
      {tier === "pending" ? (
        <div className="h-[100svh] bg-paper" />
      ) : tier === "cards" ? (
        <div key="cards">
          <WorkCards projects={featured} />
        </div>
      ) : (
        <div key={tier}>
          <Screening projects={featured} tier={tier} />
        </div>
      )}
    </section>
  );
}

function Screening({ projects, tier }: { projects: Project[]; tier: Tier }) {
  const root = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLDivElement>(null);
  const oRef = useRef<HTMLSpanElement>(null);
  const hud = useRef<HTMLDivElement>(null);
  const store = useMemo(() => createStore(), []);
  const [active, setActive] = useState(0);
  const [mount3d, setMount3d] = useState(false);
  const stRef = useRef<ScrollTrigger | null>(null);
  const router = useRouter();
  const lenis = useLenis();
  const n = projects.length;

  // Load the 3D chunk when the section gets close.
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setMount3d(true), { rootMargin: "150% 0px" });
    io.observe(root.current!);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = root.current!;
    const ctx = gsap.context(() => {
      const ob = oRef.current!.getBoundingClientRect();
      const wb = word.current!.getBoundingClientRect();
      const ox = ob.left - wb.left + ob.width * 0.12;
      const oy = ob.top - wb.top + ob.height * 0.5;
      gsap.set(word.current, { transformOrigin: `${ox}px ${oy}px` });

      const posters = gsap.utils.toArray<HTMLElement>("[data-fly]", el);
      const snaps = [0, ...projects.map((_, i) => INTRO + (i / (n - 1)) * (1 - INTRO))];
      let last = -1;
      stRef.current = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: () => `+=${window.innerHeight * (n * 0.85 + 1.4)}`,
        pin: true,
        anticipatePin: 1,
        scrub: false,
        snap: { snapTo: snaps, duration: { min: 0.3, max: 0.9 }, delay: 0.08, ease: "power2.inOut" },
        onToggle: (s) => (store.visible = s.isActive),
        onUpdate: (s) => {
          const p = s.progress;
          store.progress = p;
          store.intro = gsap.utils.clamp(0, 1, p / INTRO);
          const a = gsap.utils.clamp(0, 1, (p - INTRO) / (1 - INTRO)) * (n - 1);
          store.active = a;
          const idx = Math.round(a);
          if (idx !== last) {
            last = idx;
            setActive(idx);
          }
          // WORKS zoom through the O, paper → ink
          const z = store.intro;
          gsap.set(word.current, { scale: 1 + Math.pow(z, 3) * 60, opacity: z > 0.92 ? 1 - (z - 0.92) / 0.08 : 1 });
          gsap.set("[data-works-paper]", { opacity: z < 0.55 ? 1 : 1 - (z - 0.55) / 0.2 });
          // posters around the word fly outward past the camera as the zoom runs
          const fly = Math.pow(z, 1.7);
          posters.forEach((pst) => {
            const dx = Number(pst.dataset.dx);
            const dy = Number(pst.dataset.dy);
            const depth = Number(pst.dataset.depth);
            gsap.set(pst, {
              x: dx * fly * window.innerWidth * 0.75,
              y: dy * fly * window.innerHeight * 0.75,
              scale: 1 + fly * depth * 2.6,
              opacity: z > 0.62 ? Math.max(0, 1 - (z - 0.62) / 0.18) : 1,
            });
          });
          gsap.set(hud.current, { opacity: gsap.utils.clamp(0, 1, (p - INTRO * 0.85) / (INTRO * 0.4)) });
        },
      });
      // This pin mounts after later sections created their triggers; re-order and re-measure them.
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
      // reveal the theatre lines
      gsap.from("[data-works-intro-line]", { scaleX: 0, duration: 1.4, stagger: 0.1, ease: "expo.inOut", scrollTrigger: { trigger: el, start: "top 70%", once: true } });
    }, el);
    return () => {
      ctx.revert();
      stRef.current = null;
    };
  }, [n, projects, store]);

  // Pointer for camera parallax + panel lean.
  useEffect(() => {
    const el = root.current!;
    const move = (e: PointerEvent) => {
      store.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      store.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
      store.hoverPanel = document.body.dataset.theatreHover !== undefined;
    };
    el.addEventListener("pointermove", move);
    return () => el.removeEventListener("pointermove", move);
  }, [store]);

  const goTo = (i: number) => {
    const st = stRef.current;
    if (!st) return;
    const p = INTRO + (Math.max(0, Math.min(n - 1, i)) / (n - 1)) * (1 - INTRO);
    const y = st.start + (st.end - st.start) * p + 2;
    if (lenis) lenis.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  // Keyboard: arrows step through projects while the section is pinned.
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (!store.visible || store.intro < 1) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        goTo(Math.round(store.active) + 1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        goTo(Math.round(store.active) - 1);
      } else if (e.key === "Enter") {
        router.push(`/work/${projects[Math.round(store.active)].slug}`);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  });

  // Drag to spin: dragging horizontally scrubs the scroll position.
  useEffect(() => {
    const el = root.current!;
    let startX = 0;
    let startY = 0;
    let dragging = false;
    let moved = false;
    const down = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("a,button")) return;
      dragging = true;
      moved = false;
      startX = e.clientX;
      startY = window.scrollY;
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 6) moved = true;
      if (moved) {
        const st = stRef.current;
        if (!st) return;
        const per = (st.end - st.start) * (1 - INTRO) / (n - 1);
        const y = startY - (dx / window.innerWidth) * per * 2.2;
        if (lenis) lenis.scrollTo(y, { immediate: true });
        else window.scrollTo(0, y);
      }
    };
    const up = () => {
      if (dragging && moved) {
        goTo(Math.round(store.active));
        el.dataset.dragged = "1";
        window.setTimeout(() => delete el.dataset.dragged, 50);
      }
      dragging = false;
    };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  });

  const onOpen = (i: number) => {
    if (root.current?.dataset.dragged) return;
    if (i === Math.round(store.active)) router.push(`/work/${projects[i].slug}`);
    else goTo(i);
  };

  const p = projects[active];

  return (
    <div ref={root} data-theme="dark" className="relative h-[100svh] w-full overflow-hidden bg-ink text-paper" data-cursor="drag">
      {/* 3D */}
      <div className="absolute inset-0">{mount3d && <Theatre projects={projects} store={store} full={tier === "full"} onOpen={onOpen} />}</div>

      {/* intro: paper with WORKS, zooming through the O */}
      <div data-works-paper className="pointer-events-none absolute inset-0 z-[5] bg-paper" />
      <div className="pointer-events-none absolute inset-0 z-[6] overflow-hidden" aria-hidden>
        {FLY.map((f, i) => {
          const pr = projects[i % projects.length];
          return (
            <div
              key={i}
              data-fly
              data-dx={f.dx}
              data-dy={f.dy}
              data-depth={f.depth}
              className="absolute overflow-hidden rounded-[10px] bg-paper-2 shadow-[0_24px_50px_-24px_rgb(11_12_14/0.55)] will-change-transform"
              style={{ left: f.left, top: f.top, width: f.w, aspectRatio: "16 / 10", rotate: `${f.rot}deg` }}
            >
              {pr.media.poster && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={pr.media.screens[0] ?? pr.media.poster} alt="" className="h-full w-full object-cover object-top" loading="lazy" />
              )}
            </div>
          );
        })}
      </div>
      <div className="pointer-events-none absolute inset-0 z-[6] grid place-items-center overflow-hidden">
        <div className="absolute inset-x-0 top-[22%] h-px bg-ink/10" data-works-intro-line />
        <div className="absolute inset-x-0 bottom-[22%] h-px bg-ink/10" data-works-intro-line />
        <div ref={word} className="display whitespace-nowrap text-[27vw] leading-[0.8] text-ink will-change-transform">
          W<span ref={oRef}>O</span>RKS
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-[24%] z-[6] flex justify-between px-[var(--gutter)] text-ink" data-works-paper>
        <span className="mono">Selected work · {String(n).padStart(2, "0")} projects</span>
        <span className="mono">Scroll to enter ↓</span>
      </div>

      {/* HUD */}
      <div ref={hud} className="pointer-events-none absolute inset-0 z-[4] opacity-0">
        {/* left rail */}
        <nav aria-label="Projects" className="pointer-events-auto absolute left-[var(--gutter)] top-1/2 hidden -translate-y-1/2 lg:block">
          <ul className="grid gap-2.5">
            {projects.map((pr, i) => (
              <li key={pr.slug}>
                <button onClick={() => goTo(i)} className="group flex items-center gap-3" aria-current={i === active} aria-label={pr.title}>
                  <span className={`h-px transition-all duration-500 ${i === active ? "w-10 bg-signal" : "w-4 bg-paper/35 group-hover:w-7 group-hover:bg-paper"}`} />
                  <span className={`mono text-[10px] transition-opacity duration-300 ${i === active ? "opacity-100" : "opacity-0 group-hover:opacity-70"}`}>{pr.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* top right: ring map */}
        <div className="absolute right-[var(--gutter)] top-24 hidden items-center gap-4 md:flex">
          <div className="text-right">
            <p className="mono text-paper/50">Screening room</p>
            <p className="mono tabular">{String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</p>
          </div>
          <div className="relative h-16 w-16 rounded-full shadow-[0_0_0_1px_var(--line-dark)]">
            {projects.map((_, i) => {
              const a = ((i - active) / n) * Math.PI * 2 - Math.PI / 2;
              return (
                <span
                  key={i}
                  className={`absolute h-1.5 w-1.5 rounded-full transition-all duration-700 ${i === active ? "bg-signal" : "bg-paper/40"}`}
                  style={{ left: `calc(50% + ${Math.cos(a) * 26}px - 3px)`, top: `calc(50% + ${Math.sin(a) * 26}px - 3px)` }}
                />
              );
            })}
            <span className="absolute left-1/2 top-1/2 h-px w-3 -translate-x-1/2 bg-paper/50" />
            <span className="absolute left-1/2 top-1/2 h-3 w-px -translate-y-1/2 bg-paper/50" />
          </div>
        </div>

        {/* bottom meta */}
        <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(0deg,rgb(11_12_14/0.92),rgb(11_12_14/0.6)_45%,transparent)] pb-7 pt-24">
          <div className="wrap flex flex-wrap items-end justify-between gap-6">
            <div key={p.slug} className="max-w-[760px] [animation:hud-in_.9s_var(--ease-out)_both]">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="mono tabular text-paper/60">{p.year}</span>
                <span className="mono rounded-sm bg-lime px-1.5 py-0.5 text-ink">{p.category}</span>
                {p.place && <span className="mono text-paper/60">{p.place}</span>}
              </div>
              <h3 className="condensed overflow-hidden text-[clamp(40px,5vw,84px)] font-[800] leading-[0.92]">
                <span className="block [animation:hud-rise_1s_var(--ease-out)_both]">{p.title}</span>
              </h3>
              <p className="mt-3 max-w-[560px] text-[15px] leading-relaxed text-paper/70">{p.summary}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.stack.slice(0, 5).map((s) => (
                  <span key={s} className="pill pill-dark text-paper/80">{s}</span>
                ))}
              </div>
              {p.disclaimer && p.showRealBrand && <p className="mono mt-3 text-[9.5px] normal-case tracking-normal text-paper/40">Pitch concept · not affiliated with {p.title}</p>}
            </div>
            <div className="pointer-events-auto flex items-center gap-3">
              <Magnetic>
                <Link href={`/work/${p.slug}`} className="btn btn-paper" data-cursor="open">
                  <span data-magnetic-inner className="btn-label">Open case study ↗</span>
                </Link>
              </Magnetic>
              <Link href="/work" className="mono hidden text-paper/70 underline decoration-paper/30 underline-offset-4 hover:text-signal sm:inline">
                All work ↗
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-[42%] right-[var(--gutter)] hidden flex-col items-center gap-2 text-paper/40 xl:flex">
          <span className="mono [writing-mode:vertical-rl]">Drag · scroll · ← →</span>
        </div>
      </div>

      <style>{`
        @keyframes hud-in { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
        @keyframes hud-rise { from { transform: translateY(105%) } to { transform: none } }
      `}</style>
    </div>
  );
}
