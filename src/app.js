import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import handlebars from "express-handlebars";
import { __dirname } from "./utils.js";
import {initMongoDB} from './dao/mongodb/connection.js';
import { Server } from "socket.io";
import productsRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';
import homeRouter from './routes/home.router.js';
import realRouter from './routes/realTimeProducts.router.js';
import chatRouter from './routes/chat.router.js';
import cartviewRouter from './routes/cart.views.router.js';
import productsviewRouter from './routes/products.views.js';
import usersRouter from './routes/users.routes.js';
import usersviewRouter from './routes/users.views.router.js';
import ProductManager from "./dao/filesystem/ProductManager.js";
const productManager = new ProductManager(`${__dirname}/data/productos.json`);
import MessageDao from './dao/mongodb/messages.dao.js';
import passport from 'passport';
import "./passport/passport.js";
import "./passport/github_strategy.js";


import morgan from 'morgan';



const storeConfig = {
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        crypto: { secret: process.env.SECRET_KEY },
        ttl: 180,
    }),
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 180000 }
};



const app = express();





app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session(storeConfig));
app.use(morgan('dev'));

app.use(passport.initialize());
app.use(passport.session());

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views")
app.use('/api/products', productsRouter)
app.use('/api/carts', cartRouter)
app.use('/vista/home', homeRouter)
app.use('/realtimeproducts', realRouter)
app.use('/chat', chatRouter)
app.use('/products', productsviewRouter)
app.use('/cart', cartviewRouter)
app.use('/', usersRouter)
app.use('/', usersviewRouter)

initMongoDB()

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

    // Manejar el evento de nuevo usuario
    socket.on('newUser', (username) => {
        console.log(`${username} se ha conectado al chat`);
        socket.broadcast.emit('newUser', username);
    });

    socket.on('chat:message', async (msg) => {
        try {
            const messageDao = new MessageDao();
            
            if (!msg.user) {
                throw new Error('El campo user es requerido');
            }
            await messageDao.saveMessage(msg);
            socketServer.emit('messages', await messageDao.getAll());
        } catch (error) {
            console.error('Error al guardar el mensaje:', error.message);
        }
    });
    

    // Manejar el evento de escribir un mensaje
    socket.on('chat:typing', (data) => {
        socket.broadcast.emit('chat:typing', data);
    });
    

    socket.on('disconnect', ()=>{
        console.log('🔴 Usuario desconectado');
      })

      
}); 



 
  
    

