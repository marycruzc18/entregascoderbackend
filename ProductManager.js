class ProductManager{
    constructor (){
        this.products = [];
    }


addProduct(title,description, price, thumbnail, code, stock){
//Validar que los campos sean obligatorios 
    if(!title || !description || !price || !thumbnail || !code || !stock ){
        console.log("Todos los campos son obligatorios");
        return;
    }
//Validar que no se repita code 
    const codeExist = this.products.some(product => product.code === code);
        if(codeExist){
            console.log(`Ya existe un producto con el código ${code}.`)
            return;
        }


    const product ={
        id: this.getProdId()+1,
        title,
        description,
        price,
        thumbnail,
        code,
        stock
    };

    this.products.push(product);
    

}

getProdId() {
    let prodId = 0;
    this.products.forEach(product => {
        if (product.id > prodId) prodId = product.id;
    });
    return prodId;
}

getProducts(){
    return this.products;
}

getProductById(id) {
    const product = this.products.find(product => product.id === id);
    if (product) {
        return product;
    } else {
        console.log("Producto no encontrado");
    }
}

}

// Ejemplo de uso
const manager = new ProductManager();

// Agregar productos
manager.addProduct("Zarcillos", "Zarcillo Estrella", 10200, "imagen_zarcillo", "001", 100);
manager.addProduct("Pulseras", "Pulsera de Plata", 20000, "imagen_pulsera", "002", 50);
manager.addProduct("Cinturón", "Cinturón negro", 15000, "imagen_cinturon", "003", 75);


// Obtener todos los productos
console.log("Todos los productos:");
console.log(manager.getProducts());

// Obtener un producto por ID
console.log("Producto con ID 2:");
console.log(manager.getProductById(2)); // Debería mostrar el producto con ID 2

// Intentar obtener un producto con un ID que no existe
console.log("Producto con ID 4:");
console.log(manager.getProductById(4)); // Debería mostrar "Error: Producto no encontrado"