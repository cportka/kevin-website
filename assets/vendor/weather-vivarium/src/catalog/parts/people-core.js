/* Reference people — the foreground stroller cast. Walking figures, feet on row
   yb, a two-frame walk cycle on env.frame, facing right. Weather gear (umbrella /
   gas mask / parka hood) is drawn over the top by the actor system, so entries
   only paint the body. env.skin/env.hair can tint an individual, but defaults
   keep each figure distinct.

   Day and night have their own cast: `daylight: true` keeps a figure to daylight
   hours, `nocturnal: true` to the dark. The beachgoer and the beach cat that
   takes over from her after sunset are ported from the original LA widget. */

var SKIN = "#e8b98f", HAIR = "#5a3a1e", SUIT = "#e0445a";
var TOWEL_A = "#22b0c2", TOWEL_B = "#f0d24a";

// The towel goes down first and stays down through every pose — she kneels onto
// it, reclines on it, and rolls back up off it.
function towel(P, x, yb) {
  for (var i = 0; i < 9; i++) P.px(x + i, yb, (i & 1) ? TOWEL_A : TOWEL_B);
}

/* Two in-between poses bridging the standing walk and the flat recline, so she
   folds down (and rises) smoothly instead of snapping. Ordered tallest →
   flattest: stand (draw) → crouch → propped → recline (restDraw). */
function crouch(P, x, yb) {
  towel(P, x, yb);                                       // towel down; she kneels onto it
  P.px(x + 1, yb - 4, HAIR); P.px(x + 2, yb - 4, HAIR);  // hair crown, head bowed forward
  P.px(x + 1, yb - 3, HAIR); P.px(x + 2, yb - 3, SKIN);  // hair back, face
  P.px(x + 2, yb - 2, SUIT);                             // bikini top
  P.px(x + 3, yb - 2, SKIN);                             // shoulder / arm reaching down
  P.px(x + 2, yb - 1, SUIT);                             // hip settling
  P.px(x + 3, yb - 1, SKIN); P.px(x + 4, yb - 1, SKIN);  // folded thighs
  P.px(x + 4, yb, SKIN); P.px(x + 5, yb, SKIN);          // shins tucked on the towel
}
function propped(P, x, yb) {
  towel(P, x, yb);
  P.px(x, yb - 2, HAIR);                                 // hair crown, head lifted
  P.px(x + 1, yb - 2, SKIN);                             // face
  P.px(x, yb - 1, HAIR);                                 // hair down to the propping arm
  P.px(x + 1, yb - 1, SUIT);                             // bikini top
  P.px(x + 2, yb - 1, SKIN); P.px(x + 3, yb - 1, SKIN);  // waist
  P.px(x + 4, yb - 1, SUIT);                             // bikini bottom / hip
  P.px(x + 5, yb - 1, SKIN);                             // thigh
  P.px(x + 6, yb - 1, SKIN); P.px(x + 6, yb - 2, SKIN);  // knee starting to rise
  P.px(x + 7, yb - 1, SKIN);                             // shin back toward the towel
}

export default [
  {
    id: "beachgoer", name: "Beachgoer", biomes: ["coast"],
    tags: ["person", "summer"], w: 4, h: 7, anchor: "baseline", layer: "ground",
    // She keeps to daylight (nobody sunbathes in the dark) and strolls on the
    // sand rather than the kerb (`lift`), which also sets her behind the
    // temperature sign — the depth the original LA widget drew her at.
    daylight: true, lift: 2,
    // A beachgoer doesn't just march past: she folds down through `restPoses`
    // onto a towel, sunbathes for a good while, then rises back up and strolls
    // on. `restW` is how much room the laid-out pose needs, so the compositor
    // can stop her well clear of the sign.
    restW: 10, restPoses: [crouch, propped],
    restDraw: function (P, x, yb, env) {
      towel(P, x, yb);
      P.px(x, yb - 1, SKIN);                                 // face
      P.px(x - 1, yb - 1, HAIR); P.px(x, yb - 2, HAIR);      // hair behind + on top
      P.px(x - 1, yb, HAIR);                                 // hair spilling onto the towel
      P.px(x + 1, yb - 1, SKIN);                             // neck / shoulder
      P.px(x + 2, yb - 1, SUIT); P.px(x + 2, yb - 2, SUIT);  // bikini top (chest rises a touch)
      P.px(x + 3, yb - 1, SKIN); P.px(x + 4, yb - 1, SKIN);  // bare waist
      P.px(x + 5, yb - 1, SUIT);                             // bikini bottom (hip)
      P.px(x + 6, yb - 1, SKIN);                             // thigh
      // one knee bent up — the classic sunbathe silhouette, rocking slowly
      var slow = (env.frame >> 5) & 1;
      P.px(x + 7, yb - 1, SKIN); P.px(x + 7, yb - 2, SKIN);
      if (slow) P.px(x + 7, yb - 3, SKIN);
      P.px(x + 8, yb - 1, SKIN);                             // shin back down to the towel
    },
    draw: function (P, x, yb, env) {
      var step = (env.frame >> 2) & 1;
      P.px(x, yb - 6, HAIR); P.px(x + 1, yb - 6, HAIR);
      P.px(x, yb - 5, HAIR); P.px(x + 1, yb - 5, SKIN);
      P.px(x, yb - 4, HAIR); P.px(x + 1, yb - 4, SUIT);
      P.px(x, yb - 3, HAIR);
      P.px(x + 1, yb - 3, SKIN); P.px(x + 2, yb - 3, SKIN);
      P.px(x + 1, yb - 2, SUIT);
      P.px(x + 1, yb - 1, SKIN);
      if (step) { P.px(x + 1, yb, SKIN); }
      else { P.px(x, yb, SKIN); P.px(x + 2, yb, SKIN); }
    }
  },
  {
    id: "beach-cat", name: "Beach cat", biomes: ["coast"],
    tags: ["animal", "night"], w: 7, h: 4, anchor: "baseline", layer: "ground",
    // After sunset the sand belongs to the cat — the night half of the original
    // LA widget's stroller. Painted in its own moonlit tabby tones rather than
    // through env.col, so it still reads against dark sand.
    nocturnal: true, lift: 2,
    draw: function (P, x, yb, env) {
      var body = "#b98a52", dark = "#8a6636";
      var step = (env.frame >> 2) & 1;
      if (env.rough) {                                        // hunched, low and quick
        P.rect(x + 1, yb - 1, 4, 1, body);                    // low body
        P.px(x + 5, yb - 1, body);                            // head down
        P.px(x + 5, yb - 2, dark); P.px(x + 6, yb - 2, dark); // ears back
        P.px(x, yb - 1, body);                                // tail tucked
        P.px(x + 2, yb, dark); P.px(x + 4, yb, dark);         // running legs
        return;
      }
      P.px(x, yb - 2, body); P.px(x, yb - 3, body);           // tail up behind
      P.rect(x + 1, yb - 1, 4, 1, body);                      // body
      P.px(x + 4, yb - 2, body); P.px(x + 5, yb - 2, body);   // head + muzzle
      P.px(x + 4, yb - 3, dark); P.px(x + 5, yb - 3, dark);   // two ears
      P.px(x + 2, yb - 1, dark); P.px(x + 3, yb - 1, dark);   // tabby stripes
      if (step) { P.px(x + 1, yb, dark); P.px(x + 4, yb, dark); }
      else { P.px(x + 2, yb, dark); P.px(x + 5, yb, dark); }  // padding paws
    }
  },
  {
    id: "stroller", name: "Passer-by", biomes: ["city", "coast", "plains", "farmland", "forest", "jungle", "desert", "savanna", "mountain", "tundra", "lake", "wetland", "canyon"],
    tags: ["person", "casual"], w: 4, h: 7, anchor: "baseline", layer: "ground",
    draw: function (P, x, yb, env) {
      var skin = "#d7a26a", coat = env.col("#3a63b8"), pants = env.col("#2a2f3a");
      var step = (env.frame >> 2) & 1;
      P.px(x + 1, yb - 6, "#3a2a1e");                    // hair
      P.px(x + 1, yb - 5, skin);                         // head
      P.rect(x + 1, yb - 4, 1, 2, coat);                 // torso
      P.px(x, yb - 4, coat); P.px(x + 2, yb - 3, skin);  // arm swing
      P.px(x + 1, yb - 2, pants);
      if (step) { P.px(x, yb - 1, pants); P.px(x + 2, yb, pants); P.px(x, yb, pants); }
      else { P.px(x + 1, yb - 1, pants); P.px(x + 1, yb, pants); P.px(x + 2, yb, pants); }
    }
  },
  {
    id: "jogger", name: "Jogger", biomes: ["city", "coast", "plains", "forest", "mountain"],
    tags: ["person", "active"], w: 5, h: 7, anchor: "baseline", layer: "ground",
    draw: function (P, x, yb, env) {
      var skin = "#c88a55", shirt = env.col("#e8d24a"), shorts = env.col("#2a6ab0");
      var step = (env.frame >> 1) & 1;
      P.px(x + 2, yb - 6, "#2a1a10"); P.px(x + 2, yb - 5, skin);
      P.rect(x + 2, yb - 4, 1, 2, shirt);
      P.px(step ? x + 3 : x + 1, yb - 3, skin);          // pumping arm
      P.px(x + 2, yb - 2, shorts);
      if (step) { P.px(x + 1, yb - 1, skin); P.px(x + 3, yb, skin); }
      else { P.px(x + 3, yb - 1, skin); P.px(x + 1, yb, skin); }
    }
  },
  {
    id: "hiker", name: "Hiker", biomes: ["mountain", "forest", "tundra", "plains"],
    tags: ["person", "outdoor"], w: 5, h: 8, anchor: "baseline", layer: "ground",
    draw: function (P, x, yb, env) {
      var skin = "#d09a68", coat = env.col("#b0562a"), pack = env.col("#3a6a3a"), pants = env.col("#3a3f48");
      var step = (env.frame >> 2) & 1;
      P.px(x + 2, yb - 7, env.col("#7a3f18"));           // hat
      P.px(x + 2, yb - 6, skin);
      P.rect(x + 2, yb - 5, 1, 2, coat);
      P.px(x + 3, yb - 5, pack); P.px(x + 3, yb - 4, pack); // backpack
      P.px(x + 1, yb - 4, skin);
      P.px(x, yb - 5, env.col("#8a6a3a"));               // trekking pole top
      P.line(x, yb - 5, x, yb, env.col("#8a6a3a"));
      P.px(x + 2, yb - 3, pants);
      if (step) { P.px(x + 1, yb - 1, pants); P.px(x + 3, yb, pants); }
      else { P.px(x + 3, yb - 1, pants); P.px(x + 1, yb, pants); }
    }
  },
  {
    id: "kite-kid", name: "Kid with kite", biomes: ["coast", "plains", "farmland"],
    tags: ["person", "child", "play"], w: 5, h: 8, anchor: "baseline", layer: "ground",
    draw: function (P, x, yb, env) {
      var skin = "#e0a870", shirt = env.col("#e0445a");
      P.px(x, yb - 5, "#3a2a1e"); P.px(x, yb - 4, skin);
      P.rect(x, yb - 3, 1, 2, shirt);
      P.px(x + 1, yb - 3, skin);                         // raised arm to string
      P.px(x, yb - 1, env.col("#2a3a6a")); P.px(x, yb, env.col("#2a3a6a"));
      // string up to a small diamond kite
      P.line(x + 1, yb - 3, x + 4, yb - 7, env.col("#8a8a8a"));
      P.px(x + 4, yb - 8, env.col("#f0c33a")); P.px(x + 4, yb - 7, env.col("#e0445a"));
      P.px(x + 3, yb - 7, env.col("#3aa06a")); P.px(x + 5, yb - 7, env.col("#3a63b8"));
    }
  },
  {
    id: "cyclist", name: "Cyclist", biomes: ["city", "coast", "plains", "farmland"],
    tags: ["person", "bike"], w: 9, h: 7, anchor: "baseline", layer: "ground", rarity: 0.9,
    draw: function (P, x, yb, env) {
      var skin = "#c88a55", jersey = env.col("#2aa0b0"), metal = "#aab0b6";
      P.disc(x + 1, yb - 1, 1, "#1a1a1a"); P.px(x + 1, yb - 1, metal);   // rear wheel
      P.disc(x + 7, yb - 1, 1, "#1a1a1a"); P.px(x + 7, yb - 1, metal);   // front wheel
      P.line(x + 1, yb - 1, x + 4, yb - 3, metal); P.line(x + 4, yb - 3, x + 7, yb - 1, metal);
      P.px(x + 4, yb - 4, jersey); P.px(x + 5, yb - 5, jersey);          // torso lean
      P.px(x + 5, yb - 6, skin);                                         // head
      P.px(x + 6, yb - 4, skin);                                         // arm to bars
      P.px(x + 3, yb - 2, jersey); P.px(x + 6, yb - 2, jersey);          // legs to pedals
    }
  }
];
