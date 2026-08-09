/* Landmarks (world set A) — signature silhouettes for famous world cities,
   drawn as tall midground features behind the trees/sign. Like the core set,
   each entry carries a loose-matched `cities` list (lower-case) so the resolver
   only picks one when a place actually has a known landmark, plus `biomes` that
   suit where the city sits. Authored facing right / symmetric; the compositor
   mirrors as needed. Colours pass through env.col() so they dim at night, while
   genuine light sources (aircraft beacons, lit clock faces) stay bright. */

export default [
  {
    // Reno's neon arch over a low casino — warm, retro, unmistakably NOT the tall
    // cool-purple Vegas tower. "The Biggest Little City in the World."
    id: "casino-reno", name: "Reno Arch", cities: ["reno"], biomes: ["desert", "city", "mountain"],
    tags: ["casino", "neon", "arch", "landmark"],
    w: 20, h: 17, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var neon = P.clamp(1 - env.dayT, 0, 1), f = env.frame || 0;
      var warm = ["#ffcf4a", "#ff5a4a", "#4affd2", "#ffffff"];
      function chase(i) { return neon > 0.25 ? warm[((i % warm.length) + (f >> 1)) % warm.length] : env.col("#7a6a4a"); }
      // low casino block behind the arch, with lit gold windows
      P.rect(x + 4, yb - 8, 12, 9, env.col("#5a3340"));
      P.rect(x + 4, yb - 8, 12, 1, env.col("#6a3f4a"));
      for (var wy = yb - 6; wy < yb - 1; wy += 2)
        for (var wx = x + 6; wx < x + 15; wx += 3) P.px(wx, wy, neon > 0.3 ? "#ffe58a" : env.col("#5a5240"));
      // two arch posts in front, rising above the block
      P.rect(x + 2, yb - 12, 2, 13, env.col("#3a3f4a"));
      P.rect(x + 16, yb - 12, 2, 13, env.col("#3a3f4a"));
      // the arched top beam (bows up toward the middle), ringed with chasing bulbs
      for (var ax = 0; ax <= 14; ax++) {
        var t = ax / 14, bow = Math.round(Math.sin(t * Math.PI) * 3);
        P.px(x + 3 + ax, yb - 12 - bow, chase(ax));
      }
      // a bright marquee band slung under the beam (celebration, not a number)
      for (var bx = x + 5; bx <= x + 14; bx++) P.px(bx, yb - 10, chase(bx + 1));
      // starburst crowning the arch
      var sx = x + 10, sy = yb - 16, star = neon > 0.3 ? "#fff2b0" : env.col("#8a7a5a");
      P.px(sx, sy, star); P.px(sx - 1, sy + 1, star); P.px(sx, sy + 1, star); P.px(sx + 1, sy + 1, star);
      if (neon > 0.4) { P.px(sx - 2, sy + 1, star); P.px(sx + 2, sy + 1, star); P.px(sx, sy - 1, star); }
    }
  },
  {
    // La dame de fer — the real thing is warm brown ironwork, not grey: four
    // splayed legs curving up through two decks to a slender mast, the whole of it
    // openwork lattice you can see the sky through, and at night the famous golden
    // floodlight with its sparkle.
    id: "eiffel", name: "Eiffel Tower", cities: ["paris"], biomes: ["city", "plains"],
    tags: ["tower", "iron", "lattice", "landmark"],
    w: 16, h: 33, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var night = env.night || env.dayT < 0.4;
      // gilded under floodlight after dark, warm brown iron by day
      var iron = night ? "#c8912f" : env.col("#7a6244");
      var edge = night ? "#f0bd63" : env.col("#957a56");
      var deep = night ? "#8a6320" : env.col("#54432e");
      var cx = x + 8;
      // Half-width of the silhouette at each row above the ground — the splayed
      // legs, the pinch at the first deck, the long taper, then the spire. Written
      // out rather than curve-fitted so the profile is exactly Eiffel's: a wide
      // flare over the bottom fifth, then a slender shaft for most of the height.
      var HW = [7, 7, 6, 6, 5, 5, 4, 4, 4, 3, 3, 3, 3,
                2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
                1, 1, 1, 1, 1, 1, 0, 0, 0, 0];
      for (var k = 0; k < HW.length; k++) {
        var hw = HW[k], row = yb - k;
        if (hw === 0) { P.px(cx, row, edge); continue; }        // the spire
        P.px(cx - hw, row, edge); P.px(cx + hw, row, edge);      // the two curving edges
        if (k < 6) {                                            // legs: open sky between them
          P.px(cx - hw + 1, row, iron); P.px(cx + hw - 1, row, iron);
          continue;
        }
        if (hw <= 1) { P.px(cx, row, iron); continue; }         // the slender upper shaft
        for (var i = -hw + 1; i <= hw - 1; i++) {               // openwork cross-bracing
          if ((i + k) % 3 === 0) P.px(cx + i, row, iron);
          else if ((i - k) % 3 === 0) P.px(cx + i, row, deep);
        }
      }
      // the great arch springing between the legs, under the first deck
      P.line(cx - 6, yb - 1, cx - 4, yb - 4, edge);
      P.line(cx - 4, yb - 4, cx - 2, yb - 5, edge);
      P.line(cx + 6, yb - 1, cx + 4, yb - 4, edge);
      P.line(cx + 4, yb - 4, cx + 2, yb - 5, edge);
      P.rect(cx - 2, yb - 5, 5, 1, edge);
      // the two observation decks, each overhanging the shaft it sits on
      P.rect(cx - 5, yb - 5, 11, 1, deep); P.rect(cx - 6, yb - 6, 13, 1, edge);
      P.rect(cx - 3, yb - 12, 7, 1, deep); P.rect(cx - 4, yb - 13, 9, 1, edge);
      P.rect(cx - 2, yb - 28, 5, 1, edge);                      // the top platform
      // the summit: aircraft beacon, and the sparkle on the hour
      P.px(cx, yb - 32, night ? "#ff6a6a" : env.col("#c9c2b0"));
      if (night) {
        P.px(cx, yb - 31, "#ffe9a6");
        var f = env.frame || 0;
        if ((f >> 1) % 3 === 0) {                   // champagne sparkle
          var sx2 = cx - 4 + ((f * 5) % 9), sy2 = yb - 6 - ((f * 7) % 22);
          P.px(sx2, sy2, "#fff6d0");
        }
        P.withAlpha(0.14, function () { P.disc(cx, yb - 14, 10, "#ffcf6a"); });  // floodlit glow
      }
    }
  },
  {
    id: "big-ben", name: "Big Ben", cities: ["london"], biomes: ["city"],
    tags: ["tower", "clock", "gothic", "landmark"],
    w: 8, h: 30, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var stone = env.col("#c9a86a"), dk = env.col("#a5854a"), cop = env.col("#3f8a6a");
      P.rect(x + 1, yb - 24, 6, 24, stone);            // tower shaft
      P.rect(x + 1, yb - 13, 6, 1, dk);                // string course
      P.rect(x + 2, yb - 23, 4, 3, env.col("#3a3320")); // belfry openings
      // lit clock face near the top
      var face = (env.night || env.dayT < 0.4) ? "#fff2b0" : env.col("#efe7cf");
      P.disc(x + 4, yb - 16, 2, face);
      P.px(x + 4, yb - 16, env.col("#2a2418"));        // hub
      P.px(x + 4, yb - 17, env.col("#2a2418"));        // hour hand
      P.px(x + 5, yb - 16, env.col("#2a2418"));        // minute hand
      // pointed copper spire
      P.rect(x + 2, yb - 27, 4, 3, cop);
      P.px(x + 3, yb - 28, cop); P.px(x + 4, yb - 28, cop);
      P.px(x + 3, yb - 29, cop);
      P.px(x + 3, yb - 30, env.col("#d4b24a"));        // gilt finial
    }
  },
  {
    id: "opera-house", name: "Sydney Opera House", cities: ["sydney"], biomes: ["coast", "city"],
    tags: ["sails", "modern", "waterfront", "landmark"],
    w: 21, h: 14, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var sail = env.col("#f2f5f7"), rim = env.col("#c4ced4"), base = env.col("#9aa2a8");
      P.rect(x, yb - 2, 21, 2, base);                  // podium
      P.rect(x, yb - 1, 21, 1, env.col("#828a90"));    // waterline shadow
      // Each shell is a quarter-ellipse: a straight tall back edge on the right,
      // its leading edge curving down to the left — the sails all lean the same
      // way. Drawn back (short) to front (tall) so they overlap like the real roof.
      function shell(sx, sw, maxH) {
        for (var i = 0; i < sw; i++) {
          var f = (sw - 1 - i) / sw;                   // 0 at the tall right edge → 1 at the left tip
          var hh = Math.round(maxH * Math.sqrt(Math.max(0, 1 - f * f)));
          if (hh < 1) hh = 1;
          var top = yb - 2 - hh;
          P.rect(sx + i, top, 1, hh, sail);
          P.px(sx + i, top, rim);                      // curved leading rim
        }
        P.rect(sx + sw - 1, yb - 2 - maxH, 1, maxH, rim); // straight back spine
      }
      shell(x + 0, 6, 5);                              // small trailing sail (left pod)
      shell(x + 3, 8, 11);                             // tall main sail
      shell(x + 10, 5, 4);                             // small trailing sail (right pod)
      shell(x + 12, 8, 9);                             // second tall sail
    }
  },
  {
    id: "christ-redeemer", name: "Christ the Redeemer", cities: ["rio de janeiro", "rio"], biomes: ["city", "coast", "mountain"],
    tags: ["statue", "hill", "arms-out", "landmark"],
    w: 14, h: 20, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var hill = env.col("#3f6a3a"), hillDk = env.col("#33562f"),
          stone = env.col("#d2d6d8"), shade = env.col("#a6acb0"), dk = env.col("#868c90");
      // Corcovado — a steep, rounded green peak rising to the summit platform.
      for (var i = 0; i < 14; i++) {
        var d = i - 7;
        var hh = Math.round(6 - d * d * 0.11);
        if (hh < 1) hh = 1;
        P.rect(x + i, yb - hh, 1, hh, (i & 3) === 0 ? hillDk : hill);
      }
      var base = yb - 6;                                // summit platform (peak top row)
      P.rect(x + 5, base - 3, 4, 3, dk);               // pedestal
      P.rect(x + 5, base - 3, 4, 1, shade);            // pedestal cap
      // Robed body — a slim column flaring to a draped hem.
      P.rect(x + 6, base - 12, 2, 9, stone);
      P.px(x + 5, base - 4, stone); P.px(x + 8, base - 4, stone);   // robe hem flare
      P.px(x + 5, base - 5, shade); P.px(x + 8, base - 5, shade);
      P.px(x + 8, base - 8, shade);                    // fold shadow down one side
      // Outstretched arms — the iconic cross, tapering to draped sleeve tips.
      P.rect(x + 1, base - 11, 12, 1, stone);          // full arm span
      P.rect(x + 5, base - 10, 4, 1, stone);           // chest / shoulders (2px-thick centre)
      P.px(x + 1, base - 10, shade); P.px(x + 12, base - 10, shade);  // sleeve tips droop
      P.px(x + 2, base - 10, stone); P.px(x + 11, base - 10, stone);
      // Head.
      P.px(x + 6, base - 13, stone); P.px(x + 7, base - 13, stone);
      P.px(x + 6, base - 14, shade);
    }
  },
  {
    id: "mount-fuji", name: "Mount Fuji", cities: ["shizuoka", "fuji", "hakone", "gotemba"], biomes: ["mountain", "coast", "forest"],
    tags: ["mountain", "volcano", "snow", "landmark"],
    w: 28, h: 16, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var rock = env.col("#5b6b86"), snow = env.col("#eef4f8"), dk = env.col("#47566e");
      for (var i = 0; i < 28; i++) {
        var hh = Math.round(15 - Math.abs(i - 14) * 1.0);
        if (hh < 1) hh = 1;
        P.rect(x + i, yb - hh, 1, hh, (i & 3) === 0 ? dk : rock);
        // jagged snow cap draping the summit flanks
        var depth = hh - 8;
        if (depth > 0) {
          var jag = ((i * 7) % 5 === 0) ? 1 : 0;
          for (var s = 0; s < depth - jag; s++) P.px(x + i, yb - hh + s, snow);
        }
      }
    }
  },
  {
    // A DISTANT bridge across the strait, placed by the compositor over the water
    // (place:"water") — San Francisco is a peninsula, so the honest view is from
    // the beach, across the water, to the bridge linking two headlands far off.
    id: "golden-gate", name: "Golden Gate Bridge", cities: ["san francisco"], biomes: ["coast", "city"],
    tags: ["bridge", "suspension", "red", "landmark"], place: "water",
    w: 50, h: 16, anchor: "baseline",
    draw: function (P, x, yb, env) {
      // Spans the FULL width: the headlands run right off both edges, so no strip
      // of open water is left showing beside the bridge.
      var W = 50, deckY = yb;
      var orange = env.col("#c85434"), dk = env.col("#9c3f22"), cable = env.col("#8a3520");
      var land = env.col("#425a46"), landDk = env.col("#33472f");
      // the two headlands the bridge connects (far shore, sloping into the strait)
      for (var i = 0; i < 7; i++) {
        var lh = 3 - (i >> 1); if (lh < 0) lh = 0;
        P.rect(x + i, deckY - 1 - lh, 1, 3 + lh, (i % 3) === 0 ? landDk : land);
        P.rect(x + W - 1 - i, deckY - 1 - lh, 1, 3 + lh, (i % 3) === 0 ? landDk : land);
      }
      var lx = x + 6, rx = x + W - 7, mid = x + (W >> 1);
      var t1 = x + 16, t2 = x + 32, top = deckY - 12;
      P.rect(lx, deckY, rx - lx + 1, 1, dk);           // roadway deck across the gap
      // two towers rising from the water
      P.rect(t1, top, 2, deckY - top, orange); P.rect(t2, top, 2, deckY - top, orange);
      P.px(t1, top - 1, orange); P.px(t2, top - 1, orange);
      P.rect(t1, top + 4, 2, 1, dk); P.rect(t2, top + 4, 2, 1, dk);   // cross braces
      // main suspension cables: shore → tower → mid-sag → tower → shore
      P.line(lx, deckY - 1, t1, top, cable);
      P.line(t1 + 1, top, mid, deckY - 4, cable);
      P.line(mid, deckY - 4, t2, top, cable);
      P.line(t2 + 1, top, rx, deckY - 1, cable);
      // hanger ropes, dropped from the cable's actual height at each column
      function seg(px, x0, y0, x1, y1) { return Math.round(y0 + (y1 - y0) * (px - x0) / (x1 - x0)); }
      function cableY(px) {
        if (px <= t1) return seg(px, lx, deckY - 1, t1, top);
        if (px <= mid) return seg(px, t1, top, mid, deckY - 4);
        if (px <= t2) return seg(px, mid, deckY - 4, t2, top);
        return seg(px, t2, top, rx, deckY - 1);
      }
      for (var hx = lx + 2; hx < rx; hx += 3) {
        if (Math.abs(hx - t1) < 2 || Math.abs(hx - t2) < 2) continue;   // not through the towers
        var cy = cableY(hx);
        if (cy < deckY - 1) P.line(hx, cy + 1, hx, deckY - 1, cable);
      }
    }
  },
  {
    id: "gateway-arch", name: "Gateway Arch", cities: ["st louis"], biomes: ["city", "plains"],
    tags: ["arch", "steel", "monument", "landmark"],
    w: 20, h: 21, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var m = env.col("#b8c0c6"), hi = env.col("#e8eef2");
      for (var i = 0; i < 20; i++) {
        var t = (i - 9.5) / 9.5;                       // -1..1 across the span
        var yy = Math.round(20 * (1 - t * t));         // catenary-ish rise
        P.px(x + i, yb - yy, hi);                      // stainless glint edge
        if (yy > 0) P.px(x + i, yb - yy + 1, m);       // body / thickness
      }
    }
  },
  {
    id: "capitol-dome", name: "Capitol Dome", cities: ["washington", "austin", "denver"], biomes: ["city", "plains"],
    tags: ["dome", "government", "neoclassical", "landmark"],
    w: 18, h: 18, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var stone = env.col("#e4e2da"), dk = env.col("#c2c0b6"), dome = env.col("#eceae2");
      P.rect(x, yb - 7, 18, 8, stone);                 // main block
      for (var c = 0; c < 8; c++) P.rect(x + 2 + c * 2, yb - 6, 1, 6, dk); // colonnade
      P.rect(x, yb - 8, 18, 1, dk);                    // entablature
      P.rect(x + 4, yb - 10, 10, 2, stone);            // attic base
      P.disc(x + 9, yb - 13, 3, dome);                 // dome
      P.rect(x + 6, yb - 11, 6, 2, dk);                // drum band under dome
      P.px(x + 9, yb - 16, dk);                        // lantern
      P.px(x + 9, yb - 17, env.night ? "#ffe58a" : env.col("#f4f4ec")); // finial
    }
  },
  {
    id: "cn-tower", name: "CN Tower", cities: ["toronto"], biomes: ["city"],
    tags: ["tower", "needle", "observation", "landmark"],
    w: 8, h: 32, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var m = env.col("#b8bcc0"), dk = env.col("#8a9096");
      var cx = x + 4;
      // tapered concrete shaft up to the pod
      for (var y = 0; y < 22; y++) {
        var t = y / 22, w = Math.max(1, 3 - Math.round(t * 2));
        P.rect(cx - ((w - 1) >> 1), yb - y, w, 1, m);
      }
      // SkyPod bulge
      P.rect(cx - 2, yb - 23, 5, 3, dk);
      P.rect(cx - 1, yb - 24, 3, 1, m);
      // upper mast + aircraft beacon (light source)
      P.rect(cx, yb - 31, 1, 8, dk);
      P.px(cx, yb - 31, env.night ? "#ff5a5a" : m);
    }
  },
  {
    id: "colosseum", name: "Colosseum", cities: ["rome"], biomes: ["city"],
    tags: ["amphitheatre", "arches", "ruin", "landmark"],
    w: 22, h: 10, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var stone = env.col("#d8c49a"), dk = env.col("#b09a6a"), sh = env.col("#7a6440");
      var W = 22;
      for (var i = 0; i < W; i++) {
        var t = (i - (W - 1) / 2) / ((W - 1) / 2);
        var top = Math.round(9 * (1 - 0.25 * t * t));  // gently domed oval wall
        if (i > W - 5) top = Math.max(3, top - (i - (W - 5)) * 2); // ruined far side
        if (top < 1) top = 1;
        P.rect(x + i, yb - top, 1, top, stone);
        P.px(x + i, yb - top, dk);                     // cornice edge
      }
      // two tiers of arch openings, skipping the collapsed end
      for (var a = 1; a < W - 6; a += 3) {
        P.rect(x + a, yb - 3, 2, 2, sh);
        P.rect(x + a, yb - 6, 2, 2, sh);
      }
    }
  },
  {
    id: "taj-mahal", name: "Taj Mahal", cities: ["agra"], biomes: ["city", "plains", "wetland"],
    tags: ["dome", "marble", "palace", "landmark"],
    w: 22, h: 18, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var white = env.col("#eef0ec"), sh = env.col("#cfd2cc"), dk = env.col("#b6bab2");
      P.rect(x, yb - 2, 22, 2, sh);                    // marble plinth
      // four corner minarets
      P.rect(x + 1, yb - 13, 1, 11, white); P.px(x + 1, yb - 14, dk);
      P.rect(x + 20, yb - 13, 1, 11, white); P.px(x + 20, yb - 14, dk);
      P.rect(x + 4, yb - 11, 1, 9, sh); P.px(x + 4, yb - 12, dk);
      P.rect(x + 17, yb - 11, 1, 9, sh); P.px(x + 17, yb - 12, dk);
      // main mausoleum block
      P.rect(x + 6, yb - 9, 10, 7, white);
      P.rect(x + 9, yb - 8, 4, 6, env.col("#7a8a86")); // great arched iwan
      P.px(x + 10, yb - 9, white); P.px(x + 11, yb - 9, white);
      // drum + bulbous onion dome
      P.rect(x + 9, yb - 11, 4, 2, white);
      P.disc(x + 11, yb - 13, 3, white);
      P.px(x + 8, yb - 12, white); P.px(x + 14, yb - 12, white); // dome shoulders
      P.px(x + 11, yb - 16, white);                    // onion neck
      P.px(x + 11, yb - 17, env.col("#d4b24a"));        // gold finial
    }
  },
  {
    id: "sydney-bridge", name: "Sydney Harbour Bridge", cities: ["sydney"], biomes: ["coast", "city"],
    tags: ["bridge", "arch", "steel", "landmark"],
    w: 28, h: 16, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var steel = env.col("#7a828a"), dk = env.col("#565c62"), pyl = env.col("#c8c2b4");
      P.rect(x, yb - 5, 28, 1, dk);                    // roadway deck
      P.rect(x + 2, yb - 8, 2, 8, pyl);                // stone pylons
      P.rect(x + 23, yb - 8, 2, 8, pyl);
      // the "coathanger" steel arch
      for (var i = 3; i < 25; i++) {
        var t = (i - 14) / 11;
        var yy = Math.round(5 + 9 * (1 - t * t));
        P.px(x + i, yb - yy, steel);
        if (yy > 6) P.px(x + i, yb - yy - 1, dk);      // upper chord thickness
      }
      // vertical hangers from arch down to the deck
      for (var hxi = 5; hxi < 24; hxi += 3) {
        var t2 = (hxi - 14) / 11;
        var yy2 = Math.round(5 + 9 * (1 - t2 * t2));
        if (yy2 > 6) P.line(x + hxi, yb - 5, x + hxi, yb - yy2, steel);
      }
    }
  }
];
