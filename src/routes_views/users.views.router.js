import express from 'express';
import { authenticateJWT } from '../middlewares/validateLogin.js';
import { isAdmin } from '../middlewares/admin.js';
import { getLoginPage, getRegisterPage, getProducts,UserAdminView,changeUserRoleViewController,deleteUserController } from '../controllers/users.view.controller.js';



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

router.get('/adminView',isAdmin, UserAdminView);

router.post('/users/:uid/role',isAdmin, changeUserRoleViewController);

router.post('/users/:uid',isAdmin, deleteUserController);


export default router;
