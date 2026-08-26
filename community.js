document.addEventListener("DOMContentLoaded", () => {

  const STORAGE_KEY = "civa-joined-communities";
  const MEMBERS_KEY = "civa-community-members";


  /*
   * =========================
   * COMMUNITY DATA
   * =========================
   */

  const communities = [

    {
      id: "community-local-civic-001",
      name: "Local Civic Issues",
      category: "local",
      description: "Public problems in local areas.",
      image: "profile-placeholder.jpg",
      members: 128
    },

    {
      id: "community-clean-environment-002",
      name: "Clean Environment",
      category: "environment",
      description: "Discuss pollution and environmental issues.",
      image: "profile-placeholder.jpg",
      members: 94
    },

    {
      id: "community-education-003",
      name: "Education Improvement",
      category: "education",
      description: "Share ideas about education and schools.",
      image: "profile-placeholder.jpg",
      members: 76
    },

    {
      id: "community-public-safety-004",
      name: "Public Safety",
      category: "public",
      description: "Discuss public safety concerns and useful solutions.",
      image: "profile-placeholder.jpg",
      members: 63
    },

    {
      id: "community-road-transport-005",
      name: "Road & Transport",
      category: "local",
      description: "Share problems related to roads and transportation.",
      image: "profile-placeholder.jpg",
      members: 51
    },

    {
      id: "community-clean-water-006",
      name: "Clean Water",
      category: "environment",
      description: "Discuss water quality, availability and local concerns.",
      image: "profile-placeholder.jpg",
      members: 47
    },

    {
      id: "community-student-voice-007",
      name: "Student Voice",
      category: "education",
      description: "A place for students to discuss useful public ideas.",
      image: "profile-placeholder.jpg",
      members: 39
    }

  ];


  /*
   * =========================
   * ELEMENTS
   * =========================
   */

  const searchInput =
    document.getElementById("communitySearch");

  const filters =
    document.querySelectorAll(".community-filter");

  const globalGrid =
    document.getElementById("communityGrid");

  const yourGrid =
    document.getElementById("yourCommunityGrid");

  const yourSection =
    document.getElementById("yourCommunitiesSection");

  const yourEmpty =
    document.getElementById("yourCommunityEmpty");

  const globalEmpty =
    document.getElementById("globalCommunityEmpty");

  const yourCount =
    document.getElementById("yourCommunityCount");

  const globalCount =
    document.getElementById("globalCommunityCount");


  const detailOverlay =
    document.getElementById("communityDetailOverlay");

  const detailClose =
    document.getElementById("communityDetailClose");

  const detailImage =
    document.getElementById("communityDetailImage");

  const detailTitle =
    document.getElementById("communityDetailTitle");

  const detailDescription =
    document.getElementById("communityDetailDescription");

  const detailCategory =
    document.getElementById("communityDetailCategory");

  const detailMembers =
    document.getElementById("communityDetailMembers");

  const detailStatus =
    document.getElementById("communityDetailStatus");

  const detailJoin =
    document.getElementById("communityDetailJoin");


  /*
   * =========================
   * STORAGE
   * =========================
   */

  let joinedCommunities =
    JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );

  let savedMembers =
    JSON.parse(
      localStorage.getItem(MEMBERS_KEY) || "{}"
    );


  /*
   * =========================
   * CURRENT STATE
   * =========================
   */

  let activeCategory = "all";
  let currentCommunityId = null;


  /*
   * =========================
   * HELPERS
   * =========================
   */

  function isJoined(id) {

    return joinedCommunities.includes(id);

  }


  function getMembers(community) {

    if (
      Object.prototype.hasOwnProperty.call(
        savedMembers,
        community.id
      )
    ) {

      return savedMembers[ community.id ];

    }

    return community.members;

  }


  function saveState() {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(joinedCommunities)
    );

    localStorage.setItem(
      MEMBERS_KEY,
      JSON.stringify(savedMembers)
    );

  }


  function formatMembers(number) {

    return `${number} ${number === 1 ? "member" : "members"}`;

  }


  /*
   * =========================
   * COMMUNITY CARD
   * =========================
   */

  function createCommunityCard(community) {

    const article =
      document.createElement("article");

    article.className =
      "community-card";

    article.dataset.communityId =
      community.id;

    article.dataset.category =
      community.category;

    article.dataset.name =
      community.name.toLowerCase();


    const joined =
      isJoined(community.id);

    const members =
      getMembers(community);


    article.innerHTML = `

            <div class="community-card-top">

                <img
                    src="${community.image}"
                    alt="${escapeHTML(community.name)}"
                    class="community-image"
                    width="52"
                    height="52">

                <div class="community-card-info">

                    <h3>
                        ${escapeHTML(community.name)}
                    </h3>

                    <p>
                        ${escapeHTML(community.description)}
                    </p>

                </div>

            </div>


            <div class="community-card-bottom">

                <span class="community-members">

                    ${formatMembers(members)}

                </span>


                <button
                    class="community-join-button ${joined ? "joined" : ""}"
                    type="button"
                    data-community-id="${community.id}">

                    ${joined ? "Joined" : "Join"}

                </button>

            </div>

        `;


    /*
     * Card click = details
     */

    article.addEventListener(
      "click",
      (event) => {

        if (
          event.target.closest(
            ".community-join-button"
          )
        ) {

          return;

        }

        openDetails(
          community.id
        );

      }
    );


    /*
     * Join click
     */

    const joinButton =
      article.querySelector(
        ".community-join-button"
      );


    joinButton.addEventListener(
      "click",
      (event) => {

        event.preventDefault();
        event.stopPropagation();

        joinCommunity(
          community.id
        );

      }
    );


    return article;

  }


  /*
   * =========================
   * RENDER GLOBAL
   * =========================
   */

  function renderGlobalCommunities() {

    if (!globalGrid) return;


    globalGrid.innerHTML = "";


    const query =
      searchInput
        ? searchInput.value
          .trim()
          .toLowerCase()
        : "";


    const filtered =
      communities.filter(
        (community) => {

          const categoryMatch =
            activeCategory === "all" ||
            community.category === activeCategory;


          const searchMatch =
            !query ||
            community.name
              .toLowerCase()
              .includes(query) ||
            community.description
              .toLowerCase()
              .includes(query);


          return (
            categoryMatch &&
            searchMatch
          );

        }
      );


    filtered.forEach(
      (community) => {

        globalGrid.appendChild(
          createCommunityCard(
            community
          )
        );

      }
    );


    if (globalCount) {

      globalCount.textContent =
        filtered.length;

    }


    if (globalEmpty) {

      globalEmpty.hidden =
        filtered.length !== 0;

    }

  }


  /*
   * =========================
   * RENDER YOUR COMMUNITIES
   * =========================
   */

  function renderYourCommunities() {

    if (!yourGrid || !yourSection) {
      return;
    }


    yourGrid.innerHTML = "";


    const joined =
      communities.filter(
        (community) =>
          isJoined(community.id)
      );


    /*
     * No joined community
     */

    if (joined.length === 0) {

      yourSection.hidden = true;

      if (yourEmpty) {
        yourEmpty.hidden = false;
      }

      if (yourCount) {
        yourCount.textContent = "0";
      }

      return;

    }


    /*
     * Show Your Communities
     */

    yourSection.hidden = false;


    if (yourEmpty) {
      yourEmpty.hidden = true;
    }


    joined.forEach(
      (community) => {

        yourGrid.appendChild(
          createCommunityCard(
            community
          )
        );

      }
    );


    if (yourCount) {

      yourCount.textContent =
        joined.length;

    }

  }


  /*
   * =========================
   * JOIN COMMUNITY
   * =========================
   */

  function joinCommunity(id) {

    const community =
      communities.find(
        (item) =>
          item.id === id
      );


    if (!community) return;


    /*
     * Already joined
     */

    if (isJoined(id)) {

      return;

    }


    /*
     * Add joined ID
     */

    joinedCommunities.push(id);


    /*
     * Increase member count
     */

    savedMembers[ id ] =
      getMembers(community) + 1;


    saveState();


    /*
     * Update everything
     */

    renderGlobalCommunities();

    renderYourCommunities();


    /*
     * If detail is open,
     * update it too.
     */

    if (
      currentCommunityId === id
    ) {

      updateDetail(
        community
      );

    }

  }


  /*
   * =========================
   * DETAILS
   * =========================
   */

  function openDetails(id) {

    const community =
      communities.find(
        (item) =>
          item.id === id
      );


    if (!community || !detailOverlay) {
      return;
    }


    currentCommunityId =
      community.id;


    updateDetail(
      community
    );


    detailOverlay.hidden =
      false;


    document.body.style.overflow =
      "hidden";

  }


  function updateDetail(community) {

    const joined =
      isJoined(community.id);


    if (detailImage) {

      detailImage.src =
        community.image;

      detailImage.alt =
        community.name;

    }


    if (detailTitle) {

      detailTitle.textContent =
        community.name;

    }


    if (detailDescription) {

      detailDescription.textContent =
        community.description;

    }


    if (detailCategory) {

      detailCategory.textContent =
        getCategoryName(
          community.category
        );

    }


    if (detailMembers) {

      detailMembers.textContent =
        getMembers(community);

    }


    if (detailStatus) {

      detailStatus.textContent =
        joined
          ? "Joined"
          : "Not joined";

    }


    if (detailJoin) {

      detailJoin.textContent =
        joined
          ? "Joined"
          : "Join";

      detailJoin.classList.toggle(
        "joined",
        joined
      );

      detailJoin.dataset.communityId =
        community.id;

    }

  }


  function closeDetails() {

    if (!detailOverlay) return;


    detailOverlay.hidden =
      true;


    currentCommunityId =
      null;


    document.body.style.overflow =
      "";

  }


  /*
   * =========================
   * DETAIL JOIN BUTTON
   * =========================
   */

  if (detailJoin) {

    detailJoin.addEventListener(
      "click",
      (event) => {

        event.preventDefault();
        event.stopPropagation();


        const id =
          detailJoin.dataset.communityId;


        if (!id) return;


        joinCommunity(id);

      }
    );

  }


  /*
   * =========================
   * CLOSE DETAILS
   * =========================
   */

  if (detailClose) {

    detailClose.addEventListener(
      "click",
      closeDetails
    );

  }


  if (detailOverlay) {

    detailOverlay.addEventListener(
      "click",
      (event) => {

        if (
          event.target ===
          detailOverlay
        ) {

          closeDetails();

        }

      }
    );

  }


  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Escape" &&
        detailOverlay &&
        !detailOverlay.hidden
      ) {

        closeDetails();

      }

    }
  );


  /*
   * =========================
   * SEARCH
   * =========================
   */

  if (searchInput) {

    searchInput.addEventListener(
      "input",
      renderGlobalCommunities
    );

  }


  /*
   * =========================
   * CATEGORY FILTER
   * =========================
   */

  filters.forEach(
    (filter) => {

      filter.addEventListener(
        "click",
        () => {

          filters.forEach(
            (item) => {

              item.classList.remove(
                "active"
              );

            }
          );


          filter.classList.add(
            "active"
          );


          activeCategory =
            filter.dataset.category ||
            "all";


          renderGlobalCommunities();

        }
      );

    }
  );


  /*
   * =========================
   * ESCAPE HTML
   * =========================
   */

  function escapeHTML(value) {

    return String(value)
      .replace(
        /&/g,
        "&amp;"
      )
      .replace(
        /</g,
        "&lt;"
      )
      .replace(
        />/g,
        "&gt;"
      )
      .replace(
        /"/g,
        "&quot;"
      )
      .replace(
        /'/g,
        "&#039;"
      );

  }


  /*
   * =========================
   * CATEGORY NAME
   * =========================
   */

  function getCategoryName(
    category
  ) {

    const names = {

      local: "LOCAL",

      environment: "ENVIRONMENT",

      education: "EDUCATION",

      public: "PUBLIC ISSUES"

    };


    return (
      names[ category ] ||
      "COMMUNITY"
    );

  }


  /*
   * =========================
   * INITIAL RENDER
   * =========================
   */

  renderGlobalCommunities();

  renderYourCommunities();

});