/* =========================================================================
   weather-vivarium — a tiny living weather diorama for any city.

   Public entry point. The one call most people need is `createVivarium(el, {
   city })`; the rest of the surface (catalogs, biomes, the resolver, the raw
   painter/compositor) is exported for the demo, the gallery, tests, and anyone
   who wants to build their own scene.
   ========================================================================= */
export var VERSION = "1.0.0";

// The one-liner.
export { createVivarium } from "./scene/widget.js";

// World model.
export { resolveScene, guessBiome, unitForCountry } from "./world/resolve.js";
export { BIOMES, BIOME_IDS, getBiome } from "./world/biomes.js";
export { LANDSCAPES, LANDSCAPE_IDS, getLandscape, landscapeForBiome } from "./world/landscapes.js";
export { LANDMARKS, getLandmark, pickLandmark } from "./catalog/landmarks.js";

// Catalog.
export { CATALOG, pools, forBiome, byLayer, counts } from "./catalog/index.js";

// Data.
export { geocode, geocodeSuggest, GEOCODE_ORIGIN } from "./data/geocode.js";
export { fetchWeather, defaultState, modelTide, WEATHER_ORIGINS } from "./data/weather.js";
export { describe as describeWeather, category as weatherCategory } from "./data/wmo.js";
export { decodeCities, cityCount, loadCities } from "./data/cities.js";

// Engine (advanced / for building custom renderers, contact sheets, galleries).
export { createPainter, mix, clamp, lerp, hex } from "./engine/painter.js";
export { createScene } from "./scene/compositor.js";
export { EFFECTS } from "./scene/weatherfx.js";
export * as astronomy from "./engine/astronomy.js";
