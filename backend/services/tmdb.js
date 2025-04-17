const axios = require('axios');
require('dotenv').config();

const { TMDB_API_KEY } = process.env;
const BASE_URL = 'https://api.themoviedb.org/3';
const BASE_IMAGE_URL = 'https://image.tmdb.org/t/p';


const tmdb = axios.create({
    baseURL: BASE_URL,
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${TMDB_API_KEY}`
    }
});


module.exports = tmdb;