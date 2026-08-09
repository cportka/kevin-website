/* Vehicles batch A — ordinary urban/road traffic (layer:"road" by default).
   Follows the vehicles-core idiom exactly: wheels rest on row `yb`, nose faces
   right, `env.col` dims paint at night while glass / headlights / beacons stay
   bright. Emergency roof lights flash off env.frame. Window glass is the shared
   cyan W_ from the reference file. */

var W_ = "#bfe8ff"; // window glass

export default [
  {
    id: "sedan", name: "Sedan", biomes: ["city", "coast", "plains", "farmland", "savanna", "forest", "mountain"],
    tags: ["vehicle", "road", "car"], w: 12, h: 6, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var col = env.col;
      P.rect(x, yb - 4, 12, 4, col("#3f6fb0"));     // body
      P.rect(x + 3, yb - 6, 6, 2, col("#3f6fb0"));  // cabin
      P.rect(x + 4, yb - 6, 5, 1, W_);              // windows
      P.px(x + 6, yb - 6, col("#2c5290"));          // B-pillar (splits glass)
      P.rect(x, yb - 2, 12, 1, col("#2c5290"));     // lower trim
      P.px(x, yb - 3, "#7a1f1f");                   // tail lamp
      P.px(x + 2, yb, "#111"); P.px(x + 9, yb, "#111"); // wheels
      if (!env.night) P.px(x + 11, yb - 3, "#ffd27a");
      if (env.night) P.px(x + 11, yb - 2, "#fff2b0");
    }
  },
  {
    id: "suv", name: "SUV", biomes: ["city", "coast", "plains", "farmland", "mountain", "forest", "desert"],
    tags: ["vehicle", "road", "car", "big"], w: 13, h: 7, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var col = env.col;
      P.rect(x, yb - 5, 13, 5, col("#4a4f57"));     // tall body
      P.rect(x + 2, yb - 7, 9, 2, col("#4a4f57"));  // roof
      P.rect(x + 3, yb - 7, 8, 1, W_);              // windows
      P.px(x + 6, yb - 7, col("#31353b"));          // pillar
      P.rect(x, yb - 2, 13, 1, col("#2b2e33"));     // cladding
      P.px(x, yb - 4, "#7a1f1f");                   // tail lamp
      P.px(x + 2, yb, "#111"); P.px(x + 10, yb, "#111");
      if (!env.night) P.px(x + 12, yb - 4, "#ffd27a");
      if (env.night) P.px(x + 12, yb - 3, "#fff2b0");
    }
  },
  {
    id: "taxicab", name: "Taxicab", biomes: ["city", "coast"],
    tags: ["vehicle", "road", "car", "taxi"], w: 12, h: 7, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var col = env.col;
      P.rect(x, yb - 4, 12, 4, col("#f4c20d"));     // yellow body
      P.rect(x + 3, yb - 6, 6, 2, col("#f4c20d"));  // cabin
      P.rect(x + 4, yb - 6, 5, 1, W_);              // windows
      P.px(x + 6, yb - 6, col("#b8901f"));          // pillar
      for (var i = 0; i < 5; i++) P.px(x + 1 + i * 2, yb - 2, "#111"); // checker stripe
      P.rect(x + 5, yb - 7, 2, 1, "#ffe9a8");       // lit roof TAXI sign (not dimmed)
      P.px(x + 2, yb, "#111"); P.px(x + 9, yb, "#111");
      if (!env.night) P.px(x + 11, yb - 3, "#ffd27a");
      if (env.night) P.px(x + 11, yb - 2, "#fff2b0");
    }
  },
  {
    id: "citybus", name: "City bus", biomes: ["city", "coast"],
    tags: ["vehicle", "road", "bus", "big"], w: 20, h: 8, anchor: "baseline", rarity: 0.7,
    draw: function (P, x, yb, env) {
      var col = env.col;
      P.rect(x, yb - 8, 20, 8, col("#2f7d46"));            // long tall body
      P.rect(x + 1, yb - 6, 18, 3, col("#1f5730"));        // window band frame
      for (var i = 0; i < 4; i++) P.rect(x + 2 + i * 4, yb - 5, 3, 2, W_); // windows
      P.rect(x + 16, yb - 7, 3, 1, "#ffcf5a");             // lit destination sign
      P.px(x + 11, yb - 3, col("#12331d")); P.px(x + 11, yb - 2, col("#12331d")); // door seam
      P.rect(x, yb - 1, 20, 1, col("#173d24"));            // skirt
      P.px(x + 3, yb, "#111"); P.px(x + 4, yb, "#111");    // rear wheels
      P.px(x + 15, yb, "#111"); P.px(x + 16, yb, "#111");  // front wheels
      if (env.night) P.px(x + 19, yb - 2, "#fff2b0");
    }
  },
  {
    id: "minivan", name: "Minivan", biomes: ["city", "coast", "plains", "farmland", "savanna"],
    tags: ["vehicle", "road", "van"], w: 13, h: 7, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var col = env.col;
      P.rect(x, yb - 5, 13, 5, col("#8a3b3b"));     // body
      P.rect(x + 2, yb - 7, 9, 2, col("#8a3b3b"));  // roof
      P.rect(x + 3, yb - 7, 8, 1, W_);              // long window strip
      P.px(x + 7, yb - 7, col("#5f2828"));          // pillar
      P.px(x + 6, yb - 5, col("#5f2828")); P.px(x + 6, yb - 4, col("#5f2828")); P.px(x + 6, yb - 3, col("#5f2828")); // sliding door seam
      P.rect(x, yb - 2, 13, 1, col("#5f2828"));
      P.px(x, yb - 4, "#7a1f1f");                   // tail lamp
      P.px(x + 2, yb, "#111"); P.px(x + 10, yb, "#111");
      if (!env.night) P.px(x + 12, yb - 3, "#ffd27a");
      if (env.night) P.px(x + 12, yb - 2, "#fff2b0");
    }
  },
  {
    id: "ambulance", name: "Ambulance", biomes: ["city", "coast", "plains", "farmland"],
    tags: ["vehicle", "road", "emergency"], w: 14, h: 8, anchor: "baseline", rarity: 0.5,
    draw: function (P, x, yb, env) {
      var col = env.col, red = col("#d21f1f");
      var f = (env.frame >> 2) & 1;
      P.rect(x, yb - 6, 10, 6, col("#eef1f4"));     // rear box
      P.rect(x + 10, yb - 4, 4, 4, col("#eef1f4")); // cab
      P.rect(x + 11, yb - 3, 2, 2, W_);             // cab window
      P.rect(x, yb - 3, 10, 1, red);                // waist stripe
      P.px(x + 4, yb - 5, red);                                     // red cross
      P.px(x + 3, yb - 4, red); P.px(x + 4, yb - 4, red); P.px(x + 5, yb - 4, red);
      P.px(x + 1, yb - 7, f ? "#ff3030" : "#5a1010"); // flashing beacon
      P.px(x + 2, yb - 7, f ? "#5a1010" : "#ff3030");
      P.px(x, yb - 5, "#7a1f1f");                   // tail lamp
      P.px(x + 2, yb, "#111"); P.px(x + 11, yb, "#111");
      if (env.night) P.px(x + 13, yb - 2, "#fff2b0");
    }
  },
  {
    id: "police", name: "Police cruiser", biomes: ["city", "coast", "plains"],
    tags: ["vehicle", "road", "emergency"], w: 12, h: 7, anchor: "baseline", rarity: 0.5,
    draw: function (P, x, yb, env) {
      var col = env.col;
      var f = (env.frame >> 2) & 1;
      P.rect(x, yb - 4, 12, 4, col("#e9ecef"));     // white body
      P.rect(x + 3, yb - 6, 6, 2, col("#e9ecef"));  // cabin
      P.rect(x + 4, yb - 6, 5, 1, W_);              // windows
      P.px(x + 6, yb - 6, col("#7a7f85"));          // pillar
      P.rect(x + 4, yb - 4, 3, 2, col("#16181b"));  // black door panel
      P.rect(x, yb - 2, 12, 1, col("#16181b"));     // black rocker
      P.px(x + 5, yb - 7, "#111");                  // light-bar housing
      P.px(x + 4, yb - 7, f ? "#ff2424" : "#601414"); // red/blue flash
      P.px(x + 6, yb - 7, f ? "#14147a" : "#3a6bff");
      P.px(x + 2, yb, "#111"); P.px(x + 9, yb, "#111");
      if (env.night) P.px(x + 11, yb - 2, "#fff2b0");
    }
  },
  {
    id: "firetruck", name: "Fire truck", biomes: ["city", "coast", "plains"],
    tags: ["vehicle", "road", "emergency", "big"], w: 18, h: 8, anchor: "baseline", rarity: 0.5,
    draw: function (P, x, yb, env) {
      var col = env.col;
      var f = (env.frame >> 2) & 1;
      P.rect(x, yb - 6, 13, 6, col("#c11f1f"));     // pumper body
      P.rect(x + 13, yb - 5, 5, 5, col("#c11f1f")); // cab
      P.rect(x + 14, yb - 4, 3, 2, W_);             // cab window
      P.rect(x, yb - 3, 13, 1, col("#f2f2f2"));     // white waist stripe
      P.rect(x + 1, yb - 7, 10, 1, col("#c2c6cc"));  // ladder rail
      for (var i = 0; i < 5; i++) P.px(x + 2 + i * 2, yb - 8, col("#9aa0a6")); // rungs
      P.px(x + 15, yb - 6, f ? "#ff3030" : "#5a1010"); // flashing beacon
      P.px(x + 2, yb, "#111"); P.px(x + 7, yb, "#111"); P.px(x + 14, yb, "#111");
      if (env.night) P.px(x + 17, yb - 2, "#fff2b0");
    }
  },
  {
    id: "garbage-truck", name: "Garbage truck", biomes: ["city", "coast"],
    tags: ["vehicle", "road", "truck", "big"], w: 16, h: 8, anchor: "baseline", rarity: 0.6,
    draw: function (P, x, yb, env) {
      var col = env.col;
      P.rect(x, yb - 7, 11, 7, col("#4b7d5a"));     // hopper body
      P.rect(x + 1, yb - 8, 4, 1, col("#3a6247"));  // raised lid
      P.rect(x + 11, yb - 4, 5, 4, col("#3a6247")); // cab
      P.rect(x + 12, yb - 3, 3, 2, W_);             // cab window
      P.rect(x + 1, yb - 5, 9, 1, col("#3a6247"));  // rib
      P.rect(x + 1, yb - 3, 9, 1, col("#3a6247"));  // loader seam
      P.px(x + 3, yb, "#111"); P.px(x + 8, yb, "#111"); P.px(x + 13, yb, "#111");
      if (env.night) P.px(x + 15, yb - 2, "#fff2b0");
    }
  },
  {
    id: "delivery-van", name: "Delivery van", biomes: ["city", "coast", "plains", "farmland"],
    tags: ["vehicle", "road", "van"], w: 14, h: 7, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var col = env.col;
      P.rect(x, yb - 7, 9, 7, col("#e6e2da"));      // cargo box
      P.rect(x + 9, yb - 4, 5, 4, col("#e6e2da"));  // cab
      P.rect(x + 10, yb - 3, 3, 2, W_);             // cab window
      P.line(x + 4, yb - 7, x + 4, yb - 1, col("#b8b2a6")); // cargo door seam
      P.rect(x + 1, yb - 6, 3, 2, col("#c0392b"));  // livery panel
      P.rect(x, yb - 1, 9, 1, col("#b8b2a6"));      // rocker
      P.px(x, yb - 5, "#7a1f1f");                   // tail lamp
      P.px(x + 2, yb, "#111"); P.px(x + 11, yb, "#111");
      if (!env.night) P.px(x + 13, yb - 3, "#ffd27a");
      if (env.night) P.px(x + 13, yb - 2, "#fff2b0");
    }
  },
  {
    id: "convertible", name: "Convertible", biomes: ["coast", "city", "desert", "savanna"],
    tags: ["vehicle", "road", "car", "open"], w: 12, h: 5, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var col = env.col;
      P.rect(x, yb - 3, 12, 3, col("#1f9e8a"));     // low body
      P.rect(x + 3, yb - 4, 6, 1, col("#124f45"));  // open cockpit rim / interior
      P.px(x + 5, yb - 5, "#d7a26a");               // driver head
      P.px(x + 9, yb - 4, "#cfe9f0"); P.px(x + 9, yb - 5, col("#9ac6d2")); // windshield frame
      P.px(x, yb - 3, "#7a1f1f");                   // tail lamp
      P.px(x + 2, yb, "#111"); P.px(x + 9, yb, "#111");
      if (!env.night) P.px(x + 11, yb - 3, "#ffd27a");
      if (env.night) P.px(x + 11, yb - 2, "#fff2b0");
    }
  }
];
