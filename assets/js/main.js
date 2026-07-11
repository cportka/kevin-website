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

  /* ---- 2. Reel: sound toggle + pause when off-screen ----------------- */
  var reel = document.querySelector(".reel");
  var video = reel ? reel.querySelector("video") : null;

  if (reel && video) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "reel__sound";

    function syncLabel() {
      var muted = video.muted;
      btn.textContent = muted ? "Sound" : "Mute";
      btn.setAttribute("aria-pressed", String(!muted));
      btn.setAttribute("aria-label", muted ? "Unmute showreel" : "Mute showreel");
    }
    btn.addEventListener("click", function () {
      video.muted = !video.muted;
      if (!video.muted) {
        var p = video.play();
        if (p && typeof p.catch === "function") { p.catch(function () {}); }
      }
      syncLabel();
    });
    syncLabel();
    reel.appendChild(btn);

    // Pause the muted loop when it scrolls out of view (saves battery/CPU).
    if (hasIO) {
      var playIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var p = video.play();
            if (p && typeof p.catch === "function") { p.catch(function () {}); }
          } else {
            video.pause();
          }
        });
      }, { threshold: 0.2 });
      playIO.observe(video);
    }
  }

  /* ---- 3. Running corner folio (001 → 010) --------------------------- */
  var folio = document.querySelector(".folio");
  var items = document.querySelectorAll(".work__item");
  if (folio && items.length && hasIO) {
    var folioIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var idxEl = entry.target.querySelector(".caption__index");
          var idx = idxEl ? idxEl.textContent.trim() : "";
          if (idx) { folio.textContent = "0" + idx + " / 010"; }
        }
      });
    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
    items.forEach(function (item) { folioIO.observe(item); });
  }
})();
