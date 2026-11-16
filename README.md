# EVERGROVE — Cinematic 3D Website

A frontend-only brand experience for EVERGROVE: premium greenery and turf supply, landscaping and installation, lawn and garden care, and consultation. It is not an e-commerce site: there's no cart, checkout, backend or admin.

## Run

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build -> dist/
npm run preview   # serve the build on http://localhost:4173
```

## Stack

React 19 + Vite (JSX) · Three.js · React Three Fiber · Drei · GSAP + ScrollTrigger · Framer Motion · Lenis · Lucide React · plain CSS.

## Architecture

```
src/
  main.jsx, App.jsx        app shell: providers, section order
  lib/motion.jsx           Lenis ↔ GSAP ticker bridge, ScrollTrigger, reduced-motion hook
  lib/enquiry.jsx          shared enquiry state — any CTA opens the drawer pre-set
  data/content.js          ALL copy: nav, 4 divisions, collections, services, projects, enquiry types
  data/media.js            media manifest — every image/video/model slot + its shot brief
  components/              Nav, Logo, Media (+ placeholder plates), Cta, Reveal, Cursor,
                           EnquiryForm, EnquiryDrawer
  sections/                Hero, World, About, Collections (+GrassFinder), Landscape,
                           Botanical (3D), Services, Projects, FinalCta, Contact, Footer
  three/                   BotanicalScene + Specimen (section 06)
  styles/                  tokens.css, base.css, sections.css
```

| # | Section | Motion |
|---|---|---|
| 01 | Hero | Scroll-scrubbed aerial flight: the section pins while a 150-frame drone sequence plays forward and back with the scroll (avenue → estate → woodland → parkland), with Supply / Install / Care / Advise chapters and a timecode HUD |
| 02 | The World | Pinned camera push through a collage: outer frames fly past, the centre frame opens full-screen |
| 03 | About | Supply → Install → Care → Advise cycle, with a growing stem scrubbed by scroll |
| 04 | Greenery | Pinned horizontal gallery (9 categories) with in-frame parallax, plus a "Find Your Perfect Grass" finder |
| 05 | Landscaping | Pinned sequence of 6 scenes: clip-path wipes and slow zooms |
| 06 | 3D Botanical | Scroll-orbited, cursor-tilted procedural specimen (real geometry, shadows, studio lighting) |
| 07 | What We Do | Editorial accordion with a cursor-following image preview |
| 08 | Projects | Sticky stacked cards. **All are labelled concept studies, not real clients** |
| — | Final CTA | Window-to-full-bleed reveal |
| 09 | Contact | Consultation form (5 enquiry types) |

Under `prefers-reduced-motion`, Lenis is disabled, every GSAP animation is skipped (via `gsap.matchMedia`), pinned sequences fall back to static layouts and the hero shows a still photograph. On screens below 900px, the horizontal gallery and the stacked cards become native swipe or scroll. WebGL render loops pause when their section is off-screen.

## CTAs and forms

Every CTA goes through `<Cta>`. `{ href: '#section' }` smooth-scrolls to that section, and `{ enquiry: 'grass' | 'landscaping' | 'maintenance' | 'supply' | 'expert' }` opens the consultation drawer pre-set to that type (and to a subject, such as a grass variety). Forms validate on the client and show a confirmation. To make them send, connect `submit()` in `components/EnquiryForm.jsx` to a form service (Formspree, an email API or a CRM webhook).

## Photography

All 32 photographs are real images from Unsplash (Unsplash License, free for commercial use), chosen for the slot they fill. They live in `public/assets/images/{hero,world,collections,landscape,services,projects,closing}/` as WebP files at three widths (1280/1920/2560 for full-bleed, 640/1024/1600 for cards). They're served with `srcset`/`sizes`, lazy-loaded below the fold, and the hero is preloaded.

- **Selection, alt text and focal points**: `src/data/images.json` is the single source of truth.
- **Swap an image**: change its `id` (or `path`), then run `node scripts/fetch-images.mjs` and `node scripts/optimize-images.mjs`.
- **Provenance**: see `IMAGE-CREDITS.md`.

## Hero flight sequence

The hero plays a real drone clip (Pexels video 27682586, Pexels License, free for commercial use) as an image sequence drawn to a canvas. Desktop gets 150 AVIF frames at 1280×720 (11.8 MB) and mobile gets 150 portrait-cropped frames at 640×854 (6 MB), stored in `public/assets/sequences/hero-flight/`.

- Frames load sparse-to-dense, so the flight can be scrubbed after roughly the first 10 frames arrive. The still hero photo shows until frame 1 loads.
- With reduced motion, or in a browser without AVIF support, no frames are downloaded and the still photograph is shown instead.
- To rebuild from a new clip, run `node scripts/build-hero-sequence.mjs <clip.mp4>`.

## Still to be supplied by EVERGROVE

- **Logo**: set `media.logo.src` to `/media/brand/evergrove-logo.svg`. The current wordmark is a neutral typographic stand-in.
- **GLB plant (optional)**: setting `models.specimen` loads a model instead of the procedural 3D specimen. Keep it under 2 MB, Draco/meshopt-compressed, with textures at 1024px or smaller.

Contact details and social links are placeholders, marked as such on the page.
