import express from 'express';
import {
    register,
    login,
    logout,
    githubAuth,
    githubCallback,
    changeUserRoleController,
    uploadDocuments
} from '../controllers/users.controller.js';
import { profileUploader,documentUploader} from '../middlewares/multer.js';

const router = express.Router();

// Ruta para el registro
router.post('/register',profileUploader.single('profileImage'), register);

// Ruta para iniciar sesión
router.post('/login', login);

// Ruta para cerrar sesión
router.post('/logout', logout);

// Ruta para iniciar sesión con GitHub
router.get('/register-github', githubAuth);

// Callback URL después de autenticarse con GitHub
router.get('/profile',githubCallback);

// Cambiar el rol de un usuario
router.put('/api/users/premium/:uid', documentUploader.fields([
    { name: 'identificacion', maxCount: 1 }, 
    { name: 'comprobante de domicilio', maxCount: 1 },
    { name: 'comprobante de estado de cuenta', maxCount: 1 },
]), (req, res) => {
    console.log('Archivos recibidos:', req.files); 
    console.log('Campos recibidos:', req.body); 
    changeUserRoleController(req, res);
});




// Ruta para subir uno o múltiples documentos
router.post('/:uid/documents', documentUploader.array('documents', 5), uploadDocuments);

export default router;

