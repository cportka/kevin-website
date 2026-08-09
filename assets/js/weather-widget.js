/* =========================================================================
   weather-widget.js — mount the corner weather diorama.

   The diorama itself is weather-vivarium (npm, pinned in package.json and
   vendored under assets/vendor/weather-vivarium/ — this static site has no
   build step, so the package ships with the site). It grew out of this site's
   original hand-built LA widget, now archived in archive/la-beach-diorama/.

   We load the package's single-file `dist/` bundle (one request instead of a
   56-module import waterfall) and its stylesheet is <link>ed by each page with
   id="wv-styles", which is the package's signal to skip runtime <style>
   injection — so the pages keep a strict `style-src 'self'`.

   We pin the place explicitly to Los Angeles — name AND coordinates — so it
   boots instantly (no geocoding request) and keeps rendering LA even if a
   future package version changes its default place.
   ========================================================================= */
import { createVivarium } from "../vendor/weather-vivarium/dist/weather-vivarium.min.js";

var LOS_ANGELES = {
  city: "Los Angeles", country: "United States", admin1: "California",
  lat: 34.05, lon: -118.24, timezone: "America/Los_Angeles",
  elevation: 87, population: 3971883
};

var host = document.getElementById("vivarium");
if (host) {
  var onWeatherPage = document.body.classList.contains("weather");
  // Instance kept on window as a console/debug handle (public package API).
  window.__vivarium = createVivarium(host, Object.assign({
    // "css" = don't set an inline --wv-size; the site stylesheet owns it
    // (100px corner jewel, 84px on small screens, integer-fit on /weather via
    // the head script there).
    size: "css",
    // The corner jewel zooms to an overlay on click; /weather is already big.
    // The zoom transition, its stacking, the mobile fit and Escape-to-close all
    // live in the package as of 1.1.0 — the site adds nothing.
    interactive: !onWeatherPage
  }, LOS_ANGELES));
}
