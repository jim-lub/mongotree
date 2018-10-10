/* jshint esversion: 6 */
const {mongoose} = require('./db');
const {ObjectID} = require('mongodb');

const {Item} = require('./../models/item');

let newItem = (data) => {
  return new Promise((resolve, reject) => {

    data._id = new ObjectID();

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

module.exports = {
  newItem
};
