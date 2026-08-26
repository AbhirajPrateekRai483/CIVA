"use strict";

document.addEventListener("DOMContentLoaded", () => {

  const profilePage =
    document.getElementById("profilePage");

  const profileAvatar =
    document.getElementById("profileAvatar");

  const profileEmail =
    document.getElementById("profileEmail");

  const profileTitle =
    document.getElementById("profileTitle");

  const profileName =
    document.getElementById("profileName");

  const profileEmailDetail =
    document.getElementById("profileEmailDetail");

  const profileDob =
    document.getElementById("profileDob");

  const profileJoined =
    document.getElementById("profileJoined");

  const changePhotoButton =
    document.getElementById("changePhotoButton");

  const profilePhotoInput =
    document.getElementById("profilePhotoInput");

  const editProfileButton =
    document.getElementById("editProfileButton");

  const editDetailsButton =
    document.getElementById("editDetailsButton");

  const signOutButton =
    document.getElementById("signOutButton");

  const profileMessage =
    document.getElementById("profileMessage");


  const postCount =
    document.getElementById("postCount");

  const supportCount =
    document.getElementById("supportCount");

  const communityCount =
    document.getElementById("communityCount");

  const joinCount =
    document.getElementById("joinCount");


  const defaultProfileImage =
    "default-profile.png";


  function showMessage(message, type) {

    if (!profileMessage) {
      return;
    }

    profileMessage.textContent = message;

    profileMessage.className =
      `profile-message show ${type}`;

  }


  function hideMessage() {

    if (!profileMessage) {
      return;
    }

    profileMessage.textContent = "";

    profileMessage.className =
      "profile-message";

  }


  function getUser() {

    try {

      const savedUser =
        localStorage.getItem(
          "civaUserProfile"
        );

      if (!savedUser) {
        return null;
      }

      return JSON.parse(savedUser);

    } catch (error) {

      return null;

    }

  }


  function isLoggedIn() {

    return (
      localStorage.getItem(
        "civaLoggedIn"
      ) === "true"
    );

  }


  function redirectToLogin() {

    window.location.href =
      "login.html";

  }


  function formatDate(dateString) {

    if (!dateString) {
      return "—";
    }

    const date =
      new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );

  }


  function loadProfile() {

    if (!isLoggedIn()) {

      redirectToLogin();
      return;

    }


    const user = getUser();

    if (!user) {

      localStorage.removeItem(
        "civaLoggedIn"
      );

      redirectToLogin();
      return;

    }


    const name =
      typeof user.fullName === "string"
        ? user.fullName.trim()
        : "";

    const email =
      typeof user.email === "string"
        ? user.email.trim()
        : "";

    const dob =
      typeof user.dateOfBirth === "string"
        ? user.dateOfBirth.trim()
        : "";


    if (profileTitle) {

      profileTitle.textContent =
        name || "Your Profile";

    }


    if (profileName) {

      profileName.textContent =
        name || "—";

    }


    if (profileEmail) {

      profileEmail.textContent =
        email || "—";

    }


    if (profileEmailDetail) {

      profileEmailDetail.textContent =
        email || "—";

    }


    if (profileDob) {

      profileDob.textContent =
        dob || "—";

    }


    if (profileJoined) {

      profileJoined.textContent =
        formatDate(
          user.createdAt
        );

    }


    if (profileAvatar) {

      profileAvatar.src =
        user.profileImage ||
        defaultProfileImage;

    }


    loadActivity();

  }


  function loadActivity() {

    let activity = {
      posts: 0,
      supports: 0,
      communities: 0,
      joins: 0
    };


    try {

      const savedActivity =
        localStorage.getItem(
          "civaUserActivity"
        );

      if (savedActivity) {

        const parsed =
          JSON.parse(
            savedActivity
          );

        activity = {
          ...activity,
          ...parsed
        };

      }

    } catch (error) {

      activity = {
        posts: 0,
        supports: 0,
        communities: 0,
        joins: 0
      };

    }


    if (postCount) {

      postCount.textContent =
        Number(activity.posts) || 0;

    }


    if (supportCount) {

      supportCount.textContent =
        Number(activity.supports) || 0;

    }


    if (communityCount) {

      communityCount.textContent =
        Number(activity.communities) || 0;

    }


    if (joinCount) {

      joinCount.textContent =
        Number(activity.joins) || 0;

    }

  }


  if (changePhotoButton && profilePhotoInput) {

    changePhotoButton.addEventListener(
      "click",
      () => {

        profilePhotoInput.click();

      }
    );


    profilePhotoInput.addEventListener(
      "change",
      () => {

        const file =
          profilePhotoInput.files?.[ 0 ];

        if (!file) {
          return;
        }


        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/webp"
        ];


        if (
          !allowedTypes.includes(
            file.type
          )
        ) {

          profilePhotoInput.value = "";

          showMessage(
            "Please choose a JPG, PNG or WebP image.",
            "error"
          );

          return;

        }


        if (
          file.size >
          2 * 1024 * 1024
        ) {

          profilePhotoInput.value = "";

          showMessage(
            "Profile image must be 2 MB or smaller.",
            "error"
          );

          return;

        }


        const reader =
          new FileReader();


        reader.onload = () => {

          try {

            const user =
              getUser();

            if (!user) {
              redirectToLogin();
              return;
            }


            user.profileImage =
              reader.result;


            localStorage.setItem(
              "civaUserProfile",
              JSON.stringify(user)
            );


            if (profileAvatar) {

              profileAvatar.src =
                reader.result;

            }


            showMessage(
              "Profile photo updated.",
              "success"
            );

          } catch (error) {

            showMessage(
              "The photo could not be saved on this device.",
              "error"
            );

          }

        };


        reader.readAsDataURL(file);

      }
    );

  }


  const contentTabs =
    document.querySelectorAll(
      ".content-tab"
    );

  const contentPanels =
    document.querySelectorAll(
      ".content-panel"
    );


  contentTabs.forEach(tab => {

    tab.addEventListener(
      "click",
      () => {

        const target =
          tab.dataset.content;


        contentTabs.forEach(item => {

          item.classList.remove(
            "active"
          );

        });


        contentPanels.forEach(panel => {

          panel.classList.remove(
            "active"
          );

        });


        tab.classList.add(
          "active"
        );


        const targetPanel =
          document.querySelector(
            `[data-panel="${target}"]`
          );


        if (targetPanel) {

          targetPanel.classList.add(
            "active"
          );

        }

      }
    );

  });


  function editProfile() {

    showMessage(
      "Profile editing will be connected here.",
      "success"
    );

  }


  if (editProfileButton) {

    editProfileButton.addEventListener(
      "click",
      editProfile
    );

  }


  if (editDetailsButton) {

    editDetailsButton.addEventListener(
      "click",
      editProfile
    );

  }


  if (signOutButton) {

    signOutButton.addEventListener(
      "click",
      () => {

        const confirmed =
          window.confirm(
            "Are you sure you want to sign out?"
          );


        if (!confirmed) {
          return;
        }


        localStorage.removeItem(
          "civaLoggedIn"
        );


        window.location.href =
          "login.html";

      }
    );

  }


  loadProfile();

});