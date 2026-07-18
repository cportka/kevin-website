# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.10.0] - 2026-07-18

### Added
- **Click the corner diorama to zoom it to full screen.** On the main page the
  weather widget is now a button: clicking (or Enter/Space) animates it up to a
  centered, whole-integer-scaled overlay — the same look as `/weather` — over a
  backdrop that covers the page; clicking again (or the backdrop, or Escape)
  docks it back to its 100×100 corner. The zoom is a FLIP transform, so the
  motion is smooth **and** the resting state is a crisp integer upscale (never a
  transform-blurred one). Page scroll locks while expanded; `aria-pressed`,
  keyboard, focus ring, and `prefers-reduced-motion` (instant, no animation) are
  all handled. The `/weather` page is exempt (it's already full-screen).

## [1.9.0] - 2026-07-18

### Added
- **`/weather` — a standalone view of the living LA diorama.** A new page
  (`weather.html`) that shows *only* the pixel-art beach diorama, centered
  horizontally and vertically and blown up to fill the screen. It scales by
  **whole integers** (2×, 3×, 4× …) — the largest N such that an N×100px square
  fits the smaller viewport axis — so every source pixel stays a crisp square
  with no blur or half-pixels; the size updates live on resize. Same real Los
  Angeles time/weather/tide/surf engine (`assets/js/scene.js`) as the corner
  jewel, with its own tight CSP (same-origin only + the four keyless data APIs,
  no third-party scripts/styles/fonts) and a pre-paint theme + sizing script.
  The test suite now covers `weather.html` too: asset integrity, and the CSP
  inline-hash and connect-src checks now validate every page against its own
  policy.

## [1.8.1] - 2026-07-18

### Changed
- Diorama polish: the coast road is now **straight** (dropped the wavy curve);
  the **neon billboard is larger** (twin posts, chunkier glow, and a proper
  degree symbol on the temperature); and the **palm has a pronounced curved,
  drooping silhouette** — the trunk arcs over and the fronds hang down, still
  swaying with LA wind.

## [1.8.0] - 2026-07-17

### Changed
- **The corner weather widget is now a living 100×100 pixel-art LA beach
  diorama** (`assets/js/scene.js`), replacing the single line icon. A vintage
  80s LA-noir scene — dithered sky, ocean with waves, sand, an askew coast
  road, a neon sign, and a wind-swept palm — all driven by **real Los Angeles
  time and conditions**:
  - Sun rises/arcs/sets at LA's actual sunrise/sunset; a crescent moon and
    stars at night. Sky gradient tracks the weather (blues clear, greys for
    cloud/fog, storm-dark for rain, and a **brown smog/smoke tint when the LA
    AQI is high**); the sun dims behind haze/cloud.
  - **Ocean waves** scale their whitecaps and speed to LA surf (Open-Meteo
    Marine `wave_height`); the **shoreline shifts with the Santa Monica tide**
    (NOAA CO-OPS).
  - **Cars occasionally pass** — pickup, semi, red sports car, hybrid,
    motorcycle, logging truck (with logs), electric car, and a beat-up jalopy,
    with headlights at night.
  - A **neon sign shows the temperature**; its neon tubes light up around
    sunset and switch off after dusk. The **palm sways with LA wind** intensity.
  - Data via keyless CORS APIs (Open-Meteo forecast/marine/air-quality, NOAA
    tides) added to the CSP `connect-src` — `script-src` unchanged (still no
    third-party scripts). Everything degrades gracefully: any failed/blocked
    source falls back, and reduced-motion / no-JS visitors get a single static
    frame or nothing. A ~12 fps loop that pauses when the tab is hidden.

## [1.7.0] - 2026-07-17

### Added
- **Floating LA weather widget** in the bottom-right corner, just above the
  000–100 scroll counter (same right edge, `difference` blend so it stays
  legible over any background, in light and dark). A thin-stroke line icon
  visualizes current Los Angeles conditions — with day/night variants
  (sun/moon, partly-cloudy, cloud, fog, rain, snow, thunder) — and the
  temperature in °F sits beneath it. Data comes from Open-Meteo (no API key,
  CORS), allowed by a single `connect-src` origin added to the CSP; a new test
  enforces that the CSP covers whatever origin `main.js` fetches. Pure
  progressive enhancement: if the request is blocked/offline/failing, the
  widget simply never appears and nothing else is affected.

## [1.6.3] - 2026-07-17

### Added
- `assets/social/github-social.png` — a 1280×640 social asset in the site's
  design language (eyebrow, name, roles, domain wordmark, rounded portrait),
  sized to GitHub's repository social-preview spec and deployed with the site
  at https://kevinhaulihan.online/assets/social/github-social.png.

## [1.6.2] - 2026-07-17

### Added
- **Portka standard installed in-repo** via `repo-bootstrap --portka-standard`:
  a committed `.claude/CLAUDE.md` workflow block (branch per change → tests +
  CI → PR → merge on green → the owner deletes the branch as confirmation), a
  `.claude/settings.json` enabling the `app-website-evaluator` plugin with a
  git/gh permissions allowlist for future sessions, and the standard's native
  `node:test` version-sync test (`tests/version-sync.test.mjs`).

## [1.6.1] - 2026-07-17

### Changed
- **kevinhaulihan.online joins the visual identity**: set as a quiet mono
  wordmark line in the footer colophon, and it replaces the "Reel / 2026" tag
  on the social share card.

## [1.6.0] - 2026-07-17

### Changed
- **The site now lives at [https://kevinhaulihan.online](https://kevinhaulihan.online).**
  Every absolute URL — canonical, Open Graph/Twitter (`og:url`, share images),
  the JSON-LD graph, `robots.txt`'s sitemap pointer, `sitemap.xml`, `llms.txt`,
  `security.txt`, README, and `package.json#homepage` — moved from
  `cportka.github.io/kevin-website` to the custom domain. A `CNAME` file ships
  with the site, the 404 page's root-absolute links now target the domain root
  (no more `/kevin-website/` base path), and the test suite requires `CNAME`.
  Bonus: `robots.txt` and `sitemap.xml` are now served from the host root,
  where crawlers actually honor them.

## [1.5.0] - 2026-07-17

### Added
- **Kevin's portrait across the site's identity surfaces**, cropped to always
  keep the whole visible face: a subtle circular headshot beside the name in
  the footer; a circular-clipped photo `favicon.svg`; photo
  `apple-touch-icon.png` and a new `icon-512.png` (added to the manifest); a
  regenerated social share card (`og.png`) pairing the type with the rounded
  portrait; and the JSON-LD `Person.image` now points at the real headshot.

## [1.4.0] - 2026-07-15

### Changed
- **Selected Work hang rebuilt as a two-column editorial stack.** The old
  row-based grid paired mismatched heights, leaving ragged, accidental-looking
  offsets between rows. Now a wide left column and a narrow right column each
  keep a perfectly uniform vertical rhythm, with the right column staggered
  down once — every offset is systematic. Items were re-curated between the
  columns (the landscape banner lives in the wide column) and renumbered to
  read down the left (01-05) then down the right (06-10).
- **Corner counter is now a site-position indicator (000 → 100)** — 000 at the
  very top of the page, 100 at the very bottom — replacing the less useful
  per-project folio. Updates via a passive, rAF-throttled scroll listener.

- **First visit now defaults to the light theme** (the site's canonical look)
  instead of following the OS preference; dark mode is an explicit choice via
  the toggle, remembered across visits.
- Evaluator-driven improvements (Portka app-website-evaluator now scores the
  site 100/100 A across all seven dimensions): the pre-paint theme/intro
  script is inlined and authorized by a CSP `sha256` hash — first paint no
  longer waits on a blocking script request — with a new test enforcing that
  the hash always matches the inline script; JSON-LD enriched to a graph of
  `Person` + `WebSite` + an `ItemList` of the ten selected works.

### Removed
- The reel's Sound/Mute button — the current reel has no audio track. Restore
  when a reel with sound ships.

## [1.3.0] - 2026-07-15

### Changed
- The intro loading screen no longer shows the reel's poster frame; it is now a
  "projector warm-up" hue cycle — **black → purple → blue → red → orange →
  white** — running as one continuous color track that completes exactly as the
  panel finishes collapsing onto the reel's frame. The wordmark sits solid
  white over the dark half of the cycle and fades before the light half.

## [1.2.0] - 2026-07-15

### Added
- **Intro loading screen**: on load, a full-viewport panel (the reel's poster frame
  with a centered wordmark) collapses down onto the reel's frame, then lifts and
  hands playback off to the video. Armed before first paint by the same-origin
  head script (no flash, CSP intact), it plays only when JS is on and motion is
  allowed — no-JS and reduced-motion visitors get the plain page — and carries
  two safety nets so the overlay can never trap the page.

### Changed
- Corrected Kevin's credit across the site: **Emmy-winning** (previously
  "Emmy-nominated") — masthead, meta/OG/Twitter descriptions, bio, `llms.txt`,
  and a regenerated social share image; added `"award": "Emmy Award"` to the
  Person JSON-LD.

## [1.1.0] - 2026-07-12

### Added
- **Dark mode** with a top-right toggle in the masthead. A warm "black-box"
  palette (near-black ground, bone-white ink, brighter ember accent) mirrors the
  light "white-cube" design. The choice persists (`localStorage`) and defaults to
  the visitor's OS preference; an inline-free, same-origin head script applies the
  theme before first paint so there's no flash, and toggling crossfades (respecting
  `prefers-reduced-motion`). Browser chrome (`theme-color`) tracks the active theme.

### Changed
- Tightened the Selected Work grid's vertical rhythm (reduced row gap and section
  padding) so the gallery reads as a cohesive hang with less negative space.

## [1.0.0] - 2026-07-11

### Added
- Complete redesign of Kevin Haulihan's portfolio site, rebuilt from the ground up as a
  hand-written static site (no framework, no Carrd export cruft).
- Editorial, modernist layout inspired by mouthwash.studio: white background, generous
  whitespace, a refined typographic grid, rounded-corner imagery, and captions set beneath
  each thumbnail.
- Autoplay muted reel with a poster frame; re-encoded from the source `.mov` to a
  web-optimized, faststart `.mp4` (6.5 MB → ~1.3 MB).
- Selected-work grid of ten projects, each linking out to the piece, with role captions.
- About section with Kevin's bio.
- Responsive `<picture>` images (WebP with JPEG fallback), lazy-loading below the fold, and
  explicit dimensions to avoid layout shift.
- Full SEO/social metadata: unique title + description, canonical URL, Open Graph and Twitter
  cards, and `Person` JSON-LD structured data.
- Crawl / AI-readiness / brand files: `robots.txt`, `sitemap.xml`, `llms.txt`,
  `site.webmanifest`, SVG favicon + Apple touch icon, `humans.txt`, and
  `.well-known/security.txt`.
- Accessible foundation: semantic landmarks, `lang`, descriptive `alt` text, visible focus
  states, and `prefers-reduced-motion` support.
- GitHub Actions pipeline: a test suite (SemVer/version sync, asset integrity, required-meta
  checks) gating a GitHub Pages deploy.

[1.10.0]: https://github.com/cportka/kevin-website/releases/tag/v1.10.0
[1.9.0]: https://github.com/cportka/kevin-website/releases/tag/v1.9.0
[1.8.1]: https://github.com/cportka/kevin-website/releases/tag/v1.8.1
[1.8.0]: https://github.com/cportka/kevin-website/releases/tag/v1.8.0
[1.7.0]: https://github.com/cportka/kevin-website/releases/tag/v1.7.0
[1.6.3]: https://github.com/cportka/kevin-website/releases/tag/v1.6.3
[1.6.2]: https://github.com/cportka/kevin-website/releases/tag/v1.6.2
[1.6.1]: https://github.com/cportka/kevin-website/releases/tag/v1.6.1
[1.6.0]: https://github.com/cportka/kevin-website/releases/tag/v1.6.0
[1.5.0]: https://github.com/cportka/kevin-website/releases/tag/v1.5.0
[1.4.0]: https://github.com/cportka/kevin-website/releases/tag/v1.4.0
[1.3.0]: https://github.com/cportka/kevin-website/releases/tag/v1.3.0
[1.2.0]: https://github.com/cportka/kevin-website/releases/tag/v1.2.0
[1.1.0]: https://github.com/cportka/kevin-website/releases/tag/v1.1.0
[1.0.0]: https://github.com/cportka/kevin-website/releases/tag/v1.0.0
