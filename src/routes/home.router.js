import {Router} from "express";
const router = Router();


import ProductManager from "../dao/filesystem/ProductManager.js";
const productManager = new ProductManager("./src/data/productos.json")



//Renderizar home.handlebars

router.get('/', async (req,res) => {
    const products= await productManager.getProducts();
    res.render('home',{products})
})


export default router;