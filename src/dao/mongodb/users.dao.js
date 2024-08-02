import { UserModel } from "./models/users.model.js";
import bcrypt from "bcrypt";


export default class UserDao{

    //Registro de usuario
    async register(userData) {
        try {
            const existUser = await UserModel.findOne({ email: userData.email });
            if (existUser) {
                return null; // Usuario ya existe
            }
            const user = new UserModel(userData);
            await user.save();
            return user;
        } catch (error) {
            throw new Error('Error al registrar el usuario: ' + error.message);
        }
    }

    
    async getByEmail(email) {
        try {
            const user = await UserModel.findOne({ email }).populate('cart').exec();;
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


async getByIdWithCart(userId) {
    try {
        const user = await UserModel.findById(userId).populate('cart');
        return user;
    } catch (error) {
        throw new Error('Error al obtener el usuario: ' + error.message);
    }
}

}