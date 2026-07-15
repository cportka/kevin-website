/* Runs in <head> before first paint. Two jobs, both flash-sensitive:
   1) Resolve the theme (stored choice → OS preference → light) so the page
      never paints in the wrong theme.
   2) Arm the intro loading screen (html.intro-pending shows the full-viewport
      overlay; main.js collapses it onto the reel). Armed only when JS runs and
      motion is allowed, so no-JS / reduced-motion visitors get the plain page.
   Kept tiny and dependency-free. */
(function () {
  var root = document.documentElement;
  try {
    var stored = localStorage.getItem("theme");
    var theme = (stored === "light" || stored === "dark")
      ? stored
      : (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    root.setAttribute("data-theme", theme);
  } catch (e) {
    root.setAttribute("data-theme", "light");
  }

  try {
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) {
      root.classList.add("intro-pending");
      // Safety net: never leave the overlay locking the page (e.g. main.js
      // failed to load). main.js normally removes the class well before this.
      setTimeout(function () { root.classList.remove("intro-pending"); }, 4000);
    }
  } catch (e) { /* no intro — page renders normally */ }
})();
