const express = require('express');
const router = express.Router();
const tmdb = require('../services/tmdb');

// GET /api/movies/trending
router.get('/trending', async (req, res) => {
    try {
        // get trending movies
        const response = await tmdb.get('/movie/popular');
        const { results } =response.data;

        // remove unnecessary data
        const trimmedResults = results.map((movie) => ({
            id: movie.id,
            original_title: movie.original_title,
            poster_path: movie.poster_path
        }));

        res.status(200).json(trimmedResults);

    } catch (error) {
        console.error('TMDB error:', error.message);
        res.status(500).json({ error: 'Failed to fetch trending movies' });

    }
});


// get movie details for a movie
router.get('/movie/:id', async (req, res) => {
    try {

        const movie_response = await tmdb.get(`/movie/${req.params.id}`);
        const release_response = await tmdb.get(`/movie/${req.params.id}/release_dates`);
        const videos_response = await tmdb.get(`/movie/${req.params.id}/videos`);


        const movie = movie_response.data;
        const release = release_response.data.results;
        const videos = videos_response.data.results;

        // remove unnecessary data
        const trimmedResults = {
            id: movie.id,
            imdb_id: movie.imdb_id,
            original_language: movie.original_language,
            overview: movie.overview,
            // release_date: movie.release_date,
            original_title: movie.original_title,
            runtime: movie.runtime,
            poster_path: movie.poster_path,
            backdrop_path: movie.backdrop_path
        };

        // setting users country
        const country = 'AU';

        const country_release_info =release.find(
                (country_result) => country_result.iso_3166_1 === country
            )
            .release_dates[0];

        // get movie certification in users country.
        trimmedResults.certification = country_release_info.certification || 'NR';

        // get release_date in user's country
        [trimmedResults.release_date] = new Date(country_release_info.release_date).toISOString().split('T');

        const trailers = videos.filter()


        res.status(200).json(trimmedResults);

    } catch (error) {
        console.error('TMDB error:', error.message);
        res.status(500).json({ error: 'Failed to fetch movie' });

    }
});

router.get('/search', async (req, res) => {
    try {
        // // get trending movies
        // const response = await tmdb.get('/trending/movie/day');
        // const { results } =response.data;

        // // remove unnecessary data
        // const trimmedResults = results.map((movie) => ({
        //     id: movie.id,
        //     original_title: movie.original_title,
        //     poster_path: movie.poster_path
        // }));

        // res.status(200).json(trimmedResults);

    } catch (error) {
        console.error('TMDB error:', error.message);
        res.status(500).json({ error: 'Failed to fetch movie' });

    }
});


router.get('/genres', async (req, res) => {
    try {
        // // get trending movies
        // const response = await tmdb.get('/trending/movie/day');
        // const { results } =response.data;

        // // remove unnecessary data
        // const trimmedResults = results.map((movie) => ({
        //     id: movie.id,
        //     original_title: movie.original_title,
        //     poster_path: movie.poster_path
        // }));

        // res.status(200).json(trimmedResults);

    } catch (error) {
        console.error('TMDB error:', error.message);
        res.status(500).json({ error: 'Failed to fetch movie' });

    }
});




module.exports = router;
