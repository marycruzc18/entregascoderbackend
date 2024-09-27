import jwt from 'jsonwebtoken';
import config from '../config.js';

export const isAdmin = (req, res, next) => {
    const token = req.cookies.jwt; 

    if (!token) {
        return res.status(403).json({ message: "Acceso denegado. No tienes permisos de administrador." });
    }

    try {
       
        const decoded = jwt.verify(token, config.JWT_SECRET);
        
        
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: "Acceso denegado. No tienes permisos de administrador." });
        }

        next(); 
    } catch (error) {
        console.error("Error al verificar el token:", error);
        return res.status(403).json({ message: "Token inválido o expirado." });
    }
};
