const trendingNow = [
  "media0.webp",
  "media1.jpg",
  "media2.webp",
  "media3.webp",
  "media4.jpg",
  "media5.webp",
  "media6.jpg",
  "media7.webp",
  "media8.webp",
  "media9.jpg",
  "media10.jpg",
];

const watchAgain = [
  "media11.jpg",
  "media12.jpg",
  "media13.jpg",
  "media14.webp",
  "media15.jpg",
  "media16.webp",
  "media17.jpg",
  "media18.jpg",
  "media19.webp",
  "media20.jpg",
  "media21.webp",
];

const newReleases = [
  "media22.webp",
  "media23.webp",
  "media24.jpg",
  "media25.webp",
  "media26.webp",
  "media27.jpg",
  "media28.jpg",
  "media29.jpg",
  "media30.jpg",
  "media31.webp",
  "media32.jpg",
];

const getItemsPerPage = () => {
  const width = window.innerWidth;
  if (width < 576) return 2; // xs: 2 items
  if (width < 768) return 3; // sm: 3 items
  if (width < 992) return 4; // md: 4 items
  if (width < 1200) return 5; // lg: 5 items
  return 6; // xl: 6 items
};

let ITEMS_PER_PAGE = getItemsPerPage();

const createCarousel = (title, items, carouselId) => {
  let currentIndex = 0;
  const totalPages = Math.floor(items.length / ITEMS_PER_PAGE);

  const carouselHTML = `
        <div class="carousel-container">
          <h2 class="text-white mb-3">${title}</h2>
          <button class="carousel-btn prev" data-carousel="${carouselId}">‹</button>
          <div class="carousel-track">
            <div class="row g-2" id="${carouselId}-track"></div>
          </div>
          <button class="carousel-btn next" data-carousel="${carouselId}">›</button>
        </div>
      `;

  return { html: carouselHTML, currentIndex, totalPages, items };
};

const renderCarouselItems = (carouselId, items, startIdx) => {
  const track = document.getElementById(`${carouselId}-track`);
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const visibleItems = items.slice(startIdx, endIdx);

  // Calculate Bootstrap column class based on items per page
  const totalColumns = Math.floor(12 / ITEMS_PER_PAGE);
  console.log("here", totalColumns);
  const colClass = `col-${totalColumns}`;

  track.innerHTML = visibleItems
    .map(
      (item, idx) => `
        <div class="${colClass}">
          <div class="carousel-item-custom">
            ${startIdx + idx < 3 ? '<div class="new-badge">NEW EPISODES</div>' : ""}
              <img src="./assets/media/${item}"class="carousel-item-content img-fluid" />
          </div>
        </div>
      `
    )
    .join("");
};

// Initialize all carousels
const carousels = [
  { title: "Trending Now", items: trendingNow, id: "trending" },
  { title: "Watch Again", items: watchAgain, id: "watch-again" },
  { title: "New Releases", items: newReleases, id: "new-releases" },
];

const carouselStates = {};
const carouselsContainer = document.getElementById("carousels");

carousels.forEach((carousel) => {
  const state = createCarousel(carousel.title, carousel.items, carousel.id);
  carouselStates[carousel.id] = state;
  carouselsContainer.innerHTML += state.html;
});

// Render initial state
carousels.forEach((carousel) => {
  renderCarouselItems(carousel.id, carousel.items, 0);
});

// Handle window resize
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const newItemsPerPage = getItemsPerPage();
    if (newItemsPerPage !== ITEMS_PER_PAGE) {
      ITEMS_PER_PAGE = newItemsPerPage;

      // Recalculate total pages and reset to first page
      carousels.forEach((carousel) => {
        const state = carouselStates[carousel.id];
        state.currentIndex = 0;
        state.totalPages = Math.floor(carousel.items.length / ITEMS_PER_PAGE);
        renderCarouselItems(carousel.id, carousel.items, 0);
      });
    }
  }, 250); // Debounce resize events
});

// Add event listeners
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("carousel-btn")) {
    const carouselId = e.target.dataset.carousel;
    const state = carouselStates[carouselId];
    const isPrev = e.target.classList.contains("prev");

    if (isPrev) {
      state.currentIndex = state.currentIndex === 0 ? state.totalPages - 1 : state.currentIndex - 1;
    } else {
      state.currentIndex = state.currentIndex === state.totalPages - 1 ? 0 : state.currentIndex + 1;
    }

    const startIdx = state.currentIndex * ITEMS_PER_PAGE;
    renderCarouselItems(carouselId, state.items, startIdx);
  }
});
