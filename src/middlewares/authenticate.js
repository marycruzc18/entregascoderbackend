import passport from 'passport';

export const authenticate = (req, res, next) => {
    passport.authenticate('current', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({ msg: 'Error en la autenticación', error: err });
        }
        if (!user) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        req.user = user;
        console.log('Usuario autenticado:', req.user); 
        next();
    })(req, res, next);
};
