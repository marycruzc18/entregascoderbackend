import { expect } from "chai";
import request from "supertest";
import app from '../app.js';
import config from '../config.js';

describe('Products API', () => {
    let token;

    before(async () => {
        const res = await request(app)
            .post('/login')
            .send({ email: config.EMAIL_ADMIN, password: config.PASS_ADMIN });

        token = res.headers['set-cookie'].find(cookie => cookie.startsWith('jwt=')).split(';')[0].split('=')[1];
    });

    it('Se deben obtener todos los productos', async () => {
        const res = await request(app)
            .get('/api/products')
            .set('Cookie', `jwt=${token}`); 

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('status').that.equals('success');
        expect(res.body).to.have.property('payload').that.is.an('array');
        expect(res.body.payload.length).to.be.greaterThan(0);
    });

    it('Se debe crear un nuevo producto', async () => {
        const product = {
            title: 'Test Product',
            description: 'Product  Test Description',
            code: 3024,
            price: 34560,
            status: true,
            stock: 23,
            category: 'Category Product',
            thumbnail: 'img_test.png'
        };

        const res = await request(app)
            .post('/api/products')
            .set('Cookie', `jwt=${token}`) 
            .send(product);

        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('_id');
    });

    it('Actualizar un producto existente', async () => {
        const productId = '66c759aaa512453c20ca18b9'; 
        const updatedProduct = { price: 30000 };

        const res = await request(app)
            .put(`/api/products/${productId}`)
            .set('Cookie', `jwt=${token}`) 
            .send(updatedProduct);

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('price', updatedProduct.price);
    });
});
