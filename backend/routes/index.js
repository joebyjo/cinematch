var express = require('express');
const path = require('path');
const { isAuthenticated, isAdmin } = require('../services/validators');
var router = express.Router();
const db = require('../services/db');


router.get('/', function (req, res, next) {
    res.redirect('/home');
});

router.get('/home', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../../frontend/homepage.html'));

    req.session.visited = true;
});

router.get('/personalise', isAuthenticated, async function (req, res, next) {

    // checking if user Vector exists
    const userId = req.user.id;
    var isUserVector = false;
    try {

        const [rows] = await db.query(
            'SELECT user_vector FROM USERSETTINGS WHERE user_id = ?',
            [userId]
        );

        if (!rows[0].user_vector) {
            isUserVector = false;
        } else {
            isUserVector = true;
        }
    } catch (err) {
        isUserVector = false;
    }

    if (!isUserVector) {
        // if first time user
        res.sendFile(path.join(__dirname, '../../frontend/personalise.html'));
    } else {
        res.sendFile(path.join(__dirname, '../../frontend/personalise-swipe.html'));
    }

    req.session.visited = true;
});

router.get('/login', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../../frontend/login.html'));

    req.session.visited = true;
});

router.get('/signup', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../../frontend/signup.html'));

    req.session.visited = true;
});

router.get('/mylists', isAuthenticated, function (req, res, next) {
    res.sendFile(path.join(__dirname, '../../frontend/mylists.html'));

    req.session.visited = true;
});

router.get('/aboutus', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../../frontend/about-us.html'));

    req.session.visited = true;
});

router.get('/settings', isAuthenticated, function (req, res, next) {
    res.sendFile(path.join(__dirname, '../../frontend/settings.html'));

    req.session.visited = true;
});


router.get('/admin-dashboard', isAdmin, function (req, res, next) {
    res.sendFile(path.join(__dirname, '../../frontend/admin-dash.html'));

    req.session.visited = true;
});


router.get(['/movie/:id', '/tv/:id'], (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/moviepage.html'));
    req.session.visited = true;
});

module.exports = router;
