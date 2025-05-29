async function helperGetMovies(url) {
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
            topRatedSi: 0
        };
    },
    methods: {
        redirect(path) {
            // const searchLink = (this.isTVShows ? "/api/TV-shows/TV-show/" : "/api/movies/movie/");
            // window.location.href = searchLink + path;
            window.location.href = `moviepage.html?id=${path}`;
        },
        async searchMovies(searchQuery) {
            if (searchQuery.length <= 3) {
                this.showSearchResult = false;
                return;
            }

            const searchLink = (this.isTVShows ? "/api/TV-shows/search?q=" : "/api/movies/search?q=");
            // eslint-disable-next-line max-len
            this.searchResults = await helperGetMovies(searchLink + encodeURIComponent(searchQuery));
            this.showSearchResult = this.searchResults.length > 0;
        },
        async getTrending() {
            const url = (this.isTVShows ? "/api/TV-shows/trending" : "/api/movies/trending");
            this.trending = await helperGetMovies(url);
        },
        async getNowPlaying() {
            const url = this.isTVShows ? "/api/TV-shows/now-playing" : "/api/movies/now-playing";
            this.nowPlaying = await helperGetMovies(url);
        },
        async getTopRated() {
            const url = this.isTVShows ? "/api/TV-shows/top-rated" : "/api/movies/top-rated";
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
            this.getTrending();
            this.getNowPlaying();
            this.getTopRated();
        }
    },
    computed: {
        loadTrending() {
            let si = this.trendingSi;
            let en = this.mod(si + 5, this.trending.length);

            // console.log(si, en, this.trending.length);

            if (si < en) {
                return this.trending.slice(si, en);
            }
            // otherwise
            return this.trending.slice(si, this.trending.length).concat(this.trending.slice(0, en));
        },
        loadNowPlaying() {
            const len = this.nowPlaying.length;
            const si = this.mod(this.nowPlayingSi, len); const en = this.mod(si + 5, len);
            // eslint-disable-next-line max-len
            return si < en ? this.nowPlaying.slice(si, en) : this.nowPlaying.slice(si).concat(this.nowPlaying.slice(0, en));
        },
        loadTopRated() {
            const len = this.topRated.length;
            const si = this.mod(this.topRatedSi, len); const en = this.mod(si + 5, len);
            // eslint-disable-next-line max-len
            return si < en ? this.topRated.slice(si, en) : this.topRated.slice(si).concat(this.topRated.slice(0, en));
        }
    },
    mounted() {
        this.getTrending();
        this.getNowPlaying();
        this.getTopRated();
    }
}).mount('#homepage');
