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
      isWatched: false,
      fullTitle: ''
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
        const hrs = Math.floor(m/60);
        const mins = m % 60;
        return `${hrs} hr ${mins} min`;
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
    formatProviders(providers) {
        if (!providers || providers.length === 0) return ['No data available'];
        return providers.map(function (p) {
            return p.provider_name;
        });
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
