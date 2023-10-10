// tests/unit/get.test.js

const request = require('supertest');
// const logger = require('../../src/logger');
const { Fragment } = require('../../src/model/fragment');
const app = require('../../src/app');
const hash = require('../../src/hash');

describe('GET /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with a fragments array
  test('authenticated users get a fragments array', async () => {
    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
  });

  // expecting fragment to be returned after posting
  test('checking contents of user fragments array', async () => {
    await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .send('Some data String')
      .set('Content-Type', 'text/plain');

    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
  });

  test('expecting to get ownerId from array since we are expanding', async () => {
    await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .send('Some other data')
      .set('Content-Type', 'text/plain');

    const res = await request(app)
      .get('/v1/fragments?expand=1')
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragments.length).toBe(2);
    expect(res.body.fragments[1].ownerId).toEqual(hash('user1@email.com'));
    // logger.debug(`testing - ${JSON.stringify(res.body.fragments)}`);
  });

  test('expecting a specific fragment based on ID provided via params', async () => {
    const frag = new Fragment({
      ownerId: 'user2@email.com',
      type: 'text/plain',
    });
    await frag.save();
    const data = Buffer.from('Some Data');
    await frag.setData(data);

    const res = await request(app)
      .get(`/v1/fragments/${frag.id}`)
      .auth('user2@email.com', 'password2');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.data).toEqual('Some Data');
  });
});
