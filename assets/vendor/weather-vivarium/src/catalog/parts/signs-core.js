/* Reference signs — the display that carries the current temperature. Every
   landscape places one. `env.text` is the string to show (e.g. "72°"); signs are
   baseline-anchored (posts plant on row yb, the panel floats above). The neon
   billboard is ported from the LA widget: a bright day board that lights up as a
   noir neon sign through dusk (neon = 1 - dayT). */

export default [
  {
    // No `biomes` list → universal: guarantees every place has a temperature
    // display, even biomes without a themed sign (ocean, jungle, lake, …).
    id: "neon", name: "Neon billboard",
    tags: ["sign", "neon"], w: 19, h: 19, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var w = 19, h = 15, top = yb - 19, frame = env.frame;
      var neon = P.clamp(1 - env.dayT, 0, 1);
      var inner = P.clamp((neon - 0.25) / 0.75, 0, 1);
      var flick = (neon > 0.6 && (frame >> 1) % 17 === 0) ? 0.6 : 1;
      var postC = P.mix("#4a4a52", "#2a2a30", neon), postH = 4;
      P.rect(x + 4, top + h, 2, postH, postC);
      P.rect(x + w - 6, top + h, 2, postH, postC);
      P.rect(x, top, w, h, P.mix("#f7ead2", "#160f20", neon));       // panel
      var tube = P.mix("#1f9fb2", "#ff3ea5", neon);
      P.withAlpha(flick, function () {
        P.rect(x, top, w, 1, tube); P.rect(x, top + h - 1, w, 1, tube);
        P.rect(x, top, 1, h, tube); P.rect(x + w - 1, top, 1, h, tube);
      });
      if (inner > 0) {
        P.withAlpha(flick * inner, function () {
          P.rect(x + 1, top + 1, w - 2, 1, "#ff8ad0"); P.rect(x + 1, top + h - 2, w - 2, 1, "#ff8ad0");
        });
        P.withAlpha(0.22 * inner, function () { P.rect(x - 1, top - 1, w + 2, h + 2, "#ff3ea5"); });
      }
      if (neon < 0.55) {
        P.withAlpha((0.55 - neon) / 0.55, function () {
          P.disc(x + 3, top + 3, 1, "#ffcf33");
          P.px(x + 3, top + 1, "#ffcf33"); P.px(x + 5, top + 3, "#ffcf33");
          P.px(x + 3, top + 5, "#ffcf33"); P.px(x + 1, top + 3, "#ffcf33");
        });
      }
      var col = P.mix("#e8542f", "#5ff0ff", neon);
      var s = env.text || "--";
      var wpx = P.text ? (s.length * 4 - 1) : 0;
      var tx = x + Math.round((w - wpx) / 2), ty = top + Math.round((h - 5) / 2) + 1;
      P.text(s, tx, ty, col);
    }
  },
  {
    id: "trailpost", name: "Wooden trail sign", biomes: ["forest", "mountain", "plains", "tundra", "wetland", "jungle", "lake", "canyon", "savanna", "desert"],
    tags: ["sign", "wood"], w: 19, h: 16, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var post = env.col("#6a4f2e"), board = env.col("#9a7748"), edge = env.col("#5a4022");
      P.rect(x + 8, yb - 11, 2, 11, post);
      P.rect(x, yb - 13, 17, 7, board);            // pointed plank (wide enough for 3-4 digits)
      P.px(x + 17, yb - 12, board); P.px(x + 18, yb - 11, board); P.px(x + 17, yb - 8, board);
      P.rect(x, yb - 13, 17, 1, edge); P.rect(x, yb - 7, 17, 1, edge);
      var s = env.text || "", wpx = s.length * 4 - 1, tx = x + Math.round((17 - wpx) / 2);
      P.text(s, tx, yb - 12, env.night ? "#d8c48a" : "#3a2a14");
    }
  },
  {
    id: "shield", name: "Route shield", biomes: ["desert", "plains", "city", "coast", "farmland"],
    tags: ["sign", "road"], w: 18, h: 15, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var post = env.col("#9098a0"), trim = env.col("#eaf0ea");
      P.rect(x + 8, yb - 9, 2, 9, post);
      P.rect(x, yb - 15, 18, 8, env.col("#2f6a34"));    // green highway sign
      P.rect(x, yb - 15, 18, 1, trim); P.rect(x, yb - 8, 18, 1, trim);
      P.rect(x, yb - 15, 1, 8, trim); P.rect(x + 17, yb - 15, 1, 8, trim);
      var s = env.text || "", wpx = s.length * 4 - 1, tx = x + Math.round((18 - wpx) / 2);
      P.text(s, tx, yb - 13, "#f2f7f2");
    }
  },
  {
    id: "hangshop", name: "Hanging shop sign", biomes: ["city", "coast"],
    tags: ["sign", "shop"], w: 20, h: 16, anchor: "baseline",
    draw: function (P, x, yb, env) {
      var neon = P.clamp(1 - env.dayT, 0, 1);
      var bracket = env.col("#3a3a42");
      P.rect(x, yb - 15, 2, 15, bracket);              // wall bracket post
      P.rect(x + 1, yb - 15, 6, 1, bracket);           // arm
      P.rect(x + 6, yb - 14, 14, 8, P.mix("#f0e2c2", "#221830", neon)); // hanging board
      P.rect(x + 6, yb - 14, 1, 8, bracket);
      var col = P.mix("#b0432a", "#ffd24a", neon);
      var s = env.text || "", wpx = s.length * 4 - 1, tx = x + 6 + Math.round((14 - wpx) / 2);
      P.text(s, tx, yb - 12, col);
      if (neon > 0.3) P.withAlpha(0.25 * neon, function () { P.rect(x + 5, yb - 15, 16, 10, "#ffd24a"); });
    }
  }
];
