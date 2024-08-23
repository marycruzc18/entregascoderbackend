import jwt from 'jsonwebtoken';
import config from '../config.js';
import UserDao from '../dao/mongodb/users.dao.js';
import CartDao from '../dao/mongodb/carts.dao.js';
import { createHash, isValidPassword } from '../utils.js';
import logger from '../logs/logger.js';

const userDao = new UserDao();
const cartDao = new CartDao();

export const registerUser = async (userData) => {
    try {
        const { email, password, first_name, last_name, age , role} = userData;

        const existingUser = await userDao.getByEmail(email);
        if (existingUser) {
            logger.warn(`Intento de registro fallido: El usuario con email ${email} ya existe.`);
            throw new Error('El usuario ya existe');
        }

       
        let userRole = role;
        if (!userRole) {
            userRole = (email === config.EMAIL_ADMIN && password === config.PASS_ADMIN) ? 'admin' : 'user';
        }

        const hashedPassword = createHash(password);
    
        const user = await userDao.register({
            email,
            password: hashedPassword,
            first_name,
            last_name,
            age,
            role: userRole
        });


        const cart = await cartDao.createCart(user._id);

    
        user.cart = cart._id;
        await user.save();

        logger.info(`Usuario registrado exitosamente: ${email}`);
        return user;
    } catch (error) {
        logger.error(`Error durante el registro del usuario: ${error.message}`);
        throw error; 
    }
};



export const loginUser = async (email, password) => {
    try {
        const user = await userDao.getByEmail(email);
        if (!user || !isValidPassword(password, user)) {
            throw new Error('Credenciales incorrectas');
        }

        const token = jwt.sign({ id: user._id, first_name: user.first_name, last_name: user.last_name, role: user.role }, config.JWT_SECRET, { expiresIn: '5m' });
        return { user, token };
    } catch (error) {
        throw new Error('Error al iniciar sesión: ' + error.message);
    }
};

export const logoutUser = (req) => {
    return new Promise((resolve, reject) => {
        req.logout(err => {
            if (err) {
                return reject(new Error('No se pudo cerrar la sesión'));
            }
            resolve();
        });
    });
};

export const getUserById = async (userId) => {
    try {
        return await userDao.getByIdWithCart(userId);
    } catch (error) {
        throw new Error('Error al obtener el usuario: ' + error.message);
    }
};

export const changeUserRole = async (userId, role) => {
    try {
       
        const updatedUser = await userDao.updateUserRole(userId, role);
        return updatedUser;
    } catch (error) {
        throw new Error('Error al cambiar el rol del usuario: ' + error.message);
    }
};

