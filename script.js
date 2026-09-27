const movies = [
  {
    id: "dune",
    title: "Dune: Part Two",
    year: 2024,
    rating: 8.5,
    runtime: "2h 46m",
    genre: "Sci-Fi",
    director: "Denis Villeneuve",
    cast: "Timothée Chalamet, Zendaya",
    image: "https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    description: "Paul Atreides unites with Chani and the Fremen while seeking vengeance against the conspirators who destroyed his family. A grand, sand-swept epic about destiny, devotion, and rebellion."
  },
  {
    id: "past-lives",
    title: "Past Lives",
    year: 2023,
    rating: 8.0,
    runtime: "1h 46m",
    genre: "Romance",
    director: "Celine Song",
    cast: "Greta Lee, Teo Yoo",
    image: "https://image.tmdb.org/t/p/w780/k3waqVXSnvCZWfJYNtdamTgTtTA.jpg",
    description: "Two deeply connected childhood friends are separated after one family emigrates from South Korea. Decades later, they are reunited for one fateful week in New York."
  },
  {
    id: "spiderverse",
    title: "Spider-Man: Across the Spider-Verse",
    year: 2023,
    rating: 8.6,
    runtime: "2h 20m",
    genre: "Animation",
    director: "Joaquim Dos Santos",
    cast: "Shameik Moore, Hailee Steinfeld",
    image: "https://image.tmdb.org/t/p/w780/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
    description: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence."
  },
  {
    id: "oppenheimer",
    title: "Oppenheimer",
    year: 2023,
    rating: 8.4,
    runtime: "3h 00m",
    genre: "Drama",
    director: "Christopher Nolan",
    cast: "Cillian Murphy, Emily Blunt",
    image: "https://image.tmdb.org/t/p/w780/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    description: "The story of J. Robert Oppenheimer and his pivotal role in the development of the atomic bomb, told with staggering scale and moral urgency."
  },
  {
    id: "holdovers",
    title: "The Holdovers",
    year: 2023,
    rating: 8.1,
    runtime: "2h 13m",
    genre: "Comedy",
    director: "Alexander Payne",
    cast: "Paul Giamatti, Da'Vine Joy Randolph",
    image: "https://image.tmdb.org/t/p/w780/VHSzNBTwxV8vh7wylo7O9CLdac.jpg",
    description: "A grumpy instructor at a New England prep school forms an unlikely bond with a troubled student during the Christmas break."
  },
  {
    id: "poor-things",
    title: "Poor Things",
    year: 2023,
    rating: 8.0,
    runtime: "2h 21m",
    genre: "Fantasy",
    director: "Yorgos Lanthimos",
    cast: "Emma Stone, Mark Ruffalo",
    image: "https://image.tmdb.org/t/p/w780/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg",
    description: "Brought back to life by an unorthodox scientist, a young woman runs off with a debauched lawyer on a whirlwind adventure across the continents."
  },
  {
    id: "the-batman",
    title: "The Batman",
    year: 2022,
    rating: 7.8,
    runtime: "2h 56m",
    genre: "Thriller",
    director: "Matt Reeves",
    cast: "Robert Pattinson, Zoë Kravitz",
    image: "https://image.tmdb.org/t/p/w780/74xTEgt7R36Fpooo50r9T25onhq.jpg",
    description: "When a sadistic killer leaves a trail of cryptic clues across Gotham, Batman ventures into the underworld to unmask the culprit."
  },
  {
    id: "everything",
    title: "Everything Everywhere All at Once",
    year: 2022,
    rating: 8.3,
    runtime: "2h 20m",
    genre: "Sci-Fi",
    director: "Daniel Kwan & Daniel Scheinert",
    cast: "Michelle Yeoh, Ke Huy Quan",
    image: "https://image.tmdb.org/t/p/w780/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",
    description: "An exhausted laundromat owner is swept up in a wildly improbable adventure, where she alone can save the world by exploring other universes."
  }
];

const state = { search: "", genre: "all", sort: "featured", watchlist: JSON.parse(localStorage.getItem("reelora-watchlist") || "[]") };
const $ = (selector) => document.querySelector(selector);
const movieGrid = $("#movieGrid");
const watchlistGrid = $("#watchlistGrid");
const genreFilter = $("#genreFilter");
const genreChips = $("#genreChips");
const modal = $("#movieModal");
let toastTimer;

function getGenres() { return [...new Set(movies.map((movie) => movie.genre))].sort(); }

function setupFilters() {
  getGenres().forEach((genre) => {
    genreFilter.insertAdjacentHTML("beforeend", `<option value="${genre}">${genre}</option>`);
  });
  renderChips();
}

function renderChips() {
  const chips = ["all", ...getGenres()];
  genreChips.innerHTML = chips.map((genre) => `<button class="genre-chip ${state.genre === genre ? "is-active" : ""}" data-genre="${genre}" type="button">${genre === "all" ? "All films" : genre}</button>`).join("");
}

function selectedMovies() {
  const query = state.search.trim().toLowerCase();
  const filtered = movies.filter((movie) => (state.genre === "all" || movie.genre === state.genre) && movie.title.toLowerCase().includes(query));
  return filtered.sort((a, b) => {
    if (state.sort === "rating-high") return b.rating - a.rating;
    if (state.sort === "rating-low") return a.rating - b.rating;
    if (state.sort === "title") return a.title.localeCompare(b.title);
    return movies.indexOf(a) - movies.indexOf(b);
  });
}

function movieCard(movie, index) {
  const saved = state.watchlist.includes(movie.id);
  return `
    <article class="movie-card" style="animation-delay:${index * 45}ms">
      <button class="watch-button ${saved ? "saved" : ""}" type="button" data-watch="${movie.id}" aria-label="${saved ? "Remove" : "Add"} ${movie.title} ${saved ? "from" : "to"} watchlist" title="${saved ? "Remove from" : "Add to"} watchlist">
        <span class="bookmark" aria-hidden="true">${saved ? "♥" : "♡"}</span>
      </button>
      <button class="poster-button open-movie" type="button" data-id="${movie.id}" aria-label="View details for ${movie.title}">
        <img src="${movie.image}" alt="${movie.title} poster" loading="lazy" />
        <span class="poster-overlay" aria-hidden="true"><span>→</span></span>
      </button>
      <div class="card-info">
        <div class="card-topline"><span>${movie.year} · ${movie.runtime}</span><span class="card-rating">★ ${movie.rating}</span></div>
        <h3 class="card-title">${movie.title}</h3>
        <p class="card-genre">${movie.genre}</p>
      </div>
    </article>`;
}

function renderMovies() {
  const filtered = selectedMovies();
  movieGrid.innerHTML = filtered.map(movieCard).join("");
  $("#movieCount").textContent = `${filtered.length} ${filtered.length === 1 ? "film" : "films"} to discover`;
  $("#emptyState").hidden = filtered.length !== 0;
}

function renderWatchlist() {
  const savedMovies = movies.filter((movie) => state.watchlist.includes(movie.id));
  $("#watchlistCount").textContent = savedMovies.length;
  $("#watchlistDescription").textContent = savedMovies.length ? `${savedMovies.length} ${savedMovies.length === 1 ? "film is" : "films are"} ready when you are.` : "Your watchlist is empty. Tap the bookmark on a film to save it here.";
  watchlistGrid.innerHTML = savedMovies.map((movie) => `
    <article class="saved-card">
      <img src="${movie.image}" alt="${movie.title} poster" />
      <div><h3>${movie.title}</h3><p>★ ${movie.rating} · ${movie.genre}</p></div>
      <button type="button" data-watch="${movie.id}" aria-label="Remove ${movie.title} from watchlist" title="Remove from watchlist">×</button>
    </article>`).join("");
}

function toggleWatchlist(id) {
  const movie = movies.find((item) => item.id === id);
  if (!movie) return;
  if (state.watchlist.includes(id)) {
    state.watchlist = state.watchlist.filter((movieId) => movieId !== id);
    showToast(`${movie.title} removed from your list`);
  } else {
    state.watchlist.push(id);
    showToast(`${movie.title} saved to your list`);
  }
  localStorage.setItem("reelora-watchlist", JSON.stringify(state.watchlist));
  renderMovies();
  renderWatchlist();
  if (modal.open) openModal(id);
}

function openModal(id) {
  const movie = movies.find((item) => item.id === id);
  if (!movie) return;
  const saved = state.watchlist.includes(id);
  $("#modalContent").innerHTML = `
    <div class="modal-layout">
      <img class="modal-poster" src="${movie.image}" alt="${movie.title} poster" />
      <div class="modal-copy">
        <p class="modal-tag">${movie.genre.toUpperCase()} · FEATURED PICK</p>
        <h2 id="modalTitle">${movie.title}</h2>
        <div class="modal-meta"><span>${movie.year}</span><span>·</span><span>${movie.runtime}</span><span>·</span><strong>★ ${movie.rating}/10</strong></div>
        <p class="modal-description">${movie.description}</p>
        <div class="modal-facts"><div><span>DIRECTOR</span><b>${movie.director}</b></div><div><span>STARRING</span><b>${movie.cast}</b></div></div>
        <button class="modal-watch" type="button" data-watch="${movie.id}">${saved ? "♥ Remove from my list" : "♡ Add to my list"}</button>
      </div>
    </div>`;
  if (!modal.open) modal.showModal();
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

document.addEventListener("click", (event) => {
  const watchTarget = event.target.closest("[data-watch]");
  const movieTarget = event.target.closest(".open-movie");
  const chip = event.target.closest("[data-genre]");
  if (watchTarget) toggleWatchlist(watchTarget.dataset.watch);
  if (movieTarget) openModal(movieTarget.dataset.id);
  if (chip) {
    state.genre = chip.dataset.genre;
    genreFilter.value = state.genre;
    renderChips();
    renderMovies();
  }
});

$("#searchInput").addEventListener("input", (event) => { state.search = event.target.value; renderMovies(); });
genreFilter.addEventListener("change", (event) => { state.genre = event.target.value; renderChips(); renderMovies(); });
$("#sortSelect").addEventListener("change", (event) => { state.sort = event.target.value; renderMovies(); });
$("#clearFilters").addEventListener("click", () => { state.search = ""; state.genre = "all"; $("#searchInput").value = ""; genreFilter.value = "all"; renderChips(); renderMovies(); });
$("#closeModal").addEventListener("click", () => modal.close());
modal.addEventListener("click", (event) => { if (event.target === modal) modal.close(); });
$("#themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  const light = document.body.classList.contains("light-mode");
  $("#themeToggle").setAttribute("aria-label", `Switch to ${light ? "dark" : "light"} mode`);
  localStorage.setItem("reelora-theme", light ? "light" : "dark");
});
document.addEventListener("keydown", (event) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); $("#searchInput").focus(); } });

if (localStorage.getItem("reelora-theme") === "light") document.body.classList.add("light-mode");
setupFilters();
renderMovies();
renderWatchlist();
