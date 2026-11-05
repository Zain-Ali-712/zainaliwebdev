"use client";

import Image from "next/image";
import { services } from "@/content/site";
import { Marquee } from "../Marquee";
import { FadeUp } from "../Reveal";
import { Ribbon, type RibbonPath } from "../Ribbon";

// Starts at the top-right of the first row and zigzags down behind the rows.
const ZIGZAG: RibbonPath[] = [
  {
    kind: "thick",
    width: 26,
    d: "M1330 -30 C 1200 120, 700 60, 380 170 C 160 245, 60 300, 200 330 C 330 360, 300 250, 220 260 C 600 300, 1100 330, 1260 450 C 1380 540, 1100 560, 760 590 C 420 620, 140 650, 180 780 S 600 860, 760 900",
  },
  {
    kind: "thin",
    delay: 0.1,
    d: "M1380 40 C 1180 180, 760 120, 460 230 S 120 380, 360 420 S 1180 400, 1300 520 S 900 660, 520 690 S 200 760, 300 860",
  },
];

function Row({ s, i }: { s: (typeof services)[number]; i: number }) {
  const shifted = i % 2 === 1;
  return (
    <div className={`relative w-full md:w-[86%] ${shifted ? "md:ml-auto" : ""}`}>
      <div
        tabIndex={0}
        className="card group relative flex flex-col gap-5 rounded-[999px] p-3 outline-none max-md:rounded-[28px] md:flex-row md:items-center md:gap-8"
      >
        <div className="flex flex-1 items-start gap-5 px-4 pt-3 md:items-center md:px-8 md:pt-0">
          <span className="mono mt-2 flex items-center gap-2 text-muted transition-colors group-hover:text-signal md:mt-0">
            {s.no}
            <span className="inline-block h-px w-6 bg-current transition-all duration-500 group-hover:w-10" />
          </span>
          <div className="min-w-0">
            <h3 className="condensed relative inline-block text-[clamp(26px,3.3vw,48px)] font-[800] leading-none transition-colors duration-300 group-hover:text-signal">
              {s.title}
              <span className="absolute -bottom-1.5 left-0 h-[3px] w-full origin-left scale-x-0 bg-signal transition-transform duration-500 group-hover:scale-x-100" />
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {s.tags.map((t) => (
                <span key={t} className="pill">
                  <span className="h-1 w-1 rounded-full bg-ink" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="relative h-[150px] w-full shrink-0 overflow-hidden rounded-[999px] bg-paper-2 max-md:rounded-[22px] md:w-[min(36vw,420px)] md:transition-[width] md:duration-700 md:group-hover:w-[min(40vw,470px)]">
          <Image
            src={s.image}
            alt=""
            fill
            sizes="(max-width: 768px) 92vw, 40vw"
            className="scale-[1.06] object-cover object-top transition-transform duration-[1.2s] ease-[var(--ease-out)] group-hover:scale-100"
          />
        </div>
      </div>
    </div>
  );
}

export function Services() {
  return (
    <section id="services" data-theme="light" className="relative overflow-hidden bg-paper py-[clamp(80px,10vw,150px)]" aria-labelledby="services-title">
      <h2 id="services-title" className="sr-only">Services</h2>
      <Marquee speed={55} className="mb-[clamp(48px,7vw,100px)]">
        {Array.from({ length: 3 }).map((_, i) => (
          <span key={i} className="display flex items-center whitespace-nowrap pr-[0.3em] text-[clamp(72px,12.5vw,210px)] text-ink" aria-hidden>
            <span>Services</span>
            <span className="mx-[0.25em] inline-block h-[0.06em] w-[0.5em] bg-ink" />
            <span className="outline-text text-ink/80">Services</span>
            <span className="mx-[0.25em] inline-block h-[0.06em] w-[0.5em] bg-ink" />
          </span>
        ))}
      </Marquee>

      <div className="wrap">
        <FadeUp as="div" className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <p className="max-w-[460px] text-[17px] leading-relaxed text-ink/70">
            One person from brief to launch. Design and code live in the same head, so nothing gets lost between the mockup and the build.
          </p>
          <span className="mono text-muted">04 services</span>
        </FadeUp>
        <div className="relative">
          <Ribbon paths={ZIGZAG} viewBox="0 0 1400 860" className="absolute left-[-4%] top-[-6%] z-0 h-[112%] w-[108%] text-ink/35" start="top 80%" end="bottom 45%" />
          <FadeUp as="div" stagger={0.12} className="relative z-[1] grid gap-5">
            {services.map((s, i) => (
              <Row key={s.no} s={s} i={i} />
            ))}
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
