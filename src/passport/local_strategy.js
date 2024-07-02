import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import UserDao from '../dao/mongodb/users.dao.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

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

        const role = (email === process.env.EMAIL_ADMIN && password === process.env.PASS_ADMIN) ? 'admin' : 'user';
        const newUser = await userDao.register({ ...req.body, role });

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

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

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '5m' });

        return done(null, user, { token });
    } catch (error) {
        console.log(error);
        return done(error);
    }
};

passport.use('register', new LocalStrategy(strategyConfig, signUp));
passport.use('login', new LocalStrategy(strategyConfig, login));

export default passport;
