# kevin-website

Portfolio site for **Kevin Haulihan** — director / writer / producer.

**Version:** 1.12.1

A hand-written static site (no framework), deployed to GitHub Pages via GitHub Actions. The
design takes its cues from [mouthwash.studio](https://mouthwash.studio/): a white background,
editorial typography, generous whitespace, rounded-corner imagery, and captions set beneath each
thumbnail.

## Live site

https://kevinhaulihan.online/ — and https://kevinhaulihan.online/weather for the
living LA diorama on its own, scaled up to fill the screen.

## Structure

```
index.html              # the whole page
404.html                # branded not-found page
weather.html            # /weather — the diorama alone, centered + integer-scaled
assets/
  css/style.css         # design system + layout
  js/main.js            # scroll reveal, intro, scroll counter
  js/scene.js           # living pixel-art LA beach weather diorama (corner widget; click to zoom)
  img/                  # project thumbnails (.webp + .jpg fallback)
  video/                # reel (.mp4) + poster
  social/og.png         # link-share card (1200×630)
  social/github-social.png  # GitHub repo social preview (1280×640)
favicon.svg             # circular headshot favicon (embedded photo)
apple-touch-icon.png    # 180×180 touch icon
site.webmanifest        # PWA/brand manifest
robots.txt, sitemap.xml, llms.txt, humans.txt
.well-known/security.txt
```

## Develop

It's a static site — open `index.html` directly, or serve the folder:

```
python3 -m http.server 8000   # then visit http://localhost:8000/
```

## Test

```
npm test        # or: bash tests/run-tests.sh
```

The suite enforces the [Portka standard](https://github.com/cportka/claude-plugins) version sync
(SemVer; `package.json`, `CHANGELOG.md`, and this README's version line must agree), verifies that
every locally-referenced asset resolves, and checks that required SEO/social/accessibility meta is
present. CI runs it on every push and PR, and the deploy is gated on it.

## Deploy

Pushing to the live branch triggers `.github/workflows/deploy.yml`, which runs the tests, assembles
a clean `_site/` tree, and publishes it to GitHub Pages. Pages must be set to **Build and
deployment → Source: GitHub Actions** (the workflow attempts to enable this automatically on first
run).

## Releasing

Following the Portka standard: bump the version in `package.json`, add a `## [x.y.z]` section to
`CHANGELOG.md`, and update the version line above — all in a PR. Tagging and cutting the GitHub
Release is a manual step done from the GitHub UI after merge.

## Credits & rights

Design and build by Chris Portka. All creative content — the reel, project thumbnails, and
copy — is © Kevin Haulihan and used with permission; it is **not** licensed for reuse. The
site's own source code is unlicensed (all rights reserved) barring a separate agreement.
