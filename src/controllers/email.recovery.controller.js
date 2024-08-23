import jwt from 'jsonwebtoken';
import config from '../config.js';


export const renderResetPasswordPage = (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ message: 'Token no proporcionado en la solicitud' });
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        res.render('resetPassword', { token }); 
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.redirect('/request-new-reset-email');
        }
        res.status(400).json({ message: 'Token inválido' });
    }
};