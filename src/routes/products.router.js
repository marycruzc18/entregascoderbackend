import {Router} from "express";
const router = Router();


import ProductManager from "../manager/ProductManager.js";
const productManager = new ProductManager("./src/data/productos.json")

router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit); // Obtener el parámetro de consulta 'limit' y convertirlo a entero

        // Obtener todos los productos
        let products = await productManager.getProducts();

        // Si se recibe un límite, solo devuelve el número de productos solicitados
        if (!isNaN(limit)) {
            products = products.slice(0, limit);
        }

        // Devolver los productos
        res.json(products);
    } catch (error) {
        console.error("Error al obtener productos:", error.message);
        res.status(500).json({ error: "Error al obtener productos" });
    }
});



router.get('/:pid', async (req, res) => {
    const productId = req.params.pid;
    try {
        // Llama a getProductById 
        const product = await productManager.getProductById(productId);
     
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


router.post("/", async (req,res) => {
    try{
        // Extrae los campos del cuerpo de la solicitud
        const { title, description, code, price, status, stock, category, thumbnail } = req.body;

        // Llama al addProduct para agregar un nuevo producto
        const product = await productManager.addProduct(title, description, code, price, status, stock, category, thumbnail);
        res.status(201).json(product)
    }catch(error) {
        res.status(500).json({ error: "Error al guardar el producto" });

    }
})

router.put('/:pid', async (req, res) => {
    const productId = req.params.pid;
    try {
        // Llama a updateProduct
        const productUpd = await productManager.updateProduct(productId, req.body);
        if (!productUpd) {
            return res.status(404).json({ error: "Error al actualizar el producto" });
        }
        res.status(200).json(productUpd);
    } catch (error) {
        console.error("Error al actualizar el producto:", error.message);
        res.status(500).json({ error: "Error interno del servidor al actualizar el producto" });
    }
})

router.delete ('/:pid', async (req, res) => {
    const productId = req.params.pid;
    try {
        // Llama a deleteProduct
        await productManager.deleteProduct(productId);
        res.status(200).json({ msg: `Producto con ID ${productId} eliminado correctamente` });
    } catch (error) {
        console.error("Error al eliminar el producto:", error.message);
        res.status(500).json({ error: error.message });
    }
})



export default router;