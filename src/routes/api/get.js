// src/routes/api/get.js

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
//for converting md to html
const mdIt = require('markdown-it')();
//for converting html to txt
const { convert } = require('html-to-text');
//for converting json to txt
const { jsonToPlainText } = require('json-to-plain-text');
const sharp = require('sharp');

// Getting a list of fragments for the current user
module.exports = async (req, res) => {
  const userID = req.user;
  // getting id/ext from params if there is any in domain
  const { id, ext } = req.params;
  // checking for expand query in domain
  const expand = req.query['expand'] === '1';

  try {
    if (id) {
      const info = req.route.path.includes('info');
      const fragmentMeta = await Fragment.byId(userID, id);
      logger.info(`check get.js -> ${userID} and ${id}`);
      if (!info) {
        //getting specific fragment data
        const fragData = await fragmentMeta.getData();
        var data;
        if (!fragmentMeta.type.includes('image')) {
          data = Buffer.from(fragData).toString('utf-8');
        } else {
          data = fragData;
        }

        // setting content-type of res based on fragment data type
        res.setHeader('Content-Type', fragmentMeta.type);
        if (fragmentMeta.type)
          if (ext) {
            //checking if data can be converted to required format and converting if so
            //md conversions
            if (fragmentMeta.type.includes('markdown')) {
              //as it is
              if (ext === 'md') {
                // No operations needed
              }
              //html conversion
              else if (ext === 'html') {
                data = mdIt.render(data);
                res.setHeader('Content-Type', 'text/html');
                logger.debug(`convert md to html - ${fragmentMeta.type} and ${data}}`); ///////////
              }
              //txt conversion
              else if (ext === 'txt') {
                //html conversion
                data = mdIt.render(data);
                //txt conversion
                data = convert(data, {
                  wordwrap: false,
                  ignoreHref: true,
                  ignoreImage: true,
                });
                res.setHeader('Content-Type', 'text/plain');
                logger.debug(`convert md to Txt - ${fragmentMeta.type} and ${data}}`); ///////////
              }
            }
            //html conversions
            else if (fragmentMeta.type.includes('html')) {
              //as it is
              if (ext === 'html') {
                // No operations needed
              }
              //txt conversion
              else if (ext === 'txt') {
                //txt conversion
                data = convert(data, {
                  wordwrap: false,
                  ignoreHref: true,
                  ignoreImage: true,
                });
                //getting rid of extra spacing and new lines apart from content
                data = data.trim();
                res.setHeader('Content-Type', 'text/plain');
                logger.debug(`convert html to Txt - ${fragmentMeta.type} and ${data}}`); ///////////
              }
            }
            //json conversions
            else if (fragmentMeta.type.includes('json')) {
              //as it is
              if (ext === 'html') {
                // No operations needed
              }
              //txt conversion
              else if (ext === 'txt') {
                //txt conversion
                // This is optional (options on what to expect as for 'text' returned, when converted)
                const options = {
                  color: false,
                  seperator: ':', // seperate keys and values.
                  spacing: true, // Whether to include spacing before colons or not
                  squareBracketsForArray: false, // Whether to use square brackets for arrays or not
                  doubleQuotesForKeys: false, // Whether to use double quotes for object keys or not
                  doubleQuotesForValues: false, // Whether to use double quotes for string values or not
                };
                data = jsonToPlainText(data, options);
                res.setHeader('Content-Type', 'text/plain');
                logger.debug(`Convert json to Txt - ${fragmentMeta.type} and ${data}}`); ///////////
              }
            } else if (fragmentMeta.type.includes('image')) {
              if (ext == 'png' || ext == 'jpeg' || ext == 'gif' || ext == 'webp') {
                const image = sharp(data);
                const convertedImg = image.toFormat(ext);
                res.setHeader('Content-Type', `image/${ext}`);
                logger.debug(`convert image - ${JSON.stringify(convertedImg)}`);
                res.status(200);
                convertedImg.pipe(res);
              }
            }
          }

        // logger.debug(`getting1 - ${fragmentMeta.type} and ${res.get('Content-Length')}}`); ///////////
        res.status(200).send(data);
      } else {
        logger.info(`check FragmentMETA -> ${JSON.stringify(fragmentMeta)}`);
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
  } catch (err) {
    logger.error(`Error getting fragment: ${err}`);
    res.status(404).json(createErrorResponse(404, err));
  }
};
