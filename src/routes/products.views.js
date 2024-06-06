import express from 'express';
import ProductDao from '../dao/mongodb/products.dao.js';
import CartDao from '../dao/mongodb/carts.dao.js';

const router = express.Router();
const productDao = new ProductDao();
const cartDao = new CartDao();



router.get('/', async (req, res) => {
    try {
        const { page, limit, sort, category } = req.query;
        const productsData = await productDao.getProducts(page, limit, sort, category);
        
        // Convertir los productos a objetos JSON
        const productsJSON = productsData.payload.map(product => product.toJSON());

        const pages = [];
        for (let i = 1; i <= productsData.totalPages; i++) {
            const pageItem = {
                number: i,
                numberPgBar: i,
                url: `/products?page=${i}`,
            };
            pages.push(pageItem);
        }

        // Pasar los datos de paginación a la plantilla
        const pagination = {
            page: productsData.page,
            totalPages: productsData.totalPages,
            hasPrevPage: productsData.hasPrevPage,
            hasNextPage: productsData.hasNextPage,
            prevPageUrl: productsData.hasPrevPage ? `/products?page=${productsData.prevPage}` : null,
            nextPageUrl: productsData.hasNextPage ? `/products?page=${productsData.nextPage}` : null,
            pages,
        };

        res.render('products', { products: productsJSON, pagination: pagination });
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error interno del servidor');
    }
});





router.get('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await productDao.getProdId(productId);
        res.render('productDetails', { product });
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).send('Error interno del servidor');
    }
});

export default router;