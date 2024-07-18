import express from 'express';
import { authenticateJWT } from '../middlewares/validateLogin.js';
import { getLoginPage, getRegisterPage, getProducts } from '../controllers/users.view.controller.js';


const router = express.Router();


const guestMiddleware = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/products');
    }
    next();
};

router.get('/login', guestMiddleware, getLoginPage);

router.get('/register', guestMiddleware, getRegisterPage);

router.get('/products', authenticateJWT, getProducts);


export default router;
