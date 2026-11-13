document.addEventListener("DOMContentLoaded", () => {
  // Mobile navigation toggle
  const toggleBtn = document.querySelector(".nav-toggle");
  const navWrapper = document.querySelector(".nav-wrapper");

  if (toggleBtn && navWrapper) {
    toggleBtn.addEventListener("click", () => {
      const isOpen = navWrapper.classList.toggle("open");
      toggleBtn.setAttribute("aria-expanded", String(isOpen));
    });

    // Close menu when clicking a link on mobile
    navWrapper.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navWrapper.classList.remove("open");
        toggleBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Project domain filter (if present on projects page)
  const filterBtns = document.querySelectorAll("[data-filter]");
  const projectCards = document.querySelectorAll("[data-domain]");

  if (filterBtns.length && projectCards.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-filter");

        filterBtns.forEach((b) => b.classList.remove("btn-primary"));
        filterBtns.forEach((b) => b.classList.add("btn-secondary"));
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
});
