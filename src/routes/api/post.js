// src/routes/api/post.js
const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const contentType = require('content-type');

//response function
const { createErrorResponse, createSuccessResponse } = require('../../response');

module.exports = async (req, res) => {
  try {
    // Parse the Content-Type header of the request
    const { type } = contentType.parse(req);

    if (Fragment.isSupportedType(type)) {
      // Check if the request body is a Buffer
      if (Buffer.isBuffer(req.body)) {
        // getting current host from requesting url
        process.env.API_URL = 'http://' + req.headers.host;

        // console.log('checking TYPE --', type);
        // creating the instance for req.body we got
        const fragment = new Fragment({
          ownerId: req.user,
          type: type,
          size: req.body.byteLength,
        });

        if (req.body) {
          fragment.setData(Buffer.from(req.body));
        }
        // Save/update the fragment instance
        await fragment.save();

        //adding location url of added fragment in header and setting content-type as well
        res.location(`${process.env.API_URL}/v1/fragments/${fragment.id}`);

        // Send a success response
        res.status(201).json(createSuccessResponse({ fragment: fragment }));
      } else {
        // Request body is not a Buffer
        res.status(400).json(createErrorResponse(400, 'Invalid request Body'));
      }
    } else {
      res.status(415).json(createErrorResponse(415, 'Unsupported media type'));
    }
  } catch (err) {
    // Handle any errors occurring during processing
    logger.error(`POST request Error: ${err}`);
    res.status(500).json(createErrorResponse(500, `Internal Server error: ${err}`));
  }
};
