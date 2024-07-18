import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import UserDao from '../dao/mongodb/users.dao.js';
import jwt from 'jsonwebtoken';
import config from '../config.js';

const userDao = new UserDao();

const strategyConfig = {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
};

const signUp = async (req, email, password, done) => {
    try {
        const existingUser = await userDao.getByEmail(email);
        if (existingUser) {
            return done(null, false, { message: '¡El usuario ya existe!' });
        }

        const role = (email === config.EMAIL_ADMIN && password === config.PASS_ADMIN) ? 'admin' : 'user';
        const newUser = await userDao.register({ ...req.body, role });

        const token = jwt.sign({ id: newUser._id }, config.JWT_SECRET, { expiresIn: '5m' });

        return done(null, newUser, { token });
    } catch (error) {
        console.error('Error en signUp:', error);
        return done(error);
    }
};

const login = async (req, email, password, done) => {
    try {
        const user = await userDao.login(email, password);
        if (!user) {
            return done(null, false, { message: 'Credenciales incorrectas' });
        }

        const token = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: '5m' });

        return done(null, user, { token });
    } catch (error) {
        console.log(error);
        return done(error);
    }
};

passport.use('register', new LocalStrategy(strategyConfig, signUp));
passport.use('login', new LocalStrategy(strategyConfig, login));

export default passport;
