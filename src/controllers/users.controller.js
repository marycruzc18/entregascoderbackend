import passport from 'passport';
import jwt from 'jsonwebtoken';
import { registerUser, loginUser, logoutUser, getUserById } from '../services/users.service.js';
import config from '../config.js';
import logger from '../logs/logger.js';

export const register = async (req, res, next) => {
    
    try {
       logger.info('Intentando registrar un nuevo ususario');

        const user = await registerUser(req.body);

       logger.info(`Usuario registrado exitosamente: ${user.email}`);
    
        res.redirect('/login');
    } catch (error) {
       
        if (error.message === 'El usuario ya existe') {
            logger.warn(`Intento de registro fallido: ${error.message}`);
            return res.status(400).send('El usuario ya existe');
        }

       
        logger.error(`Error al registrar usuario: ${error.message}`);
        next(error);
    }
};
export const login = (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {
        if (err) {
            console.error('Error en la autenticación:', err);
            return next(err);
        }
        if (!user) {
            console.log('Usuario no encontrado:', info.message);
            return res.status(401).json({ msg: 'Credenciales incorrectas' });
        }

        try {
            const token = jwt.sign(
                { id: user._id, first_name: user.first_name, last_name: user.last_name, role: user.role },
                config.JWT_SECRET,
                { expiresIn: '5m' }
            );
            res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
            console.log('Usuario logueado:', user);
            res.redirect('/products');
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            next(error);
        }
    })(req, res, next);
};

export const logout = async (req, res, next) => {
    try {
        await logoutUser(req);
        res.clearCookie('jwt');
        res.redirect('/login');
    } catch (error) {
        next(error);
    }
};

export const getUser = async (req, res, next) => {
    try {
        const user = await getUserById(req.params.userId);
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (error) {
        next(error);
    }
};

// Autenticación con GitHub
export const githubAuth = passport.authenticate('github', { scope: ['user:email'] });

// Callback después de autenticarse con GitHub
export const githubCallback = (req, res, next) => {
    passport.authenticate('github', { failureRedirect: '/login' }, async (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.redirect('/login');

        try {
            req.logIn(user, async (err) => {
                if (err) return next(err);

                const { token } = await loginUser(user);
                res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
                res.redirect('/products');
            });
        } catch (error) {
            next(error);
        }
    })(req, res, next);
};