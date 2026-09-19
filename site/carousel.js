// The roster carousel, ported verbatim from capeindex.com. Builds its dots from the slide count,
// auto-advances only while on screen and not hovered or focused, and honours reduced motion.
(function () {
  var track = document.getElementById("rec-track");
  var dotsHost = document.getElementById("rec-dots");
  var playBtn = document.getElementById("rec-play");
  if (!track || !dotsHost || !playBtn) return;
  var slides = track.querySelectorAll(".rec-slide");
  if (!slides.length) return;
  var idx = 0, timer = null, paused = false;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Build the dot row from the slide count
  for (var i = 0; i < slides.length; i++) {
    var d = document.createElement("button");
    d.type = "button"; d.className = "rec-dot";
    d.setAttribute("role", "tab");
    var name = (slides[i].querySelector(".rec-info h5") || {}).textContent || ("Slide " + (i + 1));
    // strip a trailing model chip like "Ledger Opus" back to "Ledger"
    name = name.replace(/\s+(Sonnet|Opus|Fable|Haiku)\s*$/i, "").trim();
    d.setAttribute("aria-label", "Go to " + name);
    d.dataset.i = i;
    dotsHost.appendChild(d);
  }
  var dots = dotsHost.querySelectorAll(".rec-dot");
  function paint() {
    for (var i = 0; i < dots.length; i++) dots[i].setAttribute("aria-current", i === idx ? "true" : "false");
  }
  function goTo(i, opts) {
    opts = opts || {};
    idx = ((i % slides.length) + slides.length) % slides.length;
    var s = slides[idx];
    track.scrollTo({ left: s.offsetLeft - track.offsetLeft, behavior: opts.jump ? "auto" : (reduced ? "auto" : "smooth") });
    paint();
  }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function start() {
    if (paused || reduced) return;
    stop();
    timer = setInterval(function () { goTo(idx + 1); }, 6500);
  }
  playBtn.addEventListener("click", function () {
    paused = !paused;
    playBtn.setAttribute("aria-pressed", paused ? "false" : "true");
    playBtn.setAttribute("aria-label", paused ? "Resume auto-advance" : "Pause auto-advance");
    playBtn.innerHTML = paused ? "Play &#9654;" : "Pause &#9612;&#9612;";
    if (paused) stop(); else start();
  });
  document.querySelectorAll("[data-rec-dir]").forEach(function (b) {
    b.addEventListener("click", function () { goTo(idx + parseInt(b.getAttribute("data-rec-dir"), 10)); });
  });
  dotsHost.addEventListener("click", function (e) {
    var d = e.target.closest(".rec-dot"); if (!d) return;
    goTo(parseInt(d.dataset.i, 10));
  });
  // keyboard: left/right when focus is inside the carousel
  track.parentNode.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") { e.preventDefault(); goTo(idx - 1); }
    else if (e.key === "ArrowRight") { e.preventDefault(); goTo(idx + 1); }
    else if (e.key === "Home") { e.preventDefault(); goTo(0); }
    else if (e.key === "End") { e.preventDefault(); goTo(slides.length - 1); }
  });
  // sync when the reader swipes/scrolls the track by hand
  var scrollT;
  track.addEventListener("scroll", function () {
    clearTimeout(scrollT);
    scrollT = setTimeout(function () {
      var best = 0, bestD = Infinity;
      for (var i = 0; i < slides.length; i++) {
        var d = Math.abs(slides[i].offsetLeft - track.scrollLeft);
        if (d < bestD) { bestD = d; best = i; }
      }
      idx = best; paint();
    }, 90);
  });
  // pause while the reader is interacting; only auto-advance while the carousel is on screen
  var host = track.closest(".rec-carousel");
  ["mouseenter", "focusin"].forEach(function (ev) { host.addEventListener(ev, stop); });
  ["mouseleave", "focusout"].forEach(function (ev) { host.addEventListener(ev, function () { if (!paused) start(); }); });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting && !paused) start(); else stop(); });
    }, { threshold: 0.25 });
    io.observe(host);
  } else {
    start();
  }
  // land at slide 0 on first paint even if the reader arrives on the reconcilers tab via hash
  goTo(0, { jump: true });
  // if a resize changes the slide width, re-snap to the current idx
  window.addEventListener("resize", function () { goTo(idx, { jump: true }); });
})();
