/* eslint-disable no-console */
var express = require('express');
const { isAuthenticated } = require('../services/validators');
const db = require('../services/db');
const { formatMovies } = require('../services/helpers');

var router = express.Router();

router.use(isAuthenticated);


router.get('/', async (req, res) => {
    try {
        const { genre, certification, status, my_rating, sort, page = 1, limit = 10 } = req.query;

        // check if page and limit are valid
        if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
            return res.status(400).json({ msg: 'Invalid page or limit parameter' });
        }

        const validFields = ['release_date', 'imdb_rating', 'my_rating'];
        const validDirections = ['asc', 'desc'];

        // check if sort is valid
        if (sort) {
            const [field, direction] = sort.split('.');

            if (!validFields.includes(field) || !validDirections.includes(direction.toLowerCase())){
                return res.status(400).json({ msg: 'Invalid sort parameter' });
            }
        }

        // setting offset based on page
        const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

        // initating variables to store filters and values
        const filters = [];
        const values = [req.user.id];

        // add genres to filters
        if (genre) {
            const genreArray = Array.isArray(genre) ? genre : [genre];
            if (genreArray.length > 0) {
                const placeholders = genreArray.map(() => '?').join(',');
                filters.push(`genre_id IN (${placeholders})`);
                values.push(...genreArray);
            }
        }

        // add certification to filters
        if (certification) {
            const certArray = Array.isArray(certification) ? certification : [certification];
            if (certArray.length > 0) {
                const placeholders = certArray.map(() => '?').join(',');
                filters.push(`certification IN (${placeholders})`);
                values.push(...certArray);
            }
        }

        // add watch status to filters
        if (status) {
            filters.push(`watch_status = ?`);
            values.push(status);
        }

        // add my_rating to filters
        if (my_rating) {
            filters.push(`my_rating = ?`);
            values.push(my_rating);
        }

        // creating filters string for query
        let filterClause = '';
        if (filters.length > 0) {
            filterClause = ' AND ' + filters.join(' AND ');
        }

        // getting paginated movie_ids with filters
        const movieIdQuery = `
            SELECT DISTINCT movie_id, MAX(created_at) as latest_created
            FROM MOVIELIST
            WHERE user_id = ? ${filterClause}
            GROUP BY movie_id
            ORDER BY latest_created DESC
            LIMIT ? OFFSET ?
        `;
        const movieIdValues = [...values, parseInt(limit, 10), offset];
        const [idRows] = await db.query(movieIdQuery, movieIdValues);
        const movieIds = idRows.map((row) => row.movie_id);

        // return if no movies match filters
        if (movieIds.length === 0) {
            return res.status(200).json([]);
        }

        // get full details of movies with movie_id we found using filtering
        let finalQuery = `
            SELECT title, genre_id, genre_name, release_date, watch_status, certification, imdb_rating, my_rating
            FROM MOVIELIST
            WHERE user_id = ? AND movie_id IN (${movieIds.map(() => '?').join(',')})
        `;

        const finalValues = [req.user.id, ...movieIds];

        // adding sorting
        if (sort) {
            const [field, direction] = sort.split('.');
            if (validFields.includes(field) && validDirections.includes(direction.toLowerCase())) {
                finalQuery = ` ORDER BY ${field} ${direction.toUpperCase()}, created_at DESC`;
            }
        }

        // return final data
        const [rows] = await db.query(finalQuery, finalValues);
        const formatted = formatMovies(rows);
        return res.status(200).json(formatted);

    } catch (err) {
        console.error('Error retrieving mylist: ', err.message);
        res.status(500).json({ msg: 'Error retrieving mylist' });
    }
});



router.post('/', async (req, res) => {

    try {
        const { movie_id, is_liked, watch_status } = req.body;

        // check if user already has preferences for this this movie
        const [existing] = await db.query(
            `SELECT preference_id FROM USERPREFERENCES WHERE user_id = ? AND movie_id = ?`,
            [req.user.id, movie_id]
        );


        // get preference id that matches
        const [prefRes] = await db.query(
            'SELECT id FROM PREFERENCES WHERE is_liked=? AND watch_status=?',
            [is_liked, watch_status]
        );

        if (existing.length > 0 && existing[0].preference_id) {

            // update existing preference
            await db.query(
                `UPDATE USERPREFERENCES SET preference_id = ? WHERE user_id = ? AND movie_id = ?`,
                [prefRes[0].id, req.user.id, movie_id]
            );

        } else {
            // insert new preference for movie
            await db.query(
                'INSERT INTO USERPREFERENCES (user_id, preference_id, movie_id) VALUES (?, ?, ?)',
                [req.user.id, prefRes[0].id, movie_id]
            );

        }

        res.status(200).json({
            msg: "Successfully added"
        });
    } catch (err) {
        console.error('Error adding/updating watch status and preference:', err.message);
        res.status(500).json({ msg: 'Internal server error' });
    }

});

router.post('/add-rating', async (req, res) => {

    try {
        // getting request body
        const { movie_id, rating, review } = req.body;

        // check if user already rated this movie
        const [existing] = await db.query(
            `SELECT user_rating_id FROM USERPREFERENCES WHERE user_id = ? AND movie_id = ?`,
            [req.user.id, movie_id]
        );


        if (existing.length > 0 && existing[0].user_rating_id) {

            // update existing rating
            await db.query(
                `UPDATE USERRATINGS SET rating = ?, review = ?, modified_at = CURRENT_DATE() WHERE id = ?`,
                [rating, review, existing[0].user_rating_id]
            );

        } else {

            // inserting user ratings
            const [ratingsRes] = await db.query(
                'INSERT INTO USERRATINGS (rating, review, modified_at) VALUES (?, ?, CURRENT_DATE())',
                [rating, review]
            );

            // getting id of user rating that just got inserted
            const { insertId } = ratingsRes;

            // updating user preferences with new user rating id
            await db.query('UPDATE USERPREFERENCES SET user_rating_id=? WHERE user_id=? AND movie_id=?', [insertId, req.user.id, movie_id]);
        }

        res.status(200).json({
            msg: "Successfully added"
        });
    } catch (err) {
        console.error('Error adding/updating rating:', err.message);
        res.status(500).json({ msg: 'Internal server error' });
    }

});

module.exports = router;
