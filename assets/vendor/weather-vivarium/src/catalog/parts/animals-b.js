/* Animals batch B — exotic mammals (ground layer).
   Feet on row yb, faces right, 2-frame walk from (env.frame>>2)&1; the kangaroo
   uses that bit to hop. Colours wrapped in env.col so they read at night; noses,
   eyes and tusks stay as plain accents. Biomes lean desert/savanna/jungle, with
   raccoon slipping into city/forest. Authored nose-right; the engine mirrors. */

export default [
  {
    id: "camel", name: "Camel", biomes: ["desert", "savanna"],
    tags: ["animal", "large", "wild", "hump"], w: 12, h: 10, anchor: "baseline", layer: "ground", rarity: 0.6,
    draw: function (P, x, yb, env) {
      var body = env.col("#c79a5b"), dark = env.col("#9a7038");
      var st = (env.frame >> 2) & 1;
      // hump, widening down into the back
      P.rect(x + 4, yb - 8, 3, 1, body);
      P.rect(x + 3, yb - 7, 5, 1, body);
      P.rect(x + 2, yb - 6, 8, 2, body);                 // main body rows yb-6,yb-5
      P.rect(x + 9, yb - 8, 1, 3, body);                 // long neck
      P.px(x + 10, yb - 9, body); P.px(x + 10, yb - 8, body); // head
      P.px(x + 11, yb - 8, body);                        // snout
      P.px(x + 9, yb - 9, dark);                         // ear
      P.px(x + 10, yb - 9, dark);                        // eye/brow accent
      P.rect(x + 2, yb - 3, 1, 3, dark); P.rect(x + 4, yb - 3, 1, 3, dark); // back legs
      P.rect(x + 7, yb - 3, 1, 3, dark); P.rect(x + 8, yb - 3, 1, 3, dark); // front legs
      if (st) { P.px(x + 2, yb, dark); P.px(x + 7, yb, dark); }
      else { P.px(x + 4, yb, dark); P.px(x + 8, yb, dark); }
    }
  },
  {
    id: "elephant", name: "Elephant", biomes: ["savanna", "jungle"],
    tags: ["animal", "large", "wild", "trunk"], w: 14, h: 10, anchor: "baseline", layer: "ground", rarity: 0.5,
    draw: function (P, x, yb, env) {
      var g = env.col("#8a8a92"), d = env.col("#5f5f68"), ear = env.col("#7a7a82");
      var tusk = env.col("#e8e4d8");
      var flap = (env.frame >> 3) & 1;                    // slow ear flap
      P.rect(x + 2, yb - 7, 9, 4, g);                     // bulky body rows yb-7..yb-4
      P.disc(x + 9, yb - 5 - flap, 2, ear);               // big ear, flapping
      P.px(x + 10, yb - 6, d);                            // eye
      P.line(x + 11, yb - 6, x + 13, yb - 2, g);          // trunk curling down
      P.px(x + 12, yb - 1, g);                            // trunk tip
      P.px(x + 11, yb - 3, tusk); P.px(x + 12, yb - 3, tusk); // tusk
      P.rect(x + 2, yb - 3, 2, 3, d); P.rect(x + 4, yb - 3, 2, 3, d); // back legs
      P.rect(x + 7, yb - 3, 2, 3, d); P.rect(x + 9, yb - 3, 2, 3, d); // front legs
      P.px(x + 1, yb - 6, g); P.px(x, yb - 6, d);         // little tail
    }
  },
  {
    id: "giraffe", name: "Giraffe", biomes: ["savanna"],
    tags: ["animal", "tall", "wild"], w: 9, h: 18, anchor: "baseline", layer: "ground", rarity: 0.5,
    draw: function (P, x, yb, env) {
      var body = env.col("#d8b45a"), patch = env.col("#a87a34"), dark = env.col("#6f4a22");
      var st = (env.frame >> 2) & 1;
      var sway = Math.round(Math.sin(env.frame * (0.03 + env.wind * 0.04)) * (env.wind * 1.5));
      P.rect(x + 2, yb - 8, 5, 2, body);                  // body rows yb-8,yb-7
      P.px(x + 3, yb - 8, patch); P.px(x + 5, yb - 7, patch); // coat patches
      // very long legs
      P.rect(x + 2, yb - 6, 1, 6, patch); P.rect(x + 3, yb - 6, 1, 6, patch);
      P.rect(x + 5, yb - 6, 1, 6, patch); P.rect(x + 6, yb - 6, 1, 6, patch);
      if (st) { P.px(x + 2, yb, dark); P.px(x + 6, yb, dark); }
      else { P.px(x + 3, yb, dark); P.px(x + 5, yb, dark); }
      // long neck rising from the front
      P.rect(x + 6, yb - 15, 2, 7, body);                 // rows yb-15..yb-9
      P.px(x + 6, yb - 11, patch); P.px(x + 7, yb - 13, patch); // neck patches
      P.px(x + 1, yb - 7, dark);                          // tail
      // head at the top, gently swaying in wind
      P.px(x + 7 + sway, yb - 16, body); P.px(x + 8 + sway, yb - 16, body); // head + snout
      P.px(x + 6 + sway, yb - 16, body);
      P.px(x + 6 + sway, yb - 17, dark); P.px(x + 7 + sway, yb - 17, dark); // ossicones
    }
  },
  {
    id: "zebra", name: "Zebra", biomes: ["savanna", "plains"],
    tags: ["animal", "medium", "wild", "striped"], w: 11, h: 9, anchor: "baseline", layer: "ground", rarity: 0.7,
    draw: function (P, x, yb, env) {
      var w = env.col("#e6e2d8"), k = env.col("#2b2b30");
      var st = (env.frame >> 2) & 1;
      P.rect(x + 2, yb - 5, 6, 2, w);                     // body rows yb-5,yb-4
      // vertical stripes across the body
      P.px(x + 3, yb - 5, k); P.px(x + 3, yb - 4, k);
      P.px(x + 5, yb - 5, k); P.px(x + 5, yb - 4, k);
      P.px(x + 7, yb - 5, k); P.px(x + 7, yb - 4, k);
      P.rect(x + 7, yb - 7, 2, 2, w);                     // neck
      P.px(x + 8, yb - 6, k);                             // neck stripe
      P.px(x + 9, yb - 7, w); P.px(x + 9, yb - 6, w); P.px(x + 10, yb - 6, w); // head + muzzle
      P.px(x + 7, yb - 8, k); P.px(x + 8, yb - 8, k);     // mane
      P.px(x + 1, yb - 5, k); P.px(x + 1, yb - 4, k);     // tail
      P.rect(x + 2, yb - 3, 1, 2, k); P.rect(x + 4, yb - 3, 1, 2, k); // back legs
      P.rect(x + 6, yb - 3, 1, 2, k); P.rect(x + 7, yb - 3, 1, 2, k); // front legs
      if (st) { P.px(x + 2, yb, k); P.px(x + 6, yb, k); }
      else { P.px(x + 4, yb, k); P.px(x + 7, yb, k); }
    }
  },
  {
    id: "lion", name: "Lion", biomes: ["savanna", "desert"],
    tags: ["animal", "large", "wild", "predator"], w: 11, h: 8, anchor: "baseline", layer: "ground", rarity: 0.5,
    draw: function (P, x, yb, env) {
      var t = env.col("#c99a55"), m = env.col("#9a5f28"), d = env.col("#6a4520");
      var st = (env.frame >> 2) & 1;
      P.px(x + 1, yb - 4, t); P.px(x + 1, yb - 5, t);     // tail
      P.px(x + 1, yb - 6, d);                             // tail tuft
      P.rect(x + 2, yb - 4, 6, 2, t);                     // body rows yb-4,yb-3
      P.disc(x + 8, yb - 4, 2, m);                        // shaggy mane
      P.px(x + 8, yb - 4, t); P.px(x + 9, yb - 4, t);     // face + snout
      P.px(x + 9, yb - 3, d);                             // nose
      P.px(x + 8, yb - 5, d);                             // eye
      P.px(x + 7, yb - 6, m); P.px(x + 9, yb - 6, m);     // ears in the mane
      P.rect(x + 2, yb - 2, 1, 2, d); P.rect(x + 4, yb - 2, 1, 2, d); // back legs
      P.rect(x + 6, yb - 2, 1, 2, d); P.rect(x + 7, yb - 2, 1, 2, d); // front legs
      if (st) { P.px(x + 2, yb, d); P.px(x + 6, yb, d); }
      else { P.px(x + 4, yb, d); P.px(x + 7, yb, d); }
    }
  },
  {
    id: "kangaroo", name: "Kangaroo", biomes: ["desert", "savanna", "plains", "forest", "coast"], regions: ["oceania"],
    tags: ["animal", "medium", "wild", "hops"], w: 9, h: 11, anchor: "baseline", layer: "ground", rarity: 0.7,
    draw: function (P, x, yb, env) {
      var body = env.col("#a06a3a"), dark = env.col("#7a4e28");
      var hop = (env.frame >> 2) & 1;
      var yy = yb - (hop ? 1 : 0);                        // rise on the hop
      P.line(x, yb, x + 3, yy - 3, dark);                 // heavy tail to ground
      P.px(x + 1, yb, dark);
      if (!hop) { P.rect(x + 2, yb, 3, 1, dark); }        // flat hind foot planted
      else { P.px(x + 3, yy, dark); }                     // tucked in mid-hop
      P.rect(x + 3, yy - 3, 2, 3, body);                  // haunch rows yy-3..yy-1
      P.rect(x + 4, yy - 6, 2, 3, body);                  // upright torso
      P.px(x + 5, yy - 7, body);                          // chest/shoulder
      P.px(x + 6, yy - 5, dark);                          // little arm
      P.px(x + 6, yy - 8, body); P.px(x + 7, yy - 8, body); // head
      P.px(x + 8, yy - 8, body);                          // snout
      P.px(x + 6, yy - 9, dark); P.px(x + 7, yy - 9, dark); // tall ears
    }
  },
  {
    id: "koala", name: "Koala", biomes: ["forest", "jungle"], regions: ["oceania"],
    tags: ["animal", "small", "wild", "tree"], w: 7, h: 8, anchor: "baseline", layer: "ground", rarity: 0.6,
    draw: function (P, x, yb, env) {
      var g = env.col("#9a9aa2"), d = env.col("#6a6a72"), lite = env.col("#c2c2ca");
      P.disc(x + 3, yb - 2, 2, g);                        // round sitting body
      P.disc(x + 3, yb - 5, 2, g);                        // round head
      P.disc(x + 1, yb - 6, 1, lite); P.disc(x + 5, yb - 6, 1, lite); // fluffy ears
      P.rect(x + 3, yb - 5, 1, 2, d);                     // big dark nose
      P.px(x + 2, yb - 6, d); P.px(x + 4, yb - 6, d);     // eyes
      P.px(x + 2, yb, d); P.px(x + 4, yb, d);             // feet
    }
  },
  {
    id: "monkey", name: "Monkey", biomes: ["jungle", "forest"],
    tags: ["animal", "small", "wild", "tail"], w: 7, h: 8, anchor: "baseline", layer: "ground", rarity: 0.8,
    draw: function (P, x, yb, env) {
      var b = env.col("#7a5230"), d = env.col("#5a3a20"), f = env.col("#c9a074");
      var st = (env.frame >> 2) & 1;
      P.line(x, yb - 4, x + 2, yb - 3, d);                // curling tail
      P.px(x, yb - 5, d); P.px(x + 1, yb - 6, d);         // tail curl up
      P.rect(x + 2, yb - 4, 3, 3, b);                     // body rows yb-4..yb-2
      P.disc(x + 5, yb - 5, 1, b);                        // head
      P.px(x + 5, yb - 5, f);                             // pale face
      P.px(x + 5, yb - 6, d);                             // ear/eye accent
      P.px(x + 2, yb - 3, d);                             // arm
      P.px(x + 2, yb - 1, b); P.px(x + 4, yb - 1, b);     // legs
      if (st) { P.px(x + 2, yb, d); P.px(x + 4, yb, d); }
      else { P.px(x + 3, yb, d); }
    }
  },
  {
    id: "raccoon", name: "Raccoon", biomes: ["city", "forest", "coast"],
    tags: ["animal", "small", "wild", "masked"], w: 8, h: 5, anchor: "baseline", layer: "ground", rarity: 1.0,
    draw: function (P, x, yb, env) {
      var g = env.col("#8a8a92"), d = env.col("#3a3a40"), lite = env.col("#c8c8ce");
      var st = (env.frame >> 2) & 1;
      P.rect(x, yb - 3, 2, 2, g);                         // bushy striped tail
      P.px(x, yb - 2, d); P.px(x + 1, yb - 3, d);         // tail rings
      P.rect(x + 2, yb - 2, 3, 2, g);                     // body rows yb-2,yb-1
      P.px(x + 5, yb - 2, g); P.px(x + 6, yb - 2, g);     // head
      P.px(x + 5, yb - 3, d); P.px(x + 6, yb - 3, d);     // pointed ears
      P.px(x + 5, yb - 2, d);                             // black eye-mask
      P.px(x + 7, yb - 2, lite);                          // pale muzzle
      if (st) { P.px(x + 2, yb, d); P.px(x + 5, yb, d); }
      else { P.px(x + 3, yb, d); P.px(x + 4, yb, d); }
    }
  }
];
