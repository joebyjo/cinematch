const express = require('express');
const { tmdb, getImdbData } = require('../services/tmdb');
const { validate, validateSearchQuery, validateId } = require('../services/validators');
const { insertMovie, getMovieData, getGenreData } = require('../services/helpers');

const router = express.Router();

const preferredProviders = [8, 9, 2, 10, 337, 531, 15, 350, 1968, 386, 1770, 1899];
const preferredCountries = ['AU', 'US', 'GB', 'IN'];

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



router.get('/show/:id', validateId('id'), validate, async (req, res) => {
    try {
        const showId = req.params.id;

        // check if tv show already exists in db and return
        // const dataFromDb = await getMovieData(showId);
        // if (dataFromDb) {
        //     return res.status(200).json(dataFromDb);
        // }

        const showResp = await tmdb.get(`/tv/${showId}?append_to_response=content_ratings,videos,watch/providers,external_ids`);

        const show = showResp.data;
        const videos = show.videos?.results || [];
        const providers = show['watch/providers']?.results || {};
        const contentRatings = show.content_ratings?.results || [];

        // remove unnecessary data
        const trimmedResults = {
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
            release_date: show.first_air_date || null
        };

        // get country specific certification
        try {
            const countryRating = contentRatings.find(
                (r) => preferredCountries.includes(r.iso_3166_1)
            );
            if (countryRating?.rating) {
                trimmedResults.certification = countryRating.rating;
            }
        } catch (err) {
            console.error('Content rating error:', err.message);
        }

        // get trailer from youtube
        const trailers = videos.filter(
            (v) =>
                v.site === 'YouTube' &&
                ['Trailer', 'Official Trailer'].includes(v.type)
        );

        if (trailers.length > 0) {
            trimmedResults.trailer = `https://www.youtube.com/watch?v=${trailers[0].key}`;
        }

        // getting critic ratings and cast details
        const { ratings, director, cast } = await getImdbData(trimmedResults.imdb_id);

        trimmedResults.director = director || null;
        trimmedResults.cast = cast || null;

        // getting individual ratings
        trimmedResults.imdb_rating = null;
        trimmedResults.rotten_rating = null;
        trimmedResults.metacritic_rating = null;

        try {
            ratings.forEach((rating) => {
                if (rating.Source === 'Internet Movie Database') {
                    const value = parseFloat(rating.Value.split('/')[0]);
                    trimmedResults.imdb_rating = isNaN(value) ? null : value;
                } else if (rating.Source === 'Rotten Tomatoes') {
                    const value = parseInt(rating.Value.replace('%', ''), 10);
                    trimmedResults.rotten_rating = isNaN(value) ? null : value;
                } else if (rating.Source === 'Metacritic') {
                    const value = parseInt(rating.Value.split('/')[0], 10);
                    trimmedResults.metacritic_rating = isNaN(value) ? null : value;
                }
            });
        } catch (err) {
            console.error('Error parsing ratings:', err.message);
        }

        // get top 2 watch providers according to countries if it is a popular platform sorted by custom priority list
        const countryProviders = Array.from(
            new Map(
                preferredCountries.flatMap(
                    (c) => providers[c]?.flatrate || []
                )
                    .filter((p) => preferredProviders.includes(p.provider_id))
                    .map((p) => [p.provider_id, p])
            ).values()
        )
            .sort(
                (a, b) =>
                    preferredProviders.indexOf(a.provider_id) -
                    preferredProviders.indexOf(b.provider_id)
            )
            .slice(0, 2);

        trimmedResults.watch_providers = countryProviders;

        // send results back to client
        res.status(200).json(trimmedResults);

        // insert movie details into db
        // insertMovie(trimmedResults);

    } catch (error) {
        console.error('TMDB error:', error.message);
        res.status(500).json({ msg: 'Failed to fetch show' });
    }
});




module.exports = router;
