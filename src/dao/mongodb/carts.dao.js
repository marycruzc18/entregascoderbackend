import CartModel from '../mongodb/models/carts.model.js';
import { ProductModel } from './models/products.model.js';

class CartDao {

    async createCart(userId) {
        try {
            const cart = new CartModel({ user: userId, products: [] });
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error('Error al crear el carrito: ' + error.message);
        }
    }

    async addCart(cartData) {
        try {
            return await CartModel.create(cartData);
        } catch (error) {
            throw new Error('Error al crear el carrito: ' + error.message);
        }
    }


    async addProductToCart(cartId, productId, quantity = 1) {
    try {
       
        const cart = await CartModel.findById(cartId);
        if (!cart) throw new Error('Carrito no encontrado');

      
        const product = await ProductModel.findById(productId);
        if (!product) throw new Error('Producto no encontrado');

        
        if (user.role === 'admin') {
            throw new Error('Los administradores no pueden agregar productos a su carrito');
        }

        
        if (user.role === 'premium' && product.owner === user.email) {
            throw new Error('No puedes agregar tu propio producto al carrito');
        }
       
        const existingProduct = cart.products.find(p => p.productId.toString() === productId);
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
        try {
            return await CartModel.find().populate('products.productId');
        } catch (error) {
            throw new Error(`Error al obtener todos los carritos: ${error.message}`);
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error("No se encontró el carrito");
            }

            cart.products = cart.products.filter(product => product.productId.toString() !== productId);
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error(`Error al eliminar el producto del carrito: ${error.message}`);
        }
    }

    async updateCartProducts(cartId, products) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error("No se encontró el carrito");
            }

            cart.products = products;
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error(`Error al actualizar el carrito: ${error.message}`);
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error("No se encontró el carrito");
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

    async clearCart(cartId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error("No se encontró el carrito");
            }

            cart.products = [];
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error(`Error al limpiar el carrito: ${error.message}`);
        }
    }

    async purchaseCart(cartId, userId) {
        try {
         
            const cart = await CartModel.findById(cartId).populate('products.productId').exec();
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }
    
            let totalAmount = 0;
            const purchasedProducts = [];
            const failedProducts = [];
    
            for (const item of cart.products) {
                const product = await ProductModel.findById(item.productId);
                if (!product) {
                    failedProducts.push(item);
                    continue;  
                }
    
                if (product.stock >= item.quantity) {
                    
                    product.stock -= item.quantity;
                    await product.save();  
    
               
                    totalAmount += product.price * item.quantity;
                    purchasedProducts.push(item);  
                } else {

                    failedProducts.push(item);
                }
            }
    
            return { totalAmount, purchasedProducts, failedProducts, purchaser: userId };
        } catch (error) {
            throw new Error(`Error al finalizar la compra: ${error.message}`);
        }
    }
    
    async updateCartAfterPurchase(cartId, failedProducts) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }

            cart.products = failedProducts;
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error(`Error al actualizar el carrito después de la compra: ${error.message}`);
        }
    }

    async getProductsInCart(cartId) {
        try {
            const cart = await CartModel.findById(cartId).populate('products.productId').exec();
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            return cart.products;
        } catch (error) {
            throw new Error(`Error al obtener los productos del carrito con ID ${cartId}: ${error.message}`);
        }
    }
}



export default CartDao;