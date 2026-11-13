document.addEventListener("DOMContentLoaded", () => {
  // Mobile navigation toggle
  const toggleBtn = document.querySelector(".nav-toggle");
  const navWrapper = document.querySelector(".nav-wrapper");

  if (toggleBtn && navWrapper) {
    toggleBtn.addEventListener("click", () => {
      const isOpen = navWrapper.classList.toggle("open");
      toggleBtn.setAttribute("aria-expanded", String(isOpen));
    });

    navWrapper.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navWrapper.classList.remove("open");
        toggleBtn.setAttribute("aria-expanded", "false");
      });
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

  // Render "Building in public" list from shared PROJECTS_DATA
  const bipContainer = document.getElementById("building-in-public-list");
  if (bipContainer && Array.isArray(window.PROJECTS_DATA)) {
    const lang = document.documentElement.lang === "bg" ? "bg" : "en";
    const statusLabels = {
      en: { building: "building", planned: "planned", published: "published" },
      bg: { building: "в разработка", planned: "планиран", published: "публикуван" }
    };

    bipContainer.innerHTML = window.PROJECTS_DATA.map((item) => {
      const copy = item[lang] || item.en;
      const href = lang === "bg" ? item.bgAnchor : item.anchor;
      const badgeLabel = (statusLabels[lang] && statusLabels[lang][item.status]) || item.status;
      return `
        <a href="${href}" class="status-row">
          <span class="status-id">${item.id}</span>
          <span class="status-title">${copy.title}</span>
          <span class="status-desc">${copy.oneliner}</span>
          <span class="status-badge status-${item.status}">${badgeLabel}</span>
        </a>
      `;
    }).join("");
  }

  // Project domain filter (if present on projects page)
  const filterBtns = document.querySelectorAll("[data-filter]");
  const projectCards = document.querySelectorAll("[data-domain]");

  if (filterBtns.length && projectCards.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-filter");

        filterBtns.forEach((b) => {
          b.classList.remove("btn-primary");
          b.classList.add("btn-secondary");
        });
        btn.classList.remove("btn-secondary");
        btn.classList.add("btn-primary");

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

  // Notes series filter (if present on notes page)
  const seriesBtns = document.querySelectorAll("[data-series-filter]");
  const noteCards = document.querySelectorAll("[data-series]");

  if (seriesBtns.length && noteCards.length) {
    seriesBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const series = btn.getAttribute("data-series-filter");

        seriesBtns.forEach((b) => {
          b.classList.remove("btn-primary");
          b.classList.add("btn-secondary");
        });
        btn.classList.remove("btn-secondary");
        btn.classList.add("btn-primary");

        noteCards.forEach((card) => {
          const cardSeries = card.getAttribute("data-series");
          card.style.display = (series === "all" || cardSeries === series) ? "" : "none";
        });
      });
    });
  }
});
