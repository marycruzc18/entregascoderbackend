import fs from "fs";

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async addProduct(title, description, code, price, status, stock, category, thumbnail) {
        try {
            // Validar que los campos sean obligatorios a excepción de thumbnail
            if (!title || !description || !code || !price || !status || !stock || !category ) {
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
                code,
                price,
                status:'true',
                stock,
                category,
                thumbnail
            };
    
            // Agregar el nuevo producto a la lista de productos existentes
            productsData.push(newProduct);
    
            // Guardar los productos actualizados en el archivo 
            await fs.promises.writeFile(this.path, JSON.stringify(productsData, null, 2));
            console.log("Producto agregado correctamente");
            return newProduct;
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
            return 1; 
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
        const products = await this.getProducts();

        // Convertir el ID a un número entero
        const productIdInt = parseInt(productId)

        //Buscar el producto por ID 
        const index = products.findIndex(product => product.id === productIdInt);
        if(index === -1){
            throw new Error (`No se encontró ningún producto con el ID ${productId}.`);
        }

        //Actualizar el producto 
        products[index] = { ...products[index], ...updateFields };

        //Guardar los productos actualizados 
        await fs.promises.writeFile(this.path, JSON.stringify(products,null, 2));
        console.log("Producto actualizado correctamente")

        // Obtener el producto actualizado
        const updatedProduct = products[index];

        // Devolver los datos actualizados del producto
        return updatedProduct;


    }catch(error){
        console.error("Error al actualizar el producto:", error.message);
    }

  }

  async deleteProduct(productId){
    try {
        // Obtener todos los productos 
        let products = await this.getProducts();

         // Convertir el ID a un número entero
         const productIdInt = parseInt(productId)

        // Encontrar el índice del producto con el ID especificado
        const index = products.findIndex(product => product.id === productIdInt);

        // Verificar si se encontró el producto
        if (index === -1) {
            console.log(`No se encontró ningún producto con el ID ${productId}`);
            return;
        }

        // Eliminar el producto del array de productos
        products.splice(index, 1);

        // Guardar productos actualizados 
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
        console.log(`Producto con ID ${productId} eliminado correctamente`);
    } catch(error) {
        console.error("Error al eliminar el producto:", error.message);
        throw error;
    }
}
}

export default ProductManager;