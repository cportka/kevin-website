# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[1.4.0]: https://github.com/cportka/kevin-website/releases/tag/v1.4.0
[1.3.0]: https://github.com/cportka/kevin-website/releases/tag/v1.3.0
[1.2.0]: https://github.com/cportka/kevin-website/releases/tag/v1.2.0
[1.1.0]: https://github.com/cportka/kevin-website/releases/tag/v1.1.0
[1.0.0]: https://github.com/cportka/kevin-website/releases/tag/v1.0.0
