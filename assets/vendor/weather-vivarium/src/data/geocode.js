/* =========================================================================
   geocode.js — turn a city name into a place.

   Uses Open-Meteo's keyless geocoding API. Returns everything the rest of the
   engine needs to localise a diorama: coordinates (for weather + the correct
   sunrise/sunset), the IANA timezone (so the sun sets at the place's dusk, not
   the viewer's), plus elevation / latitude / country / feature code, which the
   resolver reads to choose a biome.
   ========================================================================= */

export var GEOCODE_ORIGIN = "https://geocoding-api.open-meteo.com";

function j(url) {
  return fetch(url, { mode: "cors" })
    .then(function (r) { return r && r.ok ? r.json() : null; })
    .catch(function () { return null; });
}

/**
 * Resolve `name` (e.g. "Kyoto", "Reykjavík", "Cusco, Peru") to a place object:
 *   { name, country, admin1, latitude, longitude, timezone, elevation,
 *     population, featureCode }
 * or null if nothing matched / the request failed.
 */
export function geocode(name, opts) {
  opts = opts || {};
  var q = encodeURIComponent(String(name || "").trim());
  if (!q) return Promise.resolve(null);
  var lang = opts.language || "en";
  var url = GEOCODE_ORIGIN + "/v1/search?name=" + q + "&count=1&language=" + lang + "&format=json";
  return j(url).then(function (d) {
    if (!d || !d.results || !d.results.length) return null;
    var r = d.results[0];
    return one(r);
  });
}

function one(r) {
  return {
    name: r.name,
    country: r.country || "",
    admin1: r.admin1 || "",
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone || "UTC",
    elevation: typeof r.elevation === "number" ? r.elevation : null,
    population: r.population || null,
    featureCode: r.feature_code || ""
  };
}

/**
 * Suggest up to `count` matching places for a partial query — for search
 * autocomplete. Returns an array (name, admin1, country, coords, timezone,
 * population, …), or [] on no match / short query / failure.
 */
export function geocodeSuggest(name, opts) {
  opts = opts || {};
  var q = encodeURIComponent(String(name || "").trim());
  if (q.length < 2) return Promise.resolve([]);
  var url = GEOCODE_ORIGIN + "/v1/search?name=" + q + "&count=" + (opts.count || 6) +
    "&language=" + (opts.language || "en") + "&format=json";
  return j(url).then(function (d) {
    return d && d.results ? d.results.map(one) : [];
  });
}
