import CartModel from './models/cart.model.js';

class CartDao {
    async addCart(cart) {
        const newCart = new CartModel(cart);
        return await newCart.save();
    }

    async getProductsInCart(cartId) {
        return await CartModel.findById(cartId).populate('products.productId');
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        const cart = await CartModel.findById(cartId);
        if (!cart) throw new Error('Cart not found');
        
        const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
        if (productIndex >= 0) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ productId, quantity });
        }

        return await cart.save();
    }

    async getCarts() {
        return await CartModel.find().populate('products.productId');
    }
}

export default CartDao;
