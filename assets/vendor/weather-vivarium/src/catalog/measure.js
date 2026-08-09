/* measure.js — robust ground alignment for placed sprites.

   Landmarks were authored by many hands: some draw their lowest pixel exactly on
   the baseline yb, others 1px above it, so a chunk of them floated a pixel over
   the ground ("1px too short"). Rather than hand-normalise every sprite, we
   measure each one's base once — a tiny mock Painter runs the draw and records
   the lowest painted row — and the compositor plants it so that lowest row lands
   exactly on the ground line. Appearance is untouched; only placement is fixed,
   and any future landmark is auto-grounded too. */

function mockPainter() {
  var maxY = -Infinity;
  function mark(y) { if (y > maxY) maxY = y; }
  function span(y0, y1) { mark(y0 > y1 ? y0 : y1); }
  var noop = function () {};
  var P = {
    L: 50,
    px: function (x, y) { mark(y); },
    rect: function (x, y, w, h) { mark(y + (h > 0 ? h - 1 : 0)); },
    line: function (x0, y0, x1, y1) { span(y0, y1); },
    disc: function (x, y, r) { mark(y + r); },
    dband: function (x, y0, w, y1) { span(y0, y1); },
    glyph: noop, text: noop,
    withAlpha: function (a, fn) { fn(); },
    mix: function (a) { return a; }, shade: function (a) { return a; }, tint: function (a) { return a; },
    lerp: function (a) { return a; }, clamp: function (v, a, b) { return v < a ? a : v > b ? b : v; },
    hex: function (a) { return a; }, BAYER: [[0, 0], [0, 0]]
  };
  return { P: P, max: function () { return maxY; } };
}

// A neutral, deterministic env — enough surface that any draw runs to completion.
var ENV = {
  L: 50, horizon: 24, groundTop: 37, roadBot: 46, frame: 0, now: 720, dayT: 1, night: false,
  col: function (c) { return c; }, rng: function () { return 0.5; }, dir: 1,
  wind: 0.3, code: 0, cloud: 20, aqi: 40, temp: 70, intensity: 0, tide: 0.5, waveM: 0.8
};

/** Rows the entry's lowest pixel sits ABOVE its baseline yb (>= 0). Cached.

    Sampled across a walk cycle, not from one frame: a deer with a hoof lifted on
    frame 0 reaches a row lower on frame 3, and planting it by the lifted-hoof
    measurement would drive the planted hoof below the ground. We take the DEEPEST
    the sprite ever reaches, so no frame of the animation ever sinks. */
export function groundOffset(entry) {
  if (entry.__groundOff != null) return entry.__groundOff;
  var off = 0, refYb = 40, deepest = -Infinity;
  try {
    for (var f = 0; f < 8; f++) {
      var m = mockPainter();
      var env = Object.assign({}, ENV, { frame: f });
      entry.draw(m.P, 8, refYb, env);
      var maxY = m.max();
      if (isFinite(maxY) && maxY > deepest) deepest = maxY;
    }
    if (isFinite(deepest)) off = refYb - deepest;
    if (off < 0) off = 0;   // never plant a sprite below the ground line
  } catch (e) { off = 0; }
  entry.__groundOff = off;
  return off;
}

/** The entry's real painted horizontal span, relative to its anchor x, sampled
    across a full animation cycle — {left, right} where left <= 0 <= right.

    Placement used to trust the declared `w`, but canopies don't read contracts:
    the palm's fronds reach four columns past its box, so a second tree placed
    "clash-free" beside it still landed in the leaves (Santa Monica), and the
    sign's clearance was measured to the wrong edge (Seattle, Paris). Measured
    once per entry and cached, exactly like groundOffset. */
export function paintedSpan(entry) {
  if (entry.__span) return entry.__span;
  var minX = Infinity, maxX = -Infinity, refX = 20;
  try {
    for (var f = 0; f < 8; f++) {
      var m = mockPainterX();
      entry.draw(m.P, refX, 40, Object.assign({}, ENV, { frame: f }));
      if (m.min() < minX) minX = m.min();
      if (m.max() > maxX) maxX = m.max();
    }
  } catch (e) { /* fall through to the declared box */ }
  var span = isFinite(minX)
    ? { left: Math.min(0, minX - refX), right: Math.max((entry.w || 1) - 1, maxX - refX) }
    : { left: 0, right: (entry.w || 1) - 1 };
  entry.__span = span;
  return span;
}

// A sibling of mockPainter that records X extents instead of the lowest row.
function mockPainterX() {
  var minX = Infinity, maxX = -Infinity;
  function mark(x) { if (x < minX) minX = x; if (x > maxX) maxX = x; }
  function span2(x0, x1) { mark(x0 < x1 ? x0 : x1); mark(x0 < x1 ? x1 : x0); }
  var noop = function () {};
  var P = {
    L: 50,
    px: function (x) { mark(x); },
    rect: function (x, y, w, h) { mark(x); mark(x + (w > 0 ? w - 1 : 0)); },
    line: function (x0, y0, x1, y1) { span2(x0, x1); },
    disc: function (x, y, r) { mark(x - r); mark(x + r); },
    dband: function (x0, y0, x1) { span2(x0, x1); },
    glyph: noop, text: function (s, x) { if (typeof x === "number") { mark(x); mark(x + (s ? s.length * 4 - 1 : 0)); } },
    withAlpha: function (a, fn) { fn(); },
    alpha: noop, flip: function (x, w, fn) { fn(); }, clear: noop,
    mix: function (a) { return a; }, shade: function (a) { return a; }, tint: function (a) { return a; },
    lerp: function (a) { return a; }, clamp: function (v, a, b) { return v < a ? a : v > b ? b : v; },
    hex: function (a) { return a; }, BAYER: [0, 0, 0, 0]
  };
  return { P: P, min: function () { return minX; }, max: function () { return maxX; } };
}
