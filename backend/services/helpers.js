const bcrypt = require('bcrypt');
const db = require('./db');

const SALT_ROUNDS = 10;

function hashPassword(password) {
    return bcrypt.hashSync(password, SALT_ROUNDS);
}

function comparePassword(plainText, hash) {
    return bcrypt.compareSync(plainText, hash);
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
                db.query("INSERT INTO MOVIEGENRES (movie_id,genre_id) VALUES (?, ?)", [movieData.id, genre.id]);
            });

            // add corresponding watch providers to MOVIEPROVIDERS table
            for (const provider of movieData.watch_providers || []) {
                db.query("INSERT INTO MOVIEPROVIDERS (movie_id, provider_id) VALUES (?, ?)", [movieData.id, provider.provider_id]);
            }

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
            return false;
        }
        const movie = movieRows[0];

        // get genres and watch providers for the movie
        const [genreResult, providerResult] = await Promise.all([
            db.query(
                `SELECT G.id, G.name
                 FROM GENRES G
                 JOIN MOVIEGENRES MG ON G.id = MG.genre_id
                 WHERE MG.movie_id = ?`,
                [movieId]
            ),
            db.query(
                `SELECT P.id, P.provider_name, P.logo_path, P.display_priority
                 FROM WATCHPROVIDERS P
                 JOIN MOVIEPROVIDERS MP ON P.id = MP.provider_id
                 WHERE MP.movie_id = ?`,
                [movieId]
            )
        ]);

        const [genreRows] = genreResult;
        const [providerRows] = providerResult;

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
            genres: genreRows || null,
            certification: movie.certification,
            release_date: new Date(movie.release_date).toISOString().split('T')[0] || null,
            trailer: movie.trailer_url,
            director: movie.director,
            cast: movie.cast,
            imdb_rating: movie.imdb_rating,
            rotten_rating: movie.rotten_rating,
            metacritic_rating: movie.metacritic_rating,
            watch_providers: providerRows || null
        };

        return movieData;
    } catch (err) {
        console.error('Error retrieving movie:', err.message);
        throw err;
    }
}


function formatMovies(rows) {
    const movieMap = {};

    // Check if the fields are present in the query
    const hasGenres = rows.length > 0 && 'genre_id' in rows[0] && 'genre_name' in rows[0];
    const hasProviders = rows.length > 0 && 'watchprovider_id' in rows[0] && 'watchprovider_name' in rows[0];

    for (const row of rows) {
        const key = row.title + row.release_date;

        if (!movieMap[key]) {
            movieMap[key] = { ...row };

            if (hasGenres) movieMap[key].genres = [];
            if (hasProviders) movieMap[key].watch_providers = [];

            // Clean up fields used for arrays
            if (hasGenres) {
                delete movieMap[key].genre_id;
                delete movieMap[key].genre_name;
            }

            if (hasProviders) {
                delete movieMap[key].watchprovider_id;
                delete movieMap[key].watchprovider_name;
                delete movieMap[key].watchprovider_logo_path;
                delete movieMap[key].watchprovider_priority;
            }
        }

        if (hasGenres && row.genre_id && row.genre_name) {
            const genreExists = movieMap[key].genres.some((g) => g.id === row.genre_id);
            if (!genreExists) {
                movieMap[key].genres.push({
                    id: row.genre_id,
                    name: row.genre_name
                });
            }
        }

        if (hasProviders && row.watchprovider_id && row.watchprovider_name) {
            const providerExists = movieMap[key].watch_providers.some(
                (wp) => wp.id === row.watchprovider_id
            );

            if (!providerExists) {
                movieMap[key].watch_providers.push({
                    id: row.watchprovider_id,
                    name: row.watchprovider_name,
                    logo_path: row.watchprovider_logo_path,
                    display_priority: row.watchprovider_priority
                });
            }
        }
    }

    return Object.values(movieMap);
}



async function getGenreData() {
    try {
        const [rows] = await db.query('SELECT id, name FROM GENRES');
        return rows;
    } catch (err) {
        console.error(err);
    }
}


module.exports = {
    hashPassword,
    comparePassword,
    insertMovie,
    getMovieData,
    formatMovies,
    getGenreData
};
