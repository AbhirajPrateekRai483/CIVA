document.addEventListener("DOMContentLoaded", () => {

  const navButton = document.getElementById("navButton");
  const navCloseButton = document.getElementById("navCloseButton");
  const navOverlay = document.getElementById("navOverlay");
  const navMenu = document.getElementById("navMenu");


  function openNavigation() {

    if (!navMenu) return;

    navMenu.classList.add("open");

    if (navOverlay) {
      navOverlay.classList.add("open");
      navOverlay.setAttribute("aria-hidden", "false");
    }

    navMenu.setAttribute("aria-hidden", "false");

    if (navButton) {
      navButton.setAttribute("aria-expanded", "true");
    }

    document.body.classList.add("nav-open");
  }


  function closeNavigation() {

    if (!navMenu) return;

    navMenu.classList.remove("open");

    if (navOverlay) {
      navOverlay.classList.remove("open");
      navOverlay.setAttribute("aria-hidden", "true");
    }

    navMenu.setAttribute("aria-hidden", "true");

    if (navButton) {
      navButton.setAttribute("aria-expanded", "false");
    }

    document.body.classList.remove("nav-open");
  }


  if (navButton) {
    navButton.addEventListener("click", openNavigation);
  }


  if (navCloseButton) {
    navCloseButton.addEventListener("click", closeNavigation);
  }


  if (navOverlay) {
    navOverlay.addEventListener("click", closeNavigation);
  }


  document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
      closeNavigation();
    }

  });


  if (navMenu) {

    const navLinks =
      navMenu.querySelectorAll("a");

    navLinks.forEach(link => {

      link.addEventListener("click", () => {
        closeNavigation();
      });

    });

  }


  const accountButtons =
    document.querySelectorAll("[data-account-action]");


  accountButtons.forEach(button => {

    button.addEventListener("click", event => {

      const action =
        button.dataset.accountAction;

      if (!action) return;

      if (
        action === "login" ||
        action === "signup" ||
        action === "profile"
      ) {

        event.preventDefault();

      }

    });

  });

});