// helper funtions

async function helperGetMovieData(url) {
    try {
        // eslint-disable-next-line no-undef
        const res = await axios.get(url);
        return res;
    } catch (e) {
        // eslint-disable-next-line no-console
        return {};
    }
}

function helperDrawStatus(s) {
    if (s === 0) {
        return "/images/my-lists/eye-slash-solid.png";
    } if (s === 1) {
        return "/images/my-lists/eye.png";
    } if (s === 2) {
        return "/images/my-lists/bookmarked.png";
    }

    return "";
}

function helperDraw(n, status) { // drawing the star ratings
    // draws star in rating
    if (status === "Not watched" || status === "To watch") {
        return "N/A";
    }

    // check if rating has .5
    let fullStars = Math.floor(n);
    let isHalf = false;
    if (n % 1 !== 0) {
        isHalf = true;
    }

    var rating = "";
    for (let i = 0; i < fullStars; i++) {
        rating += "⭐";
    }
    if (isHalf) {
        rating += "½";
    }
    return rating;
}

function helperLoadLimitArray(len) {
    // creating a load limit array
    let arr = [10];
    let i;
    for (i = 50; i < len + 40; i += 50) {
        arr.push(i);
    }

    return arr;
}

// Main Vue File
// eslint-disable-next-line no-undef
const movieTable = Vue.createApp({
    data() {
        return {

            showSort: false,
            load: 10,
            page: 1,
            totalPages:3,
            totalMovies:26,
            sort: "",
            filter: {
                genre: [],
                status: [],
                ageRating: []
            },
            movies: [],
            showFilter: false,
            showGenres: false,
            showAgeRating: false,
            showStatus: false,
            showLoadLimit: false,
            activeAccordion: null,


            genres: [],
            ageRatings: ["NR", "M", "PG"],
            statuses: [{ name: "Watched", id: 1 }, { name: "Not Watched", id: 0 }, { name: "Bookmarked", id: 2 }]


        };


    },
    methods: {

        resetFiltersAndSort() {
  this.filter.genre = [];
  this.filter.status = [];
  this.filter.ageRating = [];
  this.sort = "";
  this.page = 1;

  // Optional: Close dropdowns if needed
  this.showFilter = false;
  this.showSort = false;

  // Fetch unfiltered data
  const url = this.createUrl();
  this.getMovieData(url);
},

 getMouseX(event) {
  const rect = event.currentTarget.getBoundingClientRect();
  return (event.clientX - rect.left) / rect.width;
},

async setUserRating(movie, rating) {
  movie.my_rating = rating;

  console.log(movie);

  try {
    await axios.post('/api/mylist/add-rating', {
      movie_id: movie.movie_id,
      rating: rating
    });
    console.log("Rating updated to", rating);
  } catch (error) {
    console.error("Failed to update rating:", error);
  }
},

async toggleStatus(movie) {
  // Cycle to next status (0 → 1 → 2 → 0)
  movie.watch_status = (movie.watch_status + 1) % 3;

  try {
    await axios.post('/api/mylist/', {
      movie_id: movie.movie_id,
      is_liked: 1, // fallback default (e.g., liked)
      watch_status: movie.watch_status
    });
  } catch (error) {
    console.error("Failed to update status:", error);
    // Optionally revert the change if API call fails
  }
},

    toggleFilter() {
  this.showFilter = !this.showFilter;
  this.showSort = false; // close other menu
},

toggleSort() {
  this.showSort = !this.showSort;
  this.showFilter = false; // close other menu
},
handleClickOutside(event) {
  const filterBtn = this.$refs.filterBtn;
  const filterMenu = this.$refs.filterMenu;

  const sortBtn = this.$refs.sortBtn;
  const sortMenu = this.$refs.sortMenu;

  const loadLimitWrapper = this.$refs.loadLimitWrapper;

  const clickedEl = event.target;

  const clickedInsideFilter = filterBtn?.contains(clickedEl) || filterMenu?.contains(clickedEl);
  const clickedInsideSort = sortBtn?.contains(clickedEl) || sortMenu?.contains(clickedEl);
  const clickedInsideLoadLimit = loadLimitWrapper?.contains(clickedEl);

  if (!clickedInsideFilter) this.showFilter = false;
  if (!clickedInsideSort) this.showSort = false;
  if (!clickedInsideLoadLimit) this.showLoadLimit = false;
},





         toggleAccordion(section) {
  this.activeAccordion = this.activeAccordion === section ? null : section;
},
        selectAllGenres() {
  this.filter.genre = this.genres.map(g => g.id);
},
clearAllGenres() {
  this.filter.genre = [];
},

        loadLimitArray() {
            return helperLoadLimitArray(100);
        },
        async getMovieData(url) {
            const res = await helperGetMovieData(url);
             this.movies = (res.data || []).map(movie => ({
    ...movie,
    hoverRating: 0 // add temporary field for hover effect
  }));
            this.totalMovies = res.data.total || 0;
    this.totalPages = Math.ceil(this.totalMovies / this.load);
        },
        createUrl() {
            // base url
            const url = new URL("/api/mylist", window.location.origin);

            // Set query parameters
            url.searchParams.set("page", this.page);
            url.searchParams.set("limit", this.load);

            if (this.sort) {
                url.searchParams.set("sort", this.sort);
            }

            this.filter.genre.forEach((genre) => {
                url.searchParams.append("genre", genre);
            });

            this.filter.status.forEach((status) => {
                url.searchParams.append("status", status);
            });

            this.filter.ageRating.forEach((ageRating) => {
                url.searchParams.append("certification", ageRating);
            });

            return url;
        },
        helperMovieGenres(genres) {
            if (!genres) return "N/A";
            // hlper function conver genre object to string
            return genres.map((g) => g.name).join(', ');
        },
        helperMovieDate(d) {
            if (!d) return "N/A";
            // helper function to format Date
            const date = new Date(d);
            return date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        },
        helperCheckEmpty(input) {
            if (!input) return "N/A";
            return input;
        },
        helperImdbRating(r) {
            if (!r) return "N/A";
            return r + "/10";
        },
        helperMyRating(r) {
            if (!r) return "N/A";
            return helperDraw(r);
        },
        helperMovieStatus(s) {
            return helperDrawStatus(s);
        },
        goToMovie(movie_id) {
            console.log(movie_id);
            window.location.href = `/moviepage.html?id=${movie_id}`;
        },
        async getGenres(url) {
            const res = await helperGetMovieData(url);
            this.genres = res.data || [];
        }
    },
    computed: {
        SortorFilterMovies() {
            return {
                load: this.load,
                sort: this.sort,
                'filter.genre': this.filter.genre,
                'filter.status': this.filter.status,
                'filter.ageRating': this.filter.ageRating
            };
        },

    },
    watch: {
        page() {
    const url = this.createUrl();
    this.getMovieData(url);
  },

        SortorFilterMovies: {
            handler() {
                this.page = 1;
                const url = this.createUrl();
                this.getMovieData(url);
            },
            deep: false,
            immediate: false
        }

    },
    mounted() {

        this.getMovieData('/api/mylist');
        this.getGenres('/api/movies/genres');
         window.addEventListener("click", this.handleClickOutside);
    },
    beforeUnmount() {
  window.removeEventListener("click", this.handleClickOutside);
}
});

movieTable.mount('.main-mylists');
// End of Vue Script



