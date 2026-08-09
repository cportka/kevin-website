/* Animals batch D — small critters + insects.
   Ground layer (squirrel, hedgehog, pig, donkey, snake): feet on row yb, faces
   right, 2-frame walk from (env.frame>>2)&1; snake undulates as a wavy line.
   Air layer (bee, dragonfly, firefly, bat): anchor "center", wings flap with
   (env.frame>>1)&1. The bat only flies at night; the firefly is a moving glowing
   dot whose glow is a light source (never dimmed, brighter at night). Ground
   colours wrapped in env.col so they read at night; noses/eyes stay small accents.
   Biomes lean forest/plains/farmland/jungle/wetland/desert. Authored nose-right;
   the engine mirrors. */

export default [
  {
    id: "squirrel", name: "Squirrel", biomes: ["forest", "plains", "farmland", "jungle"],
    tags: ["animal", "tiny", "wild", "tail"], w: 7, h: 6, anchor: "baseline", layer: "ground", rarity: 1.1,
    draw: function (P, x, yb, env) {
      var body = env.col("#a5642e"), dark = env.col("#7a4620"), lite = env.col("#c99a6a");
      var st = (env.frame >> 2) & 1;
      // bushy tail curling up behind (left)
      P.rect(x, yb - 4, 2, 3, body);                       // tail rows yb-4..yb-2
      P.px(x, yb - 5, dark); P.px(x + 1, yb - 5, body); P.px(x + 2, yb - 5, dark); // curl over
      // body
      P.rect(x + 2, yb - 3, 3, 3, body);                   // rows yb-3..yb-1
      P.px(x + 3, yb - 1, lite);                           // belly highlight
      // head to the right
      P.px(x + 5, yb - 4, body); P.px(x + 5, yb - 3, body); // neck + head
      P.px(x + 6, yb - 3, body);                           // snout
      P.px(x + 5, yb - 5, dark);                           // ear
      P.px(x + 6, yb - 4, dark);                           // eye
      if (st) { P.px(x + 2, yb, dark); P.px(x + 4, yb, dark); }
      else { P.px(x + 3, yb, dark); P.px(x + 5, yb, dark); }
    }
  },
  {
    id: "hedgehog", name: "Hedgehog", biomes: ["forest", "plains", "farmland"],
    tags: ["animal", "tiny", "wild", "spiny"], w: 8, h: 5, anchor: "baseline", layer: "ground", rarity: 0.9,
    draw: function (P, x, yb, env) {
      var body = env.col("#8a6a48"), spike = env.col("#4a3826"), face = env.col("#c9a882");
      var st = (env.frame >> 2) & 1;
      // rounded body
      P.rect(x + 1, yb - 2, 5, 2, body);                   // rows yb-2, yb-1
      P.rect(x + 2, yb - 3, 3, 1, body);                   // hump row yb-3
      // spikes on the back
      P.px(x + 1, yb - 3, spike); P.px(x + 5, yb - 3, spike);
      P.px(x + 2, yb - 4, spike); P.px(x + 3, yb - 4, spike); P.px(x + 4, yb - 4, spike);
      // pointed face to the right
      P.px(x + 6, yb - 2, body); P.px(x + 6, yb - 1, face); // snout
      P.px(x + 5, yb - 2, spike);                          // eye
      if (st) { P.px(x + 2, yb, spike); P.px(x + 5, yb, spike); }
      else { P.px(x + 3, yb, spike); P.px(x + 4, yb, spike); }
    }
  },
  {
    id: "pig", name: "Pig", biomes: ["farmland", "plains"],
    tags: ["animal", "small", "farm"], w: 10, h: 6, anchor: "baseline", layer: "ground", rarity: 1.0,
    draw: function (P, x, yb, env) {
      var body = env.col("#e0a0a8"), dark = env.col("#b87078"), snout = env.col("#caa088");
      var st = (env.frame >> 2) & 1;
      // curly tail behind (left)
      P.px(x, yb - 4, dark); P.px(x, yb - 5, dark); P.px(x + 1, yb - 5, dark);
      // body
      P.rect(x + 1, yb - 4, 6, 2, body);                   // rows yb-4, yb-3
      P.rect(x + 2, yb - 2, 5, 1, body);                   // belly row yb-2
      // head to the right
      P.rect(x + 7, yb - 4, 2, 3, body);                   // rows yb-4..yb-2
      P.px(x + 7, yb - 5, dark);                           // ear
      P.px(x + 9, yb - 3, snout); P.px(x + 9, yb - 2, snout); // snout
      P.px(x + 8, yb - 4, dark);                           // eye
      // legs + walk
      P.px(x + 2, yb - 1, dark); P.px(x + 5, yb - 1, dark);
      if (st) { P.px(x + 2, yb, dark); P.px(x + 6, yb, dark); }
      else { P.px(x + 3, yb, dark); P.px(x + 5, yb, dark); }
    }
  },
  {
    id: "donkey", name: "Donkey", biomes: ["farmland", "plains", "desert"],
    tags: ["animal", "medium", "farm", "ears"], w: 11, h: 10, anchor: "baseline", layer: "ground", rarity: 0.8,
    draw: function (P, x, yb, env) {
      var body = env.col("#9a9088"), dark = env.col("#6a6058"), lite = env.col("#c2bab0");
      var st = (env.frame >> 2) & 1;
      // tail
      P.px(x, yb - 5, dark); P.px(x, yb - 4, dark); P.px(x + 1, yb - 3, dark);
      // body
      P.rect(x + 1, yb - 5, 6, 3, body);                   // rows yb-5..yb-3
      // neck + head
      P.rect(x + 7, yb - 7, 2, 3, body);                   // rows yb-7..yb-5
      P.px(x + 9, yb - 6, body);                           // muzzle base
      P.px(x + 10, yb - 6, lite);                          // muzzle tip
      P.px(x + 8, yb - 7, dark);                           // eye
      // long ears
      P.px(x + 7, yb - 8, dark); P.px(x + 7, yb - 9, dark);
      P.px(x + 8, yb - 9, dark);
      // mane
      P.px(x + 6, yb - 6, dark); P.px(x + 6, yb - 7, dark);
      // legs + walk
      P.rect(x + 1, yb - 2, 1, 2, dark); P.rect(x + 3, yb - 2, 1, 2, dark);
      P.rect(x + 5, yb - 2, 1, 2, dark); P.rect(x + 6, yb - 2, 1, 2, dark);
      if (st) { P.px(x + 1, yb, dark); P.px(x + 5, yb, dark); }
      else { P.px(x + 3, yb, dark); P.px(x + 6, yb, dark); }
    }
  },
  {
    id: "snake", name: "Snake", biomes: ["forest", "plains", "desert", "wetland", "jungle", "canyon"],
    tags: ["animal", "small", "wild", "reptile"], w: 13, h: 5, anchor: "baseline", layer: "ground", rarity: 0.8,
    draw: function (P, x, yb, env) {
      var body = env.col("#5a8a3a"), dark = env.col("#3d6626"), tongue = env.col("#c23a2a");
      var len = 10;
      var ph = env.frame * 0.25;
      var hy = yb - 1;
      // wavy body slithering along the ground
      for (var i = 0; i <= len; i++) {
        var yy = yb - 1 - Math.round(Math.sin(ph + i * 0.8) * 1.2 + 1.2);
        P.px(x + i, yy + 1, dark);                          // underside
        P.px(x + i, yy, body);                              // back
        if (i === len) hy = yy;
      }
      // head at the right end
      P.px(x + len + 1, hy, body);                          // snout
      P.px(x + len, hy - 1, dark);                          // eye ridge
      // flicking tongue
      if ((env.frame >> 2) & 1) { P.px(x + len + 2, hy, tongue); }
    }
  },
  {
    id: "bee", name: "Bee", biomes: ["plains", "farmland", "forest", "jungle", "wetland", "savanna", "mountain", "lake"],
    tags: ["animal", "air", "insect"], w: 6, h: 4, anchor: "center", layer: "air", rarity: 1.2,
    draw: function (P, x, y, env) {
      var body = env.col("#e8c23a"), dark = env.col("#2b2b25");
      var flap = (env.frame >> 1) & 1;
      // wings buzzing above the body
      P.withAlpha(0.7, function () {
        var wc = env.col("#d6e6f2");
        var wy = flap ? y - 2 : y - 1;
        P.px(x - 1, wy, wc); P.px(x, wy, wc);
      });
      // striped body
      P.px(x - 2, y, dark);                                 // stinger
      P.px(x - 1, y, body); P.px(x, y, dark); P.px(x + 1, y, body);
      P.px(x + 2, y, dark);                                 // head
      P.px(x + 2, y - 1, dark);                             // antenna nub
    }
  },
  {
    id: "dragonfly", name: "Dragonfly", biomes: ["wetland", "plains", "forest", "jungle", "lake", "canyon"],
    tags: ["animal", "air", "insect"], w: 8, h: 6, anchor: "center", layer: "air", rarity: 1.0,
    draw: function (P, x, y, env) {
      var body = env.col("#3aa88a"), dark = env.col("#237055");
      var flap = (env.frame >> 1) & 1;
      // slender body
      P.px(x - 3, y, dark); P.px(x - 2, y, body); P.px(x - 1, y, body);
      P.px(x, y, body); P.px(x + 1, y, dark);              // thorax
      P.px(x + 2, y, dark);                                // head
      P.px(x + 2, y - 1, dark);                            // eye
      // two pairs of gossamer wings
      P.withAlpha(0.6, function () {
        var wc = env.col("#cfe0ee");
        var wy = flap ? y - 2 : y - 1;
        P.px(x - 1, wy, wc); P.px(x, wy, wc); P.px(x + 1, wy, wc);
        var ly = flap ? y + 1 : y + 2;
        P.px(x - 1, ly, wc); P.px(x, ly, wc); P.px(x + 1, ly, wc);
      });
    }
  },
  {
    id: "firefly", name: "Firefly", biomes: ["forest", "plains", "farmland", "wetland", "jungle", "lake", "savanna"],
    tags: ["animal", "air", "insect", "glow"], w: 7, h: 7, anchor: "center", layer: "air", rarity: 1.1,
    draw: function (P, x, y, env) {
      var t = env.frame;
      var cx = x + Math.round(Math.cos(t * 0.11));
      var cy = y + Math.round(Math.sin(t * 0.19));
      // pulsing glow — a light source, never dimmed; brighter at night
      var core = env.night ? "#f2ff9a" : "#c2d070";
      if (env.night) {
        P.withAlpha(0.35, function () { P.disc(cx, cy, 2, "#e6ff7a"); });
      }
      P.px(cx, cy - 1, env.col("#2a2a20"));                // tiny body (dimmable)
      P.px(cx, cy, core);                                  // glowing abdomen
    }
  },
  {
    id: "bat", name: "Bat", biomes: ["forest", "jungle", "desert", "plains", "canyon", "savanna", "city"],
    tags: ["animal", "air", "night"], w: 8, h: 5, anchor: "center", layer: "air", rarity: 0.9,
    draw: function (P, x, y, env) {
      if (!env.night) return;                              // bats only fly at night
      var body = env.col("#4a4560"), wing = env.col("#3c3850");
      var flap = (env.frame >> 1) & 1;
      // body + ears
      P.px(x, y, body); P.px(x, y - 1, body);
      P.px(x - 1, y - 2, body); P.px(x + 1, y - 2, body);
      // wings flapping up / down
      if (flap) {
        P.px(x - 1, y - 1, wing); P.px(x - 2, y - 1, wing); P.px(x - 3, y - 2, wing);
        P.px(x + 1, y - 1, wing); P.px(x + 2, y - 1, wing); P.px(x + 3, y - 2, wing);
      } else {
        P.px(x - 1, y, wing); P.px(x - 2, y + 1, wing); P.px(x - 3, y + 1, wing);
        P.px(x + 1, y, wing); P.px(x + 2, y + 1, wing); P.px(x + 3, y + 1, wing);
      }
    }
  }
];
