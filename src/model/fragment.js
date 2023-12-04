// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');

//making an logger instance to log things
const logger = require('../logger');

// Functions for working with fragment metadata/data using our DB
const {
  writeFragment,
  readFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

class Fragment {
  constructor({
    id = randomUUID(),
    ownerId,
    created = new Date(),
    updated = created,
    type,
    size = 0,
  }) {
    if (!ownerId || !type) {
      throw new Error(`OwnerID and type, both are required!!`);
    } else if (!Number.isInteger(size) || size < 0) {
      throw new Error(`Size must be integer greater than or equal to zero`);
    } else if (!Fragment.isSupportedType(type)) {
      throw new Error(`Invalid fragment type provided`);
    }
    this.id = id;
    this.ownerId = ownerId;
    this.created = created;
    this.updated = updated;
    this.type = type;
    this.size = size;
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    try {
      const fragmentsInfo = listFragments(ownerId, expand);
      return fragmentsInfo;
    } catch (err) {
      logger.error(`byUser Error: ${err}`);
      throw err;
    }
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    try {
      const fragmentInfo = await readFragment(ownerId, id);
      if (!fragmentInfo) {
        throw new Error(`ownerID: ${ownerId} or id: ${id} does not exit in DB`);
      }
      return fragmentInfo;
    } catch (err) {
      logger.error(`byId Error: ${err}`);
      throw err;
    }
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<void>
   */
  static delete(ownerId, id) {
    return deleteFragment(ownerId, id);
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise<void>
   */
  async save() {
    try {
      this.updated = new Date();
      return writeFragment(this);
    } catch (err) {
      logger.error(`saving error: ${err}`);
      throw err;
    }
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  static async getData(ownerID, id) {
    return readFragmentData(ownerID, id);
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise<void>
   */
  async setData(data) {
    try {
      if (data) {
        this.updated = new Date();
        this.size = Buffer.byteLength(data);
        return writeFragmentData(this.ownerId, this.id, data);
      } else {
        throw new Error(`No data provided`);
      }
    } catch (err) {
      logger.error(`setData error: ${err}`);
      throw err;
    }
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    const { type } = contentType.parse(this.type);
    return type.startsWith('text');
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    const supportType = ['text/plain', 'text/markdown', 'text/html', 'application/json'];
    return supportType;
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    const validTypes = ['text/plain', 'text/html', 'text/markdown', 'application/json'];
    const { type } = contentType.parse(value);
    return validTypes.includes(type);
  }
}

module.exports.Fragment = Fragment;
