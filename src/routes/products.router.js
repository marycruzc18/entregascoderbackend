import express from 'express';
import { ProductModel } from '../dao/mongodb/models/products.model.js';

const router = express.Router();

// Obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const products = await ProductModel.find();
        res.json(products);
    } catch (error) {
        console.error("Error al obtener productos:", error.message);
        res.status(500).json({ error: "Error al obtener productos" });
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
router.post('/', async (req, res) => {
    try {
        const newProduct = new ProductModel(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error("Error al crear el producto:", error.message);
        res.status(500).json({ error: "Error al crear el producto" });
    }
});

// Actualizar un producto existente
router.put('/:pid', async (req, res) => {
    const productId = req.params.pid;
    try {
        const updatedProduct = await ProductModel.findByIdAndUpdate(productId, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ error: "Error al actualizar el producto" });
        }
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
