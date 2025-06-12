const axios = require('axios');
require('dotenv').config();

const { TMDB_API_KEY, OMDB_API_KEY } = process.env;
const BASE_URL = 'https://api.themoviedb.org/3';
const BASE_IMAGE_URL = 'https://image.tmdb.org/t/p';
const OMDB_URL = 'https://www.omdbapi.com/';


// creating tmdb obj
const tmdb = axios.create({
    baseURL: BASE_URL,
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${TMDB_API_KEY}`
    }
});

// getting critic ratings from OMDB API
async function getImdbData(movieId) {
    try {
        const response = await axios.get(`${OMDB_URL}?i=${movieId}&apikey=${OMDB_API_KEY}`);
        const results = {
            ratings: response.data.Ratings,
            director: response.data.Director,
            cast: response.data.Actors
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
