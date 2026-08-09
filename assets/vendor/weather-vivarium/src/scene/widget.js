/* =========================================================================
   widget.js — mount a living diorama into the page.

   Builds the canvas, resolves the place (geocode a city name, or take explicit
   coordinates), fetches live weather, and runs the render loop. Progressive
   enhancement throughout: no data → sensible defaults; reduced motion → a single
   still frame; no canvas → nothing. Optional click-to-zoom expands the widget to
   a centred overlay and docks back.
   ========================================================================= */
import { createPainter } from "../engine/painter.js";
import { localTime, dayFactor, moonIllumination } from "../engine/astronomy.js";
import { defaultState, fetchWeather } from "../data/weather.js";
import { geocode } from "../data/geocode.js";
import { resolveScene, placeKey, sceneDensity } from "../world/resolve.js";
import { pools } from "../catalog/index.js";
import { createScene } from "./compositor.js";
import { seedFrom } from "../engine/random.js";
import { injectStyles } from "./styles.js";
import { describe as wmoWord } from "../data/wmo.js";

var L = 50, DISPLAY = 100;
var GEOMETRY = { L: L, horizon: 24, groundTop: 37, roadBot: 46 };

// The default place, used until a real one resolves: Los Angeles, with its actual
// coordinates and population so it renders as the metropolis it is rather than
// defaulting to a nondescript town.
var DEFAULT_PLACE = {
  name: "Los Angeles", country: "United States", admin1: "California",
  latitude: 34.05, longitude: -118.24, timezone: "America/Los_Angeles",
  elevation: 87, population: 3971883
};

function el(target, doc) {
  if (!target) return null;
  if (typeof target === "string") return doc.querySelector(target);
  return target;
}

function tempText(state, unit) {
  if (state.temp == null) return "--";
  return String(state.temp) + "°";
}

export function createVivarium(target, options) {
  options = options || {};
  var doc = options.document || (typeof document !== "undefined" ? document : null);
  if (!doc) return null;
  var host = el(target, doc);
  if (!host) return null;
  injectStyles(doc);

  var reduce = options.reduceMotion != null ? options.reduceMotion :
    (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var nowOverride = options.now;   // minutes-since-midnight override (demo time scrubber / tests)

  // --- DOM --------------------------------------------------------------
  var wrap = doc.createElement("div");
  wrap.className = "wv";
  wrap.setAttribute("role", "img");
  var size = options.size || 100;
  if (typeof size === "number") wrap.style.setProperty("--wv-size", size + "px");
  var cv = doc.createElement("canvas");
  cv.className = "wv__cv"; cv.width = DISPLAY; cv.height = DISPLAY;
  wrap.appendChild(cv);
  var ctx = cv.getContext && cv.getContext("2d");
  if (!ctx) return null;
  ctx.imageSmoothingEnabled = false;

  var buf = doc.createElement("canvas"); buf.width = L; buf.height = L;
  var b = buf.getContext("2d"); b.imageSmoothingEnabled = false;
  var P = createPainter(b, L);

  host.appendChild(wrap);

  // --- world ------------------------------------------------------------
  var W = defaultState();
  var world = null, scene = null, resolution = null;

  function buildWorld(place, res) {
    var lt = localTime(place.timezone, nowOverride);
    var moon = moonIllumination(lt.year, lt.month, lt.day);
    // urbanisation: sceneDensity is THE formula (population + city floor +
    // landscape floor); an explicit option still overrides it.
    var density = options.density != null ? options.density : sceneDensity(res, place.population);
    var w = {
      geometry: GEOMETRY, biome: res.biome, landscape: res.landscape, landmark: res.landmark,
      latitude: res.latitude, coastal: res.coastal, unit: res.unit, density: density, cannabis: res.cannabis, region: res.region, callingCard: res.callingCard,
      pools: pools(res.biome.id), W: W, sunrise: W.sunrise, sunset: W.sunset, moon: moon,
      seed: seedFrom(options.seed || placeKey(place)),
      place: place,
      tempText: function () { return tempText(W, res.unit); }
    };
    return w;
  }

  function setPlace(place) {
    resolution = resolveScene(place, options);
    world = buildWorld(place, resolution);
    scene = createScene(P, world, { reduce: reduce });
    describe();
  }

  function describe() {
    if (!world) return;
    var lt = localTime(world.place.timezone, nowOverride);
    var dT = dayFactor(lt.minutes, W.sunrise, W.sunset);
    var tod = dT >= 1 ? "day" : dT <= 0 ? "night" : "twilight";
    var u = resolution.unit === "celsius" ? "C" : "F";
    var label = (world.place.name || "This place") + ": " +
      (W.temp == null ? "—" : W.temp + "°" + u) + ", " + wmoWord(W.code) + ", " + tod +
      " — a pixel-art " + world.landscape.name + " weather diorama.";
    wrap.setAttribute("aria-label", label);
  }

  // Everything the diorama knows about this place, as labelled rows — what the
  // info card shows when a scene is expanded (and what the demo shows for the
  // current city). Values are already formatted for display; anything unknown is
  // simply left out rather than shown as a blank.
  function attributes() {
    if (!world || !resolution) return [];
    var lt = localTime(world.place.timezone, nowOverride);
    var dT = dayFactor(lt.minutes, W.sunrise, W.sunset);
    var u = resolution.unit === "celsius" ? "C" : "F";
    var p = world.place, rows = [];
    function add(label, value) { if (value != null && value !== "") rows.push({ label: label, value: String(value) }); }
    function hhmm(mins) {
      if (mins == null) return null;
      var h = Math.floor(mins / 60) % 24, m = Math.round(mins % 60);
      return (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m;
    }
    var where = [p.admin1, p.country].filter(Boolean).join(", ");
    add("Place", p.name || "Unknown");
    add("Region", where);
    add("Coordinates", p.latitude.toFixed(2) + "°, " + p.longitude.toFixed(2) + "°");
    add("Local time", hhmm(lt.minutes) + " (" + (world.place.timezone || "UTC") + ")");
    add("Light", dT >= 1 ? "daylight" : dT <= 0 ? "night" : "twilight");
    add("Temperature", W.temp == null ? null : W.temp + "°" + u);
    add("Conditions", wmoWord(W.code));
    add("Cloud cover", W.cloud == null ? null : Math.round(W.cloud) + "%");
    add("Wind", W.windKph == null ? null : Math.round(W.windKph) + " km/h");
    add("Air quality", W.aqi == null ? null : "AQI " + Math.round(W.aqi));
    if (resolution.coastal) {
      add("Swell", W.waveM == null ? null : W.waveM.toFixed(1) + " m");
      add("Tide", W.tide == null ? null : (W.tide > 0.66 ? "high" : W.tide < 0.33 ? "low" : "mid"));
    }
    add("Sunrise", hhmm(W.sunrise));
    add("Sunset", hhmm(W.sunset));
    add("Moon", world.moon && world.moon.name ? world.moon.name : null);
    add("Biome", world.biome.name);
    add("Landscape", world.landscape.name);
    add("Landmark", world.landmark ? world.landmark.name : "none");
    var planted = scene && scene.trees ? scene.trees() : [];
    var treeNames = [];
    for (var ti = 0; ti < planted.length; ti++) {
      if (treeNames.indexOf(planted[ti].name) === -1) treeNames.push(planted[ti].name);
    }
    add(treeNames.length > 1 ? "Trees" : "Tree", treeNames.length ? treeNames.join(", ") : "none");
    var d = world.density || 0;
    add("Settlement", d >= 0.78 ? "metropolis" : d >= 0.62 ? "big city" : d >= 0.36 ? "city"
      : d >= 0.2 ? "town" : d >= 0.08 ? "village" : "rural");
    add("Population", p.population ? Number(p.population).toLocaleString("en-US") : null);
    return rows;
  }

  // --- render loop ------------------------------------------------------
  var frame = 0, raf = 0, last = 0, FPS = 12;
  function renderOnce() {
    if (!scene) return;
    var lt = localTime(world.place.timezone, nowOverride);
    world.sunrise = W.sunrise; world.sunset = W.sunset;
    var dT = dayFactor(lt.minutes, W.sunrise, W.sunset);
    scene.render(frame, lt.minutes, dT);
    ctx.clearRect(0, 0, DISPLAY, DISPLAY);
    ctx.drawImage(buf, 0, 0, L, L, 0, 0, DISPLAY, DISPLAY);
  }
  function loop(ts) {
    raf = requestAnimationFrame(loop);
    if (ts - last < 1000 / FPS) return;
    last = ts; frame++; renderOnce();
  }
  function start() { if (!raf && typeof requestAnimationFrame !== "undefined") { last = 0; raf = requestAnimationFrame(loop); } }
  function stop() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }

  if (typeof document !== "undefined") {
    doc.addEventListener("visibilitychange", function () { if (doc.hidden) stop(); else if (!reduce) start(); });
  }

  // --- data -------------------------------------------------------------
  var refreshTimer = null;
  function loadWeather() {
    if (!resolution) return;
    fetchWeather(world.place, W, {
      coastal: resolution.coastal && !options.minimalData,
      airQuality: !options.minimalData,        // gallery tiles skip AQI to spare requests
      temperatureUnit: resolution.unit,
      onUpdate: function () {
        // Adopt the zone the API resolved, so the clock we read the scene's time
        // from is the same one its sunrise and sunset are quoted in.
        if (W.timezone && !world.place.timezone) world.place.timezone = W.timezone;
        describe(); if (reduce) renderOnce();
      }
    });
  }
  function startData() {
    loadWeather();
    if (refreshTimer) clearInterval(refreshTimer);
    var ms = options.refreshMs != null ? options.refreshMs : 10 * 60 * 1000;
    if (ms > 0 && typeof setInterval !== "undefined") refreshTimer = setInterval(loadWeather, ms);
  }

  // --- boot -------------------------------------------------------------
  var explicitCoords = options.lat != null && options.lon != null;
  var initialPlace = explicitCoords ? {
    name: options.city || options.name || "", country: options.country || "", admin1: options.admin1 || "",
    // No timezone → leave it unset rather than claiming UTC. The weather fetch asks
    // Open-Meteo to resolve the zone from the coordinates and we adopt what comes
    // back; claiming UTC made it report a Los Angeles sunset before its sunrise.
    latitude: options.lat, longitude: options.lon, timezone: options.timezone || null,
    elevation: options.elevation != null ? options.elevation : null,
    population: options.population != null ? options.population : null
  } : DEFAULT_PLACE;

  // Bring the widget to life for a resolved place: set the scene, paint the
  // first frame, fade in, and start the loop + data.
  function boot(place) {
    setPlace(place);
    renderOnce();
    if (typeof requestAnimationFrame !== "undefined") requestAnimationFrame(function () { wrap.classList.add("is-ready"); });
    else wrap.classList.add("is-ready");
    startData();
    if (!reduce) start();
  }

  var ready;
  if (explicitCoords) {
    boot(initialPlace);
    ready = Promise.resolve(initialPlace);
  } else if (options.city) {
    // City given without coordinates: hold the (still-invisible, opacity:0)
    // widget until geocoding resolves, so it fades straight in on the RIGHT city
    // instead of flashing the Los Angeles default first. Fall back to the default
    // only if geocoding fails.
    ready = geocode(options.city, { language: options.language }).then(function (place) {
      boot(place || DEFAULT_PLACE);
      return place || DEFAULT_PLACE;
    }, function () { boot(DEFAULT_PLACE); return DEFAULT_PLACE; });
  } else {
    boot(DEFAULT_PLACE);
    ready = Promise.resolve(DEFAULT_PLACE);
  }

  if (options.interactive) wireZoom(wrap, doc, reduce, attributes);

  return {
    el: wrap, canvas: cv, ready: ready,
    get resolution() { return resolution; },
    get weather() { return W; },
    /** Everything this diorama knows about the place, as [{label, value}] rows. */
    attributes: attributes,
    setWeather: function (patch) { Object.assign(W, patch); describe(); if (reduce) renderOnce(); },
    setPlace: function (place) { setPlace(place); startData(); },
    refresh: loadWeather,
    renderFrame: function (n) { if (n != null) frame = n; renderOnce(); },
    setTimeOverride: function (minutes) { nowOverride = minutes; renderOnce(); describe(); },
    start: start, stop: stop,
    destroy: function () { stop(); if (refreshTimer) clearInterval(refreshTimer); if (wrap.parentNode) wrap.parentNode.removeChild(wrap); }
  };
}

// Click-to-zoom: expand to a centred, integer-scaled overlay; dock on re-click.
function wireZoom(wrap, doc, reduce, attributes) {
  wrap.classList.add("is-interactive");
  wrap.setAttribute("role", "button");
  wrap.setAttribute("tabindex", "0");
  var backdrop = doc.createElement("div");
  backdrop.className = "wv-backdrop"; backdrop.hidden = true;
  (doc.body || doc.documentElement).appendChild(backdrop);
  // The info card that rides along with the expanded scene, listing everything
  // the diorama knows about the place. Built once, refilled on each expand.
  var card = doc.createElement("div");
  card.className = "wv-card"; card.hidden = true;
  backdrop.appendChild(card);
  card.addEventListener("click", function (e) { e.stopPropagation(); });
  var expanded = false;
  function intSize() {
    var w = (typeof window !== "undefined") ? window.innerWidth : 800;
    var h = (typeof window !== "undefined") ? window.innerHeight : 600;
    // On a wide screen the info card sits beside the scene, so leave it room
    // (matches the 900px breakpoint in styles.js); below that it's a bottom sheet.
    var avail = w >= 900 ? w - 350 : w;
    var n = Math.floor((Math.min(avail, h) - 32) / 100);
    return (n < 1 ? 1 : n) * 100;
  }
  function fillCard() {
    if (!attributes) return;
    var rows = attributes();
    if (!rows.length) { card.hidden = true; return; }
    card.textContent = "";
    for (var i = 0; i < rows.length; i++) {
      var r = doc.createElement("div"); r.className = "wv-card__row";
      var k = doc.createElement("span"); k.className = "wv-card__k"; k.textContent = rows[i].label;
      var v = doc.createElement("span"); v.className = "wv-card__v"; v.textContent = rows[i].value;
      r.appendChild(k); r.appendChild(v); card.appendChild(r);
    }
    card.hidden = false;
  }
  var cardTimer = null;
  function expand() {
    if (expanded) return; expanded = true;
    wrap.style.setProperty("--wv-exp", intSize() + "px");
    wrap.classList.add("is-expanded");
    doc.documentElement.classList.add("wv-lock");
    backdrop.hidden = false; backdrop.offsetWidth; backdrop.classList.add("is-on");
    fillCard();
    // keep it live while open — the weather may land after the click
    if (cardTimer) clearInterval(cardTimer);
    cardTimer = setInterval(fillCard, 2000);
    wrap.setAttribute("aria-pressed", "true");
  }
  function collapse() {
    if (!expanded) return; expanded = false;
    wrap.classList.remove("is-expanded");
    backdrop.classList.remove("is-on");
    doc.documentElement.classList.remove("wv-lock");
    if (cardTimer) { clearInterval(cardTimer); cardTimer = null; }
    setTimeout(function () { if (!expanded) { backdrop.hidden = true; card.hidden = true; } }, 360);
    wrap.setAttribute("aria-pressed", "false");
  }
  function toggle() { expanded ? collapse() : expand(); }
  wrap.addEventListener("click", toggle);
  wrap.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
    else if (e.key === "Escape") collapse();
  });
  backdrop.addEventListener("click", collapse);
  if (typeof window !== "undefined") window.addEventListener("resize", function () { if (expanded) wrap.style.setProperty("--wv-exp", intSize() + "px"); });
}
