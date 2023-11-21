// src/routes/api/get.js

const { createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const mdIt = require('markdown-it')();
// const logger = require('../../logger');
// const contentType = require('content-type');

// Getting a list of fragments for the current user
module.exports = async (req, res) => {
  const userID = req.user;
  // getting id/ext from params if there is any in domain
  const { id, ext } = req.params;
  // checking for expand query in domain
  const expand = req.query['expand'] === '1';

  if (id) {
    const info = req.route.path.includes('info');
    const fragmentMeta = await Fragment.byId(userID, id);
    if (!info) {
      //getting specific fragment data
      const fragData = await fragmentMeta.getData();
      var data = Buffer.from(fragData).toString('utf-8');

      res.setHeader('Content-Type', fragmentMeta.type);
      //checking if data can be converted to required format and converting if so
      if (ext === 'html' && fragmentMeta.type.includes('markdown')) {
        data = mdIt.render(data);
        res.setHeader('Content-Type', 'text/html');
      }
      // logger.debug(`getting1 - ${fragmentMeta.type} and ${res.get('Content-Length')}}`); ///////////
      res.status(200).send(data);
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
