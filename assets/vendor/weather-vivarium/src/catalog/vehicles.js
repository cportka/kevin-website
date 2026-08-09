/* Vehicle catalog — reference vehicles plus fanned-out batches (urban, rural/work,
   watercraft + rail, world/novelty). */
import core from "./parts/vehicles-core.js";
import a from "./parts/vehicles-a.js";
import b from "./parts/vehicles-b.js";
import c from "./parts/vehicles-c.js";
import d from "./parts/vehicles-d.js";
export default [].concat(core, a, b, c, d);
