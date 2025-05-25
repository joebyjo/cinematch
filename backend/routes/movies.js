const express = require('express');
const { tmdb, getImdbData } = require('../services/tmdb');
const { validate, validateSearchQuery, validateId } = require('../services/validators');
const { insertMovie, getMovieData, getGenreData } = require('../services/helpers');

const router = express.Router();

const preferredProviders = [8, 9, 2, 10, 337, 531, 15, 350, 1968, 386, 1770, 1899];
const preferredCountries = ['AU', 'US', 'GB', 'IN'];

// GET /api/movies/trending
router.get('/trending', async (req, res) => {
    try {
        // get trending movies
        const response = await tmdb.get('/movie/popular');
        const { results } = response.data;

        // remove unnecessary data
        const trimmedResults = results.map((movie) => ({
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path
        }));

        res.status(200).json(trimmedResults);

    } catch (error) {
        console.error('TMDB error:', error.message);
        res.status(500).json({ msg: 'Failed to fetch trending movies' });

    }
});

// GET /api/movies/top_rated
router.get('/top-rated', async (req, res) => {
    try {
        // get top rated movies
        const response = await tmdb.get('/movie/top_rated');
        const { results } = response.data;

        // remove unnecessary data
        const trimmedResults = results.map((movie) => ({
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path
        }));

        res.status(200).json(trimmedResults);

    } catch (error) {
        console.error('TMDB error:', error.message);
        res.status(500).json({ msg: 'Failed to fetch top rated movies' });

    }
});

// GET /api/movies/now_playing
router.get('/now-playing', async (req, res) => {
    try {
        // get movies now playing in cinemas
        const response = await tmdb.get('/movie/now_playing');
        const { results } = response.data;

        // remove unnecessary data
        const trimmedResults = results.map((movie) => ({
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path
        }));

        res.status(200).json(trimmedResults);

    } catch (error) {
        console.error('TMDB error:', error.message);
        res.status(500).json({ msg: 'Failed to fetch now playing movies' });

    }
});



// get movie details for a movie
router.get('/movie/:id', validateId('id'), validate, async (req, res) => {
    try {

        const movieId = req.params.id;

        // check if movie already exists in db and return
        const dataFromDb = await getMovieData(movieId);
        if (dataFromDb) {
            return res.status(200).json(dataFromDb);
        }

        const movieResp = await tmdb.get(`/movie/${movieId}?append_to_response=release_dates%2Cvideos%2Cwatch%2Fproviders`);

        const movie = movieResp.data;
        const videos = movie.videos?.results || [];
        const providers = movie['watch/providers']?.results || {};

        // remove unnecessary data
        const trimmedResults = {
            id: movie.id || null,
            imdb_id: movie.imdb_id || null,
            original_language: movie.original_language || null,
            overview: movie.overview,
            // release_date: movie.release_date,
            title: movie.title || null,
            runtime: movie.runtime || null,
            poster_path: movie.poster_path || null,
            backdrop_path: movie.backdrop_path || null,
            genres: movie.genres || null
        };


        // get country specific release dates and certification
        try {
            const countryReleaseInfo = releaseResp.data.results
            .find((countryResult) => countryResult.iso_3166_1 === preferredCountries[0])
            .release_dates[0];

            // get movie certification in users country.
            trimmedResults.certification = countryReleaseInfo.certification;

            // get release_date in user's country
            [trimmedResults.release_date] = new Date(countryReleaseInfo.release_date).toISOString().split('T');

        } catch (err) {
            console.error('TMDB error with country specific:', err.message);

            trimmedResults.certification = 'NR';
            [trimmedResults.release_date] = new Date(movie.release_date).toISOString().split('T') || [null];
        }

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

        trimmedResults.director = director || null;
        trimmedResults.cast = cast || null;

        // getting individual ratings
        trimmedResults.imdb_rating = null;
        trimmedResults.rotten_rating = null;
        trimmedResults.metacritic_rating = null;

        try {
            ratings.forEach((rating) => {
                if (rating.Source === "Internet Movie Database") {
                    const value = parseFloat(rating.Value.split('/')[0]);
                    trimmedResults.imdb_rating = isNaN(value) ? null : value;
                } else if (rating.Source === "Rotten Tomatoes") {
                    const value = parseInt(rating.Value.replace('%', ''),10);
                    trimmedResults.rotten_rating = isNaN(value) ? null : value;
                } else if (rating.Source === "Metacritic") {
                    const value = parseInt(rating.Value.split('/')[0],10);
                    trimmedResults.metacritic_rating = isNaN(value) ? null : value;
                }
            });
        } catch (err) {
            console.error('OMDB error with parsing ratings:', err.message);
        }


        // get top 2 watch providers according to countries if it is a popular platform sorted by custom priority list
        const countryProviders = Array.from(
            new Map(
                preferredCountries.flatMap(c => providers[c]?.flatrate || [])
                    .filter(p => preferredProviders.includes(p.provider_id))
                    .map(p => [p.provider_id, p])
            ).values()
        ).sort(
            (a, b) => preferredProviders.indexOf(a.provider_id) - preferredProviders.indexOf(b.provider_id)
        ).slice(0, 2);

        // add watchproviders to results
        trimmedResults.watch_providers = countryProviders;


        // send results back to client
        res.status(200).json(trimmedResults);

        // insert movie details into db
        insertMovie(trimmedResults);

    } catch (error) {
        console.error('TMDB error:', error.message);
        res.status(500).json({ msg: 'Failed to fetch movie' });

    }
});

router.get('/search', validateSearchQuery('q'), validate, async (req, res) => {

    try {

        const { query } = req;

        const url = "/search/movie"; // `/search/movie?query=${query.q}&include_adult=true`;

        const { data } = await tmdb.get(
            url,
            {
                params: {
                    query: query.q,
                    include_adult: true
                }
            }
        );

        var { results } = data;

        results = results.slice(0, 5);

        const trimmedResults = results.map((movie) => ({
            id: movie.id,
            title: movie.title
        }));

        res.status(200).json(trimmedResults);

    } catch (error) {
        console.error('TMDB error:', error.message);
        res.status(500).json({ msg: 'Failed to query movie' });
    }
});


router.get('/genres', async (req, res) => {
    try {
        // get genres
        const genres = await getGenreData();

        res.status(200).json(genres);

    } catch (error) {
        console.error('TMDB error:', error.message);
        res.status(500).json({ msg: 'Failed to fetch genres' });

    }
});




module.exports = router;
