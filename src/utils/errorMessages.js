export const ErrorMessage = {
    REQUIRED_FIELDS:{
        status:400,
        message:'Los siguientes campos son requeridos: ',
    }, 

    INVALID_PRODUCT_DATA: {
        status: 400,
        message: 'Los datos del producto son inválidos.',
    },

    CART_ITEM_ALREADY_EXISTS: {
        status: 400,
        message: 'El artículo ya existe en el carrito.',
    },

    PRODUCT_NOT_FOUND: {
        status: 404,
        message: 'Producto no encontrado',
    },

    CART_ITEM_NOT_FOUND: {
        status: 404,
        message: 'Artículo del carrito no encontrado.',
    },

    INTERNAL_SERVER_ERROR: {
        status: 500,
        message: 'Error interno del servidor',
    },


    

}