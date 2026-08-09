/* Trees batch A — species with distinct silhouettes, following the trees-core
   idiom: trunk rooted at (x,yb), canopy nudged by env.wind (windSway), colours
   wrapped in env.col so they read at night. Bark whites (birch/aspen/eucalyptus)
   and blossom pink are also dimmed — none of these are light sources. Cactus
   stands rigid. Authored facing right; the engine mirrors. */

function P_clamp(v, a, z) { return v < a ? a : v > z ? z : v; }
function windSway(env, amt) {
  var w = P_clamp((env.wind || 0), 0, 1);
  return Math.sin(env.frame * (0.04 + w * 0.05)) * (w * (amt || 1.5));
}

export default [
  {
    id: "maple", name: "Maple", biomes: ["forest", "plains", "farmland", "city", "mountain"],
    tags: ["tree", "broadleaf", "autumn"], w: 13, h: 18, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var sway = Math.round(windSway(env, 1.6));
      var trunk = env.col("#6a4a2c"), grn = env.col("#4a9a3a"), dark = env.col("#2f6e2b");
      var org = env.col("#d6772a"), ohi = env.col("#e89a3a");
      var cx = x + 6;
      P.rect(cx - 1, yb - 6, 2, 6, trunk);
      P.px(cx - 2, yb - 4, trunk); P.px(cx + 2, yb - 5, trunk); // low forks
      var gx = cx + sway, gy = yb - 12;
      P.disc(gx, gy, 5, dark);              // full round crown
      P.disc(gx - 3, gy + 1, 3, grn);
      P.disc(gx + 3, gy + 1, 3, org);       // orange side, green side
      P.disc(gx, gy - 2, 4, org);
      P.disc(gx - 1, gy, 2, grn);
      P.disc(gx + 1, gy - 2, 2, ohi);       // sunlit orange top
    }
  },
  {
    id: "willow", name: "Willow", biomes: ["wetland", "lake", "coast", "plains"],
    tags: ["tree", "broadleaf", "weeping"], w: 14, h: 18, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var sway = Math.round(windSway(env, 1.2));
      var tip = Math.round(windSway(env, 2.2));
      var trunk = env.col("#6a5230"), leaf = env.col("#5f9a3f"), light = env.col("#7fb84f"), dark = env.col("#3f7a2c");
      var cx = x + 7;
      P.rect(cx - 1, yb - 8, 2, 8, trunk);
      var gx = cx + sway, gy = yb - 13;
      P.disc(gx, gy, 3, dark);              // mounded crown
      P.disc(gx - 3, gy + 1, 3, leaf);
      P.disc(gx + 3, gy + 1, 3, leaf);
      P.disc(gx, gy - 1, 3, light);
      // drooping strands: outer set long, inner set shorter, tips drift with wind
      var A = [-4, -2, 0, 2, 4], B = [-3, -1, 1, 3];
      for (var i = 0; i < A.length; i++)
        P.line(gx + A[i], gy + 2, gx + A[i] + tip, yb - 2, (i & 1) ? light : leaf);
      for (var j = 0; j < B.length; j++)
        P.line(gx + B[j], gy + 2, gx + B[j] + tip, yb - 4, (j & 1) ? leaf : light);
    }
  },
  {
    id: "cypress", name: "Cypress", biomes: ["coast", "city", "farmland", "plains"],
    tags: ["tree", "conifer", "columnar"], w: 7, h: 22, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var sway = windSway(env, 1.6);
      var trunk = env.col("#4a3420"), dark = env.col("#1e4a30"), mid = env.col("#285a3a");
      var cx = x + 3;
      P.px(cx, yb, trunk); P.px(cx, yb - 1, trunk);
      // narrow flame column: width 3 nearly full height, tapering to a point
      for (var y = yb - 1; y >= yb - 20; y--) {
        var t = (yb - 1 - y) / 19;
        var half = t > 0.9 ? 0 : 1;
        var drift = Math.round(sway * t);
        var wdt = half * 2 + 1;
        P.rect(cx - half + drift, y, wdt, 1, ((yb - y) & 1) ? dark : mid);
      }
    }
  },
  {
    id: "redwood", name: "Redwood", biomes: ["forest", "mountain"],
    tags: ["tree", "conifer", "giant"], w: 11, h: 24, anchor: "baseline", rarity: 0.6,
    draw: function (P, x, yb, env) {
      var sway = windSway(env, 1.1);
      var bark = env.col("#7a4028"), barkD = env.col("#5a2e1c");
      var dark = env.col("#234f34"), mid = env.col("#2c6242"), lite = env.col("#3a7a52");
      var cx = x + 5;
      // tall straight reddish trunk behind the spire
      P.rect(cx - 1, yb - 22, 3, 22, bark);
      P.rect(cx - 1, yb - 22, 1, 22, barkD);
      // narrow evergreen spire over the upper trunk
      for (var y = yb - 9; y >= yb - 23; y--) {
        var t = (yb - 9 - y) / 14;
        var half = Math.round((1 - t) * 3.2);
        var drift = Math.round(sway * t);
        P.rect(cx - half + drift, y, half * 2 + 1, 1, ((yb - y) & 1) ? dark : mid);
      }
      P.px(cx + Math.round(sway), yb - 23, lite); // apex
    }
  },
  {
    id: "banana", name: "Banana", biomes: ["jungle", "coast"],
    tags: ["tree", "tropical", "broadleaf"], w: 15, h: 16, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var tip = Math.round(windSway(env, 1.8));
      var stalk = env.col("#6f7d3a"), stalkD = env.col("#4c5a24");
      var leaf = env.col("#3fa03a"), dark = env.col("#2c7a2b");
      var cx = x + 7, hy = yb - 7;
      P.rect(cx - 1, hy, 3, 7, stalk);
      P.rect(cx - 1, hy, 1, 7, stalkD);      // shaded pseudostem
      // broad paddle leaves radiating from the crown, thickened with a parallel rib
      var F = [[-6, -1], [-4, -6], [0, -8], [4, -6], [6, -1], [-5, 3], [5, 3]];
      for (var i = 0; i < F.length; i++) {
        var ex = cx + F[i][0] + tip, ey = hy + F[i][1];
        var c = (i & 1) ? dark : leaf;
        P.line(cx, hy, ex, ey, c);
        P.line(cx, hy + 1, ex, ey + 1, c); // broaden the blade
        P.px(ex, ey, dark);
      }
      P.disc(cx, hy, 1, dark);
      P.px(cx + 2, hy + 2, env.col("#d9c23a")); // little hanging bunch
      P.px(cx + 2, hy + 3, env.col("#c9a82a"));
    }
  },
  {
    id: "bamboo", name: "Bamboo", biomes: ["jungle", "forest", "wetland"],
    tags: ["tree", "grass", "segmented"], w: 12, h: 22, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var sway = windSway(env, 2.0);
      var stalk = env.col("#6fae3a"), node = env.col("#4c7a26"), leaf = env.col("#5aa02f");
      var S = [[x + 2, 20], [x + 6, 17], [x + 9, 13]];
      for (var i = 0; i < S.length; i++) {
        var bx = S[i][0], ht = S[i][1];
        var topx = bx + Math.round(sway * (ht / 22) * 1.2);
        P.line(bx, yb, topx, yb - ht, stalk);
        // segment nodes every 4px along the culm
        for (var k = 1; k * 4 < ht; k++) {
          var t = (k * 4) / ht;
          var nx = Math.round(bx + (topx - bx) * t);
          P.px(nx, yb - k * 4, node);
        }
        // a couple of leaf sprigs near the top
        P.line(topx, yb - ht + 2, topx + 2, yb - ht + 1, leaf);
        P.line(topx, yb - ht + 4, topx - 2, yb - ht + 3, leaf);
      }
    }
  },
  {
    id: "baobab", name: "Baobab", biomes: ["savanna", "desert"],
    tags: ["tree", "broadleaf", "fat-trunk"], w: 14, h: 18, anchor: "baseline", rarity: 0.7,
    draw: function (P, x, yb, env) {
      var sway = Math.round(windSway(env, 1.0));
      var trunk = env.col("#8a6a44"), dark = env.col("#5f472c"), leaf = env.col("#5a7a34");
      var cx = x + 7;
      // fat bottle trunk, tapering upward
      for (var y = yb; y >= yb - 12; y--) {
        var t = (yb - y) / 12;
        var half = Math.round(5 - t * 3);
        P.rect(cx - half, y, half * 2 + 1, 1, ((yb - y) & 1) ? trunk : P.shade(trunk, 0.08));
      }
      P.rect(cx - 5, yb - 1, 2, 1, dark); P.rect(cx + 4, yb - 1, 2, 1, dark); // root flare
      // tiny twiggy crown ("upside-down tree")
      var by = yb - 12;
      P.line(cx, by, cx - 4 + sway, by - 3, dark);
      P.line(cx, by, cx + 4 + sway, by - 3, dark);
      P.line(cx, by, cx + sway, by - 4, dark);
      P.disc(cx - 4 + sway, by - 3, 1, leaf);
      P.disc(cx + 4 + sway, by - 3, 1, leaf);
      P.disc(cx + sway, by - 4, 1, leaf);
    }
  },
  {
    id: "acacia", name: "Acacia", biomes: ["savanna", "plains", "desert"],
    tags: ["tree", "broadleaf", "umbrella"], w: 16, h: 16, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var sway = Math.round(windSway(env, 1.0));
      var trunk = env.col("#6a5230"), leaf = env.col("#4a7a3a"), dark = env.col("#35602b");
      var cx = x + 7;
      P.rect(cx - 1, yb - 8, 2, 8, trunk);
      // branches fan up to a flat canopy
      P.line(cx, yb - 8, x + 2 + sway, yb - 12, trunk);
      P.line(cx, yb - 8, cx + sway, yb - 13, trunk);
      P.line(cx, yb - 8, x + 13 + sway, yb - 12, trunk);
      // flat-topped umbrella crown
      var d = sway;
      P.rect(x + 2 + d, yb - 14, 12, 1, leaf);   // domed top
      P.rect(x + 1 + d, yb - 13, 14, 1, leaf);   // widest band
      P.rect(x + 2 + d, yb - 12, 12, 1, dark);   // flat underside
      P.px(x + 5 + d, yb - 15, leaf); P.px(x + 10 + d, yb - 15, leaf);
    }
  },
  {
    id: "spruce", name: "Spruce", biomes: ["mountain", "forest", "tundra"],
    tags: ["tree", "conifer", "cold"], w: 11, h: 20, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var sway = windSway(env, 1.2);
      var trunk = env.col("#4a3420"), dark = env.col("#1c4d38"), mid = env.col("#276044");
      var cx = x + 5;
      P.rect(cx - 1, yb - 3, 2, 3, trunk);
      // one tall narrow cone with a slightly ragged, drooping edge
      for (var y = yb - 3; y >= yb - 18; y--) {
        var t = (yb - 3 - y) / 15;
        var half = Math.round((1 - t) * 4.5) - (y & 1 ? 0 : 0);
        var drift = Math.round(sway * t);
        var wdt = half * 2 + 1;
        P.rect(cx - half + drift, y, wdt, 1, ((yb - y) & 1) ? dark : mid);
      }
      P.px(cx + Math.round(sway), yb - 18, mid);
    }
  },
  {
    id: "aspen", name: "Aspen", biomes: ["mountain", "forest", "tundra", "plains", "canyon"],
    tags: ["tree", "broadleaf", "quaking"], w: 10, h: 20, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var sway = Math.round(windSway(env, 1.3));
      var bark = "#dcd9cf", barkS = "#b7b4aa";
      var leaf = env.col("#6f9a2f"), gold = env.col("#c9c24a"), dark = env.col("#4f7a24");
      var cx = x + 4;
      // tall slender pale trunk with dark eye scars
      for (var y = yb; y > yb - 15; y--) {
        P.px(cx, y, env.col(bark)); P.px(cx + 1, y, env.col(barkS));
        if ((y % 4) === 0) P.px(cx, y, env.col("#3a3a30"));
      }
      var gx = cx + sway, gy = yb - 15;
      P.disc(gx, gy, 3, dark);              // small round gold-green canopy
      P.disc(gx - 1, gy + 1, 2, leaf);
      P.disc(gx + 1, gy - 1, 2, leaf);
      // quaking shimmer — gold flecks flip with the frame
      var q = (env.frame >> 2) & 1;
      P.px(gx + (q ? 1 : -1), gy - 2, gold);
      P.px(gx + (q ? -2 : 2), gy, gold);
    }
  },
  {
    id: "mangrove", name: "Mangrove", biomes: ["wetland", "coast", "jungle", "lake"],
    tags: ["tree", "broadleaf", "prop-root"], w: 14, h: 15, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var sway = Math.round(windSway(env, 1.2));
      var wood = env.col("#5b4a30"), dark = env.col("#1f5a2c"), leaf = env.col("#2f7a3f"), hi = env.col("#3f9a4f");
      var cx = x + 7;
      // trunk held above the tideline
      P.rect(cx - 1, yb - 9, 3, 5, wood);
      // arching prop / stilt roots down to the ground
      P.line(cx - 1, yb - 4, x + 2, yb - 2, wood); P.line(x + 2, yb - 2, x + 1, yb, wood);
      P.line(cx, yb - 4, x + 4, yb - 1, wood); P.line(x + 4, yb - 1, x + 4, yb, wood);
      P.line(cx + 1, yb - 4, x + 12, yb - 2, wood); P.line(x + 12, yb - 2, x + 13, yb, wood);
      P.line(cx + 1, yb - 3, x + 10, yb - 1, wood); P.line(x + 10, yb - 1, x + 10, yb, wood);
      // broad dense canopy
      var gx = cx + sway, gy = yb - 11;
      P.disc(gx, gy, 4, dark);
      P.disc(gx - 3, gy + 1, 3, leaf);
      P.disc(gx + 3, gy + 1, 3, leaf);
      P.disc(gx, gy - 1, 3, hi);
    }
  },
  {
    id: "olive", name: "Olive", biomes: ["farmland", "coast", "desert", "savanna"],
    tags: ["tree", "broadleaf", "silver"], w: 13, h: 15, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var sway = Math.round(windSway(env, 1.4));
      var trunk = env.col("#6b5a3f"), knot = env.col("#4a3d29");
      var leaf = env.col("#8fa77f"), dark = env.col("#5f7a55"), hi = env.col("#adc19d");
      var cx = x + 6;
      // short gnarled trunk with a knot and a low branch
      P.rect(cx - 1, yb - 5, 2, 5, trunk);
      P.px(cx - 2, yb - 3, knot); P.px(cx + 1, yb - 4, trunk);
      P.line(cx, yb - 5, cx + 2 + sway, yb - 8, trunk);
      var gx = cx + sway, gy = yb - 9;
      P.disc(gx, gy, 4, dark);              // silvery rounded crown
      P.disc(gx - 3, gy + 1, 3, leaf);
      P.disc(gx + 3, gy + 1, 3, leaf);
      P.disc(gx, gy - 2, 3, leaf);
      P.disc(gx, gy - 1, 2, hi);
    }
  },
  {
    id: "cherry-blossom", name: "Cherry Blossom", biomes: ["city", "farmland", "plains", "forest"],
    tags: ["tree", "broadleaf", "blossom"], w: 14, h: 16, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var sway = Math.round(windSway(env, 1.5));
      var trunk = env.col("#4a3326"), pink = env.col("#f2a6c2"), deep = env.col("#e07ba0"), hi = env.col("#ffd0e2");
      var cx = x + 7;
      P.rect(cx - 1, yb - 6, 2, 6, trunk);
      P.px(cx - 2, yb - 4, trunk); P.px(cx + 2, yb - 5, trunk);
      var gx = cx + sway, gy = yb - 11;
      P.disc(gx, gy, 5, deep);              // fluffy pink cloud
      P.disc(gx - 3, gy + 1, 3, pink);
      P.disc(gx + 3, gy + 1, 3, pink);
      P.disc(gx, gy - 2, 4, pink);
      P.disc(gx, gy - 1, 3, hi);
      // a couple of petals drifting down on the breeze
      var f = env.frame >> 1;
      P.px(gx - 4, yb - 6 + (f % 6), pink);
      P.px(gx + 3, yb - 5 + ((f + 3) % 6), hi);
    }
  },
  {
    id: "eucalyptus", name: "Eucalyptus", biomes: ["forest", "savanna", "coast", "farmland"],
    tags: ["tree", "broadleaf", "tall"], w: 12, h: 22, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var sway = Math.round(windSway(env, 1.6));
      var bark = "#cfc7ba", mott = "#a8b0a0";
      var leaf = env.col("#6f9a7a"), dark = env.col("#4f7a5c");
      var cx = x + 5;
      // tall smooth mottled trunk with a gentle lean
      for (var y = yb; y > yb - 16; y--) {
        var lean = Math.round((yb - y) / 16 * 1);
        P.px(cx + lean, y, env.col(bark)); P.px(cx + 1 + lean, y, env.col(mott));
        if ((y % 5) === 0) P.px(cx + lean, y, env.col("#8a9282"));
      }
      var tx = cx + 1;
      // loose drooping blue-green clumps rather than a solid canopy
      var C = [[tx + sway, yb - 17, 2], [cx - 3, yb - 12, 2], [cx + 4, yb - 14, 1]];
      for (var i = 0; i < C.length; i++) {
        P.disc(C[i][0], C[i][1], C[i][2], dark);
        P.disc(C[i][0], C[i][1] - 1, C[i][2] - 1 < 1 ? 1 : C[i][2] - 1, leaf);
        P.line(C[i][0], C[i][1] + C[i][2], C[i][0], C[i][1] + C[i][2] + 2, leaf); // droop
      }
    }
  },
  {
    id: "saguaro", name: "Saguaro", biomes: ["desert", "canyon"],
    tags: ["cactus", "succulent", "desert"], w: 11, h: 20, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var grn = env.col("#3f7a3a"), dark = env.col("#2f5f2c"), lite = env.col("#57a04a");
      var cx = x + 5;
      // ribbed main column with a rounded top
      P.rect(cx - 2, yb - 18, 4, 18, grn);
      P.disc(cx, yb - 18, 2, grn);
      P.rect(cx - 2, yb - 18, 1, 18, lite);   // sunlit rib
      P.rect(cx - 1, yb - 17, 1, 17, dark);   // shaded rib
      P.rect(cx + 1, yb - 17, 1, 17, dark);
      // right arm (lower): out then up
      P.rect(cx + 1, yb - 9, 3, 2, grn);
      P.rect(cx + 3, yb - 14, 2, 6, grn); P.disc(cx + 4, yb - 14, 1, grn);
      // left arm (higher): out then up
      P.rect(cx - 4, yb - 12, 3, 2, grn);
      P.rect(cx - 4, yb - 17, 2, 6, grn); P.disc(cx - 3, yb - 17, 1, grn);
      // spine flecks + a crown of desert blossoms
      P.px(cx - 1, yb - 6, lite); P.px(cx + 1, yb - 11, lite); P.px(cx + 4, yb - 12, lite);
      var f = (env.frame >> 3) & 1;
      P.px(cx - 1, yb - 20, env.col(f ? "#ffe9a0" : "#fff2c0"));
      P.px(cx + 1, yb - 20, env.col("#f6dff0"));
    }
  }
];
