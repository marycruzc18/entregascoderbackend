import express from 'express';
import { ProductModel } from '../dao/mongodb/models/products.model.js';
import ProductDao from '../dao/mongodb/products.dao.js';
import { uploader } from '../middlewares/multer.js';

const productDao = new ProductDao();

const router = express.Router();

// Obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const { page, limit, sort, category } = req.query;
        const response = await productDao.getProducts( page, limit, sort, category );
        res.json(response);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Obtener un producto por su ID
router.get('/:pid', async (req, res) => {
    const productId = req.params.pid;
    try {
        const product = await ProductModel.findById(productId);
        if (!product) {
            res.status(404).json({ msg: "Producto no encontrado" });
        } else {
            res.status(200).json(product);
        }
    } catch (error) {
        console.error("Error al obtener el producto por ID:", error.message);
        res.status(500).json({ error: "Error al obtener el producto" });
    }
});

// Crear un nuevo producto
router.post('/', uploader.single('thumbnail'), async (req, res) => {
    try {
        const { title, description, code, price, status, stock, category } = req.body;
        const thumbnail = req.file ? `/images/${req.file.filename}` : null; 

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

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error("Error al crear el producto:", error.message);
        res.status(500).json({ error: "Error al crear el producto" });
    }
});


// Actualizar un producto existente
router.put('/:pid', uploader.single('thumbnail'), async (req, res) => {
    const productId = req.params.pid;
    const { title, description, code, price, status, stock, category } = req.body;
    
    try {
        const existingProduct = await ProductModel.findById(productId);
        if (!existingProduct) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        // Si se ha subido una nueva imagen, actualiza la ruta
        const thumbnail = req.file ? `/images/${req.file.filename}` : existingProduct.thumbnail;

        const updatedProduct = await ProductModel.findByIdAndUpdate(
            productId,
            {
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
                thumbnail
            },
            { new: true }
        );

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error("Error al actualizar el producto:", error.message);
        res.status(500).json({ error: "Error interno del servidor al actualizar el producto" });
    }
});


// Eliminar un producto
router.delete('/:pid', async (req, res) => {
    const productId = req.params.pid;
    try {
        const deletedProduct = await ProductModel.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.status(200).json({ msg: `Producto con ID ${productId} eliminado correctamente` });
    } catch (error) {
        console.error("Error al eliminar el producto:", error.message);
        res.status(500).json({ error: "Error al eliminar el producto" });
    }
});



export default router;
