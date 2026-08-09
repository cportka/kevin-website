/* Animals batch A — large & farm mammals (ground layer).
   Feet on row yb, faces right, 2-frame walk from (env.frame>>2)&1; env.rough
   hunches the back and tucks the head. Sizes vary a lot here: bear and moose are
   big, fox is small. Colours wrapped in env.col so they read at night; noses/eyes
   stay as plain accents. Biomes chosen to fit forest/mountain/tundra/plains/
   farmland/savanna range animals. Authored nose-right; the engine mirrors. */

export default [
  {
    id: "bear", name: "Bear", biomes: ["forest", "mountain", "tundra"],
    tags: ["animal", "large", "wild", "predator"], w: 11, h: 9, anchor: "baseline", layer: "ground", rarity: 0.5,
    draw: function (P, x, yb, env) {
      var body = env.col("#5a3f2a"), dark = env.col("#3d2a1a"), snout = env.col("#7a5738");
      var step = (env.frame >> 2) & 1, s = step ? 1 : 0;
      var top = env.rough ? yb - 5 : yb - 6;             // hunch lowers the back
      P.rect(x + 1, top, 7, (yb - 1) - top, body);        // bulky body → belly
      P.disc(x + 3, top, 2, body);                        // shoulder hump
      P.rect(x + 7, yb - 4, 3, 3, body);                  // head
      P.px(x + 7, yb - 5, dark); P.px(x + 9, yb - 5, dark); // rounded ears
      P.px(x + 10, yb - 3, snout); P.px(x + 10, yb - 2, snout); // muzzle
      P.px(x + 9, yb - 3, dark);                          // nose/eye
      P.rect(x + 1 + s, yb - 1, 2, 2, dark);              // back leg
      P.rect(x + 5 - s, yb - 1, 2, 2, dark);              // front leg
    }
  },
  {
    id: "wolf", name: "Wolf", biomes: ["forest", "mountain", "tundra", "plains"],
    tags: ["animal", "medium", "wild", "predator"], w: 10, h: 7, anchor: "baseline", layer: "ground", rarity: 0.6,
    draw: function (P, x, yb, env) {
      var body = env.col("#8b8b8b"), dark = env.col("#5f5f5f"), light = env.col("#b8b8b8");
      var step = (env.frame >> 2) & 1, s = step ? 1 : 0;
      var top = env.rough ? yb - 4 : yb - 5;
      P.line(x, yb - 3, x - 1, yb - 4, dark); P.px(x, yb - 4, body);   // bushy tail
      P.rect(x + 1, top, 5, (yb - 1) - top, body);        // lean body
      P.px(x + 3, yb - 3, light);                         // flank highlight
      P.rect(x + 6, yb - 5, 2, 2, body);                  // neck + head
      P.px(x + 8, yb - 4, body); P.px(x + 9, yb - 4, dark); // snout + nose
      P.px(x + 6, yb - 6, dark); P.px(x + 7, yb - 6, dark); // pointed ears
      P.rect(x + 1 + s, yb - 1, 1, 2, dark);              // back leg
      P.rect(x + 5 - s, yb - 1, 1, 2, dark);              // front leg
    }
  },
  {
    id: "fox", name: "Fox", biomes: ["forest", "plains", "tundra", "farmland", "lake"],
    tags: ["animal", "small", "wild"], w: 8, h: 5, anchor: "baseline", layer: "ground", rarity: 0.8,
    draw: function (P, x, yb, env) {
      var body = env.col("#d1712e"), dark = env.col("#8a3f14"), white = env.col("#eae4d8");
      var step = (env.frame >> 2) & 1, s = step ? 1 : 0;
      var top = env.rough ? yb - 2 : yb - 3;
      P.line(x, yb - 2, x - 1, yb - 3, body); P.px(x - 1, yb - 3, white); // bushy white-tipped tail
      P.rect(x + 1, top, 4, (yb - 1) - top, body);        // small body
      P.px(x + 5, yb - 3, body); P.px(x + 6, yb - 2, body); // neck + head
      P.px(x + 7, yb - 2, dark);                          // pointed snout/nose
      P.px(x + 5, yb - 4, dark); P.px(x + 6, yb - 4, dark); // pointed ears
      P.px(x + 2, yb - 1, white);                         // white chest
      P.px(x + 1 + s, yb, dark); P.px(x + 4 - s, yb, dark); // trotting legs
    }
  },
  {
    id: "moose", name: "Moose", biomes: ["forest", "mountain", "tundra"],
    tags: ["animal", "large", "wild", "antlers"], w: 12, h: 13, anchor: "baseline", layer: "ground", rarity: 0.4,
    draw: function (P, x, yb, env) {
      var body = env.col("#4a352a"), dark = env.col("#2c1e15"), antler = env.col("#9c855f");
      var step = (env.frame >> 2) & 1, s = step ? 1 : 0;
      var top = env.rough ? yb - 8 : yb - 9;
      P.rect(x + 1, top, 6, (yb - 3) - top, body);        // tall body
      P.px(x + 1, top, dark);                             // shoulder hump
      P.rect(x + 6, yb - 10, 2, 4, body);                 // long rising neck
      P.rect(x + 7, yb - 11, 3, 2, body);                 // head
      P.px(x + 10, yb - 10, dark); P.px(x + 10, yb - 9, dark); // long muzzle
      P.px(x + 7, yb - 8, dark);                          // dewlap (bell)
      P.px(x + 6, yb - 12, dark);                         // ear
      // palmate antlers spreading either side of the head
      P.line(x + 6, yb - 12, x + 3, yb - 13, antler); P.px(x + 3, yb - 12, antler); P.px(x + 4, yb - 13, antler);
      P.line(x + 8, yb - 12, x + 11, yb - 13, antler); P.px(x + 11, yb - 12, antler); P.px(x + 9, yb - 13, antler);
      P.rect(x + 1 + s, yb - 3, 1, 4, dark);              // long back leg
      P.rect(x + 5 - s, yb - 3, 1, 4, dark);              // long front leg
    }
  },
  {
    id: "horse", name: "Horse", biomes: ["plains", "farmland", "savanna", "mountain"],
    tags: ["animal", "large", "farm"], w: 12, h: 10, anchor: "baseline", layer: "ground", rarity: 0.7,
    draw: function (P, x, yb, env) {
      var body = env.col("#a9743f"), dark = env.col("#6e4522"), mane = env.col("#4a2f18");
      var step = (env.frame >> 2) & 1, s = step ? 1 : 0;
      var top = env.rough ? yb - 6 : yb - 7;
      P.line(x, yb - 5, x, yb - 2, mane); P.px(x - 1, yb - 3, mane); // flowing tail
      P.rect(x + 1, top, 6, (yb - 3) - top, body);        // barrel
      P.rect(x + 7, yb - 8, 2, 3, body);                  // arched neck
      P.rect(x + 8, yb - 9, 3, 2, body);                  // head
      P.px(x + 11, yb - 8, dark);                         // muzzle
      P.line(x + 7, yb - 9, x + 8, yb - 7, mane);         // mane
      P.px(x + 8, yb - 10, dark);                         // ear
      P.rect(x + 1 + s, yb - 3, 1, 4, dark);              // back leg
      P.rect(x + 5 - s, yb - 3, 1, 4, dark);              // front leg
    }
  },
  {
    id: "cow", name: "Cow", biomes: ["farmland", "plains", "savanna"],
    tags: ["animal", "large", "farm"], w: 12, h: 8, anchor: "baseline", layer: "ground", rarity: 0.9,
    draw: function (P, x, yb, env) {
      var body = env.col("#e8e4dc"), spot = env.col("#38342f"), horn = env.col("#d9c9a8"), udder = env.col("#c98a86");
      var step = (env.frame >> 2) & 1, s = step ? 1 : 0;
      var top = env.rough ? yb - 5 : yb - 6;
      P.line(x, yb - 4, x, yb - 1, spot); P.px(x, yb - 1, spot);   // tail + tuft
      P.rect(x + 1, top, 6, (yb - 3) - top, body);        // broad body
      P.rect(x + 2, yb - 5, 2, 2, spot); P.px(x + 5, yb - 3, spot); // black spots
      P.rect(x + 7, yb - 5, 3, 3, body);                  // head
      P.px(x + 10, yb - 4, spot); P.px(x + 10, yb - 3, spot); // muzzle
      P.px(x + 7, yb - 6, horn); P.px(x + 9, yb - 6, horn);  // horns
      P.px(x + 9, yb - 4, spot);                          // eye
      P.px(x + 4, yb - 2, udder);                         // udder
      P.rect(x + 1 + s, yb - 2, 1, 3, spot);              // back leg
      P.rect(x + 5 - s, yb - 2, 1, 3, spot);              // front leg
    }
  },
  {
    id: "sheep", name: "Sheep", biomes: ["farmland", "plains", "mountain", "tundra"],
    tags: ["animal", "medium", "farm", "fluffy"], w: 9, h: 6, anchor: "baseline", layer: "ground", rarity: 0.9,
    draw: function (P, x, yb, env) {
      var wool = env.col("#eeeae2"), fluff = env.col("#ffffff"), face = env.col("#4a443c");
      var step = (env.frame >> 2) & 1, s = step ? 1 : 0;
      var top = env.rough ? yb - 4 : yb - 5;
      // cloud-like woolly body from a few overlapping discs
      P.disc(x + 3, top + 1, 2, wool); P.disc(x + 5, top + 1, 2, wool);
      P.rect(x + 1, top + 1, 6, (yb - 2) - top, wool);
      P.px(x + 2, top, fluff); P.px(x + 4, top, fluff); P.px(x + 6, top, fluff); // fleecy top
      P.rect(x + 6, yb - 3, 2, 2, face);                  // dark face
      P.px(x + 8, yb - 3, face);                          // muzzle
      P.px(x + 6, yb - 4, face);                          // ear
      P.px(x + 1 + s, yb - 1, face); P.px(x + 1 + s, yb, face); // back leg
      P.px(x + 5 - s, yb - 1, face); P.px(x + 5 - s, yb, face); // front leg
    }
  },
  {
    id: "goat", name: "Goat", biomes: ["mountain", "farmland", "plains", "savanna", "canyon"],
    tags: ["animal", "medium", "farm"], w: 9, h: 7, anchor: "baseline", layer: "ground", rarity: 0.8,
    draw: function (P, x, yb, env) {
      var body = env.col("#cbb896"), dark = env.col("#7a6a4a"), horn = env.col("#5a4a35");
      var step = (env.frame >> 2) & 1, s = step ? 1 : 0;
      var top = env.rough ? yb - 4 : yb - 5;
      P.px(x, yb - 4, dark);                              // short upright tail
      P.rect(x + 1, top, 5, (yb - 2) - top, body);        // body
      P.rect(x + 6, yb - 4, 2, 2, body);                  // head
      P.px(x + 8, yb - 3, dark);                          // muzzle
      P.px(x + 7, yb - 1, dark);                          // beard
      P.line(x + 6, yb - 5, x + 8, yb - 6, horn);         // back-swept horns
      P.line(x + 7, yb - 5, x + 9, yb - 6, horn);
      P.px(x + 1 + s, yb - 1, dark); P.px(x + 1 + s, yb, dark); // back leg
      P.px(x + 5 - s, yb - 1, dark); P.px(x + 5 - s, yb, dark); // front leg
    }
  },
  {
    id: "llama", name: "Llama", biomes: ["mountain", "farmland", "savanna", "plains"],
    tags: ["animal", "medium", "farm"], w: 9, h: 10, anchor: "baseline", layer: "ground", rarity: 0.6,
    draw: function (P, x, yb, env) {
      var body = env.col("#d8c7a8"), dark = env.col("#a48a63"), face = env.col("#6e5c40");
      var step = (env.frame >> 2) & 1, s = step ? 1 : 0;
      var top = env.rough ? yb - 6 : yb - 7;
      P.px(x, yb - 5, dark);                              // short tail
      P.rect(x + 1, top, 4, (yb - 3) - top, body);        // upright body
      P.rect(x + 4, yb - 9, 2, 4, body);                  // long neck
      P.rect(x + 5, yb - 10, 2, 2, body);                 // head
      P.px(x + 7, yb - 9, face);                          // muzzle
      P.px(x + 5, yb - 11, dark); P.px(x + 6, yb - 11, dark); // tall banana ears
      P.px(x + 6, yb - 10, face);                         // eye
      P.rect(x + 1 + s, yb - 3, 1, 4, dark);              // back leg
      P.rect(x + 4 - s, yb - 3, 1, 4, dark);              // front leg
    }
  }
];
