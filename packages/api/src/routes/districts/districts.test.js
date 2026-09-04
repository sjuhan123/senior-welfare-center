import request from 'supertest';
import app from '../../app';

describe('Districts API', () => {
  describe('GET /districts', () => {
    test('It should respond with 200 success', async () => {
      const response = await request(app)
        .get('/api/districts')
        .expect('Content-Type', /json/)
        .expect(200);
    });
  });
});
