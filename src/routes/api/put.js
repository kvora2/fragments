// src/routes/api/put.js

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
// const contentType = require('content-type');
const logger = require('../../logger');

// Getting a list of fragments for the current user
module.exports = async (req, res) => {
  //getting authenticated user ID
  const userID = req.user;
  // getting id/ext from params if there is any in domain
  const { id } = req.params;
  //getting updated fragment
  const fragBody = req.body;

  try {
    logger.info(`Updating Fragment...`);
    // logger.info(`userID: ${userID}, id: ${id}, body: ${fragBody}`);
    //getting fragment instance
    const fragMeta = await Fragment.byId(userID, id);
    // getting content-type of requested data
    const contype = req.headers['content-type'];

    // new fragment type should be same as pre-existed fragment
    if (fragMeta.type != contype) {
      logger.error(
        `Error updating fragment: Content-type did not match (${fragMeta.type} Vs ${contype})`
      );
      throw `Content-type did not match`;
    }

    //setting new fragment
    await fragMeta.setData(fragBody);
    //saving all other info
    await fragMeta.save();

    //success res with meta data
    res.status(200).json(createSuccessResponse({ fragment: fragMeta }));
  } catch (err) {
    logger.error(`Error updating fragment: ${err}`);
    res.status(404).json(createErrorResponse(404, `Error updating fragment: ${err}`));
  }
};
