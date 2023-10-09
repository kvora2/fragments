// src/routes/api/post.js
const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const contentType = require('content-type');

//response function
const { createErrorResponse, createSuccessResponse } = require('../../response');

module.exports = async (req, res) => {
  try {
    // Check if the request body is a Buffer
    if (Buffer.isBuffer(req.body)) {
      // Parse the Content-Type header of the request
      const { type } = contentType.parse(req);

      // Check if the parsed content type is supported
      if (Fragment.isSupportedType(type)) {
        // creating the instance for req.body we got
        const fragment = new Fragment({
          ownerId: req.user,
          type: type,
        });

        if (req.body.data) {
          fragment.setData(Buffer.from(req.body.data));
        }
        // Save/update the fragment instance
        await fragment.save();
        // Send a success response
        res.status(201).json(createSuccessResponse({ fragments: [fragment] }));
      } else {
        // Content-Type not supported
        res.status(415).json(createErrorResponse(415, 'Unsupported content-type'));
      }
    } else {
      // Request body is not a Buffer
      res.status(400).json(createErrorResponse(400, 'Invalid request Body'));
    }
  } catch (err) {
    // Handle any errors occurring during processing
    logger.error(`POST request Error: ${err}`);
    res.status(500).json(createErrorResponse(500, `Internal Server error`));
  }
};
