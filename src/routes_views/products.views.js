import express from 'express';
import { getAllProducts, getProductById } from '../controllers/products.view.controller.js'
import { authenticateJWT } from '../middlewares/validateLogin.js';

const router = express.Router();

router.get('/products', authenticateJWT, getAllProducts);




router.get('/:id', getProductById);

export default router;