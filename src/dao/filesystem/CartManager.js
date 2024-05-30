import fs from "fs";


class CartManager{
    constructor(path) {
        this.path = path;
    }

    async addCart(newCart){
        try {
            let carts = await this.getCarts();
            
            // Verificar si carts es un array
            if (!Array.isArray(carts)) {
                carts = []; // Si no es un array, inicializar como un array vacío
            }
            
            // Generar un nuevo ID para el carrito
            const cartId = await this.getCartId();
            
            // Agregar el nuevo carrito al array de carritos
            newCart.id = cartId;
            carts.push(newCart);
            
            // Guardar el array de carritos actualizado
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
            
            return cartId;
        } catch (error) {
            console.error("Error al agregar el carrito:", error.message);
            throw error;
        }
    }

    

    async getCartId() {
        try {
            const carts = await this.getCarts();
            
            // Verificar si carts es un array y no está vacío
            if (Array.isArray(carts) && carts.length > 0) {
                let cartId = 0;
                carts.forEach(cart => {
                    if (cart.id > cartId) cartId = cart.id;
                });
                return cartId + 1;
            } else {
                
                return 1;
            }
        } catch (error) {
            console.error("Error al obtener el último ID de carrito:", error.message);
            return 1; 
        }
    }
    
    async getCarts() {
        try {
            // Leer el archivo de carritos y parsear su contenido
            const data = await fs.promises.readFile(this.path, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            // Si el archivo no existe o está vacío, devolver un array vacío
            if (error.code === 'ENOENT') {
                return [];
            } else {
                console.error("Error al leer el archivo de carritos:", error.message);
                throw error;
            }
        }
    }
    

    
    async getProductsInCart(cartId) {
        try {
            // Obtener todos los carritos
            const carts = await this.getCarts();
    
            // Encontrar el carrito con el ID 
            const cart = carts.find(cart => cart.id ===  parseInt(cartId));
    
            // Verificar si se encontró el carrito
            if (!cart) {
                // Si no se encontró el carrito, devolver un array vacío
                return [];
            }
    
            // Si se encontró el carrito, devolver los productos asociados a ese carrito
            return cart.products;
        } catch (error) {
            
            throw error;
        }
    }
    
    
    


    async addProductToCart(cartId, productId) {
        try {
            // Obtener todos los carritos
            let carts = await this.getCarts();

            // Encontrar el carrito correspondiente al cartId proporcionado
            const cartIndex = carts.findIndex(cart => cart.id === cartId);
            if (cartIndex === -1) {
                throw new Error(`No se encontró ningún carrito con el ID ${cartId}`);
            }

            const cart = carts[cartIndex];

            // Verificar si el producto ya está en el carrito
            const productIndex = cart.products.findIndex(product => product.product === productId);

            if (productIndex !== -1) {
                // Si el producto ya está en el carrito, incrementar la cantidad
                cart.products[productIndex].quantity++;
            } else {
                // Si el producto no está en el carrito, agregarlo con cantidad 1
                cart.products.push({ product: productId, quantity: 1 });
            }

            // Guardar los carritos actualizados en el archivo
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));

            console.log(`Producto con ID ${productId} agregado al carrito ${cartId} correctamente`);
        } catch (error) {
            console.error("Error al agregar el producto al carrito:", error.message);
            throw error;
        }
    }
    
}

export default CartManager;