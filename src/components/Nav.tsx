"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { nav, site } from "@/content/site";
import { Monogram } from "./Monogram";
import { SocialIcons } from "./SocialIcons";
import { scrollToId, useLenis } from "./SmoothScroll";
import { LahoreClock } from "./LahoreClock";

export function Nav() {
  const bar = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  const lenis = useLenis();
  const pathname = usePathname();
  const router = useRouter();
  const onHome = pathname === "/";

  // Hide on scroll down, show on scroll up.
  useEffect(() => {
    const el = bar.current!;
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const hide = y > 200 && y > last && !open;
      gsap.to(el, { yPercent: hide ? -130 : 0, duration: 0.6, ease: "expo.out", overwrite: true });
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  // Flip colours while a dark section sits under the bar.
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const hit = document
        .elementsFromPoint(window.innerWidth / 2, 36)
        .find((e) => !bar.current?.contains(e) && (e as HTMLElement).closest?.("[data-theme]"));
      const theme = (hit as HTMLElement | undefined)?.closest<HTMLElement>("[data-theme]")?.dataset.theme;
      setDark(theme === "dark");
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    const id = window.setInterval(check, 1200);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearInterval(id);
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  // Menu open/close.
  useEffect(() => {
    const m = menu.current;
    if (!m) return;
    if (open) {
      lenis?.stop();
      gsap.set(m, { display: "block" });
      gsap.fromTo(m, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.9, ease: "expo.inOut" });
      gsap.fromTo(m.querySelectorAll("[data-menu-item]"), { yPercent: 110 }, { yPercent: 0, stagger: 0.06, delay: 0.35, duration: 1 });
      m.querySelectorAll<SVGPathElement>("[data-menu-ribbon]").forEach((p, i) => {
        const len = p.getTotalLength();
        gsap.fromTo(p, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.6, delay: 0.45 + i * 0.2, ease: "power3.inOut" });
      });
    } else {
      lenis?.start();
      gsap.to(m, { clipPath: "inset(0 0 100% 0)", duration: 0.7, ease: "expo.inOut", onComplete: () => gsap.set(m, { display: "none" }) });
    }
  }, [open, lenis]);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    if (onHome) window.setTimeout(() => scrollToId(id, lenis), 450);
    else router.push(`/#${id}`);
  };

  const tone = dark || open ? "text-paper" : "text-ink";

  return (
    <>
      <header ref={bar} className={`fixed inset-x-0 top-0 z-[60] transition-colors duration-500 ${tone}`}>
        <div className="wrap flex h-[72px] items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Zain Ali, home" onClick={() => setOpen(false)}>
            <Monogram size={26} />
            <span className="condensed text-[19px] font-[800] leading-none tracking-tight">Zain Ali</span>
          </Link>

          <nav aria-label="Social" className="hidden md:block">
            <SocialIcons tone={dark || open ? "dark" : "light"} size={36} />
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {site.available && (
              <span className="mono hidden items-center gap-2 text-[10.5px] sm:inline-flex">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
                </span>
                Available for work
              </span>
            )}
            {site.cvUrl && (
              <a href={site.cvUrl} className="btn btn-ink hidden h-10 lg:inline-flex">
                <span className="btn-label">Download CV</span>
              </a>
            )}
            <button
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-controls="site-menu"
                className={`group flex h-10 items-center gap-2.5 rounded-[10px] px-3.5 ${dark || open ? "bg-paper text-ink" : "bg-ink text-paper"}`}
              >
                <span className="mono text-[11px]">{open ? "Close" : "Menu"}</span>
                <span className="relative grid h-3 w-3.5 content-between">
                  <span className={`h-[1.5px] w-full bg-current transition-transform duration-500 ${open ? "translate-y-[5px] rotate-45" : ""}`} />
                  <span className={`h-[1.5px] w-full bg-current transition-transform duration-500 ${open ? "-translate-y-[5px] -rotate-45" : ""}`} />
                </span>
              </button>
          </div>
        </div>
      </header>

      <div
        ref={menu}
        id="site-menu"
        className="section-dark fixed inset-0 z-[55] hidden overflow-hidden pb-8 pt-28"
        style={{ clipPath: "inset(0 0 100% 0)" }}
        data-lenis-prevent
      >
        <div className="wrap grid h-full gap-10 lg:grid-cols-12">
          <ul className="grid content-start gap-1 lg:col-span-7">
            {nav.map((n, i) => (
              <li key={n.id} className="line-mask">
                <button data-menu-item onClick={() => go(n.id)} className="group flex w-full items-baseline gap-4 text-left">
                  <span className="mono text-paper/40">0{i + 1}</span>
                  <span className="display text-[clamp(48px,8.4vw,124px)] transition-colors duration-300 group-hover:text-signal">{n.label}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="relative hidden flex-col justify-between border-l border-paper/10 pl-10 lg:col-span-5 lg:flex">
            {/* top-right pattern: construction circle + ribbon curl */}
            <svg viewBox="0 0 420 300" className="pointer-events-none absolute right-0 top-0 h-[300px] w-[420px]" aria-hidden>
              <g fill="none" stroke="rgb(243 242 239 / .14)" strokeWidth="1">
                <circle cx="300" cy="120" r="96" />
                <circle cx="300" cy="120" r="56" />
                <line x1="160" y1="120" x2="420" y2="120" />
                <line x1="300" y1="0" x2="300" y2="260" />
              </g>
              <path data-menu-ribbon d="M30 40 C 140 10, 210 90, 250 140 S 330 230, 300 190 S 240 120, 320 90 S 420 110, 410 40" fill="none" stroke="var(--signal)" strokeWidth="14" strokeLinecap="round" />
              <path data-menu-ribbon d="M10 250 C 90 200, 160 260, 220 230 S 300 160, 360 220" fill="none" stroke="rgb(243 242 239 / .55)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>

            <div className="mt-auto grid gap-6">
              <p className="mono text-paper/45">Contact</p>
              <a href={`mailto:${site.email}`} className="text-[clamp(18px,1.6vw,24px)] text-paper underline decoration-signal underline-offset-[6px] hover:text-signal">
                {site.email}
              </a>
              <SocialIcons tone="dark" size={42} />
              <div className="flex items-end justify-between gap-4 border-t border-paper/10 pt-6">
                <span className="flex items-center gap-3">
                  <Monogram size={30} />
                  <span className="condensed text-[30px] font-[800] leading-none">Zain Ali</span>
                </span>
                <span className="mono text-paper/50">
                  Lahore · <LahoreClock />
                </span>
              </div>
            </div>
          </div>

          {/* small screens: compact contact row */}
          <div className="grid gap-4 self-end lg:hidden">
            <a href={`mailto:${site.email}`} className="text-lg underline decoration-signal underline-offset-4">{site.email}</a>
            <SocialIcons tone="dark" size={40} />
          </div>
        </div>
      </div>
    </>
  );
}
