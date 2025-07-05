var express = require('express');
const passport = require('passport');
const {
    validateSignup,
    validateLogin,
    validateChangePassword,
    isAuthenticated,
    validate
} = require('../services/validators');
const localStrategy = require('../services/local-strategy');
const { hashPassword, comparePassword } = require('../services/helpers');
const db = require('../services/db');

var router = express.Router();

// signup route
router.post('/signup', validateSignup, validate, async (req, res) => {
    const { username, password, firstName, lastName } = req.body;

    try {
        // check if username exists
        const [existingUser] = await db.query('SELECT id FROM USERS WHERE user_name = ?', [username]);
        if (existingUser.length > 0) {
            return res.status(400).json({ msg: 'Username already taken' });
        }

        // hash password before storing
        const hashedPassword = hashPassword(password);

        // insert user into USERS table
        const [result] = await db.query(
            'INSERT INTO USERS (user_name, password, first_name, last_name, registration_date) VALUES (?, ?, ?, ?, CURDATE())',
            [username, hashedPassword, firstName, lastName]
        );

        const userId = result.insertId;

        // insert default settings for new user
        await db.query('INSERT INTO USERSETTINGS (user_id) VALUES (?)', [userId]);

        return res.status(201).json({ msg: 'User created' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal server error' });
    }
});

// login route
router.post('/login', validateLogin, validate, (req, res, next) => {
    passport.authenticate('local', async (err, user, info) => {
        if (err) return res.status(500).json({ msg: 'Internal server error' });
        if (!user) return res.status(401).json({ msg: info?.message || 'Invalid credentials' });

        req.logIn(user, async (err) => {
            if (err) return res.status(500).json({ msg: 'Login failed' });

            try {
                // update last login timestamp
                await db.query('UPDATE USERS SET last_login = NOW() WHERE id = ?', [user.id]);

                // update session with user id and ip
                await db.query(
                    `UPDATE SESSIONS SET user_id = ?, ip_address = ? WHERE id = ?`,
                    [user.id, req.ip, req.sessionID]
                );

                return res.status(200).json({ msg: 'Login successful' });
            } catch (dbErr) {
                console.error(dbErr);
                return res.status(500).json({ msg: 'Login session failed' });
            }
        });
    })(req, res, next);
});

// change password route
router.post('/change-password', isAuthenticated, validateChangePassword, validate, async (req, res) => {
    const { current_password, new_password } = req.body;

    try {
        // fetch hashed password from db
        const [queryResult] = await db.query('SELECT password FROM USERS WHERE id = ?', [req.user.id]);
        const user = queryResult[0];

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // verify current password
        const isMatch = comparePassword(current_password, user.password);
        if (!isMatch) {
            return res.status(401).json({ msg: 'Current password is incorrect' });
        }

        // hash and update new password
        const hashedNewPassword = hashPassword(new_password);
        await db.query('UPDATE USERS SET password = ? WHERE id = ?', [hashedNewPassword, req.user.id]);

        return res.status(200).json({ msg: 'Password updated successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Failed to update password' });
    }
});

// logout route
router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        // clear session cookie
        res.clearCookie('sessionId');
        return res.json({ msg: 'Logged out' });
    });
});

// check auth status
router.get('/status', (req, res) => {
    if (req.user) {
        res.status(200).send({ msg: 'Authenticated' });
    } else {
        res.status(401).send({ msg: 'Not Authenticated' });
    }
});

module.exports = router;