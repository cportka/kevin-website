/* =========================================================================
   astronomy.js — local clock + sun/moon geometry for a location.

   Sunrise and sunset (minutes since local midnight) come from the weather feed,
   which returns them for the diorama's own latitude/longitude — so the sun sets
   at the *place's* sunset, not the viewer's. This module turns those, plus the
   place's wall-clock minute, into:

     - a day factor (1 full day → 0 deep night, smooth across twilight),
     - a time-of-day label (night / dawn / day / dusk),
     - the sun's arc across the sky and the moon's arc at night,
     - the moon's illuminated fraction + waxing/waning side (drawn as a phase).
   ========================================================================= */

/** "…THH:MM" (ISO) → minutes since midnight, or null. */
export function isoToMinutes(iso) {
  var m = /T(\d{2}):(\d{2})/.exec(iso || "");
  return m ? (+m[1]) * 60 + (+m[2]) : null;
}

/**
 * Wall-clock time at an IANA timeZone as { minutes, year, month, day }.
 * `nowOverride` (minutes) forces the clock for tests/preview. `dateOverride`
 * (a Date) lets tests pin the calendar day for moon-phase.
 */
export function localTime(timeZone, nowOverride, dateOverride) {
  var d = dateOverride || new Date();
  var out = { minutes: 0, year: 2026, month: 1, day: 1 };
  try {
    // No zone known yet → the viewer's own. Forcing UTC here used to put a
    // California scene twelve hours out of step with the sunrise/sunset it was
    // drawn against; the viewer's clock is at least a defensible guess.
    var p = new Intl.DateTimeFormat("en-US", {
      timeZone: timeZone || undefined, hour: "2-digit", minute: "2-digit", second: "2-digit",
      hour12: false, year: "numeric", month: "2-digit", day: "2-digit"
    }).formatToParts(d);
    var h = 0, mm = 0, s = 0;
    for (var i = 0; i < p.length; i++) {
      var v = p[i].value;
      if (p[i].type === "hour") h = +v;
      else if (p[i].type === "minute") mm = +v;
      else if (p[i].type === "second") s = +v;
      else if (p[i].type === "year") out.year = +v;
      else if (p[i].type === "month") out.month = +v;
      else if (p[i].type === "day") out.day = +v;
    }
    out.minutes = ((h % 24) * 60 + mm + s / 60);
  } catch (e) {
    out.minutes = (d.getTime() / 60000) % 1440;
  }
  if (typeof nowOverride === "number") out.minutes = nowOverride;
  return out;
}

// Twilight envelope: how many minutes on each side of sunrise/sunset the sky
// spends fading between day and night colours.
export var TWILIGHT = 55;

/** Day factor: 1 in full day, 0 deep night, linear across the twilight band. */
/** Minutes between two times of day, the short way round the clock. */
function clockGap(a, b) {
  var d = Math.abs(a - b) % 1440;
  return d > 720 ? 1440 - d : d;
}

export function dayFactor(now, sunrise, sunset) {
  // The lit stretch can run PAST midnight — a polar summer, or sunrise and sunset
  // reported in a zone that doesn't match the clock we're comparing them to. Read
  // it as an interval on a circle so a wrapped day still answers sensibly instead
  // of collapsing to permanent night.
  var wraps = sunset < sunrise;
  var lit = wraps ? (now >= sunrise || now <= sunset) : (now >= sunrise && now <= sunset);
  if (lit) return 1;
  var d = Math.min(clockGap(now, sunrise), clockGap(now, sunset));
  var v = 1 - d / TWILIGHT;
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

/** Coarse label for the current moment. */
export function timeOfDay(now, sunrise, sunset) {
  if (now < sunrise || now > sunset) return "night";
  if (Math.abs(now - sunset) < 45) return "dusk";
  if (Math.abs(now - sunrise) < 45) return "dawn";
  return "day";
}

/**
 * Sun position across the daytime arc, or null when it's down.
 * Returns { x, y, p (0..1 progress), low (near horizon) }.
 */
export function sunPosition(now, sunrise, sunset, L, horizon) {
  var span = sunset - sunrise; if (span < 60) span = 720;
  if (now < sunrise || now > sunset) return null;
  var p = (now - sunrise) / span;
  var x = Math.round((L * 0.12) + p * (L * 0.76));
  var y = Math.round(horizon - 2 - Math.sin(p * Math.PI) * (horizon - 6));
  return { x: x, y: y, p: p, low: Math.sin(p * Math.PI) < 0.35 };
}

/** Moon position across the night arc, or null in daytime. */
export function moonPosition(now, sunrise, sunset, L, horizon) {
  if (now >= sunrise && now <= sunset) return null;
  var nightLen = (1440 - sunset) + sunrise;
  var p = now < sunrise ? (now + 1440 - sunset) / nightLen : (now - sunset) / nightLen;
  p = p < 0 ? 0 : p > 1 ? 1 : p;
  var x = Math.round((L * 0.16) + p * (L * 0.68));
  var y = Math.round(horizon - 4 - Math.sin(p * Math.PI) * (horizon - 8));
  return { x: x, y: y, p: p };
}

/**
 * Moon illumination for a calendar day.
 * Returns { fraction: 0..1 illuminated, waxing: bool, phase: 0..1 of synodic
 * cycle }. Reference new moon 2000-01-06 18:14 UTC.
 */
export function moonIllumination(year, month, day) {
  // Julian day (integer noon) for the given Gregorian date.
  var a = Math.floor((14 - month) / 12);
  var y = year + 4800 - a;
  var m = month + 12 * a - 3;
  var jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4)
    - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  var daysSinceNew = jdn - 2451549.5;        // days since the 2000-01-06 new moon
  var synodic = 29.530588853;
  var phase = ((daysSinceNew % synodic) + synodic) % synodic / synodic; // 0..1
  var fraction = (1 - Math.cos(2 * Math.PI * phase)) / 2;               // 0 new → 1 full
  return { fraction: fraction, waxing: phase < 0.5, phase: phase };
}
