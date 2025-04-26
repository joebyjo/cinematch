var express = require('express');
const passport = require('passport');
const { validateSignup, validateLogin, validate } = require('../services/validators');
const localStrategy = require('../services/local-strategy');
const { hashPassword } = require('../services/helpers');
const db = require('../services/db');

var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });



router.post('/signup', validateSignup, validate, async (req, res) => {

    const { username, password, firstName, lastName } = req.body;

    try {
        // check if username already exists
        const [existingUser] = await db.query('SELECT id FROM USERS WHERE user_name = ?',[username]);

        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Username already taken' });
        }

        // hashing password
        const hashedPassword = await hashPassword(password);

        // inserting into db
        await db.query(
            'INSERT INTO USERS (user_name, password, first_name, last_name, registration_date) VALUES (?, ?, ?, ?, CURDATE())',
            [username, hashedPassword, firstName, lastName]
        );

        res.status(201).json({ message: 'User created' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});



router.post('/login', validateLogin, validate, passport.authenticate("local"), async (req, res) => {

    // updating last login time to database
    await db.query('UPDATE USERS SET last_login=NOW() WHERE id=?',[req.user.id])

    res.status(200).json({ msg: 'Login successful' });
});

router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        // clearing cookies to logout user
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
