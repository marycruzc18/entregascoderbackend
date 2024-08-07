import CartModel from '../dao/mongodb/models/carts.model.js';

class CartRepository {
    async createCart() {
        return await CartModel.create({ products: [] });
    }

    async getCartById(cartId) {
        return await CartModel.findById(cartId).populate('products.productId');
    }

    async addProductToCart(cartId, productId, quantity) {
        try {
            const cart = await this.getCartById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            const existingProduct = cart.products.find(p => p.productId._id.toString() === productId);
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.products.push({ productId, quantity });
            }

            return await cart.save();
        } catch (error) {
            throw new Error(`Error al agregar el producto al carrito: ${error.message}`);
        }
    }

    async getAllCarts() {
        return await CartModel.find().populate('products.productId').exec();
    }

    async removeProductFromCart(cartId, productId) {
        return await CartModel.findByIdAndUpdate(
            cartId,
            { $pull: { products: { productId } } },
            { new: true }
        ).populate('products.productId').exec();
    }

    async updateCartProducts(cartId, products) {
        return await CartModel.findByIdAndUpdate(
            cartId,
            { products },
            { new: true }
        ).populate('products.productId').exec();
    }

    async updateProductQuantity(cartId, productId, quantity) {
        return await CartModel.findOneAndUpdate(
            { _id: cartId, 'products.productId': productId },
            { $set: { 'products.$.quantity': quantity } },
            { new: true }
        ).populate('products.productId').exec();
    }

    async clearCart(cartId) {
        return await CartModel.findByIdAndUpdate(
            cartId,
            { products: [] },
            { new: true }
        ).populate('products.productId').exec();
    }

    async updateCartAfterPurchase(cartId, failedProducts) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) throw new Error('Carrito no encontrado');

            cart.products = cart.products.filter(product => failedProducts.includes(product.productId.toString()));
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error('Error al actualizar el carrito después de la compra: ' + error.message);
        }
    }
}


export default CartRepository;


