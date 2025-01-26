$(document).ready(function () {
  // Fetch data from the API for sections and display them in their respective carousels.
  const quotesURL = "https://smileschool-api.hbtn.info/quotes";
  fetchData(quotesURL, displayQuotes);

  const popularTutorialsURL = "https://smileschool-api.hbtn.info/popular-tutorials";
  fetchData(popularTutorialsURL, displayCustomCarousel);

  // Show or hide the loader.
  function toggleLoader(show) {
    const $loader = $(".loader");

    if (show) {
      $loader.show();
    } else {
      $loader.hide();
    }
  }

  // Fetch data from the API.
  function fetchData(url, onSuccess) {
    toggleLoader(true);

    setTimeout(() => {
      $.ajax({
        url: url,
        type: "GET",
        success: function (response) { toggleLoader(false); onSuccess(response); },
        error: function () {
          toggleLoader(false);

          console.error(`Failed to fetch data from ${url}`);
          $("#carousel-items").html(`
            <div class="text-center text-white">
              <p>
                Something went wrong while loading data.
                <br>
                Please try again later.
              </p>
            </div>
          `);
        },
      });
    }, 1000); // To test loader, setTimeout to remove in final version.
  }

  // Display quotes in the carousel.
  function displayQuotes(data) {
    // Validate data.
    if (!data || !Array.isArray(data)) {
      console.error("Invalid data received for quotes.");
      return;
    }

    // Generate HTML for each quote.
    const quotesHTML = data.map((quote, index) => {
      let activeClass = "carousel-item";
      if (index === 0) {
        activeClass += " active";
      }

      return `
          <blockquote class="${activeClass}">
            <div class="row mx-auto align-items-center">
              <div class="col-12 col-sm-2 col-lg-2 offset-lg-1 text-center">
                <img src="${quote.pic_url}" class="d-block align-self-center" alt="Picture of ${quote.name}">
              </div>

              <div class="col-12 col-sm-7 offset-sm-2 col-lg-9 offset-lg-0">
                <div class="quote-text">
                  <p class="text-white pr-md-4 pr-lg-5">
                  ${quote.text}
                  </p>

                  <h4 class="text-white font-weight-bold">${quote.name}</h4>
                  <span class="text-white">${quote.title}</span>
                </div>
              </div>
            </div>
          </blockquote>
        `;
    }).join("");

    // Insert generated quotes into the carousel.
    $("#carousel-items").html(quotesHTML);
  }

  // Display custom carousel.
  function displayCustomCarousel(data) {
    // Validate data.
    if (!data || !Array.isArray(data)) {
      console.error("Invalid data received for carousel.");
      return;
    }

    const $carouselTrack = $("#carousel-track");
    let currentIndex = 0;

    // Render the cards.
    const cardsHTML = data.map((item) => {
      return `
          <div class="carousel-card col-12 col-sm-6 col-md-6 col-lg-3 d-flex justify-content-center">
            <div class="card">
              <img src="${item.thumb_url}" class="card-img-top" alt="Video thumbnail">

              <div class="card-img-overlay text-center">
                <img src="images/play.png" alt="Play" width="64px" class="align-self-center play-overlay">
              </div>

              <div class="card-body">
                <h5 class="card-title font-weight-bold">${item.title}</h5>

                <p class="card-text text-muted">
                  ${item["sub-title"]}
                </p>

                <div class="creator d-flex align-items-center">
                  <img src="${item.author_pic_url}" alt="${item.author}" width="30px" class="rounded-circle">
                  <h6 class="pl-3 m-0 main-color">${item.author}</h6>
                </div>

                <div class="info pt-3 d-flex justify-content-between">
                  <div class="rating">
                    ${generateStars(item.star)}
                  </div>

                  <span class="main-color">${item.duration}</span>
                </div>
              </div>
            </div>
          </div>
        `;
    }).join("");

    $carouselTrack.html(cardsHTML);

    // Add event listeners to navigation buttons.
    $("#prev-button").on("click", () => moveCarousel(-1));
    $("#next-button").on("click", () => moveCarousel(1));

    // Move carousel function.
    function moveCarousel(direction) {
      const cardWidth = $(".carousel-card").outerWidth(true);

      // Update current index based on direction.
      currentIndex += direction;

      // Infinite loop logic.
      if (currentIndex < 0) {
        currentIndex = data.length - 4;
      } else if (currentIndex > data.length - 4) {
        currentIndex = 0;
      }

      // Apply the translation to the carousel track.
      $carouselTrack.css("transform", `translateX(-${currentIndex * cardWidth}px)`);
    }

    // Generate star ratings.
    function generateStars(starCount) {
      let stars = "";
      for (let i = 0; i < 5; i++) {
        if (i < starCount) {
          stars += `<img src="images/star_on.png" alt="star" width="15px">`;
        } else {
          stars += `<img src="images/star_off.png" alt="star" width="15px">`;
        }
      }
      return stars;
    }
  }
});