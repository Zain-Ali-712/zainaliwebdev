/** Small animated line-art scenes, one per process step. Drawn in code so they match the site exactly. */

const P = "rgb(243 242 239 / .55)"; // line
const P2 = "rgb(243 242 239 / .18)"; // faint
const O = "var(--signal)";

function Brief() {
  return (
    <svg viewBox="0 0 260 140" className="h-full w-full">
      <g className="vg-pop" style={{ animationDelay: "0s" }}>
        <rect x="14" y="16" width="150" height="34" rx="12" fill="none" stroke={P} />
        <rect x="28" y="28" width="90" height="4" rx="2" fill={P} />
        <rect x="28" y="37" width="60" height="4" rx="2" fill={P2} />
      </g>
      <g className="vg-pop" style={{ animationDelay: ".6s" }}>
        <rect x="96" y="60" width="150" height="34" rx="12" fill={O} />
        <rect x="110" y="72" width="100" height="4" rx="2" fill="#0b0c0e" opacity=".55" />
        <rect x="110" y="81" width="70" height="4" rx="2" fill="#0b0c0e" opacity=".35" />
      </g>
      <g className="vg-pop" style={{ animationDelay: "1.2s" }}>
        <rect x="14" y="104" width="64" height="26" rx="12" fill="none" stroke={P} />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={32 + i * 14} cy="117" r="3" fill={P} className="vg-dot" style={{ animationDelay: `${i * 0.18}s` }} />
        ))}
      </g>
    </svg>
  );
}

function Research() {
  return (
    <svg viewBox="0 0 260 140" className="h-full w-full">
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <rect x="14" y={14 + i * 23} width="232" height="17" rx="4" fill="none" stroke={P2} />
          <rect x="22" y={20 + i * 23} width={60 + ((i * 37) % 70)} height="5" rx="2.5" fill={P} />
          <rect x="196" y={20 + i * 23} width="40" height="5" rx="2.5" fill={P2} />
        </g>
      ))}
      <rect x="14" y="60" width="232" height="17" rx="4" fill={O} opacity=".22" className="vg-blink" />
      <g className="vg-lens">
        <circle cx="0" cy="0" r="17" fill="rgb(11 12 14 / .4)" stroke={O} strokeWidth="2.5" />
        <line x1="12" y1="12" x2="26" y2="26" stroke={O} strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function Wireframe() {
  const boxes = [
    { x: 14, y: 12, w: 232, h: 14 },
    { x: 14, y: 34, w: 140, h: 56 },
    { x: 162, y: 34, w: 84, h: 56 },
    { x: 14, y: 98, w: 72, h: 32 },
    { x: 94, y: 98, w: 72, h: 32 },
    { x: 174, y: 98, w: 72, h: 32 },
  ];
  return (
    <svg viewBox="0 0 260 140" className="h-full w-full">
      {boxes.map((b, i) => (
        <rect key={i} {...{ x: b.x, y: b.y, width: b.w, height: b.h }} rx="4" fill="none" stroke={i === 1 ? O : P} strokeDasharray="5 5" pathLength={100} className="vg-draw" style={{ animationDelay: `${i * 0.25}s` }} />
      ))}
      <line x1="14" y1="34" x2="154" y2="90" stroke={P2} />
      <line x1="154" y1="34" x2="14" y2="90" stroke={P2} />
    </svg>
  );
}

function Design() {
  const sw = ["#0b0c0e", "#f3f2ef", "#ff5a1f", "#d7ff3a", "#1f6fa8"];
  return (
    <svg viewBox="0 0 260 140" className="h-full w-full">
      <text x="14" y="88" fontFamily="var(--font-anton)" fontSize="78" fill="#f3f2ef">
        Aa
      </text>
      <line x1="14" y1="96" x2="122" y2="96" stroke={P2} />
      <text x="14" y="118" fontFamily="var(--font-plex-mono)" fontSize="9" fill={P} letterSpacing="1">
        ANTON · ARCHIVO
      </text>
      {sw.map((c, i) => (
        <circle key={c} cx={156 + (i % 3) * 34} cy={i < 3 ? 46 : 92} r="13" fill={c} stroke={P2} className="vg-pop" style={{ animationDelay: `${i * 0.2}s` }} />
      ))}
      <path d="M232 104 l0 22 l6 -6 l6 12 l5 -2 l-6 -12 l9 0 z" fill="#f3f2ef" className="vg-cursor" />
    </svg>
  );
}

function Build() {
  const lines = [
    { x: 14, w: 70, c: O },
    { x: 26, w: 120, c: P },
    { x: 38, w: 90, c: P },
    { x: 38, w: 150, c: P2 },
    { x: 26, w: 60, c: P },
    { x: 14, w: 30, c: O },
  ];
  return (
    <svg viewBox="0 0 260 140" className="h-full w-full">
      <rect x="6" y="6" width="248" height="128" rx="8" fill="none" stroke={P2} />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={18 + i * 10} cy="17" r="2.6" fill={i === 0 ? O : P2} />
      ))}
      {lines.map((l, i) => (
        <rect key={i} x={l.x} y={32 + i * 16} width={l.w} height="6" rx="3" fill={l.c} className="vg-type" style={{ animationDelay: `${i * 0.35}s` }} />
      ))}
      <rect x="48" y="112" width="2" height="10" fill="#f3f2ef" className="vg-caret" />
    </svg>
  );
}

function Launch() {
  return (
    <svg viewBox="0 0 260 140" className="h-full w-full">
      <circle cx="62" cy="70" r="44" fill="none" stroke={P2} strokeWidth="7" />
      <circle cx="62" cy="70" r="44" fill="none" stroke={O} strokeWidth="7" strokeLinecap="round" pathLength={100} className="vg-ring" transform="rotate(-90 62 70)" />
      <text x="62" y="80" textAnchor="middle" fontFamily="var(--font-anton)" fontSize="30" fill="#f3f2ef">
        100
      </text>
      <polyline points="132,118 160,96 184,104 214,64 246,30" fill="none" stroke={P} strokeWidth="2" pathLength={100} className="vg-draw" />
      <circle cx="246" cy="30" r="5" fill={O} className="vg-pop" style={{ animationDelay: "1.4s" }} />
      <text x="132" y="34" fontFamily="var(--font-plex-mono)" fontSize="9" fill={P} letterSpacing="1">
        DEPLOYED ✓
      </text>
    </svg>
  );
}

function Support() {
  return (
    <svg viewBox="0 0 260 140" className="h-full w-full overflow-hidden">
      <text x="14" y="30" fontFamily="var(--font-plex-mono)" fontSize="9" fill={P} letterSpacing="1">
        UPTIME
      </text>
      <text x="14" y="62" fontFamily="var(--font-anton)" fontSize="30" fill="#f3f2ef">
        99.9%
      </text>
      <g className="vg-pulse">
        <polyline
          points="0,104 40,104 52,104 60,84 70,124 80,94 88,104 130,104 142,104 150,84 160,124 170,94 178,104 220,104 232,104 240,84 250,124 260,94 268,104 310,104 322,104 330,84 340,124 350,94 358,104 400,104 412,104 420,84 430,124 440,94 448,104 520,104"
          fill="none"
          stroke={O}
          strokeWidth="2"
        />
      </g>
      <line x1="0" y1="104" x2="260" y2="104" stroke={P2} />
    </svg>
  );
}

const SCENES = [Brief, Research, Wireframe, Design, Build, Launch, Support];

export function ProcessVignette({ index }: { index: number }) {
  const Scene = SCENES[index] ?? Brief;
  return (
    <div className="vignette relative h-[118px] w-full overflow-hidden rounded-[10px] bg-white/[0.025] p-2 ring-1 ring-paper/[0.06]" aria-hidden>
      <Scene />
    </div>
  );
}

export const vignetteStyles = `
.vignette .vg-pop { transform-box: fill-box; transform-origin: center; animation: vg-pop 3.6s var(--ease-out) infinite both; }
@keyframes vg-pop { 0% { opacity: 0; transform: translateY(8px) scale(.92) } 12%, 82% { opacity: 1; transform: none } 100% { opacity: 0 } }
.vignette .vg-dot { animation: vg-dot 1s ease-in-out infinite; }
@keyframes vg-dot { 0%, 100% { opacity: .25 } 50% { opacity: 1 } }
.vignette .vg-lens { animation: vg-lens 4.5s ease-in-out infinite; }
@keyframes vg-lens { 0% { transform: translate(40px, 30px) } 35% { transform: translate(150px, 68px) } 55% { transform: translate(150px, 68px) } 100% { transform: translate(40px, 30px) } }
.vignette .vg-blink { animation: vg-blink 4.5s ease-in-out infinite; }
@keyframes vg-blink { 0%, 30% { opacity: 0 } 40%, 60% { opacity: .3 } 75%, 100% { opacity: 0 } }
.vignette .vg-draw { stroke-dasharray: 100; animation: vg-draw 4s ease-in-out infinite both; }
@keyframes vg-draw { 0% { stroke-dashoffset: 100 } 45%, 85% { stroke-dashoffset: 0 } 100% { stroke-dashoffset: -100 } }
.vignette .vg-cursor { animation: vg-cursor 3.6s ease-in-out infinite; }
@keyframes vg-cursor { 0%, 100% { transform: translate(0, 0) } 40% { transform: translate(-40px, -50px) } 60% { transform: translate(-40px, -50px) } }
.vignette .vg-type { transform-box: fill-box; transform-origin: left; animation: vg-type 4.2s steps(12) infinite both; }
@keyframes vg-type { 0% { transform: scaleX(0) } 30%, 90% { transform: scaleX(1) } 100% { transform: scaleX(0) } }
.vignette .vg-caret { animation: vg-dot .8s steps(2) infinite; }
.vignette .vg-ring { stroke-dasharray: 100; animation: vg-ring 4s var(--ease-out) infinite both; }
@keyframes vg-ring { 0% { stroke-dashoffset: 100 } 50%, 90% { stroke-dashoffset: 0 } 100% { stroke-dashoffset: 0; opacity: 0 } }
.vignette .vg-pulse { animation: vg-pulse 3s linear infinite; }
@keyframes vg-pulse { from { transform: translateX(0) } to { transform: translateX(-90px) } }
`;
