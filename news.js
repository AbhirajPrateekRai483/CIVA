document.addEventListener("DOMContentLoaded", () => {

  const searchInput = document.getElementById("newsSearch");
  const filters = document.querySelectorAll(".news-filter");
  const cards = document.querySelectorAll(".news-card");
  const emptyMessage = document.getElementById("newsEmpty");
  const refreshButton = document.getElementById("newsRefresh");


  let currentCategory = "all";


  function filterNews() {

    const searchText = searchInput
      ? searchInput.value.trim().toLowerCase()
      : "";

    let visibleCount = 0;


    cards.forEach(card => {

      const category =
        (card.dataset.category || "").toLowerCase();

      const searchData =
        (card.dataset.search || "").toLowerCase();

      const title =
        card.querySelector("h3")?.textContent.toLowerCase() || "";

      const text =
        card.querySelector(".news-card-text")?.textContent.toLowerCase() || "";


      const categoryMatch =
        currentCategory === "all" ||
        category === currentCategory;


      const searchMatch =
        !searchText ||
        searchData.includes(searchText) ||
        title.includes(searchText) ||
        text.includes(searchText);


      if (categoryMatch && searchMatch) {

        card.hidden = false;
        visibleCount++;

      } else {

        card.hidden = true;

      }

    });


    if (emptyMessage) {

      emptyMessage.hidden = visibleCount !== 0;

    }

  }


  filters.forEach(filter => {

    filter.addEventListener("click", () => {

      currentCategory =
        filter.dataset.category || "all";


      filters.forEach(item => {

        item.classList.remove("active");

      });


      filter.classList.add("active");

      filterNews();

    });

  });


  if (searchInput) {

    searchInput.addEventListener("input", () => {

      filterNews();

    });

  }


  if (refreshButton) {

    refreshButton.addEventListener("click", () => {

      refreshButton.classList.add("is-loading");

      setTimeout(() => {

        filterNews();

        refreshButton.classList.remove("is-loading");

      }, 500);

    });

  }


  cards.forEach(card => {

    const link =
      card.querySelector(".news-card-link");

    if (!link) return;


    link.addEventListener("click", event => {

      const href =
        link.getAttribute("href");


      if (!href || href === "#") {

        event.preventDefault();

      }

    });

  });


  filterNews();

});
const publishNewsBtn =
  document.getElementById("publishNewsBtn");

if (publishNewsBtn) {

  publishNewsBtn.addEventListener(
    "click",
    function() {

      window.location.href =
        "create-news.html";

    }
  );

}