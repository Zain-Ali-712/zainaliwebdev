"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, SplitText, prefersReducedMotion } from "@/lib/gsap";

type Tag = "h1" | "h2" | "h3" | "p" | "div" | "span";

/** Lines rise out of overflow masks when the element enters the viewport. */
export function SplitReveal({
  as = "h2",
  children,
  className = "",
  delay = 0,
  type = "lines",
  start = "top 88%",
  stagger,
}: {
  as?: Tag;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  type?: "lines" | "chars" | "words";
  start?: string;
  stagger?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as as "div";

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let split: SplitText | null = null;
    let tween: gsap.core.Tween | null = null;
    const build = () => {
      split = SplitText.create(el, {
        type: type === "lines" ? "lines" : `lines,${type}`,
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit(self) {
          const targets = type === "lines" ? self.lines : type === "chars" ? self.chars : self.words;
          tween?.kill();
          tween = gsap.from(targets, {
            yPercent: 115,
            rotate: type === "chars" ? 6 : 0,
            duration: 1.25,
            stagger: stagger ?? (type === "chars" ? 0.025 : type === "words" ? 0.04 : 0.1),
            delay,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start, once: true },
          });
          return tween;
        },
      });
    };
    document.fonts.ready.then(build);
    return () => {
      tween?.scrollTrigger?.kill();
      tween?.kill();
      split?.revert();
    };
  }, [type, delay, start, stagger]);

  return (
    <Tag ref={ref as React.RefObject<HTMLDivElement>} className={className}>
      {children}
    </Tag>
  );
}

/** Children fade and rise in, optionally staggered. */
export function FadeUp({
  children,
  className = "",
  delay = 0,
  y = 34,
  stagger = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  stagger?: number;
  as?: Tag;
}) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as as "div";
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;
    const targets = stagger ? Array.from(el.children) : [el];
    const t = gsap.fromTo(
      targets,
      { y, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, delay, stagger, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 90%", once: true } },
    );
    return () => {
      t.scrollTrigger?.kill();
      t.kill();
    };
  }, [delay, y, stagger]);
  return (
    <Tag ref={ref as React.RefObject<HTMLDivElement>} className={className}>
      {children}
    </Tag>
  );
}

/** Word-by-word colour fill tied to scroll position. */
export function ScrubWords({ children, className = "" }: { children: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = el.querySelectorAll<HTMLElement>("[data-w]");
    if (prefersReducedMotion()) {
      words.forEach((w) => (w.style.opacity = "1"));
      return;
    }
    const t = gsap.fromTo(
      words,
      { opacity: 0.14 },
      { opacity: 1, stagger: 0.08, ease: "none", scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: 0.6 } },
    );
    return () => {
      t.scrollTrigger?.kill();
      t.kill();
    };
  }, []);
  return (
    <p ref={ref} className={className}>
      {children.split(" ").map((w, i) => (
        <span key={i} data-w className="inline-block whitespace-pre transition-colors duration-200 hover:text-signal">
          {w}{" "}
        </span>
      ))}
    </p>
  );
}

export function refreshScroll() {
  ScrollTrigger.refresh();
}
