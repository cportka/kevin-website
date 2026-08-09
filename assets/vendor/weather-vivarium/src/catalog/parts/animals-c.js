/* Animals batch C — sea life (water layer).
   All anchor "center", layer "water": drawn inside the water band around (x, y),
   not standing on a baseline. Biomes stay wet: coast / ocean / lake / wetland.
   Bodies hug the surface; a few signatures animate on env.frame — the whale's
   blowhole spout rises and spreads, the jellyfish tentacles wobble, fins/flippers
   paddle on a 2-frame cycle. Paint colours wrapped in env.col so they read at
   night. Authored facing right (nose/head toward +x); the engine mirrors. */

export default [
  {
    id: "whale", name: "Whale", biomes: ["ocean", "coast"],
    tags: ["animal", "water", "sea", "large"], w: 15, h: 11, anchor: "center", layer: "water", rarity: 0.3,
    draw: function (P, x, y, env) {
      var body = env.col("#3f5f7a"), belly = env.col("#8fb0c4"), dark = env.col("#2a4055");
      var spray = env.col("#bcd6e6");
      // rounded back arcing out of the surface
      P.disc(x, y + 1, 4, body);
      P.rect(x - 4, y + 2, 9, 2, body);                 // fill down to the waterline
      P.px(x - 3, y + 3, belly); P.px(x + 3, y + 3, belly);
      // tail fluke rising at the back (left)
      P.line(x - 4, y + 1, x - 7, y - 1, body);
      P.px(x - 7, y - 2, body); P.px(x - 6, y - 1, body);
      P.px(x - 7, y - 1, dark);
      P.px(x + 3, y, dark);                             // eye near the head
      // blowhole spout: pixels rising and spreading, cycling on env.frame
      var sp = (env.frame >> 1) % 5;
      P.px(x + 1, y - 4, spray);
      if (sp > 0) P.px(x + 1, y - 5, spray);
      if (sp > 1) { P.px(x, y - 6, spray); P.px(x + 2, y - 6, spray); }
      if (sp > 2) { P.px(x - 1, y - 7, spray); P.px(x + 3, y - 7, spray); }
    }
  },
  {
    id: "seal", name: "Seal", biomes: ["coast", "ocean", "lake"],
    tags: ["animal", "water", "sea"], w: 10, h: 6, anchor: "center", layer: "water", rarity: 0.6,
    draw: function (P, x, y, env) {
      var body = env.col("#8a8f95"), dark = env.col("#5c6068"), belly = env.col("#b6babf");
      var flip = (env.frame >> 2) & 1;
      // sleek body low in the water
      P.rect(x - 3, y, 6, 2, body);
      P.disc(x, y, 2, body);
      P.px(x - 2, y + 1, belly); P.px(x, y + 1, belly);
      // head lifting to the right
      P.rect(x + 3, y - 2, 2, 2, body);
      P.px(x + 5, y - 2, dark);                          // nose
      P.px(x + 3, y - 2, dark);                          // eye
      // rear flippers paddling at the back
      if (flip) { P.px(x - 4, y - 1, body); P.px(x - 4, y, body); }
      else { P.px(x - 4, y, body); P.px(x - 4, y + 1, body); }
    }
  },
  {
    id: "penguin", name: "Penguin", biomes: ["coast", "ocean"],
    tags: ["animal", "water", "sea", "bird"], w: 7, h: 9, anchor: "center", layer: "water", rarity: 0.5,
    draw: function (P, x, y, env) {
      var blk = env.col("#2b3036"), wht = env.col("#e9ecef"), beak = env.col("#e8912e");
      var bob = (env.frame >> 2) & 1;
      var yy = y - bob;                                  // gentle floating bob
      P.rect(x - 1, yy - 3, 3, 5, blk);                  // black back / body
      P.rect(x, yy - 2, 2, 4, wht);                      // white belly toward the front
      P.rect(x - 1, yy - 5, 3, 2, blk);                  // head
      P.px(x, yy - 4, wht);                              // white cheek
      P.px(x + 2, yy - 4, beak);                         // beak pointing right
      P.px(x - 2, yy - 1, blk);                          // flipper at the back
      P.px(x, yy + 2, beak); P.px(x + 1, yy + 2, beak);  // feet dabbling
    }
  },
  {
    id: "turtle", name: "Sea Turtle", biomes: ["coast", "ocean", "lake"],
    tags: ["animal", "water", "sea"], w: 11, h: 6, anchor: "center", layer: "water", rarity: 0.5,
    draw: function (P, x, y, env) {
      var shell = env.col("#3f7a54"), dark = env.col("#28503a"), skin = env.col("#84a35f"), pat = env.col("#63a173");
      var pad = (env.frame >> 2) & 1;
      // domed shell
      P.disc(x, y, 3, shell);
      P.rect(x - 3, y + 1, 7, 1, shell);
      P.px(x - 1, y - 1, pat); P.px(x + 1, y - 1, pat); P.px(x, y - 2, pat); // scutes
      P.px(x, y, dark);
      // head reaching to the right
      P.px(x + 4, y, skin); P.px(x + 5, y, skin); P.px(x + 5, y - 1, skin);
      P.px(x + 6, y - 1, dark);                          // eye
      // paddling flippers, offset each frame
      if (pad) { P.px(x + 3, y + 2, skin); P.px(x - 3, y + 1, skin); }
      else { P.px(x + 3, y + 1, skin); P.px(x - 3, y + 2, skin); }
    }
  },
  {
    id: "jellyfish", name: "Jellyfish", biomes: ["ocean", "coast"],
    tags: ["animal", "water", "sea"], w: 8, h: 9, anchor: "center", layer: "water", rarity: 0.7,
    draw: function (P, x, y, env) {
      var bell = env.col("#c48ad4"), rim = env.col("#a066bd"), tent = env.col("#b578cc");
      // translucent dome
      P.withAlpha(0.85, function () {
        P.disc(x, y - 2, 3, bell);
        P.rect(x - 3, y - 2, 7, 2, bell);
      });
      P.rect(x - 3, y, 7, 1, rim);                       // frilled rim
      // dangling tentacles wobbling with env.frame
      var tx = [x - 2, x, x + 2];
      for (var i = 0; i < 3; i++) {
        var w = Math.round(Math.sin(env.frame * 0.18 + i * 1.3));
        P.px(tx[i], y + 1, tent);
        P.px(tx[i] + w, y + 2, tent);
        P.px(tx[i], y + 3, tent);
        P.px(tx[i] - w, y + 4, tent);
      }
    }
  },
  {
    id: "shark-fin", name: "Shark Fin", biomes: ["ocean", "coast"],
    tags: ["animal", "water", "sea", "predator"], w: 8, h: 6, anchor: "center", layer: "water", rarity: 0.4,
    draw: function (P, x, y, env) {
      var fin = env.col("#4a5a66"), dark = env.col("#2d3941"), wake = env.col("#8fb8c9");
      // triangular dorsal fin cutting the surface (waterline at y)
      P.rect(x - 2, y, 5, 1, fin);
      P.rect(x - 1, y - 1, 4, 1, fin);
      P.rect(x, y - 2, 3, 1, fin);
      P.rect(x + 1, y - 3, 2, 1, fin);
      P.px(x + 1, y - 4, fin);                           // apex
      P.px(x, y - 1, dark); P.px(x - 1, y, dark);        // trailing-edge shading
      // surface wake drifting on a 2-frame cycle
      var w = (env.frame >> 2) & 1;
      P.px(x - 3 - (w ? 1 : 0), y, wake);
      P.px(x + 3 + (w ? 1 : 0), y, wake);
    }
  },
  {
    id: "otter", name: "Otter", biomes: ["lake", "wetland", "coast"],
    tags: ["animal", "water", "small"], w: 12, h: 6, anchor: "center", layer: "water", rarity: 0.6,
    draw: function (P, x, y, env) {
      var body = env.col("#6a4a32"), dark = env.col("#432c1c"), face = env.col("#b79b74"), belly = env.col("#8a6a4a");
      var paw = (env.frame >> 2) & 1;
      // reclining on its back at the surface
      P.rect(x - 4, y, 7, 2, body);
      P.px(x - 3, y + 1, belly); P.px(x - 1, y + 1, belly); P.px(x + 1, y + 1, belly);
      // head raised at the right
      P.px(x + 3, y - 1, body); P.px(x + 4, y - 1, body);
      P.px(x + 4, y - 2, face);                          // face
      P.px(x + 5, y - 2, dark);                          // nose
      P.px(x + 3, y - 2, dark);                          // eye
      // tail trailing left
      P.px(x - 5, y, body); P.px(x - 6, y, dark);
      // paws on the belly, cracking a shell (2-frame)
      if (paw) { P.px(x, y - 1, dark); P.px(x + 1, y - 1, dark); }
      else { P.px(x, y - 2, dark); P.px(x + 1, y - 1, dark); }
    }
  },
  {
    id: "crocodile", name: "Crocodile", biomes: ["wetland", "lake"],
    tags: ["animal", "water", "predator"], w: 16, h: 5, anchor: "center", layer: "water", rarity: 0.4,
    draw: function (P, x, y, env) {
      var body = env.col("#3f5a3a"), dark = env.col("#294026"), teeth = env.col("#d9d3c1"), eye = env.col("#c7a63c");
      var sway = (env.frame >> 2) & 1;
      // long low body lurking at the waterline
      P.rect(x - 6, y, 8, 2, body);
      P.rect(x + 2, y, 4, 1, body);                      // narrowing snout
      P.px(x + 6, y, body);                              // snout tip
      P.px(x - 4, y - 1, dark); P.px(x - 2, y - 1, dark); P.px(x, y - 1, dark); // back scutes
      P.px(x + 1, y - 1, body); P.px(x + 1, y - 1, eye); // eye bump
      P.px(x + 6, y - 1, dark);                          // nostril
      P.px(x + 3, y + 1, teeth); P.px(x + 5, y + 1, teeth); // jaw teeth
      // swishing tail to the left
      if (sway) { P.px(x - 7, y - 1, body); P.px(x - 8, y - 1, dark); }
      else { P.px(x - 7, y + 1, body); P.px(x - 8, y + 1, dark); }
    }
  },
  {
    id: "stingray", name: "Stingray", biomes: ["ocean", "coast"],
    tags: ["animal", "water", "sea"], w: 14, h: 6, anchor: "center", layer: "water", rarity: 0.5,
    draw: function (P, x, y, env) {
      var body = env.col("#6a6f75"), dark = env.col("#42474d"), belly = env.col("#9a9ea3");
      var flap = (env.frame >> 2) & 1;
      // gliding diamond disc, front point to the right
      P.rect(x - 1, y - 2, 4, 1, body);
      P.rect(x - 3, y - 1, 6, 1, body);
      P.rect(x - 4, y, 9, 1, body);                      // widest wingspan
      P.rect(x - 3, y + 1, 6, 1, body);
      P.rect(x - 1, y + 2, 4, 1, body);
      P.px(x + 4, y, body);                              // snout
      P.px(x - 2, y, belly);                             // pale spine hint
      P.px(x + 2, y - 1, dark); P.px(x + 2, y + 1, dark); // eyes on top
      // wing tips flapping
      if (flap) { P.px(x - 5, y - 1, body); P.px(x - 5, y + 1, body); }
      else { P.px(x - 4, y - 1, body); P.px(x - 4, y + 1, body); }
      // long trailing tail
      P.line(x - 4, y, x - 6, y, dark); P.px(x - 7, y, dark);
    }
  }
];
