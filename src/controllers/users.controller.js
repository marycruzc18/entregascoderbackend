import passport from 'passport';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const register = (req, res, next) => {
    passport.authenticate('register', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ msg: info.message || '¡El usuario ya existe!' });
        }

        res.redirect('/login');
    })(req, res, next);
};

export const login = (req, res, next) => {
    passport.authenticate('login', (err, user, info) => {
        if (err) {
            console.error('Error en la autenticación:', err);
            return next(err);
        }
        if (!user) {
            console.log('Usuario no encontrado:', info.message);
            return res.status(401).json({ msg: 'Credenciales incorrectas' });
        }

        req.logIn(user, (err) => {
            if (err) {
                console.error('Error al iniciar sesión:', err);
                return next(err);
            }
            // Generar token JWT
            const token = jwt.sign({ id: user._id, first_name: user.first_name, last_name: user.last_name, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

            // Establecer el token en una cookie
            res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

            console.log('Usuario logueado:', user);
            return res.redirect('/products');
        });
    })(req, res, next);
};

export const logout = (req, res) => {
    req.logout(err => {
        if (err) {
            return res.status(500).json({ msg: 'No se pudo cerrar la sesión' });
        }
        res.clearCookie('jwt');
        res.redirect('/login');
    });
};

export const githubAuth = passport.authenticate('github', { scope: ['user:email'] });

export const githubCallback = (req, res, next) => {
    passport.authenticate('github', { failureRedirect: '/login' }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/login');
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            const token = jwt.sign({ id: user._id, first_name: user.first_name, last_name: user.last_name, role: user.role }, process.env.JWT_SECRET, { expiresIn: '5m' });
            res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
            res.redirect('/products');
        });
    })(req, res, next);
};