/* Animals batch E — big grazers, ratites & tropical critters (ground layer).
   Feet on row yb, faces right; most walk on a 2-frame cycle from (env.frame>>2)&1
   and env.rough lowers the back (hunch). The two-legged ostrich and peacock stride
   on a wider swing; the sloth is the odd one out — it clings to a low branch stub
   and only sways/blinks slowly ((env.frame>>3)&1), the meerkat stands sentry with a
   balancing tail. Body colours are wrapped in env.col so they read at night; horns,
   tusks, beaks, eyes and noses stay as small hard accents. Authored nose-right; the
   engine mirrors. */

export default [
  {
    id: "yak", name: "Yak", biomes: ["mountain", "tundra"],
    tags: ["animal", "large", "shaggy", "grazer"], w: 12, h: 9, anchor: "baseline", layer: "ground", rarity: 0.6,
    draw: function (P, x, yb, env) {
      var body = env.col("#4a3a2a"), dark = env.col("#2e2318"), horn = env.col("#d8c8a0"), muz = env.col("#6a5540");
      var st = (env.frame >> 2) & 1, s = st ? 1 : 0;
      var top = env.rough ? yb - 6 : yb - 7;
      // shaggy back + shoulder hump
      P.rect(x + 1, top, 7, 3, body);
      P.disc(x + 2, top + 1, 1, body);
      // mid body
      P.rect(x + 1, yb - 4, 7, 2, body);
      // hanging skirt of shaggy fur with a ragged fringe
      P.rect(x + 1, yb - 2, 7, 1, dark);
      P.px(x + 2, yb - 1, dark); P.px(x + 4, yb - 1, dark); P.px(x + 6, yb - 1, dark);
      // tail tuft (behind, left)
      P.px(x, yb - 4, dark); P.px(x, yb - 3, dark);
      // low head to the right
      P.rect(x + 8, yb - 4, 2, 3, body);
      P.px(x + 10, yb - 3, muz); P.px(x + 10, yb - 2, muz);   // muzzle
      P.px(x + 9, yb - 4, dark);                              // eye
      // forward-curving horns
      P.px(x + 8, yb - 5, horn); P.px(x + 9, yb - 5, horn);
      P.px(x + 10, yb - 5, horn); P.px(x + 10, yb - 4, horn);
      // stubby legs + walk
      if (st) { P.px(x + 2, yb, dark); P.px(x + 6, yb, dark); }
      else { P.px(x + 3, yb, dark); P.px(x + 7, yb, dark); }
      P.px(x + 2 + s, yb - 1, dark);
    }
  },
  {
    id: "water-buffalo", name: "Water buffalo", biomes: ["wetland", "jungle", "savanna"],
    tags: ["animal", "large", "grazer", "horns"], w: 13, h: 9, anchor: "baseline", layer: "ground", rarity: 0.6,
    draw: function (P, x, yb, env) {
      var body = env.col("#4a4c54"), dark = env.col("#2e3038"), horn = env.col("#c8c0b0");
      var st = (env.frame >> 2) & 1;
      var top = env.rough ? yb - 6 : yb - 7;
      // heavy body
      P.rect(x + 2, top, 8, 4, body);
      P.rect(x + 2, yb - 2, 8, 1, body);                     // belly
      // tail (behind, left)
      P.px(x + 1, yb - 5, dark); P.px(x + 1, yb - 4, dark); P.px(x + 1, yb - 3, dark);
      // low head forward
      P.rect(x + 10, yb - 5, 2, 3, body);
      P.px(x + 12, yb - 4, dark); P.px(x + 12, yb - 3, dark); // muzzle
      P.px(x + 11, yb - 5, dark);                            // eye
      // wide swept-back crescent horns
      P.px(x + 11, top + 1, horn); P.px(x + 10, top, horn); P.px(x + 9, top, horn);
      P.px(x + 8, top, horn); P.px(x + 7, top + 1, horn); P.px(x + 6, top + 1, horn);
      // legs + walk
      if (st) { P.px(x + 3, yb, dark); P.px(x + 8, yb, dark); P.px(x + 3, yb - 1, dark); }
      else { P.px(x + 4, yb, dark); P.px(x + 9, yb, dark); P.px(x + 9, yb - 1, dark); }
    }
  },
  {
    id: "alpaca", name: "Alpaca", biomes: ["mountain"],
    tags: ["animal", "medium", "fluffy", "grazer"], w: 8, h: 11, anchor: "baseline", layer: "ground", rarity: 0.8,
    draw: function (P, x, yb, env) {
      var body = env.col("#d8c8a8"), dark = env.col("#b0a082"), face = env.col("#8a7a60");
      var st = (env.frame >> 2) & 1;
      // fluffy body
      P.rect(x + 1, yb - 6, 5, 3, body);
      P.px(x, yb - 6, body); P.px(x + 6, yb - 5, body);      // fluff bumps
      P.px(x, yb - 5, dark);                                 // little tail
      // long neck rising to the right
      P.rect(x + 5, yb - 9, 2, 4, body);
      // small head + perky ears + topknot
      P.px(x + 6, yb - 10, body); P.px(x + 7, yb - 10, face); // head + muzzle
      P.px(x + 5, yb - 11, dark); P.px(x + 6, yb - 11, dark); // ears / topknot fluff
      P.px(x + 6, yb - 10, dark);                            // eye
      // slim legs + walk
      P.rect(x + 1, yb - 3, 1, 2, body); P.rect(x + 4, yb - 3, 1, 2, body);
      if (st) { P.px(x + 1, yb, dark); P.px(x + 5, yb, dark); }
      else { P.px(x + 2, yb, dark); P.px(x + 4, yb, dark); }
    }
  },
  {
    id: "ostrich", name: "Ostrich", biomes: ["savanna", "desert"],
    tags: ["animal", "large", "bird", "flightless"], w: 9, h: 14, anchor: "baseline", layer: "ground", rarity: 0.7,
    draw: function (P, x, yb, env) {
      var body = env.col("#2a2a2a"), tail = env.col("#c8c0b0"), neck = env.col("#c98a6a"), beak = env.col("#d8a850");
      var st = (env.frame >> 2) & 1;
      // round plumage body
      P.rect(x + 2, yb - 8, 5, 4, body);
      P.disc(x + 4, yb - 7, 2, body);
      P.px(x + 5, yb - 6, tail);                             // pale wing/flank hint
      // pale tail plume (behind, left)
      P.px(x + 1, yb - 8, tail); P.px(x + 1, yb - 7, tail); P.px(x, yb - 7, tail);
      // long thin neck rising to the right
      P.px(x + 6, yb - 9, neck); P.px(x + 6, yb - 10, neck);
      P.px(x + 6, yb - 11, neck); P.px(x + 7, yb - 12, neck);
      // small head + beak
      P.px(x + 7, yb - 13, neck); P.px(x + 8, yb - 13, beak);
      P.px(x + 7, yb - 12, body);                            // eye
      // two long legs, big walking stride
      var back = st ? x + 2 : x + 4, front = st ? x + 5 : x + 3;
      P.line(x + 3, yb - 4, back, yb, neck);
      P.line(x + 5, yb - 4, front, yb, neck);
      P.px(back, yb, body); P.px(front, yb, body);           // feet
    }
  },
  {
    id: "peacock", name: "Peacock", biomes: ["jungle", "farmland"],
    tags: ["animal", "bird", "colourful"], w: 11, h: 10, anchor: "baseline", layer: "ground", rarity: 0.7,
    draw: function (P, x, yb, env) {
      var body = env.col("#1a5a8a"), neck = env.col("#12466e"), green = env.col("#1a8a5a"), gold = env.col("#d8b038"), eye = env.col("#e8e8e8");
      var st = (env.frame >> 2) & 1;
      // fan-tail hint: an arc of iridescent feathers rising behind (left) with eye spots
      P.line(x + 3, yb - 3, x, yb - 7, green);
      P.line(x + 3, yb - 3, x + 1, yb - 8, green);
      P.line(x + 3, yb - 3, x + 3, yb - 9, green);
      P.px(x, yb - 7, gold); P.px(x + 1, yb - 8, gold); P.px(x + 3, yb - 9, gold);
      // rounded body
      P.rect(x + 3, yb - 4, 3, 3, body);
      P.disc(x + 4, yb - 3, 1, body);
      // neck rising to the right
      P.px(x + 6, yb - 5, neck); P.px(x + 6, yb - 6, neck); P.px(x + 7, yb - 7, neck);
      // head + crest + beak
      P.px(x + 7, yb - 8, neck); P.px(x + 8, yb - 8, neck);
      P.px(x + 9, yb - 8, gold);                             // beak
      P.px(x + 7, yb - 9, neck); P.px(x + 8, yb - 9, neck);  // crest tips
      P.px(x + 8, yb - 7, eye);                              // eye accent
      // two legs + walk
      if (st) { P.px(x + 4, yb, neck); P.px(x + 6, yb, neck); P.px(x + 6, yb - 1, neck); }
      else { P.px(x + 4, yb, neck); P.px(x + 6, yb, neck); P.px(x + 4, yb - 1, neck); }
    }
  },
  {
    id: "iguana", name: "Iguana", biomes: ["desert", "jungle"],
    tags: ["animal", "small", "reptile", "low"], w: 14, h: 5, anchor: "baseline", layer: "ground", rarity: 0.8,
    draw: function (P, x, yb, env) {
      var body = env.col("#5a8a4a"), dark = env.col("#3d6630"), dew = env.col("#c2a030");
      var st = (env.frame >> 2) & 1;
      // long tapering tail (behind, left)
      P.px(x, yb, dark); P.px(x + 1, yb - 1, body); P.px(x + 2, yb - 1, body);
      // low body
      P.rect(x + 2, yb - 2, 8, 2, body);
      // spiky dorsal crest along the back
      P.px(x + 3, yb - 3, dark); P.px(x + 5, yb - 3, dark);
      P.px(x + 7, yb - 3, dark); P.px(x + 9, yb - 3, dark);
      // head to the right
      P.rect(x + 10, yb - 2, 2, 2, body);
      P.px(x + 12, yb - 2, body);                            // snout
      P.px(x + 11, yb - 2, dark);                            // eye
      // dewlap under the chin
      P.px(x + 10, yb, dew); P.px(x + 11, yb, dew);
      // sprawled legs + walk
      if (st) { P.px(x + 3, yb, dark); P.px(x + 8, yb, dark); }
      else { P.px(x + 4, yb, dark); P.px(x + 9, yb, dark); }
    }
  },
  {
    id: "sloth", name: "Sloth", biomes: ["jungle"],
    tags: ["animal", "small", "slow", "arboreal"], w: 9, h: 7, anchor: "baseline", layer: "ground", rarity: 0.6,
    draw: function (P, x, yb, env) {
      var fur = env.col("#8a7a5a"), dark = env.col("#5f4f39"), face = env.col("#cab898"), bark = env.col("#6a4a30");
      var sway = ((env.frame >> 3) & 1) ? 1 : 0;
      var blink = (env.frame >> 2) & 1;
      // low branch stub the sloth clings to
      P.rect(x + 1, yb - 6, 1, 6, bark);                     // trunk
      P.rect(x + 1, yb - 6, 6, 1, bark);                     // branch across the top
      var bx = x + 3 + sway;
      // long gripping arms up to the branch, claws hooked over it
      P.line(bx, yb - 3, x + 2, yb - 6, dark);
      P.line(bx + 3, yb - 3, x + 6, yb - 6, dark);
      P.px(x + 2, yb - 6, face); P.px(x + 6, yb - 6, face); // claws
      // rounded hanging body
      P.disc(bx + 1, yb - 3, 2, fur);
      P.px(bx, yb - 5, dark); P.px(bx + 2, yb - 5, dark);   // shaggy back
      // face with dark eye patches, lower-right
      P.px(bx + 3, yb - 2, face); P.px(bx + 4, yb - 2, face);
      P.px(bx + 3, yb - 2, dark);                           // eye patch
      P.px(bx + 4, yb - 2, blink ? face : dark);            // slow blink
      // dangling feet
      P.px(bx + 1, yb, dark); P.px(bx + 2, yb, dark);
    }
  },
  {
    id: "capybara", name: "Capybara", biomes: ["wetland", "jungle"],
    tags: ["animal", "medium", "blocky", "rodent"], w: 11, h: 6, anchor: "baseline", layer: "ground", rarity: 0.8,
    draw: function (P, x, yb, env) {
      var body = env.col("#8a6a44"), dark = env.col("#5f4830");
      var st = (env.frame >> 2) & 1;
      // blocky barrel body
      P.rect(x + 1, yb - 4, 7, 3, body);
      P.px(x + 7, yb - 5, body);                            // low back hump
      // big blunt rectangular head to the right
      P.rect(x + 8, yb - 4, 3, 3, body);
      P.px(x + 8, yb - 5, dark);                            // ear
      P.px(x + 9, yb - 4, dark);                            // eye
      P.px(x + 10, yb - 3, dark);                           // blunt nose
      // short legs + walk
      P.px(x + 2, yb - 1, dark); P.px(x + 6, yb - 1, dark);
      if (st) { P.px(x + 2, yb, dark); P.px(x + 7, yb, dark); }
      else { P.px(x + 3, yb, dark); P.px(x + 6, yb, dark); }
    }
  },
  {
    id: "armadillo", name: "Armadillo", biomes: ["savanna", "desert"],
    tags: ["animal", "small", "armoured"], w: 10, h: 5, anchor: "baseline", layer: "ground", rarity: 0.8,
    draw: function (P, x, yb, env) {
      var shell = env.col("#a89478"), band = env.col("#7a6850"), skin = env.col("#c2a888");
      var st = (env.frame >> 2) & 1;
      // domed banded carapace
      P.rect(x + 2, yb - 3, 6, 3, shell);
      P.rect(x + 3, yb - 4, 4, 1, shell);                   // dome top
      // banding lines across the shell
      P.px(x + 3, yb - 3, band); P.px(x + 3, yb - 2, band);
      P.px(x + 5, yb - 4, band); P.px(x + 5, yb - 3, band); P.px(x + 5, yb - 2, band);
      P.px(x + 7, yb - 3, band); P.px(x + 7, yb - 2, band);
      // pointy head to the right
      P.px(x + 8, yb - 3, shell); P.px(x + 8, yb - 2, skin); P.px(x + 9, yb - 2, skin); // snout
      P.px(x + 8, yb - 3, band);                            // eye
      // long thin tail (behind, left)
      P.px(x + 1, yb - 1, band); P.px(x, yb - 1, band);
      // short legs + walk
      if (st) { P.px(x + 3, yb, band); P.px(x + 6, yb, band); }
      else { P.px(x + 4, yb, band); P.px(x + 7, yb, band); }
    }
  },
  {
    id: "warthog", name: "Warthog", biomes: ["savanna"],
    tags: ["animal", "medium", "tusks", "wild"], w: 11, h: 7, anchor: "baseline", layer: "ground", rarity: 0.8,
    draw: function (P, x, yb, env) {
      var body = env.col("#6a5a4a"), dark = env.col("#453a2e"), mane = env.col("#3a2f24"), tusk = env.col("#e8e0c8"), snout = env.col("#8a7460");
      var st = (env.frame >> 2) & 1;
      var top = env.rough ? yb - 4 : yb - 5;
      // body
      P.rect(x + 1, top, 6, 3, body);
      // bristly mane along the back
      P.px(x + 1, top - 1, mane); P.px(x + 3, top - 1, mane);
      P.px(x + 5, top - 1, mane); P.px(x + 6, top - 1, mane);
      // thin tail up with a tuft (behind, left)
      P.px(x, yb - 5, dark); P.px(x, yb - 6, dark);
      // head lowered forward to the right
      P.rect(x + 7, yb - 4, 2, 2, body);
      P.px(x + 9, yb - 4, body); P.px(x + 9, yb - 3, snout); // face + snout
      P.px(x + 10, yb - 3, snout);                          // nose tip
      P.px(x + 8, yb - 4, dark);                            // eye
      // upward-curving tusks
      P.px(x + 9, yb - 5, tusk); P.px(x + 10, yb - 5, tusk); P.px(x + 10, yb - 6, tusk);
      // legs + walk
      P.rect(x + 2, yb - 2, 1, 2, dark); P.rect(x + 5, yb - 2, 1, 2, dark);
      if (st) { P.px(x + 2, yb, dark); P.px(x + 6, yb, dark); }
      else { P.px(x + 3, yb, dark); P.px(x + 5, yb, dark); }
    }
  },
  {
    id: "meerkat", name: "Meerkat", biomes: ["desert", "savanna"],
    tags: ["animal", "tiny", "upright", "sentry"], w: 5, h: 9, anchor: "baseline", layer: "ground", rarity: 1.0,
    draw: function (P, x, yb, env) {
      var body = env.col("#c2a878"), belly = env.col("#e0d0b0"), dark = env.col("#7a6040"), patch = env.col("#3a2f22");
      var scan = (env.frame >> 3) & 1;                      // slow sentry scan
      // long tail curving down behind for balance (left)
      P.px(x + 1, yb - 2, dark); P.px(x, yb - 1, dark); P.px(x, yb, dark);
      // upright torso
      P.rect(x + 2, yb - 5, 2, 5, body);
      P.px(x + 3, yb - 3, belly); P.px(x + 3, yb - 2, belly); // pale belly
      P.px(x + 3, yb - 4, dark);                            // tucked front paws
      // feet
      P.px(x + 2, yb, dark); P.px(x + 3, yb, dark);
      // head with pointed nose (right) — scans up slightly on the slow cycle
      var hy = yb - 6 - scan;
      P.px(x + 2, hy, body); P.px(x + 3, hy, body);
      P.px(x + 4, hy, patch);                               // pointed nose
      P.px(x + 3, hy, patch);                               // dark eye patch
      P.px(x + 2, hy - 1, dark); P.px(x + 3, hy - 1, dark); // ears
    }
  }
];
