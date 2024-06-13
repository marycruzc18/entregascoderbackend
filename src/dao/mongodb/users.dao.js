import { UserModel } from "./models/users.model.js";

export default class UserDao{

    //Registro de usuario
    async register(userData) {
        try {
            const existUser = await UserModel.findOne({ email: userData.email });
            if (existUser) {
                return null; // Usuario existe
            }
            const user = new UserModel(userData);
            await user.save();
            return user;
        } catch (error) {
            throw new Error('Error al registrar el usuario: ' + error.message);
        }
    }

    // Login de Usuario
    async login(email, password) {
        try {
            const user = await UserModel.findOne({ email, password });
            if (!user) {
                return null; // Usuario no encontrado o contraseña incorrecta
            }
            return user;
        } catch (error) {
            throw new Error('Error al iniciar sesión: ' + error.message);
        }
    }
}