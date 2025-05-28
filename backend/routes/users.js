var express = require('express');
var router = express.Router();
const { isAuthenticated } = require('../services/validators');
const db = require('../services/db');
const { comparePassword } = require('../services/helpers');


router.use(isAuthenticated);


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
})


// route to update user settings
router.put('/me', async (req, res) => {
    const { id } = req.user;
    const { first_name, last_name, password } = req.body;

    // checking if password matches
    const [queryResult] = await db.query('SELECT password FROM USERS WHERE id = ?', [req.user.id]);
    const findUser = queryResult[0];

    const isMatch = comparePassword(password, findUser.password);

    if (!isMatch) return res.status(401).json({ msg: "Password incorrect"})

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

    // checking if password matches
    const [queryResult] = await db.query('SELECT password FROM USERS WHERE id = ?', [req.user.id]);
    const findUser = queryResult[0];

    const isMatch = comparePassword(password, findUser.password);

    if (!isMatch) return res.status(401).json({ msg: "Password incorrect"})

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

module.exports = router;
