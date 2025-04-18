const express = require('express');
const router = express.Router();
const { tmdb, getImdbData } = require('../services/tmdb');

// GET /api/movies/trending
router.get('/trending', async (req, res) => {
    try {
        // get trending movies
        const response = await tmdb.get('/movie/popular');
        const { results } = response.data;

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

        const movieId = req.params.id;

        // setting users country
        const country = 'AU';

        const [movieResp, releaseResp, videosResp, providersResp] = await Promise.all([
            tmdb.get(`/movie/${movieId}`),
            tmdb.get(`/movie/${movieId}/release_dates`),
            tmdb.get(`/movie/${movieId}/videos`),
            tmdb.get(`/movie/${movieId}/watch/providers`)
        ]);


        const movie = movieResp.data;
        const release = releaseResp.data.results;
        const videos = videosResp.data.results;
        const providers = providersResp.data.results;

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

        const countryReleaseInfo = release.find(
            (countryResult) => countryResult.iso_3166_1 === country
        )
            .release_dates[0];

        // get movie certification in users country.
        trimmedResults.certification = countryReleaseInfo.certification || 'NR';

        // get release_date in user's country
        [trimmedResults.release_date] = new Date(countryReleaseInfo.release_date).toISOString().split('T');

        // get trailer from youtube
        const trailers = videos.filter(
            (value) => value.site === 'YouTube'
                && (value.type === 'Trailer' || value.type === 'Official Trailer')
        );

        // add trailer to response if it exists
        if (trailers.length !== 0) {
            const trailer = `https://www.youtube.com/watch?v=${trailers[0].key}`;
            trimmedResults.trailer = trailer;
        }

        // getting critic ratings and cast details
        const { ratings, director, cast } = await getImdbData(movie.imdb_id);

        trimmedResults.ratings = ratings;
        trimmedResults.director = director;
        trimmedResults.cast = cast;

        // get country wise watch providers
        const countryProviders = providers[country];
        trimmedResults.watch_providers = countryProviders;

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
