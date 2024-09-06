import express from 'express';
import passport from 'passport';
import UserDTO from '../dto/user.dto.js';


const router = express.Router();


router.get('/current', passport.authenticate('current', { session: false }), (req, res) => {
    try {
        
        const userResponse = new UserDTO(req.user);
        res.json({ user: userResponse });
    } catch (error) {
        console.error("Error al obtener el usuario actual:", error.message);
        res.status(500).json({ error: "Error interno del servidor al obtener el usuario actual" });
    }
});


export default router;
