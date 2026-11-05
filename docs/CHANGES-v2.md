# Portfolio v2: change brief

Zain's review of v1, rewritten as a build brief. Every item ends with what "done" looks like. The new visual motif is **ribbons**: thick orange strokes plus thin hand-drawn lines that curl and loop, drawn in on scroll (the TWO 26 reference shots). Ribbons tie the light sections together. They stay behind the content and never cover text.

## Global
- **Magnetic buttons off.** Turn off the cursor pull on every button and keep the code, so it can come back later. Done: buttons stay still under the cursor and still show their hover fill.
- **No aurora anywhere.** The hero word and the footer lose the orange/blue noise. Done: the hero word is pitch black, and the footer is pitch black with a quiet texture.
- **Real social icons.** LinkedIn, GitHub, Instagram and Threads appear as icons, black by default. On hover the icon takes its brand colour; the black-brand ones (GitHub, Threads) fill their chip. They are used in the nav, menu, contact card and footer.
- **Care RCM is hidden.** It is still in progress. Done: it shows nowhere on the site.

## Hero
1. The DEVELOPER ⇄ DESIGNER word stays WebGL for the dissolve swap, filled solid ink with a thin orange seam only during the swap.
2. **Travelling-dot lines.** Two vertical guides (left and right) and three horizontal guides. A single orange dot with a short fading tail runs along one guide at a time, with random gaps of about 1.5–3.5 s and never two at once. Off under reduced motion.
3. **Portrait:** `Zain.png` upscaled 4× with Real-ESRGAN, the cut-out kept, and the bottom fading to transparent like the reference. It stands free in front of the word, with no card behind it.
4. **Centre card:** a 2–3 line headline that breaks cleanly: "Websites and web apps, / designed and built / end to end."
5. **Stat cards:** the two white cards fill signal orange on hover, with their text turning paper.
6. **Left card:** the "I build" items are larger. They drop and fade in with a stagger when they enter the viewport and turn orange on hover.

## "What I do"
- A thick orange ribbon and a thin looping line draw across the section as it scrolls (scrubbed).
- Each word turns orange only while hovered.

## Menu
- Links stay on the left. The right column holds a ribbon curl and construction lines at the top, and at the bottom the "ZAIN ALI" logotype, a Contact label, the email and the social icons.

## Works
- **Intro:** project posters sit around the WORKS word and fly outward past the camera as it zooms, with construction lines converging, so the zoom feels like entering a space.
- **Glass Z:** starts big in the centre when you land inside, then about 0.6 s later glides to the top-left corner and stays there until the end. It no longer pulses between projects, and it returns to centre only if you scroll back into the intro.

## Services (light)
- The section moves to paper. The marquee is ink, solid and outline.
- One ribbon starts at the top-right of the first card and zigzags behind the four rows as you scroll.
- Capsules show a still hero screenshot, with no video. "Web apps & dashboards" uses the TrackMe dashboard (charts and stats, nothing showing third-party contacts).

## About
- The portrait becomes the same cut-out, in a card with a 3D tilt that follows the cursor on hover.

## Client work
- **Cards:** Leads Management, Cheryl Trust, Chance4Change and Property Brokers. Kamilla Norman and Care RCM are removed.
- **Leads Management** uses the TrackMe screenshots, and **Chance4Change** uses its hero screenshot.
- **Layout:** two columns, with the right one offset down. Vertical height is roughly halved, and the up-down rhythm is kept.
- Ribbons run in the background.

## Index
- No archive rows and no Archive filter. Interiors, Kamilla Norman and Seven Sides are left out.
- On hover the row text turns signal orange (no ink fill).

## How I work
- Each step card gets a small animated line-art vignette in the site's style that shows the step: chat bubbles, data rows under a lens, wireframe boxes, swatches and Aa, typing code, a score ring with a deploy line, and an uptime pulse. They are drawn by code, so nothing looks stock or fake.

## Contact
- The portrait becomes the cut-out, and the socials become icons.
- The background is darker, with a subtle pattern (a dot grid plus a faint ribbon).
- **Form delivery:** verify that EmailJS actually delivers to Zain's inbox. If it doesn't, wire a working path and report what Zain needs to do.

## Footer
- Pitch black, with no aurora.
- **"ZAIN ALI":** a wide, heavy, tightly tracked wordmark (Archivo at full expansion, black weight) that fits edge to edge naturally, replacing the spread-out Anton letters.

## Done when
- Type check, lint and production build pass.
- No console errors at 390, 768, 1440 and 1920.
- Every item above has been checked visually.
