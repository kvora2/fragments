//making an logger instance to log things
// const logger = require('../logger');

// Functions for working with fragment metadata/data using our DB and instances of db as well
// const logger = require('../../src/logger');
const {
  data,
  metadata,
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  deleteFragment,
  // deleteFragment,
} = require('../../src/model/data/memory/index');

// const { experimentalOverrides } = require('next/dist/server/require-hook');

describe('index functions', () => {
  afterEach(() => {
    data.db = {};
    metadata.db = {};
  });

  // readFragment function testing
  test('readFragment() resolves and returns what we write', () => {
    const fragment = {
      ownerId: 'user1',
      id: '1',
      fragmentData: 'Some Data',
    };
    writeFragment(fragment);
    expect(readFragment(fragment.ownerId, fragment.id)).resolves.toEqual(fragment);
  });

  test('readFragment() throws - expecting key string', () => {
    const fragment = {
      ownerId: 'user1',
      id: '1',
      fragmentData: 'Some Data',
    };
    writeFragment(fragment);
    expect(() => readFragment(undefined, fragment.id)).toThrow();
  });

  test('readFragment() throws - expecting key string', () => {
    const fragment = {
      ownerId: 'user1',
      id: '1',
      fragmentData: 'Some Data',
    };
    writeFragment(fragment);
    expect(() => readFragment(fragment.ownerId, undefined)).toThrow();
  });

  test('readFragment() - providing incorrect fragment id', () => {
    const fragment = {
      ownerId: 'user2',
      id: '1',
      fragmentData: 'FUCK',
    };
    writeFragment(fragment);
    expect(readFragment(fragment.ownerId, '2')).resolves.toBeUndefined();
  });

  //
  //
  //
  //
  //
  // writeFragment function testing
  test('writeFragment() - expecting resolved promise', () => {
    const fragment = {
      ownerId: 'user1',
      id: '1',
      fragmentData: 'Some fragment string',
    };
    expect(writeFragment(fragment)).resolves.toBeUndefined();
  });

  test('writeFragment() - missing ownerId - expecting key string', () => {
    const fragment = {
      id: '1',
      fragmentData: 'Some fragment string',
    };
    expect(() => writeFragment(fragment)).toThrow();
  });

  test('writeFragment() - missing id - expecting key string', () => {
    const fragment = {
      ownerId: 'user1',
      fragmentData: 'Some fragment string',
    };
    expect(() => writeFragment(fragment)).toThrow();
  });

  //
  //
  //
  //
  //
  //readFragmentData function testing
  test('readFragmentData() - expecting resolved promise', () => {
    const data = Buffer.from('Some fragment string');
    const fragment = {
      ownerId: 'user1',
      id: '1',
      fragmentData: data,
    };
    writeFragmentData(fragment.ownerId, fragment.id, fragment.fragmentData);
    expect(readFragmentData(fragment.ownerId, fragment.id)).resolves.toEqual(fragment.fragmentData);
  });

  test('readFragmentData() -  missing ownerID - expecting key string', () => {
    const data = Buffer.from('Some fragment string');
    const fragment = {
      ownerId: 'user1',
      id: '1',
      fragmentData: data,
    };
    writeFragmentData(fragment.ownerId, fragment.id, fragment.fragmentData);
    expect(() => readFragmentData(undefined, fragment.id)).toThrow();
  });

  test('readFragmentData() -  missing ID - expecting key string', () => {
    const data = Buffer.from('Some fragment string');
    const fragment = {
      ownerId: 'user1',
      id: '1',
      fragmentData: data,
    };
    writeFragmentData(fragment.ownerId, fragment.id, fragment.fragmentData);
    expect(() => readFragmentData(fragment.ownerId, undefined)).toThrow();
  });

  test('readFragmentData() -  providing incorrect fragment ID', () => {
    const data = Buffer.from('Some fragment string');
    const fragment = {
      ownerId: 'user1',
      id: '1',
      fragmentData: data,
    };
    writeFragmentData(fragment.ownerId, fragment.id, fragment.fragmentData);
    expect(readFragmentData(fragment.ownerId, '2')).resolves.toBeUndefined();
  });

  //
  //
  //
  //
  //
  //writeFragmentData function testing
  test('writeFragmentData() - expecting resolved promise', () => {
    const data = Buffer.from('SHit');
    const fragment = {
      ownerId: 'user2',
      id: '1',
      fragmentData: data,
    };
    expect(
      writeFragmentData(fragment.ownerId, fragment.id, fragment.fragmentData)
    ).resolves.toBeUndefined();
  });

  test('writeFragmentData() - missing ownerId - expecting key string', () => {
    const data = Buffer.from('Some fragment string');
    const fragment = {
      ownerId: 'user1',
      id: '1',
      fragmentData: data,
    };
    expect(() => writeFragmentData(undefined, fragment.id, fragment.fragmentData)).toThrow();
  });

  test('writeFragmentData() - missing id - expecting key string', () => {
    const data = Buffer.from('Some fragment string');
    const fragment = {
      ownerId: 'user1',
      id: '1',
      fragmentData: data,
    };
    expect(() => writeFragmentData(fragment.ownerId, undefined, fragment.fragmentData)).toThrow();
  });

  //
  //
  //
  //
  //
  //deleteFragment function testing
  test('deleteFragment() - expecting data to be deleted', () => {
    const data = Buffer.from('Some string data');
    const fragment = {
      ownerId: 'user5',
      id: '5',
      fragmentData: data,
    };
    // filling in some data
    writeFragmentData(fragment.ownerId, fragment.id, fragment.fragmentData);
    writeFragment(fragment);
    // making sure its there
    expect(readFragmentData(fragment.ownerId, fragment.id)).resolves.toEqual(fragment.fragmentData);
    expect(readFragment(fragment.ownerId, fragment.id)).resolves.toEqual(fragment);
    // expecting it to get deleted successfully
    expect(deleteFragment(fragment.ownerId, fragment.id)).resolves.toEqual([]);
  });

  test('deleteFragment() - expecting to get key string', () => {
    const data = Buffer.from('Some string data');
    const fragment = {
      ownerId: 'user5',
      id: '5',
      fragmentData: data,
    };
    // filling in some data
    writeFragmentData(fragment.ownerId, fragment.id, fragment.fragmentData);
    writeFragment(fragment);
    expect(() => deleteFragment(undefined, fragment.id)).toThrow;
  });

  test('deleteFragment() - incorrect ownerID - expecting to get key string', () => {
    const data = Buffer.from('Some string data');
    const fragment = {
      ownerId: 'user5',
      id: '5',
      fragmentData: data,
    };
    // filling in some data
    writeFragmentData(fragment.ownerId, fragment.id, fragment.fragmentData);
    writeFragment(fragment);
    expect(() => deleteFragment('user2', fragment.id)).toThrow;
  });

  test('deleteFragment() - incorrect ownerID - expecting to get key string', () => {
    const data = Buffer.from('Some string data');
    const fragment = {
      ownerId: 'user5',
      id: '5',
      fragmentData: data,
    };
    // filling in some data
    writeFragmentData(fragment.ownerId, fragment.id, fragment.fragmentData);
    writeFragment(fragment);
    expect(() => deleteFragment(fragment.ownerId, '1')).toThrow;
  });
});
