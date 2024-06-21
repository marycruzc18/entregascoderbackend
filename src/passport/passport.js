import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import UserDao from '../dao/mongodb/users.dao.js';

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

        
        const role = (email === 'adminCoder@coder.com' && password === 'adminCod3r123') ? 'admin' : 'user';

    
        const newUser = await userDao.register({ ...req.body, role });
        return done(null, newUser);
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
        return done(null, user);
    } catch (error) {
        console.log(error);
        return done(error);
    }
};

passport.use('register', new LocalStrategy(strategyConfig, signUp));
passport.use('login', new LocalStrategy(strategyConfig, login));

passport.serializeUser((user, done) => {
    if (user && user._id) {
        done(null, user._id);
    } else {
        done(new Error('Usuario no encontrado en serializeUser'), null);
    }
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await userDao.getById(id);
        if (user) {
            done(null, user);
        } else {
            done(new Error('Usuario no encontrado en deserializeUser'), null);
        }
    } catch (error) {
        done(error);
    }
});


export default passport;
