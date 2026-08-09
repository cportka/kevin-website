/* Trees batch B — twenty more species, spread deliberately across the biomes so
   no pool leans on the same three silhouettes. Same idiom as batch A: trunk
   rooted at (x,yb), canopy nudged by env.wind, every painted surface wrapped in
   env.col so it dims at night (nothing here is a light source). Distinct
   SILHOUETTE first, palette second — at 50px the outline is the species. */

function clampv(v, a, z) { return v < a ? a : v > z ? z : v; }
function sway(env, amt) {
  var w = clampv((env.wind || 0), 0, 1);
  return Math.sin(env.frame * (0.04 + w * 0.05)) * (w * (amt || 1.5));
}

export default [
  {
    // the purple haze of a SoCal street in June
    id: "jacaranda", name: "Jacaranda", biomes: ["coast", "city", "savanna", "farmland"],
    tags: ["tree", "flowering", "purple"], w: 12, h: 14, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var s = Math.round(sway(env, 1.4));
      var trunk = env.col("#6b5140"), lav = env.col("#9a7ec8"), deep = env.col("#7a5cb0"), pale = env.col("#b79ade");
      var cx = x + 6;
      P.rect(cx - 1, yb - 6, 2, 6, trunk);
      P.px(cx - 2, yb - 5, trunk); P.px(cx + 1, yb - 4, trunk);
      var gx = cx + s, gy = yb - 10;
      P.disc(gx, gy, 5, deep);
      P.disc(gx - 3, gy + 1, 3, lav); P.disc(gx + 3, gy, 3, lav);
      P.disc(gx, gy - 2, 3, pale);
      P.px(gx - 4, yb - 5, lav); P.px(gx + 4, yb - 5, deep);   // fallen bloom drift
    }
  },
  {
    // wind-sheared flat top leaning off the sea cliff — San Francisco's tree
    id: "monterey-cypress", name: "Monterey cypress", biomes: ["coast"],
    tags: ["tree", "conifer", "windswept"], w: 13, h: 15, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var trunk = env.col("#5d4a34"), dk = env.col("#2e5230"), md = env.col("#3f6b3c"), lt = env.col("#557f4a");
      // Trunk leans hard to leeward — two pixels thick the whole way, each step
      // overlapping the last, and the top step reaches the crown's underside at
      // yb-8 (a 1px staircase stopping at yb-6 read as disconnected dashes).
      P.rect(x + 4, yb - 1, 2, 2, trunk);
      P.rect(x + 5, yb - 3, 2, 2, trunk);
      P.rect(x + 6, yb - 5, 2, 2, trunk);
      P.rect(x + 7, yb - 7, 2, 2, trunk);
      // the sheared, layered flat crown, all streaming one way
      P.rect(x + 3, yb - 9, 10, 2, md);
      P.rect(x + 5, yb - 11, 8, 2, dk);
      P.rect(x + 2, yb - 8, 8, 1, dk);
      P.rect(x + 6, yb - 12, 6, 1, lt);
      P.px(x + 1, yb - 8, md); P.px(x + 12, yb - 10, lt);
    }
  },
  {
    // Mojave silhouette: shaggy arms ending in spiked rosettes
    id: "joshua-tree", name: "Joshua tree", biomes: ["desert", "canyon"],
    tags: ["tree", "desert", "yucca"], w: 11, h: 13, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var bark = env.col("#8a6b46"), shag = env.col("#6f5638"), tuft = env.col("#6d7f3c"), dk = env.col("#50632c");
      var cx = x + 5;
      P.rect(cx, yb - 7, 2, 7, bark);
      P.px(cx, yb - 3, shag); P.px(cx + 1, yb - 5, shag);        // shaggy old leaves
      P.line(cx, yb - 7, cx - 3, yb - 10, bark);                 // left arm
      P.line(cx + 1, yb - 7, cx + 4, yb - 9, bark);              // right arm
      function rosette(rx, ry) {
        P.px(rx, ry, dk); P.px(rx - 1, ry, tuft); P.px(rx + 1, ry, tuft);
        P.px(rx, ry - 1, tuft); P.px(rx - 1, ry - 1, dk); P.px(rx + 1, ry - 1, dk);
        P.px(rx, ry - 2, tuft);
      }
      rosette(cx - 3, yb - 10); rosette(cx + 4, yb - 9); rosette(cx + 1, yb - 8 - 1);
    }
  },
  {
    // tall clean trunk, crown carried high — western timber country
    id: "ponderosa", name: "Ponderosa pine", biomes: ["mountain", "forest", "canyon"],
    tags: ["tree", "conifer", "tall"], w: 9, h: 17, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var bark = env.col("#8a5a38"), dk = env.col("#2f5a30"), md = env.col("#3f7038");
      var cx = x + 4;
      P.rect(cx, yb - 10, 1, 10, bark);
      P.px(cx, yb - 6, env.col("#a06a42"));                       // plated bark glint
      P.disc(cx, yb - 12, 3, dk);
      P.disc(cx - 1, yb - 14, 2, md);
      P.disc(cx + 1, yb - 13, 2, md);
      P.px(cx, yb - 16, dk);
      P.px(cx - 3, yb - 11, md); P.px(cx + 3, yb - 12, dk);       // ragged high boughs
    }
  },
  {
    // understory bloomer: low, layered, white-pink
    id: "dogwood", name: "Dogwood", biomes: ["forest", "farmland", "city"],
    tags: ["tree", "flowering", "small"], w: 10, h: 10, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var s = Math.round(sway(env, 1));
      var trunk = env.col("#6a5040"), bloom = env.col("#f0dfe4"), pink = env.col("#e0b4c4"), leaf = env.col("#4f7a3c");
      var cx = x + 5;
      P.rect(cx, yb - 4, 1, 4, trunk);
      P.px(cx - 1, yb - 3, trunk); P.px(cx + 1, yb - 4, trunk);
      var gx = cx + s;
      P.rect(gx - 4, yb - 6, 9, 2, leaf);                        // layered branches
      P.rect(gx - 3, yb - 8, 7, 2, leaf);
      P.px(gx - 4, yb - 7, bloom); P.px(gx - 1, yb - 6, bloom); P.px(gx + 2, yb - 7, bloom);
      P.px(gx, yb - 8, pink); P.px(gx + 3, yb - 6, pink); P.px(gx - 2, yb - 9, bloom);
    }
  },
  {
    // glossy southern evergreen with big white cups
    id: "magnolia", name: "Magnolia", biomes: ["coast", "farmland", "city", "wetland"],
    tags: ["tree", "flowering", "evergreen"], w: 11, h: 12, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var trunk = env.col("#5f4a38"), dk = env.col("#274a2a"), md = env.col("#356038"), wht = env.col("#efece0");
      var cx = x + 5;
      P.rect(cx, yb - 4, 2, 4, trunk);
      P.disc(cx, yb - 8, 4, dk);
      P.disc(cx - 2, yb - 7, 2, md); P.disc(cx + 2, yb - 9, 2, md);
      P.px(cx - 2, yb - 9, wht); P.px(cx + 1, yb - 6, wht); P.px(cx + 3, yb - 10, wht);
    }
  },
  {
    // fan-leaved column that turns pure gold
    id: "ginkgo", name: "Ginkgo", biomes: ["city", "forest", "farmland"],
    tags: ["tree", "golden", "street"], w: 9, h: 13, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var s = Math.round(sway(env, 1));
      var trunk = env.col("#7a6a52"), gold = env.col("#d9b23a"), hi = env.col("#e8ca5e"), core = env.col("#b8922e");
      var cx = x + 4;
      P.rect(cx, yb - 5, 1, 5, trunk);
      var gx = cx + s;
      P.rect(gx - 2, yb - 10, 5, 5, core);                       // upright oval
      P.rect(gx - 1, yb - 12, 3, 2, gold);
      P.px(gx - 3, yb - 8, gold); P.px(gx + 3, yb - 9, gold);
      P.px(gx, yb - 13, hi); P.px(gx + 1, yb - 11, hi); P.px(gx - 1, yb - 7, hi);
    }
  },
  {
    // straight diamond-cut trunk, stiff crown, amber fruit
    id: "date-palm", name: "Date palm", biomes: ["desert", "savanna", "coast"],
    tags: ["tree", "palm", "oasis"], w: 12, h: 15, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var bark = env.col("#9a7a4e"), cut = env.col("#7a5f3a"), frond = env.col("#3f7a38"), dk = env.col("#2f5e2c"), date = env.col("#c07a2e");
      var cx = x + 6;
      P.rect(cx, yb - 9, 1, 9, bark);
      P.px(cx, yb - 3, cut); P.px(cx, yb - 6, cut);              // diamond leaf scars
      P.line(cx, yb - 9, cx - 4, yb - 12, frond);
      P.line(cx, yb - 9, cx + 4, yb - 12, frond);
      P.line(cx, yb - 10, cx - 3, yb - 14, dk);
      P.line(cx, yb - 10, cx + 3, yb - 14, dk);
      P.px(cx, yb - 12, dk); P.px(cx, yb - 13, frond);
      P.px(cx - 1, yb - 9, date); P.px(cx + 1, yb - 8, date);    // hanging date clusters
    }
  },
  {
    // a narrow near-black spire
    id: "fir", name: "Fir", biomes: ["mountain", "tundra", "forest", "lake"],
    tags: ["tree", "conifer", "spire"], w: 7, h: 15, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var trunk = env.col("#4e3a28"), dk = env.col("#233f28"), md = env.col("#2f5232");
      var cx = x + 3;
      P.rect(cx, yb - 2, 1, 2, trunk);
      for (var i = 0; i < 10; i++) {
        var w2 = Math.max(1, 3 - (i >> 2)), row = yb - 3 - i;
        P.rect(cx - w2 + 1, row, w2 * 2 - 1, 1, (i % 3 === 2) ? md : dk);
      }
      P.px(cx, yb - 13, dk); P.px(cx, yb - 14, md);
    }
  },
  {
    // the conifer that turns gold and drops — alpine autumn
    id: "larch", name: "Larch", biomes: ["mountain", "tundra"],
    tags: ["tree", "conifer", "golden"], w: 9, h: 14, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var trunk = env.col("#5a4630"), gold = env.col("#c9993a"), hi = env.col("#dfb356"), dk = env.col("#a87c2c");
      var cx = x + 4;
      P.rect(cx, yb - 3, 1, 3, trunk);
      for (var i = 0; i < 9; i++) {
        var w2 = Math.max(1, 4 - Math.floor(i / 2)), row = yb - 4 - i;
        P.rect(cx - w2 + 1, row, w2 * 2 - 1, 1, (i % 2) ? gold : dk);
      }
      P.px(cx, yb - 13, hi); P.px(cx - 2, yb - 6, hi);
    }
  },
  {
    // the exclamation mark along a farm lane
    id: "lombardy-poplar", name: "Lombardy poplar", biomes: ["farmland", "plains", "city"],
    tags: ["tree", "columnar", "windbreak"], w: 5, h: 16, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var s = Math.round(sway(env, 1));
      var trunk = env.col("#6a5540"), dk = env.col("#3d6b30"), md = env.col("#4f8340");
      var cx = x + 2;
      P.rect(cx, yb - 2, 1, 2, trunk);
      P.rect(cx - 1 + s, yb - 12, 3, 10, dk);
      P.rect(cx + s, yb - 14, 1, 2, dk);
      P.px(cx - 1 + s, yb - 9, md); P.px(cx + 1 + s, yb - 6, md); P.px(cx + s, yb - 11, md);
    }
  },
  {
    // broad ragged crown over a creekbed
    id: "cottonwood", name: "Cottonwood", biomes: ["canyon", "plains", "lake"],
    tags: ["tree", "broadleaf", "riparian"], w: 13, h: 14, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var s = Math.round(sway(env, 1.6));
      var trunk = env.col("#7a6448"), dk = env.col("#48742e"), md = env.col("#5c8c3a"), lt = env.col("#74a44c");
      var cx = x + 6;
      P.rect(cx - 1, yb - 5, 2, 5, trunk);
      P.px(cx - 2, yb - 4, trunk); P.px(cx + 2, yb - 3, trunk);
      var gx = cx + s, gy = yb - 9;
      P.disc(gx - 3, gy, 3, dk); P.disc(gx + 3, gy - 1, 3, md);
      P.disc(gx, gy - 3, 3, md); P.disc(gx + 1, gy + 1, 2, lt);
      P.px(gx - 5, gy - 2, md); P.px(gx + 5, gy - 3, dk);        // ragged edges
    }
  },
  {
    // wind-twisted survivor on the rimrock
    id: "juniper", name: "Juniper", biomes: ["canyon", "desert", "mountain"],
    tags: ["tree", "twisted", "small"], w: 9, h: 9, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var bark = env.col("#7c6248"), dead = env.col("#a08a6a"), dk = env.col("#3d5a32"), md = env.col("#4e6e3c");
      P.px(x + 3, yb, bark); P.px(x + 4, yb - 1, bark);
      P.px(x + 3, yb - 2, bark); P.px(x + 4, yb - 3, bark);      // the twist
      P.px(x + 5, yb - 2, dead);                                 // one dead spar
      P.disc(x + 4, yb - 5, 2, dk);
      P.disc(x + 6, yb - 5, 2, md);
      P.px(x + 2, yb - 5, md); P.px(x + 7, yb - 7, dk);
    }
  },
  {
    // low, wide, deep-green — a courtyard fig
    id: "fig", name: "Fig", biomes: ["desert", "farmland", "savanna"],
    tags: ["tree", "broadleaf", "mediterranean"], w: 11, h: 9, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var trunk = env.col("#8a7458"), dk = env.col("#33582e"), md = env.col("#41703a");
      var cx = x + 5;
      P.px(cx, yb, trunk); P.px(cx - 1, yb - 1, trunk); P.px(cx + 1, yb - 1, trunk);
      P.rect(cx - 4, yb - 5, 9, 3, dk);
      P.rect(cx - 3, yb - 7, 7, 2, md);
      P.px(cx - 5, yb - 4, md); P.px(cx + 5, yb - 4, md);
      P.px(cx - 1, yb - 3, env.col("#5a3d5a"));                   // ripe figs in the shade
      P.px(cx + 2, yb - 4, env.col("#5a3d5a"));
    }
  },
  {
    // glossy tiers dripping with rain
    id: "rubber-tree", name: "Rubber tree", biomes: ["jungle"],
    tags: ["tree", "tropical", "glossy"], w: 11, h: 13, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var trunk = env.col("#6f5a44"), dk = env.col("#1f4f2c"), md = env.col("#2c6638"), gloss = env.col("#4a8a50");
      var cx = x + 5;
      P.rect(cx, yb - 5, 1, 5, trunk);
      P.px(cx - 1, yb - 2, trunk);
      P.rect(cx - 4, yb - 7, 9, 2, dk);
      P.rect(cx - 3, yb - 9, 7, 2, md);
      P.rect(cx - 2, yb - 11, 5, 2, dk);
      P.px(cx - 3, yb - 8, gloss); P.px(cx + 2, yb - 10, gloss); P.px(cx, yb - 6, gloss);
    }
  },
  {
    // the emergent giant above the canopy, buttress-rooted
    id: "kapok", name: "Kapok", biomes: ["jungle"],
    tags: ["tree", "tropical", "giant"], w: 13, h: 17, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var trunk = env.col("#8a8070"), shade = env.col("#6e6656"), dk = env.col("#2a5a30"), md = env.col("#3a7240");
      var cx = x + 6;
      P.rect(cx, yb - 11, 1, 11, trunk);
      P.px(cx - 1, yb, shade); P.px(cx + 1, yb, shade);          // buttress roots
      P.px(cx - 2, yb, trunk); P.px(cx + 2, yb, trunk);
      P.px(cx - 1, yb - 1, trunk); P.px(cx + 1, yb - 1, trunk);
      P.rect(cx - 6, yb - 13, 13, 2, dk);                        // wide flat umbrella
      P.rect(cx - 4, yb - 15, 9, 2, md);
      P.px(cx - 6, yb - 14, md); P.px(cx + 6, yb - 14, md);
      P.px(cx, yb - 16, md);
    }
  },
  {
    // royal poinciana: a scarlet umbrella
    id: "flame-tree", name: "Flame tree", biomes: ["savanna", "jungle", "coast"],
    tags: ["tree", "flowering", "scarlet"], w: 12, h: 12, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var s = Math.round(sway(env, 1.2));
      var trunk = env.col("#6f5844"), red = env.col("#c8452e"), hot = env.col("#e0603a"), dk = env.col("#a03424");
      var cx = x + 6;
      P.rect(cx, yb - 4, 1, 4, trunk);
      P.line(cx, yb - 4, cx - 3, yb - 7, trunk);
      P.line(cx, yb - 4, cx + 3, yb - 7, trunk);
      var gx = cx + s;
      P.rect(gx - 5, yb - 9, 11, 2, red);                        // the umbrella
      P.rect(gx - 3, yb - 11, 7, 2, dk);
      P.px(gx - 4, yb - 10, hot); P.px(gx + 2, yb - 10, hot); P.px(gx, yb - 8, hot);
    }
  },
  {
    // spiked rosettes on a short shaggy trunk
    id: "yucca", name: "Yucca", biomes: ["desert", "canyon"],
    tags: ["tree", "desert", "spiky"], w: 8, h: 8, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var bark = env.col("#8a6f4e"), spike = env.col("#6d8a42"), dk = env.col("#54702f"), bloom = env.col("#e6ddba");
      var cx = x + 4;
      P.rect(cx, yb - 3, 1, 3, bark);
      P.line(cx, yb - 3, cx - 3, yb - 5, spike);
      P.line(cx, yb - 3, cx + 3, yb - 5, dk);
      P.line(cx, yb - 4, cx - 2, yb - 6, dk);
      P.line(cx, yb - 4, cx + 2, yb - 6, spike);
      P.px(cx, yb - 6, bloom); P.px(cx, yb - 7, bloom);          // the flower stalk
    }
  },
  {
    // tall straight hardwood with a neat oval crown
    id: "tulip-poplar", name: "Tulip poplar", biomes: ["forest", "farmland"],
    tags: ["tree", "broadleaf", "tall"], w: 9, h: 15, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var s = Math.round(sway(env, 1.2));
      var trunk = env.col("#6a5642"), dk = env.col("#37652e"), md = env.col("#487c3a"), tulip = env.col("#d8c46a");
      var cx = x + 4;
      P.rect(cx, yb - 6, 1, 6, trunk);
      var gx = cx + s;
      P.rect(gx - 2, yb - 12, 5, 6, dk);
      P.rect(gx - 1, yb - 14, 3, 2, md);
      P.px(gx - 3, yb - 9, md); P.px(gx + 3, yb - 10, md);
      P.px(gx, yb - 11, tulip); P.px(gx - 2, yb - 13, tulip);    // the yellow cups
    }
  },
  {
    // melaleuca at the water's edge, papery pale bark
    id: "paperbark", name: "Paperbark", biomes: ["wetland", "coast", "lake"],
    tags: ["tree", "pale", "waterside"], w: 9, h: 12, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var bark = env.col("#d8cdb8"), peel = env.col("#b8a88e"), dk = env.col("#43683a"), md = env.col("#568047");
      var cx = x + 4;
      P.rect(cx, yb - 6, 1, 6, bark);
      P.px(cx, yb - 3, peel); P.px(cx, yb - 5, peel);            // peeling strips
      P.px(cx - 1, yb - 2, bark);
      P.disc(cx, yb - 8, 3, dk);
      P.disc(cx - 2, yb - 7, 2, md); P.disc(cx + 2, yb - 9, 2, md);
      P.px(cx, yb - 11, md);
    }
  }
];
