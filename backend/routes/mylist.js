/* eslint-disable no-console */
var express = require('express');
const { validate } = require('../services/validators');
const db = require('../services/db');

var router = express.Router();


router.get('/', async (req, res) => {

    const [queryResult] = await db.query('SELECT title, cast FROM MOVIES ');

    // if (req.user) {
    //     res.status(200).send({ msg: "Authenticated" });
    // } else {
    //     res.status(401).send({ msg: "Not Authenticated" });
    // }

    const { query } = req;

    console.log(query);

    res.status(200).json(queryResult);



});

module.exports = router;
