/* jshint esversion: 6 */
const {mongoose} = require('./db-connect');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const {Folder} = require('./../models/folder');
const db = require('./db-actions');

let init = () => {
  return new Promise ((resolve, reject) => {
    fetchFolders().then((result) => {
      sortFolders_recursive(_.sortBy(result, ['order']), [], 0, 0).then((result) => {
        resolve(result);
      });
    });
  });
};

let fetchFolders = () => {
  return new Promise((resolve, reject) => {
    let array = [];

    Folder.find().then((result) => {
      result.forEach((cur) => {
        let obj = {
          _id: cur._id,
          parentID: cur.parentID,
          name: cur.name,
          order: cur.order,
          depth: 0,
          state: 0,
          hasChild: true
        };
        array.push(obj);
      });
      array.forEach((cur) => {
        if(_.findIndex(array, ['parentID', cur._id.toString()]) === -1){ cur.hasChild = false; }
      });
      resolve(array);
    })
    .catch((e) => reject(e));
  });
};

let sortFolders_recursive = (inputArray, outputArray, depth, parentID) => {
  return new Promise((resolve, reject) => {

    (() => {
      depth++;
      inputArray.forEach((cur, i) => {
        if (cur.parentID.toString() === parentID.toString()) {
          cur.depth = depth;
          outputArray.push(cur);
          sortFolders_recursive(inputArray, outputArray, depth, cur._id).then((result) => { return; });
        }
      });
      resolve(outputArray);
    })()
    .then(() => resolve(outputArray))
    .catch((e) => reject(e));
  });
};

module.exports = {
  init
};

// let depth_colorArray = ['9b32fe', '8547f7', '6b5cef', '5075e7', '3889e0', '239dda', '12abd5'];
// let testArray = [
//   {name: 'item 1.1.1.2', id: 1112, parent: 111, order: 2},
//   {name: 'item 1', id: 1, parent: 0, order: 1},
//   {name: 'item 2', id: 2, parent: 0, order: 2},
//   {name: 'item 3', id: 3, parent: 0, order: 3},
//   {name: 'item 4', id: 4, parent: 0, order: 4},
//   {name: 'item 1.1', id: 11, parent: 1, order: 1},
//   {name: 'item 1.2', id: 12, parent: 1, order: 2},
//   {name: 'item 3.1', id: 31, parent: 3, order: 1},
//   {name: 'item 3.2', id: 32, parent: 3, order: 2},
//   {name: 'item 1.1.1', id: 111, parent: 11, order: 1},
//   {name: 'item 1.1.2', id: 112, parent: 11, order: 2},
//   {name: 'item 1.1.1.1', id: 1111, parent: 111, order: 1}
// ];


















//
