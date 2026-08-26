"use strict";

document.addEventListener("DOMContentLoaded", () => {

  const content =
    document.getElementById(
      "communityContent"
    );

  const notFound =
    document.getElementById(
      "communityNotFound"
    );

  const communityImage =
    document.getElementById(
      "communityImage"
    );

  const communityCategory =
    document.getElementById(
      "communityCategory"
    );

  const communityName =
    document.getElementById(
      "communityName"
    );

  const communityDescription =
    document.getElementById(
      "communityDescription"
    );

  const communityLocation =
    document.getElementById(
      "communityLocation"
    );

  const communityMembers =
    document.getElementById(
      "communityMembers"
    );

  const communityPosts =
    document.getElementById(
      "communityPosts"
    );

  const communityAbout =
    document.getElementById(
      "communityAbout"
    );

  const communityRules =
    document.getElementById(
      "communityRules"
    );

  const communityLeaderImage =
    document.getElementById(
      "communityLeaderImage"
    );

  const communityLeaderName =
    document.getElementById(
      "communityLeaderName"
    );

  const communityPostCount =
    document.getElementById(
      "communityPostCount"
    );

  const communityPostsList =
    document.getElementById(
      "communityPostsList"
    );

  const joinButton =
    document.getElementById(
      "joinCommunityButton"
    );

  const shareButton =
    document.getElementById(
      "shareCommunityButton"
    );

  const reportButton =
    document.getElementById(
      "reportCommunityButton"
    );

  const actionMessage =
    document.getElementById(
      "communityActionMessage"
    );


  if (
    !content ||
    !notFound ||
    !communityName ||
    !communityPostsList
  ) {
    return;
  }


  function getCommunities() {

    try {

      const saved =
        localStorage.getItem(
          "civaCommunities"
        );

      const parsed =
        saved
          ? JSON.parse(saved)
          : [];

      return Array.isArray(parsed)
        ? parsed
        : [];

    } catch {

      return [];

    }

  }


  function saveCommunities(
    communities
  ) {

    try {

      localStorage.setItem(
        "civaCommunities",
        JSON.stringify(
          communities
        )
      );

      return true;

    } catch {

      return false;

    }

  }


  function getPosts() {

    const possibleKeys = [
      "civaPosts",
      "civaPostsData"
    ];


    for (
      const key of possibleKeys
    ) {

      try {

        const saved =
          localStorage.getItem(
            key
          );

        if (!saved) {
          continue;
        }


        const parsed =
          JSON.parse(saved);


        if (
          Array.isArray(parsed)
        ) {

          return parsed;

        }

      } catch {

        // Try the next supported key.

      }

    }


    return [];

  }


  function getCommunityId() {

    const params =
      new URLSearchParams(
        window.location.search
      );

    return String(
      params.get("id") || ""
    ).trim();

  }


  function getUser() {

    try {

      const saved =
        localStorage.getItem(
          "civaUserProfile"
        );

      return saved
        ? JSON.parse(saved)
        : null;

    } catch {

      return null;

    }

  }


  function getUserId() {

    const user =
      getUser();


    if (!user) {
      return "";
    }


    return String(
      user.id ||
      user.uid ||
      user.email ||
      ""
    )
      .trim()
      .toLowerCase();

  }


  function isLoggedIn() {

    return (
      localStorage.getItem(
        "civaLoggedIn"
      ) === "true"
    );

  }


  function safeText(
    value,
    fallback = ""
  ) {

    const text =
      String(
        value ?? ""
      ).trim();

    return text || fallback;

  }


  function formatCategory(
    value
  ) {

    const categories = {

      roads:
        "Roads & Traffic",

      water:
        "Water & Drainage",

      electricity:
        "Electricity",

      education:
        "Education",

      environment:
        "Environment",

      transport:
        "Transport",

      "public-facilities":
        "Public Facilities",

      other:
        "Other"

    };


    return (
      categories[ value ] ||
      safeText(
        value,
        "Community"
      )
    );

  }


  function formatDate(
    value
  ) {

    const date =
      new Date(value);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return "";

    }


    return date.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric"
      }
    );

  }


  function showNotFound() {

    content.hidden = true;
    notFound.hidden = false;

  }


  function showContent() {

    notFound.hidden = true;
    content.hidden = false;

  }


  function updateCommunityImage(
    community
  ) {

    const image =
      safeText(
        community.image,
        "community-placeholder.jpg"
      );


    communityImage.src =
      image;


    communityImage.onerror =
      () => {

        communityImage.onerror =
          null;

        communityImage.src =
          "community-placeholder.jpg";

      };

  }


  function updateLeader(
    community
  ) {

    const image =
      safeText(
        community.creatorImage,
        "profile-placeholder.jpg"
      );


    communityLeaderImage.src =
      image;


    communityLeaderImage.onerror =
      () => {

        communityLeaderImage.onerror =
          null;

        communityLeaderImage.src =
          "profile-placeholder.jpg";

      };


    communityLeaderName.textContent =
      safeText(
        community.creatorName,
        "CIVA Leader"
      );

  }


  function updateMembers(
    community
  ) {

    const members =
      Number(
        community.members
      );


    const safeMembers =
      Number.isFinite(
        members
      ) &&
        members >= 0
        ? Math.floor(members)
        : 0;


    communityMembers.textContent =
      `${safeMembers} ${safeMembers === 1
        ? "member"
        : "members"
      }`;

  }


  function getCommunityPosts(
    community
  ) {

    const posts =
      getPosts();


    return posts.filter(
      post => {

        const postCommunityId =
          String(
            post.communityId ||
            post.community ||
            ""
          ).trim();


        return (
          postCommunityId ===
          String(
            community.id
          ).trim()
        );

      }
    );

  }


  function renderPosts(
    posts
  ) {

    communityPostCount.textContent =
      String(
        posts.length
      );


    communityPosts.textContent =
      `${posts.length} ${posts.length === 1
        ? "post"
        : "posts"
      }`;


    if (!posts.length) {

      communityPostsList.innerHTML = `
                <div class="empty-community-posts">

                    <img
                        src="post-placeholder.jpg"
                        alt=""
                        class="empty-post-image">

                    <h3>
                        No posts yet
                    </h3>

                    <p>
                        This community does not have
                        any posts yet.
                    </p>

                </div>
            `;

      return;

    }


    const fragment =
      document.createDocumentFragment();


    posts.forEach(
      post => {

        const article =
          document.createElement(
            "article"
          );

        article.className =
          "community-post";


        const title =
          document.createElement(
            "h3"
          );

        title.textContent =
          safeText(
            post.title ||
            post.heading,
            "Community Post"
          );


        const text =
          document.createElement(
            "p"
          );

        text.textContent =
          safeText(
            post.content ||
            post.description ||
            post.text,
            "No post description available."
          );


        const meta =
          document.createElement(
            "div"
          );

        meta.className =
          "community-post-meta";


        const author =
          safeText(
            post.authorName ||
            post.creatorName,
            "CIVA User"
          );


        const date =
          formatDate(
            post.createdAt ||
            post.date
          );


        meta.textContent =
          date
            ? `${author} • ${date}`
            : author;


        article.appendChild(
          title
        );

        article.appendChild(
          text
        );

        article.appendChild(
          meta
        );


        fragment.appendChild(
          article
        );

      }
    );


    communityPostsList.innerHTML =
      "";

    communityPostsList.appendChild(
      fragment
    );

  }


  function updateJoinButton(
    community
  ) {

    if (!joinButton) {
      return;
    }


    const userId =
      getUserId();


    const members =
      Array.isArray(
        community.memberIds
      )
        ? community.memberIds
        : [];


    const joined =
      userId &&
      members.includes(
        userId
      );


    joinButton.textContent =
      joined
        ? "Joined"
        : "Join Community";

  }


  function loadCommunity(
    community
  ) {

    communityName.textContent =
      safeText(
        community.name,
        "Community"
      );


    communityCategory.textContent =
      formatCategory(
        community.category
      );


    communityDescription.textContent =
      safeText(
        community.description,
        "No description available."
      );


    communityAbout.textContent =
      safeText(
        community.description,
        "No additional information available."
      );


    communityRules.textContent =
      safeText(
        community.rules,
        "No community rules have been added yet."
      );


    const location =
      safeText(
        community.location
      );


    communityLocation.textContent =
      location
        ? `📍 ${location}`
        : "Location not specified";


    updateCommunityImage(
      community
    );


    updateLeader(
      community
    );


    updateMembers(
      community
    );


    const posts =
      getCommunityPosts(
        community
      );


    renderPosts(
      posts
    );


    updateJoinButton(
      community
    );


    showContent();

  }


  function joinCommunity(
    community
  ) {

    if (!isLoggedIn()) {

      actionMessage.textContent =
        "Please sign in to join this community.";

      window.setTimeout(
        () => {

          window.location.href =
            "login.html";

        },
        700
      );

      return;

    }


    const userId =
      getUserId();


    if (!userId) {

      actionMessage.textContent =
        "Your account information is incomplete.";

      return;

    }


    if (
      !Array.isArray(
        community.memberIds
      )
    ) {

      community.memberIds =
        [];

    }


    const index =
      community.memberIds.indexOf(
        userId
      );


    if (index !== -1) {

      community.memberIds.splice(
        index,
        1
      );


      community.members =
        Math.max(
          0,
          Number(
            community.members || 0
          ) - 1
        );


      actionMessage.textContent =
        "You left the community.";

    } else {

      community.memberIds.push(
        userId
      );


      community.members =
        Math.max(
          1,
          Number(
            community.members || 0
          ) + 1
        );


      actionMessage.textContent =
        "You joined the community.";

    }


    const communities =
      getCommunities();


    const communityIndex =
      communities.findIndex(
        item =>
          String(
            item.id
          ) ===
          String(
            community.id
          )
      );


    if (
      communityIndex === -1
    ) {

      return;

    }


    communities[
      communityIndex
    ] = community;


    if (
      saveCommunities(
        communities
      )
    ) {

      updateMembers(
        community
      );

      updateJoinButton(
        community
      );

    } else {

      actionMessage.textContent =
        "Could not save this change on this device.";

    }

  }


  async function shareCommunity(
    community
  ) {

    const shareUrl =
      window.location.href;


    if (
      navigator.share
    ) {

      try {

        await navigator.share({

          title:
            safeText(
              community.name,
              "CIVA Community"
            ),

          text:
            safeText(
              community.description,
              "View this CIVA community."
            ),

          url:
            shareUrl

        });


        return;

      } catch {

        // User cancelled or sharing is unavailable.

      }

    }


    try {

      await navigator.clipboard.writeText(
        shareUrl
      );


      actionMessage.textContent =
        "Community link copied.";

    } catch {

      actionMessage.textContent =
        "Sharing is not available on this device.";

    }

  }


  function reportCommunity() {

    if (!isLoggedIn()) {

      actionMessage.textContent =
        "Please sign in to report a community.";

      return;

    }


    const confirmed =
      window.confirm(
        "Report this community for violating CIVA rules?"
      );


    if (!confirmed) {
      return;
    }


    try {

      const reports =
        JSON.parse(
          localStorage.getItem(
            "civaCommunityReports"
          ) || "[]"
        );


      const list =
        Array.isArray(
          reports
        )
          ? reports
          : [];


      list.push({

        communityId:
          communityId,

        reporterId:
          getUserId(),

        createdAt:
          new Date().toISOString()

      });


      localStorage.setItem(
        "civaCommunityReports",
        JSON.stringify(
          list
        )
      );


      actionMessage.textContent =
        "Report saved. Review will be connected to the backend.";

    } catch {

      actionMessage.textContent =
        "Could not save the report on this device.";

    }

  }


  const communityId =
    getCommunityId();


  if (!communityId) {

    showNotFound();

    return;

  }


  const communities =
    getCommunities();


  const community =
    communities.find(
      item =>
        String(
          item.id
        ).trim() ===
        communityId
    );


  if (!community) {

    showNotFound();

    return;

  }


  loadCommunity(
    community
  );


  if (joinButton) {

    joinButton.addEventListener(
      "click",
      () => {

        joinCommunity(
          community
        );

      }
    );

  }


  if (shareButton) {

    shareButton.addEventListener(
      "click",
      () => {

        shareCommunity(
          community
        );

      }
    );

  }


  if (reportButton) {

    reportButton.addEventListener(
      "click",
      reportCommunity
    );

  }

});