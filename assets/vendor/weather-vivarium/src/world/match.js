/* match.js — shared whole-word/phrase matching for city-name lookups.

   Used by both the landscape resolver and the landmark picker so a curated city
   entry only matches a place when it appears as a whole word/phrase — "reno"
   matches "Reno" but never "g[reno]ble", while shortenings like "new york" still
   match "New York City". Kept separate to avoid a resolve ↔ landmarks import cycle. */

function isBound(ch) {
  return ch === undefined || ch === " " || ch === "-" || ch === "," || ch === "'" || ch === ".";
}

/** `needle` occurs in `hay` bounded by string ends or separators. */
export function phraseIn(hay, needle) {
  if (!needle || !hay) return false;
  var i = hay.indexOf(needle);
  while (i !== -1) {
    if (isBound(hay[i - 1]) && isBound(hay[i + needle.length])) return true;
    i = hay.indexOf(needle, i + 1);
  }
  return false;
}

/** True when a curated `city` entry names this place (as a whole phrase). `name`
 *  is the normalized place name, `full` is name + " " + admin. */
export function cityNames(city, name, full) {
  return name === city || phraseIn(full, city) || phraseIn(city, name);
}

/** A curated city-list entry: either a plain string (matched by cityNames) or an
 *  admin-scoped object `{ name, admin: ["ca", "california"] }` for names that
 *  exist in many places — a bare "carson" entry would claim Carson City, Nevada,
 *  and a bare "torrance" the village in Scotland. The scope accepts both the
 *  two-letter code (what the packed dataset carries) and the full region name
 *  (what geocoding returns); a place with NO admin at all passes on the name
 *  alone, so typing just "Lomita" still finds the South Bay. */
export function cityEntry(entry, name, full, admin) {
  if (typeof entry === "string") return cityNames(entry, name, full);
  if (!cityNames(entry.name, name, full)) return false;
  if (!entry.admin || !admin) return true;
  for (var a = 0; a < entry.admin.length; a++) {
    if (phraseIn(full, entry.admin[a])) return true;
  }
  return false;
}
