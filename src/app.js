import express from "express";
import ProductManager from "./manager/ProductManager.js";

const productManager = new ProductManager('./products.json');


const app = express();

app.use(express.json());

app.get('/products', async (req, res) => {
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



app.get('/products/:pid', async (req, res) => {
    const productId = req.params.pid;
    try {
        // Llama a getProductById 
        const product = await productManager.getProductById(productId);
     
        if (!product) {
            res.status(404).json({ msg: "Producto no encontrado" });
        } else {
            res.status(200).json(product); // Aquí se cambió de products a product
        }
    } catch (error) {
        console.error("Error al obtener el producto por ID:", error.message);
        res.status(500).json({ error: "Error al obtener el producto" });
    }
});


const PORT = 8080

app.listen(PORT, ()  => console.log(`Servidor ok en puerto ${PORT}`))