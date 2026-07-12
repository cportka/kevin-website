/* Runs in <head> before first paint to prevent a flash of the wrong theme.
   Resolves: stored choice → OS preference → light. Kept tiny and dependency-free. */
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var theme = (stored === "light" || stored === "dark")
      ? stored
      : (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "light");
  }
})();
