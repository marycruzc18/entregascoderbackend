import fs from "fs";

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
        try {
            // Validar que los campos sean obligatorios 
            if (!title || !description || !price || !thumbnail || !code || !stock) {
                throw new Error("Todos los campos son obligatorios");
            }
    
         
            let productsData = await this.getProducts();
    
            // Validar que no se repita el código 
            const codeExist = productsData.some(product => product.code === code);
            if (codeExist) {
                throw new Error(`Ya existe un producto con el código ${code}.`);
            }
    
            const newProduct = {
                id: await this.getProdId(), 
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            };
    
            // Agregar el nuevo producto a la lista de productos existentes
            productsData.push(newProduct);
    
            // Guardar los productos actualizados en el archivo 
            await fs.promises.writeFile(this.path, JSON.stringify(productsData, null, 2));
            console.log("Producto agregado correctamente");
        } catch (error) {
            console.error("Error al agregar producto:", error.message);
        }
    }
    
    

    async getProdId() {
        try {
            
            const products = await this.getProducts();

            // Encontrar el ID más alto
            let prodId = 0;
            products.forEach(product => {
                if (product.id > prodId) prodId = product.id;
            });

            return prodId + 1; // Incrementar el ID más alto encontrado
        } catch (error) {
            console.error("Error al obtener el último ID de producto:", error);
            return 1; // Si hay un error, devolver 1 como ID predeterminado
        }
    }

    async getProducts() {
        try {
            const products = await fs.promises.readFile(this.path, "utf8");
            return JSON.parse(products);
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log('El archivo no existe. Creando uno nuevo.');
                return [];
            } else {
                throw error; 
            }
        }
    }
    
    async getProductById(id) {

        try {
            // Obtener la lista de productos existentes
            const products = await this.getProducts();

            // Convertir el ID a un número entero
            const productId = parseInt(id); 

            // Buscar el producto por ID
            const product = products.find(product => product.id === productId);

            if (product) {
                return product;
            } else {
                throw new Error(`No se encontró ningún producto con el ID ${id}.`);
            }
        } catch (error) {
            console.error("Error al obtener el producto por ID:", error.message);
        }
    }

  async updateProduct(productId, updateFields){
    try{
        //Obtener todos los productos 
        let products = await this.getProducts();

        //Buscar el producto por ID 
        const index = products.findIndex(product => product.id === productId);
        if(index === -1){
            throw new Error (`No se encontró ningún producto con el ID ${productId}.`);
        }

        //Actualizar el producto 
        products[index] = { ...products[index], ...updateFields };

        //Guardar los productos actualizados 
        await fs.promises.writeFile(this.path, JSON.stringify(products,null, 2));
        console.log("Producto actualizado correctamente")
    }catch(error){
        console.error("Error al actualizar el producto:", error.message);
    }

  }

  async deleteProduct(productId){
    try{
        //Obtener todos los productos 
        let products = await this.getProducts();

        //Se filtran los productos se elimina el que tenga el ID  especifico
        products = products.filter(product => product.id !== productId);

        //Guardar productos actualizados 
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
        console.log(`Producto con ID ${productId} eliminado correctamente`);   
    }catch(error){
        console.error("Error al eliminar el producto:", error.message);
    }
}
    
}

// Ejemplo de uso
//const manager = new ProductManager("./products.json");


   // const test = async () => {
       /// try {
       // Agregar productos
         //   await manager.addProduct("Zarcillos", "Zarcillo Estrella", 10200, "imagen_zarcillo", "001", 100);
          //  await manager.addProduct("Pulseras", "Pulsera de Plata", 20000, "imagen_pulsera", "002", 50);
          //  await manager.addProduct("Cinturón", "Cinturón negro", 15000, "imagen_cinturon", "003", 75);
          //  await manager.addProduct("Cartera", "Cartera grande", 35000, "imagen_cartera", "004", 20);
          //  await manager.addProduct("Collar", "Collar", 10000, "imagen_collar", "005", 25);
          //  await manager.addProduct("Lentes", "Lentes", 17000, "imagen_lentes", "006", 15);
           // await manager.addProduct("Reloj", "Reloj", 15000, "imagen_reloj", "007", 5);
    
           

     //   } catch (error) {
         //   console.error("Error:", error);
    //    }

 //    ;
       

 //   };

//test();

export default ProductManager;