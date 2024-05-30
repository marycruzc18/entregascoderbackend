const socket = io();

// Escuchar el evento de productos iniciales
socket.on('initialProducts', (products) => {
    updateProductList(products);
});

// Escuchar eventos de productos actualizados
socket.on('updatedProducts', (products) => {
    updateProductList(products);
});


function updateProductList(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; 
    products.forEach(product => {
        const listItem = document.createElement('li');
       
        const idElement = document.createElement('p');
        idElement.innerHTML = `<strong>ID:</strong> ${product.id}`;
        
        const descriptionElement = document.createElement('p');
        descriptionElement.innerHTML = `<strong>Descripción:</strong> ${product.description}`;
        
        const codeElement = document.createElement('p');
        codeElement.innerHTML = `<strong>Código:</strong> ${product.code}`;
        
        const priceElement = document.createElement('p');
        priceElement.innerHTML = `<strong>Precio:</strong> ${product.price}`;
        
        const statusElement = document.createElement('p');
        statusElement.innerHTML = `<strong>Estado:</strong> ${product.status}`;
        
        const stockElement = document.createElement('p');
        stockElement.innerHTML = `<strong>Stock:</strong> ${product.stock}`;
        
        const categoryElement = document.createElement('p');
        categoryElement.innerHTML = `<strong>Categoría:</strong> ${product.category}`;
        
        const thumbnailElement = document.createElement('p');
        thumbnailElement.innerHTML = `<strong>Thumbnail:</strong> ${product.thumbnail}`;

        // Agregar los elementos al listItem
        listItem.appendChild(idElement);
        listItem.appendChild(descriptionElement);
        listItem.appendChild(codeElement);
        listItem.appendChild(priceElement);
        listItem.appendChild(statusElement);
        listItem.appendChild(stockElement);
        listItem.appendChild(categoryElement);
        listItem.appendChild(thumbnailElement);

        // Agregar el listItem al productList
        productList.appendChild(listItem);
    });
}