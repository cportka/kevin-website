/* Vehicles batch D — world + novelty road rigs, following the vehicles-core
   idiom: wheels rest on row `yb`, sprite faces right (+x is the nose), `env.col`
   dims paint at night while headlights / glass / neon / serving-window glow stay
   bright. Shared cyan window glass = W_. Moving parts (rickshaw legs, ice-cream
   jingle marquee, monster-truck rims) animate off env.frame. All layer:"road". */

var W_ = "#bfe8ff"; // window glass

export default [
  {
    id: "tuk-tuk", name: "Tuk-tuk", biomes: ["jungle", "city", "coast"],
    tags: ["vehicle", "road", "fun", "three-wheel"], w: 11, h: 8, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var col = env.col;
      var body = col("#1f9e8a"), roof = col("#f4c20d"), tire = "#141414", chrome = col("#bbb"), dark = col("#124f45");
      // passenger cabin body (rear-left, over the two rear wheels)
      P.rect(x + 1, yb - 4, 8, 4, body);
      // canopy roof + posts
      P.rect(x, yb - 7, 8, 1, roof);
      P.px(x, yb - 6, roof); P.px(x + 7, yb - 6, roof);
      // open passenger seat (dark interior)
      P.rect(x + 1, yb - 6, 5, 2, dark);
      // driver bay + little windshield (front-right)
      P.rect(x + 6, yb - 6, 2, 2, body);
      P.rect(x + 6, yb - 6, 2, 1, W_);
      // scooter-style nose reaching to the single front wheel
      P.px(x + 9, yb - 4, body); P.px(x + 9, yb - 3, body);
      // two rear wheels (a hair apart → reads as a three-wheeler)
      P.disc(x + 2, yb - 1, 1, tire); P.px(x + 2, yb - 1, chrome);
      P.disc(x + 4, yb - 1, 1, tire); P.px(x + 4, yb - 1, chrome);
      // single front wheel
      P.disc(x + 9, yb - 1, 1, tire); P.px(x + 9, yb - 1, chrome);
      P.px(x + 10, yb - 3, env.night ? "#fff2b0" : "#ffe6a0"); // headlight
    }
  },
  {
    id: "rickshaw", name: "Cycle rickshaw", biomes: ["jungle", "city", "coast"],
    tags: ["vehicle", "road", "fun", "pedal"], w: 12, h: 9, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var col = env.col;
      var canopy = col("#c0392b"), seat = col("#7a4a2a"), frame = col("#555"), tire = "#141414", chrome = col("#bbb"), skin = "#d7a26a", shirt = col("#3a63b8");
      var f = (env.frame >> 2) & 1;
      // big rear passenger wheel + small front wheel
      P.disc(x + 3, yb - 2, 2, tire); P.px(x + 3, yb - 2, chrome);
      P.disc(x + 10, yb - 1, 1, tire); P.px(x + 10, yb - 1, chrome);
      // passenger seat box over the rear wheel
      P.rect(x + 1, yb - 6, 6, 3, seat);
      // curved fringed canopy
      P.rect(x, yb - 8, 7, 1, canopy);
      P.px(x, yb - 7, canopy); P.px(x + 6, yb - 7, canopy);
      // frame bar to the cyclist up front
      P.line(x + 5, yb - 3, x + 9, yb - 2, frame);
      P.px(x + 10, yb - 4, frame); // handlebar
      // cyclist
      P.px(x + 8, yb - 6, skin);          // head
      P.rect(x + 8, yb - 5, 1, 2, shirt); // torso
      // pedalling legs (2-frame)
      if (f) { P.px(x + 8, yb - 3, skin); P.px(x + 9, yb - 2, skin); }
      else { P.px(x + 9, yb - 3, skin); P.px(x + 8, yb - 2, skin); }
    }
  },
  {
    id: "scooter", name: "Motor scooter", biomes: ["city", "coast", "plains", "jungle", "savanna"],
    tags: ["vehicle", "road", "bike"], w: 9, h: 6, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var col = env.col, night = env.night;
      var body = col("#3fa7c4"), frame = col("#333"), chrome = col("#aab0b6"), skin = "#d7a26a", helmet = col("#d23b3b"), jacket = col("#e8e4cf");
      var wy = yb - 1;
      // small wheels
      P.disc(x + 1, wy, 1, "#0c0c0c"); P.px(x + 1, wy, chrome); // rear
      P.disc(x + 7, wy, 1, "#0c0c0c"); P.px(x + 7, wy, chrome); // front
      // rounded rear cowl + step-through floor
      P.rect(x, wy - 2, 3, 2, body);
      P.rect(x + 3, wy - 1, 3, 1, frame);
      // front leg-shield rising to the bars
      P.px(x + 6, wy - 2, body); P.px(x + 6, wy - 3, body);
      P.px(x + 7, wy - 3, frame);                              // handlebar
      P.px(x + 7, wy - 2, night ? "#fff2b0" : "#ffe6a0");      // headlight
      // rider
      P.px(x + 3, wy - 2, jacket);
      P.rect(x + 3, wy - 3, 2, 1, jacket); // torso
      P.px(x + 4, wy - 4, helmet);         // helmet
      P.px(x + 5, wy - 3, skin);           // arm to bars
    }
  },
  {
    id: "double-decker", name: "Double-decker bus", biomes: ["city", "coast"],
    tags: ["vehicle", "road", "bus", "big"], w: 20, h: 12, anchor: "baseline", rarity: 0.7,
    draw: function (P, x, yb, env) {
      var col = env.col;
      var body = col("#d21f1f"), dark = col("#8f1414"), tire = "#141414", chrome = col("#bbb"), roof = col("#b81a1a");
      // tall two-storey body
      P.rect(x, yb - 11, 20, 10, body);
      P.rect(x, yb - 11, 20, 1, roof);
      // upper + lower window rows
      for (var i = 0; i < 5; i++) P.rect(x + 2 + i * 3, yb - 10, 2, 2, W_);
      for (var j = 0; j < 5; j++) P.rect(x + 2 + j * 3, yb - 6, 2, 2, W_);
      // front windshields (right, both decks)
      P.rect(x + 17, yb - 10, 2, 2, W_);
      P.rect(x + 17, yb - 6, 2, 2, W_);
      // lit route-number box
      P.rect(x + 17, yb - 11, 2, 1, "#ffcf5a");
      // door seam + skirt
      P.px(x + 15, yb - 4, dark); P.px(x + 15, yb - 3, dark); P.px(x + 15, yb - 2, dark);
      P.rect(x, yb - 1, 20, 1, dark);
      // wheels
      P.disc(x + 4, yb - 1, 1, tire); P.px(x + 4, yb - 1, chrome);
      P.disc(x + 15, yb - 1, 1, tire); P.px(x + 15, yb - 1, chrome);
      if (env.night) P.px(x + 19, yb - 3, "#fff2b0");
    }
  },
  {
    id: "minibus", name: "Minibus", biomes: ["city", "coast", "plains", "farmland", "savanna", "mountain"],
    tags: ["vehicle", "road", "bus"], w: 16, h: 8, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var col = env.col;
      var body = col("#e0b23a"), dark = col("#b0861f"), tire = "#141414", chrome = col("#bbb"), stripe = col("#e8e4cf");
      // body + roof cap
      P.rect(x, yb - 7, 16, 6, body);
      P.rect(x, yb - 7, 16, 1, dark);
      // window band
      P.rect(x + 1, yb - 6, 14, 2, dark);
      for (var i = 0; i < 4; i++) P.rect(x + 2 + i * 3, yb - 6, 2, 2, W_);
      P.rect(x + 13, yb - 6, 2, 2, W_);   // front windshield
      // side stripe + door seam
      P.rect(x, yb - 3, 16, 1, stripe);
      P.px(x + 10, yb - 3, dark); P.px(x + 10, yb - 2, dark);
      // wheels
      P.disc(x + 3, yb - 1, 1, tire); P.px(x + 3, yb - 1, chrome);
      P.disc(x + 12, yb - 1, 1, tire); P.px(x + 12, yb - 1, chrome);
      if (!env.night) P.px(x + 15, yb - 4, "#ffd27a");
      if (env.night) P.px(x + 15, yb - 2, "#fff2b0");
    }
  },
  {
    id: "camper-van", name: "Camper van", biomes: ["coast", "forest", "mountain", "desert", "plains", "savanna"],
    tags: ["vehicle", "road", "van", "fun", "retro"], w: 15, h: 10, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var col = env.col;
      var lower = col("#e8e4cf"), upper = col("#e07b3a"), tire = "#141414", chrome = col("#bbb"), curtain = col("#c94f6d");
      // two-tone body
      P.rect(x, yb - 4, 15, 4, lower);
      P.rect(x, yb - 7, 15, 3, upper);
      // raised pop-top with canvas folds (rear)
      P.rect(x + 1, yb - 9, 8, 2, col("#d9d2bd"));
      P.px(x + 1, yb - 8, col("#9a9483")); P.px(x + 4, yb - 8, col("#9a9483"));
      // curtained side windows
      P.rect(x + 2, yb - 6, 3, 2, W_); P.px(x + 2, yb - 6, curtain);
      P.rect(x + 6, yb - 6, 3, 2, W_); P.px(x + 8, yb - 6, curtain);
      // cab windshield + round nose emblem
      P.rect(x + 11, yb - 6, 3, 2, W_);
      P.px(x + 14, yb - 5, chrome);
      // chrome bumper
      P.rect(x, yb - 1, 15, 1, chrome);
      // wheels
      P.disc(x + 3, yb - 1, 1, tire); P.px(x + 3, yb - 1, chrome);
      P.disc(x + 11, yb - 1, 1, tire); P.px(x + 11, yb - 1, chrome);
      if (!env.night) P.px(x + 14, yb - 3, "#ffd27a");
      if (env.night) P.px(x + 14, yb - 2, "#fff2b0");
    }
  },
  {
    id: "hearse", name: "Hearse", biomes: ["city", "coast"],
    tags: ["vehicle", "road", "car"], w: 16, h: 6, anchor: "baseline", rarity: 0.4,
    draw: function (P, x, yb, env) {
      var col = env.col;
      var body = col("#1a1a1f"), trim = col("#3a3a42"), tire = "#141414", chrome = col("#c9c9c9"), glass = col("#8fb8c9"), coffin = col("#6a4a2a");
      // long low body
      P.rect(x, yb - 4, 16, 4, body);
      // raised coffin compartment (rear) with long window
      P.rect(x + 1, yb - 6, 8, 2, body);
      P.rect(x + 1, yb - 5, 7, 1, glass);
      P.px(x + 3, yb - 5, coffin); P.px(x + 5, yb - 5, coffin); // casket hint
      // driver cabin (front-right)
      P.rect(x + 9, yb - 6, 5, 2, body);
      P.rect(x + 10, yb - 5, 3, 1, W_);
      P.px(x + 8, yb - 5, trim);   // B-pillar
      // chrome beltline
      P.rect(x, yb - 2, 16, 1, trim);
      P.px(x, yb - 3, "#7a1f1f");  // tail lamp
      // wheels
      P.disc(x + 3, yb - 1, 1, tire); P.px(x + 3, yb - 1, chrome);
      P.disc(x + 12, yb - 1, 1, tire); P.px(x + 12, yb - 1, chrome);
      if (!env.night) P.px(x + 15, yb - 3, "#ffd27a");
      if (env.night) P.px(x + 15, yb - 2, "#fff2b0");
    }
  },
  {
    id: "stretch-limo", name: "Stretch limo", biomes: ["city", "coast"],
    tags: ["vehicle", "road", "car", "big"], w: 22, h: 5, anchor: "baseline", rarity: 0.4,
    draw: function (P, x, yb, env) {
      var col = env.col;
      var body = col("#15151a"), trim = col("#8a8a92"), tint = col("#3a4a55"), tire = "#141414", chrome = col("#c9c9c9");
      // very long low body + raised roofline
      P.rect(x, yb - 4, 22, 4, body);
      P.rect(x + 3, yb - 5, 16, 1, body);
      // row of tinted privacy windows
      for (var i = 0; i < 6; i++) P.rect(x + 4 + i * 2, yb - 4, 1, 1, tint);
      P.rect(x + 18, yb - 4, 2, 1, W_); // front windshield
      // chrome beltline
      P.rect(x, yb - 2, 22, 1, trim);
      P.px(x, yb - 3, "#7a1f1f");       // tail lamp
      // three axles
      P.disc(x + 3, yb - 1, 1, tire); P.px(x + 3, yb - 1, chrome);
      P.disc(x + 11, yb - 1, 1, tire); P.px(x + 11, yb - 1, chrome);
      P.disc(x + 18, yb - 1, 1, tire); P.px(x + 18, yb - 1, chrome);
      if (!env.night) P.px(x + 21, yb - 3, "#ffd27a");
      if (env.night) P.px(x + 21, yb - 2, "#fff2b0");
    }
  },
  {
    id: "golf-cart", name: "Golf cart", biomes: ["coast", "city", "plains", "farmland", "savanna", "desert"],
    tags: ["vehicle", "road", "cart", "fun"], w: 10, h: 7, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var col = env.col;
      var body = col("#e8e4cf"), roof = col("#5aa06a"), post = col("#9a9483"), tire = "#141414", chrome = col("#bbb"), seat = col("#3a63b8");
      // floor / lower body + seat back
      P.rect(x + 1, yb - 3, 8, 3, body);
      P.rect(x + 2, yb - 5, 2, 2, seat);
      // canopy roof on posts
      P.rect(x, yb - 7, 10, 1, roof);
      P.px(x + 1, yb - 6, post); P.px(x + 1, yb - 5, post);
      P.px(x + 8, yb - 6, post); P.px(x + 8, yb - 5, post);
      // little windshield + dash
      P.px(x + 7, yb - 5, W_); P.px(x + 7, yb - 4, W_);
      P.px(x + 8, yb - 3, col("#c9c4b0"));
      // wheels
      P.disc(x + 2, yb - 1, 1, tire); P.px(x + 2, yb - 1, chrome);
      P.disc(x + 7, yb - 1, 1, tire); P.px(x + 7, yb - 1, chrome);
      if (env.night) P.px(x + 9, yb - 3, "#fff2b0");
    }
  },
  {
    id: "ice-cream-truck", name: "Ice-cream truck", biomes: ["city", "coast", "plains", "savanna", "farmland"],
    tags: ["vehicle", "road", "truck", "fun", "food"], w: 15, h: 10, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var col = env.col;
      var body = col("#bfe3d2"), roof = col("#f7b5cd"), tire = "#141414", chrome = col("#bbb"), cone = col("#e8b060"), cream = col("#e8e4cf");
      // box body + cab
      P.rect(x, yb - 7, 11, 7, body);
      P.rect(x + 11, yb - 5, 4, 5, body);
      P.rect(x + 12, yb - 4, 2, 2, W_);
      // pastel roof band
      P.rect(x, yb - 8, 11, 1, roof);
      // jingle bar of marquee lights on the roof (blinking, light source)
      for (var i = 0; i < 5; i++) {
        var on = (((i + (env.frame >> 2)) & 1) === 0);
        P.px(x + 1 + i * 2, yb - 9, on ? "#fff6a0" : "#a58a3a");
      }
      // serving window (warm glow — not dimmed)
      P.rect(x + 2, yb - 5, 6, 3, "#fff4c2");
      // striped awning over the window
      for (var j = 0; j < 6; j++) P.px(x + 2 + j, yb - 6, (j & 1) ? roof : cream);
      // giant cone decal
      P.px(x + 9, yb - 6, col("#fff0f4"));                 // scoop
      P.px(x + 9, yb - 5, cone); P.px(x + 9, yb - 4, cone); // cone
      // wheels
      P.disc(x + 3, yb - 1, 1, tire); P.px(x + 3, yb - 1, chrome);
      P.disc(x + 12, yb - 1, 1, tire); P.px(x + 12, yb - 1, chrome);
      if (env.night) P.px(x + 14, yb - 2, "#fff2b0");
    }
  },
  {
    id: "monster-truck", name: "Monster truck", biomes: ["desert", "city", "plains", "savanna", "canyon", "mountain"],
    tags: ["vehicle", "road", "truck", "big", "fun"], w: 16, h: 11, anchor: "baseline", rarity: 0.5,
    draw: function (P, x, yb, env) {
      var col = env.col;
      var body = col("#7a2fae"), flame = col("#e8621a"), tire = "#0c0c0c", rim = col("#d4d4d4"), chrome = col("#bbb");
      var f = (env.frame >> 2) & 1;
      // giant wheels
      P.disc(x + 4, yb - 3, 3, tire); P.disc(x + 12, yb - 3, 3, tire);
      P.disc(x + 4, yb - 3, 1, rim); P.disc(x + 12, yb - 3, 1, rim);
      // spinning rim spokes (2-frame)
      if (f) {
        P.px(x + 4, yb - 5, rim); P.px(x + 4, yb - 1, rim);
        P.px(x + 12, yb - 5, rim); P.px(x + 12, yb - 1, rim);
      } else {
        P.px(x + 2, yb - 3, rim); P.px(x + 6, yb - 3, rim);
        P.px(x + 10, yb - 3, rim); P.px(x + 14, yb - 3, rim);
      }
      // lifted chassis + shocks
      P.rect(x + 3, yb - 7, 10, 1, chrome);
      P.px(x + 4, yb - 6, chrome); P.px(x + 12, yb - 6, chrome);
      // body high up
      P.rect(x + 3, yb - 10, 10, 3, body);
      P.rect(x + 4, yb - 9, 3, 2, W_);   // cab window
      // flame decal
      P.px(x + 8, yb - 8, flame); P.px(x + 9, yb - 8, flame); P.px(x + 10, yb - 9, flame);
      // roof spotlights (light source)
      P.px(x + 6, yb - 11, "#fff6a0"); P.px(x + 8, yb - 11, "#fff6a0");
      if (!env.night) P.px(x + 12, yb - 8, "#ffd27a");
      if (env.night) P.px(x + 12, yb - 8, "#fff2b0");
    }
  }
];
