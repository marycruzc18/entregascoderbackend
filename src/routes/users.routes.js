import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const router = express.Router();

// Ruta para el registro
router.post('/register', (req, res, next) => {
    passport.authenticate('register', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ msg: info.message || '¡El usuario ya existe!' });
        }

        res.redirect('/login');
    })(req, res, next);
});

// Ruta para iniciar sesión
router.post('/login', (req, res, next) => {
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

            // Establecer el  token en una cookie
            res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

            console.log('Usuario logueado:', user);
            return res.redirect('/products');
        });
    })(req, res, next);
});

// Ruta para cerrar sesión
router.post('/logout', (req, res) => {
    req.logout(err => {
        if (err) {
            return res.status(500).json({ msg: 'No se pudo cerrar la sesión' });
        }
        res.clearCookie('jwt');
        res.redirect('/login');
    });
});

// Ruta para iniciar sesión con GitHub
router.get('/register-github', passport.authenticate('github', { scope: ['user:email'] }));

// Callback URL después de autenticarse con GitHub
router.get('/profile', 
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        // Autenticación exitosa, redirigir a products
        res.redirect('/products');
    }
);

export default router;

