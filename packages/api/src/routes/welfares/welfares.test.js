import request from 'supertest';
import app from '../../app';

describe('Welfares API', () => {
  describe('GET /welfares', () => {
    test('It should respond with 200 success', async () => {
      const response = await request(app)
        .get('/api/welfares')
        .expect('Content-Type', /json/)
        .expect(200);
    });
  });
});
