// get movie id from url
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

const app = Vue.createApp({
  data() {
    return {
      movie: {},
      selectedRating: 0,
      hoverRating: 0,
      isSaved: false,
      isWatched: false
    };
  },
  methods: {
    async fetchMovieData() {
        try {
            const response = await axios.get('/api/movies/movie/' + movieId);
            this.movie = response.data;
        } catch (error) {
            console.log("Error fetching movie details:", error);
        }
    },
    formatRuntime(m) {
        if (!m) return 'N/A';
        return m + ' min';
    },
    formatGenres(genres) {
        if (!genres || genres.length === 0) return 'N/A';
        return genres.map(function (g) {
          return g.name;
        }).join(' · ');
    },
    formatCast(cast) {
        return cast || 'N/A';
    },
    getStarImage(index) {
      const current = this.hoverRating || this.selectedRating;
      if (current >= index+1) return 'images/full-star.svg';
      if (current >= index+0.5) return 'images/half-star.svg';
      return 'images/hollow-star.svg';
    },
    onHover(index, event) {
      const rect = event.target.getBoundingClientRect();
      const isHalf = event.clientX - rect.left < rect.width/2;
      this.hoverRating = index + (isHalf?0.5:1);
    },
    clearHover() {
      this.hoverRating = 0;
    },
    selectRating(index, event) {
      const rect = event.target.getBoundingClientRect();
      const isHalf = event.clientX - rect.left < rect.width/2;
      this.selectedRating = index + (isHalf?0.5:1);
    },
    toggleSaved() {
      this.isSaved = !this.isSaved;
    },
    toggleWatched() {
      this.isWatched = !this.isWatched;
    }
  },
    mounted() {
      if (movieId) {
        this.fetchMovieData();
      } else {
        console.error('No movie ID provided');
      }
    }
}).mount('#movie');
