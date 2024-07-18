import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import UserDao from '../dao/mongodb/users.dao.js';
import cookieExtractor from '../cookieExtractor.js';
import  config from '../config.js';

const userDao = new UserDao();

const opts = {
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: config.JWT_SECRET
};

passport.use('current', new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        const user = await userDao.getById(jwt_payload.id);
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (err) {
        return done(err, false);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await userDao.getById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

export default passport;
