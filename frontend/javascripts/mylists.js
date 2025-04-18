const movieTable = Vue.createApp({
    data() {
        return {
            movieData: [
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
                }
            ]
        };
    },
    methods: {
        Sort(e) {
            // Sorts the data
            if (e === "uh") {
                this.movieData.sort(function(a, b) {
                    // Comparison logic here
                    if (a.UserRating < b.UserRating) {
                      return 1; // a comes after b
                    }
                    return -1; // a comes before b
                  });
            } else if (e === "ul") {
                this.movieData.sort(function(a, b) {
                    // Comparison logic here
                    if (a.UserRating < b.UserRating) {
                      return -1; // a comes after b
                    }
                    return 1; // a comes before b
                  });
            } else if (e === "ih") {
                this.movieData.sort(function(a, b) {
                    // Comparison logic here
                    if (a.IMDbRating < b.IMDbRating) {
                      return 1; // a comes after b
                    }
                    return -1; // a comes before b
                  });
            } else if (e === "il") {
                this.movieData.sort(function(a, b) {
                    // Comparison logic here
                    if (a.IMDbRating < b.IMDbRating) {
                      return -1; // a comes after b
                    }
                    return 1; // a comes before b
                  });
            }
        },
        draw(n) {
            // draws star in rating
            var rating = "";
            for (let i = 0; i < n; i++) {
                rating += "⭐";
            }
            return rating;
        }
    },
    mounted() {}
});

movieTable.mount('.main-mylists');
