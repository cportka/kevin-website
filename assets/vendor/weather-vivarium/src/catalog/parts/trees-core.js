/* Reference trees. The palm is ported from the LA widget (a curved, wind-swept
   trunk with arcing fronds); pine/oak/birch/deadwood establish the idiom for the
   fanned-out species: trunk rooted at (x,yb), canopy swaying with env.wind. */

function windSway(env, amt) {
  var w = P_clamp((env.wind || 0), 0, 1);
  return Math.sin(env.frame * (0.04 + w * 0.05)) * (w * (amt || 1.5));
}
function P_clamp(v, a, z) { return v < a ? a : v > z ? z : v; }

export default [
  {
    id: "palm", name: "Palm", biomes: ["coast", "desert", "jungle", "savanna"],
    tags: ["tree", "tropical"], w: 16, h: 22, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var H = 20, bend = 7;
      var windN = P.clamp(0.08 + (env.wind || 0) * 1.0, 0.08, 1.1);
      var sway = Math.sin(env.frame * (0.05 + windN * 0.06)) * (0.6 + windN * 2.2);
      var trunk = env.col("#7a5636");
      var hx = x, hy = yb - H;
      for (var y = yb; y >= yb - H; y--) {
        var t = (yb - y) / H;
        var xoff = Math.round((bend + sway) * t * t);
        P.rect(x + xoff, y, 2, 1, P.mix(trunk, env.col("#3a2a18"), t * 0.35));
        if (y === yb - H) hx = x + xoff + 1;
      }
      var frond = env.col("#2f8d54"), frond2 = env.col("#256e41");
      var tip = Math.round(sway * 0.7);
      var F = [[-5, -1, -2, 3], [-4, -3, -1, 4], [-1, -4, 0, 4], [3, -4, 1, 4], [6, -2, 2, 4], [-3, 1, -1, 4], [4, 0, 1, 4]];
      for (var i = 0; i < F.length; i++) {
        var mx = hx + F[i][0] + tip, my = hy + F[i][1];
        var ex = mx + F[i][2] + tip, ey = my + F[i][3];
        P.line(hx, hy, mx, my, i % 2 ? frond2 : frond);
        P.line(mx, my, ex, ey, i % 2 ? frond2 : frond);
        P.px(ex, ey, frond2);
      }
      P.disc(hx, hy, 1, frond);
      P.px(hx - 1, hy + 1, "#3a2a18"); P.px(hx + 1, hy + 1, "#3a2a18"); // coconuts
    }
  },
  {
    id: "pine", name: "Pine", biomes: ["mountain", "forest", "tundra", "plains", "canyon", "lake"],
    tags: ["tree", "conifer", "cold"], w: 11, h: 20, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var sway = Math.round(windSway(env, 1.2));
      var trunk = env.col("#5a3f28"), dark = env.col("#1f5233"), lite = env.col("#2f7a4a");
      var cx = x + 5;
      P.rect(cx - 1, yb - 4, 2, 4, trunk);
      // three stacked triangular tiers, narrowing upward, tip nudged by wind
      var tiers = [[yb - 4, 5], [yb - 9, 4], [yb - 13, 3]];
      for (var t = 0; t < tiers.length; t++) {
        var by = tiers[t][0], rw = tiers[t][1], drift = Math.round(sway * (t / 2));
        for (var r = 0; r < 5; r++) {
          var wdt = Math.round(rw * (1 - r / 5)) * 2 + 1;
          var yy = by - r, xx = cx - ((wdt - 1) >> 1) + drift;
          P.rect(xx, yy, wdt, 1, (r % 2) ? dark : lite);
        }
      }
      P.px(cx + Math.round(sway), yb - 18, lite); // apex
    }
  },
  {
    id: "oak", name: "Oak", biomes: ["forest", "plains", "farmland", "city", "wetland", "lake"],
    tags: ["tree", "broadleaf", "temperate"], w: 15, h: 18, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var sway = Math.round(windSway(env, 1.6));
      var trunk = env.col("#5c4326"), leaf = env.col("#3f8f3a"), dark = env.col("#2c6e2b");
      var cx = x + 7;
      P.rect(cx - 1, yb - 7, 2, 7, trunk);
      P.px(cx - 2, yb - 3, trunk); P.px(cx + 2, yb - 5, trunk); // low branches
      var gx = cx + sway, gy = yb - 12;
      P.disc(gx, gy, 5, dark);
      P.disc(gx - 3, gy + 1, 3, leaf);
      P.disc(gx + 3, gy + 1, 3, leaf);
      P.disc(gx, gy - 2, 4, leaf);
      P.disc(gx, gy - 1, 3, P.tint(leaf, 0.12));
    }
  },
  {
    id: "birch", name: "Birch", biomes: ["forest", "mountain", "tundra", "lake"],
    tags: ["tree", "broadleaf", "cold"], w: 10, h: 19, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var sway = Math.round(windSway(env, 1.4));
      var bark = "#e8e6df", leaf = env.col("#8fc24a"), dark = env.col("#5f9a2f");
      var cx = x + 4;
      for (var y = yb; y > yb - 13; y--) {
        P.px(cx, y, env.col(bark)); P.px(cx + 1, y, env.col("#c9c6bd"));
        if ((y & 1) === 0) P.px(cx, y, env.col("#3a3a34")); // dark bark flecks
      }
      var gx = cx + sway, gy = yb - 14;
      P.disc(gx, gy, 4, dark);
      P.disc(gx - 2, gy + 1, 2, leaf); P.disc(gx + 2, gy, 3, leaf);
      P.disc(gx, gy - 1, 2, P.tint(leaf, 0.15));
    }
  },
  {
    id: "deadwood", name: "Bare tree", biomes: ["tundra", "wetland", "desert", "plains", "farmland", "canyon"],
    tags: ["tree", "bare", "winter"], w: 13, h: 18, anchor: "baseline", rarity: 0.7,
    draw: function (P, x, yb, env) {
      var sway = Math.round(windSway(env, 1.0));
      var wood = env.col("#6a5334");
      var cx = x + 6;
      P.rect(cx - 1, yb - 9, 2, 9, wood);
      // gnarled branches
      P.line(cx, yb - 9, cx - 4 + sway, yb - 14, wood);
      P.line(cx, yb - 8, cx + 4 + sway, yb - 13, wood);
      P.line(cx - 4 + sway, yb - 14, cx - 6 + sway, yb - 16, wood);
      P.line(cx + 4 + sway, yb - 13, cx + 6 + sway, yb - 16, wood);
      P.line(cx, yb - 11, cx + 2 + sway, yb - 15, wood);
    }
  }
];
