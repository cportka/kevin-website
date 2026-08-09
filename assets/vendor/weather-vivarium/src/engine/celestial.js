/* =========================================================================
   celestial.js — the sun and the moon.

   The sun rides the daytime arc with a warm layered bloom that dims under
   cloud, smog and fog. The moon rides the night arc and is drawn with its real
   phase for the calendar day: a shadow bite is taken out of the correct
   (waxing/waning) side, so a crescent looks like a crescent.
   ========================================================================= */
import { clamp } from "./painter.js";

/** Draw the sun at `pos` ({x,y,low}); `env` supplies cloud/aqi/code for haze. */
export function drawSun(P, pos, env, sky) {
  var core = pos.low ? "#ffd47e" : "#fff0aa";
  var glow = pos.low ? "#ff8a3c" : "#ffcf5e";
  P.withAlpha(0.28, function () { P.disc(pos.x, pos.y, 6, glow); });
  P.withAlpha(0.55, function () { P.disc(pos.x, pos.y, 4, glow); });
  P.disc(pos.x, pos.y, 3, core);
  P.px(pos.x, pos.y, "#fffdf0");

  var dim = clamp(env.cloud / 100 * 0.5 + clamp((env.aqi - 90) / 160, 0, 0.5), 0, 0.8);
  if (env.code === 45 || env.code === 48) dim = Math.max(dim, 0.55);
  if (dim > 0) P.withAlpha(dim, function () { P.disc(pos.x, pos.y, 4, sky.top); });
}

/**
 * Draw the moon at `pos` with its real phase. `illum` = { fraction, waxing }
 * from astronomy.moonIllumination. Rendered per-pixel with a proper terminator:
 * the lit side is bright, the shadowed side is a faint earthshine grey (a little
 * above the sky), so it reads as one softly-shaded sphere — never a hard second
 * circle punched out of the disc.
 */
export function drawMoon(P, pos, illum, sky) {
  var r = 3;
  var k = illum ? illum.fraction : 1;          // illuminated fraction 0..1
  var waxing = illum ? illum.waxing : true;
  var lit = "#edeadb", crater = "#d3d0bf";
  var dark = P.mix(sky.top, "#8a90a8", 0.3);    // dim earthshine, blends with the night sky
  for (var dy = -r; dy <= r; dy++) {
    for (var dx = -r; dx <= r; dx++) {
      if (dx * dx + dy * dy > r * r + r) continue;              // soft round disc
      var vert = Math.sqrt(Math.max(0, 1 - (dy * dy) / (r * r)));
      var term = r * (1 - 2 * k) * vert;                        // terminator x on this row
      var isLit = waxing ? (dx >= term - 0.001) : (dx <= -term + 0.001);
      var c = isLit ? lit : dark;
      // a couple of subtle craters, only where they'd catch the light
      if (isLit && ((dx === -1 && dy === -1) || (dx === 1 && dy === 1))) c = crater;
      P.px(pos.x + dx, pos.y + dy, c);
    }
  }
}
