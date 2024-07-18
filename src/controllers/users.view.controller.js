import ProductDao from '../dao/mongodb/products.dao.js';

const productDao = new ProductDao();

export const getLoginPage = (req, res) => {
    res.render('login');
};

export const getRegisterPage = (req, res) => {
    res.render('register');
};

export const getProducts = async (req, res) => {
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
        res.render('products', { user, products, pagination: pagination });
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error interno del servidor');
    }
};
