import jwt from 'jsonwebtoken';
import config from '../config.js';
import UserDao from '../dao/mongodb/users.dao.js';
import CartDao from '../dao/mongodb/carts.dao.js';
import { createHash, isValidPassword } from '../utils.js';
import logger from '../logs/logger.js';
import { sendMail } from './email.service.js';


const userDao = new UserDao();
const cartDao = new CartDao();

export const registerUser = async (userData,file) => {
    try {
        const { email, password, first_name, last_name, age , role} = userData;
        const profileImage = file ? `/profiles/${file.filename}` : null;

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
            role: userRole,
            profileImage

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

export const logoutUser = async (req) => {
    return new Promise(async (resolve, reject) => {
        try {
    
            if (req.user) {
                await userDao.updateLastConnection(req.user._id);
            }

            req.logout(err => {
                if (err) {
                    return reject(new Error('No se pudo cerrar la sesión'));
                }
                resolve();
            });
        } catch (error) {
            reject(new Error('Error al actualizar la última conexión del usuario: ' + error.message));
        }
    });
};

export const getUserById = async (userId) => {
    try {
        return await userDao.getByIdWithCart(userId);
    } catch (error) {
        throw new Error('Error al obtener el usuario: ' + error.message);
    }
};


export const changeUserRole = async (userId, role, files) => {
    try {
    
        const user = await userDao.getById(userId);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        if (user.role === 'user' && role === 'premium') {
        
            const requiredFields = ['identificacion', 'comprobante de domicilio', 'comprobante de estado de cuenta'];
            const missingFields = requiredFields.filter(field => !files[field] || files[field].length === 0);

            if (missingFields.length > 0) {
                throw new Error(`No se han subido los documentos requeridos: ${missingFields.join(', ')}`);
            }

            await updateUserDocuments(userId, files);
        }

    
        if (role !== 'user' && role !== 'premium') {
            throw new Error('Rol inválido');
        }
        
        user.role = role;
        
        await user.save();

        return { success: true, message: 'Rol actualizado exitosamente' };

    } catch (error) {
        console.error('Error en la función changeUserRole:', error.message);
        throw new Error(`Error al cambiar el rol del usuario: ${error.message}`);
    }
};

export const updateUserDocuments = async (userId, files) => {
    try {
        const user = await userDao.getById(userId);
        if (!user) throw new Error('Usuario no encontrado');


        if (!files || typeof files !== 'object') {
            throw new Error('Formato de archivos inválido');
        }

        const documents = [];

    
        for (const [key, value] of Object.entries(files)) {
            if (Array.isArray(value)) {
                value.forEach(file => {
                    documents.push({
                        name: file.originalname,
                        reference: `/documents/${file.filename}`
                    });
                });
            }
        }


        user.documents = [...user.documents, ...documents];
        return await user.save();
    } catch (error) {
        throw new Error('Error al actualizar documentos del usuario: ' + error.message);
    }
};


export const getAllUsers = async () => {
    try{
        const users = await userDao.getAllUsers();
        const usersFil = users.map(user =>({
            _id:user._id,
            first_name: user.first_name,
            last_name:user.last_name,
            email:user.email,
            role:user.role
        }));

        return usersFil;
    }catch(error){
        throw new Error ('Error al obtener los usuarios:'+ error.message )
    }
};

export const deleteInactiveUsers = async (holdInMinutes = 2880) => {
    try {
      const inactiveUsers = await userDao.getInactiveUsers(holdInMinutes);
      if (inactiveUsers.length === 0) {
        return { message: 'No hay usuarios inactivos para eliminar' };
      }

      const nonAdminUsers = inactiveUsers.filter(user => user.role !== 'admin');

    if (nonAdminUsers.length === 0) {
      return { message: 'No hay usuarios inactivos no administradores para eliminar' };
    }
  
      const userIds = [];
      for (const user of nonAdminUsers) {
        try {
          await sendMail(user, 'deleteAccount'); 
          userIds.push(user._id);
        } catch (error) {
          console.error(`Error enviando correo a ${user.email}: ${error.message}`);
        }
      }
  
      const deleteResult = await userDao.deleteUsersById(userIds);
      return {
        message: `${userIds.length} usuarios eliminados por inactividad`,
        result: deleteResult,
      };
    } catch (error) {
      throw new Error('Error eliminando usuarios inactivos: ' + error.message);
    }
  };
  
  export const changeUserRoleView = async (userId, newRole) => {
    try {
        const user = await userDao.updateUserRole(userId, newRole);
        return user;
    } catch (error) {
        throw new Error('Error al cambiar el rol del usuario: ' + error.message);
    }
};

export const deleteUserView = async (userId) => {
    try {
        const result = await userDao.deleteUser(userId);
        return result;
    } catch (error) {
        throw new Error('Error al eliminar el usuario: ' + error.message);
    }
};
