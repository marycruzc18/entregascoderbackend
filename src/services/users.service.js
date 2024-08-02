import jwt from 'jsonwebtoken';
import config from '../config.js';
import UserDao from '../dao/mongodb/users.dao.js';
import CartDao from '../dao/mongodb/carts.dao.js';
import { createHash, isValidPassword } from '../utils.js';

const userDao = new UserDao();
const cartDao = new CartDao();

export const registerUser = async (userData) => {
    const { email, password, first_name, last_name, age } = userData;
    
    // Asignar el rol de administrador si el correo y la contraseña coinciden
    const role = (email === config.EMAIL_ADMIN && password === config.PASS_ADMIN) ? 'admin' : 'user';

    // Hashear la contraseña
    const hashedPassword = createHash(password);
    
    // Crear el usuario
    const user = await userDao.register({
        email,
        password: hashedPassword,
        first_name,
        last_name,
        age,
        role
    });

    if (!user) {
        throw new Error('El usuario ya existe');
    }

    // Crear un carrito asociado al usuario
    const cart = await cartDao.createCart(user._id);

    // Actualizar el usuario con el carrito creado
    user.cart = cart._id;
    await user.save();

    return user;
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
