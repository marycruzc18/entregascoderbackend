import CartModel from '../dao/mongodb/models/carts.model.js';
import { ProductModel } from '../dao/mongodb/models/products.model.js';

class CartRepository {
    async createCart() {
        return await CartModel.create({ products: [] });
    }

    async getCartById(cartId) {
        return await CartModel.findById(cartId).populate('products.productId');
    }

    async addProductToCart(cartId, productId, user) {
        const session = await CartModel.startSession();
        session.startTransaction();
        try {
            
            const product = await ProductModel.findById(productId);
            if (!product) {
                throw new Error('Producto no encontrado');
            }

            if (user.role === 'premium' && product.owner === user.email) {
                throw new Error('No puedes agregar a tu carrito un producto que te pertenece');
            }

            
            const cart = await this.getCartById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            
            const existingProduct = cart.products.find(p => p.productId._id.toString() === productId);
            if (existingProduct) {
                existingProduct.quantity += 1; 
            } else {
                cart.products.push({ productId, quantity: 1 });
            }

            
            await cart.save({ session });

            
            await session.commitTransaction();
            session.endSession();
            return cart;
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
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