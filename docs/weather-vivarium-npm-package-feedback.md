# weather-vivarium 1.0.0 — adoption feedback

Field notes from swapping this site's hand-built LA beach diorama (`assets/js/scene.js`,
916 lines, now archived in `archive/la-beach-diorama/`) for the
[**weather-vivarium**](https://www.npmjs.com/package/weather-vivarium) npm package,
vendored under `assets/vendor/weather-vivarium/` and pinned to Los Angeles. Written
against `1.0.0` on 2026-08-09, from a real integration into a **no-build static site
with a strict CSP** — probably close to the package's hardest consumer profile.

**Verdict: keep.** The swap deleted ~900 lines of site-specific widget code and a
whole rendering engine in exchange for a 124-line glue module, and we *gained*
features (an info card we never had, graceful any-city support). Everything below the
pros list is polish, not regret.

> **Updated after shipping.** The first draft was written the day of the swap, when
> the glue was 33 lines. Living with it added findings #8–#11 and roughly 90 lines of
> that glue — all of it clustered at one seam (see the bottom line). The verdict
> didn't change; the honest cost did, so the numbers below are the post-shipping ones.

## What worked well

- **Genuinely drop-in for a no-build site.** Pure ESM, zero runtime dependencies,
  `createVivarium(el, { city })` and done. Vendoring the published `src/` tree and
  importing it from a `<script type="module">` worked first try — no bundler, no
  transpile, no shims.
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
  package code. (See cons: this behavior deserves documentation.)
- **Interactive mode covers the plumbing around a zoom** — backdrop, scroll lock,
  focus/keyboard handling, `aria-pressed` — and adds an info card (20 labelled rows
  about the place) we never had. *Revised:* the first draft credited it with replacing
  our FLIP animation too. It doesn't — the motion and the mobile fit came back as
  findings #8 and #10. What it genuinely replaced is the scaffolding, not the movement.
- **Accessibility came along:** `role="img"` with a live descriptive label,
  Enter/Space/Escape on the widget, `aria-pressed`, `:focus-visible`, and a
  reduced-motion still frame.
- **The instance API beats our old test hooks.** `setWeather` / `setTimeOverride` /
  `renderFrame` replaced the bespoke `window.__sceneTest` globals we used to maintain
  for visual regression shots.
- **Provenance hygiene:** `VERSION` exported from `src/index.js`, LICENSE in the
  tarball, README quick-start matched reality, maintainer/author verifiable on the
  registry.

## Rough edges (each with a suggestion)

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
2. **Runtime `<style>` injection vs. strict CSP.** `injectStyles` appends a `<style>`
   element, which a `style-src 'self'` policy blocks — our `/weather` page had to
   loosen to `'unsafe-inline'`. *Suggestion:* also publish the stylesheet as a real
   file (`weather-vivarium/style.css`) consumers can `<link>`, and/or list the sha256
   of the injected CSS per release so hash-based `style-src` works.
3. **`size` is constructor-only.** There's no `setSize()`; resizing after mount only
   works via the undocumented non-numeric-`size` + `--wv-size` route. *Suggestion:*
   document a `size: "css"` sentinel in the README options table (it's the best way to
   consume the widget responsively today), or add a real resize method.
4. **Escape only closes the overlay while the widget has focus** (the keydown listener
   sits on the wrap, not the document). After clicking elsewhere, Escape does nothing;
   our archived version listened document-wide. *Suggestion:* add a document-level
   Escape handler while expanded.
5. **56 module files per cold load.** `src/` ships unbundled (great for reading,
   fine over HTTP/2), but a no-bundler consumer pays a 56-request import waterfall on
   first visit. *Suggestion:* ship an optional single-file `dist/weather-vivarium.min.js`
   alongside `src/` for `<script type="module">` consumers.
6. **Time override is minutes-only.** `options.now` (minutes since midnight) covers
   the daylight cycle, but moon phase and seasonal sun arc stay pinned to the real
   date — our old harness could freeze a full ISO datetime for reproducible shots.
   *Suggestion:* accept a `Date`/ISO string too.
7. **README mentions `data/cities/` datasets that aren't in the tarball** (the `files`
   allowlist ships `src/` only; `loadCities(url)` expects you to host them). Reasonable
   choice — just worth a sentence in the README so consumers don't go looking.
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
9. **During collapse, the scene dims under its own backdrop.** The moment
   `is-expanded` drops, the wrap's z-index falls back to the host's docked value
   while `.wv-backdrop` (z 9990) is still fading for ~350 ms — so the shrinking
   scene renders *behind* the dark veil. (Our archived widget had this exact bug
   once; it seems to be a rite of passage.) Our FLIP wrapper pins an inline
   `z-index: 9991` on the wrap for the duration of the animation. *Suggestion:*
   keep an `is-collapsing` class (holding the expanded z-index) on the wrap until
   the backdrop's fade completes.
10. **On a phone, the info card covers the scene it describes.** Below the 900px
   breakpoint the card becomes a bottom sheet (`bottom:10px; max-height:30vh`),
   but `intSize()` still sizes from `min(innerWidth, innerHeight) - 32` and
   `.wv.is-expanded` still centres on the *full* viewport — so the sheet sits on
   top of the scene's lower third (the wide-screen path gets this right, reserving
   350px). We measure the card and re-fit the overlay into the band above it,
   re-snapping to a whole multiple of 100px. *Suggestion:* mirror the wide-screen
   reservation on narrow — subtract the sheet's height from the available box and
   centre in what's left.
11. **The info card can show `19:60`.** `attributes()`' `hhmm()` computes
   `h = floor(mins/60)`, `m = round(mins % 60)` — at 19:59:36+ the rounded
   minutes hit 60 without carrying into the hour, so "Local time" renders as
   `19:60` (we caught it in a screenshot at dusk). *Suggestion:* round first,
   then split: `mins = round(mins); h = floor(mins/60) % 24; m = mins % 60`.
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

## Integration cost, measured

| | before (scene.js) | after (weather-vivarium) |
| --- | --- | --- |
| site-owned widget code | 916 lines (engine + widget) | **124 lines** of glue |
| ⤷ of which: mount + LA config | — | 34 lines |
| ⤷ of which: zoom motion + overlay fit | — | 90 lines (findings #8–#10) |
| site-owned widget CSS | ~110 lines (`.scene*`) | 27 lines (host placement + overlay top) |
| vendored payload | — | 644 KB source tree (56 modules) |
| CSP connect-src | 3 × Open-Meteo + NOAA tides | 4 × Open-Meteo (tide now modelled) |
| CSP style-src (/weather) | `'self'` | `'self' 'unsafe-inline'` (see #2) |
| info card / any-city | none / none | included |
| zoom motion | hand-rolled | hand-rolled again (see #8) |

The engine — sky, weather, sprites, place resolution, ~800 of those 916 lines — is
what actually left, and it isn't coming back. The glue that grew is entirely the
zoom seam.

## Bottom line

1.0.0 is a strong first release: the hard parts (place resolution, data plumbing,
progressive enhancement, a11y) are done well, and every rough edge above has a
workaround that fits in a comment — or, for the zoom, in 90 lines (see `smoothZoom`
/ `fitOverlay` in `assets/js/weather-widget.js`). Items **1, 2, 8, 9 and 10** are
the ones most worth fixing upstream before other strict-CSP, mobile, or
corner-widget consumers hit them; **11 and 12** are small correctness fixes a
consumer can't work around at all — they're inside the rendered bitmap and the
card's own markup — so they can only be fixed upstream.

**Findings 1, 8, 9 and 10 are one seam, not four bugs.** `wireZoom`'s
expand/collapse is the single place the package takes over layout — position,
size, stacking, and the transition between two boxes — and it's the one place a
host can't reach except by observing DOM mutations. Every workaround we wrote is
the same shape: watch the class, then correct what the package just did, before
the browser paints. Whatever form the fix takes — a built-in FLIP,
`onExpand`/`onCollapse` hooks, or simply letting the host supply the expanded
box — opening that one seam retires four separate workarounds and about 90 of
our 124 glue lines. If only one thing gets done for 1.1, this is it.

Everything else on the list is small and independent. Nothing here made us regret
the swap: an ~800-line rendering engine left this repo permanently, and what came
back is CSS-adjacent glue at a single, well-understood boundary.

One process note worth more than any single finding: **#11 and #12 were both caught
by looking at screenshots, not by tests.** A `19:60` clock and a transparent row are
invisible to a suite that asserts the widget mounted and fetched. If the package
grows one habit, make it rendering the reference cities and *reading the pixels back*
— row-alpha and a few sampled colours would have caught #12 across every biome for
about ten lines of test.
