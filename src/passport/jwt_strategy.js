import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import UserDao from '../dao/mongodb/users.dao.js';
import config from '../config.js';

const userDao = new UserDao();

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.JWT_SECRET,
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        const user = await userDao.getById(jwt_payload.id);
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (error) {
        return done(error, false);
    }
}));

export default passport;
