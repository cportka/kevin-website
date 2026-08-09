/* =========================================================================
   landscapes.js — named presets that localise a biome.

   A biome is the raw environment (coast, mountain, desert…); a landscape is a
   recognisable *place-type* built on one, with a curated list of cities that map
   to it and optional palette/feature tweaks. The resolver matches a geocoded
   city against these lists first, then falls back to a latitude/elevation guess.
   City names are matched loosely (lower-cased, accent-stripped, substring).
   ========================================================================= */

export var LANDSCAPES = [
  { id: "malibu", name: "Malibu Coast", biome: "coast", coastal: true,
    cities: ["los angeles", "malibu", "santa monica", "san diego", "san sebastian", "nice", "lisbon", "barcelona", "tel aviv", "sydney", "rio de janeiro", "honolulu", "waikiki"] },
  { id: "pacific-cliffs", name: "Pacific Cliffs", biome: "coast", coastal: true,
    cities: ["san francisco", "monterey", "big sur", "cape town", "wellington", "berkeley", "oakland"] },
  // The inland South Bay of LA county: leafy, low, and wall-to-wall suburb. The
  // `density` floor is what makes it read that way — these cities' own municipal
  // populations (Lomita: 20k) would otherwise render them as woodland hamlets.
  // (The beach cities — Redondo, Hermosa, Manhattan Beach — stay coast.)
  { id: "south-bay", name: "South Bay", biome: "forest", density: 0.42,
    cities: [
      { name: "lomita", admin: ["ca", "california"] },
      { name: "torrance", admin: ["ca", "california"] },
      { name: "gardena", admin: ["ca", "california"] },
      { name: "carson", admin: ["ca", "california"] },
      { name: "lawndale", admin: ["ca", "california"] },
      { name: "hawthorne", admin: ["ca", "california"] }
    ] },
  { id: "north-sea", name: "North Sea Harbour", biome: "coast", coastal: true,
    cities: ["copenhagen", "bergen", "aberdeen", "gothenburg", "stavanger"] },
  // Cities defined by the water they sit in/on, rather than by their latitude.
  // Puget Sound: a green city ON water, but sound and inlet rather than surf beach —
  // evergreen banks, a far shore across the water, mountains beyond.
  { id: "puget-sound", name: "Puget Sound", biome: "lake", coastal: true,
    cities: ["seattle", "tacoma", "olympia", "bellingham", "everett", "bremerton", "victoria"] },
  { id: "lagoon", name: "Lagoon City", biome: "coast", coastal: true,
    cities: ["venice", "venezia", "havana", "la habana", "cartagena", "valletta", "zanzibar"] },
  { id: "manhattan", name: "Manhattan", biome: "city",
    cities: ["new york", "chicago", "toronto", "hong kong", "shanghai", "singapore", "sao paulo", "mexico city",
      "washington", "boston", "philadelphia", "atlanta", "dallas", "minneapolis"] },
  { id: "old-town", name: "Old Town", biome: "city",
    cities: ["london", "paris", "berlin", "amsterdam", "vienna", "prague", "rome", "madrid", "brussels", "dublin"] },
  { id: "neon-district", name: "Neon District", biome: "city",
    cities: ["tokyo", "osaka", "seoul", "taipei", "bangkok city", "shenzhen"] },
  { id: "alpine", name: "Alpine", biome: "mountain",
    cities: ["zurich", "innsbruck", "chamonix", "aspen", "denver", "salzburg", "bolzano", "grenoble"] },
  { id: "andes", name: "Andes", biome: "mountain",
    cities: ["la paz", "cusco", "quito", "bogota", "arequipa", "huaraz"] },
  { id: "himalaya", name: "Himalaya", biome: "mountain",
    cities: ["kathmandu", "lhasa", "thimphu", "leh", "shimla"] },
  { id: "rockies", name: "Rockies", biome: "mountain",
    cities: ["banff", "boulder", "jackson", "calgary", "bozeman"] },
  { id: "sonoran", name: "Sonoran Desert", biome: "desert",
    cities: ["phoenix", "tucson", "las vegas", "palm springs", "mesa"] },
  { id: "sahara", name: "Sahara", biome: "desert",
    cities: ["cairo", "marrakesh", "riyadh", "dubai", "abu dhabi", "doha", "timbuktu", "luxor"] },
  { id: "outback", name: "Outback", biome: "desert",
    cities: ["alice springs", "perth", "kalgoorlie", "broken hill"] },
  { id: "pnw", name: "Pacific Northwest", biome: "forest",
    cities: ["seattle", "portland", "vancouver", "eugene", "olympia"] },
  { id: "black-forest", name: "Black Forest", biome: "forest",
    cities: ["freiburg", "stuttgart", "munich", "salzburg forest", "ljubljana"] },
  { id: "taiga", name: "Taiga", biome: "forest",
    cities: ["helsinki", "oslo", "tallinn", "novosibirsk", "anchorage"] },
  { id: "amazon", name: "Amazon", biome: "jungle",
    cities: ["manaus", "iquitos", "belem", "leticia"] },
  { id: "mekong", name: "Mekong", biome: "jungle",
    cities: ["bangkok", "ho chi minh", "phnom penh", "vientiane", "kuala lumpur", "jakarta"] },
  { id: "congo", name: "Congo Basin", biome: "jungle",
    cities: ["kinshasa", "libreville", "yaounde"] },
  { id: "serengeti", name: "Serengeti", biome: "savanna",
    cities: ["nairobi", "arusha", "dar es salaam", "kampala", "lusaka"] },
  { id: "great-plains", name: "Great Plains", biome: "plains",
    cities: ["kansas city", "omaha", "winnipeg", "oklahoma city", "regina"] },
  { id: "pampas", name: "Pampas", biome: "plains",
    cities: ["buenos aires", "montevideo", "rosario", "cordoba"] },
  { id: "arctic", name: "Arctic", biome: "tundra",
    cities: ["reykjavik", "tromso", "nuuk", "murmansk", "fairbanks", "utqiagvik", "longyearbyen"] },
  { id: "everglades", name: "Everglades", biome: "wetland",
    cities: ["miami", "new orleans", "houston", "tampa"] },
  { id: "great-lakes", name: "Great Lakes", biome: "lake",
    cities: ["detroit", "cleveland", "buffalo", "milwaukee", "duluth"] },
  { id: "alpine-lake", name: "Alpine Lake", biome: "lake",
    cities: ["geneva", "lucerne", "queenstown", "interlaken", "annecy"] },
  { id: "canyonlands", name: "Canyonlands", biome: "canyon",
    cities: ["flagstaff", "moab", "st george", "page"] },
  { id: "tuscany", name: "Tuscany", biome: "farmland",
    cities: ["florence", "bologna", "siena", "perugia"] },
  { id: "heartland", name: "Heartland", biome: "farmland",
    cities: ["des moines", "lincoln", "springfield", "topeka"] }
];

export function getLandscape(id) {
  for (var i = 0; i < LANDSCAPES.length; i++) if (LANDSCAPES[i].id === id) return LANDSCAPES[i];
  return null;
}

/** First landscape defined on a given biome (used as a biome's default look). */
export function landscapeForBiome(biomeId) {
  for (var i = 0; i < LANDSCAPES.length; i++) if (LANDSCAPES[i].biome === biomeId) return LANDSCAPES[i];
  return LANDSCAPES[0];
}

export var LANDSCAPE_IDS = LANDSCAPES.map(function (l) { return l.id; });
