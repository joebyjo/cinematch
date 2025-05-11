/* eslint-disable no-console */
var express = require('express');
const { isAuthenticated, validate } = require('../services/validators');
const db = require('../services/db');
const { Result } = require('express-validator');

var router = express.Router();

router.use(isAuthenticated);


router.get('/', async (req, res) => {

    // const [queryResult] = await db.query('SELECT title, cast FROM MOVIES ');

    // // if (req.user) {
    // //     res.status(200).send({ msg: "Authenticated" });
    // // } else {
    // //     res.status(401).send({ msg: "Not Authenticated" });
    // // }

    const { certification, status, sort } = req.query;

    // plan out what the final query should look like if everything is ticked
    // make this easily modifable with more filters and sort features

    console.log(req.user.id);


    res.status(200).json(req.query);

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
            await db.query('UPDATE USERPREFERENCES SET user_rating_id=? WHERE user_id=? AND movie_id=?',[insertId, req.user.id, movie_id]);
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
