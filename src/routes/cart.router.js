import { Router } from 'express';
import CartModel from '../dao/mongodb/models/carts.model.js';

const router = Router();

// Crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = new CartModel({
            products: req.body.products || [] 
        });
        const savedCart = await newCart.save();
        res.status(201).json({ id: savedCart._id });
    } catch (error) {
        console.error("Error al crear un nuevo carrito:", error.message);
        res.status(500).json({ error: "Error interno del servidor al crear un nuevo carrito" });
    }
});

// Obtener un carrito por ID
router.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;

    try {
        const cart = await CartModel.findById(cartId).populate('products.productId');
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

// Agregar un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1; 

    try {
        const cart = await CartModel.findById(cartId);
        if (!cart) {
            res.status(404).json({ mensaje: `No se encontró ningún carrito con el ID ${cartId}` });
            return;
        }

        const existingProductIndex = cart.products.findIndex(item => item.productId.toString() === productId);
        if (existingProductIndex >= 0) {
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            cart.products.push({ productId, quantity });
        }

        await cart.save();
        res.status(200).json({ mensaje: `Producto con ID ${productId} agregado al carrito ${cartId} correctamente` });
    } catch (error) {
        console.error("Error al agregar el producto al carrito:", error.message);
        res.status(500).json({ error: "Error interno del servidor al agregar el producto al carrito" });
    }
});

// Obtener todos los carritos
router.get('/', async (req, res) => {
    try {
        const carts = await CartModel.find().populate('products.productId');
        res.status(200).json(carts);
    } catch (error) {
        console.error("Error al obtener los carritos:", error.message);
        res.status(500).json({ error: "Error interno del servidor al obtener los carritos" });
    }
});

export default router;
