// src/routes/api/get.js

const { createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

// Getting a list of fragments for the current user
module.exports = async (req, res) => {
  const authHeader = req.headers.authorization;

  // decoding hashed userID
  const encodedCredentials = authHeader.split(' ')[1];
  const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8');
  const email = decodedCredentials.split(':')[0];
  const id = req.params.id;

  if (id) {
    // logger.debug(`getting1 - ${req.params.id} and ${email}}`);
    const fragmentID = await Fragment.byId(email, id);
    const fragData = await fragmentID.getData();
    const data = Buffer.from(fragData).toString('utf-8');
    res.status(200).json(createSuccessResponse({ data }));
  } else if (req.query['expand']) {
    const expand = req.query['expand'] === '1';

    const fragmentList = await Fragment.byUser(req.user, expand);

    // logger.debug(`getting2 - ${JSON.stringify(fragmentList)}`);
    res.status(200).json(createSuccessResponse({ fragments: [...fragmentList] }));
  } else {
    const fragmentList = await Fragment.byUser(req.user);
    res.status(200).json(createSuccessResponse({ fragments: [...fragmentList] }));
  }
};
