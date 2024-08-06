import { fakerES as faker } from '@faker-js/faker';

const MockProduct = () => {
    return{
        _id: faker.string.uuid(),  
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        status: 'true',
        category: faker.commerce.department(), 
        stock: faker.number.int({ min: 0, max: 100 }), 
        thumbnail: faker.image.url() 

    };
};

export const MockProducts = (count =100) => {
    return Array.from({ length: count}, MockProduct)
}