/* eslint-disable no-console */
var express = require('express');
const { isAuthenticated, validateMyListQuery, validateAddMoviePreference, validateAddRating, validate } = require('../services/validators');
const db = require('../services/db');
const { formatMovies, addMoviePreference } = require('../services/helpers');

var router = express.Router();

// allow allow logged in users
router.use(isAuthenticated);

// get user's movie list with optional filters, sorting, pagination
router.get('/', validateMyListQuery, validate, async (req, res) => {
    try {
        const { genre, certification, status, my_rating, sort, page = 1, limit = 10 } = req.query;

        // validate pagination params
        if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
            return res.status(400).json({ msg: 'Invalid page or limit parameter' });
        }

        const validFields = ['release_date', 'imdb_rating', 'my_rating'];
        const validDirections = ['asc', 'desc'];

        // validate sort param if exists
        if (sort) {
            const [field, direction] = sort.split('.');
            if (!validFields.includes(field) || !validDirections.includes(direction.toLowerCase())) {
                return res.status(400).json({ msg: 'Invalid sort parameter' });
            }
        }

        // setting offset based on page
        const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

        // initating variables to store filters and values
        const filters = [`watch_status IN (2, 3)`];
        const values = [req.user.id];

        // add genre filters
        if (genre) {
            const genreArray = Array.isArray(genre) ? genre : [genre];
            if (genreArray.length > 0) {
                const placeholders = genreArray.map(() => '?').join(',');
                filters.push(`genre_id IN (${placeholders})`);
                values.push(...genreArray);
            }
        }

        // add certification filters
        if (certification) {
            const certArray = Array.isArray(certification) ? certification : [certification];
            if (certArray.length > 0) {
                const placeholders = certArray.map(() => '?').join(',');
                filters.push(`certification IN (${placeholders})`);
                values.push(...certArray);
            }
        }

        // add watch status filters
        if (status) {
            const statusArray = Array.isArray(status) ? status : [status];
            if (statusArray.length > 0) {
                const placeholders = statusArray.map(() => '?').join(',');
                filters.push(`watch_status IN (${placeholders})`);
                values.push(...statusArray);
            }
        }

        // add rating filter
        if (my_rating) {
            filters.push(`my_rating = ?`);
            values.push(my_rating);
        }

        // creating filters string for query
        let filterClause = '';
        if (filters.length > 0) {
            filterClause = ' AND ' + filters.join(' AND ');
        }

        // get movie ids matching filters, sorted by latest created
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

        // retrieve movie details using movieIds
        let finalQuery = `
            SELECT movie_id, title, genre_id, genre_name, release_date, watch_status, certification, imdb_rating, my_rating
            FROM MOVIELIST
            WHERE user_id = ? AND movie_id IN (${movieIds.map(() => '?').join(',')})
        `;

        const finalValues = [req.user.id, ...movieIds];

        // adding sorting
        if (sort) {
            const [field, direction] = sort.split('.');
            if (validFields.includes(field) && validDirections.includes(direction.toLowerCase())) {
                finalQuery += ` ORDER BY ${field} ${direction.toUpperCase()}, created_at DESC`;
            }
        }

        // Counting the total movies matching the filters
        const countQuery = `
            SELECT COUNT(DISTINCT movie_id) AS total
            FROM MOVIELIST
            WHERE user_id = ? ${filterClause}
        `;
        const [countRows] = await db.query(countQuery, values);
        const total = countRows[0]?.total || 0;

        // return final data
        const [rows] = await db.query(finalQuery, finalValues);
        const formatted = formatMovies(rows);
        return res.status(200).json({
            total,
            movies: formatted
        });

    } catch (err) {
        console.error('Error retrieving mylist: ', err.message);
        res.status(500).json({ msg: 'Error retrieving mylist' });
    }
});

// add or update movie preference (watch status and like status)
router.post('/', validateAddMoviePreference, validate, async (req, res) => {
    try {
        const { movie_id, is_liked, watch_status } = req.body;

        // helper handles insertion/updating of MOVIELIST and USERPREFERENCES
        const message = await addMoviePreference(movie_id, is_liked, watch_status, req.user.id);

        res.status(200).json({ msg: message });
    } catch (err) {
        console.error('Error adding/updating watch status and preference:', err.message);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// add or update rating and review
router.post('/add-rating', validateAddRating, validate, async (req, res) => {
    try {
        // getting request body
        const { movie_id, rating, review } = req.body;

        // check if user already has a rating
        const [existing] = await db.query(
            `SELECT user_rating_id FROM USERPREFERENCES WHERE user_id = ? AND movie_id = ?`,
            [req.user.id, movie_id]
        );

        if (existing.length > 0) {
            if (!existing[0].user_rating_id) {
                // no rating yet, insert new rating
                const [ratingsRes] = await db.query(
                    'INSERT INTO USERRATINGS (rating, review, modified_at) VALUES (?, ?, CURRENT_DATE())',
                    [rating, review]
                );
                const { insertId } = ratingsRes;

                // link new rating id to user preferences
                await db.query('UPDATE USERPREFERENCES SET user_rating_id=? WHERE user_id=? AND movie_id=?', [insertId, req.user.id, movie_id]);

                res.status(200).json({ msg: "successfully added" });
            } else {
                // update existing rating
                await db.query(
                    `UPDATE USERRATINGS SET rating = ?, review = ?, modified_at = CURRENT_DATE() WHERE id = ?`,
                    [rating, review, existing[0].user_rating_id]
                );

                res.status(200).json({ msg: "successfully updated" });
            }
        } else {
            // no preference yet, create default preference
            await addMoviePreference(movie_id, true, 0, req.user.id);

            // insert new rating
            const [ratingsRes] = await db.query(
                'INSERT INTO USERRATINGS (rating, review, modified_at) VALUES (?, ?, CURRENT_DATE())',
                [rating, review]
            );
            const { insertId } = ratingsRes;

            // link new rating id
            await db.query('UPDATE USERPREFERENCES SET user_rating_id=? WHERE user_id=? AND movie_id=?', [insertId, req.user.id, movie_id]);

            res.status(200).json({ msg: "successfully added" });
        }

    } catch (err) {
        console.error('Error adding/updating rating:', err.message);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

module.exports = router;
