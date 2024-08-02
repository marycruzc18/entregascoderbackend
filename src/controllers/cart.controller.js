import {
    createCart as createCartService,
    getCartById as getCartByIdService,
    addProductToCart as addProductToCartService,
    getAllCarts as getAllCartsService,
    removeProductFromCart as removeProductFromCartService,
    updateCartProducts as updateCartProductsService,
    updateProductQuantity as updateProductQuantityService,
    clearCart as clearCartService,
    purchaseCart as purchaseCartService 
} from '../services/cart.service.js';

export const createCart = async (req, res) => {
    try {
        const newCart = await createCartService(req.body.products);
        res.status(201).json({ id: newCart._id });
    } catch (error) {
        console.error("Error al crear un nuevo carrito:", error.message);
        res.status(500).json({ error: "Error interno del servidor al crear un nuevo carrito" });
    }
};


export const getCartById = async (req, res) => {
    const cartId = req.params.cid;
    try {
        const cart = await getCartByIdService(cartId);
        if (!cart) {
            res.status(404).json({ mensaje: `No se encontró ningún carrito con el ID ${cartId}` });
            return;
        }
        res.status(200).json(cart);
    } catch (error) {
        console.error("Error al obtener el carrito:", error.message);
        res.status(500).json({ error: "Error interno del servidor al obtener el carrito" });
    }
};

export const addProductToCart = async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;
    try {
        await addProductToCartService(cartId, productId, quantity);
        res.status(200).json({ mensaje: `Producto con ID ${productId} agregado al carrito ${cartId} correctamente` });
    } catch (error) {
        console.error("Error al agregar el producto al carrito:", error.message);
        res.status(500).json({ error: "Error interno del servidor al agregar el producto al carrito" });
    }
};

export const getAllCarts = async (req, res) => {
    try {
        const carts = await getAllCartsService();
        res.status(200).json(carts);
    } catch (error) {
        console.error("Error al obtener los carritos:", error.message);
        res.status(500).json({ error: "Error interno del servidor al obtener los carritos" });
    }
};

export const removeProductFromCart = async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const updatedCart = await removeProductFromCartService(cid, pid);
        res.status(200).json({ status: 'success', cart: updatedCart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export const updateCartProducts = async (req, res) => {
    const cartId = req.params.cid;
    const products = req.body.products;
    try {
        const updateCart = await updateCartProductsService(cartId, products);
        res.status(200).json({ status: 'success', cart: updateCart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export const updateProductQuantity = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        const updateCart = await updateProductQuantityService(cid, pid, quantity);
        res.status(200).json({ status: 'success', cart: updateCart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export const clearCart = async (req, res) => {
    const { cid } = req.params;
    try {
        const clearedCart = await clearCartService(cid);
        res.status(200).json({ status: 'success', cart: clearedCart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export const purchaseCart = async (req, res) => {
    const cartId = req.params.cid;
    const userId = req.user._id;

    try {
        const { ticket, failedProducts } = await purchaseCartService(cartId, userId);
        res.status(200).json({ status: 'success', ticket, failedProducts });
    } catch (error) {
        console.error('Error al finalizar la compra:', error.message);
        res.status(500).json({ status: 'error', message: error.message });
    }
};