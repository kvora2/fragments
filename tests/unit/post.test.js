// tests/unit/get.test.js
// const logger = require('../../src/logger');

const request = require('supertest');
const hash = require('../../src/hash');

const app = require('../../src/app');
// const logger = require('../../src/logger');

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
    expect(res.body.fragment.ownerId).toEqual(hash('user1@email.com'));
    expect(res.body.fragment.type).toEqual('text/plain');
    expect(res.body.fragment.created).toBeDefined();
    expect(res.body.fragment.updated).toBeDefined();
    expect(res.body.fragment.size).toEqual(Buffer.byteLength('Some data String'));
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

  // expecting 201 with posting JSON data since its supported
  test('expecting 201 with JSON data since it is supported fragment data', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .send({ data: 'Some json data' });
    expect(res.statusCode).toBe(201);
    expect(res.body.fragment.type).toEqual('application/json');
  });

  // Sending unsupported content type (text/msword)
  test('expecting 415 err code since the fragment is of unsupported type', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .send('Invalid type data')
      .set('content-type', 'application/msword');
    expect(res.statusCode).toBe(415);
    expect(res.body.error.message).toEqual('Unsupported content type');
  });

  // Sending unsupported content type (text/msword)
  // test('expecting 415 err code since the fragment is of unsupported type', async () => {
  //   const res = await request(app)
  //     .post('/v1/fragments')
  //     .auth('user2@email.com', 'password2')
  //     .set('content-type', 'text/plain');
  //   expect(res.statusCode).toBe(400);
  //   expect(res.body.error.message).toEqual('Invalid request Body');
  // });
});
