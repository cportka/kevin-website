/* People (set C) — a few relaxed, weed-smoking strollers that only turn up in
   cities with a famous cannabis culture (gated by `require:"cannabis"`, which the
   compositor filters on resolve's isCannabisCity). Lighthearted, not caricatures:
   a chill person, a little joint, and a puff of smoke drifting up on the frame.
   Baseline/ground walkers matching the people-a/b idiom (skin plain, clothing via
   env.col, a 2-frame walk on (env.frame>>2)&1). */

// A joint at (mx,my) with a warm ember and a soft puff of smoke that rises + drifts.
function smoke(P, mx, my, env) {
  P.px(mx, my, "#efe7d8");                                   // paper
  P.px(mx + 1, my, env.night ? "#ff8a4a" : "#e0662a");       // ember (a light source)
  var f = env.frame || 0, rise = (f >> 1) % 4;
  var puff = P.mix("#cdd4cf", "#9fb0a0", 0.5);               // faintly green-grey
  P.withAlpha(0.7 - rise * 0.14, function () {
    P.px(mx + 1 + ((f >> 2) & 1), my - 1 - rise, env.col(puff));
  });
}

function legs(P, x, yb, pants, step) {
  P.px(x + 2, yb - 3, pants); P.px(x + 3, yb - 3, pants);    // hips
  if (step) { P.px(x + 2, yb - 2, pants); P.px(x + 2, yb - 1, pants); P.px(x + 2, yb, pants); P.px(x + 4, yb - 1, pants); P.px(x + 4, yb, pants); }
  else { P.px(x + 3, yb - 2, pants); P.px(x + 3, yb - 1, pants); P.px(x + 3, yb, pants); P.px(x + 2, yb, pants); }
}

// No `biomes` list → biome-universal: a person belongs anywhere, and the real
// gate is `require:"cannabis"` (compositor drops these unless world.cannabis), so
// they must be able to reach cannabis cities of ANY biome (e.g. jungle Kingston).
export default [
  {
    id: "hippie", name: "Hippie", require: "cannabis",
    tags: ["person", "chill", "cannabis"], w: 5, h: 8, anchor: "baseline", layer: "ground", rarity: 1.1,
    draw: function (P, x, yb, env) {
      var skin = "#cf9560", hair = env.col("#4a2f1a"), band = env.col("#c23a6a");
      var t1 = env.col("#d0863a"), t2 = env.col("#4a8a6a"), pants = env.col("#5a6a8a");
      var step = (env.frame >> 2) & 1;
      P.px(x + 2, yb - 7, hair); P.px(x + 3, yb - 7, hair);
      P.rect(x + 2, yb - 7, 2, 1, band);                     // headband
      P.px(x + 2, yb - 6, skin); P.px(x + 3, yb - 6, skin);  // face
      P.px(x + 1, yb - 5, hair); P.px(x + 4, yb - 4, hair);  // long hair
      P.px(x + 2, yb - 5, t1); P.px(x + 3, yb - 5, t2);      // tie-dye torso
      P.px(x + 2, yb - 4, t2); P.px(x + 3, yb - 4, t1);
      P.px(x + 4, yb - 5, skin);                             // arm raised to the joint
      smoke(P, x + 4, yb - 6, env);
      legs(P, x, yb, pants, step);
    }
  },
  {
    id: "stoner", name: "Stoner", require: "cannabis",
    tags: ["person", "chill", "cannabis"], w: 5, h: 8, anchor: "baseline", layer: "ground", rarity: 1.1,
    draw: function (P, x, yb, env) {
      var skin = "#c88a56", beanie = env.col("#3a6a4a"), hoodie = env.col("#556070"), pants = env.col("#33383f");
      var step = (env.frame >> 2) & 1;
      P.rect(x + 2, yb - 7, 2, 1, beanie); P.px(x + 2, yb - 8, beanie);   // slouchy beanie
      P.px(x + 2, yb - 6, skin); P.px(x + 3, yb - 6, skin);               // face
      P.px(x + 3, yb - 6, env.night ? skin : "#8a5a34");                  // shades hint
      P.px(x + 2, yb - 5, hoodie); P.px(x + 3, yb - 5, hoodie);           // hoodie
      P.px(x + 1, yb - 5, hoodie);                                        // hood/shoulder
      P.px(x + 2, yb - 4, hoodie); P.px(x + 3, yb - 4, hoodie);
      P.px(x + 4, yb - 5, skin);                                          // arm up
      smoke(P, x + 4, yb - 6, env);
      legs(P, x, yb, pants, step);
    }
  },
  {
    id: "rasta", name: "Rasta", require: "cannabis",
    tags: ["person", "chill", "cannabis"], w: 5, h: 9, anchor: "baseline", layer: "ground", rarity: 1.0,
    draw: function (P, x, yb, env) {
      var skin = "#7a4a2a", tamR = env.col("#c23a2a"), tamY = env.col("#d8b23a"), tamG = env.col("#3a8a4a");
      var shirt = env.col("#4a7a5a"), pants = env.col("#3a3f33"), dread = env.col("#2a1a10");
      var step = (env.frame >> 2) & 1;
      // knit tam (red/gold/green) over dreadlocks
      P.px(x + 2, yb - 8, tamR); P.px(x + 3, yb - 8, tamG);
      P.px(x + 2, yb - 7, tamY); P.px(x + 3, yb - 7, tamR);
      P.px(x + 1, yb - 6, dread); P.px(x + 4, yb - 5, dread);             // dreads to the sides
      P.px(x + 2, yb - 6, skin); P.px(x + 3, yb - 6, skin);               // face
      P.px(x + 2, yb - 5, shirt); P.px(x + 3, yb - 5, shirt);             // shirt
      P.px(x + 2, yb - 4, shirt); P.px(x + 3, yb - 4, shirt);
      P.px(x + 4, yb - 5, skin);                                          // arm up
      smoke(P, x + 4, yb - 6, env);
      legs(P, x, yb, pants, step);
    }
  }
];
