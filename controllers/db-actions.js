/* jshint esversion: 6 */
const {mongoose} = require('./db-connect');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const {Folder} = require('./../models/folder');

let newFolder = (data) => {
  return new Promise((resolve, reject) => {

    data._id = new ObjectID();

    if (!data.name || !data._id) {reject('Invalid data.');}
    if (!data.order) { data.order = 99; }
    if (!data.parentID) {
      data.parentID = 0;
    } else {
      findParent(data).then((count) => {
        if (count === 0) { data.parentID = 0; }
      }).catch((e) => {
        reject(e);
      });
    }

    let folder = new Folder(data);

    folder.save().then((item) => {
      resolve(item);
    }).catch((e) => {
      reject(e);
    });
  });
};

let findParent = (data) => {
  return new Promise((resolve, reject) => {
    Folder.countDocuments({_id: data.parentID}, function (err, count) {
      if(err) {
        reject(0);
      }
      resolve(count);
    });
  });
};

module.exports = {
  newFolder
};
