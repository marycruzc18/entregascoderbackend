import {expect} from "chai";
import request from "supertest";
import app from "../app.js";
import config from "../config.js";

        describe('API Cart', () => {
            let token;
            let cartId = '66aa7b7d443fbd5880024b03'
           

        before(async () => {
            const res = await request(app)
                .post('/login')
                .send({ email: config.USER_EMAIL, password: config.PASS_USER });
    
            token = res.headers['set-cookie'].find(cookie => cookie.startsWith('jwt=')).split(';')[0].split('=')[1];
        });
    
        it('Debe obtener todos los carritos', async () => {
            const res = await request(app)
                .get('/api/carts')
                .set('Cookie', `jwt=${token}`);
        
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array'); 
        });
    
        it('Debe obtener un carrito por ID', async () => {
            const res = await request(app)
                .get(`/api/carts/${cartId}`)
                .set('Cookie', `jwt=${token}`);
        
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('_id').that.equals(cartId);
        });

        it('Debe verificar que el carrito existe', async () => {
            const res = await request(app)
                .get(`/api/carts/${cartId}`)
                .set('Cookie', `jwt=${token}`)
            
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('_id').that.equals(cartId);
        });
    
    })