import { ProductModel } from "./models/products.model.js";

export default class ProductDao {
    async getProducts( page = 1, limit = 10, sort, category ) {
        try {

            
            const filter = category ? { category: category } : {};

            

       const options = {
                page: parseInt(page),
                limit: parseInt(limit),
                sort: sort ? { price: sort === 'asc' ? 1 : -1 } : null
            };

            
            const products = await ProductModel.paginate(filter, options);

            
            const response = {
                status: 'success',
                payload: products.docs,
                totalPages: products.totalPages,
                prevPage: products.prevPage || null,
                nextPage: products.nextPage || null,
                page: products.page,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevLink: products.hasPrevPage ? `/products?page=${products.prevPage}` : null,
                nextLink: products.hasNextPage ? `/products?page=${products.nextPage}` : null
            };

            return response;
        } catch (error) {
            throw new Error(`Error al obtener los productos: ${error.message}`);
        }
    }


    async getProdId(productId) {
        try {
            const product = await ProductModel.findById(productId);
            if (!product) {
                throw new Error("Producto no encontrado");
            }
            return product;
        } catch (error) {
            throw new Error(`Error al obtener el producto por ID: ${error.message}`);
        }
    }

    async addProduct(productData) {
        try {
            const product = new ProductModel(productData);
            const savedProduct = await product.save();
            return savedProduct;
        } catch (error) {
            throw new Error(`Error al crear el producto: ${error.message}`);
        }
    }

    async updateProduct(productId, updatedProductData) {
        try {
            const updatedProduct = await ProductModel.findByIdAndUpdate(productId, updatedProductData, { new: true });
            if (!updatedProduct) {
                throw new Error("Producto no encontrado");
            }
            return updatedProduct;
        } catch (error) {
            throw new Error(`Error al actualizar el producto: ${error.message}`);
        }
    }

    async deleteProduct(productId) {
        try {
            const deletedProduct = await ProductModel.findByIdAndDelete(productId);
            if (!deletedProduct) {
                throw new Error("Producto no encontrado");
            }
            return deletedProduct;
        } catch (error) {
            throw new Error(`Error al eliminar el producto: ${error.message}`);
        }
    }
}