import passport from 'passport';
import jwt from 'jsonwebtoken';
import { registerUser, loginUser, logoutUser, getUserById, changeUserRole,updateUserDocuments  } from '../services/users.service.js';
import config from '../config.js';
import logger from '../logs/logger.js';


export const register = async (req, res, next) => {
    
    try {
       logger.info('Intentando registrar un nuevo ususario');

        const user = await registerUser(req.body,req.file);

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





export const changeUserRoleController = async (req, res) => {
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);

    const { uid } = req.params;
    const { role } = req.body;

    if (!role) {
        return res.status(400).json({ message: 'El rol es requerido para actualizar el usuario' });
    }

    if (role === 'premium') {
    
        const requiredFields = ['identificacion', 'comprobante de domicilio', 'comprobante de estado de cuenta'];
        const missingFields = requiredFields.filter(field => !req.files[field] || req.files[field].length === 0);

        if (missingFields.length > 0) {
            return res.status(400).json({ message: `Faltan los documentos: ${missingFields.join(', ')}` });
        }
    }

    try {
        const updatedUser = await changeUserRole(uid, role, req.files);
        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: `Error al cambiar el rol del usuario: ${error.message}` });
    }
};


export const uploadDocuments = async (req, res) => {
    const { uid } = req.params;
    const files = req.files;

    console.log('Archivos recibidos:', files); 

    try {
        if (!files || files.length === 0) {
            return res.status(400).json({ message: 'No se subieron documentos' });
        }

        const updatedDocuments = await updateUserDocuments(uid, files);
        res.status(200).json({
            message: 'Documentos subidos con éxito',
            documents: updatedDocuments
        });
    } catch (error) {
        res.status(500).json({ message: `Error al subir documentos: ${error.message}` });
    }
};

