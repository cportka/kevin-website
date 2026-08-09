/* =========================================================================
   sky.js — the sky gradient, its colour under any condition, and the stars.

   Generalised from the LA widget: a biome supplies its own clear/overcast/night
   base colours (a desert sky is warmer, a jungle hazier), and this module blends
   in cloud cover, the day→night fade, the sunrise/sunset glow, and an
   air-quality smog push. The result is a two-stop gradient {top, hor} that
   drawSky dithers down to the horizon.
   ========================================================================= */
import { mix, clamp } from "./painter.js";

// Fallback sky (the LA coast palette) when a biome doesn't override it.
export var DEFAULT_SKY = {
  clearTop: "#2f6bb0", clearHor: "#8fc6e8",
  overcastTop: "#6f767f", overcastHor: "#aab0b6",
  nightTop: "#0a1230", nightHor: "#243056",
  glowTop: "#3a2a63", glowHor: "#ff8a4c"
};

/**
 * Compute {top, hor} for the current sky.
 * env: { code, cloud (%), aqi, now, sunrise, sunset, dayT, sky (biome overrides) }
 */
export function skyPalette(env) {
  var S = Object.assign({}, DEFAULT_SKY, env.sky || {});
  var c = env.code, cloudy = clamp(env.cloud / 100, 0, 1);
  var fog = { top: "#b9bcc0", hor: "#d9dcde" };
  var rain = { top: "#3f4a58", hor: "#6d7885" };
  var base;
  if (c === 45 || c === 48) base = fog;
  else if (c >= 51 && c <= 82) base = rain;
  else if (c >= 95) base = { top: "#2c2f3a", hor: "#565b69" };
  else base = { top: mix(S.clearTop, S.overcastTop, cloudy), hor: mix(S.clearHor, S.overcastHor, cloudy) };

  var dayT = env.dayT;
  var top = mix(base.top, S.nightTop, 1 - dayT);
  var hor = mix(base.hor, S.nightHor, 1 - dayT);

  // sunrise / sunset glow envelope
  var sunNear = Math.min(Math.abs(env.now - env.sunset), Math.abs(env.now - env.sunrise));
  var glowT = clamp(1 - sunNear / 55, 0, 1);
  top = mix(top, S.glowTop, glowT * 0.8 * dayT + glowT * 0.4 * (1 - dayT));
  hor = mix(hor, S.glowHor, glowT * (0.85 * dayT + 0.5 * (1 - dayT)));

  // smog / smoke: push toward brown when the air quality is poor
  var smog = clamp((env.aqi - 90) / 120, 0, 0.6);
  if (smog > 0) { top = mix(top, "#6d4f30", smog * 0.7); hor = mix(hor, "#c08a4e", smog); }

  return { top: top, hor: hor };
}

/**
 * Paint the sky band from y=0 to `horizon`, then stars once it's dark enough.
 * Returns the computed palette so callers can reuse it (e.g. to dim the sun).
 */
export function drawSky(P, env, frame, horizon) {
  var sky = skyPalette(env);
  P.dband(0, 0, P.L, horizon, sky.top, sky.hor);

  if (env.dayT < 0.25) {
    var a = (0.25 - env.dayT) / 0.25;
    var seed = [3, 5, 9, 14, 19, 23, 28, 33, 39, 44, 47];
    for (var i = 0; i < seed.length; i++) {
      var sx = (seed[i] * (P.L / 50)) | 0, sy = (seed[i] * 7) % horizon;
      if (((frame >> 3) + i) % 5 !== 0) P.px(sx, sy, mix("#0a1230", "#dfe6ff", a * 0.9));
    }
  }
  return sky;
}
