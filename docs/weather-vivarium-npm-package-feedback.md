# weather-vivarium — adoption feedback

Field notes from swapping this site's hand-built LA beach diorama (`assets/js/scene.js`,
916 lines, now archived in `archive/la-beach-diorama/`) for the
[**weather-vivarium**](https://www.npmjs.com/package/weather-vivarium) npm package,
vendored under `assets/vendor/weather-vivarium/` and pinned to Los Angeles. Written
against `1.0.0` on 2026-08-09, from a real integration into a **no-build static site
with a strict CSP** — probably close to the package's hardest consumer profile.

> ## ✅ All 12 findings are fixed in 1.1.0 — this site now runs it
>
> `1.1.0` (2026-08-09) is *"the adoption-feedback release"* and closes every item
> below. The practical result here: **the glue shrank from 124 lines to 40**, the
> whole zoom seam (`smoothZoom` + `fitOverlay`, ~90 lines) was deleted as dead code,
> `/weather` went back to a strict `style-src 'self'`, and the cold load dropped from
> **56 requests to 2**. The findings are kept below exactly as written, each annotated
> with what shipped, because the record of what a first integration actually hits is
> more useful than a tidy list of closed tickets.

**Verdict: keep** — and, after 1.1.0, without reservation. The swap deleted ~900 lines
of site-specific widget code and a whole rendering engine; what's left on our side is
a 40-line mount and 22 lines of corner-placement CSS.

> **Revision history.** First drafted the day of the swap (glue: 33 lines). Living with
> `1.0.0` added findings #8–#12 and ~90 lines of glue, all clustered at one seam.
> Upgrading to `1.1.0` removed all of it. Numbers below are current as of the upgrade.

## What worked well

- **Genuinely drop-in for a no-build site.** Pure ESM, zero runtime dependencies,
  `createVivarium(el, { city })` and done. Vendoring the published tree and importing
  it from a `<script type="module">` worked first try — no bundler, no transpile, no
  shims. (We vendored `src/` on 1.0.0; on 1.1.0 we vendor `dist/` and load one file.)
- **Explicit coordinates skip the network.** Passing `lat`/`lon`/`timezone` boots the
  scene instantly with no geocoding request — `ready` resolves synchronously and the
  geocoding origin never fires. Exactly right for a site pinned to one city.
- **The curated landscape matching nails LA.** `city: "Los Angeles"` resolves to the
  Malibu Coast landscape, `coastal: true` (so marine data flows), °F from the country,
  and the beachgoer cameo survived generalisation. The aria-label reads
  *"Los Angeles: 74°F, clear, day — a pixel-art Malibu Coast weather diorama."*
- **Progressive enhancement is real, not aspirational.** With every API blocked (we
  tested behind a deny-by-default proxy), the scene still renders on `defaultState()`
  and each data source degrades independently. No spinner, no error state, no blank box.
- **The CSS-variable escape hatch is quietly excellent.** A non-numeric `size` makes the
  widget leave `--wv-size` alone, so the host stylesheet owns sizing entirely — our
  integer-fit `/weather` page and the 84px mobile corner both worked without touching
  package code. (Undocumented in 1.0.0; `size: "css"` is documented in 1.1.0 — #3.)
- **Interactive mode covers the plumbing around a zoom** — backdrop, scroll lock,
  focus/keyboard handling, `aria-pressed` — and adds an info card (21 labelled rows
  about the place, Moon phase included as of 1.1.0) we never had. *Revised twice:* the
  first draft credited it with replacing our FLIP animation, which 1.0.0 didn't do
  (findings #8 and #10) — but **1.1.0 does**, so the original claim is finally true.
- **Accessibility came along:** `role="img"` with a live descriptive label,
  Enter/Space/Escape on the widget, `aria-pressed`, `:focus-visible`, and a
  reduced-motion still frame.
- **The instance API beats our old test hooks.** `setWeather` / `setTimeOverride` /
  `renderFrame` replaced the bespoke `window.__sceneTest` globals we used to maintain
  for visual regression shots.
- **Provenance hygiene:** `VERSION` exported from `src/index.js`, LICENSE in the
  tarball, README quick-start matched reality, maintainer/author verifiable on the
  registry.

## Rough edges (each with a suggestion) — all fixed in 1.1.0

*Each item is as written against `1.0.0`; the **→ 1.1.0** line records what shipped.*

1. **Stacking-context trap when the host is `position: fixed`.** The expanded `.wv`
   (z 9991) stays inside its host's stacking context while `.wv-backdrop` (z 9990) is
   appended to `<body>`. A fixed-position host — the *natural* container for a corner
   widget — creates a stacking context in modern browsers, so the expanded scene paints
   **under** its own backdrop. We worked around it by leaving the host unpositioned and
   pinning the *docked* `.wv` itself to the corner, relying on fixed-position
   over-constraint resolution to drop our `right`/`bottom` when `is-expanded` sets
   `top`/`left`. That's subtle CSS a consumer shouldn't need to discover.
   *Suggestion:* reparent the wrap to `<body>` on expand (leave a placeholder to dock
   back into), or document the constraint prominently.
   **→ 1.1.0:** fixed — while expanded the widget visits `<body>` (an invisible
   placeholder holds its docked spot), so a positioned host can't trap it. We deleted
   the over-constraint trick; the host is a plain div again.
2. **Runtime `<style>` injection vs. strict CSP.** `injectStyles` appends a `<style>`
   element, which a `style-src 'self'` policy blocks — our `/weather` page had to
   loosen to `'unsafe-inline'`. *Suggestion:* also publish the stylesheet as a real
   file (`weather-vivarium/style.css`) consumers can `<link>`, and/or list the sha256
   of the injected CSS per release so hash-based `style-src` works.
   **→ 1.1.0:** fixed — the CSS ships as `weather-vivarium/style.css`. Loading it as
   `<link id="wv-styles">` suppresses injection entirely, so `/weather` is back to a
   strict `style-src 'self'`. A `nonce` option and a published sha256 cover pages that
   keep injection.
3. **`size` is constructor-only.** There's no `setSize()`; resizing after mount only
   works via the undocumented non-numeric-`size` + `--wv-size` route. *Suggestion:*
   document a `size: "css"` sentinel in the README options table (it's the best way to
   consume the widget responsively today), or add a real resize method.
   **→ 1.1.0:** fixed — `setSize()` added, and `size: "css"` is documented in the
   README options table (it's what this site uses).
4. **Escape only closes the overlay while the widget has focus** (the keydown listener
   sits on the wrap, not the document). After clicking elsewhere, Escape does nothing;
   our archived version listened document-wide. *Suggestion:* add a document-level
   Escape handler while expanded.
   **→ 1.1.0:** fixed — the keydown listener is document-wide while expanded, and only
   then. Verified: Escape with focus on `<body>` closes the overlay.
5. **56 module files per cold load.** `src/` ships unbundled (great for reading,
   fine over HTTP/2), but a no-bundler consumer pays a 56-request import waterfall on
   first visit. *Suggestion:* ship an optional single-file `dist/weather-vivarium.min.js`
   alongside `src/` for `<script type="module">` consumers.
   **→ 1.1.0:** fixed — `dist/weather-vivarium.min.js` ships as one minified ES module,
   built with a pinned esbuild and guarded by a freshness test. Our cold load went from
   56 requests to 2 (bundle + stylesheet); the vendored payload from 644 KB to 236 KB.
6. **Time override is minutes-only.** `options.now` (minutes since midnight) covers
   the daylight cycle, but moon phase and seasonal sun arc stay pinned to the real
   date — our old harness could freeze a full ISO datetime for reproducible shots.
   *Suggestion:* accept a `Date`/ISO string too.
   **→ 1.1.0:** fixed — `now` / `setTimeOverride()` accept a `Date` or ISO string, so the
   moon phase and calendar day freeze along with the clock.
7. **README mentions `data/cities/` datasets that aren't in the tarball** (the `files`
   allowlist ships `src/` only; `loadCities(url)` expects you to host them). Reasonable
   choice — just worth a sentence in the README so consumers don't go looking.
   **→ 1.1.0:** fixed — the README documents the tarball contents and that `data/cities/`
   must be self-hosted for `loadCities(url)`.
8. **Expand/collapse snaps — there's no transition between docked and expanded.**
   `wireZoom` toggles `is-expanded` and only the backdrop fades; the scene itself
   jumps between its two boxes. We restored the smooth zoom from the outside: a
   `MutationObserver` on the wrap's `class` FLIP-animates each toggle (invert from
   the cached previous box, then release), which works because observer callbacks
   run as microtasks — before the next paint — so the inverted first frame never
   flashes. It survives every toggle path (click, keyboard, backdrop) without
   touching package code, but it's a ~58-line function every motion-caring
   consumer will rewrite. *Suggestion:* build the FLIP into `wireZoom`, or at least emit
   `expand`/`collapse` lifecycle events so hosts can animate without observing
   class mutations.
   **→ 1.1.0:** fixed — a built-in FLIP (350ms, matched to the backdrop fade, skipped
   under reduced motion), plus bubbling `wv:expand` / `wv:collapse` events and
   `expand()` / `collapse()` / `toggle()` / `expanded`. Our 58-line `smoothZoom` is gone;
   measured tween: 100 → 118 → 153 → 493 → 668 → 700px.
9. **During collapse, the scene dims under its own backdrop.** The moment
   `is-expanded` drops, the wrap's z-index falls back to the host's docked value
   while `.wv-backdrop` (z 9990) is still fading for ~350 ms — so the shrinking
   scene renders *behind* the dark veil. (Our archived widget had this exact bug
   once; it seems to be a rite of passage.) Our FLIP wrapper pins an inline
   `z-index: 9991` on the wrap for the duration of the animation. *Suggestion:*
   keep an `is-collapsing` class (holding the expanded z-index) on the wrap until
   the backdrop's fade completes.
   **→ 1.1.0:** fixed — an `is-collapsing` class holds the overlay z-index until the
   backdrop's fade completes. (One note for fixed-position hosts: that class also sets
   `position: relative`, so a host that pins the *docked* widget must restate its own
   positioning for it — 4 lines here.)
10. **On a phone, the info card covers the scene it describes.** Below the 900px
   breakpoint the card becomes a bottom sheet (`bottom:10px; max-height:30vh`),
   but `intSize()` still sizes from `min(innerWidth, innerHeight) - 32` and
   `.wv.is-expanded` still centres on the *full* viewport — so the sheet sits on
   top of the scene's lower third (the wide-screen path gets this right, reserving
   350px). We measure the card and re-fit the overlay into the band above it,
   re-snapping to a whole multiple of 100px. *Suggestion:* mirror the wide-screen
   reservation on narrow — subtract the sheet's height from the available box and
   centre in what's left.
   **→ 1.1.0:** fixed — `intSize()` reserves the bottom sheet's band (30vh + inset) on
   narrow screens and the overlay centres above it, mirroring the wide-screen
   reservation. Our `fitOverlay` is gone; measured 166px clear at 430×932.
11. **The info card can show `19:60`.** `attributes()`' `hhmm()` computes
   `h = floor(mins/60)`, `m = round(mins % 60)` — at 19:59:36+ the rounded
   minutes hit 60 without carrying into the hour, so "Local time" renders as
   `19:60` (we caught it in a screenshot at dusk). *Suggestion:* round first,
   then split: `mins = round(mins); h = floor(mins/60) % 24; m = mins % 60`.
   **→ 1.1.0:** fixed — the whole value is rounded before splitting (shared as
   `astronomy.formatHHMM`), with a sweep test asserting no minute of the day formats
   as `:60`.
12. **A transparent row is left in the scene at `roadBot`** — an unpainted
   1px band across the full width, just below the road. On an opaque page it
   reads as a faint seam; zoomed over the overlay's translucent backdrop the
   page content shows *through* the diorama, which is how we noticed it (the
   row scales with the widget — ~14px tall on a 700px overlay).

   Not a typo but a **convention disagreement about whether `roadBot` is
   inclusive**, split across two files:

   ```js
   // compositor.js drawRoad() — roadBot EXCLUSIVE: paints rows 37..45
   P.rect(x, G.groundTop, 1, G.roadBot - G.groundTop, C.surf);
   // biomes.js drawShoulder() — roadBot INCLUSIVE: starts at 47
   P.rect(0, env.roadBot + 1, P.L, P.L - env.roadBot - 1, env.col(ground));
   ```

   Row 46 belongs to neither, so nothing ever paints it. All 13 biome
   shoulders start at `roadBot + 1`, so it isn't biome-specific. Measured by
   reading the canvas back (`getImageData`, alpha 0 across all 100 columns):

   | biome | fully transparent logical rows |
   | --- | --- |
   | coast (our LA scene), mountain, desert, city | **46** |
   | ocean (`drawShoulder` is a no-op) | **46, 47, 48** |
   | forest, tundra, plains | none — their ground fill happens to cover it |

   Identical at midday and at 02:00, on both the docked and expanded widget.
   *Suggestion:* pick one convention and state it where `GEOMETRY` is defined —
   the smaller change is `drawShoulder` starting at `env.roadBot` (road owns
   `[groundTop, roadBot)`, shoulder owns `[roadBot, L)`). Worth a regression
   test too: render each biome and assert no row of the 50×50 buffer is fully
   transparent. That one assertion catches this *and* the ocean case, which is
   three rows and presumably not intended either.

   **→ 1.1.0:** fixed — the convention is stated where `GEOMETRY` is defined (road owns
   `[groundTop, roadBot)`, shoulder owns `[roadBot, L)`), every shoulder starts at
   `roadBot`, the ocean fills to the bottom edge, and a pixel-coverage test renders all
   14 biomes and fails on any unpainted cell — the exact test suggested here. Verified
   on our own scene: zero fully transparent rows, where 1.0.0 had two.
## Integration cost, measured

| | before (`scene.js`) | on `1.0.0` | on `1.1.0` |
| --- | --- | --- | --- |
| site-owned widget code | 916 lines (engine + widget) | 124 lines of glue | **40 lines** |
| ⤷ mount + LA config | — | 34 lines | 40 lines |
| ⤷ zoom motion + overlay fit | — | 90 lines (#8–#10) | **0 — deleted** |
| site-owned widget CSS | ~110 lines (`.scene*`) | 27 lines | 22 lines (corner placement) |
| vendored payload | — | 644 KB, 56 modules | **236 KB, 1 bundle** |
| requests to load the widget | 1 (own file) | 56 | **2** (bundle + stylesheet) |
| CSP connect-src | 3 × Open-Meteo + NOAA tides | 4 × Open-Meteo (tide now modelled) | same |
| CSP style-src (`/weather`) | `'self'` | `'self' 'unsafe-inline'` (#2) | **`'self'`** |
| info card / any-city / zoom motion | none / none / hand-rolled | included / included / hand-rolled (#8) | all included |

The engine — sky, weather, sprites, place resolution, ~800 of those 916 lines — is
what actually left, and it isn't coming back. The glue that grew on `1.0.0` was
entirely the zoom seam, and `1.1.0` deleted it: what remains is a mount, a config
object, and enough CSS to pin a corner.

## Bottom line

`1.0.0` was a strong first release: the hard parts (place resolution, data plumbing,
progressive enhancement, a11y) were already done well, and every rough edge had a
workaround. `1.1.0` removed the need for all of them.

The single most useful observation from the whole exercise was structural rather than
any individual bug: **findings 1, 8, 9 and 10 were one seam, not four bugs.**
`wireZoom`'s expand/collapse was the only place the package took over layout —
position, size, stacking, and the transition between two boxes — and the only place a
host couldn't reach except by observing DOM mutations. Every workaround we wrote had
the same shape: watch the class, then correct what the package just did, before the
browser paints. 1.1.0 opened that seam (built-in FLIP, `wv:expand`/`wv:collapse`
events, programmatic `expand()`/`collapse()`, reparenting to `<body>`, and a
narrow-screen fit), and all four workarounds vanished together — 90 of our 124 glue
lines, deleted in one upgrade. Fixing the seam beat fixing the symptoms, which is
worth remembering the next time a consumer's workarounds start rhyming.

Only one small edge survives the upgrade, and it's inherent rather than a defect: the
`is-collapsing` class sets `position: relative`, which assumes a host in normal flow.
A host that pins the *docked* widget (a fixed corner, like ours) has to restate its own
positioning for that class — four lines, and noted at #9.

One process note worth more than any single finding: **#11 and #12 were both caught by
looking at screenshots, not by tests.** A `19:60` clock and a transparent row are
invisible to a suite that asserts the widget mounted and fetched. 1.1.0 added exactly
the habit that catches them — a pixel-coverage test across all 14 biomes, and a sweep
asserting no minute of the day formats as `:60`.
