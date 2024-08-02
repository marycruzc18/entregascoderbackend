import express from 'express';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/products.controller.js'
import { uploader } from '../middlewares/multer.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js'



const router = express.Router();

// Obtener todos los productos
router.get('/', getAllProducts);

// Obtener un producto por su ID
router.get('/:pid', getProductById);

// Crear un nuevo producto
router.post('/', uploader.single('thumbnail'), authenticate, authorize(['admin']), createProduct);


// Actualizar un producto existente
router.put('/:pid', uploader.single('thumbnail'), authenticate, authorize(['admin']), updateProduct);


// Eliminar un producto
router.delete('/:pid', authenticate, authorize(['admin']), deleteProduct);



export default router;
