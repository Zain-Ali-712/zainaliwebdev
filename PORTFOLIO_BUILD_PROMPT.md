# Build prompt: Zain Ali portfolio (v1)

> **How to use:** open a new Claude Code session in `D:\University\Web-Projects\ZainAliPortfolio` and paste everything below the line. The prompt is written for the agent that will plan and build the site.

---

## 0. Your mission

Plan, design and build the personal portfolio website of **Zain Ali**, a full stack developer and UI/UX designer from Lahore. It has to feel like a premium, award-level studio site: WebGL, scroll-driven scenes, text reveals, smooth scrolling, magnetic buttons, and a projects section that is the best part of the site.

It must look like **one system from top to bottom**. The projects section is the most advanced part, but it uses the same colours, type, grid and motion language as every other section. It must not feel like a second website pasted in.

Work in three phases, in this order:

1. **Discovery.** Read every source in section 2 before writing any code.
2. **Plan.** Write `docs/PLAN.md` (section 13 says what goes in it) and the typed content files.
3. **Build.** Build the full v1. Zain will review it and ask for changes, so don't stop to get the plan approved. Only stop if something blocks the whole build. Record every open question in `PLAN.md` with the default you chose, and list them again in your final report.

Before you design anything, load these skills: `frontend-design`, `impeccable` and `modern-web-guidance` (its description says to run it first for HTML/CSS/JS work). Use `motion-dev-animations` for Motion UI work and `playwright-cli` for QA.

---

## 1. Non-negotiables

1. **Use only true facts.** Never invent clients, numbers, testimonials, awards, ratings, revenue or dates. The design reference is full of placeholder numbers ("98% satisfaction", "4.78/5", "70+ projects", an awards table, testimonials, a logo wall). Each one gets replaced with a real fact from section 3, or the block is removed. If a fact is missing, use a clearly marked placeholder and add it to the open questions.
2. **Don't copy either reference.** Take the vibe, the system and the techniques. Don't copy their text, logos, images, names or exact layouts.
3. **Label pitch concepts.** The restaurant, café and medical sites are unsolicited pitch or concept work. Every one carries a small label such as `Pitch concept · not affiliated with <brand>`. A `showRealBrand` flag per project lets Zain switch to the de-branded version (section 4A).
4. **Keep private data private.** Never publish real client records, credentials or personal phone numbers. Care RCM and the Leads Management System hold real client data, so only demo or synthetic screens may appear, blurred if needed. Publish only `zainaliwebdev@gmail.com`, not the git email.
5. **Respect performance and accessibility.** Motion must respect `prefers-reduced-motion`. Text stays in the DOM, not drawn in a canvas. The site works without WebGL. Mobile is a designed experience, not a scaled-down desktop.
6. **Be fully responsive** at 360, 390, 430, 768, 1024, 1280, 1440, 1920 and 2560 widths, with no horizontal scroll at any width.

---

## 2. Phase 1: discovery (read all of it before planning)

### 2.1 Design references (the vibe)
- `Portfolio.webp` (the full-page Dribbble shot of the "Unifex" developer portfolio), plus enlarged crops in `references/unifex-design/` (`01-hero` … `06-contact-footer`).
- **https://alche.studio/**, the reference for the projects section, the 3D background, the loader, the card reveal and the footer. Its WebGL does not render in the built-in browser pane. Use the frames already captured in `references/alche-studio/` (numbered in scroll order, plus contact sheets). To capture it again, run `references/alche-studio/capture-alche.js` (playwright-core with headed Edge, see the file header).

### 2.2 Zain's previous portfolio and accounts
- Previous portfolio code: `D:\University\Web-Projects\Zain-Ali` (React + Vite + R3F globe + EmailJS). Live versions: https://zaindev-nine.vercel.app and https://zainaliwebdev.vercel.app. Read `src/components/*` for bio, socials, project copy and the contact form (the EmailJS service, template and key are in `contact/ContactMe.jsx`).
- GitHub: https://github.com/Zain-Ali-712. The public API works without auth: `https://api.github.com/users/Zain-Ali-712/repos?per_page=100&sort=pushed`. Team repos sit under https://github.com/M-Zayn-Abbas (Zain's FYP and client-work partner) and https://github.com/SMAbbasHussain/SyncWave.
- LinkedIn: https://www.linkedin.com/in/zain-webdev-68ba04365. It is behind a sign-in wall. **Do not sign in.** Ask Zain to paste his About, Experience and Featured text, or to save the profile as a PDF into `references/`.
- Instagram and Threads: `@zaindev_design`.

### 2.3 Project folders (all in `D:\University\Web-Projects\`)
For each project, read the `README.md`, `AGENTS.md`/`CLAUDE.md`, `package.json`, `app|src/**/layout.tsx` metadata, `report/` and `research/`, and run `git log` for dates and authors. The full list is in section 4.

### 2.4 Media Zain already has
- `LinkedInPosts\Recent-Projects-Images\` holds screenshots for ChinaTown-JadeCafe (10), DoubleShot (5), Four (5), Health-n-Goodness (8), radiora-international (12, desktop and mobile) and tamp-and-tide (12, desktop and mobile).
- `LinkedInPosts\Raw-Recordings\` holds raw screen recordings: `NoFilter.mp4` (85 s), `HealthnGoodness.mp4` (76 s), `Radiora-International.mp4` (93 s), `Tamp-and-Tide.mp4` (36 s) and `Raw-recording.mp4` (79 s).
- `LinkedInPosts\edited\` holds Zain's own reels, which are his content: `hello-zain-reel.mp4`, `how-i-build-reel.mp4`, `Final-Post.mp4` and `website-tips-reel.mp4` (in the folder root). Frame sheets are in `references/zain-reels/`.
- `LinkedInPosts\STUDIO.md` covers Zain's rules for showing work publicly (de-branding pitch sites and never inventing facts). Read it.
- `SocialMedia_Images\` and `Zain-Ali\public\SocialMedia_Images\Fiver-gigs\Zains\` hold mockups and promo videos for Cheryl Trust, Property Brokers, Chance4Change (pets), Kamilla Norman, the EMTS medical site, Interiors, PrintCraft and Wristro.
- `doubleshot\shots\` holds extra Double Shot frames.
- Portraits: `Zain-Ali\public\Zain-Nav.jpg` (1635×2091, best quality), plus the cut-outs `Zain.png` (428×582) and `Zain1.png` (428×437), and `signature.png`.

### 2.5 University and FYP
- `D:\University\FYP\` holds the FYP proposal, `FYP-I-Report-Finalised.docx` and `SyncUp_Prersentation.pdf`. Text can be extracted from a .docx with Python `zipfile`.
- `SyncUp\CLAUDE.md`, `SyncUp\docs\project-state.md` and `module-roadmap.md` describe the FYP build.

### 2.6 Notes from earlier Claude sessions (background, verify before relying on them)
`C:\Users\zain ali\.claude\projects\*\memory\*.md`, especially `concept-rebrand-workflow.md`, `restaurant-site-preferences.md`, `pitch-report-format.md`, `four-restaurant-pitch.md` and `care-rcm-project.md`.

---

## 3. Verified facts about Zain (use these; trace anything new to a source)

| Field | Fact | Source |
|---|---|---|
| Name | Zain Ali | everywhere |
| Roles | Full Stack Developer · UI/UX Designer | intro reel, old portfolio |
| Based | Lahore, Pakistan | GitHub, reels |
| Education | BS Software Engineering, COMSATS University Islamabad, Lahore Campus (session 2023–2027), graduating Feb 2027 | FYP proposal, intro reel |
| Building since | Feb 2024 | intro reel ("Building since 2024 · Feb 2024") |
| Projects | 10+ (client + concept) | intro and how-I-build reels |
| Countries worked with | 3: New Zealand, Norway, Pakistan | intro reel |
| What he builds | Websites, Web apps, Landing pages, Dashboards, Booking flows, Real-time chat | intro reel |
| Stack (reel shows 9; 8 are readable) | React, Next.js, TypeScript, Tailwind CSS, Node.js, Express, MongoDB, Supabase, plus a 9th to confirm | intro reel |
| Also used in projects | GSAP + ScrollTrigger, Lenis, Motion/Framer Motion, Three.js/R3F, shadcn/ui, Socket.io, WebRTC, Leaflet, Cloudinary, JWT auth, Google OAuth, Gemini API, TanStack Query, Vite, Vercel, Playwright, Python asset scripts | project package.json files |
| How he works (7 steps) | Brief → Research → Wireframe → Design → Build → Launch → Support | how-I-build reel |
| GitHub bio | "Front-end developer with expertise in React, Next.js, and JavaScript… backend experience in Node.js." | GitHub |
| Personal | Writes Urdu poetry (ghazals). The intro reel ends on "and yes, I write Urdu" | reel, `D:\Poetry(Ghazal)_Zain Ali.pdf`. Ask before quoting any poem |
| Email (public) | zainaliwebdev@gmail.com | old portfolio footer |
| Socials | LinkedIn `zain-webdev-68ba04365` · GitHub `Zain-Ali-712` · Instagram and Threads `@zaindev_design` | old portfolio |
| CTA language he uses | "Need a website? DM me" | how-I-build reel |

**Working principles** (from his project docs, good material for "How I work"):
- Real data only. He scrapes and verifies menus, prices, branches and reviews from the brand's own Foodpanda, Instagram, Facebook and Google Maps, and every fact is sourced in `research/`.
- He ships a working demo, not a picture: cart, checkout, branch maps with live open/closed status (Asia/Karachi), booking flows and admin dashboards.
- Premium and minimal, with small interactions. Fonts and colours follow the client's own identity.
- Each pitch goes with a short, plain-language report for the owner on why their own site beats paying app commission.
- Frontend and backend live in separate folders. He deploys to Vercel from GitHub.

---

## 4. Project inventory (the content of the Works section)

Store everything in `src/content/projects.ts` with a typed `Project` model: `slug, title, client, category, status, year, role, team, summary, problem, built[], stack[], links{live, repo}, media{poster, loop, screens[], mobile[]}, accent, showRealBrand, disclaimer, featured, order`.

### 4A. Featured: pitch and design concepts (Oct 2026), the hero of the Works theatre
| # | Project | What it is | Highlights | Stack | Live | Media you have |
|---|---|---|---|---|---|---|
| 1 | **No Filter Coffee** | Café, DHA Phase 6 + Pine Avenue, Lahore | Home, 65-item menu (10 categories), cart, checkout, order-placed screens, GSAP scroll scenes | Next.js 16, Tailwind v4, GSAP + Lenis, Motion | nofilter-coffee-xi.vercel.app | Raw recording (85 s); capture screenshots |
| 2 | **FOUR** | Smash burgers, Raya DHA Lahore (had no website) | Direct ordering to cut Foodpanda commission, in-place qty stepper, cut-out dishes, one brand red | Next.js 16, Tailwind v4, Framer Motion, GSAP, Lenis | four-resturant.vercel.app | 5 screenshots |
| 3 | **Health n Goodness** | Juice bar, 4 branches in Lahore | Pinned hero with depth-layered fruit, ingredients that assemble into the drink, 57-item menu, Leaflet map with live open status | Next.js 16 (Cache Components), Tailwind 4, shadcn/ui, Motion, Lenis, Leaflet | healthngoodness.vercel.app | 8 screenshots + raw recording |
| 4 | **China Town & Jade Café** | Restaurant: Lahore, Islamabad, Faisalabad, Multan | Brand + menu site, branch dot-maps generated from OpenStreetMap/Natural Earth, sourced data | Next.js 16, Python asset pipeline | chinatown-jadecafe.vercel.app | 10 screenshots |
| 5 | **Radiora International** | Concept medical equipment distributor (nuclear medicine, PET, radiotherapy QA), the de-branded version of a Danish International pitch | 3D category models, product explorer | Next.js 16, TS, Tailwind v4, Motion, GSAP, Three.js | radiora-international.vercel.app | 12 desktop/mobile + raw recording |
| 6 | **Tamp & Tide** | Concept specialty coffee brand, the de-branded version of the Double Shot redesign | Animated product hero, filterable menu + cart, mobile brew-bar estimate builder, 8-branch map | Next.js 16, TS, Tailwind v4, Motion, Lenis | tamp-and-tide.vercel.app | 12 desktop/mobile + raw recording |
| 7 | **The Muffin House** | Brioche donuts & artisan pizza, Model Town Lahore | Ordering site | Next.js 16 | muffin-house.vercel.app | capture |
| 8 | **Seven Sides** | Nashville hot chicken, Lahore | Pinned "Choose your heat" scroll, heat picker, sideways timeline, live branch tickets | Next.js 16, Tailwind 4, shadcn/ui, Motion, Lenis, Leaflet | sevensides-wheat.vercel.app | capture |
| 9 | **Double Shot** (optional) | Real-brand version of Tamp & Tide | RickShot estimate builder | Next.js 16 | doubleshot-three.vercel.app | 5 screenshots + `doubleshot/shots` |

Zain asked for these by name: No Filter Coffee, FOUR, Health n Goodness, China Town & Jade Café, Radiora International. Lead with those five. Show Double Shot **or** Tamp & Tide, not both (default: Tamp & Tide).

### 4B. Client work
| Project | What it is | Notes |
|---|---|---|
| **Leads Management System** (brand title "ISolutionYou") | Custom CRM for a lead-generation, cold-calling and appointment-setting business: admin + up to 15 callers, RBAC, daily dashboard, spreadsheet-style rapid lead entry, Calendly sync, follow-up reminders, per-caller performance | React SPA, Node/Express, MongoDB. Team build with Muhammad Zain Abbas and Ma-seel (repo `M-Zayn-Abbas/Leads-management-system`). SRS PDF + report docx in the folder. Screens must use demo data |
| **Cheryl Trust** | Site for Cheryl McDonough, Trust Technique practitioner and pet behaviourist, **New Zealand**: Canine Adventure Park booking (1-hour slots, sign in to book, T&Cs, cancellation policy), moderated reviews, admin dashboard | Next.js. Live: cheryl-trust.vercel.app. Built with M-Zayn-Abbas; confirm Zain's role. Mockups in `Fiver-gigs/Zains/Cheryl-*` |
| **Chance4Change** | Pet adoption and fostering platform ("Adopt, Foster, Love") | Next.js. Live URL is down (404), so run it locally to capture. Promo images in `SocialMedia_Images/` (c4c, Chance4Change-*) |
| **Care RCM Services** (in progress) | Payer-enrollment portal for US medical practices that replaces per-practice Excel sheets: provider × payer matrix, revalidation dates, documents, RBAC, client read-only logins | React + Vite + TS, Tailwind, shadcn/ui, TanStack Query. Zain owns the frontend; a teammate builds the backend. **Show synthetic "Sample" data only** |
| **BrokerLeadz** (repo `EliteScholars`) | Lead-gen agency site for business brokers and M&A advisors | Next.js. Live: elite-scholars-zeta.vercel.app |
| **Property Brokers: Brittany Fagaloa-Time** | Luxury real estate, **New Zealand** | Next.js. Mockups in `Fiver-gigs/Zains/Property-*` |
| **Kamilla Norman** | Life coach, **Norway** | Next.js + backend, built with M-Zayn-Abbas. `Kimila-Gig.mp4` |
| Interiors by Muhammad, EMTS (Eastern Medical Technology Services), Ace of Hearts (dog training), UK EduGarden, PrintCraft/PrintingPress, Wristro, DevKeters (agency site with M-Zayn-Abbas) | Smaller builds | **Confirm with Zain** which are paid clients, gig samples or concepts before labelling them "client" |

### 4C. Product, team and study work
| Project | What it is | Notes |
|---|---|---|
| **SyncUP** (Final Year Project) | Freelancing marketplace for Pakistan where **skills are verified before bidding**: generated assessments, credit-based bids against spam, bids + gig purchase, temporary client-formed teams, project workspace (chat, WebRTC calls, file sharing, AI assistant, GitHub commit feed), simulated escrow wallet, admin | **Zain is group leader**, with Muhammad Zain Abbas. COMSATS Lahore, BSE 2023–27. Next.js 16, React 19, TS, Tailwind v4, shadcn, RHF + zod, Socket.io / Express 5, Mongoose 8, MongoDB Atlas, JWT, Cloudinary, Nodemailer, Google OAuth, Gemini. Docs in `D:\University\FYP\` |
| **SyncWave** | Real-time chat app: private chats, AI chat, anonymous groups. Zain led all frontend design and development | React, Socket.io, Express. Live: sync-wave-tan.vercel.app. Team repo `SMAbbasHussain/SyncWave`. Animated background in `Web-Projects\Background For SyncWave` |
| TrackMe | Private lead tracker and habit workspace Zain built for himself | Show as "tools I built for myself", no public link (it is noindex) |
| Game Dev Project (Unity/ShaderLab), Discipline Tracker, LMS, Next.js rendering/routing demos | Study work | Archive list |
| Early projects | Airbnb clone, Currency converter, To-do, Tic-tac-toe, Rock-paper-scissors (2025, HTML/CSS/JS/jQuery) | Archive list with live links from the GitHub API |

---

## 5. Design direction

### 5.1 The vibe to keep (from the Unifex reference)
- **Light, warm off-white canvas** with soft "pressed" cards: very light grey fill, a 1px highlight border and a short soft bottom shadow, radius about 12px. Small pill tags, tiny arrow-in-circle buttons and **one orange dot** as a recurring signal.
- **Giant, heavy, condensed uppercase display type** that runs edge to edge (DEVELOPER, SERVICES, WORKS, the name in the footer), with the portrait cut-out overlapping the hero word.
- **Light and dark rhythm.** Light hero and about, a black services band with an outline/solid "SERVICES — SERVICES" marquee and staggered capsule rows with media, a light works area with cards floating over a giant word, a dark list/table band, a dark contact section, and a giant-name footer.
- Accents: **signal orange** and, used very sparingly, **acid lime** (the submit button).
- Warm studio mockups: devices on orange velvet under warm light.

### 5.2 What to take from alche.studio
Study the frames in `references/alche-studio/` in order.
- **Loader (frames 01–02):** a black screen where thin white construction lines (verticals, horizontals, diagonals, a circle) draw themselves and assemble the logo letter, with one short monospace line typed underneath.
- **Hero (03–04):** a refractive glass prism of the logo letter with chromatic dispersion, inside a dark cylindrical grid room with "+" markers. A left rail scroll indicator shows section labels and sub-ticks. HUD elements use a monospace face.
- **Works (05–09):** pinned scroll. The glass letter sits at the centre, and project videos play on **curved panels arranged on a ring** that rotate into view as you scroll. Inactive panels sit dim and blurred at the sides. Bottom left shows the date, a highlight tag, a big title, a subtitle and tag pills; bottom right shows "More Works ↗". The glass refracts the active video.
- **Section transitions (10–15):** the scene flips from dark to a light technical-drawing look (outline triangle, plus-grid), and a glitchy, grainy, dispersed texture wipe leads into the next section. The big words in services are distorted through the same effect.
- **Footer (16–17):** a giant white wordmark on black with a soft, slowly moving **aurora glow** (blue, green, purple) behind it, plus tiny mono link columns.

### 5.3 The fusion (how it becomes one site)
- One palette, one type system and one grid run across every section, the WebGL scenes included. The 3D room uses the site's own ink and paper tones, its grid lines and plus-markers, and the orange signal. The HUD over the canvas is ordinary DOM in the site's fonts.
- The **monogram "Z"** (or "ZA") is Zain's equivalent of the Alche "A". The loader draws it from construction lines, the Works theatre shows it as a glass prism, and the footer and favicon reuse it.
- The **aurora glow** from Alche's footer is reused in the hero and the footer, so the site opens and closes the same way (section 6).
- The giant condensed words from Unifex become 3D-aware. "WORKS" is set huge behind the ring of panels in the Works theatre, which joins the two references in one image.
- Each project has an `accent` taken from its own brand (for example FOUR red `#c8141a`). It tints only the glass dispersion and the grid glow, while the UI stays in site tokens.

### 5.4 Design tokens (starting point; tune them, but keep the spirit)
```
--paper:    #F3F2EF   (warm off-white; Zain's reels use bone #E9E4DF)
--paper-2:  #E9E7E3   (cards)
--ink:      #0B0C0E   (dark sections)
--ink-2:    #15171C   (Zain's reel ink)
--muted:    #6E6E73
--line:     rgb(11 12 14 / .08)   dark: rgb(255 255 255 / .08)
--signal:   #FF5A1F   (orange dot, hover underline, active states)
--signal-soft: #E8915A (Zain's reel orange: big fills, mockup backdrops)
--lime:     #D7FF3A   (ONLY the send button + the "available" dot)
--blue:     #1F6FA8   (Zain's reel blue: one aurora colour only)
grain overlay 3–5% on dark sections
```
**Type**
- Display: a heavy condensed grotesk. Start with **Archivo** (variable, `wdth` 62–75, `wght` 800–900; Google Fonts) or **Anton**. Uppercase, line-height 0.82–0.9, tracking −0.02em, sized with `clamp()` so the biggest words run edge to edge.
- Text and UI: **Inter Tight** or **Hanken Grotesk**.
- Mono labels and HUD: **IBM Plex Mono** (the face Alche uses for its HUD).
- Load everything with `next/font` and subset it.

Grid: 12 columns, 16px gutters on mobile, 24–32px on desktop, max content width 1680px, so giant type may bleed past it.

### 5.5 Don'ts
- No glassmorphism soup, no neon purple gradients and no generic SaaS cards.
- No stock testimonials, fake logos or fake stats.
- Don't put more than one lime element in view at a time.
- Don't animate everything. Each section gets one signature move and quiet micro-interactions around it.

---

## 6. Site map and section-by-section spec

### Routes
- `/` is the one-page story.
- `/work` is the full index.
- `/work/[slug]` holds the case studies.
- `/about` (optional; it can live on `/`).
- `not-found` gets a designed 404.

### Home, top to bottom
0. **Preloader** (Alche technique, Zain's monogram). The page starts black. Construction lines draw the "Z" monogram (SVG stroke-dashoffset, staggered), and an IBM Plex Mono line types underneath ("Designing and building websites that work." as draft copy). A 000→100 counter sits in a corner. When assets are ready, the lines collapse into the monogram, which shrinks into the nav logo, and the black panel lifts away as a curtain to show the light hero. The loader runs once per session (it is skipped when `sessionStorage` has a flag) and is skipped entirely under reduced motion.
1. **Nav.** Monogram + "ZAIN ALI" on the left. Pill buttons for LinkedIn, GitHub, Instagram and Threads in the centre. On the right: a lime "Available for work" dot, a grid menu button that opens a full-screen menu with staggered links and a live Lahore clock, and **Download CV** (the CV PDF is missing; see open questions). The nav hides on scroll down and returns on scroll up, and it changes colour over dark sections.
2. **Hero** (Unifex layout with the Alche aurora done properly):
   - A full-width **giant word** that swaps between "DEVELOPER" and "DESIGNER", using the word swap from Zain's reels as a vertical slot-roll per letter.
   - The word is rendered as a **WebGL text mask filled with the aurora shader**: slow flowing noise in ink, orange, blue and a touch of lime. A soft light follows the cursor through the letters. A DOM `<h1>` stays underneath for SEO and screen readers.
   - Zain's **cut-out portrait** (made from `Zain-Nav.jpg` with rembg) overlaps the word, with mouse parallax on 2–3 depth layers.
   - Left card: "Hello, I'm Zain Ali. Full stack developer and UI/UX designer in Lahore." with the "I build" list (Websites, Web apps, Landing pages, Dashboards, Booking flows, Real-time chat).
   - Right stacked stat cards: **10+ projects (client + concept)**, **3 countries (NZ · Norway · PK)**, **Since Feb 2024**. Counters animate when they come into view.
   - Centre card: a one-line positioning headline and two magnetic CTAs, "View work" and "Let's talk".
   - Faint construction grid lines draw in behind everything, which links back to the loader.
   - On scroll, the hero word scales and splits, the portrait sinks and the cards drift at different speeds.
3. **Statement.** A large centred paragraph whose words reveal from muted to ink as you scroll (scrubbed SplitText).
4. **About.** A portrait card, a short bio in Zain's voice, the education card (COMSATS · BSE · grad Feb 2027), the signature (`signature.png`, drawn in with an SVG mask), and the Urdu line as a quiet personal touch.
5. **Services** (dark band):
   - The "SERVICES — SERVICES —" marquee alternates solid and outline, with speed and skew tied to scroll velocity.
   - Four staggered capsule rows: 01 UI/UX & Web Design, 02 Web Development (Next.js/React), 03 Web Apps & Dashboards (full stack), 04 Booking, Ordering & Real-time features. Each row has small tag pills and a capsule media slot on the right (a looping clip or 3D render in warm orange tones).
   - On hover or focus a row widens, its media plays, and the title turns signal orange with an animated underline.
6. **Works: "The Screening Room"** (Alche-inspired; this is the centrepiece):
   - Pinned with ScrollTrigger for about N × 100vh.
   - The background tweens from paper to ink as the giant word "WORKS" fills the screen, then the camera passes through the "O" into the 3D room.
   - The room is a cylindrical grid with plus-markers and slow dust particles.
   - A refractive **glass "Z" monogram** sits at the centre (drei `MeshTransmissionMaterial` with chromatic aberration). It refracts the active project.
   - The featured projects play on **curved video panels on a ring** (cylinder segments using `useVideoTexture`). Scroll rotates the ring to bring each project to the front. Inactive panels dim, desaturate and blur through depth of field.
   - **HUD (DOM):**
     - Bottom left: `01 / 09` in mono, then year, type badge ("Pitch concept" / "Client" / "FYP"), the big title, a one-line summary and stack pills.
     - Bottom right: a magnetic "Open case study ↗" and "All work ↗".
     - Left: a section rail with sub-ticks, one per project.
     - Top right: a mini ring map with a dot per project.
   - **Interaction:**
     - Drag or swipe spins the ring with inertia, and arrow keys step through projects.
     - Hovering a panel makes it lean toward the cursor, and the custom cursor turns into "PLAY" / "VIEW".
     - Clicking dollies the camera into the panel and runs a shared-element transition into `/work/[slug]`, where the same video becomes the case-study hero.
   - **Only the active panel decodes video.** The others show posters.
   - **Mobile and low-power devices** (width under 768px, `detect-gpu` tier ≤ 1, or reduced motion) get a vertical snap carousel of full-bleed cards instead. Each card has an autoplaying muted loop (`playsinline`, IntersectionObserver), the same HUD and a light CSS tilt. It is the same design language, not a stripped-down fallback.
7. **More work** (Unifex "WORKS" layout, light):
   - Staggered left/right cards float over a giant outline word ("CLIENTS"), with parallax at different speeds. Each card follows the Unifex pattern: title, pills, arrow button, then the image. On hover the image becomes the loop video.
   - Below the cards, an index list with filter chips (All · Client · Pitch concepts · Product & team · Study · Archive). Hovering a row shows a floating preview that follows the cursor with lerp.
8. **How I work.** A horizontal pinned scroll through the 7 steps (Brief → Research → Wireframe → Design → Build → Launch → Support). A hand-drawn connector line draws between the step pills, as in his reel, and each step has a short card in his voice. For example, Research: "I pull real menus, prices, branches and reviews from the brand's own channels. Nothing made up." Build: "A working demo, not a picture: cart, checkout, maps, live open hours."
9. **Stack.** Nine stacked colour bands, one tool per band (React, Next.js, TypeScript, Tailwind…), with mono `HEX / RGB` labels. This echoes his intro reel. The bands slide and stack on scroll, and each shows which projects used that tool.
10. **Journey** (replaces the Unifex awards table; same dark table styling). One row per milestone: year · what · where · tag. All dates come from git logs and documents:
    - 2023: BSE at COMSATS Lahore
    - Feb 2024: started building
    - 2025: first projects and the old portfolio
    - 2025–26: client work in NZ and Norway, plus the Leads Management System
    - 2026: SyncUP FYP as group leader
    - Oct 2026: the pitch series
    - Feb 2027: graduation (expected)

    Hovering a row slides a lime highlight across it and shows a thumbnail.
11. **Content.** "From my LinkedIn": a horizontal strip of his vertical reels (hello-zain, how-I-build, website-tips). They play on hover on desktop and on tap on mobile, and link to LinkedIn.
12. **Testimonials.** Hidden behind a flag until Zain supplies real quotes. In its place, a short strip of countries and client types ("Pet behaviourist · New Zealand", "Life coach · Norway", "Lead-gen agency", "Medical billing · US") if Zain approves.
13. **Contact** (dark, same grain):
    - Big line: "Need a website? Let's talk." (his own CTA).
    - The email with copy-to-clipboard, socials, a live Lahore time, and "Usually replies within 24h" only if Zain confirms it.
    - Form: name, email, project type chips (Website / Web app / Landing page / Dashboard / Redesign), message. It sends through EmailJS (reuse the service from the old portfolio), with validation and success/error states. The submit button is the single lime element.
14. **Footer** (Alche outro, made Zain's own):
    - A full-width **"ZAIN ALI"** wordmark with the aurora shader glowing behind it and following the cursor.
    - Mono link columns and an orange magnetic back-to-top button.
    - "© 2026 Zain Ali · Designed and built in Lahore", plus the line "Concept work is unsolicited and not affiliated with the brands shown."

### Case study page `/work/[slug]`
- A full-bleed loop hero.
- A meta row: role, year, type, team, stack, live link, repo link if public.
- The problem, then what was built (feature list with small inline clips), then desktop and mobile screenshot galleries (draggable horizontal scroller), then "Details I'm proud of" (micro-interactions).
- Results, real ones only.
- A disclaimer for pitch work.
- A large "Next project" footer that pre-loads and transitions straight into the next case study.

---

## 7. Motion and interaction spec

- **Smooth scroll:** Lenis (lerp about 0.09, `syncTouch: false`), driven by the GSAP ticker so Lenis and ScrollTrigger share one RAF.
- **Text reveals:** GSAP SplitText (free since 2025) with lines in overflow masks rising with stagger, character-level only for display words, and scrubbed word colour for the statement. Re-split on resize.
- **Image and video reveals:** clip-path insets with a slight scale-down from 1.15, and a pixel-sorting or dispersion glitch on the transitions into dark sections (WebGL plane or CSS mask sequence) as a nod to Alche.
- **Magnetic buttons:** CTAs, socials, back-to-top and "Let's talk" pull toward the cursor within a radius of about 80px, the label moves further than the shell, and they spring back with elastic easing.
- **Custom cursor:** a small dot with a lagging ring. It changes state for "VIEW", "PLAY", "DRAG" and "COPY", turns into a mix-blend circle over giant type, and is hidden on touch devices.
- **Marquee:** speed and direction follow scroll velocity, with skew clamped to ±8°.
- **Counters:** count up on enter, using tabular numbers.
- **Scroll rail:** fixed left mono labels (TOP, ABOUT, SERVICES, WORKS, PROCESS, JOURNEY, CONTACT) with sub-ticks and an active state, hidden under 1024px.
- **Page transitions:** a black curtain with the monogram, or shared-element morphs on Works → case study (View Transitions API where supported, GSAP Flip as fallback).
- **Hover micro-interactions:** the arrow-in-circle buttons rotate 45°, the orange dot pulses, pills fill, and cards lift 2px while the shadow deepens.
- **Reduced motion:** no loader, no pinning, no parallax and no WebGL scenes. A static aurora gradient stands in, sections fade in with opacity only, and videos show posters with play buttons.

---

## 8. Media pipeline (screenshots, clips, mockups, AI)

1. **Screenshots.**
   - Capture every project you lack: desktop 1440×900 viewport plus a full page, and mobile 390×844.
   - Use playwright-core with Edge (see `D:\Tools\tmp\tt\shots.js` for the pattern: scroll through first so reveals run, then shoot).
   - For live sites use the Vercel URLs. Down or private projects (Chance4Change, Leads, Care RCM, SyncUP) run locally with demo data.
   - Save to `public/work/<slug>/` as AVIF/WebP plus a JPG fallback.
2. **Loop clips.**
   - Cut 6–10 s seamless loops from `LinkedInPosts\Raw-Recordings\*.mp4`, and record new ones with Playwright `recordVideo` using scripted smooth scrolls and hovers.
   - Encode as H.264 MP4 plus WebM, 1280px wide for panels and 720px for mobile, no audio, `+faststart`, a poster frame each, aiming for 1–2 MB per loop.
   - ffmpeg is not on PATH. Install it (`winget install Gyan.FFmpeg`) or use `imageio-ffmpeg`. OpenCV is available in `D:\Tools\rembg-venv` for frame grabs.
3. **Device mockups.**
   - Prefer rendering phones and laptops in three.js with the **real** screenshot or video as the screen texture, on a warm orange velvet backdrop to match the reference. That keeps them consistent, sharp and free.
   - Still mockups for cards and OG images can be baked from the same scene.
4. **AI enhancement** (optional; ask Zain before spending credits). The `higgsfield-generate` / `higgsfield-product-photoshoot` skills can make cinematic device shots or short camera-move clips around a mockup. **AI must never change the UI shown on the screen:** composite the real screenshot. Zain's Higgsfield plan has few credits.
5. **Portrait.** Cut out `Zain-Nav.jpg` with rembg (`D:\Tools\rembg-venv`), clean the hair edge, and export WebP and AVIF at 2× hero size.
6. **Privacy pass.** Blur or replace any real client names, phone numbers and records. Pitch sites keep their real names only if `showRealBrand` is true.

---

## 9. Tech stack and architecture

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4, matching Zain's current stack.
- **Motion:** GSAP 3.13+ (ScrollTrigger, SplitText, Flip), Lenis, and Motion for component-level UI.
- **3D:** three, @react-three/fiber, @react-three/drei (MeshTransmissionMaterial, useVideoTexture, Text3D if needed) and @react-three/postprocessing (light DOF/bloom only). Custom GLSL goes in `src/gl/shaders/` (aurora, dispersion wipe, grid).
- **Device capability:** detect-gpu decides between full 3D, light 3D and 2D.
- **Forms:** EmailJS, or a Next route handler with Resend if Zain prefers.
- **Content:** typed TS files in `src/content/` (site, projects, journey, services, stack, socials). There is no CMS in v1.
- **Structure:**
  ```
  src/app/(site)/page.tsx, work/page.tsx, work/[slug]/page.tsx
  src/components/{nav,hero,about,services,works,process,stack,journey,contact,footer,ui,cursor,loader}
  src/gl/{scenes,materials,shaders}
  src/content/*.ts
  src/lib/{lenis,gsap,device,media}.ts
  public/work/<slug>/{poster,loop.mp4,loop.webm,screens/*}
  docs/PLAN.md, docs/ASSETS.md
  ```
- **Budgets:**
  - LCP under 2.5 s on a mid-range phone over 4G.
  - First-load JS under about 200 KB gzipped. The 3D chunk is dynamically imported when Works approaches the viewport.
  - Canvas DPR clamped to 1–1.75, rendering paused when off-screen or the tab is hidden, a single shared `<Canvas>` where possible.
  - Steady 60 fps on a mid laptop.
- **SEO:** per-page metadata, OG images per project, `sitemap.ts`, `robots.ts`, JSON-LD `Person` + `CreativeWork`.
- **Accessibility:** a skip link, visible focus rings, a keyboard-operable Works theatre (arrows, Enter), an `aria-live` announcement of the active project, alt text for every media item, AA contrast, `prefers-reduced-motion` handled everywhere.
- **Git:** run `git init` with sensible commits. **Don't create a GitHub repo, push or deploy to Vercel without asking Zain.** He may want `zainaliwebdev.vercel.app` or a new domain.

---

## 10. Copy and voice

- First person, plain English, short sentences, confident, no hype. Avoid "passionate", "cutting-edge", "seamless", "elevate", "next-level" and "pixel-perfect".
- Every claim has to be something Zain can prove: a link, a screenshot or a repo.
- Mark all draft copy in the content files with `// DRAFT` so Zain can review it quickly.

---

## 11. Responsive behaviour

- **≥1920 / 2560:** giant type scales with the viewport, but content columns stay readable (max 1680px). The Works ring adds panels instead of only scaling up.
- **1024–1440:** the full experience.
- **768–1023:** the scroll rail is hidden, the services rows go full width, Works uses light 3D (fewer panels, no DOF), and the How-I-work section becomes a vertical stack if horizontal pinning feels cramped.
- **<768:**
  - The hero word stacks or shrinks to fit, the portrait is centred under it, and the cards become a horizontal swipe row.
  - Works switches to the mobile snap carousel.
  - The custom cursor is off and magnetic effects become press-scale feedback.
  - The footer wordmark fits to width.
- Touch targets are at least 44px, with no hover-only information.

---

## 12. Definition of done (QA before you report)

1. `npm run build` passes with no type or lint errors and no console errors at runtime.
2. Playwright screenshots of every section at 390, 768, 1440 and 1920 are compared side by side with `references/` frames. Fix anything that looks weaker or off-system.
3. Record a short screen capture of the Works theatre and the loader to check that the motion feels smooth (60 fps target, no layout shift).
4. Lighthouse mobile scores are ≥ 90 for Performance, Accessibility, Best Practices and SEO on `/`.
5. The reduced-motion pass and the no-WebGL pass both produce a complete, good-looking site.
6. **Fact audit:** every number, client, date and claim on the site traces to a source in section 3 or 4, or is marked as a placeholder.
7. Every external link opens and the contact form sends a test message (ask Zain before sending a real one to his inbox).

---

## 13. What `docs/PLAN.md` must contain (write it before building)

1. A summary of what you learned in discovery, including anything that contradicts this prompt.
2. The sitemap and the final section order, with one line on the signature motion of each section.
3. Design tokens, fonts and the monogram concept (a sketch in SVG is fine).
4. The project table: final order, categories, which ones are featured in the 3D theatre, the media status per project (have / capture / record) and the label/disclaimer per project.
5. The 3D/WebGL plan: scenes, materials, shaders, performance tiers and fallbacks.
6. An asset checklist (`docs/ASSETS.md`).
7. **Open questions**, each with the default you went with:
   1. Show real brand names on pitch concepts? Default: yes, with a "Pitch concept · not affiliated" label, using Tamp & Tide in place of Double Shot and Radiora in place of Danish International.
   2. Which "other builds" are paid clients, gig samples or concepts, and what was Zain's role on the team builds (Cheryl Trust, Kamilla Norman, Leads Management System)?
   3. The CV PDF for "Download CV". `Resume_Zain_Ali.pdf` was not found on disk. Default: hide the button.
   4. The LinkedIn About and Experience text. Default: use the facts in section 3.
   5. Publish a phone/WhatsApp number or a Calendly link? Default: email + form only.
   6. Any real testimonials? Default: the section stays hidden.
   7. A better studio portrait? Default: a cut-out of `Zain-Nav.jpg`.
   8. Domain: keep `zainaliwebdev.vercel.app` or use a new one?
   9. The 9th tool on the reel's stack list.
   10. Fiverr or Upwork profile links to add?

Then build all of v1. In the final report, give: what was built, how to run it (`npm run dev`), screenshots, the open questions and what you would improve next.
