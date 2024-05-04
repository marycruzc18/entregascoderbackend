import {Router} from "express";
const router = Router();

import CartManager from "../manager/CartManager.js";
const cartManager = new CartManager("./src/data/carrito.json")

router.post('/', async (req, res) => {
    try {
        // Crear un nuevo carrito 
        const newCart = {
            products: req.body.products || [] // Si no se especifica ningún producto, se crea un array vacío
        };

        // Agregar el carrito 
        const cartId = await cartManager.addCart(newCart);


        
        res.status(201).json({ id: cartId });
    } catch (error) {
        console.error("Error al crear un nuevo carrito:", error.message);
        res.status(500).json({ error: "Error interno del servidor al crear un nuevo carrito" });
    }
});

router.get('/:cid', async (req, res) => {
    const cartId = req.params.cid; 

    try {
        // Obtener el carrito con el ID proporcionado
        const cart = await cartManager.getProductsInCart(cartId);

        if (!cart) {
            res.status(404).json({ mensaje: `No se encontró ningún carrito con el ID ${cartId}` });
            return;
        }

        res.status(200).json(cart);
    } catch (error) {
        console.error("Error al obtener el carrito:", error.message);
        res.status(500).json({ error: "Error interno del servidor al obtener el carrito" });
    }
});



router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        // Convertir el ID a un número entero
        const cartIdInt = parseInt(cartId);

        // Agregar el producto al carrito 
        await cartManager.addProductToCart(cartIdInt, productId);

        
        res.status(200).json({ mensaje: `Producto con ID ${productId} agregado al carrito ${cartIdInt} correctamente` });
    } catch (error) {
        
        console.error("Error al agregar el producto al carrito:", error.message);
        res.status(500).json({ error: "Error interno del servidor al agregar el producto al carrito" });
    }
});


router.get('/', async (req, res) => {
    try {
        // Obtener todos los carritos
        const carts = await cartManager.getCarts();

    
        res.status(200).json(carts);
    } catch (error) {
        console.error("Error al obtener los carritos:", error.message);
        res.status(500).json({ error: "Error interno del servidor al obtener los carritos" });
    }
});

export default router;