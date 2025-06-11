const express = require('express');
const { tmdb, getImdbData } = require('../services/tmdb');
const { validate, validateSearchQuery, validateId } = require('../services/validators');
const { insertMovie, getMovieData, getGenreData } = require('../services/helpers');
const [preferredProviders, preferredCountries] = require('../services/constants');

const router = express.Router();


// GET /api/tv/trending
router.get('/trending', async (req, res) => {
    try {
        // get trending tv shows
        const response = await tmdb.get('trending/tv/day');
        const { results } = response.data;

        // remove unnecessary data
        const trimmedResults = results.map((tvshow) => ({
            id: tvshow.id,
            title: tvshow.name,
            poster_path: tvshow.poster_path
        }));

        res.status(200).json(trimmedResults);

    } catch (error) {
        console.error('TMDB error:', error.message);
        res.status(500).json({ msg: 'Failed to fetch trending tv shows' });

    }
});

// GET /api/tv/top_rated
router.get('/top-rated', async (req, res) => {
    try {
        // get top rated tv
        const response = await tmdb.get('/tv/top_rated');
        const { results } = response.data;

        // remove unnecessary data
        const trimmedResults = results.map((tvshow) => ({
            id: tvshow.id,
            title: tvshow.name,
            poster_path: tvshow.poster_path
        }));

        res.status(200).json(trimmedResults);

    } catch (error) {
        console.error('TMDB error:', error.message);
        res.status(500).json({ msg: 'Failed to fetch top rated tv shows' });

    }
});

// GET /api/tv/now-airing
router.get('/now-airing', async (req, res) => {
    try {
        // get tv airing in 7 days
        const response = await tmdb.get('/tv/on_the_air');
        const { results } = response.data;

        // remove unnecessary data
        const trimmedResults = results.map((tvshow) => ({
            id: tvshow.id,
            title: tvshow.name,
            poster_path: tvshow.poster_path
        }));

        res.status(200).json(trimmedResults);

    } catch (error) {
        console.error('TMDB error:', error.message);
        res.status(500).json({ msg: 'Failed to fetch now airing tv shows' });

    }
});


router.get('/search', validateSearchQuery('q'), validate, async (req, res) => {

    try {

        const { query } = req;

        const url = "/search/tv";

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

        const trimmedResults = results.map((show) => ({
            id: show.id,
            title: show.name
        }));

        res.status(200).json(trimmedResults);

    } catch (error) {
        console.error('TMDB error:', error.message);
        res.status(500).json({ msg: 'Failed to query tv show' });
    }
});



router.get('/show/:id', validateId('id'), validate, async (req, res) => {
    try {
        const showId = req.params.id;

        // check if tv show already exists in db and return
        // const dataFromDb = await getMovieData(showId);
        // if (dataFromDb) {
        //     return res.status(200).json(dataFromDb);
        // }

        const showResp = await tmdb.get(`/tv/${showId}?append_to_response=content_ratings,videos,watch/providers,external_ids`);

        const show = showResp?.data;
        const videos = show.videos?.results ?? [];
        const providers = show['watch/providers']?.results ?? {};
        const contentRatings = show.content_ratings?.results || [];

        // get basic data
        const result = getBasicInfo(show);
        if (!result) throw new Error('Invalid movie data received from TMDB');


        // get country specific certification
        const certification = getContentCertification(contentRatings, preferredCountries);
        result.certification = certification;

        // get trailer from youtube
        result.trailer = getTrailer(videos);

        // getting critic ratings and cast details
        const { ratings, cast } = await getImdbData(result.imdb_id);
        result.cast = cast;

        const ratingData = parseRatings(ratings);
        result.imdb_rating = ratingData.imdb_rating;
        result.rotten_rating = ratingData.rotten_rating;
        result.metacritic_rating = ratingData.metacritic_rating;


        // get top 2 watch providers according to countries if it is a popular platform sorted by custom priority list
        result.watch_providers = getTopWatchProviders(providers);

        // send results back to client
        res.status(200).json(result);

        // insert movie details into db
        // insertMovie(trimmedResults);

    } catch (error) {
        console.error('TMDB error:', error.message);
        res.status(500).json({ msg: 'Failed to fetch show' });
    }
});



// get user's movie ratings and preferences
router.get('/user-preferences/:id', validateId('id'), validate, async (req, res) => {
    try {
        const movieId = req.params.id;

        var result = {};

        // get and append user rating
        try {
            // var userRating = await getUserRating(req.user.id, movieId);
            result.user_rating = 0;
        } catch (err) {
            console.error('[Error] fetching user rating:', err.message);
            result.user_rating = 0;
        }

        // get and append watch status
        try {
            // const watch_status = await getWatchStatus(req.user.id, movieId);
            result.watch_status = 0;
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
function getBasicInfo(show) {
    if (!show || typeof show !== 'object') return null;
    return {
        id: show.id || null,
        imdb_id: show.external_ids?.imdb_id,
        original_language: show.original_language || null,
        overview: show.overview || null,
        title: show.name || null,
        number_of_episodes: show.number_of_episodes || null,
        number_of_seasons: show.number_of_seasons || null,
        poster_path: show.poster_path || null,
        backdrop_path: show.backdrop_path || null,
        genres: show.genres || [],
        certification: 'NR',
        release_date: show.first_air_date || null,
        director: show.created_by && show.created_by.length > 0 ? show.created_by.map(creator => creator.name).join(', ') : null
    };
}

// helper to get country-specific release info
function getContentCertification(contentRatings, preferredCountries) {
    try {
        const countryRating = contentRatings.find(
            (r) => preferredCountries.includes(r.iso_3166_1)
        );
        if (countryRating?.rating) {
            return countryRating.rating;
        }
    } catch (err) {
        console.error('Content rating error:', err?.message || err);
    }

    return 'NR'; // default if no rating found
}


// helper to get trailer
function getTrailer(videos) {
    if (!Array.isArray(videos)) return null;

    for (const video of videos) {
        if (video?.site === 'YouTube' && ['Trailer', 'Official Trailer'].includes(video?.type)) {
            return `https://www.youtube.com/watch?v=${encodeURIComponent(video.key)}`;
        }
    }
    return null;
}

// helper to parse critic ratings
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

// helper to get top 2 watch providers
function getTopWatchProviders(providers) {
    if (typeof providers !== 'object' || !providers) return [];

    const flattened = preferredCountries.flatMap(
        (c) => providers[c]?.flatrate || []
    );

    const filtered = flattened.filter(
        (p) => preferredProviders.includes(p.provider_id)
    );

    const unique = Array.from(
        new Map(filtered.map((p) => [p.provider_id, p])).values()
    );

    return unique
        .sort(
            (a, b) =>
                preferredProviders.indexOf(a.provider_id) -
                preferredProviders.indexOf(b.provider_id)
        )
        .slice(0, 2);
}



module.exports = router;
