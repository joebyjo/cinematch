const axios = require('axios');
require('dotenv').config();

const { TMDB_API_KEY, OMDB_API_KEY } = process.env;
const BASE_URL = 'https://api.themoviedb.org/3';
const OMDB_URL = 'https://www.omdbapi.com/';

// creating tmdb obj
const tmdb = axios.create({
    baseURL: BASE_URL,
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${TMDB_API_KEY}` // uses bearer auth for tmdb
    }
});

// getting critic ratings from OMDB API
async function getImdbData(movieId) {
    try {
        const response = await axios.get(`${OMDB_URL}?i=${movieId}&apikey=${OMDB_API_KEY}`);
        const results = {
            ratings: response.data.Ratings || [], // ensure fallback to empty array
            director: response.data.Director || null,
            cast: response.data.Actors || null
        };

        return results;

    } catch (error) {
        console.error(`OMDB fetch failed: ${error.message}`);
        return {
            ratings: null,
            director: null,
            cast: null
        };
    }
}

module.exports = { tmdb, getImdbData };
