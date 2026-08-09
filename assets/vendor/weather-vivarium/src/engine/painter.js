/* =========================================================================
   painter.js — the pixel-art drawing surface for weather-vivarium.

   Everything in a diorama is drawn through a single `Painter` object bound to a
   small logical canvas (default 50x50), which the compositor upscales with
   nearest-neighbour to the display size. Sprites (trees, vehicles, animals, …)
   never touch a raw 2D context: they receive the Painter and call its
   primitives. That keeps the whole catalog consistent and portable, and lets us
   render the exact same code in a browser or in a headless test harness.

   The primitives (px / rect / disc / line / glyph) and the colour helpers
   (mix / hex / lerp / clamp) are ported verbatim in behaviour from the original
   Kevin Haulihan LA beach widget, so sprites carried over from it look pixel
   identical.
   ========================================================================= */

export function clamp(v, a, z) { return v < a ? a : v > z ? z : v; }
export function lerp(a, z, t) { return a + (z - a) * t; }

/** Clamp a number to a 2-digit hex byte. */
export function hex(n) {
  n = clamp(Math.round(n), 0, 255).toString(16);
  return n.length < 2 ? "0" + n : n;
}

/** Blend two "#rrggbb" colours; t=0 → c1, t=1 → c2. */
export function mix(c1, c2, t) {
  var r1 = parseInt(c1.slice(1, 3), 16), g1 = parseInt(c1.slice(3, 5), 16), b1 = parseInt(c1.slice(5, 7), 16);
  var r2 = parseInt(c2.slice(1, 3), 16), g2 = parseInt(c2.slice(3, 5), 16), b2 = parseInt(c2.slice(5, 7), 16);
  return "#" + hex(lerp(r1, r2, t)) + hex(lerp(g1, g2, t)) + hex(lerp(b1, b2, t));
}

/** Darken a colour toward black by amount 0..1 (quick shade helper for sprites). */
export function shade(c, amt) { return mix(c, "#000000", amt); }
/** Lighten a colour toward white by amount 0..1. */
export function tint(c, amt) { return mix(c, "#ffffff", amt); }

// 4x4 Bayer matrix for cheap ordered dithering between two shades.
export var BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

// 3x5 pixel font — digits, a few letters and punctuation the signs/temperature use.
export var FONT = {
  "0": ["111", "101", "101", "101", "111"], "1": ["010", "110", "010", "010", "111"],
  "2": ["111", "001", "111", "100", "111"], "3": ["111", "001", "111", "001", "111"],
  "4": ["101", "101", "111", "001", "001"], "5": ["111", "100", "111", "001", "111"],
  "6": ["111", "100", "111", "101", "111"], "7": ["111", "001", "010", "010", "010"],
  "8": ["111", "101", "111", "101", "111"], "9": ["111", "101", "111", "001", "111"],
  "-": ["000", "000", "111", "000", "000"], "+": ["000", "010", "111", "010", "000"],
  "°": ["110", "110", "000", "000", "000"], ".": ["000", "000", "000", "000", "010"],
  "/": ["001", "001", "010", "100", "100"], "%": ["101", "001", "010", "100", "101"],
  "A": ["111", "101", "111", "101", "101"], "C": ["111", "100", "100", "100", "111"],
  "F": ["111", "100", "111", "100", "100"], "M": ["101", "111", "111", "101", "101"],
  "N": ["101", "111", "111", "111", "101"], "P": ["111", "101", "111", "100", "100"],
  "H": ["101", "101", "111", "101", "101"], "L": ["100", "100", "100", "100", "111"],
  "O": ["111", "101", "101", "101", "111"], "S": ["111", "100", "111", "001", "111"],
  "W": ["101", "101", "111", "111", "101"], "E": ["111", "100", "111", "100", "111"],
  " ": ["000", "000", "000", "000", "000"]
};

/**
 * Create a Painter bound to a CanvasRenderingContext2D-like object `b`.
 * `L` is the logical resolution (square). The context must have
 * imageSmoothingEnabled = false for crisp pixels.
 */
export function createPainter(b, L) {
  function px(x, y, c) { b.fillStyle = c; b.fillRect(x | 0, y | 0, 1, 1); }
  function rect(x, y, w, h, c) { b.fillStyle = c; b.fillRect(x | 0, y | 0, w | 0, h | 0); }
  function disc(cx, cy, r, c) { b.fillStyle = c; b.beginPath(); b.arc(cx + 0.5, cy + 0.5, r, 0, 7); b.fill(); }

  // Bresenham line in 1px steps.
  function line(x0, y0, x1, y1, c) {
    x0 |= 0; y0 |= 0; x1 |= 0; y1 |= 0;
    var dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1, e = dx - dy;
    for (;;) { px(x0, y0, c); if (x0 === x1 && y0 === y1) break; var e2 = 2 * e; if (e2 > -dy) { e -= dy; x0 += sx; } if (e2 < dx) { e += dx; y0 += sy; } }
  }

  // A 3x5 glyph from FONT. Returns the advance width (4px) for chaining.
  function glyph(ch, x, y, c) {
    var g = FONT[ch];
    if (!g) return 4;
    for (var r = 0; r < 5; r++) for (var k = 0; k < 3; k++) if (g[r][k] === "1") px(x + k, y + r, c);
    return 4;
  }
  // Draw a whole string left-to-right; returns pixel width drawn.
  function text(str, x, y, c) {
    var cx = x;
    for (var i = 0; i < str.length; i++) { glyph(str[i], cx, y, c); cx += 4; }
    return cx - x - 1;
  }

  // Vertical dithered gradient band from `top` (y0) to `bot` (y1).
  function dband(x0, y0, x1, y1, top, bot) {
    var h = y1 - y0;
    for (var y = y0; y < y1; y++) {
      var t = h <= 1 ? 0 : (y - y0) / (h - 1);
      var lo = mix(top, bot, clamp(t - 0.06, 0, 1));
      var hi = mix(top, bot, clamp(t + 0.06, 0, 1));
      for (var x = x0; x < x1; x++) {
        var thr = BAYER[(x & 3) + (y & 3) * 4] / 16;
        b.fillStyle = t > thr ? lo : hi;
        b.fillRect(x, y, 1, 1);
      }
    }
  }

  // Set global alpha (sprites restore it themselves or use withAlpha).
  function alpha(a) { b.globalAlpha = a; }
  function withAlpha(a, fn) { var prev = b.globalAlpha; b.globalAlpha = a; fn(); b.globalAlpha = prev; }

  // Draw `fn` horizontally mirrored within [x, x+w). Used to face a nose-right
  // sprite left (the whole catalog is authored nose-right by convention).
  function flip(x, w, fn) {
    b.save();
    b.translate(x + w, 0);
    b.scale(-1, 1);
    b.translate(-x, 0);
    fn();
    b.restore();
  }

  function clear() { b.clearRect(0, 0, L, L); }

  return {
    ctx: b, L: L,
    px: px, rect: rect, disc: disc, line: line, glyph: glyph, text: text,
    dband: dband, alpha: alpha, withAlpha: withAlpha, flip: flip, clear: clear,
    // colour helpers, handed to sprites so a draw fn needs only the Painter:
    mix: mix, hex: hex, lerp: lerp, clamp: clamp, shade: shade, tint: tint, BAYER: BAYER
  };
}
