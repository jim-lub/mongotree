/* jshint esversion: 6 */
const {mongoose} = require('./db');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const {Item} = require('./../models/item');

let newItem = (data) => {
  return new Promise((resolve, reject) => {

    data._id = new ObjectID();
    data.order = 99;

    if (!data.name || !data._id) {reject('Invalid data.');}
    if (!data.parentID) {
      data.parentID = 0;
    } else {
      findParent(data).then((count) => {
        if (count === 0) { data.parentID = 0; }
      }).catch((e) => {
        reject(e);
      });
    }

    let item = new Item(data);

    item.save().then((item) => {
      resolve(item);
    }).catch((e) => {
      reject(e);
    });
  });
};

let findParent = (data) => {
  return new Promise((resolve, reject) => {
    Item.countDocuments({_id: data.parentID}, function (err, count) {
      if(err) {
        reject(0);
      }
      resolve(count);
    });
  });
};

let buildTreeArray = () => {
  return new Promise((resolve, reject) => {
    let array = [];

    let array2 = [
      {name: 'item 1.1.1.2', id: 1112, parent: 111, order: 2},
      {name: 'item 1', id: 1, parent: 0, order: 1},
      {name: 'item 2', id: 2, parent: 0, order: 2},
      {name: 'item 3', id: 3, parent: 0, order: 3},
      {name: 'item 4', id: 4, parent: 0, order: 4},
      {name: 'item 1.1', id: 11, parent: 1, order: 1},
      {name: 'item 1.2', id: 12, parent: 1, order: 2},
      {name: 'item 3.1', id: 31, parent: 3, order: 1},
      {name: 'item 3.2', id: 32, parent: 3, order: 2},
      {name: 'item 1.1.1', id: 111, parent: 11, order: 1},
      {name: 'item 1.1.2', id: 112, parent: 11, order: 2},
      {name: 'item 1.1.1.1', id: 1111, parent: 111, order: 1}
    ];

    Item.find().then((result) => {
      result.forEach((cur) => {
        let obj = {
          name: cur.name,
          id: cur._id,
          parent: cur.parentID,
          order: cur.order
        };
        array.push(obj);
      });
      return array;
    }).then((array) => {
      resolve(array);
    }).catch((e) => {
      reject(e);
    });

  });
};

let recursive = (array, parent, newArray) => {
  return new Promise((resolve, reject) => {

    !function() {
      for (let i = 0; i < array.length; i++) {
        let cur = array[i];
        // console.log(`${cur.name} :: ${i}`);

        if (cur.parent.toString() === parent.toString()) {
          // console.log(`--> ${cur.name}`);
          newArray.push(cur);
          // console.log('--> new recursive starting: <--');

          recursive(array, cur.id, newArray).then((result) => {
            return;
          });
        }
      }
      resolve(newArray);
    }().then((results) => {
      resolve(newArray);
    }).catch((e) => {
      reject(e);
    });

  });
};

module.exports = {
  newItem,
  buildTreeArray,
  recursive
};




















//
