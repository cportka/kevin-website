/* Landmarks — a prominent, recognisable feature for a city, drawn in the
   midground behind the trees/sign. Where the LA scene's "landmark" is really its
   palm, other cities get a signature silhouette: the Statue of Liberty for New
   York, a casino for Las Vegas, the Space Needle for Seattle, and so on. A
   landmark entry adds `cities` (loose-matched names) and/or `landscapes`; the
   resolver picks one only when a place actually has a known landmark. */

export default [
  {
    // Cloud Gate — "the Bean". A polished chrome blob on its plaza, reading as a
    // mirror: a bright sky band across the top, a smeared horizon line through
    // the middle, the city's darkness underneath, and the gate's shadowed arch
    // where the two feet meet the pavement.
    id: "cloud-gate", name: "Cloud Gate", cities: ["chicago"], biomes: ["city"],
    w: 20, h: 11, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var night = env.night || env.dayT < 0.4;
      // A mirror shows three bands: sky above the waist, a smeared horizon AT the
      // waist, and the warm plaza below it — that gradient, on a true ellipse with
      // a walk-through arch, is what says "the Bean" instead of "a grey mound".
      var skyHi = night ? "#232c48" : env.col("#e4f1fa");   // crown: mirrored zenith
      var skyLo = night ? "#313c5c" : env.col("#c6dcee");   // shoulders: mirrored sky
      var mid = env.col("#93a8b6"), deep = env.col("#5c6c78"), dark = env.col("#39444e");
      var pave = env.col("#b8b4a8"), paveS = env.col("#8e8a7e");
      var paveR = night ? "#3e3a34" : env.col("#9b968a");   // plaza mirrored in the belly
      // Ellipse, crown to waist: 6 → 12 → 16 → 18 → 20 wide. Each row's end pixel
      // turns just ONE band darker — a chrome edge rolls away smoothly; hard dark
      // dots there read as spots on the mirror.
      P.rect(x + 7, yb - 10, 6, 1, skyHi);
      P.rect(x + 4, yb - 9, 12, 1, skyHi); P.px(x + 4, yb - 9, skyLo); P.px(x + 15, yb - 9, skyLo);
      P.rect(x + 2, yb - 8, 16, 1, skyLo); P.px(x + 2, yb - 8, mid); P.px(x + 17, yb - 8, mid);
      P.rect(x + 1, yb - 7, 18, 1, skyLo); P.px(x + 1, yb - 7, mid); P.px(x + 18, yb - 7, mid);
      P.rect(x, yb - 6, 20, 1, mid); P.px(x, yb - 6, deep); P.px(x + 19, yb - 6, deep);
      // the waist: a smeared upside-down skyline (lit windows once the city is)
      P.rect(x, yb - 5, 20, 1, deep);
      for (var i = 2; i < 18; i += 3) P.px(x + i, yb - 5, night ? "#ffdf8a" : mid);
      // belly, narrowing back in: mirrors the plaza, then shades to the underside
      P.rect(x + 1, yb - 4, 18, 1, paveR); P.px(x + 1, yb - 4, deep); P.px(x + 18, yb - 4, deep);
      P.rect(x + 2, yb - 3, 16, 1, deep);
      P.rect(x + 6, yb - 3, 8, 1, dark);                    // arch underside (dark chrome)
      // the gate: two chrome feet with real head-height air between them
      P.rect(x + 2, yb - 2, 4, 2, deep); P.px(x + 2, yb - 1, dark); P.px(x + 5, yb - 2, dark);
      P.rect(x + 14, yb - 2, 4, 2, deep); P.px(x + 17, yb - 1, dark); P.px(x + 14, yb - 2, dark);
      P.rect(x + 6, yb - 2, 8, 2, night ? "#2a3140" : paveS); // the plaza seen through
      // specular gleam on the crown shoulder
      P.px(x + 5, yb - 9, "#f6fcff"); P.px(x + 6, yb - 9, "#f6fcff"); P.px(x + 4, yb - 8, "#f6fcff");
      // plaza pavement with the bean's shadow
      P.rect(x, yb, 20, 1, pave);
      P.rect(x + 2, yb, 16, 1, paveS);
    }
  },
  {
    // Torrance High School — the Renaissance Revival original: a central entry
    // pavilion with a pediment and arched doorway, red-tile rooflines, and two
    // long arcaded wings of tall dark windows in cream stucco.
    id: "torrance-high", name: "Torrance High School",
    cities: [{ name: "torrance", admin: ["ca", "california"] }],
    biomes: ["forest", "coast", "city"],
    w: 26, h: 15, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var night = env.night || env.dayT < 0.4;
      var wall = env.col("#e9dfc6"), wallS = env.col("#c9bda0");
      var tile = env.col("#a84a38"), tileD = env.col("#7e3628");
      var glass = night ? "#ffdf9a" : env.col("#333a42");
      var trim = env.col("#f4efe2");
      // the two wings, tile roofline over cream walls
      for (var w2 = 0; w2 < 2; w2++) {
        var wx = x + (w2 ? 17 : 0);
        P.rect(wx, yb - 9, 9, 1, tile);
        P.rect(wx, yb - 8, 9, 1, tileD);
        P.rect(wx, yb - 7, 9, 7, wall);
        for (var wi = 0; wi < 3; wi++) {                    // tall arched windows
          var gx = wx + 1 + wi * 3;
          P.rect(gx, yb - 5, 2, 5, glass);
          P.px(gx, yb - 6, glass); P.px(gx + 1, yb - 6, glass);
          P.px(gx + 2, yb - 6, trim);                       // arch shoulder
        }
      }
      // the central pavilion: pediment, niche, arched entry
      P.rect(x + 10, yb - 10, 6, 10, wall);
      P.rect(x + 9, yb - 10, 8, 1, wallS);                  // cornice
      P.rect(x + 10, yb - 11, 6, 1, tile);                  // pediment base tiles
      P.rect(x + 11, yb - 12, 4, 1, tile);
      P.rect(x + 12, yb - 13, 2, 1, tileD);                 // the peak
      P.px(x + 12, yb - 9, glass); P.px(x + 13, yb - 9, glass);   // the little niche window
      P.rect(x + 11, yb - 6, 4, 6, trim);                   // entry surround
      P.rect(x + 12, yb - 5, 2, 5, glass);                  // arched doorway
      P.px(x + 12, yb - 6, glass); P.px(x + 13, yb - 6, glass);
      // walkway and the clipped hedges out front
      P.rect(x, yb, 26, 1, env.col("#cfc8b4"));
      var hedge = env.col("#4a7a3c");
      P.rect(x + 7, yb, 2, 1, hedge); P.rect(x + 17, yb, 2, 1, hedge);
      P.px(x + 8, yb - 1, hedge); P.px(x + 18, yb - 1, hedge);
    }
  },
  {
    // The City of Lomita Public Library: a long, low midcentury civic building —
    // cream stone, tall dark glass bays between white pilasters, a flat white
    // fascia, the entrance canopy at the right, and a lawn with planting out front.
    id: "lomita-library", name: "Lomita Public Library", cities: ["lomita"],
    biomes: ["forest", "coast", "city", "farmland", "plains"],
    w: 26, h: 12, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var night = env.night || env.dayT < 0.4;
      var stone = env.col("#d8cbae"), stoneS = env.col("#b6a888");
      var fascia = env.col("#f2efe6"), glassD = env.col("#2c3944");
      var glow = "#ffdf9a";
      // body + flat roof fascia with a shadow line under it
      P.rect(x + 1, yb - 9, 24, 9, stone);
      P.rect(x, yb - 10, 26, 1, fascia);
      P.rect(x + 1, yb - 9, 24, 1, stoneS);
      // two tall glass bays on the left, white pilasters between — a couple of
      // panes stay warmly lit after dark (someone always reading late)
      for (var b = 0; b < 2; b++) {
        var gx = x + 2 + b * 5;
        P.rect(gx, yb - 8, 4, 8, glassD);
        P.rect(gx + 3, yb - 8, 1, 8, env.col("#46545f"));   // reflection edge
        if (night) { P.rect(gx + 1, yb - 6, 2, 2, glow); P.rect(gx, yb - 3, 2, 2, glow); }
        P.rect(gx + 4, yb - 9, 1, 9, fascia);               // pilaster
      }
      // the lettered stone panel — engraved dashes reading as inscription lines
      var ink = env.col("#7a6f58");
      P.rect(x + 13, yb - 7, 6, 1, ink);
      P.rect(x + 14, yb - 5, 4, 1, ink);
      // entrance: white canopy slab jutting over a glass door
      P.rect(x + 19, yb - 6, 7, 1, fascia);
      P.rect(x + 21, yb - 5, 2, 5, night ? glow : glassD);
      P.px(x + 20, yb - 5, stoneS); P.px(x + 23, yb - 5, stoneS);
      // lawn strip and the flower bed from the photo
      var lawn = env.col("#5f9a4a");
      P.rect(x, yb - 1, 26, 2, lawn);
      P.px(x + 3, yb - 1, env.col("#c2506a")); P.px(x + 12, yb - 1, env.col("#d8d4c8"));
      P.px(x + 17, yb - 1, env.col("#c2506a")); P.px(x + 24, yb - 1, env.col("#b04a58"));
    }
  },
  {
    id: "liberty", name: "Statue of Liberty", cities: ["new york", "jersey city", "newark"], biomes: ["city", "coast"],
    w: 14, h: 32, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var night = env.night || env.dayT < 0.4;
      // Oxidised copper, modelled rather than flat — she used to be a two-pixel-wide
      // column of one green on a pedestal that ate two thirds of her height, which
      // read as a grey-green smudge. The plinth is now short and the figure tall.
      var pale = env.col("#a8e6cd"), lit = env.col("#7fd4b4"), mid = env.col("#57ad92");
      var shade = env.col("#357a66"), deep = env.col("#23574a");
      var gran = env.col("#8f8f98"), granS = env.col("#63636e"), granD = env.col("#45454f");
      var gold = "#ffd24a", flame = "#fff3b0";

      // --- the granite plinth on its star fort ---
      P.rect(x + 1, yb - 1, 12, 2, granS); P.rect(x + 1, yb - 1, 12, 1, gran);
      P.rect(x + 2, yb - 2, 10, 1, gran);
      P.rect(x + 3, yb - 7, 8, 5, granS);
      for (var py = yb - 7; py <= yb - 3; py++) {           // lit face / shadowed flank
        P.px(x + 3, py, gran); P.px(x + 9, py, granD); P.px(x + 10, py, granD);
      }
      P.rect(x + 2, yb - 8, 10, 1, gran);                   // cornice

      // --- the robe: a long column that flares as it falls, lit from the left ---
      // [left, right] column span per row, from the hem (yb-9) up to the shoulders
      var ROBE = [[3, 10], [3, 10], [3, 10], [4, 10], [4, 9], [4, 9], [4, 9],
                  [5, 9], [5, 9], [5, 8], [5, 8], [5, 8], [5, 8]];
      for (var i = 0; i < ROBE.length; i++) {
        var row = yb - 9 - i, x0 = ROBE[i][0], x1 = ROBE[i][1];
        for (var cx = x0; cx <= x1; cx++) {
          // folds run DOWN the drapery, so they are fixed columns — a diagonal
          // dither here read as scales rather than cloth
          var c = cx === x0 ? lit : cx === x1 ? shade : (cx === 8) ? shade : mid;
          P.px(x + cx, row, c);
        }
      }

      // --- head and crown ---
      // The read comes from the SILHOUETTE, not from extra shading: four-wide
      // shoulders pinch to a two-wide neck and head, then flare again into the
      // spiked crown. Outlining the head in dark only cut a gap under the crown.
      P.px(x + 6, yb - 22, shade); P.px(x + 7, yb - 22, deep);   // neck, in shadow
      P.px(x + 6, yb - 23, pale); P.px(x + 7, yb - 23, mid);     // face
      P.px(x + 6, yb - 24, lit); P.px(x + 7, yb - 24, shade);    // brow
      P.px(x + 5, yb - 25, lit); P.px(x + 8, yb - 25, lit);      // the outer spikes
      P.px(x + 6, yb - 25, pale); P.px(x + 7, yb - 25, pale);    // the crown band
      P.px(x + 6, yb - 26, pale);                                // one tall ray, kept
      P.px(x + 7, yb - 26, lit);                                 // below the torch

      // --- the tablet, held in the crook of the left arm ---
      P.rect(x + 2, yb - 16, 2, 4, env.col("#9fd8c4"));
      P.px(x + 2, yb - 16, env.col("#c4ecdd"));
      P.px(x + 4, yb - 17, shade); P.px(x + 4, yb - 16, shade);  // forearm across the body

      // --- the raised right arm and the torch, set clear of the crown ---
      P.px(x + 9, yb - 22, mid); P.px(x + 9, yb - 23, mid);
      P.px(x + 10, yb - 24, lit); P.px(x + 10, yb - 25, lit);
      P.px(x + 10, yb - 26, lit); P.px(x + 10, yb - 27, mid);
      P.px(x + 10, yb - 28, gold);                               // the torch cup
      P.px(x + 9, yb - 29, gold); P.px(x + 11, yb - 29, gold);
      P.px(x + 10, yb - 29, flame); P.px(x + 10, yb - 30, flame);
      P.withAlpha(night ? 0.5 : 0.22, function () { P.disc(x + 10, yb - 29, 1, gold); });
      if (night) {
        // floodlit from the base, the way the island lights her after dark
        P.withAlpha(0.1, function () { P.disc(x + 7, yb - 16, 7, "#bfe8d8"); });
      }
    }
  },
  {
    id: "casino", name: "Casino", cities: ["las vegas", "atlantic city", "macau", "monte carlo"], biomes: ["desert", "city"],
    pairedSign: "vegas-welcome", w: 16, h: 22, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var neon = P.clamp(1 - env.dayT, 0, 1), f = env.frame || 0;
      var bulbs = ["#ff4a7a", "#ffd24a", "#4affd2", "#8a5aff", "#ff7a3a"];
      function chase(i) { return neon > 0.25 ? bulbs[(i + (f >> 1)) % bulbs.length] : env.col("#6a5a4a"); }
      // tower + a stepped penthouse crown
      P.rect(x, yb - 13, 16, 13, env.col("#332a44"));
      P.rect(x + 4, yb - 17, 8, 4, env.col("#42354f"));
      P.rect(x + 6, yb - 20, 4, 3, env.col("#4a3a5f"));
      // full marquee ring of chasing bulbs around the whole facade
      for (var i = 0; i < 16; i++) { P.px(x + i, yb - 13, chase(i)); P.px(x + i, yb - 1, chase(i + 2)); }
      for (var yy = 0; yy < 12; yy += 2) { P.px(x, yb - 1 - yy, chase(yy)); P.px(x + 15, yb - 1 - yy, chase(yy + 1)); }
      // lit windows glowing gold
      for (var wy = yb - 11; wy < yb - 2; wy += 2) for (var wx = x + 3; wx < x + 14; wx += 3) P.px(wx, wy, neon > 0.3 ? "#ffe58a" : env.col("#5a5240"));
      // a tall vertical marquee sign up the middle (pure celebration, no numbers)
      var vsign = P.mix("#c23a7a", "#ff5aa8", neon);
      P.rect(x + 7, yb - 19, 2, 6, vsign);
      P.px(x + 7, yb - 20, chase(0)); P.px(x + 8, yb - 20, chase(3)); // twin bulbs atop
      // rooftop searchlight sweep + sparkle at night
      if (neon > 0.4) {
        var sweep = Math.round(Math.sin(f * 0.08) * 6);
        P.withAlpha(0.25, function () { P.line(x + 8, yb - 20, x + 8 + sweep, yb - 26, "#fff2b0"); });
        if ((f >> 1) % 3 === 0) P.px(x + 2 + (f % 12), yb - 15, "#ffffff");
      }
    }
  },
  {
    id: "space-needle", name: "Space Needle", cities: ["seattle", "tacoma"], biomes: ["city", "forest", "lake", "mountain"],
    w: 13, h: 31, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var m = env.col("#d3d7dc"), dk = env.col("#9aa0a6"), warm = env.col("#c8a06a");
      var cx = x + 6, saucerY = yb - 22;
      // three tapered legs sweeping in to a waist, then the core rising to the top
      for (var y = 0; y <= 22; y++) {
        var t = y / 22;
        var spread = Math.round(5 * (1 - t) * (1 - t) * 1.15);   // wide at the base, pinched at the waist
        P.px(cx - spread, yb - y, y > 16 ? dk : m);
        P.px(cx + spread, yb - y, y > 16 ? dk : m);
        if (spread <= 1) P.px(cx, yb - y, m);                    // the core column
      }
      P.px(cx, yb - 8, dk); P.px(cx, yb - 14, dk);               // elevator core detail
      // the saucer: a wide flying-disc with an underside cone and a lifted rim
      P.rect(x + 1, saucerY, 11, 1, dk);                         // underside
      P.rect(x, saucerY - 1, 13, 1, m);                          // widest deck
      P.rect(x + 1, saucerY - 2, 11, 1, m);                      // upper deck
      P.px(x, saucerY, dk); P.px(x + 12, saucerY, dk);           // rim tips
      // observation windows — a warm ring of light after dark
      for (var wx = x + 2; wx <= x + 10; wx += 2) {
        P.px(wx, saucerY - 1, (env.night || env.dayT < 0.4) ? "#ffe0a0" : warm);
      }
      P.rect(x + 3, saucerY - 3, 7, 1, dk);                      // roof of the restaurant level
      // spire + aircraft beacon
      P.rect(cx, saucerY - 8, 1, 5, m);
      P.px(cx, saucerY - 9, env.night ? "#ff5a5a" : "#e6e6e6");
      if (env.night && ((env.frame >> 2) & 1)) P.px(cx, saucerY - 10, "#ffd0d0");
    }
  },
  {
    id: "belltower", name: "Campanile", cities: ["berkeley", "venice", "san marco"], biomes: ["city", "coast", "farmland"],
    w: 6, h: 24, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var stone = env.col("#d8c9a0"), dk = env.col("#b0a078");
      P.rect(x + 1, yb - 20, 4, 20, stone);
      P.rect(x + 1, yb - 20, 4, 1, dk);
      P.rect(x + 1, yb - 14, 4, 3, env.col("#3a3a42"));        // belfry opening
      // clock face
      P.px(x + 2, yb - 17, "#f4efe0"); P.px(x + 3, yb - 17, "#f4efe0");
      // pyramid cap
      P.px(x + 2, yb - 22, dk); P.px(x + 3, yb - 22, dk); P.px(x + 1, yb - 21, dk); P.px(x + 4, yb - 21, dk);
      P.px(x + 2, yb - 23, env.col("#c9a24a")); P.px(x + 3, yb - 23, env.col("#c9a24a"));
    }
  },
  {
    // Lēʻahi — the tuff cone above Waikīkī: a long shallow slope up from the west
    // to a high notched rim on the east, dropping away steeply to the sea. Sunlit
    // seaward face, shadowed inland flank, dry scrub gullies raking down it.
    id: "diamond-head", name: "Diamond Head", cities: ["honolulu", "waikiki"], biomes: ["coast"],
    w: 28, h: 15, anchor: "baseline",
    draw: function (P, x, yb, env) {
      // Lēʻahi is a dry leeward tuff cone, not a green hill: gold-brown slopes with
      // green only down the erosion gullies and along the vegetated foot, a notched
      // crater rim, and the little lighthouse on the low seaward point.
      var crest = env.col("#d4bd7e"), lit = env.col("#b39a5e");
      var mid = env.col("#8d7748"), dark = env.col("#635334");
      var gully = env.col("#5f7c42"), scrub = env.col("#456939");
      // Column by column: the long ramp up from Waikiki, then the broad crater RIM —
      // two low rises with a shallow saddle between them, not a pair of peaks — and
      // finally the steep drop to the sea. It's the wide, almost flat crest that
      // reads as a blown-out cone rather than a hill.
      var PROFILE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 11, 12, 12, 11, 10, 10, 11,
                     12, 13, 13, 12, 10, 7, 4, 3, 2, 2];
      for (var i = 0; i < PROFILE.length; i++) {
        var h = PROFILE[i], top = yb - h;
        var seaward = i > 20;                                  // past the rim, falling to the sea
        for (var y = top; y <= yb; y++) {
          var d = y - top, c;                                  // depth below this crest
          if (d === 0) c = crest;                              // sunlit rim line
          else if (d === 1) c = seaward ? mid : lit;
          else if (d < 5) c = seaward ? dark : mid;
          else c = dark;
          // ravines raking part-way down the face, and the green skirt at the foot
          if ((i % 6) === 3 && d >= 2 && d < h - 2) c = gully;
          if (y >= yb - 1) c = scrub;
          P.px(x + i, y, c);
        }
      }
      // the lighthouse standing clear on the seaward point, lit after dark
      var lamp = (env.night || env.dayT < 0.4) ? "#ffe9a6" : env.col("#cfcabc");
      P.px(x + 25, yb - 4, env.col("#efeae0"));
      P.px(x + 25, yb - 5, env.col("#efeae0"));
      P.px(x + 25, yb - 6, lamp);
    }
  },
  {
    id: "snowpeak", name: "Denali", cities: ["anchorage", "denali", "fairbanks", "juneau"], biomes: ["tundra", "mountain", "forest"],
    w: 22, h: 16, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var rock = env.col("#8a97a4"), snow = env.col("#eef4f8");
      for (var i = 0; i < 20; i++) {
        var h = Math.round(14 - Math.abs(i - 9) * 1.2);
        if (h < 1) h = 1;
        var top = yb - h;
        P.rect(x + i, top, 1, h, rock);
        if (h > 6) { P.px(x + i, top, snow); if (h > 9) P.px(x + i, top + 1, snow); }
      }
    }
  },
  {
    id: "artdeco", name: "Art Deco hotel", cities: ["miami", "miami beach", "fort lauderdale"], biomes: ["coast", "city"],
    w: 12, h: 16, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var neon = P.clamp(1 - env.dayT, 0, 1);
      var wall = P.mix("#f2d9c0", "#2a1f3a", neon * 0.7);
      P.rect(x, yb - 14, 12, 14, wall);
      P.rect(x + 4, yb - 17, 4, 3, wall);                     // stepped tower
      var trim = P.mix("#2ab0c2", "#2affe0", neon);
      P.rect(x, yb - 14, 12, 1, trim); P.rect(x, yb - 9, 12, 1, trim); P.rect(x, yb - 4, 12, 1, trim);
      for (var wy = yb - 12; wy < yb - 1; wy += 3) for (var wx = x + 2; wx < x + 10; wx += 3) P.px(wx, wy, neon > 0.3 ? "#ffe58a" : env.col("#8a94a0"));
    }
  },
  {
    id: "monument", name: "Washington Monument", cities: ["washington", "district of columbia"], biomes: ["city", "plains"],
    w: 5, h: 24, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var stone = env.col("#dcdce0");
      for (var y = 0; y < 22; y++) {
        var t = y / 22, w = Math.max(1, Math.round(3 - t * 1.5));
        P.rect(x + 2 - ((w - 1) >> 1), yb - y, w, 1, stone);
      }
      P.px(x + 2, yb - 22, env.col("#f4f4f4"));
      if (env.night) P.px(x + 2, yb - 5, "#ff5a5a");
    }
  },
  {
    id: "riverboat", name: "Riverboat", cities: ["new orleans", "memphis", "st louis", "baton rouge"], biomes: ["wetland", "lake", "coast"],
    // moored AT the bank, so it sits in front of the shore trees, not behind them
    front: true,
    w: 16, h: 12, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var hull = env.col("#e8e4d8"), red = env.col("#c23b3b"), trim = env.col("#b08a4a");
      P.rect(x, yb - 4, 16, 4, hull);                          // hull
      P.rect(x + 2, yb - 8, 11, 4, hull);                      // deck house
      P.rect(x + 2, yb - 8, 11, 1, red);
      P.rect(x + 4, yb - 11, 2, 3, env.col("#2a2a30")); P.rect(x + 8, yb - 11, 2, 3, env.col("#2a2a30")); // twin stacks
      P.disc(x + 15, yb - 3, 2, red); P.px(x + 15, yb - 3, trim); // paddlewheel
      P.px(x + 1, yb - 6, red); // flag
    }
  },
  {
    id: "guitar-sign", name: "Neon guitar", cities: ["memphis", "nashville", "austin", "cleveland"], biomes: ["city"],
    w: 8, h: 16, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var neon = P.clamp(1 - env.dayT, 0, 1);
      P.rect(x + 3, yb - 10, 2, 10, env.col("#3a3a42"));       // pole
      var body = P.mix("#b0662a", "#ff9a3a", neon), neck = P.mix("#8a5a2a", "#ffd24a", neon);
      P.disc(x + 4, yb - 13, 2, body);                         // body
      P.rect(x + 4, yb - 16, 1, 3, neck);                      // neck
      if (neon > 0.3) P.withAlpha(0.3 * neon, function () { P.disc(x + 4, yb - 13, 3, "#ff9a3a"); });
    }
  },
  {
    id: "skyscraper", name: "Skyscraper", cities: ["chicago", "toronto", "dallas", "houston", "shanghai"], biomes: ["city"],
    w: 8, h: 26, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var wall = env.col("#4a525e");
      P.rect(x + 1, yb - 24, 6, 24, wall);
      P.rect(x + 2, yb - 26, 4, 2, wall);                      // setback top
      P.rect(x + 3, yb - 28, 2, 2, env.col("#5a626e"));        // antenna base
      P.px(x + 3, yb - 29, env.night ? "#ff5a5a" : "#8a929e");
      for (var wy = yb - 22; wy < yb - 1; wy += 2) for (var wx = x + 2; wx < x + 6; wx += 2) P.px(wx, wy, (env.night || env.dayT < 0.4) && ((wx + wy) & 3) ? "#ffe58a" : env.col("#2f3742"));
    }
  },
  {
    id: "lone-star", name: "Lone Star tower", cities: ["austin", "dallas", "fort worth", "san antonio"], biomes: ["plains", "desert", "farmland", "city"],
    w: 8, h: 18, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var m = env.col("#9098a0");
      P.line(x + 2, yb, x + 4, yb - 12, m); P.line(x + 5, yb, x + 4, yb - 12, m); // legs
      P.rect(x + 2, yb - 15, 5, 3, env.col("#c0c6cc"));        // tank
      var star = env.night ? "#ffe58a" : "#e8c24a";
      P.px(x + 4, yb - 18, star); P.px(x + 3, yb - 17, star); P.px(x + 5, yb - 17, star); P.px(x + 4, yb - 16, star);
    }
  },
  {
    id: "lighthouse", name: "Lighthouse", cities: ["portland maine", "cape may", "montauk"], landscapes: ["north-sea", "pacific-cliffs"], biomes: ["coast"],
    w: 7, h: 20, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var white = env.col("#eae6dc"), red = env.col("#c23b3b");
      for (var y = 0; y < 16; y++) {
        var w = Math.max(2, 4 - Math.floor(y / 6));
        P.rect(x + 3 - ((w - 1) >> 1), yb - y, w, 1, (Math.floor(y / 2) & 1) ? red : white);
      }
      P.rect(x + 2, yb - 18, 3, 2, env.col("#3a3a42"));        // lantern room
      var beam = env.night || env.dayT < 0.4;
      P.px(x + 3, yb - 17, beam ? "#fff2b0" : env.col("#d8d8c0"));
      if (beam) P.withAlpha(0.3, function () { P.rect(x + 4, yb - 18, 6, 1, "#fff2b0"); });
    }
  },
  {
    id: "ferris-wheel", name: "Ferris wheel", cities: ["london eye", "vienna", "yokohama", "santa monica"], biomes: ["city", "coast"],
    w: 16, h: 17, anchor: "baseline",
    // Steel A-frame, a dense rim, four turning spokes and coloured cabins — the
    // old version was two pale lines and twelve pale dots, invisible against the
    // sky it stood on. At night the cabins run the LED show the Pacific Wheel is
    // known for.
    draw: function (P, x, yb, env) {
      var night = env.night || env.dayT < 0.4;
      var steel = env.col("#7e8a99"), steelD = env.col("#5d6774");
      var cx = x + 8, cy = yb - 9, r = 7, rot = env.frame * 0.02;
      P.line(x + 5, yb - 1, cx, cy, steelD); P.line(x + 11, yb - 1, cx, cy, steelD); // A-frame
      P.rect(x + 4, yb, 9, 1, steelD);                                              // boarding deck
      for (var s = 0; s < 4; s++) {                                                 // turning spokes
        var sa = rot + s * Math.PI / 2;
        P.line(cx, cy, Math.round(cx + Math.cos(sa) * (r - 1)), Math.round(cy + Math.sin(sa) * (r - 1)), steel);
      }
      for (var a = 0; a < 64; a++) {                                                // the rim itself —
        var ang = (a / 64) * Math.PI * 2 + rot;                                     // sampled densely so it
        P.px(Math.round(cx + Math.cos(ang) * r), Math.round(cy + Math.sin(ang) * r), // draws a SOLID circle,
          night ? "#5a6a7e" : steel);                                               // not a dashed one
      }
      for (var c = 0; c < 12; c++) {                                                // cabins ride the rim
        var ca = (c / 12) * Math.PI * 2 + rot;
        P.px(Math.round(cx + Math.cos(ca) * r), Math.round(cy + Math.sin(ca) * r),
          night ? ["#ff5a7a", "#ffd24a", "#4affd2", "#7a9aff"][c % 4]
                : ["#d84a5a", "#e8b23a", "#3a8ad8"][c % 3]);
      }
      P.disc(cx, cy, 1, night ? "#ffd24a" : env.col("#c23b3b"));                    // hub
      P.px(cx, cy, env.col("#f2efe6"));
    }
  },
  {
    id: "windmill", name: "Windmill", cities: ["amsterdam", "rotterdam", "kinderdijk"], biomes: ["farmland", "plains", "wetland"],
    w: 12, h: 16, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var wall = env.col("#8a7050"), cap = env.col("#5a4030");
      P.rect(x + 4, yb - 10, 4, 10, wall);                     // tapered tower body
      P.px(x + 3, yb - 1, wall); P.px(x + 8, yb - 1, wall);
      P.rect(x + 4, yb - 12, 4, 2, cap);                       // cap
      var cx = x + 6, cy = yb - 11, sp = (env.frame * 0.08);
      for (var b = 0; b < 4; b++) {
        var ang = sp + b * Math.PI / 2;
        P.line(cx, cy, Math.round(cx + Math.cos(ang) * 5), Math.round(cy + Math.sin(ang) * 5), env.col("#e8e0cc"));
      }
    }
  },
  {
    // City-matched only: the pyramids belong to Giza, not to every Saharan town
    // (a landscape fallback used to plant them in Marrakesh and Timbuktu).
    id: "pyramid", name: "Pyramids", cities: ["cairo", "giza", "luxor"], biomes: ["desert"],
    w: 22, h: 15, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var lit = env.col("#f0d08a"), shade = env.col("#a06d34"), edge = env.col("#7a5326");
      // two solid triangles: wide base on row yb, converging to an apex on top.
      // Brighter sunlit face + a dark left edge so they read against the dunes.
      for (var p = 0; p < 2; p++) {
        var h = p ? 10 : 13;                      // second pyramid a touch shorter/behind
        var bx = x + p * 10, apex = bx + (h - 1);
        for (var y = 0; y < h; y++) {
          var w = (h - y) * 2 - 1;                // widest at the base, 1px at the top
          var left = apex - ((w - 1) >> 1);
          P.rect(left, yb - y, w, 1, lit);
          var half = w >> 1;
          if (half > 0) P.rect(left + w - half, yb - y, half, 1, shade); // shaded right face
          P.px(left, yb - y, edge);               // crisp left silhouette edge
        }
      }
    }
  }
];
