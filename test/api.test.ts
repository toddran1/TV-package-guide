import request from 'supertest';
import app from '../src/app';

describe('API Tests', () => {
    it('should return shows for the network', async () => {
        await request(app)
        .get('/shows')
        .set('Accept', 'application/json')
        .send({network: 'NBC'})
        .expect(200)
        .expect((res) => {
            console.log('Response Body:', res.body);
            expect(res.body.length).toBeGreaterThan(0);
            expect(res.body[0]).toHaveProperty('network', 'NBC');
        });
    });

    it('returns package name and price and networks with shows', async () => {

        await request(app)
        .get('/packages/2')
        .set('Accept', 'application/json')
        .expect(200)
        .expect((res) => {
            console.log('Response Body:', res.body);
            expect(res.body.package_name).toBe('Basic');
        });
    });
});