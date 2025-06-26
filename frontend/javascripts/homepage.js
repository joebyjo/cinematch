/* eslint-disable no-undef */
/* eslint-disable max-len */
// get movies from api
async function helperGetMovies(url) {
    try {
        const res = await axios.get(url); // send get request
        return res.data;
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Error retrieving data from server", e);
        return [];
    }
}

// eslint-disable-next-line no-undef
createApp({
    data() {
        return {
            searchResults: [],
            showSearchResult: false,
            isTVShows: false,

            trending: [],
            trendingSi: 0,

            nowPlaying: [],
            nowPlayingSi: 0,

            topRated: [],
            topRatedSi: 0,

            isLoading: true
        };
    },
    methods: {
        redirect(path) {
            // old path
            // window.location.href = `moviepage.html?id=${path}&type=${this.isTVShows ? 'tv' : 'movie'}`;

            // build url and redirect for tv show and movie
            const searchLink = (this.isTVShows ? "/tv/" : "/movie/");
            window.location.href = searchLink + path;
        },
        async searchMovies(searchQuery) {
            if (searchQuery.length <= 3) {
                this.showSearchResult = false;
                return;
            }
            // fetch search results
            const searchLink = (this.isTVShows ? "/api/tv/search?q=" : "/api/movies/search?q=");
            // eslint-disable-next-line max-len
            this.searchResults = await helperGetMovies(searchLink + encodeURIComponent(searchQuery));
            this.showSearchResult = this.searchResults.length > 0;
        },
        async getTrending() {
            // fetch trending items
            const url = (this.isTVShows ? "/api/tv/trending" : "/api/movies/trending");
            this.trending = await helperGetMovies(url);
        },
        async getNowPlaying() {
            // fetch now playing items
            const url = this.isTVShows ? "/api/tv/now-airing" : "/api/movies/now-playing";
            this.nowPlaying = await helperGetMovies(url);
        },
        async getTopRated() {
            // fetch top rated items
            const url = this.isTVShows ? "/api/tv/top-rated" : "/api/movies/top-rated";
            this.topRated = await helperGetMovies(url);
        },
        mod(n, m) {
            return ((n % m) + m) % m;
        },
        focusOut() {
            setTimeout(() => {
                this.showSearchResult = false;
            }, 300);
        }
    },
    watch: {
        isTVShows() {
            // refetch data when type toggled
            this.getTrending();
            this.getNowPlaying();
            this.getTopRated();
        }
    },
    computed: {
        loadTrending() {
            // get current 5 trending items
            let si = this.trendingSi;
            let en = this.mod(si + 5, this.trending.length);

            if (si < en) {
                return this.trending.slice(si, en);
            }
            // otherwise
            return this.trending.slice(si, this.trending.length).concat(this.trending.slice(0, en));
        },
        loadNowPlaying() {
            // get current 5 now playing items
            const len = this.nowPlaying.length;
            const si = this.mod(this.nowPlayingSi, len); const en = this.mod(si + 5, len);
            // eslint-disable-next-line max-len
            return si < en ? this.nowPlaying.slice(si, en) : this.nowPlaying.slice(si).concat(this.nowPlaying.slice(0, en));
        },
        loadTopRated() {
            // get current 5 top rated items
            const len = this.topRated.length;
            const si = this.mod(this.topRatedSi, len); const en = this.mod(si + 5, len);
            // eslint-disable-next-line max-len
            return si < en ? this.topRated.slice(si, en) : this.topRated.slice(si).concat(this.topRated.slice(0, en));
        },

        async init() {
            this.isLoading = true;
            await this.getTrending();
            await this.getNowPlaying();
            await this.getTopRated();
            this.isLoading = false;
        }
    },
    mounted() {
        this.init(); // start loading
    }
}).mount('#homepage');
