var express = require('express');
const path = require('path');
const { isAuthenticated } = require('../services/validators');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.redirect('/home');
});

router.get('/home', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../../frontend/homepage.html'));

    req.session.visited = true;
    // res.send('works');

    // console.log(req.session.id);
});

router.get('/personalise', isAuthenticated, function (req, res, next) {
    res.sendFile(path.join(__dirname, '../../frontend/personalise.html'));

    req.session.visited = true;
    // res.send('works');

    // console.log(req.session.id);
});

router.get('/login', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../../frontend/login.html'));

    req.session.visited = true;
    // res.send('works');

    // console.log(req.session.id);
});

router.get('/signup', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../../frontend/signup.html'));

    req.session.visited = true;
    // res.send('works');

    // console.log(req.session.id);
});

router.get('/mylists', isAuthenticated,  function (req, res, next) {
    res.sendFile(path.join(__dirname, '../../frontend/mylists.html'));

    req.session.visited = true;
    // res.send('works');

    // console.log(req.session.id);
});

router.get('/aboutus', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../../frontend/about-us.html'));

    req.session.visited = true;
    // res.send('works');

    // console.log(req.session.id);
});

router.get('/settings', isAuthenticated, function (req, res, next) {
    res.sendFile(path.join(__dirname, '../../frontend/settings.html'));

    req.session.visited = true;
    // res.send('works');

    // console.log(req.session.id);
});

router.get(['/movie/:id', '/tv/:id'], (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/moviepage.html'));
    req.session.visited = true;
});

module.exports = router;
