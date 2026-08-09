/* =========================================================================
   weather-widget.js — mount the corner weather diorama.

   The diorama itself is weather-vivarium (npm, pinned in package.json and
   vendored under assets/vendor/weather-vivarium/ — this static site has no
   build step, so the package ships with the site). It grew out of this site's
   original hand-built LA widget, now archived in archive/la-beach-diorama/.

   We pin the place explicitly to Los Angeles — name AND coordinates — so it
   boots instantly (no geocoding request) and keeps rendering LA even if a
   future package version changes its default place.
   ========================================================================= */
import { createVivarium } from "../vendor/weather-vivarium/src/index.js";

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
    // Non-numeric size = don't set an inline --wv-size; the site stylesheet
    // owns it (100px corner jewel, 84px on small screens, integer-fit on
    // /weather via the head script there).
    size: "css",
    // The corner jewel zooms to an overlay on click; /weather is already big.
    interactive: !onWeatherPage
  }, LOS_ANGELES));
  if (!onWeatherPage && window.__vivarium) smoothZoom(window.__vivarium.el);
}

/* Smooth zoom. weather-vivarium 1.0.0 snaps between its docked and expanded
   states (an is-expanded class toggle; only the backdrop fades). Rather than
   fork the vendored package, wrap the transition around it from the outside:
   watch the class attribute, and on each toggle FLIP-animate — invert the wrap
   from its cached previous box to the new layout box with a transform, then
   release it to none. A MutationObserver callback runs as a microtask, before
   the next paint, so the inverted first frame is never visible as a jump.
   (Filed as a rough edge in docs/weather-vivarium-npm-package-feedback.md —
   the right home for this is the package itself.) */
function smoothZoom(wrap) {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var TRANS = "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
  var first = null;                        // the box the widget was last at rest in
  function rest() { first = wrap.getBoundingClientRect(); }
  function settle() {
    wrap.style.transition = "";
    wrap.style.transform = "";
    wrap.style.transformOrigin = "";
    wrap.style.zIndex = "";
    rest();
  }
  // Keep the overlay clear of the info card as the card resizes (rows appear as
  // marine/air data lands, and it refills every 2s while open).
  var card = document.querySelector(".wv-card");
  if (card && window.ResizeObserver) {
    new ResizeObserver(function () { if (!wrap.style.transform) fitOverlay(wrap); }).observe(card);
  }
  new MutationObserver(function () {
    fitOverlay(wrap);                      // correct the box before measuring it
    var now = wrap.getBoundingClientRect();
    if (!first ||
        (Math.abs(first.left - now.left) < 0.5 && Math.abs(first.top - now.top) < 0.5 &&
         Math.abs(first.width - now.width) < 0.5)) { first = now; return; }   // is-ready etc.
    // Keep the wrap above the package's fading backdrop (z 9990) for the whole
    // animation — without this the docked z-index applies the moment the class
    // drops, and the shrinking widget dims underneath the backdrop.
    wrap.style.zIndex = "9991";
    wrap.style.transformOrigin = "0 0";
    wrap.style.transition = "none";
    wrap.style.transform = "translate(" + (first.left - now.left) + "px," + (first.top - now.top) + "px) " +
      "scale(" + (first.width / now.width) + "," + (first.height / now.height) + ")";
    void wrap.offsetWidth;                 // commit the inverted frame
    wrap.style.transition = TRANS;
    wrap.style.transform = "none";        // …and release, in the same tick
    wrap.addEventListener("transitionend", function done(e) {
      if (e.target !== wrap || e.propertyName !== "transform") return;
      wrap.removeEventListener("transitionend", done);
      settle();
    });
    first = now;
  }).observe(wrap, { attributes: true, attributeFilter: ["class"] });
  rest();
  // Recache the at-rest box whenever it can move without a class toggle: the
  // viewport resizing (the docked corner and the expanded size both track it),
  // and the package's own ready fade settling (it ends 4px below where it
  // starts). Inline transform is only ever set mid-FLIP, so it gates both.
  // This resize listener is registered after the package's own, so our overlay
  // fit lands on top of the size it just set.
  window.addEventListener("resize", function () {
    if (wrap.style.transform) return;
    fitOverlay(wrap);
    rest();
  });
  wrap.addEventListener("transitionend", function (e) {
    if (e.target === wrap && !wrap.style.transform) rest();
  });
}

/* Fit the expanded overlay into the space the info card actually leaves.

   weather-vivarium sizes the overlay from the viewport alone: on a wide screen
   it reserves 350px so the card sits beside the scene, but on a narrow one the
   card becomes a bottom sheet (up to 30vh) and the scene stays centred in the
   FULL viewport — so the sheet covers its lower third. Size and centre the
   scene in the band ABOVE the sheet instead, still snapping to a whole-integer
   multiple of the 100px base so every source pixel stays a crisp square.
   (Filed as a rough edge in docs/weather-vivarium-npm-package-feedback.md.) */
function fitOverlay(wrap) {
  if (!wrap.classList.contains("is-expanded")) return;
  // Wide screens: the card is beside the scene and the package's own fit is right.
  if (window.innerWidth >= 900) { wrap.style.removeProperty("--wv-top"); return; }
  var card = document.querySelector(".wv-card");
  var cardH = card && !card.hidden ? card.getBoundingClientRect().height : 0;
  var CARD_BOTTOM = 10, GAP = 16;          // the card's own bottom offset, plus breathing room
  var band = window.innerHeight - (cardH ? cardH + CARD_BOTTOM + GAP : 0);
  var n = Math.floor((Math.min(window.innerWidth, band) - 32) / 100);
  wrap.style.setProperty("--wv-exp", (n < 1 ? 1 : n) * 100 + "px");
  wrap.style.setProperty("--wv-top", (band / 2) + "px");   // centre of the free band
}
