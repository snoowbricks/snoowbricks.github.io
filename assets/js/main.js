/* ==========================================================
   snoowbricks — script único
   Idioma ES/EN · tema claro/oscuro · navegación · menú móvil · aparición · nieve
   ========================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Idioma ---------- */
  function applyLang(lang) {
    root.lang = lang;
    root.setAttribute("data-lang", lang);

    var title = root.getAttribute("data-title-" + lang);
    if (title) document.title = title;

    // Atributos traducibles: data-aria-es / data-aria-en, data-href-es / data-href-en
    document.querySelectorAll("[data-aria-" + lang + "]").forEach(function (el) {
      el.setAttribute("aria-label", el.getAttribute("data-aria-" + lang));
    });
    document.querySelectorAll("[data-href-" + lang + "]").forEach(function (el) {
      el.setAttribute("href", el.getAttribute("data-href-" + lang));
    });
    document.querySelectorAll(".lang-toggle").forEach(function (btn) {
      btn.setAttribute("aria-label", lang === "es" ? "Switch to English" : "Cambiar a español");
    });
    updateThemeLabel();
  }

  function setLang(lang) {
    try { localStorage.setItem("lang", lang); } catch (e) {}
    applyLang(lang);
  }

  applyLang(root.getAttribute("data-lang") || "es");

  document.querySelectorAll(".lang-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setLang(root.getAttribute("data-lang") === "es" ? "en" : "es");
    });
  });

  /* ---------- Tema claro / oscuro ---------- */
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  var systemDark = window.matchMedia("(prefers-color-scheme: dark)");

  function updateThemeLabel() {
    var light = root.getAttribute("data-theme") === "light";
    var es = root.getAttribute("data-lang") !== "en";
    var label = light ? (es ? "Cambiar a modo oscuro" : "Switch to dark mode")
                      : (es ? "Cambiar a modo claro" : "Switch to light mode");
    document.querySelectorAll(".theme-toggle").forEach(function (btn) {
      btn.setAttribute("aria-label", label);
      btn.setAttribute("title", label);
    });
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeMeta) themeMeta.setAttribute("content", theme === "light" ? "#f0f0f0" : "#0a0a0a");
    updateThemeLabel();
  }

  document.querySelectorAll(".theme-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      try { localStorage.setItem("theme", next); } catch (e) {}
      applyTheme(next);
    });
  });

  // Si nunca se ha elegido tema, sigue al del sistema
  systemDark.addEventListener("change", function (e) {
    var saved = null;
    try { saved = localStorage.getItem("theme"); } catch (err) {}
    if (!saved) applyTheme(e.matches ? "dark" : "light");
  });

  applyTheme(root.getAttribute("data-theme") || "dark");

  /* ---------- Navegación al hacer scroll ---------- */
  var nav = document.querySelector(".nav");
  if (nav) {
    var onScroll = function () { nav.classList.toggle("scrolled", window.scrollY > 60); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Menú móvil ---------- */
  var burger = document.querySelector(".nav-hamburger");
  var menu = document.getElementById("mobile-menu");

  function closeMenu() {
    if (!burger || !menu) return;
    burger.setAttribute("aria-expanded", "false");
    menu.classList.remove("open");
    menu.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  if (burger && menu) {
    burger.addEventListener("click", function () {
      var open = burger.getAttribute("aria-expanded") !== "true";
      burger.setAttribute("aria-expanded", String(open));
      menu.classList.toggle("open", open);
      menu.setAttribute("aria-hidden", String(!open));
      document.body.style.overflow = open ? "hidden" : "";
    });
    menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeMenu); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
    window.addEventListener("resize", function () { if (window.innerWidth > 900) closeMenu(); });
  }

  /* ---------- Aparición al hacer scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || reduceMotion) {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) { return c.classList.contains("reveal"); });
        var i = Math.min(siblings.indexOf(el), 6);
        setTimeout(function () { el.classList.add("visible"); }, i * 90);
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Nieve (guiño a "snoow") ---------- */
  var canvas = document.getElementById("snow-canvas");
  if (canvas && !reduceMotion) {
    var ctx = canvas.getContext("2d");
    var w, h, flakes = [], running = true;

    var resize = function () {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    var Flake = function () { this.reset(true); };
    Flake.prototype.reset = function (init) {
      this.x = Math.random() * w;
      this.y = init ? Math.random() * h : -10;
      this.r = Math.random() * 1.8 + 0.4;
      this.s = Math.random() * 0.5 + 0.15;
      this.d = Math.random() * 0.3 - 0.15;
      this.o = Math.random() * 0.4 + 0.1;
    };
    Flake.prototype.step = function () {
      this.y += this.s;
      this.x += this.d + Math.sin(this.y * 0.005) * 0.25;
      if (this.y > h + 10 || this.x < -10 || this.x > w + 10) this.reset(false);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = root.getAttribute("data-theme") === "light" ? "rgba(10,10,10," + (this.o * 0.6) + ")" : "rgba(255,255,255," + this.o + ")";
      ctx.fill();
    };

    var count = Math.min(70, Math.floor(w / 18));
    for (var i = 0; i < count; i++) flakes.push(new Flake());

    var loop = function () {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (var j = 0; j < flakes.length; j++) flakes[j].step();
      requestAnimationFrame(loop);
    };
    loop();

    // Pausa cuando la pestaña no está visible
    document.addEventListener("visibilitychange", function () {
      running = !document.hidden;
      if (running) loop();
    });
  }
})();
