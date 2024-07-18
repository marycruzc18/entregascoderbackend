import { Router } from 'express';
import {
    createCart,
    getCartById,
    addProductToCart,
    getAllCarts,
    removeProductFromCart,
    updateCartProducts,
    updateProductQuantity,
    clearCart
} from '../controllers/cart.controller.js';


const router = Router();

// Crear un nuevo carrito
router.post('/', createCart)
    
// Obtener un carrito por ID
router.get('/:cid', getCartById)

// Agregar un producto al carrito
router.post('/:cid/product/:pid', addProductToCart)

// Obtener todos los carritos
router.get('/', getAllCarts)

//Eliminar del carrito el producto seleccionado
router.delete('/:cid/products/:pid', removeProductFromCart)

//Actualizar el carrito
router.put('/:cid', updateCartProducts)


//Actualizar cantidad de productos en el carrito 
router.put('/:cid/products/:pid', updateProductQuantity)

//Eliminar todos los productos del carrito 
router.delete('/:cid', clearCart)




export default router;
