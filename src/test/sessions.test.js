import { expect } from "chai";
import request from "supertest";
import app from "../app.js"; 
import config from "../config.js";

    describe('API Sessions', () => {
        let agent = request.agent(app); 
        let token;

    before(async () => {
        
        const res = await agent
            .post('/login')
            .send({ email: config.USER_EMAIL, password: config.PASS_USER })
            .expect(302) 
            .expect('Location', '/products'); 

        
        token = res.headers['set-cookie'][0].split(';')[0].split('=')[1];
    });

    it('Debe iniciar sesión correctamente', async () => {
        await agent
            .post('/login')
            .send({ email: config.USER_EMAIL, password: config.PASS_USER })
            .expect(302) 
            .expect('Location', '/products'); 
    });
    

    it('Debe obtener la sesión actual', async () => {
        const res = await agent
            .get('/api/sessions/current')
            .set('Cookie', `jwt=${token}`); 
        expect(res.statusCode).to.equal(200);
        expect(res.body.user).to.have.property('email');
    });
    
    
    it('Debe cerrar sesión correctamente', async () => {
        await agent
            .post('/logout')
            .expect(302) 
            .expect('Location', '/login'); 
    });
    
    

    
});
