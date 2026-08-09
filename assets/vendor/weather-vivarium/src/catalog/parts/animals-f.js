/* Animals batch F — megafauna, black-and-white bears & tropical flyers.
   Ground layer (rhino…tapir): feet on row yb, faces right, a 2-frame walk cycle
   from (env.frame>>2)&1; env.rough lowers heavy bodies into a hunch. Body colours
   are wrapped in env.col so they read at night; horns, tusks, bills, eyes and pale
   markings stay as small hard accents. The toucan & parrot are anchor:"center",
   layer:"air": they hover with a flapping wing on (env.frame>>2)&1 and carry an
   oversized colourful bill / long tail. Authored nose-right; the engine mirrors. */

export default [
  {
    id: "rhino", name: "Rhino", biomes: ["savanna", "plains"],
    tags: ["animal", "large", "horned", "grazer"], w: 13, h: 8, anchor: "baseline", layer: "ground", rarity: 0.5,
    draw: function (P, x, yb, env) {
      var body = env.col("#7c7c82"), dark = env.col("#54545a"), horn = env.col("#d8d0c0");
      var st = (env.frame >> 2) & 1;
      var top = env.rough ? yb - 6 : yb - 7;
      // big barrel body with a shoulder hump
      P.rect(x + 1, top + 1, 8, 4, body);
      P.disc(x + 3, top + 1, 1, body);
      // tail (behind, left)
      P.px(x, yb - 3, dark); P.px(x, yb - 2, dark);
      // large lowered head to the right
      P.rect(x + 9, yb - 5, 3, 4, body);
      P.px(x + 12, yb - 3, body); P.px(x + 12, yb - 2, dark);   // muzzle / mouth
      P.px(x + 9, yb - 6, dark);                                // ear
      P.px(x + 10, yb - 5, dark);                               // eye
      // big front horn + a smaller second horn
      P.px(x + 12, yb - 4, horn); P.px(x + 12, yb - 5, horn); P.px(x + 11, yb - 6, horn);
      P.px(x + 10, yb - 6, horn);
      // thick legs + walk
      P.rect(x + 2, yb - 1, 2, 1, dark); P.rect(x + 6, yb - 1, 2, 1, dark);
      if (st) { P.px(x + 2, yb, dark); P.px(x + 7, yb, dark); }
      else { P.px(x + 3, yb, dark); P.px(x + 6, yb, dark); }
    }
  },
  {
    id: "hippo", name: "Hippo", biomes: ["wetland", "savanna", "lake"],
    tags: ["animal", "large", "blocky", "river"], w: 12, h: 6, anchor: "baseline", layer: "ground", rarity: 0.5,
    draw: function (P, x, yb, env) {
      var body = env.col("#7a6068"), dark = env.col("#54424a"), pink = env.col("#a86a70");
      var st = (env.frame >> 2) & 1;
      // low rounded barrel body
      P.rect(x + 1, yb - 4, 7, 3, body);
      P.px(x + 3, yb - 5, body); P.px(x + 5, yb - 5, body);     // rounded back
      // tail (behind, left)
      P.px(x, yb - 3, dark);
      // big blocky head with a wide snout to the right
      P.rect(x + 7, yb - 4, 4, 3, body);
      P.px(x + 8, yb - 5, body); P.px(x + 10, yb - 5, body);    // little round ears
      P.px(x + 9, yb - 4, dark);                                // eye
      P.px(x + 11, yb - 3, dark); P.px(x + 11, yb - 2, pink);   // nostril + snout
      // short stubby legs + walk
      P.px(x + 2, yb - 1, dark); P.px(x + 6, yb - 1, dark);
      if (st) { P.px(x + 2, yb, dark); P.px(x + 7, yb, dark); }
      else { P.px(x + 3, yb, dark); P.px(x + 6, yb, dark); }
    }
  },
  {
    id: "cheetah", name: "Cheetah", biomes: ["savanna", "plains"],
    tags: ["animal", "medium", "cat", "spotted"], w: 11, h: 7, anchor: "baseline", layer: "ground", rarity: 0.6,
    draw: function (P, x, yb, env) {
      var body = env.col("#d8a850"), belly = env.col("#e8d4a8"), spot = env.col("#3a2a18");
      var st = (env.frame >> 2) & 1;
      // long tail curving up behind (left) with a dark tip
      P.px(x, yb - 4, spot); P.px(x, yb - 3, body); P.px(x + 1, yb - 3, body);
      // lean body
      P.rect(x + 2, yb - 4, 6, 2, body);
      P.px(x + 4, yb - 3, belly);                              // pale belly hint
      // spotted flank
      P.px(x + 3, yb - 4, spot); P.px(x + 5, yb - 4, spot); P.px(x + 7, yb - 4, spot);
      // small head to the right
      P.rect(x + 8, yb - 5, 2, 2, body);
      P.px(x + 10, yb - 4, body);                             // muzzle
      P.px(x + 8, yb - 6, body);                              // ear
      P.px(x + 9, yb - 5, spot);                              // eye
      P.px(x + 9, yb - 4, spot);                              // tear stripe
      // slim legs + long stride
      if (st) { P.line(x + 3, yb - 3, x + 2, yb, body); P.line(x + 6, yb - 3, x + 7, yb, body); }
      else { P.line(x + 3, yb - 3, x + 4, yb, body); P.line(x + 6, yb - 3, x + 5, yb, body); }
    }
  },
  {
    id: "hyena", name: "Hyena", biomes: ["savanna", "desert"],
    tags: ["animal", "medium", "wild", "sloped"], w: 11, h: 7, anchor: "baseline", layer: "ground", rarity: 0.7,
    draw: function (P, x, yb, env) {
      var body = env.col("#a89070"), dark = env.col("#5a4a38"), mane = env.col("#4a3c2c");
      var st = (env.frame >> 2) & 1;
      // sloped back: low rump (left) rising to tall shoulders (right)
      P.rect(x + 1, yb - 3, 3, 2, body);            // rump
      P.rect(x + 3, yb - 4, 3, 3, body);            // mid rising
      P.rect(x + 5, yb - 5, 3, 4, body);            // tall shoulders
      // bristly mane along the sloping spine
      P.px(x + 2, yb - 4, mane); P.px(x + 4, yb - 5, mane); P.px(x + 6, yb - 6, mane);
      // dark blotches
      P.px(x + 2, yb - 2, dark); P.px(x + 4, yb - 3, dark); P.px(x + 6, yb - 3, dark);
      // bushy short tail (behind, left)
      P.px(x, yb - 2, dark); P.px(x, yb - 3, dark);
      // big head to the right with rounded ears
      P.rect(x + 8, yb - 5, 2, 2, body);
      P.px(x + 10, yb - 4, body);                   // snout
      P.px(x + 8, yb - 6, dark); P.px(x + 9, yb - 6, dark); // rounded ears
      P.px(x + 9, yb - 5, dark);                    // eye
      // legs + walk
      P.px(x + 2, yb - 1, dark); P.px(x + 6, yb - 1, dark);
      if (st) { P.px(x + 2, yb, dark); P.px(x + 6, yb, dark); }
      else { P.px(x + 3, yb, dark); P.px(x + 7, yb, dark); }
    }
  },
  {
    id: "panda", name: "Panda", biomes: ["forest", "mountain"],
    tags: ["animal", "medium", "bear", "bamboo"], w: 10, h: 7, anchor: "baseline", layer: "ground", rarity: 0.5,
    draw: function (P, x, yb, env) {
      var white = env.col("#ece8e0"), black = env.col("#1e1e22");
      var st = (env.frame >> 2) & 1;
      // round white body
      P.rect(x + 1, yb - 5, 5, 4, white);
      // black shoulder band across the back
      P.px(x + 2, yb - 5, black); P.px(x + 3, yb - 5, black);
      // big round white head to the right
      P.disc(x + 7, yb - 4, 2, white);
      // black ears
      P.px(x + 6, yb - 6, black); P.px(x + 8, yb - 6, black);
      // black eye patches + nose
      P.px(x + 6, yb - 4, black); P.px(x + 8, yb - 4, black);
      P.px(x + 9, yb - 3, black);
      // black legs + walk
      P.rect(x + 1, yb - 1, 2, 1, black); P.rect(x + 4, yb - 1, 2, 1, black);
      if (st) { P.px(x + 1, yb, black); P.px(x + 5, yb, black); }
      else { P.px(x + 2, yb, black); P.px(x + 4, yb, black); }
    }
  },
  {
    id: "red-panda", name: "Red panda", biomes: ["forest", "mountain"],
    tags: ["animal", "small", "rusty", "arboreal"], w: 11, h: 6, anchor: "baseline", layer: "ground", rarity: 0.7,
    draw: function (P, x, yb, env) {
      var rust = env.col("#b85a2a"), dark = env.col("#3a2418"), cream = env.col("#e8dcc0");
      var st = (env.frame >> 2) & 1;
      // banded bushy tail (behind, left)
      P.rect(x, yb - 2, 3, 2, rust);
      P.px(x, yb - 1, dark); P.px(x + 2, yb - 1, dark);
      // low rounded body
      P.rect(x + 2, yb - 3, 5, 2, rust);
      // head to the right
      P.rect(x + 7, yb - 4, 3, 3, rust);
      P.px(x + 10, yb - 3, dark);                             // nose
      P.px(x + 8, yb - 2, cream); P.px(x + 9, yb - 2, cream); // pale muzzle
      P.px(x + 7, yb - 3, cream);                             // cheek
      P.px(x + 8, yb - 4, dark);                              // eye
      // pointed ears
      P.px(x + 7, yb - 5, rust); P.px(x + 9, yb - 5, rust);
      // dark legs + walk
      P.px(x + 3, yb - 1, dark); P.px(x + 6, yb - 1, dark);
      if (st) { P.px(x + 3, yb, dark); P.px(x + 6, yb, dark); }
      else { P.px(x + 4, yb, dark); P.px(x + 7, yb, dark); }
    }
  },
  {
    id: "gorilla", name: "Gorilla", biomes: ["jungle", "forest"],
    tags: ["animal", "large", "ape", "silverback"], w: 10, h: 8, anchor: "baseline", layer: "ground", rarity: 0.5,
    draw: function (P, x, yb, env) {
      var black = env.col("#28282e"), dark = env.col("#17171b"), silver = env.col("#8a8a92"), face = env.col("#3a3238");
      var sway = (env.frame >> 3) & 1;                        // slow heavy sway
      // broad hunched shoulders + lower torso
      P.rect(x + 2, yb - 6, 6, 3, black);
      P.rect(x + 3, yb - 3, 4, 2, black);
      // silverback saddle across the back
      P.rect(x + 2, yb - 6, 5, 1, silver);
      // big head to the right with a heavy brow
      P.rect(x + 7, yb - 7, 3, 3, black);
      P.px(x + 7, yb - 7, dark); P.px(x + 9, yb - 7, dark);   // crown corners
      P.px(x + 8, yb - 5, face); P.px(x + 9, yb - 5, face);   // muzzle
      P.px(x + 8, yb - 6, silver);                            // brow ridge
      // long front arm (right) knuckle-walking to the ground
      P.line(x + 8, yb - 4, x + 9, yb, black); P.px(x + 9, yb, dark);
      // long back arm (left) to the ground
      P.line(x + 2, yb - 4, x + 1, yb, black); P.px(x + 1, yb, dark);
      // tucked feet with the slow sway
      P.px(x + 4 + sway, yb, dark); P.px(x + 6, yb, dark);
    }
  },
  {
    id: "tapir", name: "Tapir", biomes: ["jungle", "wetland"],
    tags: ["animal", "medium", "browser", "saddle"], w: 12, h: 6, anchor: "baseline", layer: "ground", rarity: 0.6,
    draw: function (P, x, yb, env) {
      var black = env.col("#2a2a30"), pale = env.col("#c8c4bc"), dark = env.col("#161619");
      var st = (env.frame >> 2) & 1;
      // pale "saddle" over the midsection + rump
      P.rect(x + 1, yb - 4, 6, 3, pale);
      P.px(x + 2, yb - 5, pale); P.px(x + 4, yb - 5, pale);   // rounded back
      // black front shoulders + head to the right
      P.rect(x + 7, yb - 4, 3, 3, black);
      // little drooping proboscis snout
      P.px(x + 10, yb - 3, black); P.px(x + 11, yb - 2, dark);
      // ear + eye
      P.px(x + 8, yb - 5, black);                             // ear
      P.px(x + 9, yb - 4, pale);                              // eye
      // dark legs (all four) + walk
      P.px(x + 2, yb - 1, black); P.px(x + 6, yb - 1, black);
      if (st) { P.px(x + 2, yb, black); P.px(x + 6, yb, black); P.px(x + 8, yb, black); }
      else { P.px(x + 3, yb, black); P.px(x + 7, yb, black); P.px(x + 9, yb, black); }
    }
  },
  {
    id: "toucan", name: "Toucan", biomes: ["jungle", "forest"],
    tags: ["animal", "air", "bird", "colourful"], w: 10, h: 7, anchor: "center", layer: "air", rarity: 0.9,
    draw: function (P, x, y, env) {
      var black = env.col("#1c1c22"), bill = env.col("#f0a81c"), billTip = env.col("#e64d28"),
        throat = env.col("#f2ecd6"), ring = env.col("#8ad0d8");
      var up = (env.frame >> 2) & 1;
      // rounded black body
      P.rect(x - 3, y - 1, 3, 3, black);
      P.px(x - 4, y, black); P.px(x - 4, y + 1, black);       // short tail (behind)
      // cream throat patch on the breast
      P.px(x - 1, y, throat); P.px(x - 1, y + 1, throat); P.px(x - 2, y + 1, throat);
      // head + pale eye ring
      P.px(x - 1, y - 2, black); P.px(x, y - 2, black); P.px(x, y - 1, black);
      P.px(x - 1, y - 1, ring);
      // BIG down-curved multi-colour bill pointing right
      P.rect(x + 1, y - 2, 3, 2, bill);
      P.px(x + 4, y - 1, bill); P.px(x + 5, y - 1, billTip);
      P.px(x + 4, y, billTip); P.px(x + 1, y, bill);
      // flapping wing
      if (up) { P.px(x - 2, y - 2, black); P.px(x - 1, y - 3, black); }
      else { P.px(x - 3, y + 2, black); P.px(x - 2, y + 2, black); }
      // tucked foot
      P.px(x - 1, y + 2, black);
    }
  },
  {
    id: "parrot", name: "Parrot", biomes: ["jungle", "coast"],
    tags: ["animal", "air", "bird", "colourful"], w: 8, h: 5, anchor: "center", layer: "air", rarity: 1.0,
    draw: function (P, x, y, env) {
      var red = env.col("#d83a2a"), blue = env.col("#2a6ad8"), yellow = env.col("#e8c828"),
        beak = env.col("#e8e0d0"), dark = env.col("#1a1a1e");
      var up = (env.frame >> 2) & 1;
      // long trailing tail (behind, left)
      P.px(x - 4, y + 1, red); P.px(x - 3, y, red); P.px(x - 2, y, red);
      // red body
      P.rect(x - 2, y - 1, 3, 2, red);
      // head + hooked pale beak to the right
      P.px(x + 1, y - 1, red);
      P.px(x, y - 1, dark);                                   // eye
      P.px(x + 2, y - 1, beak); P.px(x + 2, y, beak);         // hooked bill
      // flapping wing with blue + yellow flight feathers
      if (up) { P.px(x - 2, y - 2, blue); P.px(x - 1, y - 2, yellow); P.px(x, y - 2, blue); }
      else { P.px(x - 2, y + 1, blue); P.px(x - 1, y + 1, yellow); P.px(x, y + 1, blue); }
    }
  }
];
