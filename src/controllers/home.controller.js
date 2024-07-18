import ProductManager from '../dao/filesystem/ProductManager.js';

const productManager = new ProductManager("./src/data/productos.json");

export const getHomePage = async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', { products });
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error interno del servidor');
    }
};
