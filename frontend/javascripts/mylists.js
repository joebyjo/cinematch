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
        return "/images/my-lists/eye-slash-solid 1.png";
    } if (s === 1) {
        return "/images/my-lists/eye.png";
    } if (s === 2) {
        return "/images/my-lists/bookmarked.png";
    }

    return "/";
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
            load: 10,
            page: 1,
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
            genres: [],
            ageRatings: ["NR", "M", "PG"],
            statuses: [{ name: "Watched", id: 1 }, { name: "Not Watched", id: 0 }, { name: "Bookmarked", id: 2 }]


        };


    },
    methods: {
        loadLimitArray() {
            return helperLoadLimitArray(100);
        },
        async getMovieData(url) {
            const res = await helperGetMovieData(url);
            this.movies = res.data || [];
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
            if (!s) return "/";
            return helperDrawStatus(s);
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
        }
    },
    watch: {
        SortorFilterMovies: {
            handler() {
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
    }
});

movieTable.mount('.main-mylists');
// End of Vue Script
