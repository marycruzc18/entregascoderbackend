import express from 'express';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/products.controller.js'
import { getMockProducts } from '../controllers/mocking.controller.js';
import { productUploader } from '../middlewares/multer.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js'




const router = express.Router();


//Obtener los productos con Mocking
router.get('/mockingproducts', getMockProducts)


// Obtener todos los productos
router.get('/', getAllProducts);


// Obtener un producto por su ID
router.get('/:pid', getProductById);


// Crear un nuevo producto
router.post('/', productUploader.single('thumbnail'), authenticate, authorize(['admin', 'premium']), createProduct);


// Actualizar un producto existente
router.put('/:pid', productUploader.single('thumbnail'), authenticate, authorize(['admin']), updateProduct);

// Eliminar un producto
router.delete('/:pid', authenticate, authorize(['admin', 'premium']), deleteProduct);




export default router;
