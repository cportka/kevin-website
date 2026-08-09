/* Birds batch A — flying silhouettes, all anchor:"center". (x, y) is the bird's
   midpoint; wings flap on (env.frame>>2)&1; env.dir (±1) points the head toward
   travel. Most share the gull's two-arc "M" flap in different colours/sizes:
   crow/sparrow small & universal, eagle/hawk broad-winged, owl rounder with two
   eyes, cardinal red-crested, flamingo pink with a stretched neck + trailing legs,
   duck green-headed. Colours pick a dimmer variant at night via env.dayT<0.3
   (matching birds-core); no env.col so a plain env never throws. Authored to read
   right; the compositor mirrors left-bound copies. */

export default [
  {
    id: "crow", name: "Crow", biomes: ["forest", "city", "plains", "farmland", "mountain", "desert", "savanna", "canyon", "wetland", "lake", "coast", "tundra", "jungle"],
    tags: ["bird", "sky", "black"], w: 5, h: 2, anchor: "center", rarity: 3,
    draw: function (P, x, y, env) {
      var up = ((env.frame >> 2) & 1) === 0;
      var c = env.dayT < 0.3 ? "#12151a" : "#20242a";
      if (up) { P.px(x - 2, y, c); P.px(x - 1, y - 1, c); P.px(x, y, c); P.px(x + 1, y - 1, c); P.px(x + 2, y, c); }
      else { P.px(x - 2, y - 1, c); P.px(x - 1, y, c); P.px(x, y - 1, c); P.px(x + 1, y, c); P.px(x + 2, y - 1, c); }
    }
  },
  {
    id: "robin", name: "Robin", biomes: ["forest", "plains", "city", "farmland", "wetland", "savanna", "mountain"],
    tags: ["bird", "sky", "songbird"], w: 5, h: 2, anchor: "center", rarity: 2.5,
    draw: function (P, x, y, env) {
      var up = ((env.frame >> 2) & 1) === 0;
      var back = env.dayT < 0.3 ? "#4a3826" : "#6e5236";
      var breast = env.dayT < 0.3 ? "#8a4020" : "#d2622e";
      if (up) { P.px(x - 2, y, back); P.px(x - 1, y - 1, back); P.px(x, y, breast); P.px(x + 1, y - 1, back); P.px(x + 2, y, back); }
      else { P.px(x - 2, y - 1, back); P.px(x - 1, y, back); P.px(x, y - 1, breast); P.px(x + 1, y, back); P.px(x + 2, y - 1, back); }
    }
  },
  {
    id: "cardinal", name: "Cardinal", biomes: ["forest", "city", "plains", "farmland", "wetland", "savanna"],
    tags: ["bird", "sky", "songbird", "red"], w: 5, h: 2, anchor: "center", rarity: 1.5,
    draw: function (P, x, y, env) {
      var up = ((env.frame >> 2) & 1) === 0;
      var red = env.dayT < 0.3 ? "#7e1c14" : "#cc2a1e";
      if (up) {
        P.px(x - 2, y, red); P.px(x - 1, y - 1, red); P.px(x, y, red); P.px(x + 1, y - 1, red); P.px(x + 2, y, red);
        P.px(x, y - 1, red);                      // crest / raised head
      } else {
        P.px(x - 2, y - 1, red); P.px(x - 1, y, red); P.px(x, y - 1, red); P.px(x + 1, y, red); P.px(x + 2, y - 1, red);
      }
    }
  },
  {
    id: "eagle", name: "Eagle", biomes: ["mountain", "forest", "canyon", "tundra", "lake", "coast"],
    tags: ["bird", "sky", "raptor", "large"], w: 7, h: 3, anchor: "center", rarity: 0.5,
    draw: function (P, x, y, env) {
      var up = ((env.frame >> 2) & 1) === 0;
      var d = env.dir || 1;
      var body = env.dayT < 0.3 ? "#2e2418" : "#4a3826";
      var head = env.dayT < 0.3 ? "#9a968a" : "#e8e2d2";
      if (up) {
        P.px(x - 3, y, body); P.px(x - 2, y - 1, body); P.px(x - 1, y - 2, body);
        P.px(x + 1, y - 2, body); P.px(x + 2, y - 1, body); P.px(x + 3, y, body);
        P.px(x, y - 1, body); P.px(x + d, y - 1, head);
      } else {
        P.px(x - 3, y - 2, body); P.px(x - 2, y - 1, body); P.px(x - 1, y, body);
        P.px(x + 1, y, body); P.px(x + 2, y - 1, body); P.px(x + 3, y - 2, body);
        P.px(x, y, body); P.px(x + d, y, head);
      }
    }
  },
  {
    id: "hawk", name: "Hawk", biomes: ["mountain", "forest", "plains", "desert", "canyon", "savanna", "farmland"],
    tags: ["bird", "sky", "raptor"], w: 7, h: 2, anchor: "center", rarity: 0.8,
    draw: function (P, x, y, env) {
      var up = ((env.frame >> 2) & 1) === 0;
      var d = env.dir || 1;
      var body = env.dayT < 0.3 ? "#4e3824" : "#7a5636";
      var belly = env.dayT < 0.3 ? "#8a7a60" : "#d8c2a0";
      if (up) {
        P.px(x - 3, y, body); P.px(x - 2, y - 1, body); P.px(x - 1, y - 1, body); P.px(x + 1, y - 1, body); P.px(x + 2, y - 1, body); P.px(x + 3, y, body);
        P.px(x, y, body); P.px(x + d, y, belly);
      } else {
        P.px(x - 3, y - 1, body); P.px(x - 2, y, body); P.px(x - 1, y, body); P.px(x + 1, y, body); P.px(x + 2, y, body); P.px(x + 3, y - 1, body);
        P.px(x, y - 1, body); P.px(x + d, y - 1, belly);
      }
    }
  },
  {
    id: "sparrow", name: "Sparrow", biomes: ["forest", "city", "plains", "farmland", "desert", "savanna", "wetland", "coast", "lake", "mountain", "canyon", "jungle"],
    tags: ["bird", "sky", "songbird", "small"], w: 3, h: 2, anchor: "center", rarity: 3,
    draw: function (P, x, y, env) {
      var up = ((env.frame >> 2) & 1) === 0;
      var c = env.dayT < 0.3 ? "#5a4630" : "#8a6a44";
      if (up) { P.px(x - 1, y, c); P.px(x, y - 1, c); P.px(x + 1, y, c); }
      else { P.px(x - 1, y - 1, c); P.px(x, y, c); P.px(x + 1, y - 1, c); }
    }
  },
  {
    id: "owl", name: "Owl", biomes: ["forest", "mountain", "tundra", "wetland", "farmland", "plains"],
    tags: ["bird", "sky", "raptor", "night"], w: 5, h: 3, anchor: "center", rarity: 0.5,
    draw: function (P, x, y, env) {
      var up = ((env.frame >> 2) & 1) === 0;
      var body = env.dayT < 0.3 ? "#4e4232" : "#7a674c";
      var eye = env.dayT < 0.3 ? "#c8b46a" : "#f0e6c8";
      if (up) { P.px(x - 2, y, body); P.px(x - 1, y - 1, body); P.px(x + 1, y - 1, body); P.px(x + 2, y, body); }
      else { P.px(x - 2, y - 1, body); P.px(x - 1, y, body); P.px(x + 1, y, body); P.px(x + 2, y - 1, body); }
      P.px(x, y, body); P.px(x, y - 1, body); P.px(x, y - 2, body);  // round head + body
      P.px(x - 1, y - 2, eye); P.px(x + 1, y - 2, eye);              // two big eyes
    }
  },
  {
    id: "flamingo", name: "Flamingo", biomes: ["wetland", "coast", "lake"],
    tags: ["bird", "sky", "wader", "pink"], w: 7, h: 3, anchor: "center", rarity: 0.4,
    draw: function (P, x, y, env) {
      var up = ((env.frame >> 2) & 1) === 0;
      var d = env.dir || 1;
      var pink = env.dayT < 0.3 ? "#a85a78" : "#ec86ad";
      var legs = env.dayT < 0.3 ? "#94425e" : "#d85e88";
      var beak = env.dayT < 0.3 ? "#241a1e" : "#3a2a30";
      P.px(x, y, pink); P.px(x - d, y, pink);                         // body
      P.px(x + d, y, pink); P.px(x + 2 * d, y - 1, pink); P.px(x + 3 * d, y - 1, pink); // neck + head
      P.px(x + 3 * d, y, beak);                                       // down-hooked beak
      P.px(x - 2 * d, y + 1, legs); P.px(x - 3 * d, y + 1, legs);     // trailing legs
      if (up) { P.px(x, y - 1, pink); P.px(x - d, y - 1, pink); }     // wing up
      else { P.px(x, y + 1, pink); P.px(x - d, y + 1, pink); }        // wing down
    }
  },
  {
    id: "duck", name: "Duck", biomes: ["lake", "wetland", "coast", "farmland", "plains"],
    tags: ["bird", "sky", "waterfowl"], w: 7, h: 2, anchor: "center", rarity: 1.5,
    draw: function (P, x, y, env) {
      var up = ((env.frame >> 2) & 1) === 0;
      var d = env.dir || 1;
      var body = env.dayT < 0.3 ? "#463322" : "#6e5236";
      var head = env.dayT < 0.3 ? "#1e4228" : "#2f6a3e";
      var beak = env.dayT < 0.3 ? "#8a7028" : "#d0a83e";
      if (up) { P.px(x - 2, y, body); P.px(x - 1, y - 1, body); P.px(x, y, body); P.px(x + 1, y - 1, body); P.px(x + 2, y, body); }
      else { P.px(x - 2, y - 1, body); P.px(x - 1, y, body); P.px(x, y - 1, body); P.px(x + 1, y, body); P.px(x + 2, y - 1, body); }
      P.px(x - 3 * d, y, body);                                       // stubby tail
      P.px(x + 2 * d, y, head);                                       // outstretched head
      P.px(x + 3 * d, y, beak);                                       // bill
    }
  }
];
