const { createApp } = Vue;

createApp({
    data() {
        return {
            dropdowns: {
                theme: false,
                languages: false,
                genres: false
            },
            selectedTheme: 'dark', // default

            // dummy data
            languages: [
                { id: 1, name: 'English', selected: false },
                { id: 2, name: 'Español', selected: false },
                { id: 3, name: 'Italiano', selected: false },
                { id: 4, name: 'Português', selected: false },
                { id: 5, name: 'French', selected: false },
                { id: 6, name: 'German', selected: false },
                { id: 7, name: 'Hindi', selected: false }
            ],
            genres: [
                { id: 1, name: 'Action', selected: false },
                { id: 2, name: 'Adventure', selected: false },
                { id: 3, name: 'Animation', selected: false },
                { id: 4, name: 'Biography', selected: false },
                { id: 5, name: 'Comedy', selected: false },
                { id: 6, name: 'Crime', selected: false },
                { id: 7, name: 'Documentary', selected: false },
                { id: 8, name: 'Drama', selected: false },
                { id: 9, name: 'Family', selected: false },
                { id: 10, name: 'Fantasy', selected: false }
            ]
        };
    },
    methods: {
        toggleDropdown(type) {
            this.dropdowns[type] = !this.dropdowns[type];
        },
        selectTheme(theme) {
            this.selectedTheme = theme;
        },
        toggleLanguage(languageId) {
            const language = this.languages.find((lang) => lang.id === languageId);
            if (language) {
                language.selected = !language.selected;
            }
        },
        toggleGenre(genreId) {
            const genre = this.genres.find((gen) => gen.id === genreId);
            if (genre) {
                genre.selected = !genre.selected;
            }
        }
    }
}).mount('#settings');
