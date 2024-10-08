import { UserModel } from "./models/users.model.js";
import bcrypt from "bcrypt";


export default class UserDao{

    //Registro de usuario
    async register(userData) {
        try {
            const existUser = await UserModel.findOne({ email: userData.email });
            if (existUser) {
                return null; 
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
                return null;
            }
            
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return null; 
            }

            user.last_connection=new Date();
            await user.save();


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


async updateUserRole(userId, newRole) {
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { role: newRole },
            { new: true } 
        );
        return updatedUser;
    } catch (error) {
        throw new Error('Error al actualizar el rol del usuario: ' + error.message);
    }
}


async updateLastConnection(userId) {
    try {
        await UserModel.findByIdAndUpdate(userId, { last_connection: new Date() });
    } catch (error) {
        throw new Error('Error al actualizar la última conexión del usuario: ' + error.message);
    }
}

async getAllUsers(){
    try{
        return await UserModel.find();
    }catch(error){
        throw new Error('Error al mostrar a los usuarios:' + error.message);
    }
    
}

async getInactiveUsers(minutes){
    try{
        const cutoffdate = new Date(Date.now() - minutes * 60 * 1000);
        return await UserModel.find({last_connection: {$lt:cutoffdate},role: { $ne: 'admin' }});
    }catch(error){
        throw new Error ('Error al obtener los usuarios que estan inactivos' + error.message );
    }
} 

async deleteUsersById(userId){
    try{
        return await UserModel.deleteMany({_id: { $in:userId}});
    }catch(error){
        throw new Error ('Error al eliminar a los usuarios ' + error.message );
    }
}


async deleteUser(userId) {
    try {
        return await UserModel.findByIdAndDelete(userId);
    } catch (error) {
        throw new Error('Error al eliminar al usuario: ' + error.message);
    }
}

}

