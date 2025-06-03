/* eslint-disable max-len */
/* eslint-disable no-use-before-define */
/* eslint-disable key-spacing */
/* eslint-disable no-multi-spaces */

// Import helper functions to fetch data from the database
const { getGenreData, getLangData, getWatchProvidersData } = require('./helpers');

// Configuration settings for vector dimensions and learning rates
const CONFIG = {
    DIMENSIONS: 0,         // Length of vectors
    ALPHA_LIKE: 0.2,         // Learning rate for likes
    ALPHA_DISLIKE: -0.1,     // Learning rate for dislikes
    DECAY_GAMMA: 0.02        // Momentum decay
};

// Index offsets for different feature groups
var IDX = {
genres:0,langs:28,decades:37,ImdbRating:48,userRating:60,watchProviders:72
};

// Index mappings for various attributes
var genresIndex = {};
var langsIndex = {};
var decadesIndex = {};
var ImdbRatingIndex = {};
var userRatingIndex = {};
var watchProvidersIndex = {};

// Kick off initialization immediately on module load:
const initializePromise = initializeIDX();

/**
 * Returns a default mapping of genres to indices.
 */
function getDefaultGenres() {
    return {
        Adventure: 0,
        Fantasy: 1,
        Animation: 2,
        Drama: 3,
        Horror: 4,
        Action: 5,
        Comedy: 6,
        History: 7,
        Western: 8,
        Thriller: 9,
        Crime: 10,
        Documentary: 11,
        "Science Fiction": 12,
        Mystery: 13,
        Music: 14,
        Romance: 15,
        Family: 16,
        War: 17,
        "Action & Adventure": 18,
        Kids: 19,
        News: 20,
        Reality: 21,
        "Sci-Fi & Fantasy": 22,
        Soap: 23,
        Talk: 24,
        "War & Politics": 25,
        "TV Movie": 26,
        Others: 27
    };
}

/**
 * Maps genres from the database to indices.
 * @returns {Promise<number>} The total number of genres mapped.
 */
async function mapGenres() {
    genresIndex = getDefaultGenres();
    try {
        const genres = await getGenreData();

        for (let i = 0; i < genres.length; i++) {
            genresIndex[genres[i].name] = i;
        }

        genresIndex["Others"] = genres.length;
        return Object.keys(genresIndex).length;

    } catch (error) {
        console.error("Error: Unable to fetch genres data from the database.", error);
        return Object.keys(genresIndex).length; // Fallback to default genres
    }
}

/**
 * Retrieves the index for a given genre.
 * @param {string} genre - The genre name.
 * @returns {number} The index of the genre.
 */
function getGenreIndex(genre) {
    if (genre in genresIndex) {
        // console.log("jsdhfdhkfh: " + genresIndex[genre] + IDX.genres);
        return genresIndex[genre] + IDX.genres;
    }
    return genresIndex.Others + IDX.genres;
}

/**
 * Returns a default mapping of languages to indices.
 */
function getDefaultLang() {
    return {
        en: 0,
        hi: 1,
        tl: 2,
        te: 3,
        ja: 4,
        ml: 5,
        es: 6,
        Others: 7
    };
}

/**
 * Maps languages from the database to indices.
 * @returns {Promise<number>} The total number of languages mapped.
 */
async function mapLang() {
    langsIndex = getDefaultLang();
    try {
        const languages = await getLangData();

        for (let i = 0; i < languages.length; i++) {
            langsIndex[languages[i].original_language] = i;
        }

        langsIndex["Others"] = languages.length;
        return Object.keys(langsIndex).length;
    } catch (error) {
        console.error("Error: Unable to fetch languages data from the database.", error);
        return Object.keys(langsIndex).length; // Fallback to default languages
    }
}

/**
 * Retrieves the index for a given language.
 * @param {string} lang - The language code.
 * @returns {number} The index of the language.
 */
function getLanguagesIndex(lang) {
    if (lang in langsIndex) {
        return langsIndex[lang] + IDX.langs;
    }
    return langsIndex.Others + IDX.langs;
}

/**
 * Maps decades to indices.
 * @returns {Promise<number>} The total number of decades mapped.
 */
async function mapDecade() {
    let index = 0;
    for (let year = 1940; year < 2031; year += 10) {
        decadesIndex[year] = index++;
    }

    decadesIndex.Others = index;
    return Object.keys(decadesIndex).length;
}

/**
 * Retrieves the index for a given year based on its decade.
 * @param {number} year - The year.
 * @returns {number} The index of the decade.
 */
function getDecadesIndex(year) {
    let decade = Math.floor(year / 10) * 10;
    if (decade in decadesIndex) {
        return decadesIndex[decade] + IDX.decades;
    }

    return decadesIndex.Others + IDX.decades;
}

/**
 * Maps IMDb ratings to indices.
 * @returns {Promise<number>} The total number of IMDb ratings mapped.
 */
async function mapImdbRating() {
    let index = 0;
    for (let rating = 0; rating <= 10; rating++) {
        ImdbRatingIndex[rating] = index++;
    }

    ImdbRatingIndex.Others = index;
    return Object.keys(ImdbRatingIndex).length;
}

/**
 * Retrieves the index for a given IMDb rating.
 * @param {number} rating - The IMDb rating.
 * @returns {number} The index of the rating.
 */
function getImdbRatingIndex(rating) {
    let roundedRating = Math.round(rating);
    if (roundedRating in ImdbRatingIndex) {
        return ImdbRatingIndex[roundedRating] + IDX.ImdbRating;
    }

    return ImdbRatingIndex.Others + IDX.ImdbRating;
}

/**
 * Maps user ratings to indices.
 * @returns {Promise<number>} The total number of user ratings mapped.
 */
async function mapUserRating() {
    let index = 0;
    for (let i = 0; i <= 10; i++) {
        let rating = i * 0.5;
        userRatingIndex[rating.toFixed(1)] = index++; // Store as string keys like "0.5"
    }

    userRatingIndex.Others = index;
    return Object.keys(userRatingIndex).length;
}

/**
 * Retrieves the index for a given user rating.
 * @param {number} rating - The user rating.
 * @returns {number} The index of the rating.
 */
function getUserRatingIndex(rating) {
    let roundedRating = Math.round(rating * 2) / 2; // Round to nearest 0.5
    let ratingKey = roundedRating.toFixed(1);

    if (ratingKey in userRatingIndex) {
        return userRatingIndex[ratingKey] + IDX.userRating;
    }

    return userRatingIndex.Others + IDX.userRating;
}

/**
 * Returns a default mapping of watch providers to indices.
 */
function getDefaultWatchProvider() {
    return {
        "Apple TV": 0,
        Netflix: 1,
        "Amazon Prime Video": 2,
        "Amazon Video": 3,
        Hulu: 4,
        "Disney Plus": 5,
        "Apple TV+": 6,
        "Peacock Premium": 7,
        "Paramount Plus": 8,
        "Paramount+ with Showtime": 9,
        Max: 10,
        "Crunchyroll Amazon Channel": 11,
        Others: 12
    };
}

/**
 * Maps watch providers from the database to indices.
 * @returns {Promise<number>} The total number of watch providers mapped.
 */
async function mapWatchProviders() {
    watchProvidersIndex = getDefaultWatchProvider();
    try {
        const providers = await getWatchProvidersData();

        for (let i = 0; i < providers.length; i++) {
            watchProvidersIndex[providers[i].provider_name] = i;
        }

        watchProvidersIndex["Others"] = providers.length;
        return Object.keys(watchProvidersIndex).length;
    } catch (error) {
        console.error("Error: Unable to fetch watch providers data from the database.", error);
        return Object.keys(watchProvidersIndex).length; // Fallback to default providers
    }
}

/**
 * Retrieves the index for a given watch provider.
 * @param {string} provider - The name of the watch provider.
 * @returns {number} The index of the watch provider.
 */
function getWatchProvidersIndex(provider) {
    if (provider in watchProvidersIndex) {
        return watchProvidersIndex[provider] + IDX.watchProviders;
    }
    return watchProvidersIndex.Others + IDX.watchProviders;
}

/**
 * Initializes the index offsets for different feature groups.
 * @returns {Promise<Object>} The index offsets.
 */
async function initializeIDX() {
    const [
        genreLength,
        langLength,
        decadeLength,
        ImdbRatingLength,
        userRatingLength,
        watchProvidersLength
    ] = await Promise.all([
        mapGenres(),
        mapLang(),
        mapDecade(),
        mapImdbRating(),
        mapUserRating(),
        mapWatchProviders()
    ]);

    CONFIG.DIMENSIONS = genreLength + langLength + decadeLength + ImdbRatingLength + userRatingLength + watchProvidersLength;

    IDX = {
        genres: 0,
        langs: genreLength,
        decades: genreLength + langLength,
        ImdbRating: genreLength + langLength + decadeLength,
        userRating: genreLength + langLength + decadeLength + ImdbRatingLength,
        watchProviders: genreLength + langLength + decadeLength + ImdbRatingLength + userRatingLength
    };

    return IDX;
}

/**
 * Test function to initialize indices and display mappings.
 */
// async function test() {
//     IDX = await initializeIDX();

//     console.log("=== Genre Index ===");
//     console.log("Action:", getGenreIndex("Action"));
//     console.log("Unknown Genre:", getGenreIndex("C"));
//     console.table(genresIndex);

//     console.log("=== Language Index ===");
//     console.log("English:", getLanguagesIndex("en"));
//     console.log("Hindi:", getLanguagesIndex("hi"));
//     console.log("Unknown Language:", getLanguagesIndex("xx"));
//     console.table(langsIndex);

//     console.log("=== Decade Index ===");
//     console.log("1990:", getDecadesIndex(1990));
//     console.log("2025:", getDecadesIndex(2025));
//     console.log("Unknown Year:", getDecadesIndex(1900));
//     console.table(decadesIndex);

//     console.log("=== IMDb Rating Index ===");
//     console.log("Rating 7.6:", getImdbRatingIndex(7.6));
//     console.log("Unknown Rating:", getImdbRatingIndex(11));
//     console.table(ImdbRatingIndex);

//     console.log("=== User Rating Index ===");
//     console.log("Rating 4.7:", getUserRatingIndex(4.7));
//     console.log("Rating 9.8:", getUserRatingIndex(9.8));
//     console.log("Unknown Rating:", getUserRatingIndex(11));
//     console.table(userRatingIndex);

//     console.log("=== Watch Provider Index ===");
//     console.log("Netflix:", getWatchProvidersIndex("Netflix"));
//     console.log("Unknown Provider:", getWatchProvidersIndex("SomeUnknown"));
//     console.table(watchProvidersIndex);

//     console.table(IDX);
// }

// Run the initialization
// test();

module.exports = [
    CONFIG,
    getGenreIndex,
    getLanguagesIndex,
    getDecadesIndex,
    getImdbRatingIndex,
    getUserRatingIndex,
    getWatchProvidersIndex
];
