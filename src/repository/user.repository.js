import UserDTO from '../dto/user.dto.js';
import UserDao from '../dao/mongodb/users.dao.js';

const userDao = new UserDao();

class UserRepository {
    async register(userData) {
        try {
            console.log("Datos de usuario recibidos en UserRepository:", userData);
            const newUser = await userDao.register(userData);
            return new UserDTO(newUser);
        } catch (error) {
            console.error("Error en UserRepository.register:", error);
            throw new Error('Error al registrar el usuario: ' + error.message);
        }
    }

    async getByEmail(email) {
        try {
            const user = await userDao.getByEmail(email);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }
            return new UserDTO(user);
        } catch (error) {
            throw new Error('Error al buscar el usuario por email: ' + error.message);
        }
    }

    async getById(userId) {
        try {
            const user = await userDao.getById(userId);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }
            return new UserDTO(user);
        } catch (error) {
            throw new Error('Error al buscar el usuario por ID: ' + error.message);
        }
    }
}


export default UserRepository;

