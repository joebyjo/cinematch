const bcrypt = require('bcrypt');
const db = require('./db');

const SALT_ROUNDS = 10;

function hashPassword(password) {
    return bcrypt.hash(password, SALT_ROUNDS);
}

function comparePassword(plainText, hash) {
    return bcrypt.compare(plainText, hash);
}

async function insertMovie(movieData) {
    try {
        // check if movie already exists
        const [existingMovie] = await db.query('SELECT id FROM MOVIES WHERE id = ?', [movieData.id]);

        if (existingMovie.length === 0) {
            // insert the movie
            await db.query(
                `INSERT INTO MOVIES
                (id, title, director, cast, imdb_id, original_language, overview, release_date, imdb_rating, rotten_rating, metacritic_rating, poster_url, backdrop_url, trailer_url, run_time, certification)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    movieData.id,
                    movieData.title,
                    movieData.director || null,
                    movieData.cast || null,
                    movieData.imdb_id || null,
                    movieData.original_language || null,
                    movieData.overview || null,
                    movieData.release_date || null,
                    movieData.imdb_rating || null,
                    movieData.rotten_rating || null,
                    movieData.metacritic_rating || null,
                    movieData.poster_path || null,
                    movieData.backdrop_path || null,
                    movieData.trailer || null,
                    movieData.runtime || null,
                    movieData.certification || null
                ]
            );

            // add corresponding genres to MOVIEGENRES table
            movieData.genres.forEach(async (genre) => {
                db.query("INSERT INTO MOVIEGENRES (movie_id,genre_id) VALUES (?, ?)",[movieData.id,genre.id]);
            });

        }
    } catch (err) {
        console.error('Error inserting movie:', err.message);
        throw err;
    }
}

async function getMovieData(movieId) {
    try {
        // get movie details
        const [movieRows] = await db.query('SELECT * FROM MOVIES WHERE id = ?', [movieId]);
        if (movieRows.length === 0) {
            throw new Error('Movie not found');
        }
        const movie = movieRows[0];

        // get genres for the movie
        const [genreRows] = await db.query(
            `SELECT G.id, G.name
             FROM GENRES G
             JOIN MOVIEGENRES MG ON G.id = MG.genre_id
             WHERE MG.movie_id = ?`,
             [movieId]
        );

        // assemble movieData
        const movieData = {
            id: movie.id,
            imdb_id: movie.imdb_id,
            original_language: movie.original_language,
            overview: movie.overview,
            title: movie.title,
            runtime: movie.run_time,
            poster_path: movie.poster_url,
            backdrop_path: movie.backdrop_url,
            genres: genreRows  || null,
            certification: movie.certification,
            release_date: new Date(movie.release_date).toISOString().split('T')[0] || null,
            trailer: movie.trailer_url,
            director: movie.director,
            cast: movie.cast,
            imdb_rating: movie.imdb_rating,
            rotten_rating: movie.rotten_rating,
            metacritic_rating: movie.metacritic_rating
        };

        return movieData;
    } catch (err) {
        console.error('Error retrieving movie:', err.message);
        throw err;
    }
}



module.exports = {
    hashPassword,
    comparePassword,
    insertMovie,
    getMovieData
};
