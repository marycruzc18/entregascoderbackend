import { Router } from 'express';
import CartDao from '../dao/mongodb/carts.dao.js';

const cartDao = new CartDao();

const router = Router();

// Crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = ({
            products: req.body.products || [] 
        });
        const savedCart = await cartDao.addCart(newCart); 
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
        const cart = await cartDao.getProductsInCart(cartId);
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
        const updatedCart = await cartDao.addProductToCart(cartId, productId, quantity);
        res.status(200).json({ mensaje: `Producto con ID ${productId} agregado al carrito ${cartId} correctamente` });
    } catch (error) {
        console.error("Error al agregar el producto al carrito:", error.message);
        res.status(500).json({ error: "Error interno del servidor al agregar el producto al carrito" });
    }
});

// Obtener todos los carritos
router.get('/', async (req, res) => {
    try {
        const carts = await cartDao.getAllCarts();
        res.status(200).json(carts);
    } catch (error) {
        console.error("Error al obtener los carritos:", error.message);
        res.status(500).json({ error: "Error interno del servidor al obtener los carritos" });
    }
});

//Eliminar del carrito el producto seleccionado
router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const updatedCart = await cartDao.removeProductFromCart(cid, pid);
        res.status(200).json({ status: 'success', cart: updatedCart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

//Actualizar el carrito
router.put('/:cid', async (req,res) => {
    const cartId=req.params.cid;
    const products = req.body.products;

    try{
        const updateCart= await cartDao.updateCartProducts(cartId,products);
        res.status(200).json({ status: 'success', cart: updateCart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});


//Actualizar cantidad de productos en el carrito 
router.put('/:cid/products/:pid', async (req,res)=>{
    const {cid,pid}= req.params;
    const {quantity} = req.body;

    try{
        const updateCart= await cartDao.updateProductQuantity(cid,pid,quantity);
        res.status(200).json({ status: 'success', cart: updateCart });
    }catch(error){
        res.status(500).json({ status: 'error', message: error.message });
    }
})

//Eliminar todos los productos del carrito 
router.delete('/:cid', async (req,res)=>{
    const {cid} = req.params;
    try{
        const clearedCart= await cartDao.clearCart(cid);
        res.status(200).json({ status: 'success', cart: clearedCart });
    }catch(error){
        res.status(500).json({ status: 'error', message: error.message });
    }
})




export default router;
