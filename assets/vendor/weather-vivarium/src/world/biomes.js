/* =========================================================================
   biomes.js — the "backgrounds": each environment's far scenery + terrain.

   The compositor lays out every scene on the same vertical skeleton (sky →
   distance → near ground → road/path → foreground), and a biome fills in the
   identity: what sits on the horizon (waves, peaks, dunes, a skyline, a tree
   wall) and what the near ground is made of (sand, grass, snow, dirt, water).

   A biome provides:
     id, name
     sky      — optional sky-palette overrides (see engine/sky.js)
     water    — { top, bot } band for waves + swimming things, or null
     road     — { kind: asphalt|dirt|cobble|path|none, markings } surface config
     drawFar(P, env)      — distant silhouettes at the horizon
     drawGround(P, env)   — the near terrain fill from horizon→bottom (minus road)
     drawShoulder(P, env) — optional foreground strip below the road

   Content (trees/animals/vehicles/people/signs) is chosen elsewhere by matching
   each catalog entry's `biomes` list against the biome id. Geometry rows arrive
   in env: horizon, groundTop (road top), roadBot, L.
   ========================================================================= */
import { mix, clamp } from "../engine/painter.js";

// ---- shared far-scenery helpers -----------------------------------------

function farMountains(P, env, base, snow) {
  var hy = env.horizon;
  var c = env.col(base);
  for (var x = 0; x < P.L; x++) {
    var h = 6 + Math.round(4 * Math.sin(x * 0.16) + 3 * Math.sin(x * 0.07 + 1));
    var top = hy - h;
    P.rect(x, top, 1, hy - top, c);
    if (snow && h > 7) P.px(x, top, env.col("#e8eef2")); // snowcaps on the tall ones
    if (snow && h > 8) P.px(x, top + 1, env.col("#cdd8de"));
  }
}

function skyline(P, env) {
  var hy = env.horizon;
  var rng = env.srng || env.rng;   // stable per-frame → the skyline doesn't flicker
  var x = 0;
  var lit = env.night || env.dayT < 0.4;
  while (x < P.L) {
    var w = 3 + Math.floor(rng() * 5);
    var h = 4 + Math.floor(rng() * (hy - 4));
    var top = hy - h;
    var c = env.col(mix("#3a4150", "#5a6472", rng()));
    P.rect(x, top, w, h, c);
    // lit windows
    for (var wy = top + 1; wy < hy - 1; wy += 2) {
      for (var wx = x + 1; wx < x + w - 1; wx += 2) {
        if (lit && rng() < 0.5) P.px(wx, wy, "#ffe58a");
        else P.px(wx, wy, env.col("#2b323d"));
      }
    }
    x += w + 1;
  }
}

function treeline(P, env, base) {
  var hy = env.horizon;
  var c = env.col(base);
  for (var x = 0; x < P.L; x++) {
    var h = 3 + Math.round(2 * Math.sin(x * 0.5) + 1.5 * Math.sin(x * 0.9 + 2)) + 2;
    P.rect(x, hy - h, 1, h, c);
    if ((x & 1) === 0) P.px(x, hy - h, env.col(mix(base, "#000000", 0.15)));
  }
}

function dunes(P, env, top, bot, lo, hi) {
  P.dband(0, top, P.L, bot, env.col(hi), env.col(lo));
  // wind ripples
  for (var y = top + 2; y < bot; y += 3) {
    for (var x = (y * 3) % 5; x < P.L; x += 6) P.px(x, y, env.col(mix(lo, "#000000", 0.12)));
  }
}

// ocean waves (ported from the LA widget)
function ocean(P, env, top, bot) {
  var deep = "#12628f", shallow = "#3aa0c4";
  if (env.code >= 51 && env.code <= 82) { deep = "#2c5566"; shallow = "#4d7f92"; }
  if (env.code === 45 || env.code === 48) { deep = "#7fa3ad"; shallow = "#a9c4cb"; }
  deep = env.col(deep); shallow = env.col(shallow);
  P.dband(0, top, P.L, bot, shallow, deep);
  var inten = clamp((env.waveM || 0.8) / 2.4, 0.15, 1);
  var speed = 0.4 + inten * 1.2;
  for (var y = top + 1; y < bot; y++) {
    var phase = env.frame * speed * 0.12 + y * 1.7;
    for (var x = 0; x < P.L; x++) {
      var w = Math.sin((x * 0.55) + phase) + Math.sin((x * 0.23) - phase * 0.6);
      if (w > 2 - inten * 1.2) P.px(x, y, "#dff2fb");
      else if (w > 1.5 - inten) P.px(x, y, mix(shallow, "#dff2fb", 0.4));
    }
  }
}

function grassGround(P, env, top, lo, hi) {
  P.dband(0, top, P.L, env.roadBot + 2, env.col(hi), env.col(lo));
  // little tufts
  for (var x = 1; x < P.L; x += 4) {
    var y = top + 2 + ((x * 7) % 4);
    P.px(x, y, env.col(mix(hi, "#0a3a12", 0.4)));
  }
}

function snowGround(P, env, top) {
  P.dband(0, top, P.L, env.roadBot + 2, env.col("#eef4f8"), env.col("#cdd8e0"));
  for (var x = 0; x < P.L; x += 5) P.px(x, top + 3 + ((x * 3) % 3), env.col("#dfe8ef"));
}

// road/path colours per biome kind
export var ROAD_COLORS = {
  asphalt: { day: "#3c3c44", night: "#26262c", edge: "#55555f", mark: "#d8cf7a" },
  dirt: { day: "#7a5a3a", night: "#43301d", edge: "#8a6a44", mark: null },
  cobble: { day: "#6a6a72", night: "#3a3a42", edge: "#7a7a82", mark: null },
  path: { day: "#a98b5a", night: "#5a4630", edge: "#b89a68", mark: null }
};

// ---- the biome registry --------------------------------------------------

var COAST = {
  id: "coast", name: "Coast",
  water: { top: 24, bot: 30 }, road: { kind: "asphalt", markings: true },
  drawFar: function () {},
  drawGround: function (P, env) {
    ocean(P, env, env.horizon, 30);
    // sand with tide-driven waterline (ported)
    var dry = env.night ? "#7a6b4c" : "#e0cb92";
    var wet = env.night ? "#5c5340" : "#b49a63";
    P.dband(0, 30, P.L, env.groundTop + 2, env.col(wet), env.col(dry));
    P.rect(0, 30, P.L, 1, mix(env.col(wet), "#dff2fb", 0.4));
  },
  drawShoulder: function (P, env) {
    var ground = env.night ? "#141210" : "#2e281f";
    P.rect(0, env.roadBot + 1, P.L, P.L - env.roadBot - 1, env.col(ground));
  }
};

var OCEAN = {
  id: "ocean", name: "Open water",
  water: { top: 24, bot: 44 }, road: { kind: "none", markings: false },
  drawFar: function () {},
  drawGround: function (P, env) { ocean(P, env, env.horizon, 46); },
  drawShoulder: function () {}
};

var MOUNTAIN = {
  id: "mountain", name: "Mountains",
  // farSilhouette: the peaks already own the horizon, so a distant skyline drawn
  // against them just reads as a grey smudge (Zurich's "shapeless blob").
  sky: { clearTop: "#2f6bb0", clearHor: "#bcd6e8" }, water: null, farSilhouette: true,
  road: { kind: "asphalt", markings: true },
  drawFar: function (P, env) { farMountains(P, env, "#5a6470", true); },
  drawGround: function (P, env) {
    // pine-forest slope
    P.dband(0, env.horizon, P.L, env.groundTop + 2, env.col("#3f6a44"), env.col("#2c5233"));
    if (env.cold) snowGround(P, env, env.horizon + 6);
  },
  drawShoulder: function (P, env) { P.rect(0, env.roadBot + 1, P.L, P.L, env.col("#2a3524")); }
};

var DESERT = {
  id: "desert", name: "Desert",
  sky: { clearTop: "#3f86c0", clearHor: "#e8cfa0", overcastTop: "#8a8478", overcastHor: "#cabfa4" },
  water: null, road: { kind: "asphalt", markings: true },
  drawFar: function (P, env) { farMountains(P, env, "#b07a4a", false); },
  drawGround: function (P, env) { dunes(P, env, env.horizon, env.groundTop + 2, "#c79a5a", "#e8c07a"); },
  drawShoulder: function (P, env) { P.rect(0, env.roadBot + 1, P.L, P.L, env.col("#b3853f")); }
};

var FOREST = {
  id: "forest", name: "Forest",
  sky: { clearTop: "#2f6bb0", clearHor: "#a8cfe0" }, water: null,
  road: { kind: "dirt", markings: false },
  drawFar: function (P, env) { treeline(P, env, "#25502f"); },
  drawGround: function (P, env) { grassGround(P, env, env.horizon, "#2c5a2c", "#4a8a3a"); },
  drawShoulder: function (P, env) { P.rect(0, env.roadBot + 1, P.L, P.L, env.col("#2f4a24")); }
};

var JUNGLE = {
  id: "jungle", name: "Jungle",
  sky: { clearTop: "#4a90b8", clearHor: "#bfe0d8" }, water: null,
  road: { kind: "path", markings: false },
  drawFar: function (P, env) { treeline(P, env, "#1f5236"); treeline(P, env, "#2f7a4a"); },
  drawGround: function (P, env) {
    grassGround(P, env, env.horizon, "#245c34", "#3f9a52");
    // hanging vines from the canopy line
    for (var x = 2; x < P.L; x += 7) P.line(x, env.horizon, x, env.horizon + 4 + (x % 3), env.col("#2f6e3a"));
  },
  drawShoulder: function (P, env) { P.rect(0, env.roadBot + 1, P.L, P.L, env.col("#1f4a2a")); }
};

var PLAINS = {
  id: "plains", name: "Plains",
  water: null, road: { kind: "dirt", markings: false },
  drawFar: function (P, env) {
    // a low far ridge
    var hy = env.horizon, c = env.col("#7a9a5a");
    for (var x = 0; x < P.L; x++) P.px(x, hy - 1 - (Math.sin(x * 0.1) > 0.6 ? 1 : 0), c);
  },
  drawGround: function (P, env) { grassGround(P, env, env.horizon, "#6a8a3a", "#9ab84a"); },
  drawShoulder: function (P, env) { P.rect(0, env.roadBot + 1, P.L, P.L, env.col("#5a7a2f")); }
};

var CITY = {
  id: "city", name: "City",
  water: null, road: { kind: "asphalt", markings: true },
  // Buildings now come from the compositor's density-driven urbanLayer (so every
  // biome can be urban); the city biome just contributes pavement + a hint of haze.
  drawFar: function () {},
  drawGround: function (P, env) {
    P.dband(0, env.horizon, P.L, env.groundTop + 2, env.col("#5a5f66"), env.col("#3f444a"));
    // sidewalk seam
    P.rect(0, env.groundTop - 2, P.L, 1, env.col("#6a707a"));
  },
  drawShoulder: function (P, env) { P.rect(0, env.roadBot + 1, P.L, P.L, env.col("#33383e")); }
};

var TUNDRA = {
  id: "tundra", name: "Tundra",
  sky: { clearTop: "#3a6fa0", clearHor: "#cfe0ea", nightTop: "#0a1836", nightHor: "#1f3a66" },
  water: null, road: { kind: "path", markings: false }, cold: true,
  drawFar: function (P, env) { farMountains(P, env, "#8a97a4", true); },
  drawGround: function (P, env) { snowGround(P, env, env.horizon); },
  drawShoulder: function (P, env) { P.rect(0, env.roadBot + 1, P.L, P.L, env.col("#c8d4dc")); }
};

var WETLAND = {
  id: "wetland", name: "Wetland",
  water: { top: 33, bot: 37 }, farShore: true, road: { kind: "path", markings: false },
  drawFar: function (P, env) { treeline(P, env, "#3a5a3a"); },
  drawGround: function (P, env) {
    grassGround(P, env, env.horizon, "#4a6a3a", "#6a9a4a");
    // marsh water pools near the path
    P.dband(0, 33, P.L, env.groundTop + 1, env.col("#4a7a6a"), env.col("#356054"));
  },
  drawShoulder: function (P, env) { P.rect(0, env.roadBot + 1, P.L, P.L, env.col("#3a5230")); }
};

var LAKE = {
  id: "lake", name: "Lakeside",
  water: { top: 26, bot: 33 }, farShore: true, road: { kind: "dirt", markings: false },
  drawFar: function (P, env) { farMountains(P, env, "#6a7a6a", false); },
  drawGround: function (P, env) {
    // still lake with a soft far shore, then a grassy near bank
    P.dband(0, env.horizon, P.L, 26, env.col("#4f7a8a"), env.col("#3a6070"));
    P.dband(0, 26, P.L, 33, env.col("#5a94a4"), env.col("#3f7183"));
    // gentle ripples
    for (var y = 27; y < 33; y++) for (var x = (y * 2) % 4; x < P.L; x += 5) P.px(x, y, env.col("#7fb0c0"));
    grassGround(P, env, 33, "#4a7a3a", "#6aa84a");
  },
  drawShoulder: function (P, env) { P.rect(0, env.roadBot + 1, P.L, P.L, env.col("#3a5a2a")); }
};

var SAVANNA = {
  id: "savanna", name: "Savanna",
  sky: { clearTop: "#3f86c0", clearHor: "#e0c88a" }, water: null,
  road: { kind: "dirt", markings: false },
  drawFar: function (P, env) {
    var hy = env.horizon, c = env.col("#b09a5a");
    for (var x = 0; x < P.L; x++) P.px(x, hy - 1, c);
  },
  drawGround: function (P, env) { grassGround(P, env, env.horizon, "#a8863a", "#ccaa4a"); },
  drawShoulder: function (P, env) { P.rect(0, env.roadBot + 1, P.L, P.L, env.col("#96772f")); }
};

var CANYON = {
  id: "canyon", name: "Canyon",
  sky: { clearTop: "#3f86c0", clearHor: "#e8b78a" }, water: { top: 35, bot: 37 }, farShore: true, farSilhouette: true,
  road: { kind: "dirt", markings: false },
  drawFar: function (P, env) {
    // layered mesa walls
    for (var b = 0; b < 3; b++) {
      var top = env.horizon - 4 + b * 3;
      P.rect(0, top, P.L, env.groundTop - top, env.col(mix("#a5552f", "#7a3a1e", b / 3)));
      for (var x = (b * 3) % 6; x < P.L; x += 6) P.px(x, top + 1, env.col("#c76a3a"));
    }
  },
  drawGround: function (P, env) {
    P.dband(0, env.groundTop - 3, P.L, env.groundTop + 2, env.col("#b3703a"), env.col("#8a4f28"));
    // a thin river at the canyon floor
    P.dband(0, 35, P.L, 37, env.col("#3f7183"), env.col("#2f5766"));
  },
  drawShoulder: function (P, env) { P.rect(0, env.roadBot + 1, P.L, P.L, env.col("#7a4020")); }
};

var FARMLAND = {
  id: "farmland", name: "Farmland",
  water: null, road: { kind: "dirt", markings: false },
  drawFar: function (P, env) {
    treeline(P, env, "#3a6a3a");
    // The barn on the horizon, wearing its identity: gambrel roof (flat crown
    // over flared eaves), white-trimmed X-braced door, a grain silo alongside —
    // it used to be two stacked red rectangles, which read as "unclear red thing".
    var bx = 6, hy = env.horizon, trim = env.col("#ece6d4");
    P.rect(bx + 1, hy - 7, 4, 1, env.col("#7d6048"));   // gambrel crown
    P.rect(bx, hy - 6, 6, 1, env.col("#5f4634"));       // flared eave
    P.rect(bx, hy - 5, 6, 5, env.col("#a03a2a"));       // body
    P.rect(bx + 5, hy - 5, 1, 5, env.col("#7e2a1e"));   // shaded end
    P.px(bx + 2, hy - 5, trim);                         // hayloft vent
    P.rect(bx + 2, hy - 2, 2, 2, env.col("#7e2a1e"));   // sliding door
    P.px(bx + 2, hy - 2, trim); P.px(bx + 3, hy - 1, trim);  // X-brace hint
    P.rect(bx + 7, hy - 4, 1, 4, env.col("#c9c2b0"));   // silo drum
    P.px(bx + 7, hy - 4, env.col("#8a8478"));           // silo cap
  },
  drawGround: function (P, env) {
    // ploughed field rows
    P.dband(0, env.horizon, P.L, env.groundTop + 2, env.col("#8a6a3a"), env.col("#6a4f28"));
    for (var y = env.horizon + 2; y < env.groundTop; y += 2) P.rect(0, y, P.L, 1, env.col("#7a5a30"));
    // a strip of green crop
    P.dband(0, env.groundTop - 4, P.L, env.groundTop + 1, env.col("#5a8a3a"), env.col("#4a7a2f"));
  },
  drawShoulder: function (P, env) { P.rect(0, env.roadBot + 1, P.L, P.L, env.col("#5a4326")); }
};

export var BIOMES = {
  coast: COAST, ocean: OCEAN, mountain: MOUNTAIN, desert: DESERT, forest: FOREST,
  jungle: JUNGLE, plains: PLAINS, city: CITY, tundra: TUNDRA, wetland: WETLAND,
  lake: LAKE, savanna: SAVANNA, canyon: CANYON, farmland: FARMLAND
};

export function getBiome(id) { return BIOMES[id] || COAST; }
export var BIOME_IDS = Object.keys(BIOMES);
