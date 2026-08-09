/* =========================================================================
   resolve.js — a place → a scene description.

   Given a geocoded place (or raw coordinates), decide which biome/landscape to
   render, which landmark (if any) to feature, and which temperature unit to
   show. Landscape selection matches the city name against the curated lists
   first, then falls back to a latitude/elevation guess. Everything here is
   overridable through options (biome, landscape, temperatureUnit) so a caller
   can force a look.
   ========================================================================= */
import { getBiome, BIOMES } from "./biomes.js";
import { LANDSCAPES, getLandscape, landscapeForBiome } from "./landscapes.js";
import { pickLandmark } from "../catalog/landmarks.js";
import { cityNames, phraseIn, cityEntry } from "./match.js";

// Countries that conventionally use Fahrenheit (rough but practical).
var FAHRENHEIT = [
  "united states", "united states of america", "usa",
  "bahamas", "belize", "cayman islands", "liberia",
  "palau", "micronesia", "marshall islands", "puerto rico", "guam"
];

function norm(s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim(); }

/** Default temperature unit for a country name. */
export function unitForCountry(country) {
  return FAHRENHEIT.indexOf(norm(country)) !== -1 ? "fahrenheit" : "celsius";
}

/** Match a place's name against the landscape city lists. Entries may be plain
    strings or admin-scoped objects — see cityEntry in match.js. */
function matchLandscape(place) {
  var name = norm(place.name), admin = norm(place.admin1), full = name + " " + admin;
  for (var i = 0; i < LANDSCAPES.length; i++) {
    var ls = LANDSCAPES[i];
    for (var c = 0; c < ls.cities.length; c++) {
      if (cityEntry(ls.cities[c], name, full, admin)) return ls;
    }
  }
  return null;
}

/** Fallback biome from geography when no city match is found.
 *  Elevation is usually absent in bulk city data, so we lean on coarse lat/lon
 *  boxes for the world's big arid / grassland / alpine belts — real geography,
 *  deliberately broad. Anything unmatched falls to the latitude default. This is
 *  what gives the uncurated long tail its variety (deserts, plains, mountains)
 *  instead of a monotone wall of "forest". */
export function guessBiome(place) {
  var lat = place.latitude || 0, alat = Math.abs(lat), lon = place.longitude || 0;
  var el = place.elevation || 0;
  var fc = String(place.featureCode || "");
  if (el > 1500 || fc.indexOf("MT") === 0) return "mountain";
  if (alat > 66) return "tundra";

  function box(la0, la1, lo0, lo1) { return lat >= la0 && lat <= la1 && lon >= lo0 && lon <= lo1; }
  // North America
  if (box(31, 37, -118, -103)) return "desert";     // US Southwest
  if (box(36, 42, -120, -114)) return "desert";     // Great Basin high desert (Reno, Carson City)
  if (box(37, 49, -114, -105)) return "mountain";   // Rockies / Mountain West
  if (box(31, 49, -104, -96)) return "plains";      // Great Plains
  if (box(37, 49, -96, -82)) return "farmland";     // Corn Belt / Midwest
  // Mexico + Central America: the volcanic highlands are green and mountainous,
  // not dry savanna — Mexico City, Puebla, Toluca, Guadalajara, Morelia sit at
  // 1,500–2,600 m ringed by volcanoes.
  if (box(14, 22, -106, -95)) return "mountain";    // Mexican volcanic belt / central highlands
  if (box(13, 17, -92, -83)) return "mountain";     // Guatemalan / Honduran highlands
  // South America
  if (box(-32, -14, -73, -66)) return "mountain";   // Andes
  if (box(-40, -22, -66, -56)) return "plains";     // Pampas
  // Africa / Middle East
  if (box(15, 33, -12, 50)) return "desert";        // Sahara + Arabian peninsula
  if (box(-32, -20, 15, 32)) return "desert";       // Kalahari / Karoo
  // Asia
  if (box(35, 48, 55, 95)) return "desert";         // Central Asian steppe / desert
  if (box(27, 40, 70, 88)) return "mountain";       // Himalaya / Tibetan fringe
  if (box(20, 32, 68, 76)) return "desert";         // Thar / Rajasthan
  // Monsoon Asia is wet and green, not dry savanna — India's south + the Deccan,
  // Indochina, the Malay archipelago, south China and Taiwan.
  if (box(5, 28, 72, 90)) return "jungle";          // peninsular India / Bengal
  if (box(-11, 28, 92, 128)) return "jungle";       // Indochina, Malaysia, Indonesia, Philippines
  if (box(20, 31, 100, 123)) return "jungle";       // south China / Taiwan
  // Australia
  if (box(-30, -20, 118, 145)) return "desert";     // Outback

  if (alat < 12) return "jungle";
  if (alat < 24) return "savanna";
  return "forest";                 // temperate / boreal default
}

/**
 * A coarse cultural region from coordinates. Used to keep vernacular architecture
 * where it belongs: pagoda roofs in East Asia, not Denver; a nodding pumpjack in
 * West Texas, not Tromsø. Deliberately broad — it only ever narrows a candidate
 * list, and anything unmatched simply gets the universal styles.
 */
export function regionFor(place) {
  var lat = place.latitude || 0, lon = place.longitude || 0;
  function box(la0, la1, lo0, lo1) { return lat >= la0 && lat <= la1 && lon >= lo0 && lon <= lo1; }
  if (box(14, 33, -118, -86)) return "latin-america";   // Mexico + Central America
  if (box(8, 27, -90, -58)) return "latin-america";      // Caribbean
  if (box(15, 75, -170, -52)) return "north-america";
  if (box(-60, 15, -95, -30)) return "latin-america";
  if (box(35, 72, -25, 40)) return "europe";
  if (box(-36, 35, -20, 52)) return "africa";
  if (box(12, 42, 34, 63)) return "middle-east";
  if (box(4, 38, 60, 92)) return "south-asia";
  if (box(-11, 25, 92, 130)) return "southeast-asia";
  if (box(20, 46, 100, 146)) return "east-asia";
  if (box(-50, -10, 110, 180)) return "oceania";
  if (box(42, 78, 40, 180)) return "north-asia";
  return null;
}

/* A place's CALLING CARD — the one character it sends out first, before the cast
   turns over to the usual random draw. Los Angeles opens with the beachgoer on her
   towel; Nairobi with a giraffe; Cusco with a llama. It's the establishing shot: the
   thing you'd put in the first frame if you had only one. Any id here must exist in
   the catalog and be valid for the resolved biome, or it's simply skipped.

   `nightPerson` is the after-dark counterpart: LA's beachgoer keeps to daylight, so
   once the sun is down the beach belongs to the cat instead.

   Keys are matched as whole words against the place name (see match.js). */
var CALLING_CARDS = [
  { cities: ["los angeles", "malibu"],
    person: "beachgoer", nightPerson: "beach-cat", tree: "palm", sign: "neon" },
  // Santa Monica is its own postcard, not a copy of LA's: the Pacific Wheel over
  // the pier (via the ferris-wheel landmark) and the jacaranda bloom of Ocean
  // Avenue — the beach cast stays, the neon billboard and the palm go to LA.
  { cities: ["santa monica", "venice beach"],
    person: "beachgoer", nightPerson: "beach-cat", tree: "jacaranda" },
  { cities: ["honolulu", "waikiki"], person: "surfer", tree: "palm" },
  { cities: ["lomita", "torrance"], tree: "pine" },   // the pines by the library and the high school
  // Amazon river ports: a thatched riverfront board, and the capybara ambles out first
  { cities: ["iquitos", "manaus"], sign: "tiki-board", ground: "capybara" },
  { cities: ["new orleans"], person: "street-musician" },
  { cities: ["nashville", "austin"], person: "street-musician" },
  { cities: ["amsterdam", "copenhagen", "utrecht"], person: "cyclist" },
  { cities: ["kyoto", "nara"], person: "monk", tree: "cherry-blossom" },
  { cities: ["kathmandu", "lhasa", "thimphu"], person: "monk" },
  { cities: ["aspen", "zermatt", "chamonix", "queenstown", "whistler"], person: "skier" },
  { cities: ["boulder", "portland", "eugene"], person: "jogger" },
  { cities: ["paris", "florence", "firenze"], person: "painter" },
  // Each gets its region's signature conifer: the wind-sculpted Monterey cypress
  // of the California headlands, and the Douglas fir of Puget Sound.
  { cities: ["san francisco"], person: "photographer", tree: "monterey-cypress" },
  { cities: ["seattle"], person: "photographer", tree: "fir" },
  { cities: ["dallas", "fort worth", "calgary", "cheyenne"], person: "cowboy" },
  { cities: ["nairobi", "arusha", "serengeti"], ground: "giraffe" },
  { cities: ["cusco", "la paz", "arequipa"], ground: "llama" },
  { cities: ["sydney", "bondi", "gold coast"], person: "surfer" },
  { cities: ["melbourne", "brisbane", "perth", "alice springs", "canberra"], ground: "kangaroo" },
  { cities: ["churchill", "anchorage", "tromso", "tromsø"], ground: "moose" },
  { cities: ["marrakesh", "timbuktu", "cairo", "dubai"], ground: "camel" },
  { cities: ["jaipur", "chiang mai"], ground: "elephant" },
  { cities: ["reykjavik", "reykjavík"], bird: "gull" },
  { cities: ["miami", "everglades"], bird: "flamingo" },
  { cities: ["monterey", "cape town", "san diego"], water: "seal" },
  { cities: ["maui", "lahaina", "reykjahlid"], water: "whale" }
];

/** The calling card for a place: {person, nightPerson, ground, bird, water, tree, sign} — or null. */
export function callingCardFor(place) {
  var name = norm(place && place.name), full = name + " " + norm(place && place.admin1);
  if (!name) return null;
  for (var i = 0; i < CALLING_CARDS.length; i++) {
    var cc = CALLING_CARDS[i];
    for (var c = 0; c < cc.cities.length; c++) {
      if (cityNames(cc.cities[c], name, full)) {
        return { person: cc.person || null, nightPerson: cc.nightPerson || null,
          ground: cc.ground || null, bird: cc.bird || null,
          water: cc.water || null, tree: cc.tree || null, sign: cc.sign || null };
      }
    }
  }
  return null;
}

// Cities with a famously relaxed cannabis culture — the odd weed-smoking stroller
// shows up in these (gated so they don't appear everywhere).
var CANNABIS = [
  "amsterdam", "denver", "boulder", "portland", "seattle", "oakland", "san francisco",
  "los angeles", "santa cruz", "eugene", "arcata", "eureka", "humboldt", "vancouver",
  "kingston", "barcelona", "montevideo", "christiania"
];
export function isCannabisCity(place) {
  var name = norm(place && place.name), full = name + " " + norm(place && place.admin1);
  for (var i = 0; i < CANNABIS.length; i++) if (cityNames(CANNABIS[i], name, full)) return true;
  return false;
}

/**
 * Resolve `place` (needs at least latitude/longitude; name enables city matches)
 * into { place, biome, landscape, landmark, latitude, coastal, unit, cannabis }.
 * opts: { biome, landscape, temperatureUnit }.
 */
/* A stable identity for a place, used to seed everything fixed about its scene —
   which tree grows there, which sign stands by the road, how the buildings pack.

   It has to key on WHO the place is, not on the exact numbers that happened to
   describe it: the same city arrives with slightly different coordinates from the
   packed dataset (34.052), a hand-written reference entry (34.05) and the browser's
   geolocation (34.0522…), and seeding on the raw float gave each of those a
   different tree. Names are the identity; coordinates are only the fallback for an
   unnamed fix, rounded to a ~1° cell so two readings of the same spot agree. */
export function placeKey(place) {
  if (!place) return "";
  var name = String(place.name || "").trim().toLowerCase();
  if (name) {
    return name + "|" + String(place.admin1 || "").trim().toLowerCase() +
      "|" + String(place.country || "").trim().toLowerCase();
  }
  return "@" + Math.round(place.latitude || 0) + "," + Math.round(place.longitude || 0);
}

/* Urbanisation for a resolved scene, 0..1, from its population — THE density
   formula. Population maps log-linearly onto the 0..1 band (a hamlet of ~4,000
   is 0, ~63M saturates it); a place with no population gets a modest default;
   city biomes floor well above pastoral; and a curated landscape can assert its
   own floor (the South Bay is suburb wall to wall, whatever a member city's
   municipal population says). This used to be hand-copied by every caller —
   widget, verify harness, dataset replay, snapshot resolver, tests — and this
   very file's densityFloor was missed by one of them the week it was added. */
export function sceneDensity(res, population) {
  var pd = 0.22;
  if (population > 0) {
    pd = (Math.log(population) / Math.LN10 - 3.6) / 4.2;
    pd = pd < 0 ? 0 : pd > 1 ? 1 : pd;
  }
  return Math.max(pd,
    res && res.biome && res.biome.id === "city" ? 0.5 : 0,
    (res && res.densityFloor) || 0);
}

export function resolveScene(place, opts) {
  opts = opts || {};
  place = place || {};

  var landscape = null;
  if (opts.landscape) landscape = getLandscape(opts.landscape);
  if (!landscape && !opts.biome) landscape = matchLandscape(place);

  var biomeId = opts.biome || (landscape && landscape.biome) || guessBiome(place);
  if (!BIOMES[biomeId]) biomeId = "coast";
  var biome = getBiome(biomeId);
  // Uncurated places (fell through to the biome guess) get an honest, biome-named
  // landscape — so a big city that guessed "forest" reads as "Forest", not as some
  // unrelated named preset like "Pacific Northwest". (Density still makes it urban.)
  if (!landscape) landscape = { id: biomeId, name: biome.name, biome: biomeId };

  var coastal = biomeId === "coast" || biomeId === "ocean" || !!landscape.coastal;

  var unit = opts.temperatureUnit;
  if (!unit || unit === "auto") unit = unitForCountry(place.country);

  return {
    place: place,
    biome: biome,
    landscape: landscape,
    landmark: pickLandmark(place, landscape, biomeId),
    latitude: place.latitude || 0,
    coastal: coastal,
    unit: unit,
    region: regionFor(place),
    callingCard: callingCardFor(place),
    cannabis: isCannabisCity(place),
    // A curated landscape can declare a floor for urbanisation (its `density`).
    // City-limits population badly understates a suburb embedded in a metro —
    // Lomita's 20k reads as deer-in-the-woods rural, when the South Bay is
    // wall-to-wall tract houses — so the preset asserts what the place IS.
    densityFloor: (landscape && landscape.density) || 0
  };
}
