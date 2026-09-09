// =====================================================================
// app.js — ABL (African Business Link)
// Fusion de : theme.js + nav.js + notifications.js
// =====================================================================
(function () {

  /* ---------- Thèmes (light, dark, violet, midnight, glass, emerald) ---------- */
  const THEMES = ["light", "dark", "violet", "midnight", "glass", "emerald"];
  const STORAGE_KEY = "abl-theme";

  function applyTheme(theme) {
    if (theme === "light") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }

  function getSavedTheme() {
    return localStorage.getItem(STORAGE_KEY) || "light";
  }

  function nextTheme(current) {
    const i = THEMES.indexOf(current);
    return THEMES[(i + 1) % THEMES.length];
  }

  function initTheme() {
    applyTheme(getSavedTheme());

    const btn = document.getElementById("theme-toggle-btn");
    if (btn) {
      btn.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme") || "light";
        applyTheme(nextTheme(current));
      });
    }
  }

  // Exposé globalement pour un futur sélecteur de thème plus riche
  window.ABL_Theme = { applyTheme, getSavedTheme, THEMES };


  /* ---------- Navigation entre vues + menu mobile ---------- */
  function initViewSwitching() {
    const views = document.querySelectorAll(".view");
    const navlinks = document.querySelectorAll("[data-view]");

    navlinks.forEach((el) => {
      el.addEventListener("click", () => {
        const target = el.getAttribute("data-view");
        views.forEach((v) => v.classList.toggle("active", v.id === target));
        document.querySelectorAll(".navlink").forEach((n) =>
          n.classList.toggle("active", n.getAttribute("data-view") === target)
        );
        window.scrollTo({ top: 0, behavior: "instant" });

        const mobileNav = document.getElementById("mobile-nav");
        if (mobileNav) mobileNav.classList.remove("open");
      });
    });
  }

  function initMobileMenu() {
    const btn = document.getElementById("mobile-menu-btn");
    const mobileNav = document.getElementById("mobile-nav");
    if (!btn || !mobileNav) return;

    btn.addEventListener("click", () => {
      mobileNav.hidden = false;
      mobileNav.classList.toggle("open");
    });
  }


  /* ---------- Notifications — squelette, à développer dans une prochaine étape ---------- */
  // Utilisation prévue : ABL_Notifications.push({ title, message, type })
  window.ABL_Notifications = {
    queue: [],
    push(notification) {
      this.queue.push(notification);
      const dot = document.getElementById("notif-dot");
      if (dot) dot.hidden = false;
    },
  };


  /* ---------- Animation du logo ABL — rotation pilotée en JS ---------- */
  // Les deux anneaux tournent l'un autour de l'autre pendant SPIN_MS,
  // reviennent pile à leur position initiale (un nombre entier de tours),
  // puis restent immobiles pendant PAUSE_MS avant de repartir. En boucle.
  function initLogoSpin() {
    const svgs = document.querySelectorAll("svg.brand-mark, svg.brand-mark-large");
    if (!svgs.length) return;

    const SPIN_MS = 3000;   // durée de la rotation
    const PAUSE_MS = 5000;  // pause une fois revenu à la position d'origine
    const CYCLE_MS = SPIN_MS + PAUSE_MS;
    const TURNS = 3;        // nombre de tours complets pendant la rotation
    const CENTER_X = 47;    // point central commun aux deux anneaux (viewBox 0 0 100 70)
    const CENTER_Y = 35;

    const reduceMotion = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return; // on respecte la préférence système, le logo reste fixe

    function tick(timestamp) {
      const t = timestamp % CYCLE_MS;
      let angle = 0;

      if (t < SPIN_MS) {
        const progress = t / SPIN_MS; // 0 → 1
        angle = progress * 360 * TURNS;
      }
      // sinon (phase de pause) : angle reste à 0, anneaux au repos

      svgs.forEach((svg) => {
        const gold = svg.querySelector(".ring-gold");
        const green = svg.querySelector(".ring-green");
        if (gold) gold.setAttribute("transform", `rotate(${angle} ${CENTER_X} ${CENTER_Y})`);
        if (green) green.setAttribute("transform", `rotate(${-angle} ${CENTER_X} ${CENTER_Y})`);
      });

      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }


  /* ---------- Initialisation globale ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initViewSwitching();
    initMobileMenu();
    initLogoSpin();
  });

})();