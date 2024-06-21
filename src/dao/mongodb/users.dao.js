import { UserModel } from "./models/users.model.js";
import bcrypt from "bcrypt";


export default class UserDao{

    //Registro de usuario
    async register(userData) {
        try {
            const existUser = await UserModel.findOne({ email: userData.email });
            if (existUser) {
                return null; // Usuario existe
            }

            //se hace el cifrado de la contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(userData.password,salt);
            userData.password = hashedPassword;

            const user = new UserModel(userData);
            await user.save();
            return user;
        } catch (error) {
            throw new Error('Error al registrar el usuario: ' + error.message);
        }
    }

    
    async getByEmail(email) {
        try {
            const user = await UserModel.findOne({ email });
            return user;
        } catch (error) {
            throw new Error('Error al buscar el usuario por email: ' + error.message);
        }
    }


    // Login de Usuario
    async login(email, password) {
        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                return null; // Usuario no encontrado
            }
            // Se valida la contraseña
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return null; // Contraseña incorrecta
            }
            return user;
        } catch (error) {
            throw new Error('Error al iniciar sesión: ' + error.message);
        }
    }

    async getById(id) {
    try {
        const user = await UserModel.findById(id);
        return user; 
    } catch (error) {
        throw new Error('Error al buscar usuario por ID: ' + error.message);
    }
}

}