const { query, param, body, validationResult } = require('express-validator');

// middleware to check validation results
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ msg: errors.array()[0].msg });
    }
    return next();
};

// admin authorization middleware
const isAdmin = (req, res, next) => {
    const { user } = req;

    if (!user || user.role !== 'admin') {
        return res.sendStatus(404);
    }

    return next();
};

// check if authenticated
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }

    return res.status(401).json({ msg: 'You must be logged in to access this resource.' });
}


// query validator
const validateSearchQuery = (field = 'q') => [
    query(field)
        .trim()
        .notEmpty()
        .withMessage('Query parameter "q" is required')

        .isLength({ min: 2 })
        .withMessage('Query must be at least 2 characters')

        .matches(/^[a-zA-Z0-9\s\-_'".!?&]+$/)
        .withMessage('Search query contains invalid characters')
];

// ID validator
const validateId = (paramName = 'id') => [
    param(paramName)
        .trim()
        .notEmpty()
        .withMessage('Movie ID is required')

        .isInt({ min: 1 })
        .withMessage('Movie ID must be a positive integer')
];


// signup validation
const validateSignup = [
    body('username')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Username is required')
        .isLength({ min: 3 })
        .withMessage('Username must be minimum 3 letters long'),

    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/[a-z]/)
        .withMessage('Password must contain a lowercase letter')
        .matches(/[A-Z]/)
        .withMessage('Password must contain an uppercase letter')
        .matches(/[0-9]/)
        .withMessage('Password must contain a digit')
        .matches(/[\W_]/)
        .withMessage('Password must contain a special character'),

    body('firstName')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('First name is required')
        .isAlpha()
        .withMessage('First name must contain only letters'),

    body('lastName')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Last name is required')
        .isAlpha()
        .withMessage('Last name must contain only letters')
];


// change password validation
const validateChangePassword = [
    body('current_password')
        .trim()
        .notEmpty()
        .withMessage('Current password is required'),

    body('new_password')
        .trim()
        .notEmpty()
        .withMessage('New password is required')
        .isLength({ min: 8 })
        .withMessage('New password must be at least 8 characters long')
        .matches(/[a-z]/)
        .withMessage('New password must contain a lowercase letter')
        .matches(/[A-Z]/)
        .withMessage('New password must contain an uppercase letter')
        .matches(/[0-9]/)
        .withMessage('New password must contain a digit')
        .matches(/[\W_]/)
        .withMessage('New password must contain a special character')
];


// login validation
const validateLogin = [
    body('username')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Username is required')
        .isLength({ min: 3 })
        .withMessage('Username must be minimum 2 letters long'),

    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 3 })
        .withMessage('Password must be at least 3 characters long')
];


module.exports = {
    validate,
    isAdmin,
    isAuthenticated,
    validateSearchQuery,
    validateId,
    validateSignup,
    validateLogin,
    validateChangePassword
};
