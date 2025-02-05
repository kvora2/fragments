// src/routes/api/index.js

/**
 * The main entry-point for the v1 version of the fragments API.
 */
const express = require('express');

// Create a router on which to mount our API endpoints
const router = express.Router();
const { Fragment } = require('../../model/fragment');
// const contentType = require('content-type');

// Support sending various Content-Types on the body up to 5M in size
const rawBody = () =>
  express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      // See if we can parse this content type. If we can, `req.body` will be
      // a Buffer (e.g., `Buffer.isBuffer(req.body) === true`). If not, `req.body`
      // will be equal to an empty Object `{}` and `Buffer.isBuffer(req.body) === false`
      return Fragment.isSupportedType(req);
    },
  });

// Defining route for deleting a fragment based on OwnerID and ID
router.delete('/fragments/:id', require('./delete'));

// Use a raw body parser for POST, which will give a `Buffer` Object or `{}` at `req.body`
// You can use Buffer.isBuffer(req.body) to test if it was parsed by the raw body parser.
router.post('/fragments', rawBody(), require('./post'));

// Define our first route, which will be: GET /v1/fragments
router.get('/fragments', require('./get'));

// Defining route for getting fragment metadata based on ID's
router.get('/fragments/:id/info', require('./get'));

// Defining route for getting fragment converted to extension requested
router.get('/fragments/:id.:ext', require('./get'));

// Defining route for getting fragment data only based on ID's
router.get('/fragments/:id', require('./get'));

// route for updating fragment data based on its ID's
router.put('/fragments/:id', rawBody(), require('./put'));

module.exports = router;
