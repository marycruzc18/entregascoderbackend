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

export const createProduct = async (data, file,user) => {
    const {title,description, code, price, status, stock, category} = data;
    const thumbnail = file ? `/images/${file.filename}` : null;

    const owner = user.role === 'premium' ? user.email : 'adminCoder@coder.com';

    const newProduct = new ProductModel({
        title,
        description, 
        code,
        price,
        status,
        stock,
        category,
        thumbnail,
        owner
    });

    return await newProduct.save(); 
};


export const updateProduct = async (productId,data,file,user) => {
    const {title,description, code, price,status,stock,category} = data;
    const existingProduct = await ProductModel.findById(productId);
    if (!existingProduct) {
        throw new Error('Producto no encontrado');
    }


    if (user.role === 'premium' && existingProduct.owner !== user.email) {
        throw new Error('No tienes permiso para actualizar este producto');
    }

    const thumbnail = file ? `/images/${file.filename}` : existingProduct.thumbnail;   
    
    return await ProductModel.findByIdAndUpdate(
        productId,
        {title,description,code,price,status,stock,category,thumbnail},
        {new:true}
    );
};

export const deleteProduct = async (productId, user) => {
    const existingProduct = await ProductModel.findById(productId);
    if (!existingProduct) {
        throw new Error('Producto no encontrado');
    }

    if (user.role !== 'admin' && (user.role === 'premium' && existingProduct.owner !== user.email)) {
        throw new Error('No tienes permiso para eliminar este producto');
    }

    const deletedProduct = await ProductModel.findByIdAndDelete(productId);
    return deletedProduct;

};