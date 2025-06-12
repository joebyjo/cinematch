const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('./db');
const { comparePassword } = require('./helpers');


passport.serializeUser((user, done) => {
    done(null, user.id);
});


passport.deserializeUser(async (id, done) => {

    try {
        const [queryResult] = await db.query('SELECT * FROM USERS WHERE id = ?', [id]);
        const findUser = queryResult[0];

        if (!findUser) throw new Error('User not found');

        done(null,findUser);

    } catch (err) {
        done(err,null);
    }


});


passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {

            const [queryResult] = await db.query('SELECT id,user_name,password FROM USERS WHERE user_name = ?', [username]);
            const findUser = queryResult[0];

            if (!findUser) return done(null, false, { msg: 'Invalid credentials' });

            const isMatch = comparePassword(password, findUser.password);
            if (!isMatch) return done(null, false, { msg: 'Invalid credentials' });

            return done(null, findUser);

        } catch (err) {
            return done(err,null);
        }
    })
);
