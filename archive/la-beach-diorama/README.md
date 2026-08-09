# LA beach diorama (archived)

The original **living pixel-art Los Angeles beach diorama** that was this site's corner
weather widget from v1.8.0 through v1.12.3 — preserved here as a little stand-alone
project, frozen at its final form.

A 100×100 "jewel" (50×50 logical pixels, nearest-neighbor upscaled) of a vintage-80s
LA-noir beach: sky, sun/moon and clouds, ocean with surf-driven waves, sand, an askew
coast road with two-lane traffic, a billboard that turns neon at dusk, a wind-swept palm,
seabirds, a sunbathing beachgoer by day and a strolling cat by night — all driven by
**real Los Angeles time and weather**.

## Run it

Open [`demo.html`](demo.html) in a browser (or serve this folder):

```
python3 -m http.server 8000   # then visit http://localhost:8000/archive/la-beach-diorama/demo.html
```

Click the widget to zoom it to a centered full-screen overlay; click again (or press
Escape) to dock it back.

## Data sources (keyless, CORS, each optional with graceful fallback)

- `api.open-meteo.com` — temperature, weather code, wind, cloud, sunrise/sunset
- `marine-api.open-meteo.com` — wave height (surf intensity)
- `air-quality-api.open-meteo.com` — AQI (smog/smoke tint)
- `api.tidesandcurrents.noaa.gov` — Santa Monica tide (waterline height)

## Status

**Archived / superseded.** The site now uses
[**weather-vivarium**](https://www.npmjs.com/package/weather-vivarium) (npm, `1.0.0`) —
this widget generalised to any city on Earth — vendored under
`assets/vendor/weather-vivarium/` and pinned to Los Angeles. This folder is not deployed
with the site and receives no further changes; it exists so the original hand-built LA
scene stays runnable exactly as it shipped.
