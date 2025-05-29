const app = Vue.createApp({
  data() {
    return {
      selectedRating: 0,
      hoverRating: 0,
      isSaved: false,
      isWatched: false
    };
  },
  methods: {
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
  }
});
app.mount('#movie');
