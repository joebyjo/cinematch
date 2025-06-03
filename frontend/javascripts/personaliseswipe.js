// eslint-disable-next-line no-undef
document.body.style.display = "block";


document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    // Show button if page is scrolled down 200px
    btn.style.display = window.scrollY > 200 ? 'block' : 'none';
  });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});


const swipeApp = Vue.createApp({
  data() {
    return {
      movies: [],
      currentIndex: 0,
      isLoading: true,
      isTV: false
    };
  },
  computed: {
    currentMovie() {
      return this.movies[this.currentIndex] || {};
    }
  },
  methods: {
    async fetchMovies() {
      this.isLoading = true;
      try {
        const res = await axios.get(`/api/recommendations?type=${this.isTV ? 'tv' : 'movie'}`);
        this.movies = res.data || [];
      } catch (err) {
        console.error("Failed to fetch recommendations:", err.message);
      } finally {
        this.isLoading = false;
      }
    },
    likeMovie() {
      this.sendSwipe("like");
    },
    skipMovie() {
      this.sendSwipe("skip");
    },
    sendSwipe(action) {
      const movie = this.currentMovie;
      if (!movie || !movie.id) return;

      axios.post("/api/swipe", {
        movie_id: movie.id,
        action: action
      }).catch((err) => {
        console.error("Swipe failed:", err);
      });

      this.currentIndex++;
    },
    toggleType() {
      this.isTV = !this.isTV;
      this.currentIndex = 0;
      this.fetchMovies();
    }
  },
  mounted() {
    this.fetchMovies();
  }
});


function matchPanelDimensions() {
  const left = document.querySelector('.left-panel');
  const right = document.querySelector('.right-panel');

  // Reset any previously set widths/heights so we can recalculate cleanly
  left.style.height = right.style.height = 'auto';
  left.style.width = right.style.width = 'auto';

  // Get max dimensions
  const maxHeight = Math.max(left.scrollHeight, right.scrollHeight);
  const maxWidth = Math.max(left.scrollWidth, right.scrollWidth);

  // Apply to both panels
  left.style.height = right.style.height = `${maxHeight}px`;
  left.style.width = right.style.width = `${maxWidth}px`;
}

// Run on load and when window resizes
window.addEventListener('load', matchPanelDimensions);
window.addEventListener('resize', matchPanelDimensions);

