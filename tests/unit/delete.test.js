// tests/unit/get.test.js
// const logger = require('../../src/logger');

const request = require('supertest');

const app = require('../../src/app');

describe('POST /v1/fragments', () => {
  test('DELETE /v1/fragments delete fragment testing', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .send('Some data String')
      .set('Content-Type', 'text/plain');
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');

    const resDel = await request(app)
      .delete(`/v1/fragments/${res.body.fragment.id}`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain');

    expect(resDel.statusCode).toBe(200);
    expect(resDel.body.status).toBe('ok');
  });

  test('DELETE /v1/fragments delete non-exiting fragment', async () => {
    const resDel = await request(app)
      .delete(`/v1/fragments/${6969}`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain');

    expect(resDel.statusCode).toBe(404);
    expect(resDel.body.status).toBe('error');
  });
});
