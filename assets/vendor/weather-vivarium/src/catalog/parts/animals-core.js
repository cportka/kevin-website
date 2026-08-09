/* Reference animals across the three placement layers:
   - layer "ground" (default): feet on row yb, walk cycle on env.frame, faces right.
   - layer "water": anchor "center", drawn inside the water band, arcing.
   - layer "air":   anchor "center", flits with a small bob.
   env.rough is true in bad weather (creatures hunch / hurry). The cat is ported
   from the LA widget. */

export default [
  {
    id: "cat", name: "Cat", biomes: ["coast", "city", "farmland", "plains", "forest"],
    tags: ["animal", "small", "pet"], w: 7, h: 4, anchor: "baseline", layer: "ground", rarity: 1.4,
    draw: function (P, x, yb, env) {
      var night = env.night;
      var body = night ? "#b98a52" : "#d99a4a", dark = night ? "#8a6636" : "#b06a2a";
      var step = (env.frame >> 2) & 1;
      if (env.rough) {
        P.rect(x + 1, yb - 1, 4, 1, body); P.px(x + 5, yb - 1, body);
        P.px(x + 5, yb - 2, dark); P.px(x + 6, yb - 2, dark);
        P.px(x, yb - 1, body); P.px(x + 2, yb, dark); P.px(x + 4, yb, dark);
      } else {
        P.px(x, yb - 2, body); P.px(x, yb - 3, body);           // tail up
        P.rect(x + 1, yb - 1, 4, 1, body);
        P.px(x + 4, yb - 2, body); P.px(x + 5, yb - 2, body);   // head
        P.px(x + 4, yb - 3, dark); P.px(x + 5, yb - 3, dark);   // ears
        P.px(x + 2, yb - 1, dark); P.px(x + 3, yb - 1, dark);   // stripes
        if (step) { P.px(x + 1, yb, dark); P.px(x + 4, yb, dark); }
        else { P.px(x + 2, yb, dark); P.px(x + 5, yb, dark); }
      }
    }
  },
  {
    id: "dog", name: "Dog", biomes: ["coast", "city", "farmland", "plains", "forest", "mountain"],
    tags: ["animal", "small", "pet"], w: 8, h: 5, anchor: "baseline", layer: "ground", rarity: 1.2,
    draw: function (P, x, yb, env) {
      var body = env.col("#8a6a3a"), dark = env.col("#5f4826");
      var step = (env.frame >> 2) & 1;
      P.px(x, yb - 2, body); P.line(x, yb - 2, x - 1, yb - 3, body);   // tail
      P.rect(x + 1, yb - 2, 4, 2, body);                                // body
      P.px(x + 5, yb - 3, body); P.rect(x + 5, yb - 2, 2, 1, body);     // neck+head
      P.px(x + 6, yb - 2, body); P.px(x + 7, yb - 2, dark);             // snout
      P.px(x + 5, yb - 4, dark);                                        // ear
      if (step) { P.px(x + 1, yb, dark); P.px(x + 4, yb, dark); }
      else { P.px(x + 2, yb, dark); P.px(x + 5, yb, dark); }
    }
  },
  {
    id: "deer", name: "Deer", biomes: ["forest", "mountain", "plains", "tundra", "lake"],
    tags: ["animal", "medium", "wild"], w: 10, h: 9, anchor: "baseline", layer: "ground", rarity: 0.8,
    draw: function (P, x, yb, env) {
      var body = env.col("#9a6a3e"), dark = env.col("#6f4a28");
      P.rect(x + 1, yb - 5, 6, 3, body);           // body
      P.rect(x + 1, yb - 2, 1, 2, dark); P.rect(x + 3, yb - 2, 1, 2, dark);
      P.rect(x + 5, yb - 2, 1, 2, dark); P.rect(x + 6, yb - 2, 1, 2, dark); // legs
      P.rect(x + 7, yb - 7, 1, 3, body);           // neck
      P.px(x + 8, yb - 8, body); P.px(x + 9, yb - 8, body); // head
      P.px(x + 7, yb - 9, dark); P.px(x + 9, yb - 9, dark); // antlers/ears
    }
  },
  {
    id: "rabbit", name: "Rabbit", biomes: ["plains", "farmland", "forest", "tundra", "desert", "canyon", "lake"],
    tags: ["animal", "tiny", "wild"], w: 5, h: 4, anchor: "baseline", layer: "ground", rarity: 1.1,
    draw: function (P, x, yb, env) {
      var body = env.col("#b9a48a"), dark = env.col("#8a7358");
      var hop = (env.frame >> 2) & 1;
      var yy = yb - (hop ? 1 : 0);
      P.rect(x + 1, yy - 2, 3, 2, body);            // body
      P.px(x + 4, yy - 3, body); P.px(x + 4, yy - 2, body); // head
      P.px(x + 4, yy - 4, dark); P.px(x + 3, yy - 4, dark); // ears
      P.px(x, yy - 1, body);                        // tail
      if (!hop) { P.px(x + 1, yy, dark); P.px(x + 3, yy, dark); }
    }
  },
  {
    id: "crab", name: "Crab", biomes: ["coast", "wetland"],
    tags: ["animal", "tiny", "shore"], w: 6, h: 3, anchor: "baseline", layer: "ground", rarity: 0.9,
    draw: function (P, x, yb, env) {
      var sh = env.col("#c1502f"), dk = env.col("#8f351c");
      var sc = (env.frame >> 2) & 1;
      P.rect(x + 1, yb - 2, 4, 2, sh);
      P.px(x + 1, yb - 3, dk); P.px(x + 4, yb - 3, dk);  // eyestalks
      P.px(x, yb - 2, dk); P.px(x + 5, yb - 2, dk);      // claws
      if (sc) { P.px(x + 1, yb, dk); P.px(x + 4, yb, dk); }
      else { P.px(x, yb, dk); P.px(x + 5, yb, dk); }
    }
  },
  {
    id: "dolphin", name: "Dolphin", biomes: ["coast"],
    tags: ["animal", "water", "sea"], w: 9, h: 6, anchor: "center", layer: "water", rarity: 0.7,
    draw: function (P, x, y, env) {
      var body = env.col("#5a7f9a"), belly = env.col("#c7d6df");
      // leaping arc: a curved body with a dorsal fin and tail fluke
      P.line(x - 3, y + 1, x, y - 2, body);
      P.line(x, y - 2, x + 3, y - 1, body);
      P.px(x + 1, y - 3, body);                    // dorsal fin
      P.px(x - 3, y + 1, body); P.px(x - 4, y, body); // tail
      P.px(x + 3, y - 1, belly); P.px(x + 2, y, belly);
    }
  },
  {
    id: "fish", name: "Fish", biomes: ["coast", "lake", "wetland"],
    tags: ["animal", "water", "small"], w: 5, h: 3, anchor: "center", layer: "water", rarity: 1.2,
    draw: function (P, x, y, env) {
      var c = env.col("#7fb0c0");
      P.rect(x - 1, y, 3, 1, c); P.px(x + 2, y, c);
      P.px(x - 2, y - 1, c); P.px(x - 2, y + 1, c);   // tail
      P.px(x + 1, y - 1, P.tint(c, 0.2));
    }
  },
  {
    id: "butterfly", name: "Butterfly", biomes: ["plains", "farmland", "forest", "jungle", "wetland", "mountain", "savanna", "lake", "canyon", "coast"],
    tags: ["animal", "air", "insect"], w: 4, h: 3, anchor: "center", layer: "air", rarity: 1.3,
    draw: function (P, x, y, env) {
      var open = (env.frame >> 1) & 1;
      var c = env.col("#e8863a"), d = env.col("#7a3f16");
      if (open) { P.px(x - 1, y - 1, c); P.px(x - 1, y, c); P.px(x + 1, y - 1, c); P.px(x + 1, y, c); }
      else { P.px(x - 1, y, c); P.px(x + 1, y, c); }
      P.px(x, y, d);
    }
  }
];
