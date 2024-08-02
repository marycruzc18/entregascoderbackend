import {
    getAllProducts as getAllProductsService,
    getProductById as getProductByIdService,
    createProduct as createProductService,
    updateProduct as updateProductService,
    deleteProduct as deleteProductService
} from '../services/products.service.js'



export const getAllProducts = async (req, res) => {
    try {
        const response = await getAllProductsService(req.query);
        res.json(response);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export const getProductById = async (req, res) => {
    const productId = req.params.pid;
    try {
        const product = await getProductByIdService(productId);
        if (!product) {
            res.status(404).json({ msg: 'Producto no encontrado' });
        } else {
            res.status(200).json(product);
        }
    } catch (error) {
        console.error('Error al obtener el producto por ID:', error.message);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
};



export const createProduct = async (req, res) => {
    try {
        const savedProduct = await createProductService(req.body, req.file);
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error('Error al crear el producto:', error.message);
        res.status(500).json({ error: 'Error al crear el producto' });
    }
};



export const updateProduct = async (req, res) => {
    const productId = req.params.pid;
    try {
        const updatedProduct = await updateProductService(productId, req.body, req.file);
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error al actualizar el producto:', error.message);
        if (error.message === 'Producto no encontrado') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Error interno del servidor al actualizar el producto' });
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
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Error al eliminar el producto' });
        }
    }
};