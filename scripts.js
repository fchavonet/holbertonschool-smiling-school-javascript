$(document).ready(function () {
	//
	const quotesURL = "https://smileschool-api.hbtn.info/quotes";
	fetchData(quotesURL, displayQuotes);

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
						Something went wrong while loading quotes.
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
			const activeClass = index === 0 ? "carousel-item active" : "carousel-item";

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

                  <h4 class="text-white font-weight-bold">
                    ${quote.name}
                  </h4>

                  <span class="text-white">
                    ${quote.title}
                  </span>
                </div>
              </div>
            </div>
          </blockquote>
        `;
		}).join("");

		// Insert generated quotes into the carousel.
		$("#carousel-items").html(quotesHTML);
	}
});
