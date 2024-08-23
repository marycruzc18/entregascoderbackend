import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {UserModel} from '../dao/mongodb/models/users.model.js';
import config from '../config.js';
import logger from '../logs/logger.js';

export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
      
        if (!token) {
            logger.warn('Token no proporcionado en la solicitud');
            return res.status(400).json({ message: 'Token no proporcionado en la solicitud' });
        }

     
        const decoded = jwt.verify(token, config.JWT_SECRET);
        const user = await UserModel.findById(decoded.userId);

        if (!user) {
            logger.warn(`Solicitud de restablecimiento fallida: Usuario con ID ${decoded.userId} no encontrado`);
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        
        const isMatch = await bcrypt.compare(newPassword, user.password);
        if (isMatch) {
            logger.warn(`Intento de restablecimiento de contraseña fallido: La nueva contraseña es la misma que la actual para el usuario con ID ${decoded.userId}`);
            return res.status(400).json({ message: 'No puedes usar la misma contraseña' });
        }

  
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        logger.info(`Contraseña actualizada con éxito para el usuario con ID ${decoded.userId}`);
        res.json({ message: 'Contraseña actualizada con éxito' });
    } catch (error) {
        logger.error('Error al restablecer la contraseña:', error);

        if (error.name === 'TokenExpiredError') {
            logger.warn('Intento de restablecimiento de contraseña con enlace expirado');
            return res.redirect('/request-new-reset-email');
        }

        if (error.name === 'JsonWebTokenError') {
            logger.warn('Token inválido');
            return res.status(400).json({ message: 'Token inválido' });
        }

        res.status(500).json({ message: 'Error al restablecer la contraseña' });
    }
};