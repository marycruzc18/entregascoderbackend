import express from 'express';
import passport from 'passport';
import UserDao from '../dao/mongodb/users.dao.js';

 
const router = express.Router();
const userDao = new UserDao();

//Ruta para el registro 

router.post('/register', (req, res, next) => {
    passport.authenticate('register', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ msg: info.message || '¡El usuario ya existe!' });
        }

        return res.redirect('/login');
    })(req, res, next);
});

// Ruta para iniciar sesión
router.post('/login',  (req, res) => {
   
    passport.authenticate('login', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ msg: 'Credenciales incorrectas' });
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            req.session.user = {
                id: user._id.toString(),
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role,
                loggedIn: true
            };
            console.log('Usuario logueado:', req.session.user);
            return res.redirect('/products');
        });
    })(req, res);
});


// Ruta para cerrar sesión
router.post('/logout', (req, res) => {
    req.logout(err => {
        if (err) {
            return res.status(500).json({ msg: 'No se pudo cerrar la sesión' });
        }
        res.redirect('/login');
    });
});


// Ruta para iniciar sesión con GitHub
router.get('/register-github', passport.authenticate('github', { scope: ['user:email'] }));

// Callback URL después de autenticarse con GitHub
router.get('/profile', 
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        // Autenticación exitosa, redirigir a /products
        res.redirect('/products');
    }
);

export default router;