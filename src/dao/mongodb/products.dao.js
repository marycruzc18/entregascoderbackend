import { ProductModel } from "./models/products.model.js";

export default class ProductDao {
    async getProducts() {
        try {
            const products = await ProductModel.find({});
            return products;
        } catch (error) {
            throw new Error(`Error al obtener todos los productos: ${error.message}`);
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