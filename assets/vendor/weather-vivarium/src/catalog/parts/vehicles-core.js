/* Reference vehicles — the eight ported verbatim from the original LA beach
   widget. These define the idiom every other vehicle batch follows: wheels rest
   on row `yb`, the sprite faces right, `env.col` dims paint at night while
   headlights/glass stay bright. Window glass is a shared cyan. */

var W_ = "#bfe8ff"; // window glass

export default [
  {
    id: "pickup", name: "Pickup truck", biomes: ["coast", "city", "plains", "desert", "farmland", "forest", "mountain", "savanna"],
    tags: ["vehicle", "road", "truck"], w: 11, h: 7, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var col = env.col;
      P.rect(x, yb - 4, 11, 4, col("#3f7fae"));      // body
      P.rect(x + 5, yb - 6, 5, 2, col("#3f7fae"));   // cab (front-right)
      P.rect(x + 6, yb - 6, 3, 2, W_);               // windshield
      P.rect(x, yb - 3, 5, 1, col("#2b5c80"));       // bed (rear-left)
      P.px(x + 2, yb, "#111"); P.px(x + 8, yb, "#111");
      if (env.night) P.px(x + 10, yb - 2, "#fff2b0");
    }
  },
  {
    id: "semi", name: "Semi truck", biomes: ["coast", "city", "plains", "desert", "farmland", "mountain", "savanna"],
    tags: ["vehicle", "road", "truck", "big"], w: 20, h: 7, anchor: "baseline", rarity: 0.8,
    draw: function (P, x, yb, env) {
      var col = env.col;
      P.rect(x, yb - 6, 15, 6, col("#e6e6ea")); P.px(x + 14, yb - 6, "#888"); // trailer
      P.rect(x + 15, yb - 5, 5, 5, col("#c23b3b"));  // cab
      P.rect(x + 16, yb - 4, 3, 2, W_);
      P.px(x + 2, yb, "#111"); P.px(x + 8, yb, "#111"); P.px(x + 17, yb, "#111");
      if (env.night) P.px(x + 19, yb - 2, "#fff2b0");
    }
  },
  {
    id: "sports", name: "Sports car", biomes: ["coast", "city", "desert"],
    tags: ["vehicle", "road", "car", "fast"], w: 12, h: 5, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var col = env.col;
      P.rect(x, yb - 3, 12, 3, col("#e02a2a"));
      P.rect(x + 3, yb - 4, 6, 1, col("#e02a2a")); P.rect(x + 5, yb - 4, 4, 1, W_);
      if (!env.night) P.px(x + 11, yb - 3, "#ffd27a");
      P.px(x + 2, yb, "#111"); P.px(x + 9, yb, "#111");
      if (env.night) P.px(x + 11, yb - 2, "#fff2b0");
    }
  },
  {
    id: "hybrid", name: "Hybrid hatchback", biomes: ["coast", "city", "plains", "forest", "mountain"],
    tags: ["vehicle", "road", "car"], w: 11, h: 5, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var col = env.col;
      P.rect(x, yb - 4, 10, 4, col("#3aa06a")); P.rect(x + 2, yb - 5, 6, 2, W_);
      P.px(x + 2, yb, "#111"); P.px(x + 8, yb, "#111");
      if (env.night) P.px(x + 9, yb - 2, "#fff2b0");
    }
  },
  {
    id: "moto", name: "Motorcycle", biomes: ["coast", "city", "desert", "plains", "mountain"],
    tags: ["vehicle", "road", "bike"], w: 10, h: 5, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var col = env.col, night = env.night;
      var frameC = "#26262b", tank = col("#d23b3b"), jacket = col("#3a63b8"), skin = "#d7a26a", chrome = "#aab0b6";
      var wy = yb - 1;
      P.disc(x + 1, wy, 1, "#0c0c0c"); P.px(x + 1, wy, chrome);   // rear wheel
      P.disc(x + 8, wy, 1, "#0c0c0c"); P.px(x + 8, wy, chrome);   // front wheel
      P.rect(x + 2, wy - 1, 6, 1, frameC);                        // frame
      P.rect(x + 4, wy - 2, 2, 1, tank);
      P.px(x + 7, wy - 1, frameC); P.px(x + 8, wy - 2, chrome);
      P.px(x + 9, wy - 1, night ? "#fff2b0" : "#ffe6a0");         // headlight
      P.px(x + 3, wy - 1, jacket);
      P.px(x + 4, wy - 2, jacket); P.px(x + 5, wy - 2, jacket); P.px(x + 6, wy - 2, jacket);
      P.px(x + 5, wy - 3, skin);
      P.px(x + 5, wy - 4, night ? "#20202a" : "#22356a");
      P.px(x + 7, wy - 2, skin);
      P.px(x, wy - 1, "#7a1f1f");                                 // tail lamp
    }
  },
  {
    id: "logging", name: "Logging truck", biomes: ["forest", "mountain", "plains"],
    tags: ["vehicle", "road", "truck", "big"], w: 18, h: 7, anchor: "baseline", rarity: 0.7,
    draw: function (P, x, yb, env) {
      var col = env.col;
      P.rect(x, yb - 3, 13, 3, col("#4a3a28"));                   // log bed
      for (var i = 0; i < 4; i++) P.disc(x + 2 + i * 3, yb - 4, 1, col("#8a5a34"));
      P.rect(x + 13, yb - 5, 5, 5, col("#5a6b3a"));               // cab
      P.rect(x + 14, yb - 4, 3, 2, W_);
      P.px(x + 2, yb, "#111"); P.px(x + 8, yb, "#111"); P.px(x + 15, yb, "#111");
      if (env.night) P.px(x + 17, yb - 2, "#fff2b0");
    }
  },
  {
    id: "electric", name: "Electric car", biomes: ["coast", "city", "plains", "mountain", "forest"],
    tags: ["vehicle", "road", "car"], w: 11, h: 5, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var col = env.col;
      P.rect(x, yb - 4, 10, 4, col("#dfe8ee")); P.rect(x + 2, yb - 5, 6, 2, W_);
      P.px(x + 9, yb - 4, "#34e5ff"); P.px(x + 9, yb - 3, "#34e5ff");
      P.px(x + 2, yb, "#111"); P.px(x + 8, yb, "#111");
      if (env.night) P.px(x + 9, yb - 2, "#fff2b0");
    }
  },
  {
    id: "jalopy", name: "Rusty jalopy", biomes: ["coast", "city", "desert", "farmland", "plains"],
    tags: ["vehicle", "road", "car", "old"], w: 11, h: 6, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var col = env.col;
      P.rect(x, yb - 4, 11, 4, col("#8a6a3a")); P.rect(x + 4, yb - 5, 4, 2, W_);
      P.px(x + 2, yb - 4, "#6a4a24"); P.px(x + 8, yb - 4, "#6a4a24");
      if (!env.night && (env.frame >> 3) % 3 === 0) P.px(x - 1, yb - 5, "#9a9a9a"); // exhaust puff
      P.px(x + 2, yb, "#111"); P.px(x + 8, yb, "#111");
      if (env.night) P.px(x + 10, yb - 2, "#fff2b0");
    }
  }
];
