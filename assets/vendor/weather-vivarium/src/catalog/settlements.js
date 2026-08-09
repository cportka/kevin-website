/* =========================================================================
   settlements.js — how a place is BUILT, by biome + density.

   The compositor's urbanLayer draws two things: a restrained, hazy *distant
   skyline* (the wider city behind) and a *local settlement* in the foreground.
   The local settlement's architecture is a biome-appropriate STYLE from here —
   a swamp gets stilt shacks, a desert gets low adobe, a mountain gets chalets,
   a jungle hillside gets stacked favela boxes — and density only decides how
   many buildings and how tall (capped per style, so nowhere turns into glass
   towers unless it's actually a dense city).

   A style:
     heights: [town, city, metro]  — max building height (px) at each density tier
     maxCoverage                   — most of the ground it ever covers (<1 → nature always shows)
     width(rng)                    — a building's width
     building(P, x, w, h, env, lit, rng)  — draw ONE building, standing on env.groundTop-1
   ========================================================================= */
import { mix } from "../engine/painter.js";
import stylesA from "./parts/settlements-a.js";
import stylesB from "./parts/settlements-b.js";

function baseRow(env) { return env.groundTop - 1; }
function lights(P, x, top, w, h, lit, rng, on, off) {
  for (var wy = top + 1; wy < top + h - 1; wy += 2)
    for (var wx = x + 1; wx < x + w - 1; wx += 2) P.px(wx, wy, (lit && rng() < 0.5) ? on : off);
}
function w3(rng) { return 3 + Math.floor(rng() * 3); }
function w4(rng) { return 4 + Math.floor(rng() * 4); }

export var STYLES = {
  // Glass/steel towers — only real dense cities (city biome). A tower is NOT a
  // grey slab: it belongs to a facade family (dark glass / steel blue / pale
  // stone / warm concrete), steps back as it rises, carries curtain-wall window
  // columns by day and scattered lit offices by night, and tops out in an
  // antenna mast or a water tank.
  towers: {
    id: "towers", name: "Towers", heights: [6, 12, 24], maxCoverage: 0.5, width: function (rng) { return 4 + Math.floor(rng() * 4); },
    building: function (P, x, w, h, env, lit, rng) {
      var b = baseRow(env), top = b - h + 1;
      // `glass` is the daylight window tone, chosen per family so windows always
      // CONTRAST with their wall instead of vanishing into it (the old
      // darker-grey-on-grey windows were exactly the "grey blob" complaint).
      var fam = [
        { wall: "#2e3844", glass: "#7292ae" },   // dark glass (the Willis look)
        { wall: "#46525f", glass: "#93b6cc" },   // steel blue
        { wall: "#918a7a", glass: "#4f5c66" },   // pale stone, dark windows
        { wall: "#6c655c", glass: "#96abbb" }    // warm concrete
      ][Math.floor(rng() * 4)];
      var wall = env.col(fam.wall), glass = env.col(fam.glass);
      var side = mix(wall, "#000000", 0.3), cap = mix(wall, "#000000", 0.2);
      // the classic setback silhouette: [tierTopRow, tierWidth], bottom tier first
      var tiers = (h >= 16 && w >= 6) ? [[top + Math.round(h * 0.45), w], [top + Math.round(h * 0.18), w - 2], [top, w - 4]]
                : (h >= 10 && w >= 5) ? [[top + Math.round(h * 0.35), w], [top, w - 2]]
                : [[top, w]];
      for (var t = 0; t < tiers.length; t++) {
        var yT = tiers[t][0], tw = tiers[t][1], tx = x + ((w - tw) >> 1);
        var yB = t === 0 ? b : tiers[t - 1][0] - 1;
        P.rect(tx, yT, tw, yB - yT + 1, wall);
        P.rect(tx, yT, tw, 1, cap);                                  // parapet
        P.rect(tx + tw - 1, yT, 1, yB - yT + 1, side);               // shaded flank
        if (lit) {                                                   // night: scattered lit offices
          for (var wy = yT + 1; wy <= yB - 1; wy += 2)
            for (var wx = tx + 1; wx < tx + tw - 1; wx += 2)
              P.px(wx, wy, rng() < 0.55 ? "#ffdf8a" : mix(wall, "#000000", 0.35));
        } else {                                                     // day: curtain-wall mullions
          for (var gx = tx + 1; gx < tx + tw - 1; gx += 2)
            P.rect(gx, yT + 1, 1, yB - yT - 1, glass);
        }
      }
      var crown = tiers[tiers.length - 1];
      var cx = x + ((w - crown[1]) >> 1) + (crown[1] >> 1);
      if (h >= 12 && rng() < 0.55) {                                 // antenna mast + beacon
        P.px(cx, top - 1, side); P.px(cx, top - 2, lit ? "#ff5a5a" : side);
      } else if (rng() < 0.5) {
        P.rect(x + ((w - crown[1]) >> 1) + 1, top - 1, 2, 1, side);  // water tank
      }
    }
  },
  // Concrete/brick mid-rise — harbour and mixed cities. Warm varied walls, a
  // cornice, a shaded flank, and a regular window grid that stays readable in
  // daylight (dark glass on light masonry).
  midrise: {
    id: "midrise", name: "Mid-rise", heights: [4, 8, 14], maxCoverage: 0.5, width: w4,
    building: function (P, x, w, h, env, lit, rng) {
      var b = baseRow(env), top = b - h + 1;
      var wall = env.col(["#7a6f62", "#9a8f7e", "#8a5f4a", "#6e7276", "#a08a6a"][Math.floor(rng() * 5)]);
      var winD = mix(env.col("#3d4750"), wall, 0.15);
      P.rect(x, top, w, h, wall);
      P.rect(x, top, w, 1, mix(wall, "#000000", 0.3));                // cornice
      P.rect(x + w - 1, top, 1, h, mix(wall, "#000000", 0.22));       // shaded flank
      for (var wy = top + 2; wy < b; wy += 2)
        for (var wx = x + 1; wx < x + w - 1; wx += 2)
          P.px(wx, wy, lit && rng() < 0.5 ? "#ffe0a0" : winD);
      P.px(x + 1, b, mix(wall, "#000000", 0.35));                     // doorway
      if (rng() < 0.5) P.rect(x + 1, top - 1, 2, 1, env.col("#5a5248"));                // rooftop tank
    }
  },
  // Small townhouses / shops with awnings.
  lowrise: {
    id: "lowrise", name: "Low-rise town", heights: [8, 9, 11], maxCoverage: 0.46, width: w3,
    building: function (P, x, w, h, env, lit, rng) {
      var b = baseRow(env), top = b - h + 1;
      var wall = env.col(["#b06a4a", "#8a9a6a", "#6a8aa0", "#c0a060", "#9a6a8a"][Math.floor(rng() * 5)]);
      P.rect(x, top, w, h, wall);
      P.rect(x, top, w, 1, env.col("#3a3230"));                                          // eaves
      for (var wx = x + 1; wx < x + w - 1; wx += 2)                                      // upper windows
        P.px(wx, top + 2, lit && rng() < 0.6 ? "#ffe0a0" : mix(wall, "#000000", 0.4));
      P.rect(x, b, w, 1, env.col("#5a4a3a"));                                            // shopfront/awning
      P.px(x + (w >> 1), b - 1, lit ? "#ffe0a0" : env.col("#3a3630"));                   // lit window/door
    }
  },
  // Red barn + silo farmstead. The barn wears its identity: a gambrel roof
  // (flat crown over flared eaves — the double-pitch barn silhouette) and a
  // white-trimmed X-braced sliding door, so the red shape reads "barn" at a
  // glance instead of "unclear red thing".
  farmstead: {
    id: "farmstead", name: "Farmstead", heights: [8, 9, 10], maxCoverage: 0.3, width: function (rng) { return 4 + Math.floor(rng() * 3); },
    building: function (P, x, w, h, env, lit, rng) {
      var b = baseRow(env), top = b - h + 1;
      if (rng() < 0.4) { // grain silo: steel drum, domed cap, ring seam
        var sw = 2, sx = x + ((w - sw) >> 1);
        P.rect(sx, top + 1, sw, h - 1, env.col("#c9c2b0"));
        P.rect(sx + sw - 1, top + 1, 1, h - 1, env.col("#a49d8c"));  // shaded side
        P.rect(sx, top, sw, 1, env.col("#8a8478"));                  // dome cap
        P.px(sx, top + 3, env.col("#a49d8c"));                       // ring seam
      } else {           // the barn
        var red = env.col("#a83a2a"), redS = env.col("#7e2a1e"), trim = env.col("#ece6d4");
        P.rect(x + 1, top, w - 2, 1, env.col("#7d6048"));            // gambrel crown
        P.rect(x, top + 1, w, 1, env.col("#5f4634"));                // flared eave
        P.rect(x, top + 2, w, h - 2, red);                           // body
        P.rect(x + w - 1, top + 2, 1, h - 2, redS);                  // shaded end
        P.px(x + (w >> 1), top + 2, trim);                           // hayloft vent
        var dx = x + (w >> 1) - 1;                                   // sliding door, X-braced
        P.rect(dx, b - 2, 3, 3, redS);
        P.px(dx, b - 2, trim); P.px(dx + 2, b - 2, trim);
        P.px(dx + 1, b - 1, trim);
        P.px(dx, b, trim); P.px(dx + 2, b, trim);
      }
    }
  },
  // Round thatched huts (savanna village).
  roundhut: {
    id: "roundhut", name: "Village", heights: [8, 8, 9], maxCoverage: 0.4, width: function (rng) { return 4; },
    building: function (P, x, w, h, env, lit, rng) {
      var b = baseRow(env), wall = env.col("#a9764a"), roof = env.col("#8a6a3a");
      P.rect(x + 1, b - 2, 3, 3, wall);                                                  // mud wall
      P.rect(x, b - 3, 5, 1, roof); P.rect(x + 1, b - 4, 3, 1, roof); P.px(x + 2, b - 5, roof); // thatch cone
      P.px(x + 2, b - 1, lit ? "#ffca6a" : env.col("#3a2a1a"));                          // doorway
    }
  },
  // Flat-roof adobe / pueblo blocks.
  adobe: {
    id: "adobe", name: "Adobe", heights: [8, 9, 11], maxCoverage: 0.46, width: w3,
    building: function (P, x, w, h, env, lit, rng) {
      var b = baseRow(env), top = b - h + 1, wall = env.col(mix("#c98f52", "#dcae74", rng()));
      P.rect(x, top, w, h, wall);
      P.rect(x, top, w, 1, mix(wall, "#000000", 0.18));                                  // parapet
      for (var wy = top + 2; wy < b; wy += 2) P.px(x + 1 + (Math.floor(rng() * (w - 2))), wy, lit ? "#ffca6a" : env.col("#5a3a24"));
      if (rng() < 0.3) P.px(x + w - 1, top - 1, env.col("#8a5a34"));                     // roof beam
    }
  },
  // A-frame chalets with snow roofs + a chimney.
  chalet: {
    id: "chalet", name: "Chalet", heights: [8, 9, 10], maxCoverage: 0.42, width: w4,
    building: function (P, x, w, h, env, lit, rng) {
      var b = baseRow(env), top = b - h + 1, wall = env.col(mix("#6a4a30", "#8a6540", rng())), snow = env.col("#eef2f5");
      P.rect(x, top + 1, w, h - 1, wall);
      for (var i = 0; i < w; i++) { var d = Math.abs(i - (w - 1) / 2); P.px(x + i, top + Math.round(d), snow); } // gable + snow
      P.px(x + w - 1, top - 1, env.col("#5a5560")); if (rng() < 0.5) P.px(x + w - 1, top - 2, env.night ? "#8a8590" : env.col("#7a7580"));
      P.px(x + (w >> 1), b - 1, lit ? "#ffca6a" : env.col("#3a2a1a"));                   // warm window
    }
  },
  // Stilt shacks over marsh/lake.
  stilt: {
    id: "stilt", name: "Stilt houses", overWater: true, heights: [4, 5, 7], maxCoverage: 0.42, width: w4,
    building: function (P, x, w, h, env, lit, rng) {
      var b = baseRow(env), body = Math.max(2, h - 2), top = b - h + 1, wall = env.col(mix("#8a7a5a", "#a99a6a", rng()));
      P.px(x + 1, b, env.col("#5a4a30")); P.px(x + w - 2, b, env.col("#5a4a30")); P.px(x, b - 1, env.col("#5a4a30")); // posts
      P.rect(x, top + 1, w, body, wall);
      for (var i = 0; i < w; i++) P.px(x + i, top, env.col("#6a5a3a"));                  // pitched tin roof
      P.px(x + (w >> 1), top + 2, lit ? "#ffca6a" : env.col("#3a2f1a"));
    }
  },
  // Suburbia — single-family tract houses: pitched roof, garage door, driveway,
  // a clipped hedge. Low but *built-up*, wall to wall: the look of a Torrance or a
  // Naperville, which is concrete and lawn, not countryside.
  suburb: {
    // `fill` — suburbia is uniformly built out, house after house, so it reaches its
    // coverage much sooner than a scattering of village cottages would.
    id: "suburb", name: "Suburb", heights: [9, 11, 12], maxCoverage: 0.62, fill: 2.6,
    width: function (rng) { return 6 + Math.floor(rng() * 3); },
    building: function (P, x, w, h, env, lit, rng) {
      var b = baseRow(env), top = b - h + 1;
      var wall = env.col(["#d8d2c4", "#c9c0ae", "#cbb89c", "#bfc6c2", "#d0c2b6"][Math.floor(rng() * 5)]);
      var roof = env.col(mix("#6a5a4e", "#4f463f", rng()));
      var drive = env.col("#a8a49c"), lawn = env.col("#5f8a48");
      P.rect(x, b - 1, w, 2, lawn);                                        // lawn strip out front
      P.rect(x, top + 1, w - 2, h - 2, wall);                              // house
      for (var i = 0; i < w - 2; i++) {                                    // pitched roof
        var d = Math.abs(i - (w - 3) / 2);
        P.px(x + i, top + Math.round(d * 0.5), roof);
      }
      P.rect(x, top + 1, w - 2, 1, roof);                                  // eaves line
      P.rect(x + w - 2, b - 2, 2, 3, drive);                               // driveway + kerb cut
      P.rect(x + 1, b - 2, 2, 2, env.col("#8f8880"));                      // garage door
      P.px(x + w - 4, b - 3, lit ? "#ffe0a0" : env.col("#4a4640"));        // lit window
      if (rng() < 0.5) P.px(x + w - 3, b - 2, env.col("#3f6a3a"));         // shrub by the door
    }
  },
  // Stacked colourful favela boxes climbing a slope.
  favela: {
    id: "favela", name: "Favela", heights: [4, 6, 10], maxCoverage: 0.55, width: w4,
    building: function (P, x, w, h, env, lit, rng) {
      var b = baseRow(env), palette = ["#c96a4a", "#d0b24a", "#5a9ac0", "#7aa85a", "#c98a5a", "#b06a8a"];
      var yy = b, left = x;
      for (var s = 0; s < 3 && yy > b - h; s++) {
        var bw = 3 + Math.floor(rng() * 2), bh = 2 + Math.floor(rng() * 2);
        var c = env.col(palette[Math.floor(rng() * palette.length)]);
        P.rect(left, yy - bh + 1, bw, bh, c);
        P.px(left + 1, yy - 1, lit && rng() < 0.6 ? "#ffe0a0" : env.col("#2a2420"));
        left += 1 + Math.floor(rng() * 2); yy -= bh - (rng() < 0.5 ? 0 : 1);            // step up the hill
      }
    }
  }
};

// Each biome has one or more candidate styles; a city picks one deterministically
// from its seed, so cities of the same biome vary but any one city is stable.
var BIOME_STYLES = {
  city: ["towers", "midrise"], coast: ["midrise", "lowrise", "suburb"], ocean: [], mountain: ["chalet", "adobe"],
  desert: ["adobe", "suburb"], forest: ["lowrise", "suburb"], jungle: ["favela"], plains: ["lowrise", "farmstead", "suburb"],
  tundra: ["chalet"], wetland: ["stilt"], lake: ["stilt", "chalet"], savanna: ["roundhut"],
  canyon: ["adobe"], farmland: ["farmstead", "lowrise", "suburb"]
};

// Genuinely urban architecture. A big city is a big city whatever biome it sits
// in — Taipei, Bengaluru and Jakarta are metropolises, not villages with jungle
// around them — so once a place is dense enough these become candidates too, and
// the biome keeps showing through in the gaps and the background.
var URBAN = ["towers", "midrise", "apartment-blocks", "gulf-modern"];

// Where a vernacular style belongs. A style with no entry here is universal
// (towers, mid-rise, plain low-rise, farmsteads, stilt shacks — those turn up
// anywhere); the culturally specific ones are pinned to their part of the world so
// a pagoda roof never lands in Denver and a pumpjack never lands in Tromsø.
var STYLE_REGIONS = {
  "pagoda-town": ["east-asia", "southeast-asia", "south-asia"],
  shophouse: ["southeast-asia", "east-asia", "south-asia"],
  medina: ["africa", "middle-east"],
  roundhut: ["africa"],
  favela: ["latin-america", "africa"],
  adobe: ["north-america", "latin-america", "africa", "middle-east"],
  pueblo: ["north-america"],
  "oil-town": ["north-america", "middle-east", "north-asia"],
  chalet: ["europe", "north-america", "north-asia", "oceania"],
  nordic: ["europe", "north-america", "north-asia"],
  brownstone: ["north-america", "europe"],
  "lake-lodge": ["north-america", "europe", "north-asia", "oceania"],
  "gulf-modern": ["middle-east", "east-asia", "southeast-asia", "north-america"],
  suburb: ["north-america", "oceania", "europe", "latin-america"]
};

// Rural styles — a working farm or a village of huts. Fine for a hamlet, wrong for
// anywhere with a real population, so they drop out once a place is built-up.
var RURAL_ONLY = ["farmstead", "roundhut"];

// Where postwar car-suburbia is the dominant built form at town/city size.
var SUBURB_REGIONS = ["north-america", "oceania"];

// Where nothing in a biome's list suits the region, a place still has to be built
// of something: plain low-rise/mid-rise reads as "ordinary buildings" anywhere.
var UNIVERSAL_FALLBACK = ["lowrise", "midrise"];

/** Keep only styles that suit this region (styles with no region are universal). */
function fitRegion(ids, region) {
  if (!region) return ids;
  var kept = ids.filter(function (id) {
    var rs = STYLE_REGIONS[id];
    return !rs || rs.indexOf(region) !== -1;
  });
  if (kept.length) return kept;
  var universal = ids.filter(function (id) { return !STYLE_REGIONS[id]; });
  return universal.length ? universal : UNIVERSAL_FALLBACK;
}

export function styleForBiome(biomeId, seed, density, region) {
  var d = density || 0;
  var candidates = BIOME_STYLES[biomeId] || [];
  if (d >= 0.36) {                       // town-and-up: no farmsteads, no hut villages
    var built = candidates.filter(function (id) { return RURAL_ONLY.indexOf(id) === -1; });
    if (built.length) candidates = built;
  }
  var list = fitRegion(candidates, region);
  // In the car-suburb world, a place of this size mostly IS suburbia — tract houses
  // and driveways, not a lodge in the woods or a village main street. Make that the
  // usual answer in the town/city band, keeping a third for local variety.
  if (d >= 0.3 && d < 0.62 && SUBURB_REGIONS.indexOf(region) !== -1 &&
      list.indexOf("suburb") !== -1 && (seed >>> 0) % 3 !== 0) {
    return STYLES.suburb;
  }
  var urban = URBAN.filter(function (id) { return STYLES[id]; });
  // Weight by the same tiers the compositor uses: a town builds in its own
  // vernacular; a city mixes; a metropolis is mostly genuinely urban (with one
  // vernacular style kept as local flavour) so a big city never reads as a village.
  if (d >= 0.62) list = urban.concat(list.slice(0, 1));
  else if (d >= 0.52) list = list.concat(urban);
  if (!list.length) return null;
  return STYLES[list[(seed >>> 0) % list.length]] || null;
}

/** Register a style and add it as a candidate for the given biomes (fan-out). */
export function registerStyle(style, biomes) {
  STYLES[style.id] = style;
  if (biomes) for (var i = 0; i < biomes.length; i++) {
    (BIOME_STYLES[biomes[i]] = BIOME_STYLES[biomes[i]] || []).push(style.id);
  }
}

// Fanned-out world styles: register each as a candidate for its biomes.
[].concat(stylesA, stylesB).forEach(function (s) { registerStyle(s, s.biomes); });

export var STYLE_BIOMES = BIOME_STYLES;
