import express from 'express';
import {
    register,
    login,
    logout,
    githubAuth,
    githubCallback
} from '../controllers/users.controller.js'

const router = express.Router();

// Ruta para el registro
router.post('/register', register);

// Ruta para iniciar sesión
router.post('/login', login);

// Ruta para cerrar sesión
router.post('/logout', logout);

// Ruta para iniciar sesión con GitHub
router.get('/register-github', githubAuth);

// Callback URL después de autenticarse con GitHub
router.get('/profile',githubCallback);

export default router;

