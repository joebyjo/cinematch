const express = require('express');
const db = require('../services/db');
const { hashPassword } = require('../services/helpers');
const { isAdmin } = require('../services/validators');
const upload = require('../services/upload');

const router = express.Router();


// only allow authorized users
router.use(isAdmin);

// get list of users with optional filters and pagination
router.get('/users', async (req, res) => {
    try {
        const {
            role,
            username,
            sort,
            page = 1,
            limit = 10
        } = req.query;

        const validSortFields = ['user_name', 'first_name', 'last_name', 'registration_date', 'last_login'];
        const validSortDirections = ['asc', 'desc'];
        const validRoles = ['admin', 'user'];

        // validate pagination inputs
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        if (isNaN(pageNum) || pageNum < 1 || isNaN(limitNum) || limitNum < 1) {
            return res.status(400).json({ msg: 'Invalid page or limit parameter' });
        }

        const offset = (pageNum - 1) * limitNum;

        // build filters and values
        const filters = [];
        const values = [];

        // role filtering
        let roleArray = [];
        if (role) {
            if (Array.isArray(role)) {
                roleArray = role.filter((r) => validRoles.includes(r.toLowerCase()));
            } else if (typeof role === 'string') {
                if (validRoles.includes(role.toLowerCase())) {
                    roleArray = [role.toLowerCase()];
                }
            }

            if (roleArray.length > 0) {
                const placeholders = roleArray.map(() => '?').join(',');
                filters.push(`role IN (${placeholders})`);
                values.push(...roleArray);
            } else {
                return res.status(400).json({ msg: 'Invalid role filter' });
            }
        }

        // username filter
        if (username) {
            filters.push('user_name LIKE ?');
            values.push(`%${username}%`);
        }

        const whereClause = filters.length > 0 ? 'WHERE ' + filters.join(' AND ') : '';

        // sorting
        let orderClause = 'ORDER BY registration_date DESC';
        if (sort) {
            const [field, direction] = sort.split('.');
            if (!validSortFields.includes(field) || !validSortDirections.includes(direction.toLowerCase())) {
                return res.status(400).json({ msg: 'Invalid sort parameter' });
            }
            orderClause = `ORDER BY ${field} ${direction.toUpperCase()}`;
        }

        // count query
        const countQuery = `SELECT COUNT(*) AS total FROM USERLIST ${whereClause}`;
        const [countRows] = await db.query(countQuery, values);
        const totalUsers = countRows[0].total;
        const totalPages = Math.ceil(totalUsers / limitNum);

        // user data query
        const dataQuery = `
            SELECT user_id, user_name, role, first_name, last_name, registration_date, last_login, profile_picture_url
            FROM USERLIST
            ${whereClause}
            ${orderClause}
            LIMIT ? OFFSET ?
        `;
        const dataValues = [...values, limitNum, offset];
        const [users] = await db.query(dataQuery, dataValues);

        res.status(200).json({
            total_users: totalUsers,
            total_pages: totalPages,
            page: pageNum,
            limit: limitNum,
            users
        });

    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// get combined stats
router.get('/stats', async (req, res) => {
    try {
        const [total_movies, total_active, total_users, total_visits] = await Promise.all([
            getMovieCount(),
            getActiveUsersCount(),
            getUserCount(),
            getTotalVisits()
        ]);
        res.json({ total_movies, total_active, total_users, total_visits });
    } catch (err) {
        console.error('Error in /stats route:', err);
        res.status(500).json({ msg: 'Error fetching statistics' });
    }
});

// total user count
router.get('/stats/users-count', async (req, res) => {
    try {
        const [[{ count }]] = await db.query('SELECT COUNT(*) AS count FROM USERS');
        res.json({ total_users: count });
    } catch (err) {
        res.status(500).json({ msg: 'Error fetching user count' });
    }
});

// total movie count
router.get('/stats/movies-count', async (req, res) => {
    try {
        const [[{ count }]] = await db.query('SELECT COUNT(*) AS count FROM MOVIES');
        res.json({ total_movies: count });
    } catch (err) {
        res.status(500).json({ msg: 'Error fetching movie count' });
    }
});

// active users in past 24 hrs
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

// get current sessions
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

// add a new user
router.post('/users', async (req, res) => {
    const {
        username: user_name, password, firstName: first_name, lastName: last_name, role
    } = req.body;
    try {
        const [existing] = await db.query('SELECT id FROM USERS WHERE user_name = ?', [user_name]);
        if (existing.length > 0) {
            return res.status(409).json({ msg: 'Username already exists' });
        }

        // hash password before storing
        const hashed = hashPassword(password);

        const [result] = await db.query(
            'INSERT INTO USERS (user_name, password, first_name, last_name, role) VALUES (?, ?, ?, ?, ?)',
            [user_name, hashed, first_name, last_name, role]
        );

        res.status(201).json({ msg: 'User created successfully', user_id: result.insertId });
    } catch (err) {
        res.status(500).json({ msg: `Failed to create user: ${err}` });
    }
});

// delete user by id
router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM USERS WHERE id = ?', [id]);
        res.status(200).json({ msg: 'User deleted' });
    } catch (err) {
        res.status(500).json({ msg: `Error deleting user: ${err}` });
    }
});

// delete multiple users
router.post('/users/delete-multiple', async (req, res) => {
    const { user_ids } = req.body;

    if (!Array.isArray(user_ids) || user_ids.length === 0) {
        return res.status(400).json({ msg: 'Invalid or empty user_ids array.' });
    }

    try {
        await db.query('DELETE FROM USERS WHERE id IN (?)', [user_ids]);
        res.json({ msg: 'Users deleted successfully', deleted_ids: user_ids });
    } catch (err) {
        res.status(500).json({ msg: `Error deleting users: ${err}` });
    }
});

// update user info
router.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const {
        firstName: first_name, lastName: last_name, userName: user_name, role, profile_picture_url
    } = req.body;

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
        if (user_name) {
            updates.push('user_name = ?');
            values.push(user_name);
        }
        if (role) {
            updates.push('role = ?');
            values.push(role);
        }
        if (profile_picture_url) {
            updates.push('profile_picture_url = ?');
            values.push(profile_picture_url);
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

// update profile picture
router.post('/users/:id/profile-picture', upload.single('profile_picture'), async (req, res) => {
    const userId = req.params.id;

    if (!req.file) {
        return res.status(400).json({ msg: 'No file uploaded or invalid file type' });
    }

    const profilePictureUrl = `/uploads/${req.file.filename}`;

    try {
        // check if the user exists first
        const [user] = await db.query(`SELECT * FROM USERS WHERE id = ?`, [userId]);
        if (!user.length) {
            return res.status(404).json({ msg: 'User not found' });
        }

        await db.query(
            `UPDATE USERS SET profile_picture_url = ? WHERE id = ?`,
            [profilePictureUrl, userId]
        );

        return res.status(200).json({
            msg: 'Profile picture updated by admin',
            profile_picture_url: profilePictureUrl
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Failed to update profile picture' });
    }
});

// helper to get user count
async function getUserCount() {
    try {
        const [[{ count }]] = await db.query('SELECT COUNT(*) AS count FROM USERS');
        return count;
    } catch (err) {
        console.error('Error in getUserCount:', err);
        throw new Error('Failed to fetch user count');
    }
}

// helper to get movie count
async function getMovieCount() {
    try {
        const [[{ count }]] = await db.query('SELECT COUNT(*) AS count FROM MOVIES');
        return count;
    } catch (err) {
        console.error('Error in getMovieCount:', err);
        throw new Error('Failed to fetch movie count');
    }
}

// helper to get recent active users
async function getActiveUsersCount() {
    try {
        const [[{ count }]] = await db.query(`
            SELECT COUNT(DISTINCT user_id) AS count
            FROM SESSIONS
            WHERE last_seen >= NOW() - INTERVAL 1 DAY
            AND user_id IS NOT NULL
        `);
        return count;
    } catch (err) {
        console.error('Error in getActiveUsersCount:', err);
        throw new Error('Failed to fetch active users count');
    }
}

// helper to get total session count
async function getTotalVisits() {
    try {
        const [[{ count }]] = await db.query(`SELECT COUNT(*) AS count FROM SESSIONS`);
        return count;
    } catch (err) {
        console.error('Error in getTotalVisits:', err);
        throw new Error('Failed to fetch total visits');
    }
}

module.exports = router;
