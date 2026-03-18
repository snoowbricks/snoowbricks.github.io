document.addEventListener("DOMContentLoaded", () => {
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
