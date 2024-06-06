import CartModel from '../mongodb/models/carts.model.js';


class CartDao {
    async addCart(cart) {
        const newCart = new CartModel(cart);
        return await newCart.save();
    }

    async getProductsInCart(cartId) {
        try {
            const cart = await CartModel.findById(cartId).populate('products.productId');
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }
            return cart;
        } catch (error) {
            throw new Error(`Error al obtener los productos del carrito: ${error.message}`);
        }
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

    async getAllCarts() {
        try {
            return await CartModel.find().populate('products.productId');
        } catch (error) {
            throw new Error(`Error al obtener todos los carritos: ${error.message}`);
        }
    }

    async removeProductFromCart(cartId, productId){
        const cart = await CartModel.findById(cartId);
        if(!cart){
            throw new Error("No se encontro el carrito");
        }

        cart.products = cart.products.filter(product => product.productId.toString() !== productId);
        await cart.save();
        return cart;
    }catch(error){
        throw new Error(`Error al eliminar el producto del carrito: ${error.message}`);
    }

    async updateCartProducts(cartId,products){
        try{
            const cart = await CartModel.findById(cartId);
            if(!cart){
                throw new Error("No se encontro el carrito");
            }

            cart.products = products;
            await cart.save();
            return cart;
        }catch(error){
            throw new Error(`Error al actualizar el carrito: ${error.message}`);
        }
    }

    async updateProductQuantity(cartId,productId,quantity){
        try{
            const cart = await CartModel.findById(cartId);
            if(!cart){
                throw new Error("No se encontro el carrito");
            }

            const productIndex = cart.products.findIndex(item => item.productId.toString() === productId);
            if (productIndex === -1) {
                throw new Error("Producto no encontrado en el carrito");
            }

            cart.products[productIndex].quantity = quantity;
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error(`Error al actualizar la cantidad del producto: ${error.message}`);
        }
        
    }

    async clearCart(cartId){
        try{
            const cart = await CartModel.findById(cartId);
            if(!cart){
                throw new Error("No se encontro el carrito");
            }

            cart.products= [];
            await cart.save();
            return cart;
        }catch(error){
            throw new Error(`Error al limpiar el carrito: ${error.message}`);
        }
    }
}

export default CartDao;
