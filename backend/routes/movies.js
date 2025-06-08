/* eslint-disable max-len */
const express = require('express');
const { tmdb, getImdbData } = require('../services/tmdb');
const { validate, validateSearchQuery, validateId } = require('../services/validators');
const { insertMovie, getMovieData, getGenreData, getUserRating, getWatchStatus, getLangData } = require('../services/helpers');
const [preferredProviders, preferredCountries] = require('../services/constants');

const router = express.Router();


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

router.get('/languages', async (req, res) => {
    try {
        // get genres
        const lang = await getLangData();
        res.status(200).json(lang);

    } catch (error) {
        console.error('TMDB error:', error.message);
        res.status(500).json({ msg: 'Failed to fetch genres' });

    }
});


// // get movie details for a movie
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
        result = getBasicInfo(movie);

        // get country specific release dates and certification
        var releaseResp = { data: movie.release_dates };
        var releaseData = getReleaseInfo(movie, releaseResp);
        result.certification = releaseData.certification;
        result.release_date = releaseData.release_date;

        // get trailer from youtube
        result.trailer = getTrailer(videos);

        // getting critic ratings and cast details
        var { ratings, director, cast } = await getImdbData(movie.imdb_id);
        var ratingData = parseRatings(ratings);
        result.imdb_rating = ratingData.imdb_rating;
        result.rotten_rating = ratingData.rotten_rating;
        result.metacritic_rating = ratingData.metacritic_rating;

        result.director = director;
        result.cast = cast;

        // get top 2 watch providers according to countries if it is a popular platform sorted by custom priority list
        result.watch_providers = getTopWatchProviders(providers);

        // send results back to client
        res.status(200).json(results);

        // insert movie details into db
        insertMovie(results);

    } catch (error) {
        console.error('TMDB error:', error.message);
        res.status(500).json({ msg: 'Failed to fetch movie' });

    }
});


// get user's movie ratings and preferences
router.get('/user-preferences/:id', validateId('id'), validate, async (req, res) => {
    try {
        const movieId = req.params.id;

        var result = {};

        // get and append user rating
        try {
            var userRating = await getUserRating(req.user.id, movieId);
            result.user_rating = userRating;
        } catch (err) {
            console.error('Error fetching user rating:', err.message);
            result.user_rating = 0;
        }

        // get and append watch status
        try {
            const watch_status = await getWatchStatus(req.user.id, movieId);
            result.watch_status = watch_status;
        } catch (err) {
            console.error('[Error] fetching Watch Status:', err.message);
            result.watch_status = 0;
        }

        return res.status(200).json(result);

    } catch (err) {
        console.error('Error fetching movie details:', err.message);
        res.status(500).json({ msg: 'Failed to fetch movie' });
    }
});



// Helper Functions
// helper to trim unnecessary data
function getBasicInfo(movie) {
    return {
        id: movie.id || null,
        imdb_id: movie.imdb_id || null,
        original_language: movie.original_language || null,
        overview: movie.overview || null,
        title: movie.title || null,
        runtime: movie.runtime || null,
        poster_path: movie.poster_path || null,
        backdrop_path: movie.backdrop_path || null,
        genres: movie.genres || null,
    };
}

// helper to get country-specific release info
function getReleaseInfo(movie, releaseResp) {
    var result = {};
    try {
        var countryList = releaseResp.data.results;

        // iterating through all countries
        for (var i = 0; i < countryList.length; i++) {
            if (countryList[i].iso_3166_1 === preferredCountries[0]) {

                // based on preferred country
                var releaseDate = countryList[i].release_dates[0];
                result.certification = releaseDate.certification;
                result.release_date = new Date(releaseDate.release_date).toISOString().split('T')[0];
                return result;
            }
        }
    } catch (err) {
        console.error('Error getting release info:', err.message);
    }

    // set default as NR
    result.certification = 'NR';

    // clean release date
    result.release_date = movie.release_date ? new Date(movie.release_date).toISOString().split('T')[0] : null;

    return result;
}

// helper to get trailer
function getTrailer(videos) {
    for (var i = 0; i < videos.length; i++) {

        // getting official trailers on youtube
        if (videos[i].site === 'YouTube' && (videos[i].type === 'Trailer' || videos[i].type === 'Official Trailer')) {
            return `https://www.youtube.com/watch?v=${videos[i].key}`;
        }
    }
    return null;
}

// helper to parse critic ratings
function parseRatings(ratings) {
    var parsed = {
        imdb_rating: null,
        rotten_rating: null,
        metacritic_rating: null
    };

    // parsing ratings
    for (var i = 0; i < ratings.length; i++) {
        var r = ratings[i];
        if (r.Source === 'Internet Movie Database') {
            parsed.imdb_rating = parseFloat(r.Value.split('/')[0]) || null;
        } else if (r.Source === 'Rotten Tomatoes') {
            parsed.rotten_rating = parseInt(r.Value.replace('%', ''), 10) || null;
        } else if (r.Source === 'Metacritic') {
            parsed.metacritic_rating = parseInt(r.Value.split('/')[0], 10) || null;
        }
    }

    return parsed;
}

// helper to get top 2 watch providers
function getTopWatchProviders(providers) {
    var all = [];
    for (var c = 0; c < preferredCountries.length; c++) {
        var countryCode = preferredCountries[c];
        var flatrate = providers[countryCode] && providers[countryCode].flatrate;
        if (flatrate) {
            for (var j = 0; j < flatrate.length; j++) {
                var p = flatrate[j];
                if (preferredProviders.includes(p.provider_id) && !all.some(item => item.provider_id === p.provider_id)) {
                    all.push(p);
                }
            }
        }
    }

    // sort and return top 2
    all.sort(function (a, b) {
        return preferredProviders.indexOf(a.provider_id) - preferredProviders.indexOf(b.provider_id);
    });

    return all.slice(0, 2);
}


module.exports = router;
