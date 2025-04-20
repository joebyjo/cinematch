// helper functions

function helperSort(e, movieData) { // Sorting the movies
    if (e === "uh") {
        movieData.sort((a, b) => Number(b.UserRating) - Number(a.UserRating));
    } else if (e === "ul") {
        movieData.sort((a, b) => Number(a.UserRating) - Number(b.UserRating));
    } else if (e === "ih") {
        movieData.sort((a, b) => Number(b.IMDbRating) - Number(a.IMDbRating));
    } else if (e === "il") {
        movieData.sort((a, b) => Number(a.IMDbRating) - Number(b.IMDbRating));
    }

    return movieData;
}

function helperDraw(n) { // drawing the star ratings
    // draws star in rating
    var rating = "";
    for (let i = 0; i < n; i++) {
        rating += "⭐";
    }
    return rating;
}

function helperLoadLimitArray(len) {
    // creating a load limit array
    let arr = [10];
    let i;
    for (i = 50; i < len + 40; i += 50) {
        arr.push(i);
    }

    return arr;
}

// getting the movieData from server
function getMovieData() {
    return [
        {
            Name: "Inception",
            Genre: "Action, Sci-Fi, Thriller",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.8",
            AgeRating: "PG-13",
            UserRating: "4"
        },
        {
            Name: "Interstellar",
            Genre: "Adventure, Sci-Fi",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.7",
            AgeRating: "PG-13",
            UserRating: "2"
        },
        {
            Name: "Stranger Things",
            Genre: "Drama, Fantasy, Horror",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.7",
            AgeRating: "PG-13",
            UserRating: "3"
        },
        {
            Name: "The Shawshank Redemption",
            Genre: "Drama",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "9.3",
            AgeRating: "R",
            UserRating: "5"
        },
        {
            Name: "The Godfather",
            Genre: "Crime, Drama",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "9.2",
            AgeRating: "R",
            UserRating: "5"
        },
        {
            Name: "Pulp Fiction",
            Genre: "Crime, Drama",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.9",
            AgeRating: "R",
            UserRating: "4"
        },
        {
            Name: "The Dark Knight",
            Genre: "Action, Crime, Drama",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "9.0",
            AgeRating: "PG-13",
            UserRating: "5"
        },
        {
            Name: "Spirited Away",
            Genre: "Animation, Adventure, Family",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.6",
            AgeRating: "PG",
            UserRating: "4"
        },
        {
            Name: "Parasite",
            Genre: "Comedy, Drama, Thriller",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.5",
            AgeRating: "R",
            UserRating: "4"
        },
        {
            Name: "Avengers: Endgame",
            Genre: "Action, Adventure, Sci-Fi",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.4",
            AgeRating: "PG-13",
            UserRating: "4"
        },
        {
            Name: "La La Land",
            Genre: "Comedy, Drama, Music",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.0",
            AgeRating: "PG-13",
            UserRating: "3"
        },
        {
            Name: "Arrival",
            Genre: "Drama, Mystery, Sci-Fi",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "7.9",
            AgeRating: "PG-13",
            UserRating: "4"
        },
        {
            Name: "Fight Club",
            Genre: "Drama",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.8",
            AgeRating: "R",
            UserRating: "5"
        },
        {
            Name: "Forrest Gump",
            Genre: "Comedy, Drama, Romance",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.8",
            AgeRating: "PG-13",
            UserRating: "5"
        },
        {
            Name: "The Matrix",
            Genre: "Action, Sci-Fi",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.7",
            AgeRating: "R",
            UserRating: "4"
        },
        {
            Name: "Seven Samurai",
            Genre: "Action, Adventure, Drama",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.6",
            AgeRating: "Not Rated",
            UserRating: "5"
        },
        {
            Name: "Whiplash",
            Genre: "Drama, Music",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.5",
            AgeRating: "R",
            UserRating: "4"
        },
        {
            Name: "The Lion King",
            Genre: "Animation, Adventure, Drama",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.5",
            AgeRating: "G",
            UserRating: "4"
        },
        {
            Name: "Gladiator",
            Genre: "Action, Adventure, Drama",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.5",
            AgeRating: "R",
            UserRating: "4"
        },
        {
            Name: "The Departed",
            Genre: "Crime, Drama, Thriller",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.5",
            AgeRating: "R",
            UserRating: "4"
        },
        {
            Name: "Back to the Future",
            Genre: "Adventure, Comedy, Sci-Fi",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.5",
            AgeRating: "PG",
            UserRating: "4"
        },
        {
            Name: "Eternal Sunshine of the Spotless Mind",
            Genre: "Drama, Romance, Sci-Fi",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.3",
            AgeRating: "R",
            UserRating: "4"
        },
        {
            Name: "Memento",
            Genre: "Mystery, Thriller",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.4",
            AgeRating: "R",
            UserRating: "4"
        },
        {
            Name: "Raiders of the Lost Ark",
            Genre: "Action, Adventure",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.4",
            AgeRating: "PG",
            UserRating: "4"
        },
        {
            Name: "WALL·E",
            Genre: "Animation, Adventure, Comedy",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.4",
            AgeRating: "G",
            UserRating: "4"
        },
        {
            Name: "The Prestige",
            Genre: "Drama, Mystery, Sci-Fi",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.5",
            AgeRating: "PG-13",
            UserRating: "4"
        },
        {
            Name: "Inglourious Basterds",
            Genre: "Adventure, Drama, War",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.3",
            AgeRating: "R",
            UserRating: "4"
        },
        {
            Name: "The Green Mile",
            Genre: "Crime, Drama, Fantasy",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.6",
            AgeRating: "R",
            UserRating: "5"
        },
        {
            Name: "Se7en",
            Genre: "Crime, Drama, Mystery",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.6",
            AgeRating: "R",
            UserRating: "4"
        },
        {
            Name: "Good Will Hunting",
            Genre: "Drama",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.3",
            AgeRating: "R",
            UserRating: "4"
        },
        {
            Name: "Reservoir Dogs",
            Genre: "Crime, Thriller",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.3",
            AgeRating: "R",
            UserRating: "4"
        },
        {
            Name: "Amélie",
            Genre: "Comedy, Fantasy, Romance",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.3",
            AgeRating: "R",
            UserRating: "4"
        },
        {
            Name: "Django Unchained",
            Genre: "Drama, Western",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.4",
            AgeRating: "R",
            UserRating: "4"
        },
        {
            Name: "Guardians of the Galaxy",
            Genre: "Action, Adventure, Comedy",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.0",
            AgeRating: "PG-13",
            UserRating: "4"
        },
        {
            Name: "The Social Network",
            Genre: "Biography, Drama",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "7.7",
            AgeRating: "PG-13",
            UserRating: "4"
        },
        {
            Name: "Oldboy",
            Genre: "Action, Drama, Mystery",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.4",
            AgeRating: "R",
            UserRating: "4"
        },
        {
            Name: "Princess Mononoke",
            Genre: "Animation, Action, Adventure",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.4",
            AgeRating: "PG-13",
            UserRating: "4"
        },
        {
            Name: "The Usual Suspects",
            Genre: "Crime, Mystery, Thriller",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.5",
            AgeRating: "R",
            UserRating: "4"
        },
        {
            Name: "Casablanca",
            Genre: "Drama, Romance, War",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.5",
            AgeRating: "PG",
            UserRating: "5"
        },
        {
            Name: "Psycho",
            Genre: "Horror, Mystery, Thriller",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.5",
            AgeRating: "R",
            UserRating: "4"
        },
        {
            Name: "City Lights",
            Genre: "Comedy, Drama, Romance",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.5",
            AgeRating: "G",
            UserRating: "5"
        },
        {
            Name: "Modern Times",
            Genre: "Comedy, Drama, Family",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.5",
            AgeRating: "G",
            UserRating: "5"
        },
        {
            Name: "Once Upon a Time in the West",
            Genre: "Western",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.5",
            AgeRating: "PG-13",
            UserRating: "4"
        },
        {
            Name: "Rear Window",
            Genre: "Mystery, Thriller",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.4",
            AgeRating: "PG",
            UserRating: "4"
        },
        {
            Name: "Sunset Boulevard",
            Genre: "Drama, Film-Noir",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.4",
            AgeRating: "Not Rated",
            UserRating: "4"
        },
        {
            Name: "Lawrence of Arabia",
            Genre: "Adventure, Biography, Drama",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.3",
            AgeRating: "PG",
            UserRating: "4"
        },
        {
            Name: "Lawrence of Arabia",
            Genre: "Adventure, Biography, Drama",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.3",
            AgeRating: "PG",
            UserRating: "4"
        },

        {
            Name: "Inception",
            Genre: "Action, Sci-Fi, Thriller",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.8",
            AgeRating: "PG-13",
            UserRating: "4"
        },
        {
            Name: "Interstellar",
            Genre: "Adventure, Sci-Fi",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.7",
            AgeRating: "PG-13",
            UserRating: "2"
        },
        {
            Name: "Stranger Things",
            Genre: "Drama, Fantasy, Horror",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.7",
            AgeRating: "PG-13",
            UserRating: "3"
        },
        {
            Name: "The Shawshank Redemption",
            Genre: "Drama",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "9.3",
            AgeRating: "R",
            UserRating: "5"
        },
        {
            Name: "The Godfather",
            Genre: "Crime, Drama",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "9.2",
            AgeRating: "R",
            UserRating: "5"
        },
        {
            Name: "Pulp Fiction",
            Genre: "Crime, Drama",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.9",
            AgeRating: "R",
            UserRating: "4"
        },
        {
            Name: "The Dark Knight",
            Genre: "Action, Crime, Drama",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "9.0",
            AgeRating: "PG-13",
            UserRating: "5"
        },
        {
            Name: "Spirited Away",
            Genre: "Animation, Adventure, Family",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.6",
            AgeRating: "PG",
            UserRating: "4"
        },
        {
            Name: "Parasite",
            Genre: "Comedy, Drama, Thriller",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.5",
            AgeRating: "R",
            UserRating: "4"
        },
        {
            Name: "Avengers: Endgame",
            Genre: "Action, Adventure, Sci-Fi",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.4",
            AgeRating: "PG-13",
            UserRating: "4"
        },
        {
            Name: "La La Land",
            Genre: "Comedy, Drama, Music",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.0",
            AgeRating: "PG-13",
            UserRating: "3"
        },
        {
            Name: "Arrival",
            Genre: "Drama, Mystery, Sci-Fi",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "7.9",
            AgeRating: "PG-13",
            UserRating: "4"
        },
        {
            Name: "Fight Club",
            Genre: "Drama",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.8",
            AgeRating: "R",
            UserRating: "5"
        },
        {
            Name: "Forrest Gump",
            Genre: "Comedy, Drama, Romance",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.8",
            AgeRating: "PG-13",
            UserRating: "5"
        },
        {
            Name: "The Matrix",
            Genre: "Action, Sci-Fi",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.7",
            AgeRating: "R",
            UserRating: "4"
        },
        {
            Name: "Seven Samurai",
            Genre: "Action, Adventure, Drama",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.6",
            AgeRating: "Not Rated",
            UserRating: "5"
        },
        {
            Name: "Whiplash",
            Genre: "Drama, Music",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.5",
            AgeRating: "R",
            UserRating: "4"
        },
        {
            Name: "The Lion King",
            Genre: "Animation, Adventure, Drama",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.5",
            AgeRating: "G",
            UserRating: "4"
        },
        {
            Name: "Gladiator",
            Genre: "Action, Adventure, Drama",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.5",
            AgeRating: "R",
            UserRating: "4"
        },
        {
            Name: "The Departed",
            Genre: "Crime, Drama, Thriller",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.5",
            AgeRating: "R",
            UserRating: "4"
        },
        {
            Name: "Back to the Future",
            Genre: "Adventure, Comedy, Sci-Fi",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.5",
            AgeRating: "PG",
            UserRating: "4"
        },
        {
            Name: "Eternal Sunshine of the Spotless Mind",
            Genre: "Drama, Romance, Sci-Fi",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.3",
            AgeRating: "R",
            UserRating: "4"
        },
        {
            Name: "Memento",
            Genre: "Mystery, Thriller",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.4",
            AgeRating: "R",
            UserRating: "4"
        },
        {
            Name: "Raiders of the Lost Ark",
            Genre: "Action, Adventure",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.4",
            AgeRating: "PG",
            UserRating: "4"
        },
        {
            Name: "WALL·E",
            Genre: "Animation, Adventure, Comedy",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.4",
            AgeRating: "G",
            UserRating: "4"
        },
        {
            Name: "The Prestige",
            Genre: "Drama, Mystery, Sci-Fi",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.5",
            AgeRating: "PG-13",
            UserRating: "4"
        },
        {
            Name: "Inglourious Basterds",
            Genre: "Adventure, Drama, War",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.3",
            AgeRating: "R",
            UserRating: "4"
        },
        {
            Name: "The Green Mile",
            Genre: "Crime, Drama, Fantasy",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.6",
            AgeRating: "R",
            UserRating: "5"
        },
        {
            Name: "Se7en",
            Genre: "Crime, Drama, Mystery",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.6",
            AgeRating: "R",
            UserRating: "4"
        },
        {
            Name: "Good Will Hunting",
            Genre: "Drama",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.3",
            AgeRating: "R",
            UserRating: "4"
        },
        {
            Name: "Reservoir Dogs",
            Genre: "Crime, Thriller",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.3",
            AgeRating: "R",
            UserRating: "4"
        },
        {
            Name: "Amélie",
            Genre: "Comedy, Fantasy, Romance",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.3",
            AgeRating: "R",
            UserRating: "4"
        },
        {
            Name: "Django Unchained",
            Genre: "Drama, Western",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.4",
            AgeRating: "R",
            UserRating: "4"
        },
        {
            Name: "Guardians of the Galaxy",
            Genre: "Action, Adventure, Comedy",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.0",
            AgeRating: "PG-13",
            UserRating: "4"
        },
        {
            Name: "The Social Network",
            Genre: "Biography, Drama",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "7.7",
            AgeRating: "PG-13",
            UserRating: "4"
        },
        {
            Name: "Oldboy",
            Genre: "Action, Drama, Mystery",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.4",
            AgeRating: "R",
            UserRating: "4"
        },
        {
            Name: "Princess Mononoke",
            Genre: "Animation, Action, Adventure",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.4",
            AgeRating: "PG-13",
            UserRating: "4"
        },
        {
            Name: "The Usual Suspects",
            Genre: "Crime, Mystery, Thriller",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.5",
            AgeRating: "R",
            UserRating: "4"
        },
        {
            Name: "Casablanca",
            Genre: "Drama, Romance, War",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.5",
            AgeRating: "PG",
            UserRating: "5"
        },
        {
            Name: "Psycho",
            Genre: "Horror, Mystery, Thriller",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.5",
            AgeRating: "R",
            UserRating: "4"
        },
        {
            Name: "City Lights",
            Genre: "Comedy, Drama, Romance",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.5",
            AgeRating: "G",
            UserRating: "5"
        },
        {
            Name: "Modern Times",
            Genre: "Comedy, Drama, Family",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.5",
            AgeRating: "G",
            UserRating: "5"
        },
        {
            Name: "Once Upon a Time in the West",
            Genre: "Western",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.5",
            AgeRating: "PG-13",
            UserRating: "4"
        },
        {
            Name: "Rear Window",
            Genre: "Mystery, Thriller",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.4",
            AgeRating: "PG",
            UserRating: "4"
        },
        {
            Name: "Sunset Boulevard",
            Genre: "Drama, Film-Noir",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.4",
            AgeRating: "Not Rated",
            UserRating: "4"
        },
        {
            Name: "Lawrence of Arabia",
            Genre: "Adventure, Biography, Drama",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.3",
            AgeRating: "PG",
            UserRating: "4"
        },
        {
            Name: "2001: A Space Odyssey",
            Genre: "Mystery, Sci-Fi",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.3",
            AgeRating: "G",
            UserRating: "4"
        },
        {
            Name: "Singin' in the Rain",
            Genre: "Comedy, Musical, Romance",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.3",
            AgeRating: "G",
            UserRating: "4"
        },
        {
            Name: "It's a Wonderful Life",
            Genre: "Drama, Family, Fantasy",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.6",
            AgeRating: "PG",
            UserRating: "5"
        },
        {
            Name: "The Silence of the Lambs",
            Genre: "Crime, Drama, Horror",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.6",
            AgeRating: "R",
            UserRating: "4"
        },
        {
            Name: "Saving Private Ryan",
            Genre: "Drama, War",
            Liked: "Yes",
            Watched: "Yes",
            IMDbRating: "8.6",
            AgeRating: "R",
            UserRating: "5"
        }
    ];
}


// Main Vue File
const movieTable = Vue.createApp({
    data() {
        return {
            movieData: [], // storing movieData
            loadLimit: 10, // how many movies to load at a time
            startingIndex: 0, // staring index to sho movies from
            showFilter: false
        };
    },
    methods: {
        Sort(e) {
            // Sorts the data
            this.movieData = helperSort(e, this.movieData);
        },
        drawStar(n) {
            return helperDraw(n);
        },
        changeLoadLimit(lim) {
            this.loadLimit = lim;
        },
        loadLimitArray() {
            return helperLoadLimitArray(this.movieData.length);
        },
        filterMenu() {
            this.showFilter = !this.showFilter;
        }
    },
    computed: {
        limitMovieData() {
            return this.movieData.slice(this.startingIndex, this.startingIndex + this.loadLimit);
        }
    },
    mounted() {
        this.movieData = getMovieData();
    }
});

movieTable.mount('.main-mylists');
// End of Vue Script
