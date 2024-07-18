import { Router } from 'express';
import { getCartById } from '../controllers/cart.view.controller.js'


const router = Router();



router.get('/:cid', getCartById);


export default router;