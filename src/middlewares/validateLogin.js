export const validateLogin = (req, res, next) => {
    if (req.isAuthenticated() && req.session.user && req.session.user.loggedIn) {
        return next();
    }
    res.redirect('/login');
};
