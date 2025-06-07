const express = require('express');
const db = require('../services/db');
const { hashPassword } = require('../services/helpers');
const { isAdmin } = require('../services/validators');

const router = express.Router();


// only allow authorized users
router.use(isAdmin);

// get users
router.get('/users', async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, user_name, role, first_name, last_name, registration_date, last_login FROM USERS');
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: `Internal server error: ${err}` });
    }
});

// get number of users
router.get('/stats/users-count', async (req, res) => {
    try {
        const [[{ count }]] = await db.query('SELECT COUNT(*) AS count FROM USERS');
        res.json({ total_users: count });
    } catch (err) {
        res.status(500).json({ msg: 'Error fetching user count' });
    }
});

// get number of movies stored
router.get('/stats/movies-count', async (req, res) => {
    try {
        const [[{ count }]] = await db.query('SELECT COUNT(*) AS count FROM MOVIES');
        res.json({ total_movies: count });
    } catch (err) {
        res.status(500).json({ msg: 'Error fetching movie count' });
    }
});

// get number of active users within last 24hrs
router.get('/stats/active', async (req, res) => {
    try {
        const [[{ count }]] = await db.query(`
            SELECT COUNT(DISTINCT user_id) AS count
            FROM SESSIONS
            WHERE last_seen >= NOW() - INTERVAL 1 DAY
            AND user_id IS NOT NULL
        `);
        res.json({ active: count });
    } catch (err) {
        res.status(500).json({ msg: 'Error fetching active users' });
    }
});

// get active sessions
router.get('/active', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT S.id AS session_id, S.user_id, U.user_name, S.last_seen
            FROM SESSIONS S
            LEFT JOIN USERS U ON S.user_id = U.id
            WHERE S.user_id IS NOT NULL
            ORDER BY S.last_seen DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ msg: 'Failed to fetch session data' });
    }
});

// add new users into db
router.post('/users', async (req, res) => {
    const { username, password, firstName, lastName, role } = req.body;
    try {
        const [existing] = await db.query('SELECT id FROM USERS WHERE user_name = ?', [username]);
        if (existing.length > 0) {
            return res.status(409).json({ msg: 'Username already exists' });
        }

        const hashed = hashPassword(password);

        await db.query(
            'INSERT INTO USERS (user_name, password, first_name, last_name, role) VALUES (?, ?, ?, ?, ?)',
            [username, hashed, firstName, lastName, role]
        );

        res.status(201).json({ msg: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ msg: `Failed to create user: ${err}` });
    }
});

// delete user by id
router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM USERS WHERE id = ?', [id]);
        res.json({ msg: 'User deleted' });
    } catch (err) {
        res.status(500).json({ msg: `Error deleting user: ${err}` });
    }
});

// edit user details
router.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, password, role } = req.body;

    try {
        const updates = [];
        const values = [];

        if (firstName) {
            updates.push('first_name = ?');
            values.push(firstName);
        }
        if (lastName) {
            updates.push('last_name = ?');
            values.push(lastName);
        }
        if (password) {
            updates.push('password = ?');
            values.push(hashPassword(password));
        }
        if (role) {
            updates.push('role = ?');
            values.push(role);
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



module.exports = router;
