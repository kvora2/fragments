// tests/unit/get.test.js
// const logger = require('../../src/logger');

const request = require('supertest');
const hash = require('../../src/hash');

const app = require('../../src/app');
describe('POST /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with a fragments array
  test('authenticated users get a fragments array', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .send('Some data String')
      .set('Content-Type', 'text/plain');
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragments.ownerId).toEqual(hash('user1@email.com'));
    expect(res.body.fragments.type).toEqual('text/plain');
    expect(res.body.fragments.created).toBeDefined();
    expect(res.body.fragments.updated).toBeDefined();
    expect(res.body.fragments.size).toEqual(Buffer.byteLength('Some data String'));
  });

  //checking response to have location URL of fragment as well
  test('expecting location URL in response header', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .send('Some data String')
      .set('Content-Type', 'text/plain');
    expect(res.statusCode).toBe(201);
    expect(res.headers).toHaveProperty('location');
  });

  // Sending unsupported content type
  test('providing unsupported content-type and expecting error 400', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .send({ data: 'Some json data' });
    expect(res.statusCode).toBe(400);
  });

  // TODO: we'll need to add tests to check the contents of the fragments array later
});
