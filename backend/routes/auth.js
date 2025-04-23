var express = require('express');
const bcrypt = require('bcrypt');
const { validateSignup, validateLogin, validate } = require('../services/validators');
const localStrategy = require('../services/local-strategy');
const passport = require('passport');

var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });



router.post('/signup', validateSignup, validate, (req, res) => {

    // const { username, password } = req.body;
    // const userExists = users.find(user => user.username === username);
    // if (userExists) return res.status(400).json({ error: 'User already exists' });

    // const hashedPassword = bcrypt.hashSync(password, 10);
    // users.push({ username, password: hashedPassword });

    // return res.status(201).json({ message: 'User created' });
});



router.post('/login', validateLogin, validate, passport.authenticate("local"), (req, res) => {

    // const { username, password } = req.body;
    // const user = users.find(user => user.username === username);
    // if (!user || !bcrypt.compareSync(password, user.password)) {
    //     return res.status(401).json({ error: 'Invalid credentials' });
    // }

    // req.session.user = { username };
    // res.json({ message: 'Login successful' });

    res.status(200).json({ msg: 'Login successful' });
});

router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('sessionId');
        res.json({ msg: 'Logged out' });
    });
});


router.get('/status', (req, res) => {

    if (req.user) {
        res.status(200).send({ msg: "Authenticated" });
    } else {
        res.status(401).send({ msg: "Not Authenticated" });
    }

});

module.exports = router;
