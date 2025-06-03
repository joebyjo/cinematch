/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable no-use-before-define */
/* eslint-disable key-spacing */
/* eslint-disable no-multi-spaces */

// Import required helper functions
const {
    getUserGenresLanguages,
    getMovieData,
    getUserRating
} = require('./helpers');

const { tmdb } = require('../services/tmdb');
const db = require('./db');

// Algorithm configuration and mapping functions
const [
    CONFIG,
    getGenreIndex,
    getLanguagesIndex,
    getDecadesIndex,
    getImbdRatingIndex,
    getUserRatingIndex,
    getWatchProvidersIndex
] = require('./algo-mapping');

/**
 * Initializes a user vector based on favorite genres and languages
 * @param {string} userId
 * @returns {Promise<number[]>} user vector
 */
async function createUserVector(userId) {
    try {
        const info = await getUserGenresLanguages(userId);
        var vec = new Array(CONFIG.DIMENSIONS).fill(0);

        // console.log("Fuck" + " " + CONFIG.DIMENSIONS);
        // console.log(info);

        // Set 1 at genre indexes
        for (let i = 0; i < info.favorite_genres.length; i++) {
            const genre = info.favorite_genres[i];
            // console.log(genre);
            var index = getGenreIndex(genre);
            // console.log(index);
            vec[index] = 1;
        }

        // Set 1 at language indexes
        for (let i = 0; i < info.preferred_languages.length; i++) {
            const lang = info.preferred_languages[i];
            vec[getLanguagesIndex(lang)] = 1;
        }

        return vec;
    } catch (error) {
        console.error('Error in createUserVector:', error);
        return [];
    }
}

/**
 * Creates a movie vector based on movie attributes
 * @param {string} userId
 * @param {string} id - movie ID
 * @returns {Promise<number[]>} movie vector
 */
async function createMovieVector(userId, id) {
    try {
        const data = await getMovieData(id);
        const vec = new Array(CONFIG.DIMENSIONS).fill(0);

        // Encode genres
        for (let i = 0; i < data.genres.length; i++) {
            const genre = data.genres[i];
            vec[getGenreIndex(genre.name)] = 1;
        }

        // Encode language
        vec[getLanguagesIndex(data.original_language)] = 1;

        // Encode release decade
        const year = new Date(data.release_date).getFullYear();
        vec[getDecadesIndex(year)] = 1;

        // Encode IMDb rating
        vec[getImbdRatingIndex(data.imdb_rating)] = 1;

        // Encode user rating (from local function)
        const rating = getUserRating(userId, id);
        vec[getUserRatingIndex(rating)] = 1;

        // Encode watch providers
        for (let i = 0; i < data.watch_providers.length; i++) {
            const provider = data.watch_providers[i];
            vec[getWatchProvidersIndex(provider.provider_name)] = 1;
        }

        return normalize(vec);
    } catch (error) {
        console.error('Error in createMovieVector:', error);
        return [];
    }
}

/**
 * Calculates cosine similarity score
 * @param {number[]} movieVector
 * @param {number[]} userVector
 * @returns {number} similarity score
 */
function calculateScore(movieVector, userVector) {
    const normUser = normalize(userVector);
    let sum = 0;

    for (let i = 0; i < movieVector.length; i++) {
        sum += movieVector[i] * normUser[i];
    }

    return sum;
}

/**
 * Updates the user vector based on swipe (like/dislike)
 * @param {number[]} userVector
 * @param {number[]} movieVector
 * @param {boolean} liked
 * @returns {number[]} updated user vector
 */
function updateUserVector(userVector, movieVector, liked) {
    // Apply decay
    for (let i = 0; i < userVector.length; i++) {
        userVector[i] *= (1 - CONFIG.DECAY_GAMMA);
    }

    // Apply learning rate
    const rate = liked ? CONFIG.ALPHA_LIKE : CONFIG.ALPHA_DISLIKE;
    for (let i = 0; i < userVector.length; i++) {
        userVector[i] += rate * movieVector[i];
    }

    return userVector;
}

/**
 * Computes L2 norm
 * @param {number[]} vec
 * @returns {number}
 */
function l2Norm(vec) {
    let sum = 0;
    for (let i = 0; i < vec.length; i++) {
        sum += vec[i] * vec[i];
    }
    return Math.sqrt(sum);
}

/**
 * Normalizes a vector
 * @param {number[]} vec
 * @returns {number[]} normalized vector
 */
function normalize(vec) {
    const norm = l2Norm(vec) + 1e-8;
    for (let i = 0; i < vec.length; i++) {
        vec[i] = vec[i] / norm;
    }
    return vec;
}

/**
 * Retrieves or creates a user vector
 * @param {string} userId
 * @returns {Promise<number[]>}
 */
async function getUserVector(userId) {
    try {
        const [rows] = await db.query(
            'SELECT user_vector FROM USERSETTINGS WHERE user_id = ?',
            [userId]
        );

        let userVector;

        if (rows.length === 0 || !rows[0].user_vector) {
            userVector = await createUserVector(userId);
            await addUserVector(userId, userVector);
        } else {
            userVector = JSON.parse(rows[0].user_vector);
        }

        return normalize(userVector);

    } catch (err) {
        console.error('Error in getUserVector:', err.message);
        throw new Error('Failed to retrieve or create user vector');
    }
}

/**
 * Saves/updates the user vector in the database
 * @param {string} userId
 * @param {number[]} userVector
 */
async function addUserVector(userId, userVector) {
    try {
        await db.execute(
            'UPDATE USERSETTINGS SET user_vector = ? WHERE user_id = ?',
            [JSON.stringify(userVector), userId]
        );
    } catch (err) {
        console.error('Error in addUserVector:', err.message);
        throw new Error('Failed to update user vector');
    }
}

/**
 * Returns top movie ID for the user and resets its score
 * @param {string} userId
 * @returns {Promise<number>} movieId
 */
async function getTopMovie(userId) {
    try {
        const [rows] = await db.query(
            'SELECT movie_id FROM USERPREFERENCES WHERE user_id = ? ORDER BY score DESC LIMIT 1',
            [userId]
        );

        if (rows.length === 0) {
            return 218; // default fallback movie
        }

        const movieId = rows[0].movie_id;
        await db.execute(
            'UPDATE USERPREFERENCES SET score = 0 WHERE user_id = ? AND movie_id = ?',
            [userId, movieId]
        );

        return movieId;
    } catch (err) {
        console.error('Error in getTopMovie:', err);
        throw new Error('Failed to retrieve top movie');
    }
}

/**
 * Fetches top 10 recommended movie IDs from TMDB
 * @param {string} movieId
 * @returns {Promise<number[]>} movie IDs
 */
async function getMoviesTMDB(movieId) {
    const response = await tmdb.get(`/movie/${movieId}/recommendations`);
    const movies = response.data;

    const movieIDs = [];
    for (let i = 0; i < 10 && i < movies.results.length; i++) {
        movieIDs.push(movies.results[i].id);
    }
    return movieIDs;
}

// ---------------------------- TEST FUNCTIONS ----------------------------

async function testUserVector() {
    const userId = 2;
    const vec = await createUserVector(userId);
    console.log("[Test] User Vector:", vec);
}

async function testMovieVector() {
    const movieId = 238;
    const vec = await createMovieVector(2, movieId);
    console.log("[Test] Movie Vector:", vec);
}

async function testScoreCalculation() {
    const userVec = await createUserVector(2);
    const movieVec = await createMovieVector(2, 238);
    const score = calculateScore(movieVec, userVec);
    console.log(`[Test] Score: ${score}`);
}

async function testUpdateUserVector() {
    const userVec = await createUserVector(2);
    const movieVec = await createMovieVector(2, 238);
    const updated = updateUserVector(userVec, movieVec, true);
    console.log("[Test] Updated User Vector:", updated);
}

async function testGetTopMovie() {
    const movieId = await getTopMovie(2);
    console.log("[Test] Top Movie ID:", movieId);
}

async function testGetMoviesTMDB() {
    const recs = await getMoviesTMDB(238);
    console.log("[Test] TMDB Recommendations:", recs);
}

// Run all tests
// (async () => {
//     await testUserVector();
//     await testMovieVector();
//     await testScoreCalculation();
//     await testUpdateUserVector();
//     await testGetTopMovie();
//     await testGetMoviesTMDB();
// })();

// ---------------------------- EXPORTS ----------------------------

module.exports = {
    createUserVector,
    createMovieVector,
    calculateScore,
    updateUserVector,
    normalize,
    l2Norm,
    getUserVector,
    addUserVector,
    getTopMovie,
    getMoviesTMDB
};
