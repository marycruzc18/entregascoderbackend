import express from 'express';
import passport from 'passport';

const router = express.Router();

// Ruta para devolver el usuario actual
router.get('/current', passport.authenticate('current', { session: false }), (req, res) => {
    res.json({ user: req.user });
});


export default router;
