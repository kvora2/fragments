// src/routes/api/get.js

const { createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
// const logger = require('../../logger');

// Getting a list of fragments for the current user
module.exports = async (req, res) => {
  const userID = req.user;
  const id = req.params.id;
  // checking for expand query in domain
  const expand = req.query['expand'] === '1';

  if (id) {
    // logger.debug(`getting1 - ${req.params.id} and ${userID}}`);
    const info = req.route.path.includes('info');
    const fragmentMeta = await Fragment.byId(userID, id);
    if (!info) {
      const fragData = await fragmentMeta.getData();
      const data = Buffer.from(fragData).toString('utf-8');
      res.status(200).json(createSuccessResponse({ data }));
    } else {
      res.status(200).json(createSuccessResponse({ fragment: fragmentMeta }));
    }
  } else if (expand) {
    const fragmentList = await Fragment.byUser(userID, expand);

    // logger.debug(`getting2 - ${JSON.stringify(fragmentList)}`);
    res.status(200).json(createSuccessResponse({ fragments: [...fragmentList] }));
  } else {
    const fragmentList = await Fragment.byUser(userID);
    res.status(200).json(createSuccessResponse({ fragments: [...fragmentList] }));
  }
};
