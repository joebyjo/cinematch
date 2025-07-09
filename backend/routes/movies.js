/* eslint-disable max-len */
const express = require('express');
const { tmdb, getImdbData } = require('../services/tmdb');
const { validate, validateSearchQuery, validateId } = require('../services/validators');
const { insertMovie, getMovieData, getGenreData, getUserRating, getWatchStatus, getLangData } = require('../services/helpers');
const { preferredProviders, preferredCountries } = require('../services/constants');

const router = express.Router();

// GET /api/movies/trending
router.get('/trending', async (req, res) => {
    try {
        const response = await tmdb.get('/movie/popular');
        const { results } = response.data;

        // trim each movie object to only needed fields
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

        // trim each movie object to only needed fields
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

        // trim each movie object to only needed fields
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

// search for movies by query
router.get('/search', validateSearchQuery('q'), validate, async (req, res) => {
    try {
        const { query } = req;
        const url = "/search/movie";

        const { data } = await tmdb.get(url, {
            params: {
                query: query.q,
                include_adult: false
            }
        });

        var { results } = data;
        // results = results.slice(0, 5); // limit results to 5

        const trimmedResults = results.map((movie) => ({
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path
        }));

        res.status(200).json(trimmedResults);

    } catch (error) {
        console.error('TMDB error:', error.message);
        res.status(500).json({ msg: 'Failed to query movie' });
    }
});

// get list of genres
router.get('/genres', async (req, res) => {
    try {
        const genres = await getGenreData();
        res.status(200).json(genres);
    } catch (error) {
        console.error('TMDB error:', error.message);
        res.status(500).json({ msg: 'Failed to fetch genres' });
    }
});

// get list of languages
router.get('/languages', async (req, res) => {
    try {
        const lang = await getLangData();
        res.status(200).json(lang);
    } catch (error) {
        console.error('TMDB error:', error.message);
        res.status(500).json({ msg: 'Failed to fetch genres' });
    }
});

// get full movie details from tmdb/imdb
router.get('/movie/:id', validateId('id'), validate, async (req, res) => {
    try {
        const movieId = req.params.id;

        // check if movie already exists in db and return
        const dataFromDb = await getMovieData(movieId);
        if (dataFromDb) {
            return res.status(200).json(dataFromDb); // return cached data
        }

        const movieResp = await tmdb.get(`/movie/${movieId}?append_to_response=release_dates,videos,watch/providers`);
        const movie = movieResp?.data;
        const videos = movie?.videos?.results ?? []; // extract videos
        const providers = movie?.['watch/providers']?.results ?? {}; // extract providers

        const result = getBasicInfo(movie);
        if (!result) throw new Error('Invalid movie data received from TMDB');

        const releaseResp = { data: movie?.release_dates ?? {} };
        const releaseData = getReleaseInfo(movie, releaseResp); // get cert + date
        result.certification = releaseData.certification;
        result.release_date = releaseData.release_date;

        result.trailer = getTrailer(videos); // get trailer link

        const { ratings, director, cast } = await getImdbData(movie.imdb_id);
        const ratingData = parseRatings(ratings); // parse ratings
        result.imdb_rating = ratingData.imdb_rating;
        result.rotten_rating = ratingData.rotten_rating;
        result.metacritic_rating = ratingData.metacritic_rating;
        result.director = director;
        result.cast = cast;
        result.watch_providers = getTopWatchProviders(providers); // pick top 2

        res.status(200).json(result); // respond immediately

        // insert movie details into db (after sending response to avoid delay)
        insertMovie(result);

    } catch (error) {
        console.error('TMDB error:', error?.message || error);
        res.status(500).json({ msg: 'Failed to fetch movie' });
    }
});

// get user-specific movie data (rating, status)
router.get('/user-preferences/:id', validateId('id'), validate, async (req, res) => {
    try {
        const movieId = req.params.id;
        var result = {};

        // get and append user rating
        try {
            var userRating = await getUserRating(req.user.id, movieId);
            result.user_rating = userRating; // user's rating for this movie
        } catch (err) {
            console.error('Error fetching user rating:', err.message);
            result.user_rating = 0; // default if none
        }

        try {
            const watch_status = await getWatchStatus(req.user.id, movieId);
            result.watch_status = watch_status; // watchlist status
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
    if (!movie || typeof movie !== 'object') return null;
    return {
        id: movie.id ?? null,
        imdb_id: movie.imdb_id ?? null,
        original_language: movie.original_language ?? null,
        overview: movie.overview ?? null,
        title: movie.title ?? null,
        runtime: movie.runtime ?? null,
        poster_path: movie.poster_path ?? null,
        backdrop_path: movie.backdrop_path ?? null,
        genres: Array.isArray(movie.genres) ? movie.genres : null,
    };
}

// helper to get country-specific release info
function getReleaseInfo(movie, releaseResp) {
    const result = {};
    try {
        const countryList = releaseResp?.data?.results || [];
        for (const country of countryList) {
            if (country?.iso_3166_1 === preferredCountries[0]) {
                const releaseDate = country?.release_dates?.[0];
                if (releaseDate) {
                    result.certification = releaseDate.certification || 'NR';
                    // format date to yyyy-mm-dd
                    result.release_date = new Date(releaseDate.release_date).toISOString().split('T')[0];
                    return result;
                }
            }
        }
    } catch (err) {
        console.error('Error getting release info:', err?.message || err);
    }

    result.certification = 'NR';
    result.release_date = movie?.release_date ? new Date(movie.release_date).toISOString().split('T')[0] : null;
    return result;
}

// helper to find trailer link
function getTrailer(videos) {
    if (!Array.isArray(videos)) return null;

    for (const video of videos) {
        // check if youtube and of type trailer
        if (video?.site === 'YouTube' && ['Trailer', 'Official Trailer'].includes(video?.type)) {
            return `https://www.youtube.com/watch?v=${encodeURIComponent(video.key)}`;
        }
    }
    return null;
}

// helper to parse external ratings
function parseRatings(ratings) {
    const parsed = {
        imdb_rating: null,
        rotten_rating: null,
        metacritic_rating: null
    };

    if (!Array.isArray(ratings)) return parsed;

    for (const r of ratings) {
        if (!r?.Source || !r?.Value) continue;

        if (r.Source === 'Internet Movie Database') {
            const val = parseFloat(r.Value.split('/')[0]);
            parsed.imdb_rating = isNaN(val) ? null : val;
        } else if (r.Source === 'Rotten Tomatoes') {
            const val = parseInt(r.Value.replace('%', ''), 10);
            parsed.rotten_rating = isNaN(val) ? null : val;
        } else if (r.Source === 'Metacritic') {
            const val = parseInt(r.Value.split('/')[0], 10);
            parsed.metacritic_rating = isNaN(val) ? null : val;
        }
    }

    return parsed;
}

// helper to select watch providers by priority
function getTopWatchProviders(providers) {
    const all = [];

    if (typeof providers !== 'object' || !providers) return all;

    for (const countryCode of preferredCountries) {
        const flatrate = providers?.[countryCode]?.flatrate;
        if (Array.isArray(flatrate)) {
            for (const p of flatrate) {
                // avoid duplicates and check priority
                if (
                    p?.provider_id &&
                    preferredProviders.includes(p.provider_id) &&
                    !all.some(item => item.provider_id === p.provider_id)
                ) {
                    all.push(p);
                }
            }
        }
    }

    // sort based on preferred order
    all.sort((a, b) => preferredProviders.indexOf(a.provider_id) - preferredProviders.indexOf(b.provider_id));
    return all.slice(0, 2); // return top 2 only
}

module.exports = router;
