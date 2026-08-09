/* =========================================================================
   weatherfx.js — full-frame atmospheric overlays.

   These aren't catalog sprites (no baseline anchor); they wash over the whole
   scene at a specific depth. The compositor calls the ones the current weather
   turns on. Each takes (P, env) where env carries:
     frame, dayT, night, horizon, groundTop, L, wind (0..1), intensity (0..1),
     latitude, code.
   ========================================================================= */

// Falling rain streaks (ported from the LA widget, generalised to groundTop).
export function rain(P, env) {
  var col = env.night ? "#6f7f92" : "#cfe0ea";
  var n = Math.round(18 + env.intensity * 20);
  var slant = Math.round(env.wind * 3);
  var bottom = env.groundTop + 6;
  P.withAlpha(0.7, function () {
    for (var i = 0; i < n; i++) {
      var x = (i * 11 + env.frame * 3) % (P.L + 8) - 4;
      var y = (i * 17 + env.frame * 5) % bottom;
      P.px(x, y, col); P.px(x - 1 - slant, y + 1, col);
    }
  });
}

// Drifting snowflakes; slower, wandering, denser with intensity.
export function snow(P, env) {
  var n = Math.round(16 + env.intensity * 24);
  var col = env.night ? "#c8d2dc" : "#ffffff";
  for (var i = 0; i < n; i++) {
    var drift = Math.sin((env.frame * 0.05) + i) * (1 + env.wind * 3);
    var x = Math.round((i * 7 + drift) % (P.L + 6) - 3);
    var y = ((i * 13 + env.frame * (1 + env.intensity)) % (env.groundTop + 4)) | 0;
    P.px(x, y, col);
  }
}

// Low fog banks: translucent bands that thicken toward the horizon.
export function fog(P, env) {
  P.withAlpha(0.35, function () { P.rect(0, 0, P.L, env.horizon + 4, "#dfe3e6"); });
  var y = env.horizon;
  for (var i = 0; i < 3; i++) {
    var off = (env.frame * (0.3 + env.wind)) % (P.L + 20);
    P.withAlpha(0.25, function () {
      P.rect(-((off + i * 17) % (P.L + 20)) + P.L, y + i * 3, 18, 2, "#e7eaec");
    });
  }
}

// Storm lightning: an occasional full-frame flash plus a bolt.
export function lightning(P, env) {
  var t = env.frame % 47;
  if (t !== 0 && t !== 1 && t !== 4) return;
  P.withAlpha(t === 4 ? 0.25 : 0.55, function () { P.rect(0, 0, P.L, env.horizon + 6, "#f4f0ff"); });
  if (t === 0) {
    var bx = 10 + (env.frame * 7) % (P.L - 20);
    var y = 2, x = bx;
    for (var s = 0; s < 6; s++) {
      P.px(x, y, "#fbfaff"); P.px(x, y + 1, "#dfe0ff");
      x += ((env.frame + s) & 1) ? 1 : -1; y += 2;
    }
  }
}

// Blowing debris — leaves by day, pale dust motes at night — scaled by wind.
export function windParticles(P, env) {
  if (env.wind < 0.35) return;
  var n = Math.round(env.wind * 10);
  var leaf = env.night ? "#6a6a5a" : "#b07a2a";
  for (var i = 0; i < n; i++) {
    var x = (i * 13 + env.frame * (3 + env.wind * 4)) % (P.L + 8) - 4;
    var y = env.groundTop - 8 + Math.round(Math.sin((env.frame * 0.2) + i * 2) * 4) + (i % 5);
    P.px(x | 0, y | 0, leaf);
  }
}

// A soft rainbow arc — used when it's raining but the sun is out.
export function rainbow(P, env) {
  if (env.night) return;
  var cols = ["#e0556b", "#e8944a", "#e8d24a", "#4aa85a", "#3a7ad0", "#7a4ad0"];
  var cx = P.L * 0.5, cy = env.horizon + 6, r0 = env.horizon - 2;
  P.withAlpha(0.5, function () {
    for (var c = 0; c < cols.length; c++) {
      var r = r0 + c;
      for (var a = 200; a <= 340; a += 4) {
        var rad = a * Math.PI / 180;
        P.px(Math.round(cx + Math.cos(rad) * r), Math.round(cy + Math.sin(rad) * r), cols[c]);
      }
    }
  });
}

// Aurora curtains for high-latitude clear nights.
export function aurora(P, env) {
  if (!env.night) return;
  var greens = ["#2ef0a0", "#28c88a", "#3affc0"];
  P.withAlpha(0.45, function () {
    for (var x = 0; x < P.L; x++) {
      var base = 4 + Math.sin(x * 0.25 + env.frame * 0.06) * 3 + Math.sin(x * 0.6 - env.frame * 0.03) * 2;
      var h = 5 + (Math.sin(x * 0.4 + env.frame * 0.05) + 1) * 3;
      for (var y = 0; y < h; y++) {
        P.px(x, Math.round(base + y), greens[(x + y) % greens.length]);
      }
    }
  });
}

// Sandstorm / dust wall for hot, windy desert.
export function sandstorm(P, env) {
  P.withAlpha(0.4 + env.wind * 0.2, function () { P.rect(0, env.horizon - 4, P.L, env.groundTop - env.horizon + 8, "#c79a5a"); });
  var n = Math.round(12 + env.wind * 16);
  for (var i = 0; i < n; i++) {
    var x = (i * 9 + env.frame * (4 + env.wind * 6)) % (P.L + 8) - 4;
    var y = env.horizon + (i * 5) % (env.groundTop - env.horizon + 6);
    P.px(x | 0, y | 0, i & 1 ? "#d8b578" : "#b3853f");
  }
}

// Heat shimmer — a faint wavering band above hot ground.
export function heatShimmer(P, env) {
  if (env.night) return;
  var y = env.groundTop;
  P.withAlpha(0.18, function () {
    for (var x = 0; x < P.L; x++) {
      if ((x + (env.frame >> 1)) % 3 === 0) P.px(x, y - 1 - ((env.frame + x) & 1), "#ffffff");
    }
  });
}

// Hail — quick bright specks that bounce along the ground line.
export function hail(P, env) {
  var n = 14;
  for (var i = 0; i < n; i++) {
    var x = (i * 15 + env.frame * 6) % (P.L + 6) - 3;
    var y = (i * 19 + env.frame * 7) % (env.groundTop + 2);
    P.px(x | 0, y | 0, "#eaf2ff");
  }
}

export var EFFECTS = {
  rain: rain, snow: snow, fog: fog, lightning: lightning, windParticles: windParticles,
  rainbow: rainbow, aurora: aurora, sandstorm: sandstorm, heatShimmer: heatShimmer, hail: hail
};
