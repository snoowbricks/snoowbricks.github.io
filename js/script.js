/* ============================================
   SNOOWBRICKS — Script
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {

  // ---- Snow Particles ----
  const canvas = document.getElementById("snow-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    const flakes = [];
    const FLAKE_COUNT = Math.min(80, Math.floor(width / 15));

    class Snowflake {
      constructor() { this.reset(true); }
      reset(init) {
        this.x = Math.random() * width;
        this.y = init ? Math.random() * height : -10;
        this.radius = Math.random() * 2 + 0.5;
        this.speed = Math.random() * 0.6 + 0.2;
        this.wind = Math.random() * 0.4 - 0.2;
        this.opacity = Math.random() * 0.5 + 0.1;
      }
      update() {
        this.y += this.speed;
        this.x += this.wind + Math.sin(this.y * 0.005) * 0.3;
        if (this.y > height + 10 || this.x < -10 || this.x > width + 10) this.reset(false);
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < FLAKE_COUNT; i++) flakes.push(new Snowflake());

    function animateSnow() {
      ctx.clearRect(0, 0, width, height);
      flakes.forEach(f => { f.update(); f.draw(); });
      requestAnimationFrame(animateSnow);
    }
    animateSnow();

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });
  }

  // ---- Nav scroll effect ----
  const nav = document.querySelector(".nav");
  if (nav) {
    window.addEventListener("scroll", () => {
      nav.classList.toggle("scrolled", window.scrollY > 60);
    });
  }

  // ---- Scroll reveal for cards ----
  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -40px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // stagger the animation based on sibling index
        const siblings = entry.target.parentElement.children;
        const index = Array.from(siblings).indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add("visible");
        }, index * 120);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll(".about-card, .social-card").forEach(el => {
    observer.observe(el);
  });

  // ---- Smooth scroll for nav links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // ---- Language system (preserved from original) ----
  const langBtns = {
    en: document.getElementById("btn-en"),
    es: document.getElementById("btn-es")
  };
  const translatables = document.querySelectorAll("[data-en]");
  const savedLang = localStorage.getItem("lang") || "en";

  applyLang(savedLang);

  if (langBtns.en && langBtns.es) {
    langBtns.en.addEventListener("click", () => setLang("en"));
    langBtns.es.addEventListener("click", () => setLang("es"));
  }

  function setLang(lang) {
    localStorage.setItem("lang", lang);
    applyLang(lang);
  }

  function applyLang(lang) {
    translatables.forEach(el => {
      const txt = el.dataset[lang];
      if (txt) el.innerHTML = txt;
    });
    if (langBtns.en && langBtns.es) {
      langBtns.en.classList.toggle("active", lang === "en");
      langBtns.es.classList.toggle("active", lang === "es");
    }
  }

});
