import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const authenticateJWT = (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.redirect('/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Error al verificar el token:', err);
        return res.redirect('/login');
    }
};
