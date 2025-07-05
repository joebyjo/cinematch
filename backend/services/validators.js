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
        // sending error to be handled by error handler
        const err = new Error('You do not have permission to access this resource.');
        err.status = 401;
        return next(err);
    }

    return next();
};

// check if authenticated
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }

    // sending error to be handled by error handler
    const err = new Error('You must be logged in to access this resource.');
    err.status = 401;
    return next(err);
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
        .isLength({ min: 3, max: 20 })
        .withMessage('Username must be between 3 and 20 characters long'),

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
        .withMessage('Username must be minimum 3 letters long'),

    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
];



const validateMyListQuery = [
    // page (optional, must be integer ≥ 1)
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),

    // limit (optional, must be integer ≥ 1)
    query('limit')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Limit must be a positive integer'),

    // sort (optional, must be in form field.direction)
    query('sort')
        .optional()
        .custom((value) => {
            const [field, direction] = value.split('.');
            const validFields = ['release_date', 'imdb_rating', 'my_rating'];
            const validDirections = ['asc', 'desc'];
            if (!field || !direction || !validFields.includes(field) || !validDirections.includes(direction.toLowerCase())) {
                throw new Error('Sort must be in the format field.direction using valid fields and directions');
            }
            return true;
        }),

    // genre (optional, can be single or array of integers)
    query('genre')
        .optional()
        .customSanitizer((value) => Array.isArray(value) ? value : [value])
        .custom((arr) => arr.every((g) => !isNaN(parseInt(g))))
        .withMessage('Genre values must be numeric'),

    // certification (optional, can be single or array of strings)
    query('certification')
        .optional()
        .customSanitizer((value) => Array.isArray(value) ? value : [value])
        .custom((arr) => arr.every((c) => typeof c === 'string' && c.length <= 10))
        .withMessage('Certifications must be short strings'),

    // status (optional, must be a valid watch status integer)
    query('status')
        .optional()
        .isInt({ min: 0, max: 3 })
        .withMessage('Status must be a valid watch status (0–3)'),

    // my_rating (optional, must be float between 0–10)
    query('my_rating')
        .optional()
        .isFloat({ min: 0, max: 10 })
        .withMessage('My rating must be a number between 0 and 10')
];


const validateAddMoviePreference = [
    body('movie_id')
        .notEmpty()
        .withMessage('Movie ID is required')
        .isInt({ min: 1 })
        .withMessage('Movie ID must be a positive integer'),

    body('is_liked')
        .notEmpty()
        .withMessage('is_liked is required')
        .isBoolean()
        .withMessage('is_liked must be a boolean'),

    body('watch_status')
        .notEmpty()
        .withMessage('watch_status is required')
        .isInt({ min: 0, max: 3 })
        .withMessage('watch_status must be an integer between 0 and 3')
];

const validateAddRating = [
    body('movie_id')
        .notEmpty()
        .withMessage('Movie ID is required')
        .isInt({ min: 1 })
        .withMessage('Movie ID must be a positive integer'),

    body('rating')
        .notEmpty()
        .withMessage('Rating is required')
        .custom(value => {
            const num = parseFloat(value);
            if (isNaN(num) || num < 0 || num > 5 || num * 2 !== Math.floor(num * 2)) {
                throw new Error('Rating must be 0 to 5');
            }
            return true;
        }),
    body('review')
        .optional({ checkFalsy: true }) // allows empty or null
        .isString()
        .withMessage('Review must be a string')
        .isLength({ max: 1000 })
        .withMessage('Review must be at most 1000 characters long')
];


const validateUpdateUser = [
    body('first_name')
        .optional()
        .trim()
        .escape()
        .isAlpha()
        .withMessage('First name must contain only letters')
        .isLength({ max: 20 })
        .withMessage('First name must be at most 20 characters long'),

    body('last_name')
        .optional()
        .trim()
        .escape()
        .isAlpha()
        .withMessage('Last name must contain only letters')
        .isLength({ max: 20 })
        .withMessage('Last name must be at most 20 characters long'),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

const validateDeleteUser = [
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
];

const validateTheme = [
    body('theme')
        .notEmpty()
        .withMessage('Theme is required')
        .isIn(['light', 'dark'])
        .withMessage('Invalid theme selected')
];

const validateProfileAvatar = [
    body('id')
        .notEmpty()
        .withMessage('Avatar ID is required')
        .isInt({ min: 1, max: 5 })
        .withMessage('Avatar ID must be an integer between 1 and 5')
];


module.exports = {
    validate,
    isAdmin,
    isAuthenticated,
    validateSearchQuery,
    validateId,
    validateSignup,
    validateLogin,
    validateChangePassword,
    validateMyListQuery,
    validateAddMoviePreference,
    validateAddRating,
    validateUpdateUser,
    validateDeleteUser,
    validateTheme,
    validateProfileAvatar
};
