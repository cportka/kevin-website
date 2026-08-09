/* =========================================================================
   random.js — tiny deterministic PRNGs.

   The scene uses randomness for spawn timing, sprite selection, and small
   placement jitter. Two flavours:

   - makeRng(seed): a seeded generator so a given (city, minute) can render
     identically for tests/screenshots.
   - The engine's live loop uses its own drifting generator so successive frames
     feel organic; tests pin a seed for reproducibility.
   ========================================================================= */

/** mulberry32 — fast, decent-quality 32-bit seeded PRNG. Returns () => [0,1). */
export function makeRng(seed) {
  var a = (seed >>> 0) || 0x9e3779b9;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    var t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A seed derived from a string (e.g. a city name) — stable hash. */
export function seedFrom(str) {
  var h = 2166136261 >>> 0;
  str = String(str);
  for (var i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Pick a random element from an array using a [0,1) source. */
export function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length) % arr.length];
}

/** Weighted pick: items is [{weight, ...}], returns one item. */
export function pickWeighted(rng, items) {
  var total = 0, i;
  for (i = 0; i < items.length; i++) total += (items[i].weight || 1);
  var r = rng() * total;
  for (i = 0; i < items.length; i++) {
    r -= (items[i].weight || 1);
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}
