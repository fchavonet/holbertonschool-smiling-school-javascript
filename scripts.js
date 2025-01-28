$(document).ready(function () {
	// Fetch and display quotes in the quotes carousel.
	const quotesURL = "https://smileschool-api.hbtn.info/quotes";
	fetchData(quotesURL, {}, displayQuotes);

	// Fetch and display popular tutorials in the corresponding carousel.
	const popularTutorialsURL = "https://smileschool-api.hbtn.info/popular-tutorials";
	fetchData(popularTutorialsURL, {}, (data) => displayCustomCarousel(data, "#popular-carousel-track", "#popular-prev-button", "#popular-next-button"));

	// Fetch and display the latest videos in the corresponding carousel.
	const latestVideosURL = "https://smileschool-api.hbtn.info/latest-videos";
	fetchData(latestVideosURL, {}, (data) => displayCustomCarousel(data, "#latest-carousel-track", "#latest-prev-button", "#latest-next-button"));

	populateDropdowns();

	// Show or hide the loader.
	function toggleLoader(show) {
		const $loader = $(".loader");

		if (show) {
			$loader.show();
		} else {
			$loader.hide();
		}
	}

	// Generate the cards.
	function generateCardHTML(item) {
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
							${item["sub-title"] || ""}
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

	// Fetch data from the API.
	function fetchData(url, params = {}, onSuccess, containerSelector = null) {
		if (containerSelector) {
			$(containerSelector).html("");
		}

		toggleLoader(true);

		setTimeout(() => {
			$.ajax({
				url: url,
				type: "GET",
				data: params,
				success: function (response) { toggleLoader(false); onSuccess(response); },
				error: function () {
					toggleLoader(false);

					console.error(`Failed to fetch data from ${url} with params`, params);

					if (containerSelector) {
						$(containerSelector).html(`
							<div class="text-center text-white">
              					<p>
                					Something went wrong while loading data.
                					<br>
                					Please try again later.
              					</p>
            				</div>
          				`);
					}
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
	function displayCustomCarousel(data, containerId, prevButtonId, nextButtonId) {
		// Validate data.
		if (!data || !Array.isArray(data)) {
			console.error("Invalid data received for carousel.");
			return;
		}

		const $carouselTrack = $(containerId);
		let currentIndex = 0;

		// Render the cards.
		const cardsHTML = data.map(generateCardHTML).join("");
		$carouselTrack.html(cardsHTML);

		// Add event listeners to navigation buttons.
		$(prevButtonId).on("click", () => moveCarousel(-1));
		$(nextButtonId).on("click", () => moveCarousel(1));

		function moveCarousel(direction) {
			const cardWidth = $(".carousel-card").outerWidth(true);
			const visibleCards = Math.floor($(".carousel-track-container").width() / cardWidth);
			const totalCards = data.length;

			// Update current index based on direction.
			currentIndex += direction;

			// Infinite loop logic.
			if (currentIndex < 0) {
				currentIndex = 0;
			} else if (currentIndex > totalCards - visibleCards) {
				currentIndex = totalCards - visibleCards;
			}

			// Apply the translation to the carousel track.
			$carouselTrack.css("transform", `translateX(-${currentIndex * cardWidth}px)`);

			// Disable the "prev" button if at the beginning.
			if (currentIndex === 0) {
				$(prevButtonId).prop("disabled", true);
			} else {
				$(prevButtonId).prop("disabled", false);
			}

			// Disable the "next" button if at the end.
			if (currentIndex >= totalCards - visibleCards) {
				$(nextButtonId).prop("disabled", true);
			} else {
				$(nextButtonId).prop("disabled", false);
			}
		}
	}

	// Display courses.
	function displayCourses(data) {
		// Validate data.
		if (!data || !data.courses || !Array.isArray(data.courses)) {
			console.error("Invalid data received for courses.");
			return;
		}

		$(".video-count").text(`${data.courses.length} videos`);

		// Render the cards.
		const cardsHTML = data.courses.map(generateCardHTML).join("");
		$("#courses-container").html(cardsHTML);
	}

	// Update courses based on search, topic, and sort.
	function updateCourses() {
		// Get the search input value.
		const qVal = $(".search-text-area").val() || "";

		// Get the selected topic.
		const topicVal = $(".box2 .dropdown-toggle span").text().trim();

		// Get the selected sort option.
		const sortVal = $(".box3 .dropdown-toggle span").text().trim();

		// Fetch and display the filtered courses.
		fetchData("https://smileschool-api.hbtn.info/courses", { q: qVal, topic: topicVal, sort: sortVal }, displayCourses, "#courses-container");
	}

	function populateDropdowns() {
		fetchData("https://smileschool-api.hbtn.info/courses", {}, function (data) {
			if (!data) {
				console.error("Invalid data received for dropdown.");
				return;
			}

			// Format a string (replace underscores and capitalize).
			function formatText(text) {
				let formatted = text.replace("_", " ");

				// Capitalize the first letter of each word.
				formatted = formatted.replace(/(^|\s)\S/g, function (match) {
					return match.toUpperCase();
				});

				return formatted;
			}

			// Populate "Topic" dropdown.
			const topics = data.topics || [];
			const $topicDropdown = $(".box2 .dropdown-menu");
			let topicHTML = "";

			topics.forEach(function (topic) {
				const formattedTopic = formatText(topic);
				topicHTML += `<a class="dropdown-item" href="#">${formattedTopic}</a>`;
			});

			$topicDropdown.html(topicHTML);

			// Set the default value for the "Topic" dropdown.
			if (topics.length > 0) {
				const defaultTopic = formatText(topics[0]);
				$(".box2 .dropdown-toggle span").text(defaultTopic);
			}

			// Populate "Sort By" dropdown.
			const sorts = data.sorts || [];
			const $sortDropdown = $(".box3 .dropdown-menu");
			let sortHTML = "";

			sorts.forEach(function (sort) {
				const formattedSort = formatText(sort);
				sortHTML += `<a class="dropdown-item" href="#">${formattedSort}</a>`;
			});

			$sortDropdown.html(sortHTML);

			// Set the default value for the "Sort By" dropdown.
			if (sorts.length > 0) {
				const defaultSort = formatText(sorts[0]);
				$(".box3 .dropdown-toggle span").text(defaultSort);
			}

			// Fetch and update courses once dropdowns are populated.
			updateCourses();
		});
	}


	// Refresh courses when typing in the search box.
	$(".search-text-area").on("input", function () {
		updateCourses();
	});

	// Refresh courses when selecting a topic.
	$(".box2 .dropdown-menu").on("click", ".dropdown-item", function (event) {
		event.preventDefault();
		const newTopic = $(this).text().trim();
		$(".box2 .dropdown-toggle span").text(newTopic);
		updateCourses();
	});

	// Refresh courses when selecting a sort option.
	$(".box3 .dropdown-menu").on("click", ".dropdown-item", function (event) {
		event.preventDefault();
		const newSort = $(this).text().trim();
		$(".box3 .dropdown-toggle span").text(newSort);
		updateCourses();
	});

	// Load once on page ready.
	updateCourses();
});