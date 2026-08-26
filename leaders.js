document.addEventListener("DOMContentLoaded", () => {

  const searchInput = document.getElementById("leaderSearch");
  const leaderList = document.getElementById("leaderList");
  const leaderEmpty = document.getElementById("leaderEmpty");
  const refreshButton = document.getElementById("leaderRefresh");

  const yourRank = document.getElementById("yourLeaderRank");
  const yourRankLink = document.getElementById("yourLeaderRankLink");
  const yourCommunityCount = document.getElementById("yourCommunityCount");

  const leaderCards = Array.from(
    document.querySelectorAll(".leader-card")
  );

  const getNumber = (value) => {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
  };


  const getStoredUser = () => {

    const possibleKeys = [
      "civaUser",
      "currentUser",
      "loggedInUser",
      "user",
      "account"
    ];

    for (const key of possibleKeys) {

      try {

        const stored = localStorage.getItem(key);

        if (!stored) {
          continue;
        }

        const parsed = JSON.parse(stored);

        if (parsed && typeof parsed === "object") {
          return parsed;
        }

      } catch (error) {

        continue;

      }

    }

    return null;

  };


  const isLoggedIn = () => {

    const user = getStoredUser();

    if (!user) {
      return false;
    }

    return Boolean(
      user.isLoggedIn !== false &&
      (
        user.loggedIn === true ||
        user.isLoggedIn === true ||
        user.email ||
        user.username ||
        user.name ||
        user.uid ||
        user.id
      )
    );

  };


  const getUserName = (user) => {

    if (!user) {
      return "";
    }

    return String(
      user.name ||
      user.fullName ||
      user.username ||
      user.displayName ||
      ""
    ).trim();

  };


  const getUserCommunities = (user) => {

    if (!user) {
      return 0;
    }

    const possibleValues = [
      user.communitiesJoined,
      user.communityCount,
      user.joinedCommunities,
      user.communities
    ];

    for (const value of possibleValues) {

      if (Array.isArray(value)) {
        return value.length;
      }

      if (
        typeof value === "number" &&
        Number.isFinite(value)
      ) {
        return value;
      }

    }

    return 0;

  };


  const getCardName = (card) => {

    return String(
      card.dataset.leaderName || ""
    ).trim().toLowerCase();

  };


  const getCardCommunities = (card) => {

    return getNumber(
      card.dataset.communities
    );

  };


  const sortCards = () => {

    leaderCards.sort((a, b) => {

      return (
        getCardCommunities(b) -
        getCardCommunities(a)
      );

    });

    leaderCards.forEach((card, index) => {

      const rank = card.querySelector(".leader-rank");

      if (rank) {
        rank.textContent = `#${index + 1}`;
      }

      card.dataset.rank = String(index + 1);

      leaderList.appendChild(card);

    });

  };


  const updateRanking = () => {

    if (!isLoggedIn()) {

      yourRank.textContent =
        "Sign In to see your ranking";

      yourCommunityCount.textContent =
        "Sign in to view your communities joined.";

      yourRankLink.href = "login.html";

      return;

    }


    const user = getStoredUser();

    const userName = getUserName(user);

    const communityCount =
      getUserCommunities(user);


    let userRank = null;


    if (userName) {

      const normalizedUserName =
        userName.toLowerCase();

      const matchingCard =
        leaderCards.find(card => {

          const cardName =
            getCardName(card);

          return (
            cardName === normalizedUserName
          );

        });


      if (matchingCard) {

        userRank =
          Number(matchingCard.dataset.rank);

      }

    }


    if (!userRank) {

      const allCommunityCounts =
        leaderCards.map(card =>
          getCardCommunities(card)
        );

      const higherCount =
        allCommunityCounts.filter(
          count =>
            count > communityCount
        ).length;

      userRank =
        higherCount + 1;

    }


    yourRank.textContent =
      `#${userRank} — ${userName || "You"}`;

    yourCommunityCount.textContent =
      `${communityCount.toLocaleString()} Communities Joined`;

    yourRankLink.href =
      "account.html";


    leaderCards.forEach(card => {

      card.classList.remove(
        "is-current-user"
      );

      const cardName =
        getCardName(card);

      if (
        userName &&
        cardName === userName.toLowerCase()
      ) {

        card.classList.add(
          "is-current-user"
        );

      }

    });

  };


  const searchLeaders = () => {

    const query =
      String(
        searchInput.value || ""
      )
        .trim()
        .toLowerCase();


    let visibleCount = 0;


    leaderCards.forEach(card => {

      const name =
        getCardName(card);

      const username =
        String(
          card.querySelector(
            ".leader-username"
          )?.textContent || ""
        )
          .toLowerCase();


      const matches =
        !query ||
        name.includes(query) ||
        username.includes(query);


      if (matches) {

        card.classList.remove(
          "is-hidden"
        );

        visibleCount++;

      } else {

        card.classList.add(
          "is-hidden"
        );

      }

    });


    leaderEmpty.hidden =
      visibleCount !== 0;

  };


  const refreshLeaderboard = () => {

    if (!refreshButton) {
      return;
    }


    refreshButton.classList.add(
      "is-loading"
    );

    refreshButton.disabled = true;


    setTimeout(() => {

      sortCards();

      searchLeaders();

      updateRanking();

      refreshButton.classList.remove(
        "is-loading"
      );

      refreshButton.disabled = false;

    }, 350);

  };


  if (searchInput) {

    searchInput.addEventListener(
      "input",
      searchLeaders
    );

  }


  if (refreshButton) {

    refreshButton.addEventListener(
      "click",
      refreshLeaderboard
    );

  }


  sortCards();

  searchLeaders();

  updateRanking();

});