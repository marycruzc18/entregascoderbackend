import ProductDao from '../dao/mongodb/products.dao.js';



const productDao = new ProductDao();


export const getAllProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, sort, category } = req.query;
        const productsData = await productDao.getProducts(page, limit, sort, category);
        const products = productsData.payload.map(product => product.toJSON());

        // Lógica de paginación
        const pages = [];
        for (let i = 1; i <= productsData.totalPages; i++) {
            pages.push({ number: i, url: `/products?page=${i}` });
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
        
        console.log('User Cart ID:', user.cart);
        const userCartId = user.cart ? user.cart.toString() : null;
        res.render('products', { user:{ ...user, cart: userCartId }, products, pagination });
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error interno del servidor');
    }
};

export const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await productDao.getProdId(productId);
        res.render('productDetails', { product });
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).send('Error interno del servidor');
    }
};
