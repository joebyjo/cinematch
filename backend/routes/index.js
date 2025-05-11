var express = require('express');
const path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.redirect('/home');
});

router.get('/home', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../../frontend/homepage.html'));
});


module.exports = router;
