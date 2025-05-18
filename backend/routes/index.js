var express = require('express');
const path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.redirect('/home');
});

router.get('/home', function (req, res, next) {
    // res.sendFile(path.join(__dirname, '../../frontend/home.html'));

    req.session.visited = true;
    res.send('works');

    console.log(req.session.id);
});


module.exports = router;
