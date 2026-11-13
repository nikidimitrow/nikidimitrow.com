document.addEventListener("DOMContentLoaded", () => {
  const isBg = document.documentElement.lang === "bg";

  // Mobile navigation toggle (with aria-controls, Esc, and outside-click close)
  const toggleBtn = document.querySelector(".nav-toggle");
  const navWrapper = document.querySelector(".nav-wrapper");

  if (toggleBtn && navWrapper) {
    const labelOpen = isBg ? "Затвори" : "Close";
    const labelClosed = isBg ? "Меню" : "Menu";

    const setMenuOpen = (open) => {
      navWrapper.classList.toggle("open", open);
      toggleBtn.setAttribute("aria-expanded", String(open));
      toggleBtn.textContent = open ? labelOpen : labelClosed;
    };

    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      setMenuOpen(!navWrapper.classList.contains("open"));
    });

    navWrapper.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenuOpen(false));
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navWrapper.classList.contains("open")) {
        setMenuOpen(false);
        toggleBtn.focus();
      }
    });

    document.addEventListener("click", (e) => {
      if (
        navWrapper.classList.contains("open") &&
        !navWrapper.contains(e.target) &&
        !toggleBtn.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    });
  }

  // Obfuscated email assembly
  document.querySelectorAll(".obf-email").forEach((el) => {
    const user = el.getAttribute("data-u");
    const domain = el.getAttribute("data-d");
    if (!user || !domain) return;
    const addr = `${user}@${domain}`;
    const link = document.createElement("a");
    link.href = `mailto:${addr}`;
    link.textContent = el.getAttribute("data-label") || addr;
    el.replaceWith(link);
  });

  // Project domain filter (with aria-pressed)
  const filterBtns = document.querySelectorAll("[data-filter]");
  const projectCards = document.querySelectorAll("[data-domain]");

  if (filterBtns.length && projectCards.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-filter");

        filterBtns.forEach((b) => {
          b.classList.remove("btn-primary");
          b.classList.add("btn-secondary");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.remove("btn-secondary");
        btn.classList.add("btn-primary");
        btn.setAttribute("aria-pressed", "true");

        projectCards.forEach((card) => {
          const domain = card.getAttribute("data-domain");
          if (filter === "all" || domain === filter || domain === "bridge") {
            card.style.display = "";
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  }

  // Notes series filter (with aria-pressed)
  const seriesBtns = document.querySelectorAll("[data-series-filter]");
  const noteCards = document.querySelectorAll("[data-series]");

  if (seriesBtns.length && noteCards.length) {
    seriesBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const series = btn.getAttribute("data-series-filter");

        seriesBtns.forEach((b) => {
          b.classList.remove("btn-primary");
          b.classList.add("btn-secondary");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.remove("btn-secondary");
        btn.classList.add("btn-primary");
        btn.setAttribute("aria-pressed", "true");

        noteCards.forEach((card) => {
          const cardSeries = card.getAttribute("data-series");
          card.style.display = (series === "all" || cardSeries === series) ? "" : "none";
        });
      });
    });
  }

  // Copy-link affordance on case study anchor links
  document.querySelectorAll(".anchor-link").forEach((anchor) => {
    anchor.addEventListener("click", () => {
      if (navigator.clipboard && anchor.href) {
        navigator.clipboard.writeText(anchor.href).catch(() => {});
      }
    });
  });
});

/* === Theme Toggle (Auto -> Light -> Dark) === */
(function () {
  var STORAGE_KEY = "theme";
  var ORDER = ["auto", "light", "dark"];
  var ICONS = {
    auto: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor"/></svg>',
    light: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>',
    dark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
  };

  function isBg() {
    return (document.documentElement.lang || "").toLowerCase().indexOf("bg") === 0;
  }

  function getLabels() {
    if (isBg()) {
      return {
        auto: { aria: "Тема: автоматична", short: "Авто" },
        light: { aria: "Тема: светла", short: "Светла" },
        dark: { aria: "Тема: тъмна", short: "Тъмна" }
      };
    }
    return {
      auto: { aria: "Theme: auto", short: "Auto" },
      light: { aria: "Theme: light", short: "Light" },
      dark: { aria: "Theme: dark", short: "Dark" }
    };
  }

  function currentMode() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark") return saved;
    } catch (e) {}
    return "auto";
  }

  function applyMode(mode) {
    var root = document.documentElement;
    if (mode === "light" || mode === "dark") {
      root.setAttribute("data-theme", mode);
      try { localStorage.setItem(STORAGE_KEY, mode); } catch (e) {}
    } else {
      root.removeAttribute("data-theme");
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    }
    updateButtons(mode);
  }

  function updateButtons(mode) {
    var labels = getLabels()[mode];
    var buttons = document.querySelectorAll(".theme-toggle");
    for (var i = 0; i < buttons.length; i++) {
      var btn = buttons[i];
      btn.setAttribute("aria-label", labels.aria);
      btn.setAttribute("title", labels.aria);
      btn.setAttribute("data-mode", mode);
      btn.innerHTML = ICONS[mode] + '<span class="theme-toggle-label">' + labels.short + "</span>";
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var buttons = document.querySelectorAll(".theme-toggle");
    if (!buttons.length) return;
    updateButtons(currentMode());
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", function () {
        var idx = ORDER.indexOf(currentMode());
        var next = ORDER[(idx + 1) % ORDER.length];
        applyMode(next);
      });
    }
  });
})();
