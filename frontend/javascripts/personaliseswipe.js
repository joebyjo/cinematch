/* eslint-disable max-len */
async function getMethod(url) {
    try {
        // eslint-disable-next-line no-undef
        const res = await axios.get(url);
        return res.data;
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Error retrieving data from server", e);
        return {};
    }
}

// API call to save movie interaction (like/watch status)
async function sendMovieData(movieId, isLiked, watchStatus) {
    try {
        const response = await axios.post('/api/personalise/movie', {
            movie_id: movieId,
            is_liked: isLiked,
            watch_status: watchStatus
        });
        return response;
    } catch (error) {
        console.error('Error sending movie data:', error);
        return { status: 500, data: { msg: 'Failed to save movie status. Please try again.' } };
    }
}

const app = Vue.createApp({
    data() {
        return {
            movies: [], // next Movies
            movie: {}, // current Movie

            isLoading: true,
            loadError: false,
            errorMessage: '',

            isSaved: false,
            isWatched: false,
            hasProvider: true
        };
    },
    computed: {
        topProvider() {
            const providers = (this.movie && this.movie.watch_providers) || [];

            if (providers.length === 0) {
                this.hasProvider = false;
                return [];
            }

            const sorted = providers.sort((i, j) => i.display_priority - j.display_priority);
            this.hasProvider = true;
            return sorted.slice(0, 2);
        },

        preloadBackdrop() {
            if (this.movies.length === 0 || !this.movies[0].poster_path) {
                return "./";
            }

            const posterPath = this.movies[0].poster_path;
            const fullUrl = `https://image.tmdb.org/t/p/original${posterPath}`;

            return fullUrl;
        }
    },
    methods: {
        async fetchMovieData(movieId) {
            try {
                const detailsEndpoint = '/api/movies/movie/';
                const detailsResponse = await axios.get(detailsEndpoint + movieId);

                return detailsResponse;
            } catch (error) {
                console.error('Failed to fetch movie details:', error);
                return {};
            }
        },

        // Formatters for UI display
        formatRuntime(minutes) {
            if (!minutes) return 'N/A';
            const hrs = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return `${hrs} hr ${mins} min`;
        },
        formatGenres(genres) {
            if (!genres || genres.length === 0) return 'N/A';
            const names = [];
            for (let i = 0; i < genres.length; i++) {
                names.push(genres[i].name);
            }
            return names.join(' · ');
        },
        formatCast(cast) {
            return cast || 'N/A';
        },
        formatDirector(director) {
            return director || 'N/A';
        },
        formatProviders(providers) {
            if (!providers || providers.length === 0) return ['No data available'];
            const names = [];
            for (let i = 0; i < providers.length; i++) {
                names.push(providers[i].provider_name);
            }
            return names;
        },
        formatTitle(title) {
            if (!title) return 'N/A';
            this.fullTitle = title;
            return title.length > 18 ? title.substring(0, 15) + '...' : title;
        },
        formatImdbRating(rating) {
            return rating ? `${rating} / 10` : 'N/A';
        },
        formatRottenRating(rating) {
            return rating ? `${rating}%` : 'N/A';
        },
        formatDescription(description) {
            if (!description) return 'N/A';
            return description;
            // return this.isDescExpanded || description.length <= 215
            //     ? description
            //     : description.substring(0, 212) + '...';
        },
        // Open YouTube trailer
        openTrailer() {
            if (this.movie.trailer) {
                window.open(this.movie.trailer);
            }
        },

        // Watch Status
        // Determine watch status code
        calculateWatchStatus() {
            let status = 0;
            if (this.isWatched) status += 1;
            if (this.isSaved) status += 2;
            return status;
        },
        // Toggle saved state
        async toggleSaved() {
            this.isSaved = !this.isSaved;
        },
        // Toggle watched state
        async toggleWatched() {
            this.isWatched = !this.isWatched;
        },

        // Movie Stuff
        async nextMovie(isLiked) {
            const middleBox = document.querySelector('.middle-box'); // select middle box

            if (isLiked) {
                middleBox.classList.add('curr-swiped-r'); // add swiped right class for curr movie if isLiked=true
            } else {
                middleBox.classList.add('curr-swiped-l'); // add  swiped left class for curr movie if isLiked=false
            }
            // wait for like/dislike animation
            await new Promise((resolve) => { setTimeout(resolve, 300); });

            sendMovieData(this.movie.id, isLiked, this.calculateWatchStatus());
            middleBox.classList.remove('curr-swiped-l', 'curr-swiped-r'); // remove swiped classes
            this.movie = this.movies.shift() || null;
            this.isSaved = false;
            this.isWatched = false;

            middleBox.classList.add('next-fade-in'); // add  fade in class for next movie
            await new Promise((resolve) => { setTimeout(resolve, 300); }); // wait for fade animation
            middleBox.classList.remove('next-fade-in'); // remove fade class
        },
        async appendMovie() {
            this.loadError = false;
            this.errorMessage = '';

            // 1) Fetch the list of IDs
            let res;
            try {
                res = await getMethod('api/personalise/movies');
            } catch (err) {
                console.error('Failed to fetch movie IDs:', err);
                this.loadError = true;
                this.errorMessage = 'Could not load movie list.';
                return;
            }

            // 2) Guard against non-arrays or empty list
            const ids = Array.isArray(res.movieIds) ? res.movieIds : [];
            if (ids.length === 0) {
                // nothing to fetch
                return;
            }

            // 3) Fetch each movie in parallel, swallowing per-movie errors
            const promises = ids.map((id) =>
                this.fetchMovieData(id)
                    .then((r) => r.data)
                    .catch((err) => {
                        console.error(`Failed to fetch movie ${id}:`, err);
                        return null;
                    })
            );

            // 4) Await allSettled, just in case it ever throws
            let results;
            try {
                results = await Promise.allSettled(promises);
            } catch (err) {
                console.error('Unexpected Promise.allSettled failure:', err);
                this.loadError = true;
                this.errorMessage = 'Unexpected error loading movies.';
                return;
            }

            // 5) Extract only the successful, non-null responses
            const newMovies = results
                .filter((r) => r.status === 'fulfilled' && r.value)
                .map((r) => r.value);

            if (newMovies.length === 0) {
                // if none loaded, show an error state
                this.loadError = true;
                this.errorMessage = 'No movies could be loaded.';
            } else {
                this.movies.push(...newMovies);
            }
        },

        async init() {
            this.isLoading = true;
            await this.appendMovie();
            this.movie = this.movies.shift() || null;
            this.isLoading = false;
        }

    },
    watch: {
        // whenever movies.length changes:
        'movies.length'(newLen) {
            if (newLen <= 3) {
                this.appendMovie();
            }
        }
    },
    mounted() {
        this.init();
    }
}).mount('#personalise');
