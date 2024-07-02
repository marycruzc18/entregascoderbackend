import express from 'express';
import ProductDao from '../dao/mongodb/products.dao.js';
import CartDao from '../dao/mongodb/carts.dao.js';
import { authenticateJWT } from '../middlewares/validateLogin.js';

const router = express.Router();
const productDao = new ProductDao();
const cartDao = new CartDao();



router.get('/products', authenticateJWT, async (req, res) => {
   
    try {
        const { page = 1, limit = 10, sort, category } = req.query;
        const productsData = await productDao.getProducts(page, limit, sort, category);

        const products = productsData.payload.map(product => product.toJSON());

        const pages = [];
        for (let i = 1; i <= productsData.totalPages; i++) {
            const pageItem = {
                number: i,
                numberPgBar: i,
                url: `/products?page=${i}`,
            };
            pages.push(pageItem);
        }

        const pagination = {
            page: productsData.page,
            totalPages: productsData.totalPages,
            hasPrevPage: productsData.hasPrevPage,
            hasNextPage: productsData.hasNextPage,
            prevPageUrl: productsData.hasPrevPage ? `/products?page=${productsData.prevPage}` : null,
            nextPageUrl: productsData.hasNextPage ? `/products?page=${productsData.nextPage}` : null,
            pages,
        };

        const user = req.user;
        res.render('products', { user, products, pagination: pagination});
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