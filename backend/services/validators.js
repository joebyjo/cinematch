const { query, param, validationResult } = require('express-validator');

// Middleware to check validation results
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
    return;
};

const validateSearchQuery = [
    query('q')
        .trim()
        .notEmpty()
        .withMessage('Query parameter "q" is required')

        .isLength({ min: 2 })
        .withMessage('Query must be at least 2 characters')

        .matches(/^[a-zA-Z0-9\s\-_'".!?&]+$/)
        .withMessage('Search query contains invalid characters')
];

const validateMovieId = [
    param('id')
        .trim()
        .notEmpty()
        .withMessage('Movie ID is required')

        .isInt({ min: 1 })
        .withMessage('Movie ID must be a positive integer')
];

module.exports = {
    validate,
    validateSearchQuery,
    validateMovieId
};
