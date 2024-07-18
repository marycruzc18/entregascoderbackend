import express from 'express';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/products.controller.js'
import { uploader } from '../middlewares/multer.js';




const router = express.Router();

// Obtener todos los productos
router.get('/', getAllProducts);

// Obtener un producto por su ID
router.get('/:pid', getProductById);

// Crear un nuevo producto
router.post('/', uploader.single('thumbnail'), createProduct);


// Actualizar un producto existente
router.put('/:pid', uploader.single('thumbnail'), updateProduct);


// Eliminar un producto
router.delete('/:pid', deleteProduct);



export default router;
