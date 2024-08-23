import jwt from 'jsonwebtoken';
import {UserModel} from '../dao/mongodb/models/users.model.js';
import { sendMail } from '../services/email.service.js';
import config from '../config.js';
import logger from '../logs/logger.js';


export const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await UserModel.findOne({ email });
  
      if (!user) {
        logger.warn(`Solicitud de recuperación fallida: Usuario con email ${email} no encontrado`);
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      // Generar un token JWT que expire en 1 hora
      const token = jwt.sign({ userId: user._id }, config.JWT_SECRET, { expiresIn: '1h' });
      
      // Enviar el correo para la recuperación
      await sendMail(user, 'resetPass', token);
  
      logger.info(`Correo de recuperación enviado a ${email}`);
      res.json({ message: 'Correo de recuperación enviado' });
    } catch (error) {
      logger.error('Error al solicitar la recuperación de contraseña:', error);
      res.status(500).json({ message: 'Error al solicitar la recuperación de contraseña' });
    }
  };