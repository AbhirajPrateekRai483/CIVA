"use strict";

document.addEventListener("DOMContentLoaded", () => {

  const navButton = document.getElementById("navButton");
  const navCloseButton = document.getElementById("navCloseButton");
  const navMenu = document.getElementById("navMenu");
  const navOverlay = document.getElementById("navOverlay");

  const openNavigation = () => {
    if (!navMenu || !navOverlay) return;

    navMenu.classList.add("active");
    navOverlay.classList.add("active");

    navMenu.setAttribute("aria-hidden", "false");
    navOverlay.setAttribute("aria-hidden", "false");

    if (navButton) {
      navButton.setAttribute("aria-expanded", "true");
      navButton.setAttribute("aria-label", "Close navigation");
    }

    document.body.classList.add("nav-open");

    if (navCloseButton) {
      navCloseButton.focus();
    }
  };

  const closeNavigation = () => {
    if (!navMenu || !navOverlay) return;

    navMenu.classList.remove("active");
    navOverlay.classList.remove("active");

    navMenu.setAttribute("aria-hidden", "true");
    navOverlay.setAttribute("aria-hidden", "true");

    if (navButton) {
      navButton.setAttribute("aria-expanded", "false");
      navButton.setAttribute("aria-label", "Open navigation");
    }

    document.body.classList.remove("nav-open");
  };

  if (navButton) {
    navButton.addEventListener("click", () => {

      if (navMenu && navMenu.classList.contains("active")) {
        closeNavigation();
      } else {
        openNavigation();
      }

    });
  }

  if (navCloseButton) {
    navCloseButton.addEventListener("click", closeNavigation);
  }

  if (navOverlay) {
    navOverlay.addEventListener("click", closeNavigation);
  }

  document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {
      closeNavigation();
      closeAllPostMenus();
    }

  });

  if (navMenu) {

    const navLinks = navMenu.querySelectorAll(".civa-nav-link");

    navLinks.forEach((link) => {

      link.addEventListener("click", () => {
        closeNavigation();
      });

    });

  }


  const latestTab = document.getElementById("latestTab");
  const trendingTab = document.getElementById("trendingTab");

  const latestPosts = document.getElementById("latestPosts");
  const trendingPosts = document.getElementById("trendingPosts");

  const showFeed = (feed) => {

    const showLatest = feed === "latest";

    if (latestTab) {

      latestTab.classList.toggle("active", showLatest);

      latestTab.setAttribute(
        "aria-selected",
        String(showLatest)
      );

    }

    if (trendingTab) {

      trendingTab.classList.toggle(
        "active",
        !showLatest
      );

      trendingTab.setAttribute(
        "aria-selected",
        String(!showLatest)
      );

    }

    if (latestPosts) {
      latestPosts.hidden = !showLatest;
    }

    if (trendingPosts) {
      trendingPosts.hidden = showLatest;
    }

  };


  if (latestTab) {

    latestTab.addEventListener("click", () => {
      showFeed("latest");
    });

  }


  if (trendingTab) {

    trendingTab.addEventListener("click", () => {
      showFeed("trending");
    });

  }


  const globalSearch = document.getElementById("globalSearch");
  const searchSuggestions =
    document.getElementById("searchSuggestions");


  const closeSuggestions = () => {

    if (!searchSuggestions) return;

    searchSuggestions.hidden = true;
    searchSuggestions.innerHTML = "";

  };


  const createSuggestion = (text, type) => {

    const button = document.createElement("button");

    button.type = "button";
    button.className = "search-suggestion";

    const icon = document.createElement("span");

    icon.className = "search-suggestion-icon";
    icon.setAttribute("aria-hidden", "true");

    if (type === "topic") {
      icon.textContent = "#";
    } else if (type === "creator") {
      icon.textContent = "@";
    } else {
      icon.textContent = "⌕";
    }

    const label = document.createElement("span");

    label.textContent = text;

    button.appendChild(icon);
    button.appendChild(label);

    button.addEventListener("click", () => {

      if (globalSearch) {
        globalSearch.value = text;
        globalSearch.focus();
      }

      closeSuggestions();

    });

    return button;

  };


  const showSuggestions = (value) => {

    if (!searchSuggestions) return;

    const query = value.trim();

    if (!query) {
      closeSuggestions();
      return;
    }

    searchSuggestions.innerHTML = "";

    const suggestions = [
      {
        text: query,
        type: "search"
      },
      {
        text: `${query} public problems`,
        type: "topic"
      },
      {
        text: `${query} creators`,
        type: "creator"
      }
    ];

    suggestions.forEach((suggestion) => {

      searchSuggestions.appendChild(
        createSuggestion(
          suggestion.text,
          suggestion.type
        )
      );

    });

    searchSuggestions.hidden = false;

  };


  if (globalSearch) {

    globalSearch.addEventListener("input", () => {
      showSuggestions(globalSearch.value);
    });


    globalSearch.addEventListener("focus", () => {

      if (globalSearch.value.trim()) {
        showSuggestions(globalSearch.value);
      }

    });


    globalSearch.addEventListener("keydown", (event) => {

      if (event.key === "Enter") {

        event.preventDefault();

        const query =
          globalSearch.value.trim();

        if (!query) return;

        closeSuggestions();

        window.dispatchEvent(
          new CustomEvent("civa:search", {
            detail: {
              query
            }
          })
        );

      }


      if (event.key === "Escape") {

        closeSuggestions();
        globalSearch.blur();

      }

    });

  }


  document.addEventListener("click", (event) => {

    if (!searchSuggestions || !globalSearch) {
      return;
    }

    const searchSection =
      globalSearch.closest(".home-search-section");

    if (
      searchSection &&
      !searchSection.contains(event.target)
    ) {
      closeSuggestions();
    }

  });


  const supportButtons =
    document.querySelectorAll(".support-button");


  supportButtons.forEach((button) => {

    button.addEventListener("click", () => {

      const alreadySupported =
        button.getAttribute("aria-pressed") === "true";

      const supported = !alreadySupported;

      const count =
        button.querySelector(".support-count");

      const icon =
        button.querySelector("svg");

      let currentCount =
        Number.parseInt(
          count ? count.textContent : "0",
          10
        );

      if (!Number.isFinite(currentCount)) {
        currentCount = 0;
      }

      const newCount = supported
        ? currentCount + 1
        : Math.max(0, currentCount - 1);

      button.setAttribute(
        "aria-pressed",
        String(supported)
      );

      button.classList.toggle(
        "supported",
        supported
      );

      if (count) {
        count.textContent = String(newCount);
      }

      if (icon) {

        icon.setAttribute(
          "fill",
          supported
            ? "currentColor"
            : "none"
        );

      }

    });

  });


  const sharePost = async (button) => {

    const postCard =
      button.closest(".post-card");

    if (!postCard) return;

    const title =
      postCard
        .querySelector(".post-title")
        ?.textContent
        .trim() ||
      "CIVA Public Problem";

    const postLink =
      postCard.querySelector(
        "a[href='post.html']"
      );

    const url =
      postLink?.href ||
      window.location.href;

    const shareData = {
      title: "CIVA",
      text: title,
      url
    };


    if (
      navigator.share &&
      typeof navigator.share === "function"
    ) {

      try {

        await navigator.share(shareData);
        return;

      } catch (error) {

        if (error?.name === "AbortError") {
          return;
        }

      }

    }


    try {

      await navigator.clipboard.writeText(url);

      const textElement =
        button.querySelector("span:last-child");

      const oldText =
        textElement
          ? textElement.textContent
          : "Share";

      if (textElement) {
        textElement.textContent = "Copied";
      }

      button.classList.add("copied");

      setTimeout(() => {

        if (textElement) {
          textElement.textContent = oldText;
        }

        button.classList.remove("copied");

      }, 1600);

    } catch {

      window.prompt(
        "Copy this CIVA link:",
        url
      );

    }

  };


  const shareButtons =
    document.querySelectorAll(".share-button");


  shareButtons.forEach((button) => {

    button.addEventListener("click", () => {
      sharePost(button);
    });

  });


  const refreshFeed = (button) => {

    if (!button) return;

    button.disabled = true;
    button.classList.add("is-refreshing");

    setTimeout(() => {

      button.disabled = false;
      button.classList.remove("is-refreshing");

    }, 700);

  };


  const latestRefreshButton =
    document.getElementById(
      "latestRefreshButton"
    );

  const trendingRefreshButton =
    document.getElementById(
      "trendingRefreshButton"
    );


  if (latestRefreshButton) {

    latestRefreshButton.addEventListener(
      "click",
      () => {
        refreshFeed(latestRefreshButton);
      }
    );

  }


  if (trendingRefreshButton) {

    trendingRefreshButton.addEventListener(
      "click",
      () => {
        refreshFeed(trendingRefreshButton);
      }
    );

  }


  let activePostMenu = null;


  const closeAllPostMenus = () => {

    document
      .querySelectorAll(".post-options-menu")
      .forEach((menu) => {
        menu.remove();
      });

    document
      .querySelectorAll(".post-menu-button")
      .forEach((button) => {

        button.setAttribute(
          "aria-expanded",
          "false"
        );

      });

    activePostMenu = null;

  };


  const copyPostLink = async (postCard, option) => {

    const link =
      postCard.querySelector("a[href]")?.href ||
      window.location.href;

    try {

      await navigator.clipboard.writeText(link);

      const text =
        option.querySelector("span");

      if (text) {
        text.textContent = "Copied";
      }

    } catch {

      window.prompt(
        "Copy this CIVA link:",
        link
      );

    }

  };


  const reportPost = (postCard, option) => {

    const text =
      option.querySelector("span");

    if (text) {
      text.textContent = "Reported";
    }

    window.dispatchEvent(
      new CustomEvent("civa:report", {
        detail: {
          post: postCard
        }
      })
    );

  };


  const createPostMenu = (button) => {

    const postCard =
      button.closest(".post-card");

    if (!postCard) return;

    closeAllPostMenus();

    const menu =
      document.createElement("div");

    menu.className = "post-options-menu";

    const shareOption =
      document.createElement("button");

    shareOption.type = "button";
    shareOption.className = "post-option";

    shareOption.innerHTML =
      "<span>Share</span>";


    const copyOption =
      document.createElement("button");

    copyOption.type = "button";
    copyOption.className = "post-option";

    copyOption.innerHTML =
      "<span>Copy link</span>";


    const reportOption =
      document.createElement("button");

    reportOption.type = "button";
    reportOption.className =
      "post-option report-option";

    reportOption.innerHTML =
      "<span>Report</span>";


    menu.appendChild(shareOption);
    menu.appendChild(copyOption);
    menu.appendChild(reportOption);

    postCard.appendChild(menu);

    button.setAttribute(
      "aria-expanded",
      "true"
    );

    activePostMenu = menu;


    shareOption.addEventListener(
      "click",
      () => {

        const shareButton =
          postCard.querySelector(
            ".share-button"
          );

        if (shareButton) {
          sharePost(shareButton);
        }

        setTimeout(
          closeAllPostMenus,
          300
        );

      }
    );


    copyOption.addEventListener(
      "click",
      async () => {

        await copyPostLink(
          postCard,
          copyOption
        );

        setTimeout(
          closeAllPostMenus,
          700
        );

      }
    );


    reportOption.addEventListener(
      "click",
      () => {

        reportPost(
          postCard,
          reportOption
        );

        setTimeout(
          closeAllPostMenus,
          900
        );

      }
    );

  };


  document
    .querySelectorAll(".post-menu-button")
    .forEach((button) => {

      button.setAttribute(
        "aria-expanded",
        "false"
      );

      button.addEventListener(
        "click",
        (event) => {

          event.stopPropagation();

          const postCard =
            button.closest(".post-card");

          const existingMenu =
            postCard?.querySelector(
              ".post-options-menu"
            );

          if (existingMenu) {

            closeAllPostMenus();
            return;

          }

          createPostMenu(button);

        }
      );

    });


  document.addEventListener(
    "click",
    (event) => {

      if (
        activePostMenu &&
        !activePostMenu.contains(event.target)
      ) {
        closeAllPostMenus();
      }

    }
  );


  showFeed("latest");

});
document.addEventListener("click", function(event) {

  const commentButton =
    event.target.closest(".post-action");

  if (!commentButton) return;


  const text =
    commentButton.textContent
      .trim()
      .toLowerCase();

  if (!text.includes("comment")) return;


  const post =
    commentButton.closest(".post-card");

  if (!post) return;


  event.preventDefault();
  event.stopPropagation();


  // Har post ki unique ID
  let postId =
    post.dataset.postId;


  // Agar post ke paas ID nahi hai,
  // to automatically ek ID bana do.
  if (!postId) {

    postId =
      post.dataset.id ||
      post.id ||
      `post-${Date.now()}`;

    post.dataset.postId =
      postId;

  }


  window.location.href =
    `comments.html?id=${encodeURIComponent(postId)}`;

});
