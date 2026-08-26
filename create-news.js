document.addEventListener("DOMContentLoaded", () => {

  const form =
    document.getElementById("createNewsForm");

  const titleInput =
    document.getElementById("newsTitle");

  const contentInput =
    document.getElementById("newsContent");

  const imageInput =
    document.getElementById("newsImage");

  const imagePreview =
    document.getElementById("newsImagePreview");


  /* =========================
     ACCOUNT CHECK
  ========================= */

  function isLoggedIn() {

    const possibleKeys = [
      "civaLoggedIn",
      "isLoggedIn",
      "civa-account",
      "civaAccount"
    ];

    for (const key of possibleKeys) {

      const value =
        localStorage.getItem(key);

      if (
        value === "true" ||
        value === "loggedIn" ||
        value === "1"
      ) {
        return true;
      }

      if (value) {

        try {

          const data =
            JSON.parse(value);

          if (
            data &&
            (
              data.loggedIn === true ||
              data.isLoggedIn === true
            )
          ) {
            return true;
          }

        } catch (error) {
          // Normal string value
        }

      }
    }

    return false;
  }


  /* =========================
     IMAGE PREVIEW
  ========================= */

  imageInput.addEventListener(
    "change",
    () => {

      const file =
        imageInput.files[ 0 ];

      if (!file) {

        imagePreview.src = "";
        imagePreview.style.display = "none";

        return;
      }


      if (!file.type.startsWith("image/")) {

        alert("Please select an image.");

        imageInput.value = "";

        return;
      }


      const reader =
        new FileReader();


      reader.onload = (event) => {

        imagePreview.src =
          event.target.result;

        imagePreview.style.display =
          "block";

      };


      reader.readAsDataURL(file);

    }
  );


  /* =========================
     PUBLISH NEWS
  ========================= */

  form.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();


      /*
       * Account required
       */

      if (!isLoggedIn()) {

        const createAccount =
          confirm(
            "You need a CIVA account to publish news.\n\nCreate or login to your account?"
          );


        if (createAccount) {

          window.location.href =
            "account.html";

        }

        return;
      }


      const title =
        titleInput.value.trim();

      const content =
        contentInput.value.trim();

      const imageFile =
        imageInput.files[ 0 ];


      if (!title || !content) {

        alert(
          "Please enter the news title and news content."
        );

        return;
      }


      /*
       * Create unique news ID
       */

      const newsId =
        "news-" +
        Date.now() +
        "-" +
        Math.random()
          .toString(36)
          .slice(2, 8);


      /*
       * Save image locally for frontend MVP
       */

      if (imageFile) {

        const reader =
          new FileReader();


        reader.onload = (event) => {

          saveNews(
            newsId,
            title,
            content,
            event.target.result
          );

        };


        reader.readAsDataURL(imageFile);

      } else {

        saveNews(
          newsId,
          title,
          content,
          ""
        );

      }

    }
  );


  /* =========================
     SAVE NEWS
  ========================= */

  function saveNews(
    newsId,
    title,
    content,
    image
  ) {

    const existingNews =
      JSON.parse(
        localStorage.getItem("civaNews")
      ) || [];


    const newNews = {

      id: newsId,

      title: title,

      content: content,

      image: image,

      author: "CIVA User",

      createdAt:
        new Date().toISOString()

    };


    existingNews.unshift(newNews);


    localStorage.setItem(
      "civaNews",
      JSON.stringify(existingNews)
    );


    alert(
      "Your news has been published successfully!"
    );


    window.location.href =
      "news.html";

  }

});