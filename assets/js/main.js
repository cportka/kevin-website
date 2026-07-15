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
})();
