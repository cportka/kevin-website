# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[1.0.0]: https://github.com/cportka/kevin-website/releases/tag/v1.0.0
