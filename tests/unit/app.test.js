// tests/unit/app.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('Route checking', () => {
  // If the route is not defined in out application, it should be not found (404)
  test('non-existing route', async () => {
    const res = await request(app).get('/SomeRoute');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.error.message).toBe('not found');
  });
});
