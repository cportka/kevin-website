/* Vehicles batch C — watercraft + rail, following the vehicles-core idiom.
   Boats set layer:"water": they spawn in the water band, so `yb` is the
   WATERLINE — the hull rests on row `yb` and everything is drawn upward, exactly
   like a road vehicle rests its wheels on `yb`. Sprite faces right (+x is the
   bow / the front of the train). `env.col` dims paint at night while window glass
   (shared cyan W_), headlamps and lit signs stay bright. Sails sway with
   env.wind; wakes, smoke plumes, paddles, coupling rods animate off env.frame.
   tram & steam-train are layer:"road" (they run on rails, wheels on `yb`). */

var W_ = "#bfe8ff"; // window glass

export default [
  {
    id: "sailboat", name: "Sailboat", biomes: ["coast", "lake", "ocean", "wetland"],
    tags: ["vehicle", "water", "boat", "sail"], w: 13, h: 13, anchor: "baseline", layer: "water",
    draw: function (P, x, yb, env) {
      var col = env.col, wind = env.wind || 0;
      var hull = col("#7a4a22"), deck = col("#a86a34"), mast = col("#caa060"),
          sailc = col("#f2f0e6"), sail2 = col("#d8d4c4"), foam = col("#dfeef7"), pennant = col("#d43b3b");
      var sway = Math.round(Math.sin(env.frame * (0.04 + wind * 0.05)) * (wind * 1.5));
      // hull resting on the waterline (yb)
      P.rect(x + 1, yb - 2, 9, 2, hull);
      P.rect(x + 1, yb - 3, 9, 1, deck);                 // deck line
      P.px(x, yb - 3, hull);                             // upswept stern (left)
      P.px(x + 10, yb - 2, hull); P.px(x + 11, yb - 3, hull); // upswept bow (right)
      // mast
      var mx = x + 3;
      P.line(mx, yb - 3, mx, yb - 12, mast);
      // triangular mainsail: luff on the mast, leech falling to the clew near the bow
      for (var i = 0; i <= 8; i++) {
        var ry = yb - 12 + i;
        var topSway = Math.round(sway * (8 - i) / 8);
        var rightX = mx + i + topSway;                   // widens downward
        P.rect(mx, ry, rightX - mx + 1, 1, (i & 1) ? sailc : sail2);
      }
      // masthead pennant (streams with the wind)
      P.px(mx + 1 + (sway > 0 ? 1 : 0), yb - 13, pennant);
      // foam at the waterline (animated)
      if ((env.frame >> 2) & 1) { P.px(x, yb, foam); P.px(x + 11, yb, foam); }
      else { P.px(x + 1, yb, foam); P.px(x + 10, yb, foam); }
    }
  },
  {
    id: "motorboat", name: "Motorboat", biomes: ["coast", "lake", "ocean", "wetland"],
    tags: ["vehicle", "water", "boat", "fast"], w: 12, h: 5, anchor: "baseline", layer: "water",
    draw: function (P, x, yb, env) {
      var col = env.col;
      var hull = col("#d63a3a"), hull2 = col("#a82a2a"), deck = col("#eceff2"), seat = col("#c23b3b"), foam = col("#dfeef7");
      // sleek hull, pointed bow up-right
      P.rect(x, yb - 2, 10, 2, hull);
      P.rect(x, yb - 1, 10, 1, hull2);                   // chine shadow
      P.px(x + 10, yb - 2, hull); P.px(x + 11, yb - 3, hull2); // bow point
      // deck + windscreen
      P.rect(x + 2, yb - 3, 6, 1, deck);
      P.rect(x + 6, yb - 4, 2, 1, W_);                   // windscreen
      P.px(x + 3, yb - 4, seat);                         // seat back
      // planing wake behind the stern (animated)
      if ((env.frame >> 2) & 1) { P.px(x, yb, foam); P.px(x + 2, yb, foam); }
      else { P.px(x + 1, yb, foam); P.px(x + 3, yb, foam); }
      if (env.night) P.px(x + 11, yb - 3, "#fff2b0");
    }
  },
  {
    id: "canoe", name: "Canoe", biomes: ["coast", "lake", "ocean", "wetland"],
    tags: ["vehicle", "water", "boat", "paddle"], w: 11, h: 5, anchor: "baseline", layer: "water",
    draw: function (P, x, yb, env) {
      var col = env.col;
      var hull = col("#8a5a2a"), rim = col("#b0793a"), skin = "#d7a26a", shirt = col("#c94f3d"), paddle = col("#caa060"), foam = col("#dfeef7");
      // open hull with upswept ends
      P.rect(x + 1, yb - 1, 9, 1, hull);
      P.rect(x + 1, yb - 2, 9, 1, rim);                  // gunwale
      P.px(x, yb - 2, hull); P.px(x + 10, yb - 2, hull); // rising ends
      P.px(x, yb - 3, rim); P.px(x + 10, yb - 3, rim);   // stem tips
      // seated paddler
      P.px(x + 5, yb - 3, shirt); P.px(x + 5, yb - 4, skin);
      // paddle stroke (animated)
      if ((env.frame >> 2) & 1) P.line(x + 6, yb - 3, x + 8, yb - 1, paddle);
      else P.line(x + 6, yb - 3, x + 8, yb, paddle);
      P.px(x + 10, yb, foam);
    }
  },
  {
    id: "kayak", name: "Kayak", biomes: ["coast", "lake", "ocean", "wetland"],
    tags: ["vehicle", "water", "boat", "paddle"], w: 11, h: 5, anchor: "baseline", layer: "water",
    draw: function (P, x, yb, env) {
      var col = env.col;
      var hull = col("#e0a12a"), deck = col("#f0c85a"), skin = "#d7a26a", vest = col("#2f7d8a"), paddle = col("#dcdce0"), foam = col("#dfeef7");
      // sleek closed-deck hull, pointed both ends
      P.rect(x + 1, yb - 1, 9, 1, hull);
      P.px(x, yb - 1, hull); P.px(x + 10, yb - 1, hull);
      P.rect(x + 2, yb - 2, 7, 1, deck);
      P.px(x + 1, yb - 2, deck); P.px(x + 9, yb - 2, deck);
      // paddler in the cockpit
      P.px(x + 5, yb - 3, vest); P.px(x + 5, yb - 4, skin);
      // double-bladed paddle (rocks as it strokes)
      if ((env.frame >> 2) & 1) P.line(x + 3, yb - 2, x + 7, yb - 4, paddle);
      else P.line(x + 3, yb - 4, x + 7, yb - 2, paddle);
      P.px(x + 10, yb, foam);
    }
  },
  {
    id: "gondola", name: "Gondola", biomes: ["coast", "lake", "ocean", "wetland"],
    tags: ["vehicle", "water", "boat"], w: 13, h: 8, anchor: "baseline", layer: "water", rarity: 0.8,
    draw: function (P, x, yb, env) {
      var col = env.col;
      var hull = col("#1b1b22"), trim = col("#c9a24a"), skin = "#d7a26a", shirt = col("#e8e8ea"), seat = col("#7a1f1f"), pole = col("#caa060"), foam = col("#dfeef7");
      // long low black hull
      P.rect(x + 1, yb - 1, 11, 1, hull);
      P.rect(x + 2, yb - 2, 9, 1, hull);
      P.px(x + 1, yb - 2, hull); P.px(x, yb - 3, hull);  // stern curl (left)
      // tall curled ferro prow (right)
      P.line(x + 11, yb - 2, x + 12, yb - 6, trim);
      P.px(x + 11, yb - 7, trim); P.px(x + 10, yb - 7, trim); // comb top
      // passenger cushion mid-hull
      P.px(x + 6, yb - 3, seat); P.px(x + 7, yb - 3, seat);
      // gondolier standing at the stern
      P.px(x + 3, yb - 3, shirt); P.px(x + 3, yb - 4, shirt); P.px(x + 3, yb - 5, skin);
      // rowing pole (sweeps with the stroke)
      if ((env.frame >> 2) & 1) P.line(x + 4, yb - 4, x + 1, yb, pole);
      else P.line(x + 4, yb - 4, x, yb - 1, pole);
      P.px(x + 12, yb, foam);
    }
  },
  {
    id: "ferry", name: "Ferry", biomes: ["coast", "lake", "ocean", "wetland"],
    tags: ["vehicle", "water", "boat", "big"], w: 20, h: 12, anchor: "baseline", layer: "water", rarity: 0.6,
    draw: function (P, x, yb, env) {
      var col = env.col;
      var hull = col("#20486e"), stripe = col("#163454"), deck = col("#e8e8ec"), deck2 = col("#c8ccd2"), rail = col("#9aa0a6"), funnel = col("#d43b3b"), smoke = col("#9a9a9a"), foam = col("#dfeef7");
      // boxy hull
      P.rect(x, yb - 4, 20, 4, hull);
      P.rect(x, yb - 4, 20, 1, stripe);                  // waterline stripe
      P.px(x + 19, yb - 5, hull);                        // slight bow flare
      // main deck superstructure + window rows
      P.rect(x + 1, yb - 8, 17, 4, deck);
      for (var i = 0; i < 8; i++) { P.px(x + 2 + i * 2, yb - 7, W_); P.px(x + 2 + i * 2, yb - 5, W_); }
      // upper bridge deck
      P.rect(x + 3, yb - 10, 8, 2, deck2);
      for (var k = 0; k < 4; k++) P.px(x + 4 + k * 2, yb - 10, W_);
      P.px(x + 2, yb - 9, rail);                         // mast
      // funnel + smoke (animated)
      P.rect(x + 13, yb - 11, 2, 3, funnel);
      if ((env.frame >> 2) & 1) P.px(x + 13, yb - 12, smoke); else P.px(x + 14, yb - 12, smoke);
      if (env.night) P.px(x + 19, yb - 6, "#fff2b0");
      // foam along the waterline
      if ((env.frame >> 2) & 1) { P.px(x, yb, foam); P.px(x + 19, yb, foam); }
      else { P.px(x + 1, yb, foam); P.px(x + 18, yb, foam); }
    }
  },
  {
    id: "fishing-boat", name: "Fishing boat", biomes: ["coast", "lake", "ocean", "wetland"],
    tags: ["vehicle", "water", "boat", "work"], w: 16, h: 11, anchor: "baseline", layer: "water", rarity: 0.8,
    draw: function (P, x, yb, env) {
      var col = env.col;
      var hull = col("#2f6f5a"), hull2 = col("#1f4d3e"), house = col("#e6d8b0"), roof = col("#b23b3b"), mast = col("#8a6a3a"), net = col("#c8c0a0"), rail = col("#9aa0a6"), foam = col("#dfeef7");
      // hull, upswept bow (right)
      P.rect(x, yb - 3, 15, 3, hull);
      P.rect(x, yb - 3, 15, 1, hull2);                   // sheer stripe
      P.px(x + 15, yb - 3, hull); P.px(x + 15, yb - 4, hull); // bow
      P.px(x + 1, yb - 4, rail); P.px(x + 2, yb - 4, rail);   // stern rail
      // wheelhouse (forward)
      P.rect(x + 9, yb - 7, 4, 4, house);
      P.rect(x + 9, yb - 7, 4, 1, roof);
      P.rect(x + 10, yb - 6, 2, 2, W_);                  // window
      // mast + boom over the after deck
      P.line(x + 7, yb - 4, x + 7, yb - 10, mast);
      P.line(x + 7, yb - 9, x + 2, yb - 6, mast);        // boom
      P.line(x + 7, yb - 10, x + 13, yb - 7, rail);      // stay to wheelhouse
      // hanging net (sways)
      var s = ((env.frame >> 2) & 1) ? 0 : 1;
      P.px(x + 3 + s, yb - 5, net); P.px(x + 3 + s, yb - 4, net); P.px(x + 4 + s, yb - 5, net);
      if (env.night) P.px(x + 15, yb - 5, "#fff2b0");
      // foam
      if ((env.frame >> 2) & 1) { P.px(x, yb, foam); P.px(x + 15, yb, foam); }
      else { P.px(x + 1, yb, foam); P.px(x + 14, yb, foam); }
    }
  },
  {
    id: "tugboat", name: "Tugboat", biomes: ["coast", "lake", "ocean", "wetland"],
    tags: ["vehicle", "water", "boat", "work"], w: 12, h: 10, anchor: "baseline", layer: "water",
    draw: function (P, x, yb, env) {
      var col = env.col;
      var hull = col("#c0392b"), hull2 = col("#8a281f"), house = col("#f0ead6"), roof = col("#2f6f8a"), stack = col("#2b2b30"), band = col("#e8c14a"), smoke = col("#9a9a9a"), fender = "#141414", foam = col("#dfeef7");
      // stout hull
      P.rect(x + 1, yb - 3, 10, 3, hull);
      P.rect(x + 1, yb - 2, 10, 1, hull2);
      P.px(x + 11, yb - 3, hull); P.px(x + 11, yb - 4, hull); // bow rise (right)
      P.px(x + 11, yb - 2, fender); P.px(x + 11, yb - 1, fender); // bow fender
      // wheelhouse
      P.rect(x + 3, yb - 7, 5, 4, house);
      P.rect(x + 3, yb - 7, 5, 1, roof);
      P.rect(x + 4, yb - 6, 3, 2, W_);
      // smokestack + band
      P.rect(x + 2, yb - 8, 2, 3, stack);
      P.px(x + 2, yb - 7, band); P.px(x + 3, yb - 7, band);
      // smoke puff (animated, drifting up)
      if ((env.frame >> 2) & 1) { P.px(x + 2, yb - 9, smoke); P.px(x + 1, yb - 10, smoke); }
      else { P.px(x + 3, yb - 9, smoke); P.px(x + 3, yb - 10, smoke); }
      if (env.night) P.px(x + 11, yb - 5, "#fff2b0");
      // foam
      if ((env.frame >> 2) & 1) { P.px(x + 1, yb, foam); P.px(x + 11, yb, foam); }
      else { P.px(x, yb, foam); P.px(x + 10, yb, foam); }
    }
  },
  {
    id: "jet-ski", name: "Jet ski", biomes: ["coast", "lake", "ocean", "wetland"],
    tags: ["vehicle", "water", "fast", "fun"], w: 9, h: 5, anchor: "baseline", layer: "water",
    draw: function (P, x, yb, env) {
      var col = env.col;
      var body = col("#1f9ed6"), body2 = col("#166f99"), console = col("#20202a"), skin = "#d7a26a", vest = col("#e85d3a"), spray = col("#dfeef7");
      // hull, nose up at the bow (right)
      P.rect(x, yb - 2, 8, 2, body);
      P.rect(x, yb - 1, 8, 1, body2);
      P.px(x + 8, yb - 2, body); P.px(x + 8, yb - 3, body2); // nose
      // handlebar console
      P.px(x + 6, yb - 3, console); P.px(x + 6, yb - 4, console);
      // rider leaning forward
      P.px(x + 3, yb - 3, console); P.px(x + 4, yb - 3, vest); P.px(x + 4, yb - 4, skin);
      // rooster-tail spray behind the stern (animated)
      if ((env.frame >> 2) & 1) { P.px(x, yb - 2, spray); P.px(x, yb - 3, spray); }
      else { P.px(x + 1, yb - 2, spray); }
      P.px(x, yb, spray);
    }
  },
  {
    id: "tram", name: "Tram", biomes: ["city"],
    tags: ["vehicle", "road", "rail", "big"], w: 22, h: 11, anchor: "baseline", layer: "road", rarity: 0.8,
    draw: function (P, x, yb, env) {
      var col = env.col;
      var body = col("#c0392b"), cream = col("#efe7cf"), roof = col("#8a2a20"), door = col("#8a2a20"), pole = col("#7a7f85"), wire = col("#3a3a40"), tire = "#141414";
      // long body
      P.rect(x, yb - 8, 22, 7, body);
      P.rect(x, yb - 8, 22, 1, roof);                    // roof edge
      P.rect(x, yb - 6, 22, 2, cream);                   // window band base
      P.rect(x, yb - 1, 22, 1, "#1a1a1a");               // skirt
      // window row
      for (var i = 0; i < 7; i++) P.rect(x + 1 + i * 3, yb - 6, 2, 2, W_);
      // lit destination sign (front)
      P.rect(x + 18, yb - 8, 3, 1, "#ffcf6a");
      // door seams
      P.rect(x + 3, yb - 4, 1, 3, door); P.rect(x + 11, yb - 4, 1, 3, door);
      // bogie wheels on the rail
      P.px(x + 3, yb, tire); P.px(x + 5, yb, tire); P.px(x + 16, yb, tire); P.px(x + 18, yb, tire);
      // overhead wire + trolley pole to the contact shoe
      P.line(x, yb - 11, x + 21, yb - 11, wire);
      P.line(x + 8, yb - 8, x + 11, yb - 11, pole);
      if (env.night) P.px(x + 21, yb - 3, "#fff2b0");
    }
  },
  {
    id: "steam-train", name: "Steam train", biomes: ["mountain", "plains"],
    tags: ["vehicle", "road", "rail", "big"], w: 24, h: 12, anchor: "baseline", layer: "road", rarity: 0.7,
    draw: function (P, x, yb, env) {
      var col = env.col;
      var cab = col("#4a2a1a"), coal = "#1a1a1a", body = col("#2b2b30"), boiler = col("#3a3a42"), trim = col("#8a2a20"), brass = col("#caa24a"), stack = col("#20202a"), smoke = col("#b0b0b0"), cowc = col("#6a6a72"), tire = "#141414";
      var f = (env.frame >> 2) & 1;
      // tender (rear, left)
      P.rect(x, yb - 6, 6, 5, cab);
      P.rect(x + 1, yb - 6, 4, 1, coal);                 // coal heap
      // cab
      P.rect(x + 6, yb - 8, 5, 7, cab);
      P.rect(x + 6, yb - 8, 5, 1, trim);                 // cab roof
      P.rect(x + 7, yb - 7, 3, 2, W_);                   // cab window
      // boiler (long cylinder to the front/right)
      P.rect(x + 11, yb - 6, 10, 5, boiler);
      P.rect(x + 11, yb - 6, 10, 1, body);               // boiler top
      P.rect(x + 11, yb - 3, 10, 1, body);               // running-board shadow
      // smokebox front + headlamp
      P.rect(x + 21, yb - 6, 2, 5, body);
      P.px(x + 21, yb - 4, env.night ? "#fff2b0" : "#ffe6a0"); // headlamp
      // cowcatcher (front, right)
      P.line(x + 23, yb - 3, x + 23, yb - 1, cowc);
      P.px(x + 22, yb - 1, cowc); P.px(x + 23, yb, cowc);
      // steam dome + smokestack
      P.px(x + 14, yb - 7, brass);
      P.rect(x + 18, yb - 9, 2, 3, stack);
      P.px(x + 18, yb - 9, brass);                       // stack cap
      // smoke plume (animated, drifting up)
      if (f) { P.px(x + 18, yb - 10, smoke); P.px(x + 17, yb - 11, smoke); P.px(x + 16, yb - 12, smoke); }
      else { P.px(x + 19, yb - 10, smoke); P.px(x + 18, yb - 11, smoke); P.px(x + 18, yb - 12, smoke); }
      // driving wheels (bottoms on the rail) + coupling rod (animated)
      P.disc(x + 13, yb - 2, 2, tire); P.disc(x + 18, yb - 2, 2, tire);
      P.px(x + 13, yb - 2, brass); P.px(x + 18, yb - 2, brass);
      if (f) P.line(x + 13, yb - 1, x + 18, yb - 1, brass);
      else P.line(x + 13, yb - 3, x + 18, yb - 3, brass);
      // tender + pilot wheels
      P.px(x + 1, yb, tire); P.px(x + 4, yb, tire); P.px(x + 21, yb, tire);
    }
  }
];
