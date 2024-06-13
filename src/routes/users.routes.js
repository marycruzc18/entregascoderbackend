import express from 'express';
import UserDao from '../dao/mongodb/users.dao.js';

const userDao = new UserDao();
const router = express.Router();

router.post('/register', async (req, res) =>{
    try {
        const { email, password } = req.body;
        const role = (email === 'adminCoder@coder.com' && password === 'adminCod3r123') ? 'admin' : 'user';
        const user = await userDao.register({ ...req.body, role });
        if (!user) {
            res.status(401).json({ msg: '¡El usuario ya existe!' });
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userDao.login(email, password);
        if (!user) {
            return res.status(401).json({ msg: 'Credenciales incorrectas' });
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
       
        res.redirect('/products');
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
});


router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ msg: 'No se pudo cerrar la sesión' });
        }
        res.redirect('/login');
    });
});

export default router;