/* Landmarks (world set B) — more classic city signatures, so big global cities
   read as themselves. Same idiom as sets A/core: a `cities` list (loose-matched)
   and `biomes` that suit where the city sits; env.col dims paint at night while
   genuine light sources (beacons, lit windows) stay bright. */

export default [
  {
    // Wat Arun, the Temple of Dawn on the Chao Phraya — a tall corn-cob prang
    // encrusted with porcelain, flanked by two smaller ones. Bangkok read as a
    // generic block of mid-rise without it.
    id: "wat-arun", name: "Wat Arun", cities: ["bangkok", "krung thep", "ayutthaya"],
    biomes: ["city", "jungle", "wetland", "savanna", "lake"],
    tags: ["temple", "spire", "prang", "landmark"],
    w: 17, h: 27, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var pale = env.col("#e6ddc9"), shade = env.col("#c4b79e"), dk = env.col("#9c8f78");
      var gold = env.dayT > 0.45 ? env.col("#d8b34a") : "#ffd76a";
      // one tapering prang: a stepped, corn-cob tower narrowing to a gilded tip
      function prang(cx, H, wide) {
        for (var y = 0; y < H; y++) {
          var t = y / H;
          var hw = Math.max(0, Math.round(wide * (1 - t * t * 0.55) * (1 - t * 0.55)));
          var band = (y % 4 === 0);                       // the tiered rings up the tower
          for (var i = -hw; i <= hw; i++) {
            P.px(cx + i, yb - 2 - y, band ? shade : (i === -hw || i === hw ? dk : pale));
          }
        }
        P.px(cx, yb - 2 - H, gold);                       // gilded finial
        P.px(cx, yb - 3 - H, gold);
      }
      P.rect(x, yb - 1, 17, 2, dk);                       // river terrace
      P.rect(x, yb - 2, 17, 1, shade);
      prang(x + 3, 12, 1);                                // flanking prangs
      prang(x + 13, 12, 1);
      prang(x + 8, 22, 3);                                // the great central prang
      // porcelain glints catch the light
      if (env.dayT > 0.5) { P.px(x + 8, yb - 14, gold); P.px(x + 7, yb - 9, gold); P.px(x + 9, yb - 19, gold); }
    }
  },
  {
    // El Ángel de la Independencia — the golden winged victory on her column on
    // Paseo de la Reforma. Mexico City is a metropolis in a ring of volcanoes, so
    // she reads against the mountains as well as against a skyline.
    id: "angel-independencia", name: "El Ángel de la Independencia",
    cities: ["mexico city", "ciudad de mexico", "cdmx"], biomes: ["mountain", "city", "jungle", "savanna"],
    tags: ["column", "monument", "gold", "landmark"],
    w: 11, h: 26, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var stone = env.col("#ded6c4"), dk = env.col("#b3a992"), shade = env.col("#9a917c");
      var gold = env.dayT > 0.5 ? "#ffd24a" : env.col("#c8a23a");     // she catches the sun
      var cx = x + 5;
      // stepped plinth
      P.rect(x + 1, yb - 2, 9, 3, dk); P.rect(x + 2, yb - 4, 7, 2, stone);
      P.rect(x + 2, yb - 4, 7, 1, shade);
      P.px(x + 1, yb - 3, shade); P.px(x + 9, yb - 3, shade);          // corner figures
      // fluted column
      P.rect(cx - 1, yb - 21, 3, 17, stone);
      P.rect(cx, yb - 21, 1, 17, dk);                                  // flute shadow
      P.rect(cx - 1, yb - 22, 3, 1, stone);                            // capital
      P.rect(cx - 2, yb - 23, 5, 1, stone);
      // the winged victory, arms up: laurel in one hand, broken chain in the other
      P.px(cx, yb - 24, gold); P.px(cx, yb - 25, gold);                // body
      P.px(cx - 1, yb - 25, gold); P.px(cx + 1, yb - 25, gold);        // outstretched arms
      P.px(cx - 2, yb - 26, gold);                                     // raised laurel
      P.px(cx, yb - 26, gold);                                         // head
      P.px(cx + 2, yb - 24, gold);                                     // trailing wing
      P.px(cx - 2, yb - 24, gold);                                     // wing
      if (env.night) { P.px(cx, yb - 23, "#ffe9a6"); P.px(cx - 1, yb - 12, "#ffe9a6"); }  // uplighting
    }
  },
  {
    id: "st-basils", name: "St. Basil's Cathedral", cities: ["moscow"], biomes: ["city", "forest", "plains", "tundra"],
    w: 20, h: 21, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var brick = env.col("#b23f3a"), cream = env.col("#e6dcc4"), gold = env.night ? "#ffe14a" : env.col("#d9b247");
      var domes = ["#3f7a44", "#c23a5a", "#3a63b8", gold, "#7a3f8a"];  // green, rose, blue, gold, violet
      P.rect(x + 2, yb - 6, 16, 6, cream);                    // arcaded base
      for (var i = 0; i < 5; i++) {
        var dx = x + 3 + i * 3, dc = env.col(domes[i]);
        var tall = i === 2 ? 4 : 0;                           // centre dome sits higher
        P.rect(dx, yb - 11 - tall, 2, 5, brick);              // drum
        P.disc(dx, yb - 12 - tall, 2, dc);                    // onion dome
        P.px(dx, yb - 15 - tall, dc); P.px(dx, yb - 16 - tall, gold);  // finial + cross
        // a couple of swirl highlights
        P.px(dx - 1, yb - 12 - tall, P.tint(dc, 0.25));
      }
      // central tent spire above the middle dome
      P.px(x + 9, yb - 20, brick); P.px(x + 10, yb - 20, brick);
    }
  },
  {
    id: "tokyo-tower", name: "Tokyo Tower", cities: ["tokyo"], biomes: ["city", "coast"],
    w: 13, h: 30, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var red = env.col("#e0483a"), white = env.col("#eef0f2"), cx = x + 6, H = 27;
      for (var y = 0; y <= H; y++) {
        var t = y / H, hw = Math.round(5 * (1 - t) * (1 - t));
        var band = (Math.floor(y / 4) & 1) ? white : red;
        P.px(cx - hw, yb - y, band); P.px(cx + hw, yb - y, band);
        if (hw <= 1) P.rect(cx - 1, yb - y, 3 - (hw ? 0 : 1), 1, red);
      }
      P.line(cx - 5, yb - 5, cx, yb - 9, red); P.line(cx + 5, yb - 5, cx, yb - 9, red); // base arch
      P.rect(cx - 4, yb - 12, 9, 1, red);                    // main deck
      P.rect(cx - 2, yb - 20, 5, 1, white);                  // special deck
      P.rect(cx, yb - 30, 1, 4, red);                        // antenna
      P.px(cx, yb - 30, env.night ? "#fff2b0" : white);      // beacon
    }
  },
  {
    id: "burj-khalifa", name: "Burj Khalifa", cities: ["dubai"], biomes: ["desert", "city", "coast"],
    w: 9, h: 32, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var glass = env.col("#9fb6c8"), lit = env.night || env.dayT < 0.42, cx = x + 4;
      for (var y = 0; y < 28; y++) {                          // stepped, tapering setbacks
        var t = y / 28, w = Math.max(1, Math.round(5 - t * 4) | 1);
        var left = cx - ((w - 1) >> 1);
        P.rect(left, yb - y, w, 1, glass);
        if (lit && (y & 1) && w > 1) P.px(left + (w >> 1), yb - y, "#ffe58a");
      }
      P.rect(cx, yb - 32, 1, 4, glass);                      // spire
      P.px(cx, yb - 32, env.night ? "#ff5a5a" : glass);
    }
  },
  {
    id: "marina-bay", name: "Marina Bay", cities: ["singapore"], biomes: ["city", "coast"],
    w: 18, h: 20, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var tower = env.col("#8a94a0"), deck = env.col("#c8cdd2"), lit = env.night || env.dayT < 0.42;
      var xs = [x + 2, x + 8, x + 14];
      for (var i = 0; i < 3; i++) {                          // three leaning towers
        P.rect(xs[i], yb - 15, 3, 15, tower);
        for (var wy = yb - 13; wy < yb - 1; wy += 2) P.px(xs[i] + 1, wy, lit ? "#ffe58a" : env.col("#5a6068"));
      }
      P.rect(x, yb - 17, 18, 2, deck);                       // the boat-shaped skypark on top
      P.px(x - 1, yb - 16, deck); P.px(x + 18, yb - 17, deck);
      if (!env.night) P.px(x + 8, yb - 18, env.col("#3fa06a"));   // rooftop greenery
    }
  },
  {
    id: "petronas", name: "Petronas Towers", cities: ["kuala lumpur"], biomes: ["city", "jungle"],
    w: 13, h: 30, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var steel = env.col("#aeb8c2"), lit = env.night || env.dayT < 0.42;
      function twr(tx) {
        for (var y = 0; y < 24; y++) { var w = y > 20 ? 1 : (y > 16 ? 2 : 3); P.rect(tx - (w >> 1) + 1, yb - y, w, 1, steel); }
        P.rect(tx, yb - 27, 1, 3, steel); P.px(tx, yb - 27, env.night ? "#ff5a5a" : steel);  // spire
        for (var wy = yb - 22; wy < yb - 2; wy += 2) P.px(tx, wy, lit ? "#ffe58a" : env.col("#5a6068"));
      }
      twr(x + 3); twr(x + 9);
      P.rect(x + 4, yb - 14, 5, 1, steel);                   // skybridge
    }
  },
  {
    id: "sagrada", name: "Sagrada Família", cities: ["barcelona"], biomes: ["city", "coast"],
    w: 16, h: 26, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var stone = env.col("#cdb790"), tip = env.night ? "#ffe14a" : env.col("#d9b247");
      P.rect(x + 1, yb - 8, 14, 8, stone);                   // nave base
      var spires = [[x + 2, 18], [x + 5, 24], [x + 8, 22], [x + 11, 25], [x + 14, 17]];
      for (var i = 0; i < spires.length; i++) {
        var sx = spires[i][0], h = spires[i][1];
        for (var y = 6; y < h; y++) { var w = y > h - 4 ? 1 : (y > h - 10 ? 1 : 2); P.rect(sx - (w >> 1), yb - y, w, 1, stone); }
        P.px(sx, yb - h, tip);                                // knobbly pinnacle
        P.px(sx, yb - h + 1, P.tint(stone, 0.2));
      }
    }
  },
  {
    id: "brandenburg", name: "Brandenburg Gate", cities: ["berlin"], biomes: ["city", "plains"],
    w: 18, h: 14, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var stone = env.col("#d8d2c4"), dk = env.col("#b0aa9a"), gold = env.night ? "#ffe14a" : env.col("#c9a24a");
      P.rect(x, yb - 9, 18, 9, stone);                       // entablature block
      for (var c = 0; c < 6; c++) P.rect(x + 1 + c * 3, yb - 8, 1, 8, dk);   // Doric columns
      P.rect(x, yb - 11, 18, 2, stone);                      // attic
      P.rect(x + 7, yb - 13, 4, 2, dk);                      // quadriga base
      P.px(x + 8, yb - 14, gold); P.px(x + 10, yb - 14, gold); // horses/chariot hint
    }
  },
  {
    id: "great-wall", name: "Great Wall", cities: ["beijing", "tianjin"], biomes: ["mountain", "forest", "plains"],
    w: 26, h: 12, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var stone = env.col("#9a8f78"), dk = env.col("#726a58");
      for (var i = 0; i < 26; i++) {                         // wall snaking over hills
        var hill = Math.round(6 + 3 * Math.sin(i * 0.5) + 2 * Math.sin(i * 0.22));
        P.rect(x + i, yb - hill, 1, hill, stone);
        if ((i & 1) === 0) P.px(x + i, yb - hill, dk);        // crenellations
      }
      // a watchtower
      P.rect(x + 11, yb - 12, 4, 5, stone); P.rect(x + 11, yb - 12, 4, 1, dk);
      P.px(x + 12, yb - 10, dk); P.px(x + 13, yb - 10, dk);
    }
  }
];
