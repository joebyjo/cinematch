const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const passport = require('passport');
const { COOKIE_SECRET } = process.env;

const db = require('./services/db');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const tvRouter = require('./routes/tv');
const authRouter = require('./routes/auth');
const mylistRouter = require('./routes/mylist');
const adminRouter = require('./routes/admin');
const personaliseRouter = require('./routes/personalise');

const app = express();

// session store using existing db config
const sessionStore = new MySQLStore(
    {
        createDatabaseTable: false,
        schema: {
            tableName: 'SESSIONS',
            columnNames: {
                session_id: 'id',
                expires: 'expires',
                data: 'data'
            }
        }
    },
    db
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ // for sessions
    name: 'sessionId',
    secret: COOKIE_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // stay logged in for 24 hours
    }
}));
app.use(passport.initialize()); // for user authentication
app.use(passport.session());
app.use(express.static(path.join(__dirname, '../frontend'), { index: false })); // use /frontend directory as default directory for static files.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// update sessions
app.use(async (req, res, next) => {

    // checking if it is a page and not static assets
    const isPage = req.method === 'GET' && !req.originalUrl.match(/\.(js|css|png|jpg|jpeg|svg|gif|ico)$/i);

    // update last_seen if user is authenticate and is requesting a non static asset
    if (req.isAuthenticated() && req.sessionID && isPage) {
        try {
            await db.query(
                `UPDATE SESSIONS SET last_seen = NOW() WHERE id = ?`,
                [req.sessionID]
            );

        } catch (err) {
            console.error('Error updating session metadata:', err);
        }
    }

    next();
});

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/movies', moviesRouter);
app.use('/api/tv', tvRouter);
app.use('/api/auth', authRouter);
app.use('/api/mylist', mylistRouter);
app.use('/api/admin', adminRouter);
// console.log("before");
app.use('/api/personalise', personaliseRouter);
// console.log("after");
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
