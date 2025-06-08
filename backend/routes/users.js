var express = require('express');
var router = express.Router();
const path = require('path');
const upload = require('../services/upload');
const { isAuthenticated } = require('../services/validators');
const db = require('../services/db');
const { comparePassword, getUserGenresLanguages } = require('../services/helpers');


router.use(isAuthenticated);

// get selected languages and genres
router.get('/languages-genres', async (req, res) => {
    try {
        const result = await getUserGenresLanguages(req.user.id);
        return res.status(200).json(result);
    } catch (e) {
        console.error(err);
        return res.status(500).json({ msg: 'Database error' });
    }
});


// get my details
router.get('/me', async (req, res) => {

    try {

        // getting details of user
        const [[user]] = await db.query(
            `SELECT user_name, first_name, last_name, profile_picture_url, theme
       FROM USERS u
       JOIN USERSETTINGS us ON us.user_id=u.id
       WHERE id = ?`,
            [req.user.id]
        );

        // if user not found
        if (!user) return res.status(404).json({ msg: 'User not found' });

        return res.status(200).json(user);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Database error' });
    }
});


// route to update user settings
router.put('/me', async (req, res) => {
    const { id } = req.user;
    const { first_name, last_name, password } = req.body;

    // get current password
    const [queryResult] = await db.query('SELECT password FROM USERS WHERE id = ?', [req.user.id]);
    const findUser = queryResult[0];

    // verify current password
    const isMatch = comparePassword(password, findUser.password);

    if (!isMatch) return res.status(401).json({ msg: "Password incorrect" });

    try {
        const updates = [];
        const values = [];

        if (first_name) {
            updates.push('first_name = ?');
            values.push(first_name);
        }
        if (last_name) {
            updates.push('last_name = ?');
            values.push(last_name);
        }

        if (updates.length === 0) {
            return res.status(400).json({ msg: 'No fields to update' });
        }

        values.push(id);
        await db.query(`UPDATE USERS SET ${updates.join(', ')} WHERE id = ?`, values);

        res.json({ msg: 'User updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: `Failed to update user: ${err}` });
    }
});



// route to delete users
router.delete('/me', async (req, res) => {
    try {

        const { password } = req.body;

        if (!password) return res.status(401).json({ msg: 'Password is required' });

        // checking if password matches
        const [queryResult] = await db.query('SELECT password FROM USERS WHERE id = ?', [req.user.id]);
        const findUser = queryResult[0];

        const isMatch = comparePassword(password, findUser.password);

        if (!isMatch) return res.status(401).json({ msg: "Password incorrect" });

        // deleting user
        await db.query(`DELETE FROM USERS WHERE id = ?`, [req.user.id]);

        req.session.destroy(() => {
            // clearing cookies to logout user
            res.clearCookie('sessionId');
            return res.status(200).json({ msg: 'User deleted and logged out' });
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Database error' });
    }
});


// route to update theme
router.post('/me/theme', async (req, res) => {
    const { theme } = req.body;
    console.log(req.body);

    // validate input
    if (!theme) {
        return res.status(400).json({ msg: 'Theme is required' });
    }

    try {
        const [result] = await db.query(
            `UPDATE USERSETTINGS SET theme = ? WHERE user_id = ?`,
            [theme, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Settings not found for this user' });
        }

        return res.status(200).json({ msg: 'Theme updated successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Failed to update theme' });
    }
});


// TODO need to be tested
router.post('/me/profile-picture', upload.single('profile_picture'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ msg: 'No file uploaded or invalid file type' });
    }

    const profilePictureUrl = `/uploads/${req.file.filename}`;

    try {
        await db.query(`UPDATE USERS SET profile_picture_url = ? WHERE id = ?`, [profilePictureUrl, req.user.id]);

        return res.status(200).json({ msg: 'Profile picture updated', profile_picture_url: profilePictureUrl });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Failed to update profile picture' });
    }
});

router.post('/me/profile-avatar', async (req, res) => {
    const { id } = req.body;
    const profilePictureUrl = `/uploads/avatar${id}.svg`;

    try {
        await db.query(`UPDATE USERS SET profile_picture_url = ? WHERE id = ?`, [profilePictureUrl, req.user.id]);

        return res.status(200).json({ msg: 'Profile picture updated', profile_picture_url: profilePictureUrl });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Failed to update profile picture' });
    }
});


module.exports = router;
