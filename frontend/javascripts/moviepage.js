/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable max-len */
// Get movie ID and content type from URL
const pathParts = window.location.pathname.split('/');
const movieId = pathParts[pathParts.length - 1];
const contentType = pathParts[pathParts.length - 2];

// API call to save movie interaction (like/watch status)
async function sendMovieData(isLiked, watchStatus) {
    try {
        const response = await axios.post('/api/mylist', {
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

// API call to submit user rating
async function submitUserRating(rating) {
    try {
        const response = await axios.post('/api/mylist/add-rating', {
            movie_id: movieId,
            rating: rating,
            review: null
        });
        return response;
    } catch (error) {
        console.error('Error submitting rating:', error);
        return { status: 500, data: { msg: 'Failed to submit rating. Please try again.' } };
    }
}

// API call to check login status
async function isUserLoggedIn() {
    try {
        const response = await axios.get('/api/auth/status');
        return true;
    } catch (error) {
        console.warn('User not logged in');
        return false;
    }
}

// Vue app definition
const app = Vue.createApp({
    data() {
        return {
            movie: {},
            selectedRating: 0,
            hoverRating: 0,
            isSaved: false,
            isWatched: false,
            fullTitle: '',
            isDescExpanded: false,
            isLoading: true,
            contentType: contentType,
            isLoggedIn: false
        };
    },
    methods: {
        // Fetch movie data from backend
        async fetchMovieData() {
            try {
                this.isLoading = true;
                const detailsEndpoint = this.contentType === 'tv' ? '/api/tv/show/' : '/api/movies/movie/';
                const prefEndpoint = this.contentType === 'tv' ? '/api/tv/user-preferences/' : '/api/movies/user-preferences/';
                const detailsResponse = await axios.get(detailsEndpoint + movieId);
                const prefResponse = await axios.get(prefEndpoint + movieId);

                this.movie = {
                    ...detailsResponse.data,
                    ...prefResponse.data
                };

                this.selectedRating = this.movie.user_rating || 0;
                this.isWatched = [1, 3].includes(this.movie.watch_status);
                this.isSaved = [2, 3].includes(this.movie.watch_status);
            } catch (error) {
                console.error('Failed to fetch movie details:', error);
            } finally {
                this.isLoading = false;
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
            return this.isDescExpanded || description.length <= 215
                ? description
                : description.substring(0, 212) + '...';
        },

        // Star rating hover image logic
        getStarImage(index) {
            const rating = this.hoverRating || this.selectedRating;
            if (rating >= index + 1) return '/images/full-star.svg';
            if (rating >= index + 0.5) return '/images/half-star.svg';
            return '/images/hollow-star.svg';
        },

        // Handle hover for star rating
        onHover(index, event) {
            const isLeftHalf = event.clientX - event.target.getBoundingClientRect().left < event.target.offsetWidth / 2;
            this.hoverRating = index + (isLeftHalf ? 0.5 : 1);
        },
        clearHover() {
            this.hoverRating = 0;
        },

        // Select rating and send to backend
        async selectRating(index, event) {
            const isLeftHalf = event.clientX - event.target.getBoundingClientRect().left < event.target.offsetWidth / 2;
            this.selectedRating = index + (isLeftHalf ? 0.5 : 1);

            if (!this.checkLoginStatus()) return;
            await submitUserRating(this.selectedRating);
        },

        // Determine watch status code
        calculateWatchStatus() {
            let status = 0;
            if (this.isWatched) status += 1;
            if (this.isSaved) status += 2;
            return status;
        },

        // Toggle saved state
        async toggleSaved() {
            if (!this.checkLoginStatus()) return;
            this.isSaved = !this.isSaved;
            await sendMovieData(true, this.calculateWatchStatus());
        },

        // Toggle watched state
        async toggleWatched() {
            if (!this.checkLoginStatus()) return;
            this.isWatched = !this.isWatched;
            await sendMovieData(true, this.calculateWatchStatus());
        },

        // Toggle full/short description
        toggleDescription() {
            this.isDescExpanded = !this.isDescExpanded;
        },

        // Open YouTube trailer
        openTrailer() {
            if (this.movie.trailer) {
                window.open(this.movie.trailer);
            }
        },

        // Navigate back to previous page
        goBack() {
            window.history.back();
        },

        // Check and set login status
        async updateLoginStatus() {
            this.isLoggedIn = await isUserLoggedIn();
        },

        // Alert if not logged in
        checkLoginStatus() {
            if (this.contentType === 'tv') {
                alert('Currently unavailable for TV shows.');
                return false;
            }
            if (!this.isLoggedIn) {
                alert('Please log in to perform this action.');
                return false;
            }
            return true;
        }
    },
    mounted() {
        if (movieId) {
            this.fetchMovieData();
        } else {
            console.error('Movie ID not found in URL');
        }
        this.updateLoginStatus();
    }
}).mount('#movie');
