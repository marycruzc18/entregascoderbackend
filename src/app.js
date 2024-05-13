import express from "express";
import handlebars from "express-handlebars";
import { __dirname } from "./utils.js";
import { Server } from "socket.io";
import productsRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';
import homeRouter from './routes/home.router.js';
import realRouter from './routes/realTimeProducts.router.js';
import ProductManager from "./manager/ProductManager.js";
const productManager = new ProductManager(`${__dirname}/data/productos.json`);


const app = express();

app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views")

app.use('/api/products', productsRouter)
app.use('/api/carts', cartRouter)
app.use('/vista/home', homeRouter)
app.use('/realtimeproducts', realRouter)




const httpServer = app.listen(8080, () => {
    console.log("Escuchando al puerto 8080");
  });

  const socketServer = new Server(httpServer);

  socketServer.on('connection', async (socket)=>{
    console.log(`🟢 Usuario conectado: ${socket.id}`);


 // Enviar datos de productos al cliente cuando se conecta
    const products = await productManager.getProducts();
    socket.emit('initialProducts', products);

    // Maneja eventos de creación y eliminación de productos
    socket.on('createProduct', async (product) => {
        try {
            
            await productManager.addProduct(product);
            // Obtiene la lista actualizada de productos
            const updatedProducts = await productManager.getProducts();
            // Emitir los productos actualizados a todos los clientes conectados
            socketServer.emit('updatedProducts', updatedProducts);
        } catch (error) {
            console.error("Error al crear el producto:", error.message);
        }
    });

    socket.on('deleteProduct', async (productId) => {
        try {
            
            await productManager.deleteProduct(productId);
            // Obtiene la lista actualizada de productos
            const updatedProducts = await productManager.getProducts();
            // Emitir los productos actualizados a todos los clientes conectados
            socketServer.emit('updatedProducts', updatedProducts);
        } catch (error) {
            console.error("Error al eliminar el producto:", error.message);
        }
    });

    socket.on('disconnect', ()=>{
        console.log('🔴 Usuario desconectado');
      })

      
}); 



   
  
    

