// validateLogin middleware
export const validateLogin = (req, res, next) => {
    if (req.session.user && req.session.user.loggedIn) {
        next(); 
    } else {
        res.redirect('/login'); 
    }
};
