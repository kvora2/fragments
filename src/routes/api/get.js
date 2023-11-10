// src/routes/api/get.js

const { createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

// Getting a list of fragments for the current user
module.exports = async (req, res) => {
  const id = req.params.id;
  // checking for expand query in domain
  const expand = req.query['expand'] === '1';

  if (id) {
    // logger.debug(`getting1 - ${req.params.id} and ${email}}`);
    const fragmentID = await Fragment.byId(req.user, id);
    const fragData = await fragmentID.getData();
    const data = Buffer.from(fragData).toString('utf-8');
    res.status(200).json(createSuccessResponse({ data }));
  } else if (expand) {
    const fragmentList = await Fragment.byUser(req.user, expand);

    // logger.debug(`getting2 - ${JSON.stringify(fragmentList)}`);
    res.status(200).json(createSuccessResponse({ fragments: [...fragmentList] }));
  } else {
    const fragmentList = await Fragment.byUser(req.user);
    res.status(200).json(createSuccessResponse({ fragments: [...fragmentList] }));
  }
};
