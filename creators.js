document.addEventListener("DOMContentLoaded", () => {

  const searchInput = document.getElementById("creatorSearch");
  const creatorList = document.getElementById("creatorList");
  const creatorEmpty = document.getElementById("creatorEmpty");
  const refreshButton = document.getElementById("creatorRefresh");

  const yourRank = document.getElementById("yourRank");
  const yourSupportCount = document.getElementById("yourSupportCount");

  if (!creatorList) return;


  const creatorCards = Array.from(
    creatorList.querySelectorAll(".creator-card")
  );


  function getSupport(card) {

    const support = Number(
      card.dataset.support || 0
    );

    return Number.isFinite(support)
      ? support
      : 0;
  }


  function getName(card) {

    return (
      card.dataset.creatorName ||
      card.querySelector("h3")?.textContent ||
      ""
    ).trim();

  }


  function sortCreators() {

    creatorCards.sort((a, b) => {

      return getSupport(b) - getSupport(a);

    });


    creatorCards.forEach((card, index) => {

      const rankElement =
        card.querySelector(".creator-rank");

      if (rankElement) {
        rankElement.textContent =
          `#${index + 1}`;
      }

      creatorList.appendChild(card);

    });

  }


  function formatNumber(number) {

    return new Intl.NumberFormat("en-IN").format(number);

  }


  function filterCreators() {

    const query =
      searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";

    let visibleCount = 0;


    creatorCards.forEach(card => {

      const name =
        getName(card).toLowerCase();

      const username =
        (
          card.querySelector(".creator-username")
            ?.textContent || ""
        ).toLowerCase();


      const matches =
        !query ||
        name.includes(query) ||
        username.includes(query);


      card.hidden = !matches;


      if (matches) {
        visibleCount++;
      }

    });


    if (creatorEmpty) {

      creatorEmpty.hidden =
        visibleCount !== 0;

    }

  }


  function updateYourRanking() {

    const loggedIn =
      localStorage.getItem("civaLoggedIn") === "true";

    const currentUserId =
      localStorage.getItem("civaUserId");


    if (!loggedIn || !currentUserId) {

      if (yourRank) {
        yourRank.textContent =
          "Sign in to see your ranking";
      }

      if (yourSupportCount) {
        yourSupportCount.textContent =
          "Your total support will appear here.";
      }

      return;

    }


    const sortedCreators =
      [ ...creatorCards ].sort(
        (a, b) =>
          getSupport(b) - getSupport(a)
      );


    const userIndex =
      sortedCreators.findIndex(card => {

        return (
          card.dataset.creatorId ===
          currentUserId
        );

      });


    if (userIndex === -1) {

      if (yourRank) {
        yourRank.textContent =
          "Your ranking is not available yet";
      }

      if (yourSupportCount) {
        yourSupportCount.textContent =
          "Your creator profile will appear here once eligible.";
      }

      return;

    }


    const userCard =
      sortedCreators[ userIndex ];

    const rank =
      userIndex + 1;

    const support =
      getSupport(userCard);


    if (yourRank) {

      yourRank.textContent =
        `#${rank}`;

    }


    if (yourSupportCount) {

      yourSupportCount.textContent =
        `${formatNumber(support)} Supports`;

    }

  }


  function refreshCreators() {

    if (!refreshButton) return;


    refreshButton.classList.add("is-loading");

    refreshButton.disabled = true;


    setTimeout(() => {

      sortCreators();
      filterCreators();
      updateYourRanking();


      refreshButton.classList.remove(
        "is-loading"
      );

      refreshButton.disabled = false;

    }, 350);

  }


  if (searchInput) {

    searchInput.addEventListener(
      "input",
      filterCreators
    );

  }


  if (refreshButton) {

    refreshButton.addEventListener(
      "click",
      refreshCreators
    );

  }


  sortCreators();
  filterCreators();
  updateYourRanking();

});