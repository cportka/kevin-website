/* Kevin Haulihan — progressive enhancement.
   Everything here is optional: with JS off, the page is fully readable and
   all media/links work. No dependencies. */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasIO = "IntersectionObserver" in window;

  /* ---- 1. Scroll reveal (flash-free) --------------------------------- */
  // Items already on screen are shown immediately (never hidden); only
  // below-the-fold items get the hidden `.pre` state, then fade in.
  var reveals = document.querySelectorAll(".reveal");
  if (reduceMotion || !hasIO) {
    // Nothing to do — CSS leaves .reveal visible by default.
  } else {
    var show = function (el) {
      el.classList.add("in-view");
      el.classList.remove("pre");
    };
    var revealIO = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { show(entry.target); obs.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -5% 0px", threshold: 0.01 });

    var vh = window.innerHeight || document.documentElement.clientHeight;
    var pending = [];
    reveals.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < vh * 0.95) {
        el.classList.add("in-view"); // already visible: reveal without hiding
      } else {
        el.classList.add("pre");
        pending.push(el);
        revealIO.observe(el);
      }
    });

    // Safety net: never leave content stuck hidden if the observer misfires.
    setTimeout(function () {
      pending.forEach(function (el) {
        if (el.classList.contains("pre")) { show(el); revealIO.unobserve(el); }
      });
    }, 4000);
  }

  /* ---- 2. Reel: pause when off-screen --------------------------------- */
  // The current reel has no audio track, so there is no sound/mute control;
  // restore one here if a reel with sound ships later.
  var reel = document.querySelector(".reel");
  var video = reel ? reel.querySelector("video") : null;

  if (reel && video) {
    // Pause the muted loop when it scrolls out of view (saves battery/CPU).
    if (hasIO) {
      var playIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            // Only auto-resume the silent loop. If the viewer unmuted, don't
            // force playback on scroll-back (no gesture => audio would be
            // blocked or would blare); leave it for the button/gesture.
            // While the intro overlay holds the page, stay on the poster frame —
            // the intro hands playback off when it lifts.
            if (video.muted && !document.documentElement.classList.contains("intro-pending")) {
              var p = video.play();
              if (p && typeof p.catch === "function") { p.catch(function () {}); }
            }
          } else {
            video.pause();
          }
        });
      }, { threshold: 0.2 });
      playIO.observe(video);
    }
  }

  /* ---- 3. Theme toggle ---------------------------------------------- */
  // theme.js already set data-theme before paint; here we wire the button,
  // persist the choice, and keep the browser chrome (theme-color) in sync.
  var root = document.documentElement;
  var toggle = document.getElementById("theme-toggle");
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  function currentTheme() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }
  function applyTheme(theme, animate) {
    if (animate && !reduceMotion) {
      root.classList.add("theme-transition");
      window.setTimeout(function () { root.classList.remove("theme-transition"); }, 420);
    }
    root.setAttribute("data-theme", theme);
    if (themeMeta) themeMeta.setAttribute("content", theme === "dark" ? "#131210" : "#ffffff");
    if (toggle) {
      var goingDark = theme === "light"; // button switches to the *other* theme
      toggle.setAttribute("aria-label", goingDark ? "Switch to dark theme" : "Switch to light theme");
      toggle.setAttribute("title", goingDark ? "Dark mode" : "Light mode");
      toggle.setAttribute("aria-pressed", String(theme === "dark"));
    }
  }
  if (toggle) {
    applyTheme(currentTheme(), false); // sync labels/meta to the pre-painted theme
    toggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      applyTheme(next, true);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  /* ---- 4. Intro: full-viewport panel collapses onto the reel --------- */
  // theme.js armed html.intro-pending pre-paint (JS-on, motion-ok only), so the
  // overlay is already covering the page. Here we measure the reel's frame and
  // collapse the overlay onto it (WAAPI), then lift it and start the reel.
  var intro = document.getElementById("intro");
  if (intro && root.classList.contains("intro-pending")) {
    var finishIntro = function () {
      root.classList.remove("intro-pending");
      if (intro.parentNode) { intro.parentNode.removeChild(intro); }
      if (video && video.muted) {
        var p = video.play();
        if (p && typeof p.catch === "function") { p.catch(function () {}); }
      }
    };

    if (reduceMotion || !intro.animate || !reel) {
      finishIntro();
    } else {
      if (video) { video.pause(); } // hold the poster frame for a seamless hand-off

      var introDone = false;
      var startIntro = function () {
        if (introDone) { return; }
        introDone = true;

        var rect = reel.getBoundingClientRect();
        var vw = document.documentElement.clientWidth;
        var vh = document.documentElement.clientHeight;

        var word = intro.querySelector(".intro__word");
        if (word && word.animate) {
          word.animate([{ opacity: 1 }, { opacity: 0 }],
            { duration: 320, delay: 420, easing: "ease-out", fill: "forwards" });
        }

        // Projector warm-up: one continuous color track spanning the hold
        // (the collapse's 450ms delay) plus the 850ms collapse, so the cycle
        // black -> purple -> blue -> red -> orange -> white completes exactly
        // as the panel lands on the reel's frame.
        intro.animate([
          { backgroundColor: "#000000", offset: 0    },
          { backgroundColor: "#4c1d95", offset: 0.22 },
          { backgroundColor: "#1d4ed8", offset: 0.42 },
          { backgroundColor: "#dc2626", offset: 0.62 },
          { backgroundColor: "#f97316", offset: 0.82 },
          { backgroundColor: "#ffffff", offset: 1    }
        ], { duration: 1300, easing: "linear", fill: "forwards" });

        var collapse = intro.animate([
          { top: "0px", left: "0px", width: vw + "px", height: vh + "px", borderRadius: "0px" },
          { top: rect.top + "px", left: rect.left + "px",
            width: rect.width + "px", height: rect.height + "px", borderRadius: "20px" }
        ], { duration: 850, delay: 450, easing: "cubic-bezier(0.76, 0, 0.24, 1)", fill: "forwards" });

        collapse.onfinish = function () {
          var fade = intro.animate([{ opacity: 1 }, { opacity: 0 }],
            { duration: 260, easing: "ease-out", fill: "forwards" });
          fade.onfinish = finishIntro;
        };

        // Never trap the page if an animation stalls (theme.js also has a net).
        setTimeout(function () {
          if (root.classList.contains("intro-pending")) { finishIntro(); }
        }, 3200);
      };

      // Measure once the web fonts have settled (they shift the reel's position);
      // the timeout keeps the intro snappy if the font network request drags.
      if (document.fonts && document.fonts.ready && typeof document.fonts.ready.then === "function") {
        document.fonts.ready.then(startIntro, startIntro);
      }
      setTimeout(startIntro, 350);
    }
  }

  /* ---- 5. Corner counter: vertical site position (000 → 100) --------- */
  // 000 at the very top of the page, 100 at the very bottom.
  var folio = document.querySelector(".folio");
  if (folio) {
    var folioTicking = false;
    var updateFolio = function () {
      folioTicking = false;
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var pct = max > 0 ? Math.round((window.scrollY || doc.scrollTop || 0) / max * 100) : 0;
      if (pct < 0) { pct = 0; } else if (pct > 100) { pct = 100; }
      folio.textContent = ("00" + pct).slice(-3) + " / 100";
    };
    var queueFolio = function () {
      if (!folioTicking) { folioTicking = true; requestAnimationFrame(updateFolio); }
    };
    window.addEventListener("scroll", queueFolio, { passive: true });
    window.addEventListener("resize", queueFolio, { passive: true });
    updateFolio();
  }

  /* ---- 6. LA weather widget (progressive enhancement) --------------- */
  // Current Los Angeles conditions from Open-Meteo (no API key, CORS, one
  // connect-src in the CSP — data only). If the request fails (offline,
  // blocked, API down) the widget simply never appears; nothing breaks.
  (function () {
    if (!window.fetch) { return; }
    var url = "https://api.open-meteo.com/v1/forecast" +
      "?latitude=34.0522&longitude=-118.2437" +
      "&current=temperature_2m,weather_code,is_day&temperature_unit=fahrenheit";

    // WMO weather code -> icon key (day/night variants where it reads).
    function iconKey(code, day) {
      if (code === 0) { return day ? "sun" : "moon"; }
      if (code === 1 || code === 2) { return day ? "partly-day" : "partly-night"; }
      if (code === 3) { return "cloud"; }
      if (code === 45 || code === 48) { return "fog"; }
      if (code >= 71 && code <= 77) { return "snow"; }
      if (code === 85 || code === 86) { return "snow"; }
      if (code >= 95) { return "thunder"; }
      if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) { return "rain"; }
      return "cloud";
    }
    function describe(code) {
      if (code === 0) { return "clear sky"; }
      if (code <= 2) { return "partly cloudy"; }
      if (code === 3) { return "overcast"; }
      if (code === 45 || code === 48) { return "fog"; }
      if (code >= 51 && code <= 57) { return "drizzle"; }
      if (code >= 61 && code <= 67) { return "rain"; }
      if (code >= 71 && code <= 77) { return "snow"; }
      if (code >= 80 && code <= 82) { return "rain showers"; }
      if (code === 85 || code === 86) { return "snow showers"; }
      if (code >= 95) { return "thunderstorm"; }
      return "cloudy";
    }

    // Thin-stroke line icons (currentColor), Feather-style, matching the
    // theme-toggle set. Each is a self-contained 24x24 SVG string.
    var A = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"';
    function svg(inner) { return "<svg " + A + ">" + inner + "</svg>"; }
    var ICONS = {
      sun: svg('<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M4.4 4.4l1.6 1.6M18 18l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.4 19.6 6 18M18 6l1.6-1.6"/>'),
      moon: svg('<path d="M21 12.8A8.5 8.5 0 1 1 11.2 3.2 6.6 6.6 0 0 0 21 12.8Z"/>'),
      cloud: svg('<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10Z"/>'),
      "partly-day": svg('<circle cx="7.5" cy="7.5" r="3"/><path d="M7.5 1.9v1.5M3.3 3.3l1.1 1.1M1.9 7.5h1.5M11.7 3.3l-1.1 1.1M3.3 11.7l1.1-1.1"/><path d="M18 13.5A3.9 3.9 0 0 0 14.8 11 5.3 5.3 0 0 0 4.6 12.4 3.4 3.4 0 0 0 5.4 19h12a2.8 2.8 0 0 0 .6-5.5Z"/>'),
      "partly-night": svg('<path d="M12.2 3.4A3.7 3.7 0 1 0 12.4 10.8 4.3 4.3 0 0 1 12.2 3.4Z"/><path d="M18 13.5A3.9 3.9 0 0 0 14.8 11 5.3 5.3 0 0 0 4.6 12.4 3.4 3.4 0 0 0 5.4 19h12a2.8 2.8 0 0 0 .6-5.5Z"/>'),
      fog: svg('<path d="M4 8.5h13M6 12.5h12M4 16.5h11M8 20.5h9"/>'),
      rain: svg('<path d="M20 16.6A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/><path d="M8 19l-1 2.4M12 19.4l-1 2.4M16 19l-1 2.4"/>'),
      snow: svg('<path d="M20 17.6A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/><path d="M8 18h.01M16 18h.01M10 22h.01M14 22h.01M12 20h.01"/>'),
      thunder: svg('<path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"/><path d="M13 11l-4 6h6l-4 6"/>')
    };

    fetch(url, { mode: "cors" }).then(function (r) {
      return r && r.ok ? r.json() : null;
    }).then(function (data) {
      var c = data && data.current;
      if (!c) { return; }
      var temp = Math.round(c.temperature_2m);
      if (isNaN(temp)) { return; }
      var code = c.weather_code;
      var svg = ICONS[iconKey(code, c.is_day !== 0)] || ICONS.cloud;

      var el = document.createElement("div");
      el.className = "weather";
      el.setAttribute("role", "img");
      el.setAttribute("aria-label",
        "Los Angeles weather: " + temp + " degrees Fahrenheit, " + describe(code));
      el.innerHTML =
        '<span class="weather__icon" aria-hidden="true">' + svg + "</span>" +
        '<span class="weather__temp">' + temp + "°F</span>";
      document.body.appendChild(el);
      requestAnimationFrame(function () { el.classList.add("is-ready"); });
    }).catch(function () { /* no widget on failure */ });
  })();
})();
