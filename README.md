# Zain Ali, portfolio

Personal portfolio of Zain Ali, full stack developer and UI/UX designer in Lahore.

Next.js 16 (App Router, Cache Components) · React 19 · TypeScript · Tailwind CSS v4 · GSAP (ScrollTrigger, SplitText) · Lenis · three.js with React Three Fiber and drei · EmailJS.

## Run

```bash
npm install
npm run dev -- -p 3100
```

`npm run build && npm start` for a production build.

## Where things live

| Path | What |
|---|---|
| `src/content/site.ts` | Bio facts, socials, services, process steps, stack, journey, reels, EmailJS ids |
| `src/content/projects.ts` | Every project: copy, stack, links, media paths, labels |
| `src/components/sections/*` | Home sections in page order |
| `src/components/works/Theatre.tsx` | The 3D "screening room" (R3F): curved video panels on a ring, glass Z, grid room |
| `src/gl/aurora.ts` | Raw-WebGL aurora shader used by the hero word and the footer |
| `src/components/Preloader.tsx` | Construction-line loader (runs once per browser session) |
| `public/work/<slug>/` | `d-*.jpg` desktop shots, `m-*.jpg` mobile shots, `loop.mp4` / `loop-sm.mp4` clips, `poster.jpg` |
| `docs/PLAN.md` | Plan and open questions |
| `references/` | Design references (Unifex shot, alche.studio frames, reel frames) |

## Media

Screenshots and clips were captured from each live Vercel site with `D:\Tools\portfolio-media\capture.js` (headed Edge, CDP screencast, then ffmpeg into 12 s loops):

```bash
node capture.js <publicWorkDir> <framesDir> <slug...>
node capture.js --encode <framesDir> <publicWorkDir> <slug...>
```

## Labels

Real-brand pitch work carries a "Pitch concept · not affiliated" label (`showRealBrand` and `disclaimer` in `projects.ts`).
