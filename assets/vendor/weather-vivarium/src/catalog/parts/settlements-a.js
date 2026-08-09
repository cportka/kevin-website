/* Settlement styles (world set A) — six more ways a place is BUILT, fanning the
   biome→architecture map out beyond the core adobe/chalet/favela/stilt set. Each
   entry follows the settlements.js contract: heights [town, city, metro] cap the
   building height per density tier, width(rng) sizes one building, and
   building(P, x, w, h, env, lit, rng) draws ONE building standing on the ground
   row b = env.groundTop-1 (bottom = b, top = b-h+1), occupying columns x..x+w-1,
   facing the viewer. Wall/roof colours pass through env.col() so they dim at
   night; genuine light sources (lit windows, warm doorways, neon, beacons) stay
   BRIGHT and are gated on `lit`. Heights stay small — only gulf-modern's true
   glass towers reach metro height. */

export default [
  // Sleek Gulf glass — mid/high mirrored towers, Dubai/Doha silhouettes.
  {
    id: "gulf-modern", name: "Gulf Modern", biomes: ["desert", "coast", "city"],
    heights: [5, 10, 20], maxCoverage: 0.5,
    width: function (rng) { return 3 + Math.floor(rng() * 3); },
    building: function (P, x, w, h, env, lit, rng) {
      var b = env.groundTop - 1, top = b - h + 1;
      var base = P.mix("#3a6a8a", "#4f93bb", rng());
      var glass = env.col(base), mull = env.col(P.shade(base, 0.32)), crown = env.col(P.mix(base, "#dfefff", 0.25));
      var setback = (h >= 12) ? top + Math.floor(h * 0.7) : top;   // step in near the top of true towers
      for (var y = top; y <= b; y++) {
        var inset = (y < setback && w >= 5) ? 1 : 0;
        P.rect(x + inset, y, w - inset * 2, 1, y === top ? crown : glass);
      }
      for (var wy = top + 1; wy < b; wy += 2)                       // gridded floor-glow
        for (var wx = x + 1; wx < x + w - 1; wx++)
          P.px(wx, wy, (lit && rng() < 0.35) ? "#ffe9a6" : mull);
      if (h >= 12) {                                                // slim spire + aircraft beacon
        var cx = x + (w >> 1);
        P.px(cx, top - 1, mull); P.px(cx, top - 2, mull);
        P.px(cx, top - 3, env.night ? "#ff5a5a" : mull);
      }
    }
  },

  // Dense low sand cubes with the odd dome/minaret hint — a medina quarter.
  {
    id: "medina", name: "Medina", biomes: ["desert", "savanna"],
    heights: [3, 4, 6], maxCoverage: 0.5,
    width: function (rng) { return 3 + Math.floor(rng() * 3); },
    building: function (P, x, w, h, env, lit, rng) {
      var b = env.groundTop - 1, top = b - h + 1;
      var base = P.mix("#cda06a", "#d8b784", rng());
      var wall = env.col(base);
      P.rect(x, top, w, h, wall);
      P.rect(x, top, w, 1, env.col(P.shade(base, 0.15)));          // shaded parapet
      for (var wy = top + 1; wy < b; wy += 2)                      // tiny deep-set windows
        P.px(x + 1 + Math.floor(rng() * (w - 2)), wy, lit ? "#ffcf7a" : env.col("#6a4526"));
      P.px(x + (w >> 1), b, lit ? "#ffbf66" : env.col("#4a3018")); // warm doorway
      var f = rng();
      if (f < 0.18) {                                             // a small dome
        var dc = x + (w >> 1);
        P.rect(dc - 1, top - 1, 3, 1, wall); P.px(dc, top - 2, env.col(P.shade(base, 0.1)));
      } else if (f < 0.30) {                                      // a minaret hint
        var mx = x + w - 1;
        P.rect(mx, top - 3, 1, 3, wall); P.px(mx, top - 4, lit ? "#ffcf7a" : env.col("#8a6038"));
      }
    }
  },

  // Colourful gabled wooden houses with steep snowy roofs — Nordic village.
  {
    id: "nordic", name: "Nordic", biomes: ["tundra", "coast", "mountain"],
    heights: [3, 5, 7], maxCoverage: 0.44,
    width: function (rng) { return 4 + Math.floor(rng() * 2); },
    building: function (P, x, w, h, env, lit, rng) {
      var b = env.groundTop - 1, top = b - h + 1;
      var pal = ["#b0432f", "#c98a3a", "#3f6f92", "#7a8a4a", "#9a4436"];
      var base = pal[Math.floor(rng() * pal.length)];
      var wall = env.col(base), snow = env.col("#eef2f6");
      var roofH = Math.min(h - 1, 2 + (w >> 1)), half = (w - 1) / 2;
      P.rect(x, top + roofH, w, h - roofH, wall);                  // painted timber body
      for (var i = 0; i < w; i++) {                                // steep snowy gable
        var ry = top + Math.round(Math.abs(i - half) * roofH / (half || 1));
        if (ry > top + roofH - 1) ry = top + roofH - 1;
        P.rect(x + i, ry, 1, (top + roofH) - ry, snow);
      }
      P.px(x + (w >> 1), b, lit ? "#ffcf80" : env.col("#241812")); // warm door
      if (b - 1 >= top + roofH)
        P.px(x + (w >> 1), b - 1, lit ? "#ffdc8a" : env.col("#2f2418")); // upper window
    }
  },

  // Two-to-three storey colonial shophouses — awnings, shutters, arcaded fronts.
  {
    id: "shophouse", name: "Shophouse", biomes: ["jungle", "coast", "city"],
    heights: [4, 6, 9], maxCoverage: 0.5,
    width: function (rng) { return 3 + Math.floor(rng() * 2); },
    building: function (P, x, w, h, env, lit, rng) {
      var b = env.groundTop - 1, top = b - h + 1;
      var pastels = ["#c8a86a", "#a8b0c0", "#c09a9a", "#9ab0a0", "#d0c0a0"];
      var base = pastels[Math.floor(rng() * pastels.length)];
      var wall = env.col(base), cornice = env.col(P.shade(base, 0.24)), shutter = env.col(P.shade(base, 0.4));
      P.rect(x, top, w, h, wall);
      P.rect(x, top, w, 1, cornice);                              // cornice
      for (var wy = top + 2; wy < b - 1; wy += 2)                 // shuttered upper windows
        for (var wx = x + 1; wx < x + w - 1; wx++) {
          P.px(wx, wy, (lit && rng() < 0.5) ? "#ffe2a0" : env.col("#43362a"));
          P.px(wx, wy - 1, shutter);                             // shutter lintel
        }
      P.rect(x, b - 1, w, 1, env.col(rng() < 0.5 ? "#8a4436" : "#356a58")); // striped awning
      P.rect(x, b, w, 1, env.col("#2f261e"));                     // shaded arcade
      P.px(x + (w >> 1), b, lit ? "#ffcf80" : env.col("#1f1610")); // lit doorway
    }
  },

  // Tiered upturned-eave roofs over timber bodies — a pagoda town.
  {
    id: "pagoda-town", name: "Pagoda Town", biomes: ["forest", "mountain", "city"],
    heights: [3, 5, 8], maxCoverage: 0.46,
    width: function (rng) { return 4 + Math.floor(rng() * 3); },
    building: function (P, x, w, h, env, lit, rng) {
      var b = env.groundTop - 1, top = b - h + 1;
      var wood = env.col(P.mix("#7a4a32", "#8a5a3a", rng()));
      var tile = env.col(P.mix("#38524f", "#496a62", rng()));
      P.rect(x, top + 1, w, h - 1, wood);                         // timber body
      var tiers = h >= 6 ? 3 : (h >= 4 ? 2 : 1), gap = Math.max(1, Math.floor((h - 1) / tiers));
      for (var t = 0; t < tiers; t++) {
        var ry = top + t * gap, inset = tiers - 1 - t;            // upper roofs a touch narrower
        var rx = x + inset, rw = w - inset * 2;
        if (rw < 2) { rx = x; rw = w; }
        P.rect(rx, ry, rw, 1, tile);                             // tiled eave line
        P.px(rx, ry - 1, tile); P.px(rx + rw - 1, ry - 1, tile); // upturned eaves
      }
      P.px(x + (w >> 1), b - 1, lit ? "#ffbf5a" : env.col("#3a2a1a")); // lantern window
      if (lit) P.px(x + (w >> 1), b, "#ff9a3a");                  // hanging lantern glow
    }
  },

  // Dockside — warehouses, a stack of shipping containers, a crane silhouette.
  {
    id: "port", name: "Port", biomes: ["coast", "lake"],
    heights: [3, 5, 8], maxCoverage: 0.5,
    width: function (rng) { return 4 + Math.floor(rng() * 3); },
    building: function (P, x, w, h, env, lit, rng) {
      var b = env.groundTop - 1, top = b - h + 1, pick = rng();
      if (pick < 0.34) {                                          // gantry crane silhouette
        var steel = env.col("#8a6a3a"), cx = x + (w >> 1);
        P.rect(cx - 1, top, 2, h, steel);                        // mast
        P.line(cx, top, x + w - 1, top, steel);                  // jib arm
        P.line(cx, top, x + 1, top + 2, steel);                  // counter-jib
        P.line(x + w - 1, top, x + w - 1, top + 3, steel);       // hoist cable
        P.px(x + w - 1, top + 3, env.col("#5a4a30"));            // hook
        if (env.night) P.px(cx, top - 1, "#ff6a6a");            // warning light
      } else if (pick < 0.64) {                                  // stacked shipping containers
        var pal = ["#b0563a", "#3a6a8a", "#7a8a4a", "#c9a24a", "#9a4a5a"], yy = b;
        while (yy > top) {
          var cw = Math.min(w, 3 + Math.floor(rng() * 2)), cx2 = x + Math.floor(rng() * (w - cw + 1)), ch = 2;
          var c = env.col(pal[Math.floor(rng() * pal.length)]);
          P.rect(cx2, yy - ch + 1, cw, ch, c);
          P.rect(cx2, yy - ch + 1, cw, 1, P.mix(c, "#000000", 0.25)); // corrugated top edge
          yy -= ch;
        }
      } else {                                                   // long low warehouse
        var base = P.mix("#6a7078", "#7e858e", rng()), wall = env.col(base);
        P.rect(x, top + 1, w, h - 1, wall);
        for (var i = 0; i < w; i++) P.px(x + i, top, env.col(i === (w >> 1) ? "#c0c6cc" : "#4a5158")); // shallow ridge
        P.rect(x, top + 1, w, 1, env.col(P.shade(base, 0.2)));   // shaded eave
        for (var dx = x + 1; dx < x + w - 1; dx += 2)            // roller doors
          P.px(dx, b, (lit && rng() < 0.4) ? "#ffe0a0" : env.col("#3a3f44"));
      }
    }
  }
];
