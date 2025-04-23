const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


passport.serializeUser((user, done) => {
    done(null, user.id);
});


passport.deserializeUser((id, done) => {

    try {
        const findUser = { id: 1, username: 'joe', password: '12345', role: 'admin' }; // need to replace with database
        if (!findUser) throw new Error('User not found');

        done(null,findUser);

    } catch (err) {
        done(err,null);
    }


});


passport.use(
    new LocalStrategy((username, password, done) => {
        try {
            const findUser = { id: 1, username: 'joe', password: '12345' }; // need to replace with database
            if (!findUser) throw new Error('User not found');
            if (findUser.password !==password) throw new Error('Incorrect credentials');

            done(null,findUser);

        } catch (err) {
            done(err,null);
        }
    })
);
