/* eslint-disable consistent-return */
/* eslint-disable max-len */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-use-before-define */
/* eslint-disable no-console */
const express = require('express');
const { isAuthenticated } = require('../services/validators');
const db = require('../services/db');
const { addMoviePreference, getRandomMovie, filterMovieIds } = require('../services/helpers');
const {
    createMovieVector,
    calculateScore,
    updateUserVector,
    getUserVector,
    getTopMovie,
    getMoviesTMDB,
    updateScore
} = require('../services/algo');

const router = express.Router();

router.use(isAuthenticated);

router.post('/createUserVector', async (req, res) => {
    try {
        const userId = req.user.id;
        // console.log(`[INFO] Fetching movie for user ID: ${userId}`);

        const vec = await getUserVector(userId);

        // console.table(vec);

        return res.status(200).json({
            msg: "Vector Created Succeffully"
        });
    } catch (err) {
        console.error('[ERROR] Failed to get movies:', err);
        return res.status(500).json({ msg: 'Internal server error while fetching movies' });
    }
});

const MAX_FETCH_ATTEMPTS = 10;
// GET /movies – Fetches recommendations but avoids infinite loops
router.get('/movies', async (req, res) => {
    const userId = req.user.id;
    if (!userId) {
        return res.status(401).json({ msg: 'Unauthenticated' });
    }

    let movieIds = [];
    let attempt = 0;

    try {
        while (attempt < MAX_FETCH_ATTEMPTS && movieIds.length === 0) {
            attempt++;
            // console.log(`[INFO] Attempt #${attempt} for user ${userId}`);

            const topMovie = await getTopMovie(userId);
            // console.log(`[DEBUG] getTopMovie returned:`, topMovie);

            let candidates;
            if (topMovie === -1) {
                // No personalized seed—grab some randoms
                const randomPromises = Array.from({ length: 10 }, () => getRandomMovie());
                candidates = await Promise.all(randomPromises);
                // console.log(`[DEBUG] Random candidates:`, candidates);
            } else {
                // Use TMDB recommendations
                candidates = await getMoviesTMDB(topMovie);
                // console.log(`[DEBUG] TMDB recommendations for ${topMovie}:`, candidates);
            }

            movieIds = await filterMovieIds(userId, candidates);
            // console.log(`[DEBUG] After filtering, new movieIds:`, movieIds);
        }

        if (movieIds.length === 0) {
            // Ran out of attempts with no fresh movies
            return res.status(204).json({ msg: 'No new movies found at this time' });
        }

        return res.status(200).json({
            msg: 'Movies fetched successfully',
            movieIds
        });
    } catch (err) {
        console.error('[ERROR] /movies handler:', err);
        return res.status(500).json({ msg: 'Internal server error while fetching movies' });
    }
});

router.post('/genres-name', async (req, res) => {
    const userId = req.user.id;
    const genreNames = req.body;

    if (!Array.isArray(genreNames)) {
        return res.status(400).json({ msg: "Invalid input format. Expected an array of genre names." });
    }

    try {
        // Fetch genre IDs from names
        const genreIds = [];
        for (const name of genreNames) {
            const [rows] = await db.query('SELECT id FROM GENRES WHERE name = ?', [name]);
            if (rows.length > 0) {
                genreIds.push(rows[0].id);
            } else {
                console.warn(`[WARN] Genre '${name}' not found.`);
            }
        }

        // Delete all existing user genres
        await db.query('DELETE FROM USERGENRES WHERE user_id = ?', [userId]);

        // Insert new ones
        for (const id of genreIds) {
            await db.query('INSERT INTO USERGENRES (user_id, genre_id) VALUES (?, ?)', [userId, id]);
        }

        res.status(200).json({ msg: "Genres updated successfully." });
    } catch (err) {
        console.error('[ERROR] Failed to update genres:', err);
        res.status(500).json({ msg: 'Internal server error while updating genres' });
    }
});

router.post('/languages-code', async (req, res) => {
    const userId = req.user.id;
    const languageCodes = req.body;

    if (!Array.isArray(languageCodes)) {
        return res.status(400).json({ msg: "Invalid input format. Expected an array of language codes." });
    }

    try {
        const languageIds = [];
        for (let code of languageCodes) {
            let [rows] = await db.query('SELECT id FROM LANGUAGES WHERE code = ?', [code]);

            if (rows.length === 0) {
                console.warn(`[WARN] Language code '${code}' not found. Assigning to 'ot'`);
                [rows] = await db.query('SELECT id FROM LANGUAGES WHERE code = "ot"');
            }

            if (rows.length > 0) languageIds.push(rows[0].id);
        }

        // Delete all existing user languages
        await db.query('DELETE FROM USERLANGUAGES WHERE user_id = ?', [userId]);

        // Insert new ones
        for (const id of languageIds) {
            await db.query('INSERT INTO USERLANGUAGES (user_id, language_id) VALUES (?, ?)', [userId, id]);
        }

        res.status(200).json({ msg: "Languages updated successfully." });
    } catch (err) {
        console.error('[ERROR] Failed to update languages:', err);
        res.status(500).json({ msg: 'Internal server error while updating languages' });
    }
});

router.post('/genres-id', async (req, res) => {
    const userId = req.user.id;
    const genreIds = req.body;

    // console.log(genreIds);

    if (!Array.isArray(genreIds)) {
        return res.status(400).json({ msg: "Invalid input. Expected an array of genre IDs." });
    }

    try {
        await db.query('DELETE FROM USERGENRES WHERE user_id = ?', [userId]);

        for (const genreId of genreIds) {
            await db.query('INSERT INTO USERGENRES (user_id, genre_id) VALUES (?, ?)', [userId, genreId]);
        }

        res.status(200).json({ msg: "Genres updated successfully." });
    } catch (err) {
        console.error('[ERROR] Failed to update genres:', err);
        res.status(500).json({ msg: 'Internal server error while updating genres.' });
    }
});

router.post('/languages-id', async (req, res) => {
    const userId = req.user.id;
    const languageIds = req.body;

    // console.log(languageIds);

    if (!Array.isArray(languageIds)) {
        return res.status(400).json({ msg: "Invalid input. Expected an array of language IDs." });
    }

    try {
        await db.query('DELETE FROM USERLANGUAGES WHERE user_id = ?', [userId]);

        for (const languageId of languageIds) {
            await db.query('INSERT INTO USERLANGUAGES (user_id, language_id) VALUES (?, ?)', [userId, languageId]);
        }

        res.status(200).json({ msg: "Languages updated successfully." });
    } catch (err) {
        console.error('[ERROR] Failed to update languages:', err);
        res.status(500).json({ msg: 'Internal server error while updating languages.' });
    }
});



router.post('/movie', async (req, res) => {
    try {
        const { movie_id, is_liked, watch_status } = req.body;
        const userId = req.user.id;

        // console.log(is_liked);

        // console.log(`[INFO] Received request to update preferences for user: ${userId}, movie: ${movie_id}`);

        await addMoviePreference(movie_id, is_liked, watch_status, userId);
        // console.log('[INFO] Preference saved to database');

        const [movieVector, userVector] = await Promise.all([
            createMovieVector(userId, movie_id),
            getUserVector(userId)
        ]);

        if (is_liked) {
            const score = calculateScore(movieVector, userVector);
            await updateScore(score, movie_id, userId);
            // console.log('[INFO] Movie score updated');
        }

        await updateUserVector(userId, userVector, movieVector, is_liked);
        // console.log('[INFO] User vector updated');

        return res.status(200).json({ msg: "Preference updated successfully" });
    } catch (err) {
        console.error('[ERROR] Failed to update user preference:', err);
        return res.status(500).json({ msg: 'Internal server error while updating preferences' });
    }
});

module.exports = router;
