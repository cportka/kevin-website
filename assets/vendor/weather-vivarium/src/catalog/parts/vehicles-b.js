/* Vehicles batch B — rural/work + fun rigs, following the vehicles-core idiom:
   wheels rest on row `yb`, sprite faces right (+x is the nose), `env.col` dims
   paint at night while headlights/beacons/serving-window glow stay bright.
   Shared cyan window glass = W_. Moving parts (mixer drum, combine reel, plow
   curl, buggy rooster-tail) animate off env.frame. */

var W_ = "#bfe8ff"; // window glass

export default [
  {
    id: "tractor", name: "Tractor", biomes: ["farmland", "plains", "savanna", "forest"],
    tags: ["vehicle", "road", "farm"], w: 12, h: 9, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var col = env.col;
      var green = col("#3a7d2c"), dark = col("#245018"), tire = "#141414", chrome = col("#c9c9c9");
      // big rear drive wheel
      P.disc(x + 3, yb - 3, 3, tire);
      P.disc(x + 3, yb - 3, 1, chrome);
      if ((env.frame >> 2) & 1) { P.px(x + 3, yb - 5, dark); P.px(x + 3, yb - 1, dark); }
      else { P.px(x + 1, yb - 3, dark); P.px(x + 5, yb - 3, dark); }
      // small front wheel
      P.disc(x + 9, yb - 1, 1, tire); P.px(x + 9, yb - 1, chrome);
      // hood / engine block (front)
      P.rect(x + 6, yb - 4, 5, 3, green);
      P.rect(x + 6, yb - 4, 5, 1, dark);
      // cab over the rear wheel
      P.rect(x + 2, yb - 8, 5, 4, green);
      P.rect(x + 3, yb - 7, 3, 2, W_);
      // exhaust stack + puff
      P.rect(x + 7, yb - 8, 1, 4, "#2a2a2a");
      if (!env.night && (env.frame >> 3) % 2 === 0) P.px(x + 7, yb - 9, "#9a9a9a");
      // headlight
      P.px(x + 11, yb - 3, env.night ? "#fff2b0" : "#ffe6a0");
    }
  },
  {
    id: "combine", name: "Combine harvester", biomes: ["farmland", "plains", "savanna"],
    tags: ["vehicle", "road", "farm", "big"], w: 18, h: 11, anchor: "baseline", rarity: 0.7,
    draw: function (P, x, yb, env) {
      var col = env.col;
      var body = col("#6fae2c"), dark = col("#3f6f18"), yel = col("#d4a017"), tire = "#141414", chrome = col("#c9c9c9");
      // rear steer wheel
      P.disc(x + 2, yb - 1, 1, tire); P.px(x + 2, yb - 1, chrome);
      // main grain body
      P.rect(x + 1, yb - 7, 11, 6, body);
      P.rect(x + 1, yb - 7, 11, 1, dark);
      P.px(x + 3, yb - 5, dark); P.px(x + 6, yb - 5, dark); P.px(x + 9, yb - 5, dark);
      // cab (front-top)
      P.rect(x + 8, yb - 10, 4, 3, body);
      P.rect(x + 9, yb - 9, 3, 2, W_);
      // big drive wheel
      P.disc(x + 11, yb - 3, 3, tire);
      P.disc(x + 11, yb - 3, 1, chrome);
      if ((env.frame >> 2) & 1) { P.px(x + 11, yb - 5, col("#888")); P.px(x + 11, yb - 1, col("#888")); }
      else { P.px(x + 9, yb - 3, col("#888")); P.px(x + 13, yb - 3, col("#888")); }
      // header platform (front)
      P.rect(x + 13, yb - 2, 5, 2, yel);
      P.px(x + 17, yb - 2, dark);
      // spinning reel above header
      var rx = x + 15, ry = yb - 5;
      P.disc(rx, ry, 1, col("#8a6a2a"));
      if ((env.frame >> 2) & 1) { P.px(rx, ry - 1, yel); P.px(rx, ry + 1, yel); P.px(rx - 1, ry, yel); P.px(rx + 1, ry, yel); }
      else { P.px(rx - 1, ry - 1, yel); P.px(rx + 1, ry - 1, yel); P.px(rx - 1, ry + 1, yel); P.px(rx + 1, ry + 1, yel); }
      P.line(x + 13, yb - 2, rx, ry, dark);
      if (env.night) P.px(x + 12, yb - 8, "#fff2b0");
    }
  },
  {
    id: "tanker", name: "Tanker truck", biomes: ["desert", "plains", "farmland", "city", "savanna"],
    tags: ["vehicle", "road", "truck", "big"], w: 19, h: 7, anchor: "baseline", rarity: 0.7,
    draw: function (P, x, yb, env) {
      var col = env.col;
      var tank = col("#cfd4d8"), band = col("#9aa0a6"), cab = col("#2f6fae"), tire = "#111";
      // cylindrical tank
      P.rect(x, yb - 5, 14, 4, tank);
      P.px(x, yb - 5, band); P.px(x, yb - 2, band);
      P.px(x + 13, yb - 5, band); P.px(x + 13, yb - 2, band);
      P.rect(x + 4, yb - 5, 1, 4, band); P.rect(x + 9, yb - 5, 1, 4, band);
      P.px(x + 6, yb - 6, band); // dome hatch
      // cab
      P.rect(x + 14, yb - 5, 5, 5, cab);
      P.rect(x + 15, yb - 4, 3, 2, W_);
      // wheels
      P.px(x + 3, yb, tire); P.px(x + 6, yb, tire); P.px(x + 10, yb, tire); P.px(x + 16, yb, tire);
      if (env.night) P.px(x + 18, yb - 2, "#fff2b0");
    }
  },
  {
    id: "cement-mixer", name: "Cement mixer", biomes: ["city", "plains", "desert", "farmland"],
    tags: ["vehicle", "road", "truck", "big"], w: 16, h: 9, anchor: "baseline", rarity: 0.7,
    draw: function (P, x, yb, env) {
      var col = env.col;
      var drum = col("#c98a2a"), drum2 = col("#7a4f12"), cab = col("#c23b3b"), tire = "#111", chassis = col("#3a3a40");
      // chassis
      P.rect(x, yb - 2, 16, 2, chassis);
      // rotating drum
      var cx = x + 5, cy = yb - 5, r = 4;
      P.disc(cx, cy, r, drum);
      var a = env.frame * 0.25;
      var dx = Math.round(Math.cos(a) * (r - 1)), dy = Math.round(Math.sin(a) * (r - 1));
      P.line(cx - dx, cy - dy, cx + dx, cy + dy, drum2);
      var dx2 = Math.round(Math.cos(a + 1.57) * (r - 1)), dy2 = Math.round(Math.sin(a + 1.57) * (r - 1));
      P.line(cx - dx2, cy - dy2, cx + dx2, cy + dy2, drum2);
      P.disc(cx, cy, 1, drum2);
      // pour chute at back
      P.rect(x, yb - 5, 1, 3, drum2);
      // cab (front)
      P.rect(x + 11, yb - 5, 5, 3, cab);
      P.rect(x + 12, yb - 4, 3, 2, W_);
      // wheels
      P.px(x + 3, yb, tire); P.px(x + 6, yb, tire); P.px(x + 12, yb, tire);
      if (env.night) P.px(x + 15, yb - 2, "#fff2b0");
    }
  },
  {
    id: "tow-truck", name: "Tow truck", biomes: ["city", "plains", "desert", "mountain", "forest"],
    tags: ["vehicle", "road", "truck"], w: 14, h: 8, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var col = env.col;
      var body = col("#d98a1a"), boom = col("#555"), tire = "#111", hook = col("#9aa0a6");
      // body
      P.rect(x + 2, yb - 4, 12, 4, body);
      // cab (front)
      P.rect(x + 9, yb - 6, 5, 2, body);
      P.rect(x + 10, yb - 6, 3, 2, W_);
      // amber beacon (light source — blinks at night, steady by day)
      var beacon = env.night ? (((env.frame >> 2) & 1) ? "#ffb020" : "#5a3c0a") : "#ffb020";
      P.px(x + 11, yb - 7, beacon);
      // boom arm reaching back + hook cable
      P.line(x + 6, yb - 5, x + 1, yb - 7, boom);
      P.line(x + 1, yb - 7, x + 1, yb - 4, hook);
      P.px(x + 1, yb - 3, hook);
      // wheels
      P.px(x + 4, yb, tire); P.px(x + 11, yb, tire);
      if (env.night) P.px(x + 13, yb - 2, "#fff2b0");
    }
  },
  {
    id: "flatbed", name: "Flatbed truck", biomes: ["plains", "farmland", "city", "desert", "forest"],
    tags: ["vehicle", "road", "truck", "big"], w: 16, h: 7, anchor: "baseline", rarity: 0.8,
    draw: function (P, x, yb, env) {
      var col = env.col;
      var cab = col("#2f5580"), bed = col("#5a4a34"), crate = col("#b08a4a"), crate2 = col("#8a6a34"), tire = "#111";
      // flat bed + chassis
      P.rect(x, yb - 3, 11, 1, bed);
      P.rect(x, yb - 2, 11, 2, col("#2a2a30"));
      // cargo crates
      P.rect(x + 1, yb - 6, 3, 3, crate); P.px(x + 1, yb - 5, crate2);
      P.rect(x + 5, yb - 5, 3, 2, crate); P.px(x + 5, yb - 4, crate2);
      // cab (front)
      P.rect(x + 11, yb - 5, 5, 5, cab);
      P.rect(x + 12, yb - 4, 3, 2, W_);
      // wheels
      P.px(x + 2, yb, tire); P.px(x + 6, yb, tire); P.px(x + 13, yb, tire);
      if (env.night) P.px(x + 15, yb - 2, "#fff2b0");
    }
  },
  {
    id: "jeep", name: "Jeep", biomes: ["desert", "mountain", "forest", "savanna", "plains"],
    tags: ["vehicle", "road", "car", "offroad"], w: 12, h: 6, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var col = env.col;
      var body = col("#5a7d3a"), dark = col("#3f5a24"), tire = "#141414", skin = "#d7a26a", chrome = col("#bbb");
      // open body tub
      P.rect(x + 1, yb - 3, 10, 3, body);
      P.rect(x + 1, yb - 1, 10, 1, dark);
      // grille (front)
      P.px(x + 10, yb - 3, dark); P.px(x + 10, yb - 2, dark);
      // flat windshield (front)
      P.rect(x + 6, yb - 5, 3, 2, col("#8a8a8a"));
      P.rect(x + 6, yb - 5, 3, 1, W_);
      // rear roll hoop
      P.px(x + 3, yb - 5, dark); P.px(x + 4, yb - 6, dark); P.px(x + 5, yb - 6, dark); P.px(x + 6, yb - 6, dark);
      // driver
      P.px(x + 4, yb - 4, "#c23b3b"); P.px(x + 4, yb - 5, skin);
      // offroad wheels
      P.disc(x + 3, yb - 1, 1, tire); P.px(x + 3, yb - 1, chrome);
      P.disc(x + 9, yb - 1, 1, tire); P.px(x + 9, yb - 1, chrome);
      if (env.night) P.px(x + 11, yb - 3, "#fff2b0");
    }
  },
  {
    id: "dune-buggy", name: "Dune buggy", biomes: ["desert", "coast", "savanna", "canyon"],
    tags: ["vehicle", "road", "car", "offroad", "fun"], w: 12, h: 6, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var col = env.col;
      var body = col("#e08a1a"), frame = col("#444"), tire = "#141414", chrome = col("#ccc"), skin = "#d7a26a", sand = col("#e8d29a");
      // seat pod
      P.rect(x + 3, yb - 3, 5, 2, body);
      // engine at back
      P.px(x + 1, yb - 3, frame); P.px(x + 2, yb - 3, frame);
      // roll cage
      P.line(x + 2, yb - 2, x + 3, yb - 5, frame);
      P.line(x + 3, yb - 5, x + 7, yb - 5, frame);
      P.line(x + 7, yb - 5, x + 8, yb - 2, frame);
      // driver
      P.px(x + 5, yb - 4, skin);
      // big rear wheel, smaller front
      P.disc(x + 2, yb - 2, 2, tire); P.px(x + 2, yb - 2, chrome);
      P.disc(x + 9, yb - 1, 1, tire); P.px(x + 9, yb - 1, chrome);
      // rooster-tail of kicked-up sand (fun, animated)
      if ((env.frame >> 2) & 1) { P.px(x, yb - 4, sand); P.px(x + 1, yb - 5, sand); }
      if (env.night) P.px(x + 11, yb - 3, "#fff2b0");
    }
  },
  {
    id: "snowplow", name: "Snowplow", biomes: ["tundra", "mountain", "city", "plains", "forest"],
    tags: ["vehicle", "road", "truck"], w: 15, h: 8, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var col = env.col;
      var body = col("#d9a520"), dark = col("#a5780c"), tire = "#111", blade = col("#d64b3b"), snow = "#eef4fb";
      // dump body
      P.rect(x, yb - 5, 9, 5, body);
      P.rect(x, yb - 5, 9, 1, dark);
      // cab (front)
      P.rect(x + 9, yb - 6, 4, 6, body);
      P.rect(x + 10, yb - 5, 3, 2, W_);
      P.px(x + 12, yb - 5, env.night ? "#fff2b0" : "#ffe6a0"); // headlight glint
      // amber beacon (light source)
      P.px(x + 10, yb - 7, "#ffb020");
      // angled plow blade (front)
      P.line(x + 13, yb - 1, x + 14, yb - 4, blade);
      P.px(x + 13, yb, blade); P.px(x + 14, yb - 4, blade);
      // pushed snow curl (animated)
      if ((env.frame >> 2) & 1) { P.px(x + 14, yb, snow); P.px(x + 14, yb - 1, snow); }
      else { P.px(x + 14, yb - 1, snow); P.px(x + 13, yb, snow); }
      // wheels
      P.px(x + 2, yb, tire); P.px(x + 5, yb, tire); P.px(x + 11, yb, tire);
    }
  },
  {
    id: "food-truck", name: "Food truck", biomes: ["city", "coast", "plains", "farmland", "savanna"],
    tags: ["vehicle", "road", "truck", "fun", "food"], w: 15, h: 9, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var col = env.col;
      var body = col("#e85d9a"), roof = col("#c43f7a"), tire = "#111", awning = col("#f2f2f4");
      // box body
      P.rect(x, yb - 7, 11, 7, body);
      P.rect(x, yb - 7, 11, 1, roof);
      // cab (front)
      P.rect(x + 11, yb - 5, 4, 5, body);
      P.rect(x + 12, yb - 4, 2, 2, W_);
      // serving window (warm interior glow — light source, not dimmed)
      P.rect(x + 2, yb - 5, 6, 3, "#fff4c2");
      P.px(x + 3, yb - 4, "#caa24a"); P.px(x + 6, yb - 4, "#caa24a"); // counter fare
      // striped awning above the window
      for (var i = 0; i < 6; i++) P.px(x + 2 + i, yb - 6, (i & 1) ? awning : roof);
      // little menu board
      P.px(x + 1, yb - 6, roof);
      // wheels
      P.px(x + 3, yb, tire); P.px(x + 8, yb, tire); P.px(x + 12, yb, tire);
      if (env.night) P.px(x + 14, yb - 2, "#fff2b0");
    }
  },
  {
    id: "vintage-bus", name: "Vintage bus", biomes: ["city", "coast", "plains", "forest", "mountain", "farmland"],
    tags: ["vehicle", "road", "bus", "fun", "retro"], w: 18, h: 9, anchor: "baseline", rarity: 0.8,
    draw: function (P, x, yb, env) {
      var col = env.col;
      var body = col("#2f9e8f"), cream = col("#e8e4cf"), tire = "#141414", chrome = col("#bbb"), door = col("#1f6f64");
      // body
      P.rect(x, yb - 8, 18, 6, body);
      P.rect(x, yb - 4, 18, 1, cream);              // cream side stripe
      P.rect(x + 1, yb - 2, 16, 1, "#1a1a1a");      // underframe
      // window row
      for (var i = 0; i < 5; i++) P.rect(x + 1 + i * 3, yb - 7, 2, 2, W_);
      // front windshield (right)
      P.rect(x + 16, yb - 7, 1, 2, W_);
      // destination sign (lit)
      P.rect(x + 14, yb - 8, 3, 1, "#ffcf6a");
      // door seam
      P.px(x + 15, yb - 4, door); P.px(x + 15, yb - 3, door);
      // wheels
      P.disc(x + 3, yb - 1, 1, tire); P.px(x + 3, yb - 1, chrome);
      P.disc(x + 14, yb - 1, 1, tire); P.px(x + 14, yb - 1, chrome);
      if (env.night) P.px(x + 17, yb - 3, "#fff2b0");
    }
  }
];
