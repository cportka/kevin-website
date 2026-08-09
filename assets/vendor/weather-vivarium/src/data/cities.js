/* =========================================================================
   cities.js — read the shipped city datasets.

   The datasets are stored in a compact columnar form: one `fields` list, string
   columns dictionary-encoded into `dicts`, and `rows` of plain values/indices.
   That's ~3× smaller over the wire than a list of {key: value} objects (the same
   keys repeated tens of thousands of times), which matters when a page pulls
   25,000 cities. `decodeCities` turns it back into ordinary objects.

   Both the compact form and the older object form are accepted, so a stale
   cached copy of a dataset still loads.
   ========================================================================= */

/** Expand a compact dataset (or pass through a legacy `cities` array). */
export function decodeCities(db) {
  if (!db) return [];
  if (Array.isArray(db.cities)) return db.cities;      // legacy / already expanded
  var fields = db.fields || [], dicts = db.dicts || {}, rows = db.rows || [];
  var out = new Array(rows.length);
  for (var r = 0; r < rows.length; r++) {
    var row = rows[r], o = {};
    for (var f = 0; f < fields.length; f++) {
      var key = fields[f], v = row[f], dict = dicts[key];
      o[key] = dict ? (v == null ? null : dict[v]) : v;
    }
    out[r] = o;
  }
  return out;
}

/** How many cities a dataset holds, without expanding it. */
export function cityCount(db) {
  if (!db) return 0;
  if (typeof db.count === "number") return db.count;
  return (db.cities || db.rows || []).length;
}

/** Fetch + decode a dataset. Resolves to [] if it can't be loaded. */
export function loadCities(url, fetchImpl) {
  var f = fetchImpl || (typeof fetch !== "undefined" ? fetch : null);
  if (!f) return Promise.resolve([]);
  return f(url).then(function (r) { return r.json(); }).then(decodeCities, function () { return []; });
}
