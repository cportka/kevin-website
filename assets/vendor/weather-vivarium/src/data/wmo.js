/* =========================================================================
   wmo.js — WMO weather interpretation codes → words + categories.

   Open-Meteo reports the current condition as a WMO code (0..99 subset). The
   whole scene reads a small, stable classification off it: a human word for the
   accessibility label, a coarse category that drives the sky palette, and
   booleans that switch on rain/snow/fog/storm effects.
   ========================================================================= */

/** Short human word for the condition. */
export function describe(code) {
  var c = code;
  if (c === 0) return "clear";
  if (c <= 2) return "partly cloudy";
  if (c === 3) return "overcast";
  if (c === 45 || c === 48) return "foggy";
  if (c >= 51 && c <= 57) return "drizzly";
  if (c >= 61 && c <= 67) return "rainy";
  if (c >= 71 && c <= 77) return "snowy";
  if (c >= 80 && c <= 82) return "showers";
  if (c === 85 || c === 86) return "snow showers";
  if (c >= 95) return "stormy";
  return "cloudy";
}

/**
 * Coarse category, one of:
 * clear | partly | overcast | fog | rain | snow | storm
 */
export function category(code) {
  var c = code;
  if (c === 0) return "clear";
  if (c <= 2) return "partly";
  if (c === 3) return "overcast";
  if (c === 45 || c === 48) return "fog";
  if (c >= 71 && c <= 77) return "snow";
  if (c === 85 || c === 86) return "snow";
  if (c >= 95) return "storm";
  if (c >= 51 && c <= 82) return "rain";
  return "partly";
}

export function isFog(code) { return code === 45 || code === 48; }
export function isSnow(code) { return (code >= 71 && code <= 77) || code === 85 || code === 86; }
export function isStorm(code) { return code >= 95; }
export function isRain(code) { return (code >= 51 && code <= 67) || (code >= 80 && code <= 82); }
export function isDrizzle(code) { return code >= 51 && code <= 57; }
export function isPrecip(code) { return isRain(code) || isSnow(code) || isStorm(code); }

/** Rough precipitation intensity 0..1 (drives streak density / accumulation). */
export function intensity(code) {
  if (isStorm(code)) return 1;
  if (code === 65 || code === 67 || code === 82 || code === 75 || code === 86) return 0.9;
  if (code === 63 || code === 81 || code === 73) return 0.65;
  if (code === 61 || code === 80 || code === 71 || code === 85) return 0.45;
  if (isDrizzle(code)) return 0.3;
  if (isFog(code)) return 0.15;
  return 0;
}

/** "bad weather" gate the walkers/animals use to seek shelter or gear up. */
export function isRough(code, aqi) {
  return code >= 45 || (typeof aqi === "number" && aqi >= 160);
}
