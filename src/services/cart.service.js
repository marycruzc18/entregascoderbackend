import { UserModel } from "../dao/mongodb/models/users.model.js";
import { ProductModel } from "../dao/mongodb/models/products.model.js";
import CartRepository from "../repository/cart.repository.js";
import TicketDao from "../dao/ticket.dao.js";

const cartRepository = new CartRepository();
const ticketDao = new TicketDao();

export const addProductToUserCart = async (userId, productId, quantity) => {
    try {
        
        const user = await UserModel.findById(userId).populate('cart');
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

    
        const product = await ProductModel.findById(productId);
        if (!product) {
            throw new Error('Producto no encontrado');
        }

    
        if (!user.cart) {
            const newCart = await cartRepository.createCart();
            user.cart = newCart._id;
            await user.save();
        }

   
        return await cartRepository.addProductToCart(user.cart, productId, quantity);
    } catch (error) {
        throw new Error('Error al agregar el producto al carrito del usuario: ' + error.message);
    }
};

export const createCart = async () => {
    try {
        return await cartRepository.createCart();
    } catch (error) {
        throw new Error('Error al crear un nuevo carrito');
    }
};

export const getAllCarts = async () => {
    try {
        return await cartRepository.getAllCarts();
    } catch (error) {
        throw new Error('Error al obtener todos los carritos');
    }
};

export const getCartById = async (cartId) => {
    try {
        return await cartRepository.getCartById(cartId);
    } catch (error) {
        throw new Error(`Error al obtener el carrito con ID ${cartId}`);
    }
};

export const addProductToCart = async (cartId, productId, quantity) => {
    try {
        return await cartRepository.addProductToCart(cartId, productId, quantity);
    } catch (error) {
        throw new Error(`Error al agregar el producto con ID ${productId} al carrito con ID ${cartId}`);
    }
};

export const removeProductFromCart = async (cartId, productId) => {
    try {
        return await cartRepository.removeProductFromCart(cartId, productId);
    } catch (error) {
        throw new Error(`Error al eliminar el producto con ID ${productId} del carrito con ID ${cartId}`);
    }
};

export const updateCartProducts = async (cartId, products) => {
    try {
        return await cartRepository.updateCartProducts(cartId, products);
    } catch (error) {
        throw new Error(`Error al actualizar los productos del carrito con ID ${cartId}`);
    }
};

export const updateProductQuantity = async (cartId, productId, quantity) => {
    try {
        return await cartRepository.updateProductQuantity(cartId, productId, quantity);
    } catch (error) {
        throw new Error(`Error al actualizar la cantidad del producto con ID ${productId} en el carrito con ID ${cartId}`);
    }
};

export const clearCart = async (cartId) => {
    try {
        return await cartRepository.clearCart(cartId);
    } catch (error) {
        throw new Error(`Error al vaciar el carrito con ID ${cartId}`);
    }
};

export const purchaseCart = async (cartId, userId) => {
    try {
        const cart = await cartRepository.getCartById(cartId);
        if (!cart) throw new Error('Carrito no encontrado');

        const user = await UserModel.findById(userId);
        if (!user) throw new Error('Usuario no encontrado');

        let totalAmount = 0;
        const failedProducts = [];

        for (const item of cart.products) {
            const product = await ProductModel.findById(item.productId);
            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                await product.save();
                totalAmount += product.price * item.quantity;
            } else {
                failedProducts.push(item.productId);
            }
        }

        if (totalAmount > 0) {
            const ticket = await ticketDao.createTicket({
                amount: totalAmount,
                purchaser: user.email
            });

            await cartRepository.updateCartAfterPurchase(cartId, failedProducts);

            return { ticket, failedProducts };
        } else {
            throw new Error('No hay productos disponibles para la compra');
        }
    } catch (error) {
        throw new Error('Error al procesar la compra: ' + error.message);
    }
};
