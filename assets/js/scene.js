/* =========================================================================
   Kevin Haulihan — living LA beach diorama widget
   A 100x100 pixel-art scene (50x50 logical, nearest-neighbor upscaled) of a
   vintage-80s LA-noir beach: sky + sun/moon + clouds, ocean with waves, sand,
   an askew coast road with cars passing, a neon sign showing the temperature,
   and a wind-swept palm. Everything is driven by REAL Los Angeles time and
   weather — sun sets at LA sunset, sky color tracks conditions, waves track
   surf, the sign's neon lights only around dusk, the palm sways with LA wind.

   Data (all keyless, CORS, each optional with a graceful fallback):
     - api.open-meteo.com          temp, code, is_day, wind, cloud, sun times
     - marine-api.open-meteo.com   wave height (surf intensity)
     - air-quality-api.open-meteo.com  AQI/PM2.5 (smog/smoke tint)
     - api.tidesandcurrents.noaa.gov   Santa Monica tide (waterline height)

   Pure progressive enhancement: no data => sensible defaults; no <canvas> or
   reduced motion => a single static frame or nothing. No third-party scripts.
   ========================================================================= */
(function () {
  "use strict";

  var host = document.body;
  if (!host) { return; }

  // ---- geometry -----------------------------------------------------------
  var L = 50;            // logical resolution (crisp 2x -> 100 CSS px)
  var reduce = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var wrap = document.createElement("div");
  wrap.className = "scene";
  wrap.setAttribute("role", "img");
  wrap.setAttribute("aria-label", "Los Angeles beach, pixel-art weather scene");

  var cv = document.createElement("canvas");
  cv.className = "scene__cv";
  cv.width = 100; cv.height = 100;
  wrap.appendChild(cv);

  var ctx = cv.getContext && cv.getContext("2d");
  if (!ctx) { return; }                    // no canvas -> no widget
  ctx.imageSmoothingEnabled = false;

  var buf = document.createElement("canvas");
  buf.width = L; buf.height = L;
  var b = buf.getContext("2d");
  b.imageSmoothingEnabled = false;

  host.appendChild(wrap);

  // ---- tiny helpers -------------------------------------------------------
  function px(x, y, c) { b.fillStyle = c; b.fillRect(x | 0, y | 0, 1, 1); }
  function rect(x, y, w, h, c) { b.fillStyle = c; b.fillRect(x | 0, y | 0, w | 0, h | 0); }
  function clamp(v, a, z) { return v < a ? a : v > z ? z : v; }
  function lerp(a, z, t) { return a + (z - a) * t; }
  function hex(n) { n = clamp(Math.round(n), 0, 255).toString(16); return n.length < 2 ? "0" + n : n; }
  function mix(c1, c2, t) {           // "#rrggbb" blend
    var r1 = parseInt(c1.slice(1, 3), 16), g1 = parseInt(c1.slice(3, 5), 16), b1 = parseInt(c1.slice(5, 7), 16);
    var r2 = parseInt(c2.slice(1, 3), 16), g2 = parseInt(c2.slice(3, 5), 16), b2 = parseInt(c2.slice(5, 7), 16);
    return "#" + hex(lerp(r1, r2, t)) + hex(lerp(g1, g2, t)) + hex(lerp(b1, b2, t));
  }
  // 4x4 Bayer for cheap ordered dithering between two shades.
  var BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  function dband(x0, y0, x1, y1, top, bot) {   // vertical dithered gradient
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

  // Los Angeles wall-clock minutes-since-midnight (real time, not the user's).
  function laMinutes() {
    if (typeof window.__sceneNow === "number") { return window.__sceneNow; }  // test/preview override
    try {
      var p = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Los_Angeles", hour: "2-digit", minute: "2-digit",
        second: "2-digit", hour12: false
      }).formatToParts(new Date());
      var h = 0, m = 0, s = 0;
      for (var i = 0; i < p.length; i++) {
        if (p[i].type === "hour") h = +p[i].value;
        if (p[i].type === "minute") m = +p[i].value;
        if (p[i].type === "second") s = +p[i].value;
      }
      return ((h % 24) * 60 + m + s / 60);
    } catch (e) { return (Date.now() / 60000) % 1440; }
  }

  // ---- live state (with fallbacks) ---------------------------------------
  var W = {
    temp: null,          // deg F
    code: 1,             // WMO
    cloud: 25,           // %
    windKph: 9,          // km/h
    sunrise: 6 * 60 + 5, // minutes
    sunset: 19 * 60 + 40,
    waveM: 0.9,          // wave height, m
    aqi: 45,             // US AQI
    tide: 0.5            // 0 (low) .. 1 (high)
  };

  function hm(iso) {     // "…THH:MM" -> minutes
    var m = /T(\d{2}):(\d{2})/.exec(iso || "");
    return m ? (+m[1]) * 60 + (+m[2]) : null;
  }

  var LAT = 34.019, LON = -118.491;   // Santa Monica-ish
  function j(url) { return fetch(url, { mode: "cors" }).then(function (r) { return r && r.ok ? r.json() : null; }).catch(function () { return null; }); }

  function loadData() {
    var tz = "&timezone=America%2FLos_Angeles";
    j("https://api.open-meteo.com/v1/forecast?latitude=" + LAT + "&longitude=" + LON +
      "&current=temperature_2m,weather_code,is_day,wind_speed_10m,cloud_cover&daily=sunrise,sunset" +
      "&temperature_unit=fahrenheit&wind_speed_unit=kmh&forecast_days=1" + tz).then(function (d) {
      if (!d || !d.current) { return; }
      var c = d.current;
      if (typeof c.temperature_2m === "number") { W.temp = Math.round(c.temperature_2m); }
      if (typeof c.weather_code === "number") { W.code = c.weather_code; }
      if (typeof c.cloud_cover === "number") { W.cloud = c.cloud_cover; }
      if (typeof c.wind_speed_10m === "number") { W.windKph = c.wind_speed_10m; }
      if (d.daily && d.daily.sunrise && d.daily.sunrise[0]) { var sr = hm(d.daily.sunrise[0]); if (sr != null) W.sunrise = sr; }
      if (d.daily && d.daily.sunset && d.daily.sunset[0]) { var ss = hm(d.daily.sunset[0]); if (ss != null) W.sunset = ss; }
      describe();
    });
    j("https://marine-api.open-meteo.com/v1/marine?latitude=" + LAT + "&longitude=" + LON +
      "&current=wave_height" + tz).then(function (d) {
      if (d && d.current && typeof d.current.wave_height === "number") { W.waveM = d.current.wave_height; }
    });
    j("https://air-quality-api.open-meteo.com/v1/air-quality?latitude=" + LAT + "&longitude=" + LON +
      "&current=us_aqi" + tz).then(function (d) {
      if (d && d.current && typeof d.current.us_aqi === "number") { W.aqi = d.current.us_aqi; }
    });
    // NOAA Santa Monica (9410840) hi/lo tide predictions for today -> current level.
    var day = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Los_Angeles", year: "numeric", month: "2-digit", day: "2-digit" })
      .format(new Date()).replace(/-/g, "");
    j("https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions&application=kevinhaulihan.online" +
      "&datum=MLLW&station=9410840&time_zone=lst_ldt&units=english&interval=hilo&format=json&begin_date=" + day + "&end_date=" + day)
      .then(function (d) {
        if (!d || !d.predictions || !d.predictions.length) { return; }
        var pr = d.predictions.map(function (p) {
          var t = /\s(\d{2}):(\d{2})/.exec(p.t); return { m: t ? (+t[1]) * 60 + (+t[2]) : 0, v: +p.v, hi: p.type === "H" }; });
        var now = laMinutes(), lo = null, hi = null;
        for (var i = 0; i < pr.length; i++) {
          if (pr[i].m <= now && (!lo || pr[i].m > lo.m)) lo = pr[i];
          if (pr[i].m >= now && (!hi || pr[i].m < hi.m)) hi = pr[i];
        }
        var vals = pr.map(function (p) { return p.v; });
        var mn = Math.min.apply(null, vals), mx = Math.max.apply(null, vals), rng = (mx - mn) || 1;
        var cur;
        if (lo && hi && hi.m !== lo.m) {              // cosine interpolate between extrema
          var f = (now - lo.m) / (hi.m - lo.m);
          cur = lo.v + (hi.v - lo.v) * (0.5 - 0.5 * Math.cos(f * Math.PI));
        } else { cur = (lo || hi || { v: (mn + mx) / 2 }).v; }
        W.tide = clamp((cur - mn) / rng, 0, 1);
      });
  }

  function conditionWord() {
    var c = W.code;
    if (c === 0) return "clear"; if (c <= 2) return "partly cloudy"; if (c === 3) return "overcast";
    if (c === 45 || c === 48) return "foggy"; if (c >= 51 && c <= 67) return "rainy";
    if (c >= 71 && c <= 77) return "snowy"; if (c >= 80 && c <= 82) return "showers";
    if (c >= 95) return "stormy"; return "cloudy";
  }
  function describe() {
    var now = laMinutes();
    var tod = now < W.sunrise || now > W.sunset ? "night"
      : Math.abs(now - W.sunset) < 45 ? "sunset" : Math.abs(now - W.sunrise) < 45 ? "sunrise" : "day";
    wrap.setAttribute("aria-label",
      "Los Angeles: " + (W.temp == null ? "—" : W.temp + "°F") + ", " + conditionWord() + ", " +
      tod + (W.aqi > 130 ? ", smoggy" : "") + " — a pixel-art LA beach scene.");
  }

  // =========================================================================
  //  RENDER
  // =========================================================================
  var HORIZON = 24, SANDTOP = 30, ROADTOP = 37, ROADBOT = 46;

  function skyPalette(now, dayT) {
    // Base sky (day) from conditions, then blend toward sunset / night.
    var clear = { top: "#2f6bb0", hor: "#8fc6e8" };
    var grey = { top: "#6f767f", hor: "#aab0b6" };
    var fog = { top: "#b9bcc0", hor: "#d9dcde" };
    var rain = { top: "#3f4a58", hor: "#6d7885" };
    var base;
    var c = W.code, cloudy = clamp(W.cloud / 100, 0, 1);
    if (c === 45 || c === 48) base = fog;
    else if (c >= 51 && c <= 82) base = rain;
    else if (c >= 95) base = { top: "#2c2f3a", hor: "#565b69" };
    else { base = { top: mix(clear.top, grey.top, cloudy), hor: mix(clear.hor, grey.hor, cloudy) }; }

    // dayT: 1 = full day, 0 = night; sunsetGlow: 0..1 around sunset/sunrise.
    var night = { top: "#0a1230", hor: "#243056" };
    var glow = { top: "#3a2a63", hor: "#ff8a4c" };
    var sunNear = Math.min(Math.abs(now - W.sunset), Math.abs(now - W.sunrise));
    var glowT = clamp(1 - sunNear / 55, 0, 1);
    var top = mix(base.top, night.top, 1 - dayT);
    var hor = mix(base.hor, night.hor, 1 - dayT);
    top = mix(top, glow.top, glowT * 0.8 * dayT + glowT * 0.4 * (1 - dayT));
    hor = mix(hor, glow.hor, glowT * (0.85 * dayT + 0.5 * (1 - dayT)));

    // Smog/smoke: push toward brown when AQI is high.
    var smog = clamp((W.aqi - 90) / 120, 0, 0.6);
    if (smog > 0) { top = mix(top, "#6d4f30", smog * 0.7); hor = mix(hor, "#c08a4e", smog); }
    return { top: top, hor: hor };
  }

  function drawSky(now, dayT, frame) {
    var sky = skyPalette(now, dayT);
    dband(0, 0, L, HORIZON, sky.top, sky.hor);

    // Stars at night
    if (dayT < 0.25) {
      var a = (0.25 - dayT) / 0.25;
      var seed = [3, 5, 9, 14, 19, 23, 28, 33, 39, 44, 47];
      for (var i = 0; i < seed.length; i++) {
        var sx = seed[i], sy = (seed[i] * 7) % HORIZON;
        if (((frame >> 3) + i) % 5 !== 0) px(sx, sy, mix("#0a1230", "#dfe6ff", a * 0.9));
      }
    }
    return sky;
  }

  function drawSun(now, dayT, sky) {
    var span = W.sunset - W.sunrise; if (span < 60) span = 720;
    if (now >= W.sunrise && now <= W.sunset) {
      var p = (now - W.sunrise) / span;                 // 0..1 across the day
      var sx = Math.round(lerp(6, 44, p));
      var sy = Math.round(HORIZON - 2 - Math.sin(p * Math.PI) * (HORIZON - 6));
      var low = Math.sin(p * Math.PI) < 0.35;           // near horizon -> orange
      var core = low ? "#ffd27a" : "#fff2c4";
      var glow = low ? "#ff9a4e" : "#ffe08a";
      // soft glow
      b.globalAlpha = 0.5; disc(sx, sy, 4, glow); b.globalAlpha = 1;
      disc(sx, sy, 3, core);
      // haze dims the sun when cloudy/smoggy/foggy
      var dim = clamp(W.cloud / 100 * 0.5 + clamp((W.aqi - 90) / 160, 0, 0.5), 0, 0.8);
      if (W.code === 45 || W.code === 48) dim = Math.max(dim, 0.55);
      if (dim > 0) { b.globalAlpha = dim; disc(sx, sy, 4, sky.top); b.globalAlpha = 1; }
      return { x: sx, y: sy };
    } else {
      // Moon
      var mnp = now < W.sunrise ? (now + 1440 - W.sunset) / ((1440 - W.sunset) + W.sunrise)
        : (now - W.sunset) / ((1440 - W.sunset) + W.sunrise);
      var mx = Math.round(lerp(8, 42, clamp(mnp, 0, 1)));
      var my = Math.round(HORIZON - 4 - Math.sin(clamp(mnp, 0, 1) * Math.PI) * (HORIZON - 8));
      disc(mx, my, 3, "#e9e7cf");
      b.fillStyle = sky.top; b.beginPath(); b.arc(mx + 1.4, my - 0.6, 2.4, 0, 7); b.fill();
      return null;
    }
  }
  function disc(cx, cy, r, c) { b.fillStyle = c; b.beginPath(); b.arc(cx + 0.5, cy + 0.5, r, 0, 7); b.fill(); }

  function drawClouds(now, dayT, frame, sky) {
    var cover = clamp(W.cloud / 100, 0, 1);
    var foggy = (W.code === 45 || W.code === 48);
    var n = foggy ? 3 : Math.round(cover * 4);
    if (W.code >= 51) n = Math.max(n, 3);
    if (n <= 0) return;
    var tint = dayT < 0.3 ? "#3a3f52" : foggy ? "#e7eaec" : mix("#ffffff", "#b9c2cb", 0.3 + cover * 0.5);
    tint = mix(tint, sky.hor, 0.15);
    var drift = (frame * (0.25 + W.windKph / 90)) % (L + 30);
    for (var i = 0; i < n; i++) {
      var cx = ((i * 17 + drift) % (L + 24)) - 12;
      var cy = 3 + (i * 5) % 12 + (foggy ? 4 : 0);
      cloudPuff(cx, cy, tint, foggy ? 0.8 : 1);
    }
    if (foggy) { b.globalAlpha = 0.35; rect(0, 0, L, HORIZON + 4, "#dfe3e6"); b.globalAlpha = 1; }
  }
  function cloudPuff(x, y, c, s) {
    b.fillStyle = c;
    rect(x + 2, y + 2, 8 * s, 2, c); rect(x, y + 3, 12 * s, 2, c);
    rect(x + 3, y, 5 * s, 2, c); rect(x + 1, y + 4, 11 * s, 1, c);
  }

  function drawOcean(frame) {
    var deep = "#12628f", shallow = "#3aa0c4";
    if (W.code >= 51 && W.code <= 82) { deep = "#2c5566"; shallow = "#4d7f92"; }
    if (W.code === 45 || W.code === 48) { deep = "#7fa3ad"; shallow = "#a9c4cb"; }
    var oceanBot = SANDTOP;
    dband(0, HORIZON, L, oceanBot, shallow, deep);
    // waves: intensity from wave height; whitecaps march shoreward
    var inten = clamp(W.waveM / 2.4, 0.15, 1);
    var rows = HORIZON + 1;
    var speed = 0.4 + inten * 1.2;
    for (var y = rows; y < oceanBot; y++) {
      var phase = frame * speed * 0.12 + y * 1.7;
      for (var x = 0; x < L; x++) {
        var w = Math.sin((x * 0.55) + phase) + Math.sin((x * 0.23) - phase * 0.6);
        if (w > 2 - inten * 1.2) px(x, y, "#dff2fb");
        else if (w > 1.5 - inten) px(x, y, mix(shallow, "#dff2fb", 0.4));
      }
    }
    return oceanBot;
  }

  function drawSand(oceanBot, dayT) {
    // Tide moves the waterline: high tide pushes the shoreline toward the road.
    var shore = Math.round(lerp(SANDTOP, ROADTOP - 1, 0.15 + W.tide * 0.6));
    var dry = dayT < 0.35 ? "#7a6b4c" : "#e0cb92";
    var wet = dayT < 0.35 ? "#5c5340" : "#b49a63";
    dband(0, oceanBot, L, ROADTOP + 2, wet, dry);   // +2 tucks under the road (no seam)
    // wet strip just above the waterline
    rect(0, oceanBot, L, 1, mix(wet, "#dff2fb", 0.4));
    return shore;
  }

  // Foreground shoulder below the road, so the scene fills to the bottom edge.
  function drawForeground(dayT) {
    var ground = dayT < 0.35 ? "#141210" : "#2e281f";
    var curb = dayT < 0.35 ? "#43403a" : "#c9bd9c";
    rect(0, ROADBOT, L, 1, curb);
    rect(0, ROADBOT + 1, L, L - ROADBOT - 1, ground);
  }

  // Falling rain streaks for wet weather codes.
  function drawRain(frame, dayT) {
    var col = dayT < 0.35 ? "#6f7f92" : "#cfe0ea";
    b.globalAlpha = 0.7;
    for (var i = 0; i < 26; i++) {
      var x = (i * 11 + (frame * 3)) % (L + 8) - 4;
      var y = ((i * 17 + frame * 5) % (ROADBOT + 6));
      px(x, y, col); px(x - 1, y + 1, col);
    }
    b.globalAlpha = 1;
  }

  // Slightly askew road with a faded centre line.
  function roadY(x) { return Math.round(Math.sin(x * 0.12) * 0.9); }
  function drawRoad(dayT) {
    var asph = dayT < 0.35 ? "#26262c" : "#3c3c44";
    var edge = dayT < 0.35 ? "#3a3a42" : "#55555f";
    for (var x = 0; x < L; x++) {
      var off = roadY(x);
      rect(x, ROADTOP + off, 1, ROADBOT - ROADTOP, asph);
      px(x, ROADTOP + off, edge);
      px(x, ROADBOT + off - 1, "#1c1c22");
      // dashed centre line
      if ((x + 1) % 6 < 3) px(x, ((ROADTOP + ROADBOT) >> 1) + off, dayT < 0.35 ? "#8a7f3a" : "#d8cf7a");
    }
  }

  // 3x5 pixel digits for the sign.
  var FONT = {
    "0": ["111", "101", "101", "101", "111"], "1": ["010", "110", "010", "010", "111"],
    "2": ["111", "001", "111", "100", "111"], "3": ["111", "001", "111", "001", "111"],
    "4": ["101", "101", "111", "001", "001"], "5": ["111", "100", "111", "001", "111"],
    "6": ["111", "100", "111", "101", "111"], "7": ["111", "001", "010", "010", "010"],
    "8": ["111", "101", "111", "101", "111"], "9": ["111", "101", "111", "001", "111"],
    "-": ["000", "000", "111", "000", "000"]
  };
  function glyph(ch, x, y, c) {
    var g = FONT[ch]; if (!g) return;
    for (var r = 0; r < 5; r++) for (var k = 0; k < 3; k++) if (g[r][k] === "1") px(x + k, y + r, c);
  }

  // Neon sign beside the road: lights up around sunset -> dusk, shows temp.
  function drawSign(now, dayT, frame) {
    var sx = 33, top = 25, w = 15, h = 11;
    var lit = now >= W.sunset - 3 && now <= W.sunset + 35;   // sunset -> dusk
    var flick = lit && ((frame >> 1) % 17 === 0) ? 0.55 : 1;
    // post
    rect(sx + 6, top + h, 2, ROADBOT - (top + h) - 1, dayT < 0.35 ? "#2a2a30" : "#4a4a52");
    // panel
    rect(sx, top, w, h, lit ? "#150f1f" : (dayT < 0.35 ? "#14141a" : "#20202a"));
    // neon tube border
    var tube = lit ? "#ff3ea5" : "#402a3a";
    b.globalAlpha = flick;
    rect(sx, top, w, 1, tube); rect(sx, top + h - 1, w, 1, tube);
    rect(sx, top, 1, h, tube); rect(sx + w - 1, top, 1, h, tube);
    if (lit) { b.globalAlpha = 0.22; rect(sx - 1, top - 1, w + 2, h + 2, "#ff3ea5"); }
    b.globalAlpha = 1;
    // temperature digits (always shown; brighter when neon is lit)
    var col = lit ? "#5ff0ff" : (dayT < 0.35 ? "#6f6a55" : "#8c86b0");
    var s = W.temp == null ? "--" : String(W.temp);
    if (s.length > 2) s = s.slice(0, 2);
    var tx = sx + Math.round((w - (s.length * 4 - 1)) / 2), ty = top + 3;
    for (var i = 0; i < s.length; i++) { glyph(s[i], tx + i * 4, ty, col); }
    // degree tick + F
    if (W.temp != null) { px(tx + s.length * 4 - 1, ty, col); }
  }

  // Wind-swept palm on the beach (behind the road).
  function drawPalm(now, dayT, frame) {
    var baseX = 9, baseY = SANDTOP + 1, topY = 10;
    var windN = clamp(W.windKph / 45, 0.08, 1.1);
    var sway = Math.sin(frame * (0.05 + windN * 0.06)) * (1 + windN * 3);
    var trunk = dayT < 0.35 ? "#4a361f" : "#7a5636";
    for (var y = baseY; y >= topY; y--) {
      var t = (baseY - y) / (baseY - topY);
      var xoff = Math.round(sway * t * t);
      rect(baseX + xoff, y, 2, 1, mix(trunk, "#3a2a18", t * 0.3));
    }
    var hx = baseX + Math.round(sway) , hy = topY;
    var frond = dayT < 0.35 ? "#1f5e3a" : "#2f8d54";
    var frond2 = dayT < 0.35 ? "#17492d" : "#256e41";
    // fronds radiating, tips bending with the wind
    var dirs = [[-4, -1], [-3, -3], [0, -4], [3, -3], [4, -1], [-2, 1], [2, 1]];
    for (var i = 0; i < dirs.length; i++) {
      var ex = hx + dirs[i][0] + Math.round(sway * 0.5), ey = hy + dirs[i][1];
      line(hx, hy, ex, ey, i % 2 ? frond2 : frond);
      px(ex, ey + 1, frond2);
    }
    disc(hx, hy, 1, frond);
    // coconuts
    px(hx - 1, hy + 1, "#3a2a18"); px(hx + 1, hy + 1, "#3a2a18");
  }
  function line(x0, y0, x1, y1, c) {
    var dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1, e = dx - dy;
    for (;;) { px(x0, y0, c); if (x0 === x1 && y0 === y1) break; var e2 = 2 * e; if (e2 > -dy) { e -= dy; x0 += sx; } if (e2 < dx) { e += dx; y0 += sy; } }
  }

  // ---- cars ---------------------------------------------------------------
  var CARS = ["pickup", "semi", "sports", "hybrid", "moto", "logging", "electric", "jalopy"];
  var cars = [], nextSpawn = 30, rnd = 1;
  function rng() { rnd = (rnd * 1103515245 + 12345) & 0x7fffffff; return rnd / 0x7fffffff; }
  function spawnCar(frame) {
    var type = CARS[(Math.floor(rng() * CARS.length)) % CARS.length];
    var dir = rng() < 0.62 ? 1 : -1;                    // mostly left->right
    var speed = (type === "moto" ? 0.9 : type === "sports" ? 0.85 : type === "semi" || type === "logging" ? 0.45 : 0.6) * (0.8 + rng() * 0.5);
    cars.push({ type: type, dir: dir, x: dir > 0 ? -16 : L + 16, speed: speed });
  }
  function carLen(t) { return t === "semi" ? 20 : t === "logging" ? 18 : t === "moto" ? 6 : t === "sports" ? 12 : 11; }

  function drawCar(car, dayT) {
    var t = car.type, x = Math.round(car.x), yb = ROADBOT - 2 + roadY(x + 4); // wheel baseline
    b.save();
    if (car.dir < 0) { b.translate(x + carLen(t), 0); b.scale(-1, 1); b.translate(-x, 0); }
    var dim = dayT < 0.35 ? 0.62 : 1;                    // headlights instead of colour at night
    function col(c) { return dayT < 0.35 ? mix(c, "#20202c", 0.55) : c; }
    var W_ = "#bfe8ff";                                  // window glass
    if (t === "pickup") {
      rect(x, yb - 4, 11, 4, col("#3f7fae")); rect(x + 1, yb - 6, 5, 2, col("#3f7fae")); rect(x + 2, yb - 6, 3, 2, W_);
      rect(x + 6, yb - 3, 5, 1, col("#2b5c80"));
    } else if (t === "semi") {
      rect(x, yb - 5, 5, 5, col("#c23b3b")); rect(x + 1, yb - 4, 3, 2, W_);
      rect(x + 5, yb - 6, 15, 6, col("#e6e6ea")); px(x + 5, yb - 6, "#888");
    } else if (t === "sports") {
      rect(x, yb - 3, 12, 3, col("#e02a2a")); rect(x + 3, yb - 4, 6, 1, col("#e02a2a")); rect(x + 4, yb - 4, 4, 1, W_);
      px(x + 11, yb - 3, "#ffd27a");
    } else if (t === "hybrid") {
      rect(x, yb - 4, 10, 4, col("#3aa06a")); rect(x + 2, yb - 5, 6, 2, W_); px(x, yb - 3, "#2b6f4a");
    } else if (t === "moto") {
      rect(x + 1, yb - 3, 4, 2, col("#2a2a2e")); px(x + 3, yb - 4, col("#c23b3b")); px(x + 3, yb - 5, "#222");
    } else if (t === "logging") {
      rect(x, yb - 5, 5, 5, col("#5a6b3a")); rect(x + 1, yb - 4, 3, 2, W_);
      rect(x + 5, yb - 3, 13, 3, col("#4a3a28"));
      for (var i = 0; i < 4; i++) { disc(x + 7 + i * 3, yb - 4, 1, col("#8a5a34")); }
    } else if (t === "electric") {
      rect(x, yb - 4, 10, 4, col("#dfe8ee")); rect(x + 2, yb - 5, 6, 2, W_); px(x + 10, yb - 4, "#34e5ff"); px(x + 10, yb - 3, "#34e5ff");
    } else { // jalopy
      rect(x, yb - 4, 11, 4, col("#8a6a3a")); rect(x + 2, yb - 5, 4, 2, W_); px(x + 1, yb - 4, "#6a4a24"); px(x + 8, yb - 4, "#6a4a24");
      if (dayT >= 0.35 && (Date.now() >> 8) % 3 === 0) px(x - 1, yb - 5, "#9a9a9a"); // exhaust puff
    }
    // wheels
    px(x + 2, yb, "#111"); px(x + carLen(t) - 3, yb, "#111");
    if (t === "semi" || t === "logging") px(x + 8, yb, "#111");
    // headlight beam at night
    if (dayT < 0.35) { var hx = car.dir > 0 ? x + carLen(t) : x; px(hx, yb - 2, "#fff2b0"); }
    b.restore();
  }

  // =========================================================================
  var frame = 0;
  function render() {
    var now = laMinutes();
    // day factor: 1 in full day, 0 deep night, smooth across twilight.
    var dayT;
    if (now >= W.sunrise && now <= W.sunset) dayT = 1;
    else {
      var d = now < W.sunrise ? W.sunrise - now : now - W.sunset;
      dayT = clamp(1 - d / 55, 0, 1);   // fade over ~55 min of twilight
    }
    b.clearRect(0, 0, L, L);
    var sky = drawSky(now, dayT, frame);
    var sunPos = drawSun(now, dayT, sky);
    drawClouds(now, dayT, frame, sky);
    var oceanBot = drawOcean(frame);
    drawSand(oceanBot, dayT);
    drawPalm(now, dayT, frame);
    drawRoad(dayT);
    drawForeground(dayT);
    drawSign(now, dayT, frame);
    if (W.code >= 51 && W.code <= 82) { drawRain(frame, dayT); }

    // cars
    if (!reduce) {
      if (frame >= nextSpawn && cars.length < 2) { spawnCar(frame); nextSpawn = frame + Math.round(28 + rng() * 70); }
      for (var i = cars.length - 1; i >= 0; i--) {
        var car = cars[i]; car.x += car.speed * car.dir;
        if (car.x < -24 || car.x > L + 24) { cars.splice(i, 1); continue; }
        drawCar(car, dayT);
      }
    }
    // subtle vignette/frame
    b.globalAlpha = 0.14; rect(0, 0, L, 1, "#000"); rect(0, L - 1, L, 1, "#000"); b.globalAlpha = 1;

    // blit 50 -> 100, crisp
    ctx.clearRect(0, 0, 100, 100);
    ctx.drawImage(buf, 0, 0, L, L, 0, 0, 100, 100);
  }

  // ---- loop ---------------------------------------------------------------
  var raf = 0, last = 0, FPS = 12;
  function loop(ts) {
    raf = requestAnimationFrame(loop);
    if (ts - last < 1000 / FPS) return;
    last = ts; frame++;
    render();
  }
  function start() { if (!raf) { last = 0; raf = requestAnimationFrame(loop); } }
  function stop() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }
  document.addEventListener("visibilitychange", function () { if (document.hidden) stop(); else if (!reduce) start(); });

  describe();
  loadData();
  setInterval(loadData, 10 * 60 * 1000);
  setInterval(describe, 60 * 1000);
  render();                     // first frame immediately (also the reduced-motion frame)
  requestAnimationFrame(function () { wrap.classList.add("is-ready"); });
  if (!reduce) start();
})();
