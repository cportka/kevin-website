/* landmarks.js — the landmark catalog + the picker that gives a place its
   signature feature (or nothing, when no known landmark fits). */
import core from "./parts/landmarks-core.js";
import a from "./parts/landmarks-a.js";
import b from "./parts/landmarks-b.js";
import { cityNames, cityEntry } from "../world/match.js";

export var LANDMARKS = [].concat(core, a, b);

export function getLandmark(id) {
  for (var i = 0; i < LANDMARKS.length; i++) if (LANDMARKS[i].id === id) return LANDMARKS[i];
  return null;
}

function normalize(s) {
  return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
}

/**
 * Choose a landmark for a place. City-name match wins (loose substring, either
 * direction), then a landscape-signature match — but only when the landmark
 * suits the resolved biome (so e.g. Mount Fuji never lands inside a city). Pass
 * `biomeId` to enforce that fit. Returns the entry or null.
 */
export function pickLandmark(place, landscape, biomeId) {
  var name = normalize(place && place.name);
  var full = normalize((place && place.name) + " " + (place && place.admin1));
  function fits(lm) { return !biomeId || !lm.biomes || lm.biomes.indexOf(biomeId) !== -1; }
  if (name) {
    var admin = normalize(place && place.admin1);
    for (var i = 0; i < LANDMARKS.length; i++) {
      var lm = LANDMARKS[i];
      if (!lm.cities || !fits(lm)) continue;
      for (var c = 0; c < lm.cities.length; c++) {
        // whole-word (so "reno" ≠ g[reno]ble); entries may be admin-scoped
        if (cityEntry(lm.cities[c], name, full, admin)) return lm;
      }
    }
  }
  if (landscape) {
    for (var j = 0; j < LANDMARKS.length; j++) {
      var l2 = LANDMARKS[j];
      if (l2.landscapes && l2.landscapes.indexOf(landscape.id) !== -1 && fits(l2)) return l2;
    }
  }
  return null;
}
