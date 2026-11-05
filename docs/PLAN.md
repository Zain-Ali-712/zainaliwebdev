# Portfolio v1: plan

Built from `PORTFOLIO_BUILD_PROMPT.md`. Discovery notes are in that file (sections 2–4); this plan records the decisions taken for v1.

## 1. What discovery changed
- LinkedIn is behind a sign-in wall, so the bio and timeline come from the reels, the FYP proposal and the git history.
- `Resume_Zain_Ali.pdf` is not on disk, so the "Download CV" button is hidden behind `site.cvUrl` (null).
- Chance4Change's live URL returns 404, and the Leads Management System and Care RCM need their backends (and hold real client data). Their cards use existing mockups and promo images, and text-led layouts where nothing exists.
- SyncUP screens come from the FYP-I report (14 UI screens, about 710 px wide), so they appear in card and gallery sizes only.
- The FYP supervisor named on the presentation is Abdul Karim Shahid. That isn't used on the site until Zain confirms.

## 2. Sitemap and section order (signature move per section)
| # | Section | Theme | Signature move |
|---|---|---|---|
| 0 | Preloader | ink | construction lines draw the Z monogram, mono line types, 000→100 counter, curtain lifts |
| 1 | Nav | auto | hides down / shows up, flips colour over dark bands, full-screen menu with Lahore clock |
| 2 | Hero | paper | giant WebGL word filled with the aurora shader (DEVELOPER ⇄ DESIGNER dissolve-swap), portrait parallax, stat cards |
| 3 | Statement | paper | scrubbed word-by-word colour reveal |
| 4 | About | paper | portrait card, signature draw-in, education card |
| 5 | Services | ink | velocity marquee (solid/outline), staggered capsule rows with live clips |
| 6 | Works: the screening room | ink | pinned R3F scene: glass Z, curved video panels on a ring, "WORKS" in 3D behind |
| 7 | More work | paper | staggered cards over a giant outline word plus a filterable index with a cursor-follow preview |
| 8 | How I work | paper | horizontal pinned 7 steps with a hand-drawn connector |
| 9 | Stack | paper | stacking colour bands (from the intro reel) |
| 10 | Journey | ink | table rows with a lime wipe on hover |
| 11 | From my LinkedIn | ink | vertical reels strip, plays on hover |
| 12 | Contact | ink | big CTA, copy-email, EmailJS form, the single lime button |
| 13 | Footer | ink | full-width ZAIN ALI over the aurora shader, magnetic back-to-top |

Routes: `/`, `/work`, `/work/[slug]`, `not-found`.

## 3. Tokens, fonts, monogram
- Colours: paper `#F3F2EF`, paper-2 `#E9E7E3`, ink `#0B0C0E`, ink-2 `#15171C`, muted `#6E6E73`, signal `#FF5A1F`, signal-soft `#E8915A`, lime `#D7FF3A`, blue `#1F6FA8`.
- Fonts: **Anton** (giant display, also drawn into the WebGL text texture), **Archivo** variable with the `wdth` axis (condensed headings + body), **IBM Plex Mono** (labels, HUD).
- Monogram: a geometric "Z" made of two horizontals and one diagonal inside a construction circle. It is the same SVG in the loader, nav and favicon, and is extruded as the glass prism in 3D.

## 4. Projects
| Order | Slug | Category | Theatre | Media |
|---|---|---|---|---|
| 1 | no-filter-coffee | Pitch concept | ✓ | capture + clip |
| 2 | four | Pitch concept | ✓ | capture + clip |
| 3 | health-n-goodness | Pitch concept | ✓ | capture + clip |
| 4 | chinatown-jade-cafe | Pitch concept | ✓ | capture + clip |
| 5 | radiora-international | Concept | ✓ | capture + clip |
| 6 | tamp-and-tide | Concept | ✓ | capture + clip |
| 7 | cheryl-trust | Client (NZ) | ✓ | capture + clip |
| 8 | syncup | FYP | ✓ | report screens |
| 9 | syncwave | Team | ✓ | capture + clip |
| 10 | seven-sides | Pitch concept | — | capture + clip |
| 11 | muffin-house | Pitch concept | — | capture + clip |
| — | leads-management-system, chance4change, care-rcm, brokerleadz, property-brokers, kamilla-norman, interiors, emts, … | Client / builds | — | mockups / capture |
| — | early projects | Archive | — | links only |

Every real-brand pitch carries `Pitch concept · not affiliated with <brand>`.

## 5. WebGL plan
- One raw-WebGL helper (`src/gl/aurora.ts`) for the hero text and the footer glow. It loads no three.js, so the hero stays light.
- R3F is used only in the Works theatre, dynamically imported once the section nears the viewport. Its pieces:
  - a cylinder grid room (shader lines + plus-markers),
  - an extruded glass Z (`MeshTransmissionMaterial`),
  - bent planes with `VideoTexture`,
  - an instanced dust field.
- Tiers: full (desktop with a capable GPU), light (no transmission, DPR 1), and 2D (under 768 px, reduced motion, or no WebGL), which shows the snap-carousel cards.

## 6. v1 status (2026-11-03)
- Built: every section above, `/work`, 19 case studies, 404, sitemap, robots. `npm run build`, `tsc` and ESLint pass.
- QA: headed Edge at 390, 768, 1440 and 1920. No console errors and no horizontal scroll.
- Media: 14 live sites captured (6 desktop + 3 mobile shots and a 12 s loop each). SyncUP screens come from the FYP report, client mockups from `SocialMedia_Images`.
- Not done:
  - The hero portrait is the original photo in a card. The rembg cut-out was skipped at Zain's request, so the portrait doesn't overlap the word as a cut-out yet.
  - Leads Management and Care RCM show typographic covers because their real screens hold private data.
  - The contact form has not sent a live test.

## 7. Open questions (defaults in use)
1. Real brand names on pitch work: **shown, with the not-affiliated label**.
2. Client vs gig status of the smaller builds: **listed as "Build" without a client claim**.
3. CV: **button hidden**.
4. LinkedIn text: **reel and FYP facts only**.
5. Phone/WhatsApp/Calendly: **email + form only**.
6. Testimonials: **section omitted**.
7. Portrait: **cut-out of `Zain-Nav.jpg`**.
8. Domain: **not deployed**.
9. 9th stack tool: **8 bands shown**.
10. Fiverr/Upwork: **not linked**.
