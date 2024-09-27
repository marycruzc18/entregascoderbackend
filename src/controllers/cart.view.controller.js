import CartDao from '../dao/mongodb/carts.dao.js';

const cartDao = new CartDao();

export const getCartById = async (req, res) => {
    const cartId = req.params.cid;

    try {
        const cart = await cartDao.getProductsInCart(cartId);
        if (!cart) {
            console.log(`Cart with ID: ${cartId} not found`);
            res.status(404).json({ mensaje: `No se encontró ningún carrito con el ID ${cartId}` });
            return;
        }

        
        const cartProducts = cart.products.map(p => {
            if (p.productId) {
                return {
                    ...p.productId._doc,
                    quantity: p.quantity
                };
            } else {
                console.error("Product is null:", p);
                return null;
            }
        }).filter(p => p !== null);

        console.log(`Cart products:`, cartProducts);

        res.render('cart', { products: cartProducts });
    } catch (error) {
        console.error("Error al obtener el carrito:", error.message);
        res.status(500).json({ error: "Error interno del servidor al obtener el carrito" });
    }
};
