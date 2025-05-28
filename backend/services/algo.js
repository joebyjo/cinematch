/* eslint-disable max-len */
/* eslint-disable no-use-before-define */
/* eslint-disable key-spacing */
/* eslint-disable no-multi-spaces */
/*
  Algorithm
*/

const [
    CONFIG,
    getGenreIndex,
    getLanguagesIndex,
    getDecadesIndex,
    getImbdRatingIndex,
    getUserRatingIndex,
    getWatchProvidersIndex
] = require('./algo-mapping.js');

/* Algorithm Functions start here */

// Initialize user vector from onboarding users
async function createUserVector(userId) {
    const info = await getUserInfo(userId);
    const vec = new Array(CONFIG.DIMENSIONS).fill(0);

    // Favorite genres
    for (let i = 0; i < info.favorite_genres.length; i++) {
        const g = info.favorite_genres[i];
        const idx = genreList.indexOf(g);
        if (idx >= 0) vec[IDX.genres + idx] = 1;
    }

    // Preferred languages
    for (let i = 0; i < info.preferred_languages.length; i++) {
        const lang = info.preferred_languages[i];
        const idx = langList.indexOf(lang);
        if (idx >= 0) vec[IDX.langs + idx] = 1;
    }

    return normalize(vec);
}

// Build and return a movie vector
async function createMovieVector(id) {
    const data = await getMovieInfo(id);
    const vec = new Array(CONFIG.DIMENSIONS).fill(0);

    // Genres: set 1 for each genre
    for (let i = 0; i < data.genres.length; i++) {
        const g = data.genres[i];
        const idx = genreList.indexOf(g);
        if (idx >= 0) {
            vec[IDX.genres + idx] = 1;
        }
    }

    // Languages
    for (let i = 0; i < data.spoken_languages.length; i++) {
        const lang = data.spoken_languages[i];
        const idx = langList.indexOf(lang);
        if (idx >= 0) {
            vec[IDX.langs + idx] = 1;
        }
    }

    // Release decade
    const year = new Date(data.release_date).getFullYear();
    for (let j = 0; j < decadeBins.length; j++) {
        const bin = decadeBins[j];
        if (year >= bin[0] && year < bin[1]) {
            vec[IDX.decades + j] = 1;
            break;
        }
    }

    // Popularity and rating
    vec[IDX.pop] = data.popularity / maxPopularity;
    vec[IDX.rating] = data.vote_average / 10;

    // Runtime bracket
    const rt = data.runtime;
    for (let j = 0; j < runtimeBrackets.length; j++) {
        const b = runtimeBrackets[j];
        if (rt >= b[0] && rt < b[1]) {
            vec[IDX.runtime + j] = 1;
            break;
        }
    }

    // Cast embedding average
    const castSum = new Array(64).fill(0);
    for (let i = 0; i < data.cast_ids.length; i++) {
        const emb = castEmbeddingLookup(data.cast_ids[i]);
        for (let k = 0; k < 64; k++) {
            castSum[k] += emb[k];
        }
    }
    // average
    for (let k = 0; k < 64; k++) {
        vec[IDX.cast + k] = castSum[k] / data.cast_ids.length;
    }

    // Director embedding
    const dirEmb = directorEmbeddingLookup(data.director_id);
    for (let k = 0; k < 32; k++) {
        vec[IDX.director + k] = dirEmb[k];
    }

    // Keywords
    for (let i = 0; i < data.keywords.length; i++) {
        const kw = data.keywords[i];
        const idx = keywordList.indexOf(kw);
        if (idx >= 0) {
            vec[IDX.keywords + idx] = 1;
        }
    }

    // Normalize before return
    return normalize(vec);
}

// Calculate recommendation score
function calculateScore(movieVector, userVector) {
    // Normalize user for cosine
    userVector = normalize(userVector);
    let sum = 0;
    for (let i = 0; i < movieVector.length; i++) {
        sum += movieVector[i] * userVector[i];
    }
    return sum;
}

// Update user vector on swipe
function updateUserVector(userVector, movieVector, liked) {
    // Decay
    for (let i = 0; i < userVector.length; i++) {
        userVector[i] *= (1 - CONFIG.DECAY_GAMMA);
    }
    // Update
    const rate = liked ? CONFIG.ALPHA_LIKE : CONFIG.ALPHA_DISLIKE;
    for (let i = 0; i < userVector.length; i++) {
        userVector[i] += rate * movieVector[i];
    }
    // no normalize here
    return userVector;
}

// Helper Functions

// Compute L2 norm of vector
function l2Norm(vec) {
    let sum = 0;
    for (let i = 0; i < vec.length; i++) {
        sum += vec[i] * vec[i];
    }
    return Math.sqrt(sum);
}

// Normalize vector in place and return it
function normalize(vec) {
    const norm = l2Norm(vec) + 1e-8;
    for (let i = 0; i < vec.length; i++) {
        vec[i] = vec[i] / norm;
    }
    return vec;
}
