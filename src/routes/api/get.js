// src/routes/api/get.js

const { createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  const fragmentList = await Fragment.byUser(req.user);
  // TODO: this is just a placeholder to get something working...
  res.status(200).json(createSuccessResponse({ fragments: fragmentList }));
};
