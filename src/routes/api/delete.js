// src/routes/api/delete.js

const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');

module.exports = async (req, res) => {
  // getting OwnerID and ID
  const userID = req.user;
  const { id } = req.params;

  try {
    if (id) {
      // Delete fragment
      await Fragment.delete(userID, id);
      res.status(200).json(createSuccessResponse());
    }
  } catch (err) {
    // if any problem while deleting fragment than log enough info
    logger.error(`Error while deleting a fragment ${err}`);
    res.status(404).json(createErrorResponse(404, `Unable to delete fragment: ${err}`));
  }
};
