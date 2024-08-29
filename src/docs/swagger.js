export const setSwagger = {
    definition: {
        openapi: '3.0.0',   
        info: {
            title: 'API Ecommerce',
            version: '1.0.0',
            description: 'Documentación de los modulos de productos y carrito'
        },
        servers: [  
            {
                url: 'http://localhost:8080'
            }
        ]
    },
    apis: ['./src/docs/*.yml']
}