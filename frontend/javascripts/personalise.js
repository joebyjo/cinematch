/* eslint-disable no-undef */
/* eslint-disable no-console */
/* eslint-disable no-use-before-define */

async function getMethod(url) {
    try {
        // eslint-disable-next-line no-undef
        const res = await axios.get(url);
        return res.data;
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Error retrieving data from server", e);
        return [];
    }
}

async function postLanguages(languages) {
    // console.log(languages);
    // Collect selected language IDs
    const languageIds = languages
        .map((lang) => lang.id);

    try {
        const res = await axios.post("/api/personalise/languages-id", languageIds);
        // console.log("[INFO] Languages updated successfully.", res.data);
    } catch (e) {
        console.error("[ERROR] Failed to update languages:", e.message || e);
    }
}

async function postGenres(genres) {
    // Collect selected genre IDs
    const genreIds = genres
        .map((genre) => genre.id);

    try {
        const res = await axios.post("/api/personalise/genres-id", genreIds);
        // console.log("[INFO] Genres updated successfully.", res.data);
    } catch (e) {
        console.error("[ERROR] Failed to update genres:", e.message || e);
    }
}

createApp({
    data() {
        return {
            isError: false,
            showGenreGrid: true,

            // Genres page
            genres: [],
            selectedGenres: [],

            // Languages Page
            languages: [],
            selectedLanguages: [],
            dropdownVisible: false
        };
    },
    methods: {
        redirect(path) {
            window.location.href = path;
        },
        async swipePage() {
            // post the data to backend
            await postGenres(this.selectedGenres);
            await postLanguages(this.selectedLanguages);

            await axios.post('/api/personalise/createUserVector');
            this.redirect("/personalise");
        },

        // Genres Page
        toggleGenre(genre) {
            const index = this.selectedGenres.indexOf(genre);
            if (index === -1) this.selectedGenres.push(genre);
            else this.selectedGenres.splice(index, 1);

            // console.log(this.selectedGenres);
            // console.log(this.languages);
        },

        // Languages Page
        removeLanguage(code) {
            this.selectedLanguages = this.selectedLanguages.filter((lang) => lang.code !== code);
        },

        async init() {
            this.isError = false;

            try {
                // Fetch genres, languages, and user details concurrently
                await Promise.all([
                    this.fetchGenres(),
                    this.fetchLanguages()
                ]);
            } catch (e) {
                this.isError = true;
                console.error("[ERROR] Initialization failed:", e.message || e);
            }

        },
        // Fetch genres and mark user's favorites as selected
        async fetchGenres(favoriteGenres) {
            try {
                const res = await getMethod("/api/movies/genres");

                if (!Array.isArray(res)) {
                    throw new Error("Genres response is not an array");
                }

                this.genres = res;

                // console.log("[INFO] Genres loaded successfully");
            } catch (error) {
                console.error("[ERROR] Failed to fetch genres:", error.message || error);
                throw error; // Propagate to init()
            }
        },
        // Fetch languages and mark user's preferences as selected
        async fetchLanguages(preferredLanguages) {
            try {
                const res = await getMethod("/api/movies/languages");

                if (!Array.isArray(res)) {
                    throw new Error("Languages response is not an array");
                }

                this.languages = res;

                // console.log("[INFO] Languages loaded successfully");
            } catch (error) {
                console.error("[ERROR] Failed to fetch languages:", error.message || error);
                throw error; // Propagate to init()
            }
        }
    },
    computed: {},
    mounted() {
        this.init();
    }
}).mount('#personalise-main');


