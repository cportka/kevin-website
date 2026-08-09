/* Settlement styles (world set B) — six more ways a place is BUILT, extending the
   biome→architecture map alongside sets core/A. Each entry follows the
   settlements.js contract: heights [town, city, metro] cap building height per
   density tier, width(rng) sizes one building, and building(P, x, w, h, env, lit,
   rng) draws ONE building standing on the ground row b = env.groundTop-1
   (bottom = b, top = b-h+1), occupying columns x..x+w-1, facing the viewer.
   Wall/roof colours pass through env.col() so they dim at night; genuine light
   sources (lit windows, warm doorways) stay BRIGHT and are gated on `lit`.
   Heights stay small — apartment-blocks' city slabs are the tallest here. The
   oil-town pumpjack rocks with env.frame, everything else is static. */

export default [
  // Dense mid-rise slabs — the housing estate look. NOT uniform grey: brick,
  // render, slate and warm-concrete blocks stand shoulder to shoulder, and the
  // daytime windows contrast with their wall (sky-lit glass on dark walls, dark
  // glass on light walls) — darker-grey-on-grey windows were invisible and the
  // whole block read as one drab slab.
  {
    id: "apartment-blocks", name: "Apartment Blocks", biomes: ["city"],
    heights: [5, 9, 14], maxCoverage: 0.55,
    width: function (rng) { return 4 + Math.floor(rng() * 3); },
    building: function (P, x, w, h, env, lit, rng) {
      var b = env.groundTop - 1, top = b - h + 1;
      var fam = [
        { wall: "#75543f", glass: "#9db4c4" },   // brick
        { wall: "#9a927e", glass: "#4c5860" },   // render/tan
        { wall: "#5d6570", glass: "#a3b8c6" },   // slate
        { wall: "#82766a", glass: "#46525c" }    // warm concrete
      ][Math.floor(rng() * 4)];
      var wall = env.col(fam.wall), glass = env.col(fam.glass);
      P.rect(x, top, w, h, wall);
      P.rect(x, top, w, 1, env.col(P.shade(fam.wall, 0.28)));        // parapet / cornice
      P.rect(x + w - 1, top, 1, h, env.col(P.shade(fam.wall, 0.2))); // shaded flank
      for (var wy = top + 2; wy < b; wy += 2) {                      // window floors
        for (var wx = x + 1; wx < x + w - 1; wx += 2)
          P.px(wx, wy, (lit && rng() < 0.6) ? "#ffe6a2" : glass);
        if (wy + 1 < b && rng() < 0.4)                               // balcony rail
          P.px(x, wy + 1, env.col(P.tint(fam.wall, 0.25)));
      }
      P.px(x + (w >> 1), b, lit ? "#ffd27a" : env.col("#332f2b"));   // ground-floor entrance
      if (rng() < 0.5) P.rect(x + 1, top - 1, 2, 1, env.col("#4c525b")); // rooftop stair/lift box
    }
  },

  // Terraced rowhouses — warm brick, projecting cornices, stone stoops to the door.
  {
    id: "brownstone", name: "Brownstone", biomes: ["city", "coast"],
    heights: [4, 6, 8], maxCoverage: 0.5,
    width: function (rng) { return 3 + Math.floor(rng() * 2); },
    building: function (P, x, w, h, env, lit, rng) {
      var b = env.groundTop - 1, top = b - h + 1;
      var base = P.mix("#8a4632", "#a2593c", rng());
      var brick = env.col(base);
      P.rect(x, top, w, h, brick);
      P.rect(x, top, w, 1, env.col("#c9a878"));                     // projecting cornice trim
      P.rect(x, top + 1, w, 1, env.col(P.shade(base, 0.35)));       // cornice shadow
      for (var wy = top + 3; wy < b; wy += 2)                       // tall sash windows in bays
        for (var wx = x + 1; wx < x + w - 1; wx += 2)
          P.px(wx, wy, (lit && rng() < 0.5) ? "#ffdf96" : env.col(P.shade(base, 0.45)));
      var dx = x + (w >> 1);                                        // stoop: stone steps up to a raised door
      P.px(dx - 1, b, env.col("#b9b1a1"));
      P.px(dx, b, env.col("#cfc7b6"));
      P.px(dx, b - 1, lit ? "#ffc878" : env.col("#3a2a20"));        // doorway at the top of the stoop
    }
  },

  // Oilfield — low corrugated sheds and a pumpjack whose beam rocks with env.frame.
  {
    id: "oil-town", name: "Oil Town", biomes: ["plains", "desert", "tundra"],
    heights: [3, 5, 7], maxCoverage: 0.32,
    width: function (rng) { return 4 + Math.floor(rng() * 3); },
    building: function (P, x, w, h, env, lit, rng) {
      var b = env.groundTop - 1, top = b - h + 1;
      var metal = env.col(P.mix("#6f7378", "#565a5f", rng()));
      if (rng() < 0.5) {                                            // pumpjack — Samson post + walking beam
        var cx = x + (w >> 1), postTop = top + 1;
        P.line(cx - 1, b, cx, postTop, metal);                     // A-frame legs
        P.line(cx + 1, b, cx, postTop, metal);
        var dy = Math.round(Math.sin((env.frame || 0) * 0.18 + x * 0.6)); // -1..1 bob
        var bx = x, fx = x + w - 1;                                 // back = counterweight, front = horsehead
        P.line(bx, postTop + dy, fx, postTop - dy, metal);         // rocking walking beam
        P.rect(bx, postTop + dy, 1, 2, env.col(P.shade("#565a5f", 0.2))); // counterweight
        P.px(fx, postTop - dy, metal);                             // horsehead
        P.line(fx, postTop - dy + 1, fx, b, env.col("#4a4038"));   // polished rod to the wellhead
        P.rect(fx - 1, b, 2, 1, env.col("#3f362d"));               // wellhead base
      } else {                                                     // low corrugated shed
        var base = P.mix("#8a7d63", "#9c8f72", rng()), wall = env.col(base);
        var sh = Math.min(h, 2 + Math.floor(rng() * 2)), stop = b - sh + 1;
        P.rect(x, stop, w, sh, wall);
        for (var i = 0; i < w; i++) P.px(x + i, stop, env.col("#5f5647")); // low-pitch roof cap
        P.px(x + (w >> 1), b, lit ? "#ffcf7a" : env.col("#332c22"));       // door
        if (rng() < 0.4) P.px(x + w - 2, stop - 1, env.col("#7a7060"));    // vent pipe
      }
    }
  },

  // Timber A-frame lodges by the water, with the odd little dock/boathouse.
  {
    id: "lake-lodge", name: "Lake Lodge", biomes: ["lake", "forest", "mountain"],
    heights: [3, 5, 7], maxCoverage: 0.38,
    width: function (rng) { return 4 + Math.floor(rng() * 2); },
    building: function (P, x, w, h, env, lit, rng) {
      var b = env.groundTop - 1, top = b - h + 1;
      if (rng() < 0.3) {                                           // boathouse + a short pier
        var bw = Math.max(2, w - 1), bh = Math.max(2, h - 2);
        var box = env.col(P.mix("#6a4a30", "#7d5636", rng()));
        P.rect(x, b - bh + 1, bw, bh, box);
        for (var k = 0; k < bw; k++) P.px(x + k, b - bh + 1, env.col("#46583a")); // roof
        P.px(x + 1, b - 1, lit ? "#ffca6a" : env.col("#33281a"));  // window
        P.rect(x, b, w, 1, env.col("#5a4630"));                    // pier planks
        return;
      }
      var wood = env.col(P.mix("#6f4c30", "#8a5e3a", rng())), roof = env.col("#46583a");
      var cx = (w - 1) / 2;
      for (var i = 0; i < w; i++) {                                // A-frame: full triangular silhouette
        var ry = top + Math.round(Math.abs(i - cx) * (h - 1) / (cx || 1));
        P.rect(x + i, ry, 1, b - ry + 1, wood);
        P.px(x + i, ry, roof);                                     // roof edge
      }
      P.px(x + (w >> 1), top, roof);                               // ridge cap
      P.px(x + (w >> 1), b - 1, lit ? "#ffca6a" : env.col("#33281a")); // warm window
      if (rng() < 0.4) { P.px(x, b, env.col("#4f3d28")); P.px(x + w - 1, b, env.col("#4f3d28")); } // dock stubs
    }
  },

  // Low pastel resort blocks with balcony rails, and the odd palapa / beach parasol.
  {
    id: "resort", name: "Resort", biomes: ["coast", "jungle"],
    heights: [3, 5, 7], maxCoverage: 0.44,
    width: function (rng) { return 4 + Math.floor(rng() * 3); },
    building: function (P, x, w, h, env, lit, rng) {
      var b = env.groundTop - 1, top = b - h + 1, cx = x + (w >> 1);
      if (rng() < 0.32) {                                          // palapa / parasol on a pole
        P.line(cx, b, cx, top + 1, env.col("#7a5a38"));            // pole
        if (rng() < 0.5) {                                         // thatch palapa (triangular)
          var thatch = env.col(P.mix("#b79256", "#caa768", rng()));
          for (var r = 0; r < 3; r++) P.rect(cx - (2 - r), top + 1 + r, 2 * (2 - r) + 1, 1, thatch);
        } else {                                                   // striped beach parasol
          var red = env.col("#e06a6a"), cream = env.col("#f2ede4");
          for (var s = -2; s <= 2; s++) P.px(cx + s, top + 2, (s & 1) ? red : cream);
          P.px(cx - 1, top + 1, cream); P.px(cx, top + 1, red); P.px(cx + 1, top + 1, cream);
          P.px(cx, top, red);
        }
        return;
      }
      var pastel = ["#e8d9c4", "#e6b7bf", "#bfe0dc", "#e9d3a8"][Math.floor(rng() * 4)];
      var wall = env.col(pastel);
      P.rect(x, top, w, h, wall);
      P.rect(x, top, w, 1, env.col(P.shade(pastel, 0.2)));         // flat roof edge
      for (var wy = top + 2; wy < b; wy += 2) {
        P.rect(x, wy, w, 1, env.col(P.shade(pastel, 0.22)));       // balcony slab / rail line
        for (var wx = x + 1; wx < x + w - 1; wx += 2)
          P.px(wx, wy, (lit && rng() < 0.5) ? "#ffe4a0" : env.col("#5a7d86")); // aqua glass / warm at night
      }
      P.px(cx, b, lit ? "#ffd27a" : env.col("#3a3226"));           // lobby door
    }
  },

  // Stacked terraced adobe — set-back tiers, protruding roof beams (vigas), a ladder.
  {
    id: "pueblo", name: "Pueblo", biomes: ["canyon", "desert"],
    heights: [3, 5, 8], maxCoverage: 0.5,
    width: function (rng) { return 5 + Math.floor(rng() * 3); },
    building: function (P, x, w, h, env, lit, rng) {
      var b = env.groundTop - 1, top = b - h + 1;
      var base = P.mix("#c08a54", "#d3a06a", rng());
      var tiers = h >= 6 ? 3 : 2, tierH = Math.max(2, Math.round(h / tiers));
      var yy = b, left = x, right = x + w - 1;
      for (var t = 0; t < tiers && left <= right; t++) {
        var tTop = (t === tiers - 1) ? top : Math.max(top, yy - tierH + 1);
        if (yy < tTop) break;
        var wc = env.col(P.mix(base, "#000000", t * 0.06));        // upper tiers a touch shaded
        P.rect(left, tTop, right - left + 1, yy - tTop + 1, wc);
        for (var vx = left + 1; vx < right; vx += 2)               // vigas: beam ends under the roofline
          P.px(vx, tTop + 1, env.col("#6a4326"));
        var dx = left + 1 + Math.floor(rng() * Math.max(1, right - left - 1));
        P.px(dx, yy - 1, lit ? "#ffca6a" : env.col("#4a2f1c"));    // door / window on the terrace
        yy = tTop - 1; left += 1; right -= 1;
      }
      var lx = x + w - 2, lh = Math.min(h, 3);                     // ladder leaning on the base terrace
      P.line(lx, b, lx, b - lh, env.col("#7a5330"));
      P.line(lx + 1, b, lx + 1, b - lh, env.col("#7a5330"));
      for (var ry2 = b - 1; ry2 > b - lh; ry2--) {                 // rungs
        P.px(lx, ry2, env.col("#5f3f22"));
        P.px(lx + 1, ry2, env.col("#5f3f22"));
      }
    }
  }
];
