/* =========================================================================
   catalog/index.js — the assembled sprite catalog + selection helpers.

   Everything drawable is grouped by category. `pools(biomeId)` returns the
   subset of each category valid for a biome (an entry with no `biomes` list is
   universal). The compositor draws from these pools, weighted by `rarity`.
   ========================================================================= */
import trees from "./trees.js";
import vehicles from "./vehicles.js";
import birds from "./birds.js";
import animals from "./animals.js";
import people from "./people.js";
import signs from "./signs.js";

export var CATALOG = {
  trees: trees, vehicles: vehicles, birds: birds,
  animals: animals, people: people, signs: signs
};

/** Entries in `list` valid for `biomeId` (universal if no biomes list). */
export function forBiome(list, biomeId) {
  return list.filter(function (e) { return !e.biomes || e.biomes.indexOf(biomeId) !== -1; });
}

/** Split animals by placement layer. */
export function byLayer(list, layer) {
  return list.filter(function (e) { return (e.layer || "ground") === layer; });
}

/** All content pools for a biome, pre-split by how the compositor places them. */
export function pools(biomeId) {
  var veh = forBiome(vehicles, biomeId);
  var ani = forBiome(animals, biomeId);
  return {
    trees: forBiome(trees, biomeId),
    signs: forBiome(signs, biomeId),
    birds: forBiome(birds, biomeId),
    people: forBiome(people, biomeId),
    roadVehicles: veh.filter(function (e) { return (e.layer || "road") === "road"; }),
    waterVehicles: veh.filter(function (e) { return e.layer === "water"; }),
    groundAnimals: byLayer(ani, "ground"),
    waterAnimals: byLayer(ani, "water"),
    airAnimals: byLayer(ani, "air")
  };
}

/** Total counts per category — used by tests to enforce the breadth targets. */
export function counts() {
  return {
    trees: trees.length, vehicles: vehicles.length, birds: birds.length,
    animals: animals.length, people: people.length, signs: signs.length
  };
}
