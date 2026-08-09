/* Reference birds — the gull and pelican ported from the LA widget. Birds use
   anchor:"center": (x, y) is the bird's midpoint, wings flap on env.frame, and
   env.dir (±1) points the head toward travel. The compositor flips left-bound
   birds, but these are drawn direction-aware so either reads right. */

export default [
  {
    id: "gull", name: "Seagull", biomes: ["coast", "ocean", "lake", "city", "wetland", "tundra"],
    tags: ["bird", "sky", "shore"], w: 5, h: 2, anchor: "center", rarity: 3,
    draw: function (P, x, y, env) {
      var up = ((env.frame >> 2) & 1) === 0;
      var c = env.dayT < 0.3 ? "#c8d0d8" : "#ffffff";
      if (up) { P.px(x - 2, y, c); P.px(x - 1, y - 1, c); P.px(x, y, c); P.px(x + 1, y - 1, c); P.px(x + 2, y, c); }
      else { P.px(x - 2, y - 1, c); P.px(x - 1, y, c); P.px(x, y - 1, c); P.px(x + 1, y, c); P.px(x + 2, y - 1, c); }
    }
  },
  {
    id: "pelican", name: "Brown pelican", biomes: ["coast", "wetland"],
    tags: ["bird", "sky", "shore"], w: 7, h: 3, anchor: "center", rarity: 0.6,
    draw: function (P, x, y, env) {
      var up = ((env.frame >> 2) & 1) === 0;
      var d = env.dir || 1;
      var body = env.dayT < 0.3 ? "#5a4330" : "#7a5636";
      var bill = env.dayT < 0.3 ? "#9a7a3a" : "#e0b45a";
      if (up) { P.px(x - 3, y, body); P.px(x - 2, y - 1, body); P.px(x - 1, y - 1, body); P.px(x + 1, y - 1, body); P.px(x + 2, y - 1, body); P.px(x + 3, y, body); }
      else { P.px(x - 3, y - 1, body); P.px(x - 2, y, body); P.px(x - 1, y, body); P.px(x + 1, y, body); P.px(x + 2, y, body); P.px(x + 3, y - 1, body); }
      P.px(x, y, body);
      P.px(x + d, y, body);
      P.px(x + 2 * d, y + 1, bill); P.px(x + 3 * d, y + 1, bill);
    }
  }
];
