const { query, param, body, validationResult } = require('express-validator');

// middleware to check validation results
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    return next();
};

// admin authorization middleware
const isAdmin = (req, res, next) => {
    const { user } = req.session;

    if (!user || user.role !== 'admin') {
        return res.status(404);
    }

    return next();
};

// check if authenticated
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }
    // Optionally: customize this based on frontend/backend structure
    return res.status(401).json({ message: 'You must be logged in to access this resource.' });
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
        .isLength({ min: 3, max: 10 })
        .withMessage('Username must be 3–10 characters long')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username must only contain letters, numbers, and underscores'),

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
        .withMessage('Password must contain a special character')
        .matches(/^[^\s'"`;\\]+$/)
        .withMessage('Password contains invalid or dangerous characters'),

    body('firstName')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('First name is required')
        .isAlpha()
        .withMessage('First name must contain only letters')
        .isLength({ max: 20 })
        .withMessage('First name must be at most 20 characters long'),

    body('lastName')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Last name is required')
        .isAlpha()
        .withMessage('Last name must contain only letters')
        .isLength({ max: 20 })
        .withMessage('Last name must be at most 20 characters long')
];


// login validation
const validateLogin = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required')
        .isLength({ min: 3, max: 10 })
        .withMessage('Username must be between 3 and 10 characters')
        .isAlphanumeric()
        .withMessage('Username should only contain letters and numbers'),

    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Password must be at least 3 characters long')
        .matches(/^[^\s'"`;\\]+$/)
        .withMessage('Password contains invalid characters')
];


module.exports = {
    validate,
    isAdmin,
    isAuthenticated,
    validateSearchQuery,
    validateId,
    validateSignup,
    validateLogin
};
