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
