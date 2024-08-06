import {
    getAllProducts as getAllProductsService,
    getProductById as getProductByIdService,
    createProduct as createProductService,
    updateProduct as updateProductService,
    deleteProduct as deleteProductService
} from '../services/products.service.js';
import ErrorApp from '../utils/errorApp.js';
import { ErrorMessage } from '../utils/errorMessages.js';



export const getAllProducts = async (req, res) => {
    try {
        const response = await getAllProductsService(req.query);
        res.json(response);
    } catch (error) {
        const appError = new ErrorApp(ErrorMessage.INTERNAL_SERVER_ERROR.message, ErrorMessage.INTERNAL_SERVER_ERROR.status);
        res.status(appError.statusCode).json({ error: appError.message });
    }
};

export const getProductById = async (req, res) => {
    const productId = req.params.pid;
    try {
        const product = await getProductByIdService(productId);
        if (!product) {
            throw new ErrorApp(ErrorMessage.PRODUCT_NOT_FOUND.message, ErrorMessage.PRODUCT_NOT_FOUND.status);
        } else {
            res.status(200).json(product);
        }
    } catch (error) {
        console.error('Error al obtener el producto por ID:', error.message);
        res.status(error.statusCode || 500).json({ error: error.message || ErrorMessage.INTERNAL_SERVER_ERROR.message });
    }
};



export const createProduct = async (req, res) => {
    try {
        const savedProduct = await createProductService(req.body, req.file);
        res.status(201).json(savedProduct);
    } catch (error) {
        if (error.message.includes('requeridos')) {
            throw new ErrorApp(ErrorMessage.REQUIRED_FIELDS.message + error.message.split(': ')[1], ErrorMessage.REQUIRED_FIELDS.status);
        }
        console.error('Error al crear el producto:', error.message);
        const appError = new ErrorApp(ErrorMessage.INVALID_PRODUCT_DATA.message, ErrorMessage.INVALID_PRODUCT_DATA.status);
        res.status(appError.statusCode).json({ error: appError.message });
    }
};



export const updateProduct = async (req, res) => {
    const productId = req.params.pid;
    try {
        const updatedProduct = await updateProductService(productId, req.body, req.file);
        res.status(200).json(updatedProduct);
    }  catch (error) {
        console.error('Error al actualizar el producto:', error.message);
        if (error.message === 'Producto no encontrado') {
            throw new ErrorApp(ErrorMessage.PRODUCT_NOT_FOUND.message, ErrorMessage.PRODUCT_NOT_FOUND.status);
        } else {
            const appError = new ErrorApp(ErrorMessage.INTERNAL_SERVER_ERROR.message, ErrorMessage.INTERNAL_SERVER_ERROR.status);
            res.status(appError.statusCode).json({ error: appError.message });
        }
    }
};

export const deleteProduct = async (req, res) => {
    const productId = req.params.pid;
    try {
        await deleteProductService(productId);
        res.status(200).json({ msg: `Producto con ID ${productId} eliminado correctamente` });
    } catch (error) {
        console.error('Error al eliminar el producto:', error.message);
        if (error.message === 'Producto no encontrado') {
            throw new ErrorApp(ErrorMessage.PRODUCT_NOT_FOUND.message, ErrorMessage.PRODUCT_NOT_FOUND.status);
        } else {
            const appError = new ErrorApp(ErrorMessage.INTERNAL_SERVER_ERROR.message, ErrorMessage.INTERNAL_SERVER_ERROR.status);
            res.status(appError.statusCode).json({ error: appError.message });
        }
    }
};