import ProductDao from "../dao/mongodb/products.dao.js";
import { ProductModel } from "../dao/mongodb/models/products.model.js";

const productDao = new ProductDao();

export const getAllProducts = async (query) => {
    const {page,limit,sort,category} = query;
    return await productDao.getProducts(page,limit,sort,category);       
};

export const getProductById = async (productId) => {
    return await ProductModel.findById(productId)
};

export const createProduct = async (data, file) => {
    const {title,description, code, price, status, stock, category} = data;
    const thumbnail = file ? `/images/${file.filename}` : null;

    const newProduct = new ProductModel({
        title,
        description, 
        code,
        price,
        status,
        stock,
        category,
        thumbnail
    });

    return await newProduct.save(); 
};


export const updateProduct = async (productId,data,file) => {
    const {title,description, code, price,status,stock,category} = data;
    const existingProduct = await ProductModel.findById(productId);
    if (!existingProduct) {
        throw new Error('Producto no encontrado');
    }

    const thumbnail = file ? `/images/${file.filename}` : existingProduct.thumbnail;   
    
    return await ProductModel.findByIdAndUpdate(
        productId,
        {title,description,code,price,status,stock,category,thumbnail},
        {new:true}
    );
};

export const deleteProduct = async (productId) => {
    const deletedProduct = await ProductModel.findByIdAndDelete(productId);
    if (!deletedProduct) {
        throw new Error('Producto no encontrado');
    }
    return deletedProduct;
}