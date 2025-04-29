function helperSearchMovies(searchQuery) {
    // get the seaerch result from the movies link
    return [{
        id: "1",
        title: "hiten"
    },
    {
        id: "2",
        title: "joe"
    }];
}

createApp({
    data() {
        return {
            searchResults: [],
            showSearchResult: false
        };
    },
    methods: {
        redirect(path) {
            window.location.href = path;
        },
        searchMovies(searchQuery) {
            if (searchQuery === "") {
                this.showSearchResult = false;
                return;
            }

            this.showSearchResult = true;
            this.searchResults = helperSearchMovies(searchQuery);
        }
    },
    mounted() {

    }
}).mount('#homepage');
