// tests/unit/get.test.js

const request = require('supertest');
const logger = require('../../src/logger');
// const { Fragment } = require('../../src/model/fragment');
const app = require('../../src/app');
const hash = require('../../src/hash');

describe('PUT /v1/fragments', () => {
  // posting a fragment, checking it, and than updating it to then get updated fragment
  test('expecting to get updated fragment body after updating it', async () => {
    //posting fragment
    const resPost = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .send('some dope data')
      .set('Content-Type', 'text/plain');

    // getting fragment
    const resGet1 = await request(app)
      .get(`/v1/fragments/${resPost.body.fragment.id}`)
      .auth('user1@email.com', 'password1');

    logger.debug(`getting resGet1 - ${JSON.stringify(resGet1)}`);
    expect(resGet1.statusCode).toBe(200);
    expect(resGet1.text).toEqual('some dope data');

    //updating fragment
    const resPut = await request(app)
      .put(`/v1/fragments/${resPost.body.fragment.id}`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('some updated dope data');

    logger.debug(`getting resPut - ${JSON.stringify(resPut)}`);
    expect(resPut.statusCode).toBe(200);
    expect(resPut.body.status).toBe('ok');
    expect(resPut.body.fragment.ownerId).toEqual(hash('user1@email.com'));
    expect(resPut.body.fragment.type).toEqual('text/plain');
    expect(resPut.body.fragment.size).toEqual(Buffer.byteLength('some updated dope data'));
  });

  // posting a fragment, checking it, and than updating it with different content-type
  test('expecting to get 404 since content-type of updated fragment is different than original', async () => {
    //posting fragment
    const resPost = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .send('test frag')
      .set('Content-Type', 'text/plain');

    // getting fragment
    const resGet1 = await request(app)
      .get(`/v1/fragments/${resPost.body.fragment.id}`)
      .auth('user1@email.com', 'password1');

    logger.debug(`getting resGet1 - ${JSON.stringify(resGet1)}`);
    expect(resGet1.statusCode).toBe(200);
    expect(resGet1.text).toEqual('test frag');

    //updating fragment
    const resPut = await request(app)
      .put(`/v1/fragments/${resPost.body.fragment.id}`)
      .auth('user1@email.com', 'password1')
      .send({ data: 'some updated dope data' });

    logger.debug(`getting resPut - ${JSON.stringify(resPut)}`);
    expect(resPut.statusCode).toBe(404);
    expect(resPut.body.error.message).toEqual(
      'Error updating fragment: Content-type did not match'
    );
  });
});
