/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable no-use-before-define */
/* eslint-disable key-spacing */
/* eslint-disable no-multi-spaces */

// Import required functions
const {
    getUserGenresLanguages,
    getMovieData,
    getUserRating
} = require('./helpers');

const { tmdb } = require('../services/tmdb');

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
 * Initializes the user vector based on user's favorite genres and languages
 * @param {string} userId
 * @returns {Promise<number[]>} user vector
 */
async function createUserVector(userId) {
    try {
        const info = await getUserGenresLanguages(userId);
        const vec = new Array(CONFIG.DIMENSIONS).fill(0);

        for (let i = 0; i < info.favorite_genres.length; i++) {
            const genre = info.favorite_genres[i];
            vec[getGenreIndex(genre)] = 1;
        }

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
 * Creates a movie vector based on movie features
 * @param {string} id
 * @returns {Promise<number[]>} movie vector
 */
async function createMovieVector(userId, id) {
    try {
        const data = await getMovieData(id);
        const vec = new Array(CONFIG.DIMENSIONS).fill(0);

        // genres: array of strings
        for (let i = 0; i < data.genres.length; i++) {
            const genre = data.genres[i];
            vec[getGenreIndex(genre.name)] = 1;
        }

        // original_language: string
        vec[getLanguagesIndex(data.original_language)] = 1;

        // release_date: ISO string
        const year = new Date(data.release_date).getFullYear();
        vec[getDecadesIndex(year)] = 1;

        // imdb_rating: number
        vec[getImbdRatingIndex(data.imdb_rating)] = 1;

        // userRating: treat IMDb rating as user rating here (or use a separate field if needed)
        vec[getUserRatingIndex(getUserRating(userId, id))] = 1;

        // watch_providers: array of strings
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
 * Calculates cosine similarity between user and movie vector
 * @param {number[]} movieVector
 * @param {number[]} userVector
 * @returns {number} score
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
 * Updates user vector on like/dislike swipe
 * @param {number[]} userVector
 * @param {number[]} movieVector
 * @param {boolean} liked
 * @returns {number[]} updated user vector
 */
function updateUserVector(userVector, movieVector, liked) {
    for (let i = 0; i < userVector.length; i++) {
        userVector[i] *= (1 - CONFIG.DECAY_GAMMA);
    }

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
 * Normalizes a vector using L2 norm
 * @param {number[]} vec
 * @returns {number[]}
 */
function normalize(vec) {
    const norm = l2Norm(vec) + 1e-8;
    for (let i = 0; i < vec.length; i++) {
        vec[i] = vec[i] / norm;
    }
    return vec;
}

/* Stub Functions - To Be Implemented */
async function getUserVector(userId) {
    // TODO: Retrieve user vector from DB
}

async function updateMovieScore(userId, movieId, movieScore) {
    // TODO: Update score in DB
}

function addUserVector(userId, userVector) {
    // TODO: Store vector in DB
}

async function getTopMovie(userId) {
    // TODO: Return top movie from DB and set its score to 0
}

async function getMoviesTMDB(movieId) {
    // Fetch 10 movie recommendations from TMDB API
    const response = await tmdb.get(`/movie/${movieId}/recommendations`);
    const movies = response.data;

    const movieIDs = movies.results
        .slice(0, 10)               // limit to first 10 movies
        .map((movie) => movie.id);  // extract only the id

    return movieIDs;
}


// --- TEST FUNCTIONS ---
async function testUserVector() {
    const testUserId = 123;
    const userVector = await createUserVector(testUserId);
    console.log("User vector created:", userVector);
}

async function testMovieVector() {
    const testMovieId = 238;
    const data = await getMovieData(testMovieId);
    // console.table(data);
    const movieVector = await createMovieVector(2, testMovieId);
    console.log("Movie vector created:", movieVector);
}

async function testScoreCalculation() {
    const testUserId = 123;
    const testMovieId = 456;

    const userVector = await createUserVector(testUserId);
    const movieVector = await createMovieVector(testMovieId);

    const score = calculateScore(movieVector, userVector);
    console.log(`Recommendation score for user ${testUserId} and movie ${testMovieId}:`, score);
}

async function testgetMoviesTMDB(m) {
    const res = await getMoviesTMDB(m);
    console.log(res);
}

// Run desired test
(async () => {
    // Uncomment the ones you want to test
    // await testUserVector();
    await testMovieVector();
    await testgetMoviesTMDB(238);
    // await testScoreCalculation();
})();


module.exports = {
    createUserVector,
    createMovieVector,
    calculateScore,
    updateUserVector,
    normalize,
    l2Norm,
    getUserVector,
    updateMovieScore,
    addUserVector,
    getTopMovie,
    getMoviesTMDB
};
