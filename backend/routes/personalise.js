/* eslint-disable no-use-before-define */
/* eslint-disable no-console */
const express = require('express');
const { isAuthenticated } = require('../services/validators');
const db = require('../services/db');
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

router.get('/movies', async (req, res) => {
    try {
        const userId = req.user.id;
        // console.log(`[INFO] Fetching movie for user ID: ${userId}`);

        let movieIds = [];
        let len = 0;
        while (len === 0) {
            const movieId = await getTopMovie(userId);
            movieIds = await getMoviesTMDB(movieId);
            len = movieIds.length;
        }

        return res.status(200).json({
            msg: "Movies fetched successfully",
            movieIds
        });
    } catch (err) {
        console.error('[ERROR] Failed to get movies:', err);
        return res.status(500).json({ msg: 'Internal server error while fetching movies' });
    }
});


router.post('/genres', async (req, res) => {
    try {
        const [] = req.body;

        return res.status(200).json({ msg: "Preference updated successfully" });
    } catch (err) {
        console.error('[ERROR] Failed to update user preference:', err);
        return res.status(500).json({ msg: 'Internal server error while updating preferences' });
    }
});

router.post('/languages', async (req, res) => {
    try {
        const [] = req.body;

        return res.status(200).json({ msg: "Preference updated successfully" });
    } catch (err) {
        console.error('[ERROR] Failed to update user preference:', err);
        return res.status(500).json({ msg: 'Internal server error while updating preferences' });
    }
});

router.post('/movie', async (req, res) => {
    try {
        const { movie_id, is_liked, watch_status } = req.body;
        const userId = req.user.id;

        // console.log(is_liked);

        // console.log(`[INFO] Received request to update preferences for user: ${userId}, movie: ${movie_id}`);

        await addMovie(movie_id, is_liked, watch_status, userId);
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

async function addMovie(movie_id, is_liked, watch_status, userId) {
    try {
        const [existing] = await db.query(
            'SELECT preference_id FROM USERPREFERENCES WHERE user_id = ? AND movie_id = ?',
            [userId, movie_id]
        );

        console.log('[INFO] Checked existing preferences');

        const [prefRes] = await db.query(
            'SELECT id FROM PREFERENCES WHERE is_liked = ? AND watch_status = ?',
            [is_liked, watch_status]
        );

        if (!prefRes.length) {
            throw new Error('Preference ID not found for provided values');
        }

        const preferenceId = prefRes[0].id;

        if (existing.length > 0) {
            await db.query(
                'UPDATE USERPREFERENCES SET preference_id = ? WHERE user_id = ? AND movie_id = ?',
                [preferenceId, userId, movie_id]
            );
            console.log('[INFO] Existing preference updated');
        } else {
            await db.query(
                'INSERT INTO USERPREFERENCES (user_id, preference_id, movie_id) VALUES (?, ?, ?)',
                [userId, preferenceId, movie_id]
            );
            console.log('[INFO] New preference inserted');
        }
    } catch (err) {
        console.error('[ERROR] Failed to add/update movie preference:', err);
        throw new Error('Database error while saving movie preference');
    }
}

module.exports = router;
